#include "dataflow.hpp"

#include <cstdio>

DFResult<TempSet> liveness(const Function& f, const CFG& g) {
    std::vector<int> uses;
    auto xfer = [&](int b, const TempSet& out) {
        TempSet live = out;
        const Block& B = g.blocks[static_cast<size_t>(b)];
        for (int i = B.last; i >= B.first; --i) {
            const Instr& in = f.code[static_cast<size_t>(i)];
            if (in.dst >= 0) live.erase(in.dst);
            instrUses(in, uses);
            for (int u : uses) live.insert(u);
        }
        return live;
    };
    auto meet = [](const TempSet& a, const TempSet& b) {
        TempSet r = a;
        r.insert(b.begin(), b.end());
        return r;
    };
    return solveDataflow<TempSet>(g, false, TempSet(), TempSet(), meet, xfer);
}

std::vector<TempSet> liveOutPerInstr(const Function& f, const CFG& g, const DFResult<TempSet>& lv) {
    std::vector<TempSet> res(f.code.size());
    std::vector<int> uses;
    for (auto& B : g.blocks) {
        TempSet live = lv.out[static_cast<size_t>(B.id)];
        for (int i = B.last; i >= B.first; --i) {
            const Instr& in = f.code[static_cast<size_t>(i)];
            res[static_cast<size_t>(i)] = live;
            if (in.dst >= 0) live.erase(in.dst);
            instrUses(in, uses);
            for (int u : uses) live.insert(u);
        }
    }
    return res;
}

DFResult<std::set<int>> reachingDefs(const Function& f, const CFG& g) {
    std::map<int, std::vector<int>> defsOf;
    for (size_t i = 0; i < f.code.size(); ++i)
        if (f.code[i].dst >= 0) defsOf[f.code[i].dst].push_back(static_cast<int>(i));
    auto xfer = [&](int b, const std::set<int>& in) {
        std::set<int> s = in;
        const Block& B = g.blocks[static_cast<size_t>(b)];
        for (int i = B.first; i <= B.last; ++i) {
            const Instr& ins = f.code[static_cast<size_t>(i)];
            if (ins.dst < 0) continue;
            for (int d : defsOf[ins.dst]) s.erase(d);
            s.insert(i);
        }
        return s;
    };
    auto meet = [](const std::set<int>& a, const std::set<int>& b) {
        std::set<int> r = a;
        r.insert(b.begin(), b.end());
        return r;
    };
    return solveDataflow<std::set<int>>(g, true, std::set<int>(), std::set<int>(), meet, xfer);
}

std::vector<std::set<int>> reachingPerInstr(const Function& f, const CFG& g, const DFResult<std::set<int>>& rd) {
    std::map<int, std::vector<int>> defsOf;
    for (size_t i = 0; i < f.code.size(); ++i)
        if (f.code[i].dst >= 0) defsOf[f.code[i].dst].push_back(static_cast<int>(i));
    std::vector<std::set<int>> res(f.code.size());
    for (auto& B : g.blocks) {
        std::set<int> s = rd.in[static_cast<size_t>(B.id)];
        for (int i = B.first; i <= B.last; ++i) {
            res[static_cast<size_t>(i)] = s;
            const Instr& ins = f.code[static_cast<size_t>(i)];
            if (ins.dst < 0) continue;
            for (int d : defsOf[ins.dst]) s.erase(d);
            s.insert(i);
        }
    }
    return res;
}

static std::string opKey(const Opnd& o) {
    if (o.isTemp()) return "t" + std::to_string(o.t);
    if (o.isConst()) {
        char buf[40];
        std::snprintf(buf, sizeof buf, "#%.17g", o.c);
        return buf;
    }
    return "_";
}

