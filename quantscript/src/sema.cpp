#include "sema.hpp"

#include <algorithm>
#include <cmath>
#include <cstdio>
#include <functional>
#include <set>

#include "builtins.hpp"

namespace {

std::string q(const std::string& s) { return "`" + s + "`"; }

std::string dimDesc(const Type& t) {
    if (t.isBool()) return "bool";
    if (t.kind == TKind::Int) return "int (0,0)";
    return t.dim.name() + " " + t.dim.vec();
}

int spanLen(const Node* n) {
    if (!n || n->sline != n->eline) return 0;
    return n->ecol - n->scol;
}

bool isPlainNumber(const Node* n) {
    if (n->kind == NK::NumLit) return !n->hasUnit && !n->isPct;
    if (n->kind == NK::UnOp && n->name == "-") return isPlainNumber(n->a);
    return false;
}

std::string suffixFor(const Dim& d) {
    if (d == Dim::price()) return "px";
    if (d == Dim::volume()) return "vol";
    if (d == Dim::notional()) return "ntl";
    return "";
}

// "did you mean `100px`?" when a unitless literal meets a unit-carrying operand.
std::string literalHint(const Node* l, const Type& tl, const Node* r, const Type& tr) {
    const Node* lit = nullptr;
    Dim other;
    if (isPlainNumber(r) && !suffixFor(tl.numDim()).empty()) { lit = r; other = tl.numDim(); }
    else if (isPlainNumber(l) && !suffixFor(tr.numDim()).empty()) { lit = l; other = tr.numDim(); }
    if (!lit) return "";
    return "did you mean " + q(exprText(lit) + suffixFor(other)) + "?";
}

}  // namespace

bool Sema::run() {
    declareBuiltins();
    declarationPass();
    if (d_.errorCount()) return false;
    typePass();
    if (d_.errorCount()) { warnings(); return false; }
    dependencyPass();
    warnings();
    return d_.errorCount() == 0;
}

void Sema::declareBuiltins() {
    const char* fields[] = {"open", "high", "low", "close", "volume"};
    for (const char* f : fields) {
        Dim dm = std::string(f) == "volume" ? Dim::volume() : Dim::price();
        Symbol* s = st_.declare(f, SymKind::BuiltinSeries, Type::num(dm), 0, 0);
        s->phase = std::string(f) == "open" ? 'O' : 'C';
        s->order = -1;
        res_.fields.push_back(s);
    }
    for (auto& b : allBuiltins()) {
        Symbol* s = st_.declare(b.name, SymKind::BuiltinFunc, Type::voidT(), 0, 0);
        s->order = -1;
    }
}

// ---- pass 1: declarations --------------------------------------------------

void Sema::declarationPass() {
    int order = 0;
    Node* firstHandler[2] = {nullptr, nullptr};
    for (Node* it : prog_->list) {
        ++order;
        SymKind kind;
        Type t = typeFromName(it->declType);
        switch (it->kind) {
            case NK::ConstDecl: kind = SymKind::Const; break;
            case NK::ParamDecl: kind = SymKind::Param; if (t.kind == TKind::Int) t = Type::num(Dim::scalar()); break;
            case NK::StateDecl: kind = SymKind::State; if (t.kind == TKind::Int) t = Type::num(Dim::scalar()); break;
            case NK::SeriesDecl: kind = SymKind::Series; if (t.kind == TKind::Int) t = Type::num(Dim::scalar()); break;
            case NK::FuncDecl: kind = SymKind::Func; break;
            case NK::Handler: {
                int hk = it->handlerKind;
                if (firstHandler[hk]) {
                    d_.error("E305", it->line, it->col,
                             std::string("duplicate `on ") + (hk == 0 ? "bar_open" : "bar_close") + "` handler")
                        .note("the first handler is at line " + std::to_string(firstHandler[hk]->line))
                        .withHint("merge both bodies into a single handler")
                        .caret(2);
                } else {
                    firstHandler[hk] = it;
                    res_.handlers[hk] = it;
                }
                continue;
            }
            default: continue;
        }
        Symbol* prev = nullptr;
        Symbol* s = st_.declare(it->name, kind, t, it->line, it->col, &prev);
        if (!s) {
            if (prev && prev->declLine == 0)
                d_.error("E302", it->line, it->col, q(it->name) + " is a builtin and cannot be redeclared")
                    .withHint("choose another name, e.g. " + q(it->name + "_s"))
                    .caret(static_cast<int>(it->name.size()));
            else
                d_.error("E302", it->line, it->col, q(it->name) + " is already declared in this scope")
                    .note("previous declaration at line " + std::to_string(prev ? prev->declLine : 0))
                    .withHint("rename one of the declarations")
                    .caret(static_cast<int>(it->name.size()));
            continue;
        }
        s->order = order;
        s->decl = it;
        s->hasInit = it->kind == NK::SeriesDecl && it->b != nullptr;
        it->ann.sym = s;
        switch (kind) {
            case SymKind::Const: res_.consts.push_back(s); break;
            case SymKind::Param: res_.params.push_back(s); break;
            case SymKind::State: res_.states.push_back(s); break;
            case SymKind::Func: res_.funcs.push_back(s); break;
            default: break;
        }
    }
}

// ---- pass 2: resolution + types --------------------------------------------

bool Sema::compatible(const Type& declared, const Type& found) const {
    if (declared.isError() || found.isError()) return true;
    if (declared.kind == TKind::Int) return found.kind == TKind::Int;
    if (declared.kind == TKind::Bool) return found.kind == TKind::Bool;
    if (found.kind == TKind::Int) return declared.dim.isScalar();
    return found.kind == TKind::Num && found.dim == declared.dim;
}

bool Sema::refsParam(const Node* e) const {
    if (!e) return false;
    if (e->kind == NK::Ident && e->ann.sym && e->ann.sym->kind == SymKind::Param) return true;
    if (refsParam(e->a) || refsParam(e->b) || refsParam(e->c)) return true;
    for (Node* c : e->list)
        if (refsParam(c)) return true;
    return false;
}

static const Node* findParam(const Node* e) {
    if (!e) return nullptr;
    if (e->kind == NK::Ident && e->ann.sym && e->ann.sym->kind == SymKind::Param) return e;
    for (const Node* c : {e->a, e->b, e->c})
        if (const Node* f = findParam(c)) return f;
    for (Node* c : e->list)
        if (const Node* f = findParam(c)) return f;
    return nullptr;
}

