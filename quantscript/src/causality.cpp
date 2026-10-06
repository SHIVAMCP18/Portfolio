#include "causality.hpp"

#include <algorithm>
#include <map>
#include <sstream>

#include "symtab.hpp"

const SeriesInfo* CausalityResult::find(const std::string& name) const {
    for (auto& s : series)
        if (s.sym->name == name) return &s;
    return nullptr;
}

void collectReads(Node* e, std::vector<Read>& out) {
    if (!e) return;
    if (e->kind == NK::Index && e->a && e->a->kind == NK::Ident && e->ann.sym && e->b->ann.constValue) {
        Read r;
        r.sym = e->ann.sym;
        r.d = static_cast<long>(*e->b->ann.constValue);
        r.reach = r.d;
        r.need = r.d + 1;
        r.at = e;
        r.text = exprText(e);
        r.needText = r.text;
        out.push_back(r);
        return;
    }
    if (e->kind == NK::Call && e->ann.sym && !e->list.empty() && e->list[0]->kind == NK::Ident &&
        (e->ann.sym->kind == SymKind::Series || e->ann.sym->kind == SymKind::BuiltinSeries)) {
        const std::string& f = e->name;
        if (f == "crossover" || f == "crossunder") {
            for (int i = 0; i < 2; ++i) {
                Read r;
                r.sym = e->list[static_cast<size_t>(i)]->ann.sym;
                if (!r.sym) continue;
                r.d = 0;
                r.reach = 1;
                r.need = 2;
                r.at = e;
                r.text = exprText(e);
                r.needText = f + " reads " + r.sym->name + "[1]";
                out.push_back(r);
            }
            return;
        }
        long n = static_cast<long>(e->num);
        Read r;
        r.sym = e->ann.sym;
        r.d = 0;
        r.at = e;
        r.text = exprText(e);
        std::string sig = f + "(" + r.sym->name + "," + std::to_string(n) + ")";
        if (f == "ema") {
            r.reach = 0;
            r.need = 1;
            r.needText = sig + " reads " + r.sym->name + "[0]";
        } else if (f == "highest" || f == "lowest") {
            r.reach = n - 1;
            r.need = n;
            r.needText = sig + " reads " + r.sym->name + "[" + std::to_string(n - 1) + "]";
        } else {
            r.reach = n - 1;
            r.need = n + 1;
            r.needText = sig + " reads " + r.sym->name + "[" + std::to_string(n) + "]";
        }
        out.push_back(r);
        return;
    }
    collectReads(e->a, out);
    collectReads(e->b, out);
    collectReads(e->c, out);
    for (Node* c : e->list) collectReads(c, out);
}

static void collectStmtReads(Node* s, std::vector<Read>& out) {
    if (!s) return;
    switch (s->kind) {
        case NK::Block: for (Node* c : s->list) collectStmtReads(c, out); break;
        case NK::If:
            collectReads(s->a, out);
            collectStmtReads(s->b, out);
            collectStmtReads(s->c, out);
            break;
        case NK::Let: case NK::Assign: case NK::Buy: case NK::Sell: collectReads(s->a, out); break;
        default: break;
    }
}