bool cseKey(const Instr& in, std::string& key, std::vector<int>& temps, std::vector<std::string>& reads) {
    temps.clear();
    reads.clear();
    if (!opHasDst(in.op) || in.op == Op::COPY) return false;
    std::string a = opKey(in.a), b = opKey(in.b), c = opKey(in.c);
    if (opIsCommutative(in.op) && b < a) std::swap(a, b);
    key = std::string(opName(in.op)) + " " + a + " " + b + " " + c + " " + in.sym + " " + in.sym2 + " " +
          std::to_string(in.k) + " " + std::to_string(in.n);
    for (const Opnd* o : {&in.a, &in.b, &in.c})
        if (o->isTemp()) temps.push_back(o->t);
    switch (in.op) {
        case Op::HIST: case Op::ROLLMEAN: case Op::ROLLSUM: case Op::ROLLSTD: case Op::ROLLMAX: case Op::ROLLMIN:
            reads.push_back("$" + in.sym);
            break;
        case Op::SLOAD: reads.push_back("@" + in.sym); break;
        case Op::ALOAD: case Op::EMA: reads.push_back("&" + in.sym); break;
        case Op::RSTD: reads.push_back("&" + in.sym); reads.push_back("&" + in.sym2); break;
        case Op::WMAX_GET: case Op::WMIN_GET: reads.push_back("&" + in.sym); reads.push_back("$" + in.sym2); break;
        case Op::BARS_GT: reads.push_back("bars"); break;
        default: break;
    }
    return true;
}

std::vector<std::string> writesOf(const Instr& in) {
    switch (in.op) {
        case Op::SPUSH: return {"$" + in.sym};
        case Op::SSTORE: return {"@" + in.sym};
        case Op::EMA_UPD: case Op::RSUM_UPD: case Op::RSQ_UPD: case Op::WMAX_UPD: case Op::WMIN_UPD:
            return {"&" + in.sym};
        case Op::TICK: return {"bars"};
        default: return {};
    }
}

void availStep(const Instr& in, AvailSet& s) {
    if (s.top) return;  // unreachable code: leave as "everything"
    // Kill on memory writes.
    for (const std::string& w : writesOf(in)) {
        for (auto it = s.m.begin(); it != s.m.end();) {
            bool hit = std::find(it->second.reads.begin(), it->second.reads.end(), w) != it->second.reads.end();
            it = hit ? s.m.erase(it) : std::next(it);
        }
    }
    // Store-to-load forwarding: after SPUSH $s, a  the value of HIST $s, 0 is a.
    if ((in.op == Op::SPUSH || in.op == Op::SSTORE) && in.a.isTemp()) {
        Instr ld;
        ld.op = in.op == Op::SPUSH ? Op::HIST : Op::SLOAD;
        ld.sym = in.sym;
        ld.k = 0;
        std::string key;
        AvailEntry e;
        cseKey(ld, key, e.temps, e.reads);
        e.holder = in.a.t;
        e.temps.push_back(in.a.t);
        s.m[key] = e;
    }
    if (in.dst < 0) return;
    int d = in.dst;
    for (auto it = s.m.begin(); it != s.m.end();) {
        bool hit = it->second.holder == d || std::find(it->second.temps.begin(), it->second.temps.end(), d) != it->second.temps.end();
        it = hit ? s.m.erase(it) : std::next(it);
    }
    std::string key;
    AvailEntry e;
    if (cseKey(in, key, e.temps, e.reads) && std::find(e.temps.begin(), e.temps.end(), d) == e.temps.end()) {
        e.holder = d;
        if (!s.m.count(key)) s.m[key] = e;
    }
}

DFResult<AvailSet> availableExprs(const Function& f, const CFG& g) {
    auto xfer = [&](int b, const AvailSet& in) {
        AvailSet s = in;
        const Block& B = g.blocks[static_cast<size_t>(b)];
        for (int i = B.first; i <= B.last; ++i) availStep(f.code[static_cast<size_t>(i)], s);
        return s;
    };
    auto meet = [](const AvailSet& a, const AvailSet& b) {
        if (a.top) return b;
        if (b.top) return a;
        AvailSet r;
        r.top = false;
        for (auto& [k, e] : a.m) {
            auto it = b.m.find(k);
            if (it != b.m.end() && it->second.holder == e.holder) r.m[k] = e;
        }
        return r;
    };
    AvailSet entry;
    entry.top = false;
    return solveDataflow<AvailSet>(g, true, entry, AvailSet(), meet, xfer);
}