bool Sema::constInt(Node* e, const char* code, const std::string& what, long* out) {
    Type t = expr(e);
    if (t.isError()) return false;
    if (!e->ann.constValue) {
        if (const Node* p = findParam(e)) {
            d_.error("E504", p->line, p->col,
                     q(p->name) + " is a runtime `param` and cannot be used as " + what)
                .note(what + " must be known at compile time to size buffers and prove causality")
                .withHint("declare it as `const " + p->name + " : int = ...;` instead")
                .caret(static_cast<int>(p->name.size()));
        } else {
            d_.error(code, e->line, e->col, what + " must be a compile-time constant integer")
                .note(q(exprText(e)) + " is only known at run time")
                .withHint("use an integer literal or a `const` declared with type `int`")
                .caret(std::max(1, spanLen(e)));
        }
        return false;
    }
    double v = *e->ann.constValue;
    if (t.isBool() || !t.numDim().isScalar() || v != std::floor(v)) {
        d_.error(code, e->line, e->col, what + " must be a dimensionless integer, found " + q(exprText(e)) + " : " + t.name())
            .withHint("use an integer such as `1` or `20`")
            .caret(std::max(1, spanLen(e)));
        return false;
    }
    *out = static_cast<long>(v);
    return true;
}

Symbol* Sema::resolve(const std::string& name, int line, int col, bool asFunction) {
    Symbol* s = st_.lookup(name);
    int len = static_cast<int>(name.size());
    if (!s) {
        std::string sug = st_.suggest(name);
        Diagnostic& dg = d_.error("E301", line, col, std::string("undefined ") + (asFunction ? "function " : "identifier ") + q(name));
        dg.caret(len);
        if (!sug.empty()) dg.withHint("did you mean " + q(sug) + "?");
        else dg.withHint("declare it before use (const, param, state, series, func or let)");
        return nullptr;
    }
    if (s->scope == 0 && s->declLine > 0 && s->order >= curOrder_ && s != curSeries_) {
        if (inFunc_ && s->kind == SymKind::Func) {
            d_.error("E307", line, col, "func " + q(curFunc_ ? curFunc_->name : "?") + " calls " + q(name) +
                                            ", which is not defined before it")
                .note("functions are inlined and may not use forward references or recursion")
                .withHint("move " + q(name) + " above the function that calls it")
                .caret(len);
        } else {
            d_.error("E301", line, col, q(name) + " is used before its declaration")
                .note(q(name) + " is declared at line " + std::to_string(s->declLine))
                .withHint("declarations are processed in order; move it above this use")
                .caret(len);
        }
        return nullptr;
    }
    return s;
}

void Sema::noteRead(Symbol* s, long k) {
    s->used = true;
    s->maxHistoryRead = std::max(s->maxHistoryRead, k);
}

void Sema::typePass() {
    curOrder_ = 0;
    for (Node* it : prog_->list) {
        ++curOrder_;
        checkItem(it);
    }
}

void Sema::checkItem(Node* it) {
    Symbol* sym = it->ann.sym;
    switch (it->kind) {
        case NK::ConstDecl: {
            Type t = expr(it->a);
            Type declared = typeFromName(it->declType);
            if (t.isError()) return;
            if (!it->a->ann.constValue) {
                if (const Node* p = findParam(it->a))
                    d_.error("E504", p->line, p->col, q(p->name) + " is a runtime `param` and cannot initialize const " + q(it->name))
                        .withHint("make " + q(p->name) + " a `const` too, or make " + q(it->name) + " a `param`")
                        .caret(static_cast<int>(p->name.size()));
                else
                    d_.error("E309", it->a->line, it->a->col, "initializer of const " + q(it->name) + " is not a compile-time constant")
                        .withHint("const initializers may only use literals and earlier consts")
                        .caret(std::max(1, spanLen(it->a)));
                return;
            }
            if (!compatible(declared, t) ||
                (declared.kind == TKind::Int && *it->a->ann.constValue != std::floor(*it->a->ann.constValue))) {
                d_.error("E407", it->line, it->col, "const " + q(it->name) + " is declared " + declared.name() +
                                                        " but its initializer has type " + t.name())
                    .note("declared " + dimDesc(declared) + ", found " + dimDesc(t))
                    .withHint(literalHint(it->a, declared, it->a, t).empty() ? "change the declared type or the initializer"
                                                                          : "add a unit suffix to the literal")
                    .caret(static_cast<int>(it->name.size()));
                return;
            }
            if (sym) sym->constValue = it->a->ann.constValue;
            break;
        }
        case NK::ParamDecl:
        case NK::StateDecl: {
            bool isParam = it->kind == NK::ParamDecl;
            Type t = expr(it->a);
            if (t.isError()) return;
            Type declared = typeFromName(it->declType);
            const Node* init = it->a;
            bool literal = init->kind == NK::NumLit || init->kind == NK::BoolLit ||
                           (init->kind == NK::UnOp && init->name == "-" && init->a->kind == NK::NumLit);
            if ((isParam && !literal) || (!isParam && !init->ann.constValue)) {
                d_.error("E309", init->line, init->col,
                         std::string(isParam ? "param " : "state ") + q(it->name) + " must be initialized with a " +
                             (isParam ? "literal" : "literal or constant"))
                    .note(q(exprText(init)) + (refsParam(init) ? " depends on a runtime param" : " is not a compile-time constant"))
                    .withHint(isParam ? "write a literal such as `2.0` or `100000ntl`" : "write a literal such as `0vol`, or a `const`")
                    .caret(std::max(1, spanLen(init)));
                return;
            }
            if (!compatible(declared, t)) {
                d_.error("E407", it->line, it->col, std::string(isParam ? "param " : "state ") + q(it->name) + " is declared " +
                                                        declared.name() + " but its initializer has type " + t.name())
                    .note("declared " + dimDesc(declared) + ", found " + dimDesc(t))
                    .withHint(t.kind == TKind::Int || (t.kind == TKind::Num && t.dim.isScalar())
                                  ? "add a unit suffix to the literal, e.g. `0" + suffixFor(declared.dim) + "`"
                                  : "change the declared type or the initializer")
                    .caret(static_cast<int>(it->name.size()));
                return;
            }
            it->ann.constValue = init->ann.constValue;  // default value for codegen
            break;
        }
        case NK::SeriesDecl: {
            Type declared = typeFromName(it->declType);
            if (declared.isBool()) {
                d_.error("E407", it->line, it->col, "series " + q(it->name) + " must have a numeric type, not bool")
                    .withHint("compute the condition inside a handler with `let`")
                    .caret(static_cast<int>(it->name.size()));
                return;
            }
            if (declared.kind == TKind::Int) declared = Type::num(Dim::scalar());
            curSeries_ = sym;
            if (it->b) {
                inInit_ = true;
                Type ti = expr(it->b);
                inInit_ = false;
                if (!compatible(declared, ti))
                    d_.error("E407", it->b->line, it->b->col, "init of series " + q(it->name) + " has type " + ti.name() +
                                                                 " but the series is declared " + declared.name())
                        .note("declared " + dimDesc(declared) + ", found " + dimDesc(ti))
                        .withHint("the init value seeds the first bar and must have the series' dimension")
                        .caret(std::max(1, spanLen(it->b)));
            }
            Type t = expr(it->a);
            curSeries_ = nullptr;
            if (t.isError()) return;
            if (!compatible(declared, t)) {
                std::string hint = "change the annotation to `" + t.name() + "` or fix the expression";
                d_.error("E407", it->line, it->col, "series " + q(it->name) + " is declared " + declared.name() +
                                                        " but its expression has type " + t.name())
                    .note("declared " + dimDesc(declared) + ", inferred " + dimDesc(t))
                    .withHint(hint)
                    .caret(static_cast<int>(it->name.size()));
            }
            break;
        }
        case NK::FuncDecl: {
            st_.enter("func");
            inFunc_ = true;
            curFunc_ = sym;
            for (Node* f : it->list) {
                Type ft = typeFromName(f->declType);
                if (ft.kind == TKind::Int) ft = Type::num(Dim::scalar());
                Symbol* prev = nullptr;
                Symbol* fs = st_.declare(f->name, SymKind::Formal, ft, f->line, f->col, &prev);
                if (!fs)
                    d_.error("E302", f->line, f->col, "parameter " + q(f->name) + " is declared twice")
                        .withHint("rename one of the parameters")
                        .caret(static_cast<int>(f->name.size()));
                else { fs->decl = f; f->ann.sym = fs; f->ann.type = ft; }
            }
            Type t = expr(it->a);
            Type declared = typeFromName(it->declType);
            if (declared.kind == TKind::Int) declared = Type::num(Dim::scalar());
            if (!t.isError() && !compatible(declared, t))
                d_.error("E407", it->line, it->col, "func " + q(it->name) + " is declared to return " + declared.name() +
                                                        " but its body has type " + t.name())
                    .note("declared " + dimDesc(declared) + ", inferred " + dimDesc(t))
                    .withHint("change the return type to `" + t.name() + "`")
                    .caret(static_cast<int>(it->name.size()));
            inFunc_ = false;
            curFunc_ = nullptr;
            st_.exit();
            break;
        }
        case NK::Handler: {
            st_.enter(it->handlerKind == 0 ? "handler bar_open" : "handler bar_close");
            checkBlock(it->a, false);
            st_.exit();
            break;
        }
        default: break;
    }
}

