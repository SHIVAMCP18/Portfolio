#include "opt.hpp"

#include <cmath>
#include <functional>
#include <map>
#include <optional>
#include <set>
#include <sstream>

#include "cfg.hpp"
#include "dataflow.hpp"
#include "irgen.hpp"

namespace {

int gSweeps = 0;  // max data-flow sweeps seen in the current pass

void noteSweeps(int s) { gSweeps = std::max(gSweeps, s); }

void compact(Function& f) {
    std::vector<Instr> out;
    out.reserve(f.code.size());
    for (auto& in : f.code)
        if (in.op != Op::NOP) out.push_back(in);
    f.code.swap(out);
}

std::map<int, int> defCounts(const Function& f) {
    std::map<int, int> c;
    for (auto& in : f.code)
        if (in.dst >= 0) c[in.dst]++;
    return c;
}

std::map<int, int> useCounts(const Function& f) {
    std::map<int, int> c;
    std::vector<int> u;
    for (auto& in : f.code) {
        instrUses(in, u);
        for (int t : u) c[t]++;
    }
    return c;
}

// temp -> instruction index, for temporaries with exactly one definition.
std::map<int, int> singleDefs(const Function& f) {
    auto dc = defCounts(f);
    std::map<int, int> r;
    for (size_t i = 0; i < f.code.size(); ++i)
        if (f.code[i].dst >= 0 && dc[f.code[i].dst] == 1) r[f.code[i].dst] = static_cast<int>(i);
    return r;
}

std::map<int, double> singleConsts(const Function& f) {
    std::map<int, double> r;
    for (auto& [t, i] : singleDefs(f)) {
        const Instr& in = f.code[static_cast<size_t>(i)];
        if (in.op == Op::CONST && in.a.isConst()) r[t] = in.a.c;
    }
    return r;
}

std::optional<double> cval(const Opnd& o, const std::map<int, double>& km) {
    if (o.isConst()) return o.c;
    if (o.isTemp()) {
        auto it = km.find(o.t);
        if (it != km.end()) return it->second;
    }
    return std::nullopt;
}

void makeConst(Instr& in, double v) {
    in.op = Op::CONST;
    in.a = Opnd::konst(v);
    in.b = Opnd();
    in.c = Opnd();
    in.sym.clear();
    in.sym2.clear();
}

void makeCopy(Instr& in, const Opnd& src) {
    if (src.isConst()) { makeConst(in, src.c); return; }
    in.op = Op::COPY;
    in.a = src;
    in.b = Opnd();
    in.c = Opnd();
    in.sym.clear();
    in.sym2.clear();
}

std::optional<double> evalOp(Op op, double A, double B, double C, int nargs) {
    switch (op) {
        case Op::ADD: return A + B;
        case Op::SUB: return A - B;
        case Op::MUL: return A * B;
        case Op::DIV: if (B == 0) return std::nullopt; return A / B;  // W603: never folded
        case Op::NEG: return -A;
        case Op::LT: return A < B ? 1.0 : 0.0;
        case Op::LE: return A <= B ? 1.0 : 0.0;
        case Op::GT: return A > B ? 1.0 : 0.0;
        case Op::GE: return A >= B ? 1.0 : 0.0;
        case Op::EQ: return A == B ? 1.0 : 0.0;
        case Op::NE: return A != B ? 1.0 : 0.0;
        case Op::AND: return (A != 0 && B != 0) ? 1.0 : 0.0;
        case Op::OR: return (A != 0 || B != 0) ? 1.0 : 0.0;
        case Op::NOT: return A == 0 ? 1.0 : 0.0;
        case Op::ABS: return std::fabs(A);
        case Op::MIN: return std::min(A, B);
        case Op::MAX: return std::max(A, B);
        case Op::SQRT: if (A < 0) return std::nullopt; return std::sqrt(A);
        case Op::LOG: if (A <= 0) return std::nullopt; return std::log(A);
        case Op::EXP: return std::exp(A);
        case Op::POW: return std::pow(A, B);
        case Op::SIGN: return static_cast<double>((A > 0) - (A < 0));
        case Op::CLAMP: return std::min(std::max(A, B), C);
        default: break;
    }
    (void)nargs;
    return std::nullopt;
}

bool isFoldable(Op op) {
    switch (op) {
        case Op::ADD: case Op::SUB: case Op::MUL: case Op::DIV: case Op::NEG: case Op::LT: case Op::LE: case Op::GT:
        case Op::GE: case Op::EQ: case Op::NE: case Op::AND: case Op::OR: case Op::NOT: case Op::ABS: case Op::MIN:
        case Op::MAX: case Op::SQRT: case Op::LOG: case Op::EXP: case Op::POW: case Op::SIGN: case Op::CLAMP:
            return true;
        default: return false;
    }
}

// ---- 1. constant folding (incl. constant branch folding) -----------------
long passFold(TacProgram& P) {
    long changed = 0;
    for (auto& f : P.funcs) {
        bool again = true;
        while (again) {
            again = false;
            auto km = singleConsts(f);
            for (auto& in : f.code) {
                if (in.op == Op::COPY) {
                    if (auto v = cval(in.a, km)) { makeConst(in, *v); ++changed; again = true; }
                    continue;
                }
                if (in.op == Op::JZ || in.op == Op::JNZ) {
                    if (auto v = cval(in.a, km)) {
                        bool taken = (in.op == Op::JZ) == (*v == 0);
                        if (taken) { in.op = Op::JMP; in.a = Opnd(); }
                        else in.op = Op::NOP;
                        ++changed;
                        again = true;
                    }
                    continue;
                }
                if (!isFoldable(in.op)) continue;
                std::optional<double> A = cval(in.a, km), B, C;
                int nargs = 1;
                if (in.b.k != Opnd::None) { B = cval(in.b, km); ++nargs; }
                if (in.c.k != Opnd::None) { C = cval(in.c, km); ++nargs; }
                if (!A || (in.b.k != Opnd::None && !B) || (in.c.k != Opnd::None && !C)) continue;
                auto v = evalOp(in.op, *A, B.value_or(0), C.value_or(0), nargs);
                if (!v) continue;
                makeConst(in, *v);
                ++changed;
                again = true;
            }
        }
        compact(f);
    }
    return changed;
}

// ---- 2. algebraic simplification ------------------------------------------
long passAlgebraic(TacProgram& P) {
    long changed = 0;
    for (auto& f : P.funcs) {
        auto km = singleConsts(f);
        auto sd = singleDefs(f);
        auto is = [&](const Opnd& o, double v) { auto c = cval(o, km); return c && *c == v; };
        auto sameTemp = [](const Opnd& a, const Opnd& b) { return a.isTemp() && b.isTemp() && a.t == b.t; };
        auto defOf = [&](const Opnd& o) -> const Instr* {
            if (!o.isTemp()) return nullptr;
            auto it = sd.find(o.t);
            return it == sd.end() ? nullptr : &f.code[static_cast<size_t>(it->second)];
        };
        for (auto& in : f.code) {
            Instr before = in;
            switch (in.op) {
                case Op::ADD:
                    if (is(in.b, 0)) makeCopy(in, in.a);
                    else if (is(in.a, 0)) makeCopy(in, in.b);
                    break;
                case Op::SUB:
                    if (is(in.b, 0)) makeCopy(in, in.a);
                    else if (sameTemp(in.a, in.b)) makeConst(in, 0);
                    break;
                case Op::MUL:
                    if (is(in.a, 0) || is(in.b, 0)) makeConst(in, 0);
                    else if (is(in.b, 1)) makeCopy(in, in.a);
                    else if (is(in.a, 1)) makeCopy(in, in.b);
                    break;
                case Op::DIV:
                    if (is(in.b, 1)) makeCopy(in, in.a);
                    break;
                case Op::NEG: {
                    const Instr* d = defOf(in.a);
                    if (d && d->op == Op::NEG && (d->a.isConst() || defOf(d->a))) makeCopy(in, d->a);
                    break;
                }
                case Op::NOT: {
                    const Instr* d = defOf(in.a);
                    if (d && d->op == Op::NOT && (d->a.isConst() || defOf(d->a))) makeCopy(in, d->a);
                    break;
                }
                case Op::AND:
                    if (is(in.a, 0) || is(in.b, 0)) makeConst(in, 0);
                    else if (is(in.b, 1)) makeCopy(in, in.a);
                    else if (is(in.a, 1)) makeCopy(in, in.b);
                    break;
                case Op::OR:
                    if (is(in.a, 1) || is(in.b, 1)) makeConst(in, 1);
                    else if (is(in.b, 0)) makeCopy(in, in.a);
                    else if (is(in.a, 0)) makeCopy(in, in.b);
                    break;
                case Op::MIN: case Op::MAX:
                    if (sameTemp(in.a, in.b)) makeCopy(in, in.a);
                    break;
                default: break;
            }
            if (in.op != before.op) ++changed;
        }
    }
    return changed;
}

// ---- 3. global constant & copy propagation (reaching definitions) --------
long passPropagate(TacProgram& P) {
    long changed = 0;
    for (auto& f : P.funcs) {
        CFG g = buildCFG(f);
        auto rd = reachingDefs(f, g);
        noteSweeps(rd.sweeps);
        auto rin = reachingPerInstr(f, g, rd);
        std::map<int, std::vector<int>> defsOf;
        for (size_t i = 0; i < f.code.size(); ++i)
            if (f.code[i].dst >= 0) defsOf[f.code[i].dst].push_back(static_cast<int>(i));
        auto reaching = [&](int t, size_t at) {
            std::vector<int> r;
            for (int d : defsOf[t])
                if (rin[at].count(d)) r.push_back(d);
            return r;
        };
        for (size_t i = 0; i < f.code.size(); ++i) {
            if (g.blockOf[i] < 0 || !g.reachable(g.blockOf[i])) continue;
            Instr& in = f.code[i];
            for (Opnd* o : {&in.a, &in.b, &in.c}) {
                if (!o->isTemp()) continue;
                auto D = reaching(o->t, i);
                if (D.empty()) continue;
                bool allConst = true;
                double v = 0;
                for (size_t j = 0; j < D.size(); ++j) {
                    const Instr& di = f.code[static_cast<size_t>(D[j])];
                    if (di.op != Op::CONST || !di.a.isConst()) { allConst = false; break; }
                    if (j == 0) v = di.a.c;
                    else if (di.a.c != v) { allConst = false; break; }
                }
                if (allConst) {
                    *o = Opnd::konst(v);
                    ++changed;
                    continue;
                }
                if (D.size() == 1) {
                    const Instr& di = f.code[static_cast<size_t>(D[0])];
                    if (di.op == Op::COPY && di.a.isTemp() && di.a.t != o->t) {
                        int s = di.a.t;
                        if (reaching(s, i) == reaching(s, static_cast<size_t>(D[0]))) {
                            o->t = s;
                            ++changed;
                        }
                    }
                }
            }
        }
    }
    return changed;
}

// ---- 4a. local value numbering per basic block ----------------------------
long passLVN(TacProgram& P) {
    long changed = 0;
    for (auto& f : P.funcs) {
        CFG g = buildCFG(f);
        std::map<int, int> version;
        for (auto& B : g.blocks) {
            struct E { int holder; int ver; std::vector<std::string> reads; };
            std::map<std::string, E> table;
            auto vn = [&](const Opnd& o) {
                if (o.isTemp()) return "v" + std::to_string(o.t) + "." + std::to_string(version[o.t]);
                if (o.isConst()) { char b[40]; std::snprintf(b, sizeof b, "#%.17g", o.c); return std::string(b); }
                return std::string("_");
            };
            for (int i = B.first; i <= B.last; ++i) {
                Instr& in = f.code[static_cast<size_t>(i)];
                for (const std::string& w : writesOf(in))
                    for (auto it = table.begin(); it != table.end();) {
                        bool hit = std::find(it->second.reads.begin(), it->second.reads.end(), w) != it->second.reads.end();
                        it = hit ? table.erase(it) : std::next(it);
                    }
                std::string key;
                std::vector<int> temps;
                std::vector<std::string> reads;
                bool keyed = false;
                if ((in.op == Op::SPUSH || in.op == Op::SSTORE) && in.a.isTemp()) {
                    Instr ld;
                    ld.op = in.op == Op::SPUSH ? Op::HIST : Op::SLOAD;
                    ld.sym = in.sym;
                    std::string k;
                    cseKey(ld, k, temps, reads);
                    table[k] = E{in.a.t, version[in.a.t], reads};
                    continue;
                }
                if (cseKey(in, key, temps, reads)) {
                    std::string a = vn(in.a), b = vn(in.b), c = vn(in.c);
                    if (opIsCommutative(in.op) && b < a) std::swap(a, b);
                    key = std::string(opName(in.op)) + " " + a + " " + b + " " + c + " " + in.sym + " " + in.sym2 + " " +
                          std::to_string(in.k) + " " + std::to_string(in.n);
                    keyed = true;
                    auto it = table.find(key);
                    if (it != table.end() && it->second.holder != in.dst && version[it->second.holder] == it->second.ver) {
                        makeCopy(in, Opnd::temp(it->second.holder));
                        ++changed;
                        keyed = false;
                    }
                }
                if (in.dst >= 0) {
                    version[in.dst]++;
                    bool selfUse = std::find(temps.begin(), temps.end(), in.dst) != temps.end();
                    if (keyed && !selfUse && !table.count(key)) table[key] = E{in.dst, version[in.dst], reads};
                }
            }
        }
    }
    return changed;
}

// ---- 4b. global CSE via available expressions -----------------------------
long passGCSE(TacProgram& P) {
    long changed = 0;
    for (auto& f : P.funcs) {
        CFG g = buildCFG(f);
        auto av = availableExprs(f, g);
        noteSweeps(av.sweeps);
        for (auto& B : g.blocks) {
            AvailSet s = av.in[static_cast<size_t>(B.id)];
            for (int i = B.first; i <= B.last; ++i) {
                Instr& in = f.code[static_cast<size_t>(i)];
                std::string key;
                std::vector<int> temps;
                std::vector<std::string> reads;
                if (!s.top && cseKey(in, key, temps, reads)) {
                    auto it = s.m.find(key);
                    if (it != s.m.end() && it->second.holder != in.dst) {
                        makeCopy(in, Opnd::temp(it->second.holder));
                        ++changed;
                    }
                }
                availStep(in, s);
            }
        }
    }
    return changed;
}

// ---- 5. dead code elimination (liveness) + unreachable blocks -------------
long passDCE(TacProgram& P) {
    long changed = 0;
    for (auto& f : P.funcs) {
        bool again = true;
        while (again) {
            again = false;
            CFG g = buildCFG(f);
            // unreachable blocks
            for (auto& B : g.blocks) {
                if (g.reachable(B.id)) continue;
                for (int i = B.first; i <= B.last; ++i) {
                    f.code[static_cast<size_t>(i)].op = Op::NOP;
                    f.code[static_cast<size_t>(i)].dst = -1;
                    ++changed;
                    again = true;
                }
            }
            if (again) { compact(f); continue; }
            auto lv = liveness(f, g);
            noteSweeps(lv.sweeps);
            auto lo = liveOutPerInstr(f, g, lv);
            for (size_t i = 0; i < f.code.size(); ++i) {
                Instr& in = f.code[i];
                if (opIsPure(in.op) && in.dst >= 0 && !lo[i].count(in.dst)) {
                    in.op = Op::NOP;
                    in.dst = -1;
                    ++changed;
                    again = true;
                }
            }
            compact(f);
            // jump cleanup: jumps to the next instruction, unreferenced labels
            std::set<int> targets;
            for (auto& in : f.code)
                if (opIsJump(in.op)) targets.insert(in.label);
            for (size_t i = 0; i < f.code.size(); ++i) {
                Instr& in = f.code[i];
                if (opIsJump(in.op)) {
                    size_t j = i + 1;
                    bool toNext = false;
                    while (j < f.code.size() && f.code[j].op == Op::LABEL) {
                        if (f.code[j].label == in.label) toNext = true;
                        ++j;
                    }
                    if (toNext) { in.op = Op::NOP; in.a = Opnd(); ++changed; again = true; }
                } else if (in.op == Op::LABEL && !targets.count(in.label)) {
                    in.op = Op::NOP;
                    ++changed;
                    again = true;
                }
            }
            compact(f);
        }
    }
    return changed;
}

// ---- 6. window strength reduction ----------------------------------------
long passWindowSR(TacProgram& P) {
    long changed = 0;
    struct Need { int order; std::string acc; Op upd; std::string series; long n; };
    std::map<std::string, Need> needs;  // acc name -> update
    auto need = [&](const std::string& kind, Op upd, int order, const std::string& s, long n) {
        std::string a = accName(kind, s, n);
        if (!needs.count(a)) needs[a] = Need{order, a, upd, s, n};
        return a;
    };
    for (auto& f : P.funcs) {
        std::vector<Instr> out;
        for (auto& in : f.code) {
            Instr r = in;
            switch (in.op) {
                case Op::ROLLSUM:
                    r.op = Op::ALOAD;
                    r.sym = need("sum", Op::RSUM_UPD, 0, in.sym, in.k);
                    r.k = 0;
                    out.push_back(r);
                    ++changed;
                    continue;
                case Op::ROLLMEAN: {
                    int t = P.newTemp('F', P.temps[static_cast<size_t>(in.dst)].dim);
                    Instr ld = in;
                    ld.op = Op::ALOAD;
                    ld.dst = t;
                    ld.sym = need("sum", Op::RSUM_UPD, 0, in.sym, in.k);
                    ld.k = 0;
                    out.push_back(ld);
                    Instr dv = in;
                    dv.op = Op::DIV;
                    dv.a = Opnd::temp(t);
                    dv.b = Opnd::konst(static_cast<double>(in.k));
                    dv.sym.clear();
                    dv.k = 0;
                    out.push_back(dv);
                    ++changed;
                    continue;
                }
                case Op::ROLLSTD:
                    r.op = Op::RSTD;
                    r.sym = need("sum", Op::RSUM_UPD, 0, in.sym, in.k);
                    r.sym2 = need("sumsq", Op::RSQ_UPD, 1, in.sym, in.k);
                    r.n = in.k;
                    r.k = 0;
                    out.push_back(r);
                    ++changed;
                    continue;
                case Op::ROLLMAX: case Op::ROLLMIN: {
                    bool mx = in.op == Op::ROLLMAX;
                    r.op = mx ? Op::WMAX_GET : Op::WMIN_GET;
                    r.sym = need(mx ? "dqmax" : "dqmin", mx ? Op::WMAX_UPD : Op::WMIN_UPD, mx ? 2 : 3, in.sym, in.k);
                    r.sym2 = in.sym;
                    r.k = 0;
                    out.push_back(r);
                    ++changed;
                    continue;
                }
                default: out.push_back(in);
            }
        }
        f.code.swap(out);
    }
    if (needs.empty()) return changed;
    std::vector<Need> list;
    for (auto& [k, v] : needs) list.push_back(v);
    std::sort(list.begin(), list.end(), [](const Need& a, const Need& b) {
        if (a.series != b.series) return a.series < b.series;
        if (a.n != b.n) return a.n < b.n;
        return a.order < b.order;
    });
    for (auto& f : P.funcs) {
        std::vector<Instr> out;
        for (auto& in : f.code) {
            out.push_back(in);
            if (in.op != Op::SPUSH) continue;
            // Updates go after the push (and after any EMA_UPD already there).
            for (auto& nd : list) {
                if (nd.series != in.sym) continue;
                Instr u;
                u.op = nd.upd;
                u.sym = nd.acc;
                u.sym2 = nd.series;
                u.n = nd.n;
                u.line = in.line;
                out.push_back(u);
                ++changed;
            }
        }
        f.code.swap(out);
    }
    return changed;
}

// ---- 7. peephole ----------------------------------------------------------
Op invertCmp(Op op) {
    switch (op) {
        case Op::LT: return Op::GE;
        case Op::LE: return Op::GT;
        case Op::GT: return Op::LE;
        case Op::GE: return Op::LT;
        case Op::EQ: return Op::NE;
        case Op::NE: return Op::EQ;
        default: return op;
    }
}

long passPeephole(TacProgram& P) {
    long changed = 0;
    for (auto& f : P.funcs) {
        auto sd = singleDefs(f);
        auto uc = useCounts(f);
        auto stable = [&](const Opnd& o) { return !o.isTemp() || sd.count(o.t); };
        for (size_t i = 0; i < f.code.size(); ++i) {
            Instr& in = f.code[i];
            if (in.op == Op::COPY && in.a.isTemp() && in.a.t == in.dst) {
                in.op = Op::NOP;
                in.dst = -1;
                ++changed;
                continue;
            }
            // NOT (cmp a, b) -> inverted cmp. Sound because warm-up guarantees
            // operands are never NaN (see docs/DECISIONS.md).
            if (in.op == Op::NOT && in.a.isTemp() && sd.count(in.a.t) && uc[in.a.t] == 1) {
                const Instr& d = f.code[static_cast<size_t>(sd[in.a.t])];
                if (invertCmp(d.op) != d.op && stable(d.a) && stable(d.b)) {
                    Op inv = invertCmp(d.op);
                    Opnd a = d.a, b = d.b;
                    in.op = inv;
                    in.a = a;
                    in.b = b;
                    ++changed;
                    continue;
                }
            }
            // JZ (NOT x) -> JNZ x ; JNZ (NOT x) -> JZ x
            if ((in.op == Op::JZ || in.op == Op::JNZ) && in.a.isTemp() && sd.count(in.a.t) && uc[in.a.t] == 1) {
                const Instr& d = f.code[static_cast<size_t>(sd[in.a.t])];
                if (d.op == Op::NOT && stable(d.a)) {
                    in.op = in.op == Op::JZ ? Op::JNZ : Op::JZ;
                    in.a = d.a;
                    ++changed;
                    continue;
                }
            }
            if (in.op == Op::JMP && i + 1 < f.code.size() && f.code[i + 1].op == Op::LABEL && f.code[i + 1].label == in.label) {
                in.op = Op::NOP;
                ++changed;
            }
        }
        compact(f);
    }
    return changed;
}

}  // namespace