bool Causality::run() {
    std::map<Symbol*, SeriesInfo*> info;
    res_.series.reserve(sr_.fields.size() + sr_.seriesTopo.size());
    for (Symbol* f : sr_.fields) {
        SeriesInfo si;
        si.sym = f;
        si.isField = true;
        si.phase = f->phase;
        si.phaseReason = f->name == "open" ? "known when the bar opens" : "known when the bar closes";
        res_.series.push_back(si);
    }
    for (Symbol* s : sr_.seriesTopo) {
        SeriesInfo si;
        si.sym = s;
        res_.series.push_back(si);
    }
    for (auto& si : res_.series) info[si.sym] = &si;

    auto stampFor = [&](const Read& r) {
        Stamp st;
        st.valid = true;
        st.d = r.d;
        st.phase = info.count(r.sym) ? info[r.sym]->phase : r.sym->phase;
        return st;
    };
    auto bump = [&](const Read& r) {
        SeriesInfo* si = info.count(r.sym) ? info[r.sym] : nullptr;
        if (si && r.need > si->bufsize) {
            si->bufsize = r.need;
            si->bufReason = r.needText;
        }
    };
    auto noteWarmup = [&](const Read& r, long depth) {
        long w = r.reach + depth;
        if (w > res_.warmup) {
            res_.warmup = w;
            res_.warmupReason = r.text + " needs " + std::to_string(w) + " earlier bar(s)";
        }
    };

    // Series phases and depths, in topological order.
    for (Symbol* s : sr_.seriesTopo) {
        SeriesInfo& si = *info[s];
        Node* decl = s->decl;
        std::vector<Read> reads;
        collectReads(decl->a, reads);
        if (decl->b) collectReads(decl->b, reads);
        si.phase = 'O';
        si.phaseReason = "uses only open[0] and earlier bars";
        long depth = 0;
        for (auto& r : reads) {
            bump(r);
            if (r.sym == s) continue;  // recursive self read (k >= 1, has init)
            SeriesInfo* x = info[r.sym];
            if (r.d == 0 && x->phase == 'C' && si.phase != 'C') {
                si.phase = 'C';
                si.phaseReason = "reads " + r.text + ", known only at bar close";
            }
            depth = std::max(depth, r.reach + x->depth);
        }
        si.depth = depth;
        s->phase = si.phase;
        s->depth = depth;
        for (auto& r : reads) {
            r.at->ann.stamp = stampFor(r);
            ReadCheck c;
            c.line = r.at->line;
            c.col = r.at->col;
            c.read = r.text;
            c.series = r.sym->name;
            c.d = r.d;
            c.phase = r.at->ann.stamp.phase;
            c.at = si.phase;
            c.context = "series " + s->name;
            res_.checks.push_back(c);
            if (r.sym != s) noteWarmup(r, info[r.sym]->depth);
        }
    }

    // Handlers.
    for (int h = 0; h < 2; ++h) {
        Node* hd = sr_.handlers[h];
        if (!hd) continue;
        char at = h == 0 ? 'O' : 'C';
        std::vector<Read> reads;
        collectStmtReads(hd->a, reads);
        bool readsCurrent = false;
        for (auto& r : reads) {
            bump(r);
            SeriesInfo* x = info[r.sym];
            Stamp st = stampFor(r);
            r.at->ann.stamp = st;
            auto rank = [](char ph) { return ph == 'O' ? 0 : 1; };  // O < C
            bool ok = st.d >= 1 || rank(st.phase) <= rank(at);
            readsCurrent |= st.d == 0;
            ReadCheck c;
            c.line = r.at->line;
            c.col = r.at->col;
            c.read = r.text;
            c.series = r.sym->name;
            c.d = st.d;
            c.phase = st.phase;
            c.at = at;
            c.context = h == 0 ? "on bar_open" : "on bar_close";
            c.ok = ok;
            if (!ok) {
                c.code = "E502";
                std::string what = x->isField ? "the current bar's " + r.sym->name + " is only known when the bar closes"
                                              : "series `" + r.sym->name + "` is computed at bar close (it " + x->phaseReason + ")";
                int len = r.at->sline == r.at->eline ? r.at->ecol - r.at->scol : 1;
                d_.error("E502", r.at->line, r.at->col, "`" + r.text + "` is not available in `on bar_open`: " + what)
                    .note("the read has stamp (0,C) but the handler runs at (t,O); orders from `on bar_open` fill at open[0], "
                          "so the fill would use information not yet available")
                    .withHint(r.at->kind == NK::Index ? "use `" + r.sym->name + "[1]` (the previous bar) or move this rule to `on bar_close`"
                                                      : "move this rule to `on bar_close`, or aggregate a phase-O series such as `open`")
                    .caret(std::max(1, len));
            }
            res_.checks.push_back(c);
            noteWarmup(r, x->depth);
        }
        if (!readsCurrent)
            d_.warning("W604", hd->line, hd->col,
                       std::string("handler `on ") + (h == 0 ? "bar_open" : "bar_close") + "` reads nothing from the current bar")
                .note("every value it uses was already known on the previous bar (suspiciously static)")
                .withHint("this is legal, but double-check that the rule reacts to new data")
                .caret(2);
    }
    for (auto& si : res_.series) {
        si.sym->bufsize = si.bufsize;
        si.sym->bufReason = si.bufReason;
    }
    return d_.errorCount() == 0;
}


Json Causality::toJson() const {
    Json o = Json::object();
    o.set("warmup", res_.warmup);
    o.set("warmupReason", res_.warmupReason);
    Json ser = Json::array();
    for (auto& s : res_.series) {
        Json j = Json::object();
        j.set("name", s.sym->name);
        j.set("field", s.isField);
        j.set("phase", std::string(1, s.phase));
        j.set("phaseReason", s.phaseReason);
        j.set("depth", s.depth);
        j.set("bufsize", s.bufsize);
        j.set("bufReason", s.bufReason);
        ser.push(j);
    }
    o.set("series", ser);
    Json checks = Json::array();
    for (auto& c : res_.checks) {
        Json j = Json::object();
        j.set("line", c.line);
        j.set("col", c.col);
        j.set("read", c.read);
        j.set("series", c.series);
        Json st = Json::array();
        st.push(c.d);
        st.push(std::string(1, c.phase));
        j.set("stamp", st);
        j.set("handler", std::string(1, c.at));
        j.set("context", c.context);
        j.set("ok", c.ok);
        if (!c.code.empty()) j.set("code", c.code);
        checks.push(j);
    }
    o.set("checks", checks);
    return o;
}

std::string Causality::toText() const {
    std::ostringstream os;
    os << "WARMUP = " << res_.warmup;
    if (!res_.warmupReason.empty()) os << "  (" << res_.warmupReason << ")";
    os << "\n";
    os << "Series            Phase  Depth  Bufsize  Why\n";
    for (auto& s : res_.series) {
        if (s.isField && s.bufsize == 0) continue;
        std::string n = s.sym->name;
        n.resize(std::max<size_t>(n.size(), 17), ' ');
        os << n << " " << s.phase << "      " << s.depth << "      " << s.bufsize << "        " << s.phaseReason << "\n";
    }
    os << "Reads:\n";
    for (auto& c : res_.checks)
        os << "  " << c.line << ":" << c.col << "  " << c.read << "  stamp=(" << c.d << "," << c.phase << ") in " << c.context
           << (c.ok ? "  ok" : "  ILLEGAL " + c.code) << "\n";
    return os.str();
}