void Sema::checkBlock(Node* block, bool newScope) {
    if (!block) return;
    if (newScope) st_.enter("block");
    for (Node* s : block->list) checkStmt(s);
    if (newScope) st_.exit();
}

void Sema::checkStmt(Node* s) {
    switch (s->kind) {
        case NK::Let: {
            Type t = expr(s->a);
            Type local = t;
            if (s->hasType) {
                Type declared = typeFromName(s->declType);
                if (!t.isError() && !compatible(declared, t) &&
                    !(declared.kind == TKind::Int && t.kind == TKind::Num && t.dim.isScalar())) {
                    d_.error("E407", s->line, s->col, q(s->name) + " is declared " + declared.name() +
                                                          " but the expression has type " + t.name())
                        .note("declared " + dimDesc(declared) + ", inferred " + dimDesc(t))
                        .withHint("change the annotation to `" + t.name() + "` or fix the expression")
                        .caret(static_cast<int>(s->name.size()));
                }
                local = declared;
            }
            if (local.kind == TKind::Int) local = Type::num(Dim::scalar());  // lets are runtime values
            Symbol* prev = nullptr;
            Symbol* sym = st_.declare(s->name, SymKind::Let, local, s->line, s->col, &prev);
            if (!sym) {
                d_.error("E302", s->line, s->col, q(s->name) + " is already declared in this scope")
                    .note("previous declaration at line " + std::to_string(prev ? prev->declLine : 0))
                    .withHint("use a different name or shadow it inside a nested block")
                    .caret(static_cast<int>(s->name.size()));
                return;
            }
            sym->decl = s;
            s->ann.sym = sym;
            s->ann.type = local;
            break;
        }
        case NK::Assign: {
            Type t = expr(s->a);
            Symbol* sym = resolve(s->name, s->line, s->col);
            if (!sym) return;
            if (sym->kind != SymKind::State) {
                d_.error("E303", s->line, s->col, "cannot assign to " + q(s->name) + ": it is a " +
                                                      std::string(symKindName(sym->kind)) + ", not a `state` variable")
                    .withHint("only `state` variables are assignable; introduce a new `let` for a derived value")
                    .caret(static_cast<int>(s->name.size()));
                return;
            }
            s->ann.sym = sym;
            if (!t.isError() && !compatible(sym->type, t)) {
                d_.error("E407", s->a->line, s->a->col, "cannot assign " + t.name() + " to state " + q(s->name) +
                                                            " of type " + sym->type.name())
                    .note("state has " + dimDesc(sym->type) + ", value has " + dimDesc(t))
                    .withHint(literalHint(s->a, t, s->a, sym->type).empty() ? "the assigned value must have the state's dimension"
                                                                            : "add a unit suffix to the literal")
                    .caret(std::max(1, spanLen(s->a)));
            }
            break;
        }
        case NK::If: {
            Type c = expr(s->a);
            if (!c.isError() && !c.isBool()) {
                d_.error("E402", s->a->line, s->a->col, "condition must be bool, found " + c.name())
                    .note(q(exprText(s->a)) + " has " + dimDesc(c))
                    .withHint("compare it with something, e.g. `" + exprText(s->a) + " > 0" + suffixFor(c.numDim()) + "`")
                    .caret(std::max(1, spanLen(s->a)));
            }
            checkBlock(s->b, true);
            checkBlock(s->c, true);
            break;
        }
        case NK::Buy:
        case NK::Sell: {
            res_.ordersIssued = true;
            Type t = expr(s->a);
            if (t.isError()) return;
            if (!(t.kind == TKind::Num && t.dim == Dim::volume())) {
                std::string hint = "order quantities are share counts: write e.g. `100vol`";
                if (t.isNumeric() && t.numDim() == Dim::notional()) hint = "divide a notional budget by a price to get shares: `budget / close[0]`";
                else if (t.isNumeric() && t.numDim() == Dim::price()) hint = "a price is not a quantity; did you mean a share count such as `100vol`?";
                d_.error("E403", s->a->line, s->a->col, std::string("order quantity of `") + (s->kind == NK::Buy ? "buy" : "sell") +
                                                            "` must be volume, found " + t.name())
                    .note(q(exprText(s->a)) + " has " + dimDesc(t))
                    .withHint(hint)
                    .caret(std::max(1, spanLen(s->a)));
            }
            break;
        }
        case NK::Flatten: res_.ordersIssued = true; break;
        default: break;
    }
}