OptReport optimize(TacProgram& p, int level) {
    OptReport r;
    r.level = level;
    r.initialCount = static_cast<long>(p.instrCount());
    struct Step { const char* name; std::function<long(TacProgram&)> fn; };
    std::vector<Step> steps;
    if (level == 1) {
        steps = {{"fold", passFold}, {"propagate", passPropagate}, {"dce", passDCE}};
    } else if (level >= 2) {
        steps = {{"fold", passFold},          {"algebraic", passAlgebraic}, {"propagate", passPropagate},
                 {"lvn-cse", passLVN},        {"global-cse", passGCSE},     {"dce", passDCE},
                 {"window-sr", passWindowSR}, {"peephole", passPeephole},   {"fold#2", passFold},
                 {"propagate#2", passPropagate}, {"lvn-cse#2", passLVN},   {"global-cse#2", passGCSE},
                 {"dce#2", passDCE}};
    }
    for (auto& s : steps) {
        PassRecord pr;
        pr.name = s.name;
        pr.before = programJson(p);
        pr.countBefore = static_cast<long>(p.instrCount());
        gSweeps = 0;
        pr.changed = s.fn(p);
        pr.sweeps = gSweeps;
        r.maxSweeps = std::max(r.maxSweeps, gSweeps);
        pr.after = programJson(p);
        pr.afterText = programText(p);
        pr.countAfter = static_cast<long>(p.instrCount());
        r.passes.push_back(pr);
    }
    return r;
}

Json optJson(const OptReport& r) {
    Json arr = Json::array();
    for (auto& p : r.passes) {
        Json o = Json::object();
        o.set("name", p.name);
        o.set("before", p.before);
        o.set("after", p.after);
        o.set("countBefore", p.countBefore);
        o.set("countAfter", p.countAfter);
        o.set("removed", p.countBefore - p.countAfter);
        o.set("changed", p.changed);
        o.set("sweeps", p.sweeps);
        arr.push(o);
    }
    return arr;
}

std::string optText(const OptReport& r, const TacProgram& initial) {
    std::ostringstream os;
    os << "== initial TAC (" << r.initialCount << " instructions) ==\n" << programText(initial);
    for (auto& p : r.passes) {
        os << "== after " << p.name << ": " << p.countBefore << " -> " << p.countAfter << " instructions, " << p.changed
           << " rewritten";
        if (p.sweeps) os << ", data-flow sweeps <= " << p.sweeps;
        os << " ==\n" << p.afterText;
    }
    return os.str();
}
