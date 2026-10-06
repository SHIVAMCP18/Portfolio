#include "regalloc.hpp"

#include <algorithm>
#include <functional>
#include <set>
#include <sstream>

#include "cfg.hpp"
#include "dataflow.hpp"

std::string RegAllocResult::locName(int t) const {
    auto it = loc.find(t);
    if (it == loc.end()) return "/*t" + std::to_string(t) + "*/";
    const Loc& l = it->second;
    if (l.spilled) return std::string(l.cls == 'B' ? "bs[" : "fs[") + std::to_string(l.idx) + "]";
    return std::string(l.cls == 'B' ? "b" : "r") + std::to_string(l.idx);
}

namespace {

struct Graph {
    std::map<int, std::set<int>> adj;
    void node(int a) { adj[a]; }
    void edge(int a, int b) {
        if (a == b) return;
        adj[a].insert(b);
        adj[b].insert(a);
    }
};

struct FuncAlloc {
    const TacProgram& P;
    const Function& F;
    int K, KB;
    Json& events;
    std::map<int, Loc>& loc;
    RAFunc& info;

    Graph g;
    std::map<int, int> cost;
    std::map<int, std::pair<int, int>> range;
    std::map<int, int> rep;  // union-find for coalescing

    std::string text;

    int find(int x) {
        while (rep.count(x) && rep[x] != x) x = rep[x];
        return x;
    }
    char cls(int t) const { return P.temps[static_cast<size_t>(t)].cls; }
    int kOf(int t) const { return cls(t) == 'B' ? KB : K; }
    void ev(const std::string& op, int node, int color = -1, int other = -1) {
        Json e = Json::object();
        e.set("func", F.name);
        e.set("op", op);
        e.set("node", "t" + std::to_string(node));
        if (color >= 0) e.set("color", color);
        if (other >= 0) e.set("with", "t" + std::to_string(other));
        events.push(e);
    }

    void build() {
        CFG cfg = buildCFG(F);
        auto lv = liveness(F, cfg);
        auto lo = liveOutPerInstr(F, cfg, lv);
        std::vector<int> uses;
        auto touch = [&](int t, int i) {
            g.node(t);
            rep[t] = t;
            auto it = range.find(t);
            if (it == range.end()) range[t] = {i, i};
            else { it->second.first = std::min(it->second.first, i); it->second.second = std::max(it->second.second, i); }
        };
        for (size_t i = 0; i < F.code.size(); ++i) {
            const Instr& in = F.code[i];
            int ii = static_cast<int>(i);
            instrUses(in, uses);
            for (int u : uses) { touch(u, ii); cost[u]++; }
            for (int t : lo[i]) touch(t, ii);
            if (in.dst < 0) continue;
            touch(in.dst, ii);
            cost[in.dst]++;
            for (int t : lo[i]) {
                if (t == in.dst || cls(t) != cls(in.dst)) continue;
                if (in.op == Op::COPY && in.a.isTemp() && in.a.t == t) continue;  // move: no interference
                g.edge(in.dst, t);
            }
        }
    }

    int significant(const std::set<int>& ns, int k) {
        int c = 0;
        for (int n : ns) c += static_cast<int>(g.adj[n].size()) >= k;
        return c;
    }

    void coalesce() {
        bool again = true;
        while (again) {
            again = false;
            for (const Instr& in : F.code) {
                if (in.op != Op::COPY || !in.a.isTemp() || in.dst < 0) continue;
                int a = find(in.dst), b = find(in.a.t);
                if (a == b || cls(a) != cls(b) || g.adj[a].count(b)) continue;
                std::set<int> uni = g.adj[a];
                uni.insert(g.adj[b].begin(), g.adj[b].end());
                if (significant(uni, kOf(a)) >= kOf(a)) continue;  // Briggs test
                int keep = std::min(a, b), drop = std::max(a, b);
                for (int n : g.adj[drop]) {
                    g.adj[n].erase(drop);
                    g.edge(keep, n);
                }
                g.adj.erase(drop);
                rep[drop] = keep;
                cost[keep] += cost[drop];
                range[keep].first = std::min(range[keep].first, range[drop].first);
                range[keep].second = std::max(range[keep].second, range[drop].second);
                ev("coalesce", keep, -1, drop);
                again = true;
            }
        }
    }

    // Simplify / select with optimistic spilling; re-run without spilled nodes.
    void color(std::map<int, int>& colors, std::set<int>& spilled) {
        std::set<int> active;
        for (auto& [n, ns] : g.adj) active.insert(n);
        for (;;) {
            ++info.rounds;
            std::set<int> work = active;
            for (int s : spilled) work.erase(s);
            std::map<int, int> deg;
            for (int n : work) {
                int d = 0;
                for (int m : g.adj[n]) d += work.count(m) ? 1 : 0;
                deg[n] = d;
            }
            std::vector<int> stack;
            std::set<int> left = work;
            while (!left.empty()) {
                int pick = -1;
                for (int n : left)
                    if (deg[n] < kOf(n)) { pick = n; break; }
                if (pick >= 0) {
                    ev("simplify", pick);
                } else {
                    double best = 1e300;
                    for (int n : left) {
                        double c = static_cast<double>(cost[n]) / std::max(1, deg[n]);
                        if (c < best) { best = c; pick = n; }
                    }
                    ev("spill_candidate", pick);
                }
                stack.push_back(pick);
                left.erase(pick);
                for (int m : g.adj[pick])
                    if (left.count(m)) deg[m]--;
            }
            colors.clear();
            std::set<int> actual;
            while (!stack.empty()) {
                int n = stack.back();
                stack.pop_back();
                std::set<int> used;
                for (int m : g.adj[n])
                    if (colors.count(m)) used.insert(colors[m]);
                int c = 0;
                while (used.count(c)) ++c;
                if (c < kOf(n)) {
                    colors[n] = c;
                    ev("select", n, c);
                } else {
                    actual.insert(n);
                    ev("spill", n);
                }
            }
            if (actual.empty()) return;
            spilled.insert(actual.begin(), actual.end());
            Json e = Json::object();
            e.set("func", F.name);
            e.set("op", "rerun");
            e.set("node", "");
            events.push(e);
        }
    }