Type Sema::expr(Node* e) {
    Type t;
    switch (e->kind) {
        case NK::NumLit:
            if (e->hasUnit) t = Type::num(e->unit);
            else if (e->isInt) t = Type::intT();
            else t = Type::num(Dim::scalar());
            e->ann.constValue = e->num;
            break;
        case NK::BoolLit:
            t = Type::boolT();
            e->ann.constValue = e->num;
            break;
        case NK::Ident: t = ident(e); break;
        case NK::Index: t = index(e); break;
        case NK::Call: t = call(e); break;
        case NK::UnOp: t = unop(e); break;
        case NK::BinOp: t = binop(e); break;
        default: t = Type::error();
    }
    e->ann.type = t;
    return t;
}

Type Sema::ident(Node* e) {
    Symbol* s = resolve(e->name, e->line, e->col);
    if (!s) return Type::error();
    e->ann.sym = s;
    int len = static_cast<int>(e->name.size());
    switch (s->kind) {
        case SymKind::Const:
            s->used = true;
            e->ann.constValue = s->constValue;
            e->ann.derivation = e->name + ": const " + s->type.name();
            return s->type;
        case SymKind::Param:
        case SymKind::State:
            if (inFunc_) {
                d_.error("E307", e->line, e->col, "func " + q(curFunc_ ? curFunc_->name : "?") + " reads " +
                                                      std::string(s->kind == SymKind::Param ? "param " : "state ") + q(e->name))
                    .note("func bodies are pure expressions over their parameters and consts")
                    .withHint("pass " + q(e->name) + " as an argument instead")
                    .caret(len);
                return Type::error();
            }
            s->used = true;
            e->ann.derivation = e->name + ": " + (s->kind == SymKind::Param ? "param " : "state ") + s->type.name();
            return s->type;
        case SymKind::Series:
        case SymKind::BuiltinSeries:
            if (inFunc_) {
                d_.error("E307", e->line, e->col, "func " + q(curFunc_ ? curFunc_->name : "?") + " reads series " + q(e->name))
                    .withHint("pass the value as an argument, e.g. `f(" + e->name + "[0])`")
                    .caret(len);
                return Type::error();
            }
            d_.error("E308", e->line, e->col, "bare series name " + q(e->name) + " used as a value")
                .note("a series is a sequence over bars; pick one bar with an index")
                .withHint("write `" + e->name + "[0]` for the current bar or `" + e->name + "[1]` for the previous one")
                .caret(len);
            return Type::error();
        case SymKind::Func:
        case SymKind::BuiltinFunc:
            d_.error("E304", e->line, e->col, "function " + q(e->name) + " used without a call")
                .withHint("call it with arguments, e.g. `" + e->name + "(...)`")
                .caret(len);
            return Type::error();
        case SymKind::Let:
        case SymKind::Formal:
            s->used = true;
            e->ann.derivation = e->name + ": " + s->type.name();
            return s->type;
    }
    return Type::error();
}

Type Sema::index(Node* e) {
    if (e->a->kind != NK::Ident) {
        d_.error("E308", e->line, e->col, "only series names can be indexed, not " + q(exprText(e->a)))
            .withHint("history indexing works on `open high low close volume` and declared series")
            .caret(std::max(1, spanLen(e->a)));
        return Type::error();
    }
    Node* base = e->a;
    Symbol* s = resolve(base->name, base->line, base->col);
    if (!s) return Type::error();
    base->ann.sym = s;
    int blen = static_cast<int>(base->name.size());
    if (s->kind != SymKind::Series && s->kind != SymKind::BuiltinSeries) {
        std::string extra = s->kind == SymKind::State ? "; state variables only hold their current value" : "";
        d_.error("E308", base->line, base->col, q(base->name) + " is a " + std::string(symKindName(s->kind)) +
                                                    ", not a series, so it cannot be indexed" + extra)
            .withHint("drop the `[...]`, or declare a `series` to keep history")
            .caret(blen);
        return Type::error();
    }
    if (inFunc_) {
        d_.error("E307", e->line, e->col, "func " + q(curFunc_ ? curFunc_->name : "?") + " reads series " + q(base->name))
            .note("func bodies are pure expressions over their parameters and consts")
            .withHint("pass `" + exprText(e) + "` as an argument instead")
            .caret(std::max(1, spanLen(e)));
        return Type::error();
    }
    long k = 0;
    if (!constInt(e->b, "E503", "a history index", &k)) return Type::error();
    if (k < 0) {
        d_.error("E501", e->b->line, e->b->col, q(exprText(e)) + " uses a negative history index: this reads a *future* bar")
            .note("`x[k]` means k bars ago, so k must be >= 0")
            .withHint("use `" + base->name + "[0]` for the current bar or a positive index for past bars")
            .caret(std::max(1, spanLen(e->b)));
        return Type::error();
    }
    if (s == curSeries_ && s) {
        if (inInit_) {
            d_.error("E306", e->line, e->col, "the init expression of series " + q(s->name) + " reads " + q(s->name) + " itself")
                .withHint("init seeds the first bar; it may only use other series and constants")
                .caret(std::max(1, spanLen(e)));
            return Type::error();
        }
        if (k >= 1 && !s->hasInit) {
            d_.error("E306", e->line, e->col, "recursive series " + q(s->name) + " reads its own history without an `init` clause")
                .note("on the first bar there is no `" + s->name + "[" + std::to_string(k) + "]` yet")
                .withHint("seed it: `series " + s->name + " : " + s->type.name() + " init <expr> = ...;`")
                .caret(std::max(1, spanLen(e)));
            return Type::error();
        }
    }
    if (k == 0 && curSeries_) deps_[curSeries_].push_back({s, e});
    if (s != curSeries_) noteRead(s, k);
    else s->maxHistoryRead = std::max(s->maxHistoryRead, k);
    e->ann.sym = s;
    e->ann.derivation = exprText(e) + ": series " + s->type.name() + " " + s->type.dim.vec() + ", " + std::to_string(k) + " bar(s) ago";
    return s->type;
}

