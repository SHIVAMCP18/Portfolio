#include "irgen.hpp"

#include <map>
#include <set>

#include "symtab.hpp"

std::string accName(const std::string& kind, const std::string& series, long n) {
    return kind + "_" + series + "_" + std::to_string(n);
}

namespace {

class IrGen {
public:
    IrGen(Node* prog, const SemaResult& sr, const CausalityResult& cr, TacProgram& out)
        : prog_(prog), sr_(sr), cr_(cr), P(out) {}

    void run() {
        P.strategy = prog_->name;
        P.warmup = cr_.warmup;
        P.funcs[0].name = "on_open";
        P.funcs[1].name = "on_close";
        for (Symbol* s : sr_.params) {
            ParamInfo pi;
            pi.name = s->name;
            pi.value = s->decl->ann.constValue.value_or(0);
            pi.cls = s->type.isBool() ? 'B' : 'F';
            pi.type = s->type.name();
            P.params.push_back(pi);
        }
        for (Symbol* s : sr_.states) {
            ParamInfo pi;
            pi.name = s->name;
            pi.value = s->decl->ann.constValue.value_or(0);
            pi.cls = s->type.isBool() ? 'B' : 'F';
            pi.type = s->type.name();
            P.states.push_back(pi);
        }
        collectEmas(prog_);
        genPhase(0);
        genPhase(1);
    }

private:
    // ---- helpers ----
    Instr& emit(Op op, int dst = -1) {
        Instr in;
        in.op = op;
        in.dst = dst;
        in.line = line_;
        fn_->code.push_back(in);
        return fn_->code.back();
    }
    int temp(char cls, const std::string& dim) { return P.newTemp(cls, dim); }
    static std::string dimOf(const Node* e) {
        if (e->ann.type.isBool()) return "bool";
        if (e->ann.type.isNumeric()) return e->ann.type.numDim().name();
        return "";
    }
    void label(int l) { emit(Op::LABEL).label = l; }
    void jmp(int l) { emit(Op::JMP).label = l; }
    void jz(int t, int l) {
        Instr& in = emit(Op::JZ);
        in.a = Opnd::temp(t);
        in.label = l;
    }
    void jnz(int t, int l) {
        Instr& in = emit(Op::JNZ);
        in.a = Opnd::temp(t);
        in.label = l;
    }
    int konst(double v, char cls, const std::string& dim) {
        int t = temp(cls, dim);
        emit(Op::CONST, t).a = Opnd::konst(v);
        return t;
    }
    int un(Op op, int a, char cls, const std::string& dim) {
        int t = temp(cls, dim);
        emit(op, t).a = Opnd::temp(a);
        return t;
    }
    int bin(Op op, int a, int b, char cls, const std::string& dim) {
        int t = temp(cls, dim);
        Instr& in = emit(op, t);
        in.a = Opnd::temp(a);
        in.b = Opnd::temp(b);
        return t;
    }
    int hist(const std::string& s, long k, const std::string& dim) {
        int t = temp('F', dim);
        Instr& in = emit(Op::HIST, t);
        in.sym = s;
        in.k = k;
        return t;
    }

    void collectEmas(Node* n) {
        if (!n) return;
        if (n->kind == NK::Call && n->name == "ema" && n->ann.sym) emas_.insert({n->ann.sym->name, static_cast<long>(n->num)});
        collectEmas(n->a);
        collectEmas(n->b);
        collectEmas(n->c);
        for (Node* c : n->list) collectEmas(c);
    }

    // ---- per-bar structure ----
    void genPhase(int h) {
        fn_ = &P.funcs[h];
        line_ = 0;
        if (h == 0) emit(Op::TICK);
        // Push fields known at this phase.
        for (auto& si : cr_.series) {
            if (!si.isField || si.bufsize <= 0) continue;
            if ((si.phase == 'O') != (h == 0)) continue;
            int t = temp('F', si.sym->type.dim.name());
            emit(Op::LOADFIELD, t).sym = si.sym->name;
            Instr& p = emit(Op::SPUSH);
            p.sym = si.sym->name;
            p.a = Opnd::temp(t);
            afterPush(si.sym->name);
        }
        // Derived series of this phase in topological order.
        for (auto& si : cr_.series) {
            if (si.isField || si.bufsize <= 0) continue;
            if ((si.phase == 'O') != (h == 0)) continue;
            genSeries(si);
        }
        Node* hd = sr_.handlers[h];
        if (!hd) return;
        line_ = hd->line;
        int skip = -1;
        if (P.warmup > 0) {
            int tw = temp('B', "bool");
            emit(Op::BARS_GT, tw).k = P.warmup;
            skip = P.newLabel();
            jz(tw, skip);
        }
        env_.clear();
        block(hd->a);
        if (skip >= 0) {
            line_ = hd->eline;
            label(skip);
        }
    }