    void run(Json& nodesOut, Json& edgesOut, std::map<std::string, int>& nodeIndex) {
        build();
        std::map<int, std::set<int>> orig = g.adj;
        coalesce();
        std::map<int, int> colors;
        std::set<int> spilled;
        color(colors, spilled);
        // Spill slots: greedy coloring of the spilled nodes (unbounded colors).
        std::map<int, int> slot;
        for (int s : spilled) {
            std::set<int> used;
            for (int m : g.adj[s])
                if (slot.count(m) && cls(m) == cls(s)) used.insert(slot[m]);
            int c = 0;
            while (used.count(c)) ++c;
            slot[s] = c;
            if (cls(s) == 'B') info.bspill = std::max(info.bspill, c + 1);
            else info.fspill = std::max(info.fspill, c + 1);
        }
        for (auto& [t, ns] : orig) {
            int r = find(t);
            Loc l;
            l.cls = cls(t);
            if (spilled.count(r)) { l.spilled = true; l.idx = slot[r]; }
            else {
                l.idx = colors[r];
                if (l.cls == 'B') info.bregs = std::max(info.bregs, l.idx + 1);
                else info.fregs = std::max(info.fregs, l.idx + 1);
            }
            loc[t] = l;
        }
        for (auto& [t, ns] : orig) {
            int r = find(t);
            Json n = Json::object();
            n.set("id", "t" + std::to_string(t));
            n.set("func", F.name);
            n.set("cls", std::string(1, cls(t)));
            Json lr = Json::array();
            lr.push(range[t].first);
            lr.push(range[t].second);
            n.set("live", lr);
            n.set("cost", cost[t]);
            n.set("degree", static_cast<long>(ns.size()));
            n.set("rep", "t" + std::to_string(r));
            n.set("spilled", spilled.count(r) > 0);
            n.set("color", spilled.count(r) ? Json(-1) : Json(colors[r]));
            if (spilled.count(r)) n.set("slot", slot[r]);
            nodeIndex["t" + std::to_string(t)] = static_cast<int>(nodesOut.size());
            nodesOut.push(n);
        }
        text += F.name + " interference graph:\n";
        for (auto& [t, ns] : orig) {
            text += "  t" + std::to_string(t) + " (" + std::string(1, cls(t)) + ", cost " + std::to_string(cost[t]) + ") --";
            for (int m : ns) text += " t" + std::to_string(m);
            text += "\n";
        }
        for (auto& [t, ns] : orig)
            for (int m : ns)
                if (t < m) {
                    Json e = Json::array();
                    e.push(nodeIndex["t" + std::to_string(t)]);
                    e.push(nodeIndex["t" + std::to_string(m)]);
                    edgesOut.push(e);
                }
    }
};

}  // namespace

RegAllocResult allocateRegisters(const TacProgram& p, int K, int KB) {
    RegAllocResult r;
    r.K = K;
    r.KB = KB;
    Json nodes = Json::array(), edges = Json::array(), events = Json::array();
    std::map<std::string, int> idx;
    std::string graphs;
    for (int f = 0; f < 2; ++f) {
        r.funcs[f].name = p.funcs[f].name;
        FuncAlloc fa{p, p.funcs[f], K, KB, events, r.loc, r.funcs[f], {}, {}, {}, {}, {}};
        fa.run(nodes, edges, idx);
        graphs += fa.text;
    }
    Json colors = Json::object(), spilled = Json::array();
    for (auto& [t, l] : r.loc) {
        if (l.spilled) spilled.push("t" + std::to_string(t));
        else colors.set("t" + std::to_string(t), l.idx);
    }
    r.json = Json::object();
    r.json.set("K", K);
    r.json.set("KB", KB);
    r.json.set("nodes", nodes);
    r.json.set("edges", edges);
    r.json.set("order", events);
    r.json.set("colors", colors);
    r.json.set("spilled", spilled);
    Json fs = Json::array();
    for (auto& f : r.funcs) {
        Json o = Json::object();
        o.set("name", f.name);
        o.set("fregs", f.fregs);
        o.set("bregs", f.bregs);
        o.set("fspill", f.fspill);
        o.set("bspill", f.bspill);
        o.set("rounds", f.rounds);
        fs.push(o);
    }
    r.json.set("funcs", fs);

    std::ostringstream os;
    os << "Register allocation: K(F)=" << K << " K(B)=" << KB << "\n";
    for (auto& f : r.funcs)
        os << "  " << f.name << ": " << f.fregs << " F reg(s), " << f.bregs << " B reg(s), " << f.fspill << " F spill slot(s), "
           << f.bspill << " B spill slot(s), " << f.rounds << " coloring round(s)\n";
    os << graphs << "Assignment:\n";
    for (auto& [t, l] : r.loc) os << "  t" << t << " -> " << r.locName(t) << "\n";
    r.text = os.str();
    return r;
}