Symbol* Sema::seriesArg(Node* arg, const char* fname) {
    if (arg->kind != NK::Ident) {
        std::string ex = arg->kind == NK::Index && arg->a->kind == NK::Ident ? arg->a->name : "close";
        d_.error("E404", arg->line, arg->col, std::string("argument of `") + fname + "` must be a bare series name, found " + q(exprText(arg)))
            .note(std::string("`") + fname + "` reads a whole window of history, not a single value")
            .withHint(std::string("write `") + fname + "(" + ex + ", ...)`")
            .caret(std::max(1, spanLen(arg)));
        return nullptr;
    }
    Symbol* s = resolve(arg->name, arg->line, arg->col);
    if (!s) return nullptr;
    arg->ann.sym = s;
    if (s->kind != SymKind::Series && s->kind != SymKind::BuiltinSeries) {
        d_.error("E404", arg->line, arg->col, q(arg->name) + " is a " + std::string(symKindName(s->kind)) + ", but `" + fname +
                                                  "` needs a series")
            .withHint("declare a `series` to aggregate over history")
            .caret(static_cast<int>(arg->name.size()));
        return nullptr;
    }
    if (inFunc_) {
        d_.error("E307", arg->line, arg->col, "func " + q(curFunc_ ? curFunc_->name : "?") + " reads series " + q(arg->name))
            .withHint("window functions may only be used in series and handlers")
            .caret(static_cast<int>(arg->name.size()));
        return nullptr;
    }
    if (curSeries_ && s == curSeries_ && inInit_) {
        d_.error("E306", arg->line, arg->col, "the init expression of series " + q(s->name) + " reads " + q(s->name) + " itself")
            .caret(static_cast<int>(arg->name.size()));
        return nullptr;
    }
    arg->ann.type = s->type;
    if (curSeries_) deps_[curSeries_].push_back({s, arg});
    return s;
}

Type Sema::call(Node* e) {
    Symbol* fn = st_.lookup(e->name);
    if (!fn || fn->kind == SymKind::BuiltinFunc) {
        std::string reason = lookaheadUnsafeReason(e->name);
        if (!reason.empty()) {
            d_.error("E505", e->line, e->col, reason)
                .note("a look-ahead function makes backtests look better than any live run could be")
                .withHint("use causal builtins such as `highest(high, N)`, `lowest(low, N)` or `ema(close, N)`")
                .caret(static_cast<int>(e->name.size()));
            return Type::error();
        }
    }
    fn = resolve(e->name, e->line, e->col, true);
    if (!fn) return Type::error();
    if (fn->kind == SymKind::BuiltinFunc) return builtinCall(e, fn);
    if (fn->kind != SymKind::Func) {
        d_.error("E304", e->line, e->col, q(e->name) + " is a " + std::string(symKindName(fn->kind)) + ", not a function")
            .withHint(fn->kind == SymKind::Series || fn->kind == SymKind::BuiltinSeries ? "index it with `[k]` instead of calling it" : "remove the `(...)`")
            .caret(static_cast<int>(e->name.size()));
        return Type::error();
    }
    fn->used = true;
    e->ann.sym = fn;
    Node* decl = fn->decl;
    std::vector<Type> argT;
    bool bad = false;
    for (Node* a : e->list) {
        argT.push_back(expr(a));
        bad |= argT.back().isError();
    }
    if (e->list.size() != decl->list.size()) {
        d_.error("E304", e->line, e->col, "func " + q(e->name) + " expects " + std::to_string(decl->list.size()) +
                                              " argument(s), found " + std::to_string(e->list.size()))
            .note(q(e->name) + " is declared at line " + std::to_string(decl->line))
            .caret(static_cast<int>(e->name.size()));
        return Type::error();
    }
    if (bad) return Type::error();
    for (size_t i = 0; i < e->list.size(); ++i) {
        Type ft = typeFromName(decl->list[i]->declType);
        if (ft.kind == TKind::Int) ft = Type::num(Dim::scalar());
        if (!compatible(ft, argT[i])) {
            d_.error("E407", e->list[i]->line, e->list[i]->col,
                     "argument " + std::to_string(i + 1) + " of " + q(e->name) + " has type " + argT[i].name() +
                         ", but parameter " + q(decl->list[i]->name) + " is declared " + ft.name())
                .note("found " + dimDesc(argT[i]) + ", expected " + dimDesc(ft))
                .caret(std::max(1, spanLen(e->list[i])));
            return Type::error();
        }
    }
    Type rt = typeFromName(decl->declType);
    if (rt.kind == TKind::Int) rt = Type::num(Dim::scalar());
    e->ann.derivation = e->name + "(...): func -> " + rt.name() + " (inlined)";
    return rt;
}