    void afterPush(const std::string& s) {
        auto si = cr_.find(s);
        for (auto& [series, n] : emas_) {
            if (series != s) continue;
            Instr& in = emit(Op::EMA_UPD);
            in.sym = accName("ema", s, n);
            in.sym2 = s;
            in.n = n;
            in.k = si ? si->depth : 0;
        }
    }

    void genSeries(const SeriesInfo& si) {
        Node* decl = si.sym->decl;
        line_ = decl->line;
        long d = si.depth;
        bool init = decl->b != nullptr;
        std::string dim = si.sym->type.dim.name();
        int v;
        if (d == 0 && !init) {
            env_.clear();
            v = expr(decl->a);
        } else {
            v = temp('F', dim);
            int lz = P.newLabel(), li = init ? P.newLabel() : -1, le = P.newLabel();
            if (d > 0) {
                int tg = temp('B', "bool");
                emit(Op::BARS_GT, tg).k = d;
                jz(tg, lz);
            }
            if (init) {
                int ti = temp('B', "bool");
                emit(Op::BARS_GT, ti).k = d + 1;
                jz(ti, li);
            }
            env_.clear();
            int te = expr(decl->a);
            line_ = decl->line;
            emit(Op::COPY, v).a = Opnd::temp(te);
            jmp(le);
            if (init) {
                label(li);
                env_.clear();
                int tin = expr(decl->b);
                line_ = decl->line;
                emit(Op::COPY, v).a = Opnd::temp(tin);
                jmp(le);
            }
            if (d > 0) {
                label(lz);
                emit(Op::CONST, v).a = Opnd::konst(0);
            }
            label(le);
        }
        line_ = decl->line;
        Instr& p = emit(Op::SPUSH);
        p.sym = si.sym->name;
        p.a = Opnd::temp(v);
        afterPush(si.sym->name);
    }

    // ---- statements ----
    void block(Node* b) {
        if (!b) return;
        for (Node* s : b->list) stmt(s);
    }

    void stmt(Node* s) {
        line_ = s->sline;
        switch (s->kind) {
            case NK::Let: env_[s->ann.sym] = expr(s->a); break;
            case NK::Assign: {
                int v = expr(s->a);
                line_ = s->sline;
                Instr& in = emit(Op::SSTORE);
                in.sym = s->name;
                in.a = Opnd::temp(v);
                break;
            }
            case NK::If: {
                int c = expr(s->a);
                int lelse = P.newLabel();
                line_ = s->sline;
                jz(c, lelse);
                block(s->b);
                if (s->c) {
                    int lend = P.newLabel();
                    line_ = s->b->eline;
                    jmp(lend);
                    label(lelse);
                    block(s->c);
                    line_ = s->c->eline;
                    label(lend);
                } else {
                    line_ = s->b->eline;
                    label(lelse);
                }
                break;
            }
            case NK::Buy:
            case NK::Sell: {
                int q = expr(s->a);
                line_ = s->sline;
                emit(s->kind == NK::Buy ? Op::BUY : Op::SELL).a = Opnd::temp(q);
                break;
            }
            case NK::Flatten: emit(Op::FLATTEN); break;
            default: break;
        }
    }

    // ---- expressions ----
    int expr(Node* e) {
        int saved = line_;
        line_ = e->line;
        int r = exprInner(e);
        line_ = saved;
        return r;
    }

    int exprInner(Node* e) {
        std::string dim = dimOf(e);
        char cls = e->ann.type.isBool() ? 'B' : 'F';
        switch (e->kind) {
            case NK::NumLit: case NK::BoolLit: return konst(*e->ann.constValue, cls, dim);
            case NK::Ident: {
                Symbol* s = e->ann.sym;
                switch (s->kind) {
                    case SymKind::Const: return konst(s->constValue.value_or(0), cls, dim);
                    case SymKind::Param: {
                        int t = temp(cls, dim);
                        emit(Op::PARAM, t).sym = s->name;
                        return t;
                    }
                    case SymKind::State: {
                        int t = temp(cls, dim);
                        emit(Op::SLOAD, t).sym = s->name;
                        return t;
                    }
                    default: return env_.at(s);
                }
            }
            case NK::Index: return hist(e->ann.sym->name, static_cast<long>(*e->b->ann.constValue), dim);
            case NK::UnOp: {
                int a = expr(e->a);
                return un(e->name == "-" ? Op::NEG : Op::NOT, a, cls, dim);
            }
            case NK::BinOp: {
                const std::string& op = e->name;
                if (op == "&&" || op == "||") return shortCircuit(e, op == "&&");
                int a = expr(e->a);
                int b = expr(e->b);
                Op o = op == "+" ? Op::ADD : op == "-" ? Op::SUB : op == "*" ? Op::MUL : op == "/" ? Op::DIV
                     : op == "<" ? Op::LT : op == "<=" ? Op::LE : op == ">" ? Op::GT : op == ">=" ? Op::GE
                     : op == "==" ? Op::EQ : Op::NE;
                return bin(o, a, b, cls, dim);
            }
            case NK::Call: return call(e, cls, dim);
            default: return konst(0, cls, dim);
        }
    }