Type Sema::builtinCall(Node* e, Symbol* fnSym) {
    const Builtin* b = findBuiltin(e->name);
    fnSym->used = true;
    int len = static_cast<int>(e->name.size());
    if (static_cast<int>(e->list.size()) != b->arity) {
        d_.error("E304", e->line, e->col, q(e->name) + " expects " + std::to_string(b->arity) + " argument(s), found " +
                                              std::to_string(e->list.size()))
            .note(std::string("signature: ") + e->name + " " + b->signature)
            .caret(len);
        return Type::error();
    }
    auto numArg = [&](Node* a, Type& t) -> bool {
        t = expr(a);
        if (t.isError()) return false;
        if (t.isBool()) {
            d_.error("E408", a->line, a->col, std::string("`") + e->name + "` needs a number, found bool " + q(exprText(a)))
                .caret(std::max(1, spanLen(a)));
            return false;
        }
        return true;
    };
    auto allConst = [&]() {
        for (Node* a : e->list)
            if (!a->ann.constValue) return false;
        return true;
    };
    auto cv = [&](size_t i) { return *e->list[i]->ann.constValue; };

    switch (b->kind) {
        case BKind::Window: {
            Symbol* s = seriesArg(e->list[0], b->name);
            long n = 0;
            bool okN = constInt(e->list[1], "E503", std::string("the window size of `") + b->name + "`", &n);
            if (!s || !okN) return Type::error();
            if (n < 1) {
                d_.error("E503", e->list[1]->line, e->list[1]->col, std::string("window size of `") + b->name + "` must be >= 1, found " + std::to_string(n))
                    .caret(std::max(1, spanLen(e->list[1])));
                return Type::error();
            }
            std::string nm = e->name;
            long reach = (nm == "mean" || nm == "sum" || nm == "std") ? n : (nm == "ema" ? 0 : n - 1);
            if (s != curSeries_) noteRead(s, reach);
            e->num = static_cast<double>(n);
            e->ann.sym = s;
            e->ann.derivation = e->name + "(" + s->name + ", " + std::to_string(n) + "): series " + s->type.name() + " -> " + s->type.name();
            return s->type;
        }
        case BKind::Cross: {
            Symbol* a = seriesArg(e->list[0], b->name);
            Symbol* c = seriesArg(e->list[1], b->name);
            if (!a || !c) return Type::error();
            if (a->type.dim != c->type.dim) {
                d_.error("E401", e->line, e->col, std::string("`") + e->name + "` compares " + q(a->type.name()) + " with " + q(c->type.name()))
                    .note("first series has " + dimDesc(a->type) + ", second has " + dimDesc(c->type))
                    .withHint("both series must have the same dimension")
                    .caret(len);
                return Type::error();
            }
            if (a != curSeries_) noteRead(a, 1);
            if (c != curSeries_) noteRead(c, 1);
            e->ann.sym = a;
            e->ann.derivation = e->name + ": (series " + a->type.name() + ", series " + c->type.name() + ") -> bool";
            return Type::boolT();
        }
        case BKind::Abs: {
            Type t;
            if (!numArg(e->list[0], t)) return Type::error();
            if (allConst()) e->ann.constValue = std::fabs(cv(0));
            e->ann.derivation = "abs: " + t.numDim().vec() + " -> " + t.numDim().vec() + " " + t.numDim().name();
            return Type::num(t.numDim());
        }
        case BKind::MinMax:
        case BKind::Clamp: {
            std::vector<Type> ts(e->list.size());
            for (size_t i = 0; i < e->list.size(); ++i)
                if (!numArg(e->list[i], ts[i])) return Type::error();
            for (size_t i = 1; i < ts.size(); ++i) {
                if (ts[i].numDim() != ts[0].numDim()) {
                    std::string hint = literalHint(e->list[0], ts[0], e->list[i], ts[i]);
                    d_.error("E401", e->list[i]->line, e->list[i]->col, std::string("arguments of `") + e->name + "` must have the same dimension: " +
                                                                            q(ts[0].numDim().name()) + " vs " + q(ts[i].numDim().name()))
                        .note("argument 1 has " + dimDesc(ts[0]) + ", argument " + std::to_string(i + 1) + " has " + dimDesc(ts[i]))
                        .withHint(hint.empty() ? "convert one side so both dimensions agree" : hint)
                        .caret(std::max(1, spanLen(e->list[i])));
                    return Type::error();
                }
            }
            if (allConst()) {
                if (e->name == "min") e->ann.constValue = std::min(cv(0), cv(1));
                else if (e->name == "max") e->ann.constValue = std::max(cv(0), cv(1));
                else e->ann.constValue = std::min(std::max(cv(0), cv(1)), cv(2));
            }
            e->ann.derivation = e->name + ": all arguments " + ts[0].numDim().vec() + " -> " + ts[0].numDim().name();
            return Type::num(ts[0].numDim());
        }
        case BKind::Sign: {
            Type t;
            if (!numArg(e->list[0], t)) return Type::error();
            if (allConst()) e->ann.constValue = static_cast<double>((cv(0) > 0) - (cv(0) < 0));
            e->ann.derivation = "sign: " + t.numDim().vec() + " -> (0,0) scalar";
            return Type::num(Dim::scalar());
        }
        case BKind::Sqrt: {
            Type t;
            if (!numArg(e->list[0], t)) return Type::error();
            Dim dm = t.numDim();
            if (dm.p % 2 != 0 || dm.v % 2 != 0) {
                d_.error("E405", e->line, e->col, "`sqrt` of " + q(dm.name()) + " " + dm.vec() + " has no dimension: both exponents must be even")
                    .note("sqrt halves each exponent; " + dm.vec() + " / 2 is not an integer vector")
                    .withHint("take sqrt of a squared quantity (e.g. a variance in price^2) or of a scalar ratio such as `close[0] / close[1]`")
                    .caret(len);
                return Type::error();
            }
            Dim r(dm.p / 2, dm.v / 2);
            if (allConst() && cv(0) >= 0) e->ann.constValue = std::sqrt(cv(0));
            e->ann.derivation = "sqrt: " + dm.vec() + " / 2 = " + r.vec() + " " + r.name();
            return Type::num(r);
        }
        case BKind::Pow: {
            Type t;
            if (!numArg(e->list[0], t)) return Type::error();
            Node* kn = e->list[1];
            Type kt = expr(kn);
            if (kt.isError()) return Type::error();
            if (!kn->ann.constValue || kt.isBool() || !kt.numDim().isScalar() || *kn->ann.constValue != std::floor(*kn->ann.constValue)) {
                if (const Node* p = findParam(kn)) {
                    d_.error("E504", p->line, p->col, q(p->name) + " is a runtime `param` and cannot be used as the exponent of `pow`")
                        .withHint("the result dimension depends on the exponent, so it must be a `const` integer")
                        .caret(static_cast<int>(p->name.size()));
                } else {
                    d_.error("E406", kn->line, kn->col, "`pow` exponent must be a compile-time constant integer, found " + q(exprText(kn)))
                        .note("the result dimension D^k depends on k, so k must be known at compile time")
                        .withHint("use an integer literal or an `int` const, e.g. `pow(x, 2)`")
                        .caret(std::max(1, spanLen(kn)));
                }
                return Type::error();
            }
            int k = static_cast<int>(*kn->ann.constValue);
            Dim r = t.numDim().scaled(k);
            if (allConst()) e->ann.constValue = std::pow(cv(0), k);
            e->ann.derivation = "pow: " + t.numDim().vec() + " * " + std::to_string(k) + " = " + r.vec() + " " + r.name();
            return Type::num(r);
        }
        case BKind::LogExp: {
            Type t;
            if (!numArg(e->list[0], t)) return Type::error();
            if (!t.numDim().isScalar()) {
                d_.error("E404", e->list[0]->line, e->list[0]->col, std::string("`") + e->name + "` needs a scalar argument, found " + q(t.numDim().name()) + " " + t.numDim().vec())
                    .note("transcendental functions are only defined on dimensionless numbers")
                    .withHint(e->name == "log" ? "take the log of a ratio, e.g. `log(close[0] / close[1])`" : "divide by a reference value first to get a scalar")
                    .caret(std::max(1, spanLen(e->list[0])));
                return Type::error();
            }
            if (allConst()) {
                double x = cv(0);
                if (e->name == "exp") e->ann.constValue = std::exp(x);
                else if (x > 0) e->ann.constValue = std::log(x);
            }
            e->ann.derivation = e->name + ": (0,0) -> (0,0) scalar";
            return Type::num(Dim::scalar());
        }
    }
    return Type::error();
}