    int shortCircuit(Node* e, bool isAnd) {
        int a = expr(e->a);
        int r = temp('B', "bool");
        int lshort = P.newLabel(), lend = P.newLabel();
        if (isAnd) jz(a, lshort);
        else jnz(a, lshort);
        int b = expr(e->b);
        emit(Op::COPY, r).a = Opnd::temp(b);
        jmp(lend);
        label(lshort);
        emit(Op::CONST, r).a = Opnd::konst(isAnd ? 0.0 : 1.0);
        label(lend);
        return r;
    }

    int call(Node* e, char cls, const std::string& dim) {
        const std::string& f = e->name;
        Symbol* fs = e->ann.sym;
        if (fs && fs->kind == SymKind::Func) return inlineCall(e);
        if (f == "mean" || f == "sum" || f == "std" || f == "highest" || f == "lowest" || f == "ema") {
            std::string s = e->list[0]->ann.sym->name;
            long n = static_cast<long>(e->num);
            int t = temp('F', dim);
            if (f == "ema") {
                Instr& in = emit(Op::EMA, t);
                in.sym = accName("ema", s, n);
                in.sym2 = s;
                in.k = n;
                return t;
            }
            Op o = f == "mean" ? Op::ROLLMEAN : f == "sum" ? Op::ROLLSUM : f == "std" ? Op::ROLLSTD
                 : f == "highest" ? Op::ROLLMAX : Op::ROLLMIN;
            Instr& in = emit(o, t);
            in.sym = s;
            in.k = n;
            return t;
        }
        if (f == "crossover" || f == "crossunder") {
            std::string a = e->list[0]->ann.sym->name, b = e->list[1]->ann.sym->name;
            std::string sd = e->list[0]->ann.sym->type.dim.name();
            int a0 = hist(a, 0, sd), b0 = hist(b, 0, sd), a1 = hist(a, 1, sd), b1 = hist(b, 1, sd);
            bool over = f == "crossover";
            int c1 = bin(over ? Op::GT : Op::LT, a0, b0, 'B', "bool");
            int c2 = bin(over ? Op::LE : Op::GE, a1, b1, 'B', "bool");
            return bin(Op::AND, c1, c2, 'B', "bool");
        }
        std::vector<int> args;
        for (Node* a : e->list) {
            if (f == "pow" && a == e->list[1]) {
                args.push_back(konst(*a->ann.constValue, 'F', "scalar"));
                continue;
            }
            args.push_back(expr(a));
        }
        Op o = f == "abs" ? Op::ABS : f == "min" ? Op::MIN : f == "max" ? Op::MAX : f == "clamp" ? Op::CLAMP
             : f == "sign" ? Op::SIGN : f == "sqrt" ? Op::SQRT : f == "pow" ? Op::POW : f == "log" ? Op::LOG : Op::EXP;
        int t = temp(cls, dim);
        Instr& in = emit(o, t);
        in.a = Opnd::temp(args[0]);
        if (args.size() > 1) in.b = Opnd::temp(args[1]);
        if (args.size() > 2) in.c = Opnd::temp(args[2]);
        return t;
    }

    int inlineCall(Node* e) {
        Node* decl = e->ann.sym->decl;
        std::vector<int> args;
        for (Node* a : e->list) args.push_back(expr(a));
        std::map<Symbol*, int> saved = env_;
        for (size_t i = 0; i < decl->list.size(); ++i) env_[decl->list[i]->ann.sym] = args[i];
        int r = expr(decl->a);
        env_ = saved;
        return r;
    }

    Node* prog_;
    const SemaResult& sr_;
    const CausalityResult& cr_;
    TacProgram& P;
    Function* fn_ = nullptr;
    int line_ = 0;
    std::map<Symbol*, int> env_;
    std::set<std::pair<std::string, long>> emas_;
};

}  // namespace

TacProgram generateTac(Node* program, const SemaResult& sr, const CausalityResult& cr) {
    TacProgram p;
    IrGen g(program, sr, cr, p);
    g.run();
    return p;
}