Type Sema::unop(Node* e) {
    Type t = expr(e->a);
    if (t.isError()) return t;
    if (e->name == "-") {
        if (t.isBool()) {
            d_.error("E408", e->line, e->col, "cannot negate bool " + q(exprText(e->a)))
                .withHint("use `!` for logical negation")
                .caret(1);
            return Type::error();
        }
        if (e->a->ann.constValue) e->ann.constValue = -*e->a->ann.constValue;
        e->ann.derivation = "-" + t.numDim().vec() + " = " + t.numDim().vec() + " " + t.name();
        return t;
    }
    if (!t.isBool()) {
        d_.error("E408", e->line, e->col, "`!` needs a bool operand, found " + t.name())
            .withHint("compare the value first, e.g. `!(x > 0" + suffixFor(t.numDim()) + ")`")
            .caret(1);
        return Type::error();
    }
    if (e->a->ann.constValue) e->ann.constValue = *e->a->ann.constValue == 0 ? 1.0 : 0.0;
    e->ann.derivation = "!bool = bool";
    return t;
}

Type Sema::binop(Node* e) {
    Type l = expr(e->a);
    Type r = expr(e->b);
    if (l.isError() || r.isError()) return Type::error();
    const std::string& op = e->name;
    auto withRanges = [&](Diagnostic& dg) -> Diagnostic& {
        if (e->a->sline == e->line) dg.range(e->a->sline, e->a->scol, spanLen(e->a));
        if (e->b->sline == e->line) dg.range(e->b->sline, e->b->scol, spanLen(e->b));
        dg.caret(static_cast<int>(op.size()));
        return dg;
    };
    std::optional<double> lc = e->a->ann.constValue, rc = e->b->ann.constValue;
    bool arith = op == "+" || op == "-" || op == "*" || op == "/";
    bool cmp = op == "<" || op == "<=" || op == ">" || op == ">=" || op == "==" || op == "!=";
    if (arith) {
        if (l.isBool() || r.isBool()) {
            withRanges(d_.error("E408", e->line, e->col, "bool used in arithmetic: `" + op + "` needs numbers, found " + l.name() + " and " + r.name()))
                .withHint("arithmetic is only defined on numeric dimensions");
            return Type::error();
        }
        if (op == "/" && rc && *rc == 0)
            withRanges(d_.warning("W603", e->line, e->col, "division by constant zero"))
                .withHint("the result is infinite or NaN at run time; the optimizer will not fold it");
        if (l.kind == TKind::Int && r.kind == TKind::Int && op != "/") {
            double a = *lc, b = *rc;
            e->ann.constValue = op == "+" ? a + b : op == "-" ? a - b : a * b;
            e->ann.derivation = "int " + op + " int = int";
            return Type::intT();
        }
        Dim dl = l.numDim(), dr = r.numDim();
        if (lc && rc) {
            double a = *lc, b = *rc;
            if (op == "+") e->ann.constValue = a + b;
            else if (op == "-") e->ann.constValue = a - b;
            else if (op == "*") e->ann.constValue = a * b;
            else if (b != 0) e->ann.constValue = a / b;
        }
        if (op == "+" || op == "-") {
            if (dl != dr) {
                std::string msg = op == "+" ? "cannot add " + q(dl.name()) + " and " + q(dr.name())
                                            : "cannot subtract " + q(dr.name()) + " from " + q(dl.name());
                std::string hint = literalHint(e->a, l, e->b, r);
                if (hint.empty() && ((dl == Dim::price() && dr == Dim::volume()) || (dl == Dim::volume() && dr == Dim::price())))
                    hint = "if you want traded value, use `*` to get notional";
                if (hint.empty()) hint = "both operands of `" + op + "` must have the same dimension";
                withRanges(d_.error("E401", e->line, e->col, msg))
                    .note("left operand has dimension " + dl.name() + " " + dl.vec() + ", right has " + dr.name() + " " + dr.vec())
                    .withHint(hint);
                return Type::error();
            }
            e->ann.derivation = dl.name() + " " + op + " " + dr.name() + " = " + dl.vec() + " " + dl.name();
            return Type::num(dl);
        }
        Dim res = op == "*" ? dl + dr : dl - dr;
        e->ann.derivation = dl.vec() + (op == "*" ? "+" : "-") + dr.vec() + " = " + res.vec() + " " + res.name();
        return Type::num(res);
    }
    if (cmp) {
        if (l.isBool() && r.isBool() && (op == "==" || op == "!=")) {
            if (lc && rc) e->ann.constValue = (op == "==") == (*lc == *rc) ? 1.0 : 0.0;
            e->ann.derivation = "bool " + op + " bool = bool";
            return Type::boolT();
        }
        if (l.isBool() || r.isBool()) {
            withRanges(d_.error("E408", e->line, e->col, "cannot compare " + l.name() + " with " + r.name() + " using `" + op + "`"))
                .withHint(l.isBool() && r.isBool() ? "ordering comparisons are only defined on numbers" : "a bool can only be compared with another bool");
            return Type::error();
        }
        Dim dl = l.numDim(), dr = r.numDim();
        if (dl != dr) {
            std::string hint = literalHint(e->a, l, e->b, r);
            if (hint.empty()) hint = "both sides of a comparison must have the same dimension";
            withRanges(d_.error("E401", e->line, e->col, "cannot compare " + q(dl.name()) + " with " + q(dr.name())))
                .note("left operand has dimension " + dl.name() + " " + dl.vec() + ", right has " + dr.name() + " " + dr.vec())
                .withHint(hint);
            return Type::error();
        }
        if (lc && rc) {
            double a = *lc, b = *rc;
            bool v = op == "<" ? a < b : op == "<=" ? a <= b : op == ">" ? a > b : op == ">=" ? a >= b : op == "==" ? a == b : a != b;
            e->ann.constValue = v ? 1.0 : 0.0;
        }
        e->ann.derivation = dl.vec() + " " + op + " " + dr.vec() + " -> bool";
        return Type::boolT();
    }
    // && ||
    if (!l.isBool() || !r.isBool()) {
        const Node* bad = !l.isBool() ? e->a : e->b;
        Type bt = !l.isBool() ? l : r;
        withRanges(d_.error("E408", e->line, e->col, "number used in logic: `" + op + "` needs bool operands, found " + bt.name()))
            .note(q(exprText(bad)) + " has " + dimDesc(bt))
            .withHint("compare the value first, e.g. `" + exprText(bad) + " > 0" + suffixFor(bt.numDim()) + "`");
        return Type::error();
    }
    if (lc && rc) e->ann.constValue = op == "&&" ? ((*lc != 0) && (*rc != 0) ? 1.0 : 0.0) : ((*lc != 0) || (*rc != 0) ? 1.0 : 0.0);
    e->ann.derivation = "bool " + op + " bool = bool";
    return Type::boolT();
}

// ---- pass 3: series dependency graph ---------------------------------------

void Sema::dependencyPass() {
    std::vector<Symbol*> series;
    for (Node* it : prog_->list)
        if (it->kind == NK::SeriesDecl && it->ann.sym) series.push_back(it->ann.sym);

    // Cycle detection on zero-delay edges (b reads a[0] => a -> b; we walk reads).
    std::map<Symbol*, int> color;  // 0 white, 1 grey, 2 black
    std::vector<Symbol*> path;
    std::set<Symbol*> reported;
    std::function<void(Symbol*)> dfs = [&](Symbol* s) {
        color[s] = 1;
        path.push_back(s);
        for (auto& [r, at] : deps_[s]) {
            if (r->kind != SymKind::Series) continue;
            if (color[r] == 1) {
                // cycle: r ... s -> r
                std::string p;
                bool on = false;
                for (Symbol* x : path) {
                    if (x == r) on = true;
                    if (on) p += x->name + " → ";
                }
                p += r->name;
                if (!reported.count(r)) {
                    reported.insert(r);
                    d_.error("E306", at->line, at->col, "zero-delay cyclic series dependency: " + p)
                        .note("series " + q(s->name) + " needs " + q(r->name + "[0]") + " on the same bar it is being computed")
                        .withHint("read an earlier bar (e.g. `" + r->name + "[1]` with an `init` clause) to break the cycle")
                        .caret(static_cast<int>(r->name.size()));
                }
            } else if (color[r] == 0) {
                dfs(r);
            }
        }
        path.pop_back();
        color[s] = 2;
    };
    for (Symbol* s : series)
        if (color[s] == 0) dfs(s);
    if (!reported.empty()) return;

    // Topological order (Kahn), ties broken by declaration order.
    std::map<Symbol*, int> indeg;
    std::map<Symbol*, std::vector<Symbol*>> out;
    for (Symbol* s : series) indeg[s] = 0;
    for (Symbol* s : series) {
        std::set<Symbol*> seen;
        for (auto& [r, at] : deps_[s]) {
            (void)at;
            if (r->kind != SymKind::Series || !seen.insert(r).second) continue;
            out[r].push_back(s);
            indeg[s]++;
        }
    }
    std::vector<Symbol*> ready;
    for (Symbol* s : series)
        if (indeg[s] == 0) ready.push_back(s);
    while (!ready.empty()) {
        auto it = std::min_element(ready.begin(), ready.end(), [](Symbol* a, Symbol* b) { return a->order < b->order; });
        Symbol* s = *it;
        ready.erase(it);
        res_.seriesTopo.push_back(s);
        for (Symbol* n : out[s])
            if (--indeg[n] == 0) ready.push_back(n);
    }
}

void Sema::warnings() {
    for (Symbol* s : st_.allSymbols()) {
        if (s->declLine == 0 || s->used || (!s->name.empty() && s->name[0] == '_')) continue;
        switch (s->kind) {
            case SymKind::Const: case SymKind::Param: case SymKind::State: case SymKind::Series:
            case SymKind::Func: case SymKind::Let: case SymKind::Formal: {
                std::string what = s->kind == SymKind::State ? "state " : s->kind == SymKind::Formal ? "parameter " : "";
                d_.warning("W601", s->declLine, s->declCol, what + q(s->name) + " is declared but never read")
                    .withHint("remove it, or prefix it with `_` to document that it is intentionally unused")
                    .caret(static_cast<int>(s->name.size()));
                break;
            }
            default: break;
        }
    }
    if (!res_.handlers[0] && !res_.handlers[1])
        d_.warning("W602", prog_->line, prog_->col, "strategy " + q(prog_->name) + " has no handlers")
            .withHint("add `on bar_close { ... }` to issue orders")
            .caret(static_cast<int>(prog_->name.size()));
    else if (!res_.ordersIssued)
        d_.warning("W602", prog_->line, prog_->col, "strategy " + q(prog_->name) + " never issues orders")
            .withHint("use `buy`, `sell` or `flatten` in a handler")
            .caret(static_cast<int>(prog_->name.size()));
}
