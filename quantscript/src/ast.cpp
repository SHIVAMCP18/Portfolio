#include "ast.hpp"

#include <cstdio>
#include <sstream>

#include "symtab.hpp"

const char* nkName(NK k) {
    switch (k) {
        case NK::Program: return "Program";
        case NK::ConstDecl: return "ConstDecl";
        case NK::ParamDecl: return "ParamDecl";
        case NK::StateDecl: return "StateDecl";
        case NK::SeriesDecl: return "SeriesDecl";
        case NK::FuncDecl: return "FuncDecl";
        case NK::Formal: return "Formal";
        case NK::Handler: return "Handler";
        case NK::Block: return "Block";
        case NK::Let: return "Let";
        case NK::Assign: return "Assign";
        case NK::If: return "If";
        case NK::Buy: return "Buy";
        case NK::Sell: return "Sell";
        case NK::Flatten: return "Flatten";
        case NK::BinOp: return "BinOp";
        case NK::UnOp: return "UnOp";
        case NK::Index: return "Index";
        case NK::Call: return "Call";
        case NK::NumLit: return "NumLit";
        case NK::BoolLit: return "BoolLit";
        case NK::Ident: return "Ident";
        case NK::List: return "List";
    }
    return "?";
}

static int precOf(const std::string& op) {
    if (op == "||") return 1;
    if (op == "&&") return 2;
    if (op == "==" || op == "!=") return 3;
    if (op == "<" || op == "<=" || op == ">" || op == ">=") return 4;
    if (op == "+" || op == "-") return 5;
    if (op == "*" || op == "/") return 6;
    return 9;
}

std::string exprText(const Node* n) {
    if (!n) return "";
    switch (n->kind) {
        case NK::NumLit: return n->lexeme;
        case NK::BoolLit: return n->num != 0 ? "true" : "false";
        case NK::Ident: return n->name;
        case NK::Index: return exprText(n->a) + "[" + exprText(n->b) + "]";
        case NK::Call: {
            std::string s = n->name + "(";
            for (size_t i = 0; i < n->list.size(); ++i) s += (i ? ", " : "") + exprText(n->list[i]);
            return s + ")";
        }
        case NK::UnOp: {
            std::string inner = exprText(n->a);
            if (n->a->kind == NK::BinOp) inner = "(" + inner + ")";
            return n->name + inner;
        }
        case NK::BinOp: {
            int p = precOf(n->name);
            std::string l = exprText(n->a), r = exprText(n->b);
            if (n->a->kind == NK::BinOp && precOf(n->a->name) < p) l = "(" + l + ")";
            if (n->b->kind == NK::BinOp && precOf(n->b->name) <= p) r = "(" + r + ")";
            return l + " " + n->name + " " + r;
        }
        default: return nkName(n->kind);
    }
}

static std::string fmtNum(double v) {
    char buf[40];
    std::snprintf(buf, sizeof buf, "%g", v);
    return buf;
}

static std::string annText(const Node* n) {
    std::string s;
    if (n->ann.type.kind != TKind::Error && n->ann.type.kind != TKind::Void) {
        s += " : " + n->ann.type.name();
        if (n->ann.type.isNumeric()) s += " " + n->ann.type.numDim().vec();
    }
    if (n->ann.stamp.valid) s += " @(" + std::to_string(n->ann.stamp.d) + "," + std::string(1, n->ann.stamp.phase) + ")";
    if (n->ann.constValue) s += " =" + fmtNum(*n->ann.constValue);
    return s;
}

static void textRec(const Node* n, int depth, std::ostringstream& os, const std::string& label = "") {
    if (!n) return;
    os << std::string(static_cast<size_t>(depth * 2), ' ');
    if (!label.empty()) os << label << ": ";
    os << nkName(n->kind);
    switch (n->kind) {
        case NK::Program: os << " " << n->name; break;
        case NK::ConstDecl: case NK::ParamDecl: case NK::StateDecl: case NK::SeriesDecl:
        case NK::Formal:
            os << " " << n->name << " : " << typeNameStr(n->declType); break;
        case NK::FuncDecl: os << " " << n->name << " -> " << typeNameStr(n->declType); break;
        case NK::Handler: os << (n->handlerKind == 0 ? " bar_open" : " bar_close"); break;
        case NK::Let:
            os << " " << n->name;
            if (n->hasType) os << " : " << typeNameStr(n->declType);
            break;
        case NK::Assign: os << " " << n->name; break;
        case NK::BinOp: case NK::UnOp: os << " " << n->name; break;
        case NK::Call: os << " " << n->name; break;
        case NK::NumLit: os << " " << n->lexeme; break;
        case NK::BoolLit: os << (n->num != 0 ? " true" : " false"); break;
        case NK::Ident: os << " " << n->name; break;
        default: break;
    }
    os << annText(n) << "  [" << n->line << ":" << n->col << "]\n";
    if (n->kind == NK::SeriesDecl) {
        if (n->b) textRec(n->b, depth + 1, os, "init");
        textRec(n->a, depth + 1, os, "expr");
        return;
    }
    if (n->kind == NK::If) {
        textRec(n->a, depth + 1, os, "cond");
        textRec(n->b, depth + 1, os, "then");
        if (n->c) textRec(n->c, depth + 1, os, "else");
        return;
    }
    for (Node* ch : n->list) textRec(ch, depth + 1, os);
    textRec(n->a, depth + 1, os);
    textRec(n->b, depth + 1, os);
    textRec(n->c, depth + 1, os);
}

std::string astToText(const Node* n) {
    std::ostringstream os;
    textRec(n, 0, os);
    return os.str();
}

static Json annJson(const Node* n) {
    Json a = Json::object();
    const Type& t = n->ann.type;
    a.set("type", t.kind == TKind::Error ? "" : t.name());
    if (t.isNumeric()) {
        Json d = Json::array();
        d.push(t.numDim().p);
        d.push(t.numDim().v);
        a.set("dim", d);
    }
    if (n->ann.stamp.valid) {
        Json s = Json::array();
        s.push(n->ann.stamp.d);
        s.push(std::string(1, n->ann.stamp.phase));
        a.set("stamp", s);
    }
    if (n->ann.constValue) a.set("const", *n->ann.constValue);
    if (n->ann.sym) a.set("sym", symKindName(n->ann.sym->kind));
    if (!n->ann.derivation.empty()) a.set("derivation", n->ann.derivation);
    return a;
}

Json astToJson(const Node* n) {
    Json o = Json::object();
    if (!n) return o;
    o.set("kind", nkName(n->kind));
    o.set("line", n->line);
    o.set("col", n->col);
    Json span = Json::array();
    span.push(n->sline);
    span.push(n->scol);
    span.push(n->eline);
    span.push(n->ecol);
    o.set("span", span);
    std::string label;
    switch (n->kind) {
        case NK::NumLit: label = n->lexeme; break;
        case NK::BoolLit: label = n->num != 0 ? "true" : "false"; break;
        case NK::Handler: label = n->handlerKind == 0 ? "bar_open" : "bar_close"; break;
        default: label = n->name;
    }
    o.set("label", label);
    if (n->kind == NK::ConstDecl || n->kind == NK::ParamDecl || n->kind == NK::StateDecl ||
        n->kind == NK::SeriesDecl || n->kind == NK::FuncDecl || n->kind == NK::Formal || (n->kind == NK::Let && n->hasType))
        o.set("declType", typeNameStr(n->declType));
    o.set("ann", annJson(n));
    Json ch = Json::array();
    auto add = [&](const Node* c, const char* role) {
        if (!c) return;
        Json j = astToJson(c);
        if (role) j.set("role", role);
        ch.push(j);
    };
    if (n->kind == NK::SeriesDecl) {
        add(n->b, "init");
        add(n->a, "expr");
    } else {
        for (Node* c : n->list) add(c, nullptr);
        add(n->a, nullptr);
        add(n->b, nullptr);
        add(n->c, n->kind == NK::If ? "else" : nullptr);
    }
    o.set("children", ch);
    return o;
}

// ---- parse tree ----------------------------------------------------------

static Json leaf(const std::string& tok) {
    Json o = Json::object();
    o.set("name", tok);
    o.set("terminal", true);
    o.set("children", Json::array());
    return o;
}

static Json ptNode(const std::string& name, const Node* n) {
    Json o = Json::object();
    o.set("name", name);
    Json span = Json::array();
    span.push(n->sline);
    span.push(n->scol);
    span.push(n->eline);
    span.push(n->ecol);
    o.set("span", span);
    o.set("children", Json::array());
    return o;
}

static Json ptExpr(const Node* n);

static Json withKids(Json o, std::vector<Json> kids) {
    Json arr = Json::array();
    for (auto& k : kids) arr.push(k);
    o.set("children", arr);
    return o;
}

static Json typeLeaf(TypeName t) {
    Json o = leaf("type");
    Json arr = Json::array();
    arr.push(leaf(std::string("'") + typeNameStr(t) + "'"));
    o.set("terminal", false);
    o.set("children", arr);
    return o;
}

static Json ptExpr(const Node* n) {
    switch (n->kind) {
        case NK::NumLit: {
            const char* tk = n->hasUnit ? "UNIT_LIT" : n->isPct ? "PCT_LIT" : n->isInt ? "INT_LIT" : "FLOAT_LIT";
            return withKids(ptNode("primary", n), {leaf(std::string(tk) + " " + n->lexeme)});
        }
        case NK::BoolLit: return withKids(ptNode("primary", n), {leaf(n->num != 0 ? "'true'" : "'false'")});
        case NK::Ident:
            return withKids(ptNode("primary", n), {withKids(ptNode("name", n), {leaf((n->name == "volume" ? "'volume'" : "IDENT ") + (n->name == "volume" ? std::string() : n->name))})});
        case NK::Index:
            return withKids(ptNode("postfix", n), {ptExpr(n->a), leaf("'['"), ptExpr(n->b), leaf("']'")});
        case NK::Call: {
            std::vector<Json> k;
            k.push_back(withKids(ptNode("name", n), {leaf("IDENT " + n->name)}));
            k.push_back(leaf("'('"));
            if (!n->list.empty()) {
                Json args = ptNode("args", n);
                std::vector<Json> ak;
                for (size_t i = 0; i < n->list.size(); ++i) {
                    if (i) ak.push_back(leaf("','"));
                    ak.push_back(ptExpr(n->list[i]));
                }
                k.push_back(withKids(args, ak));
            }
            k.push_back(leaf("')'"));
            return withKids(ptNode("primary", n), k);
        }
        case NK::UnOp: return withKids(ptNode("expr", n), {leaf("'" + n->name + "'"), ptExpr(n->a)});
        case NK::BinOp: return withKids(ptNode("expr", n), {ptExpr(n->a), leaf("'" + n->name + "'"), ptExpr(n->b)});
        default: return ptNode(nkName(n->kind), n);
    }
}

static Json ptStmt(const Node* n);

static Json ptBlock(const Node* n) {
    std::vector<Json> k{leaf("'{'")};
    Json stmts = ptNode("stmts", n);
    std::vector<Json> sk;
    for (Node* s : n->list) sk.push_back(ptStmt(s));
    k.push_back(withKids(stmts, sk));
    k.push_back(leaf("'}'"));
    return withKids(ptNode("block", n), k);
}

static Json ptStmt(const Node* n) {
    switch (n->kind) {
        case NK::Let: {
            std::vector<Json> k{leaf("'let'"), leaf("IDENT " + n->name)};
            if (n->hasType) { k.push_back(leaf("':'")); k.push_back(typeLeaf(n->declType)); }
            k.push_back(leaf("'='"));
            k.push_back(ptExpr(n->a));
            k.push_back(leaf("';'"));
            return withKids(ptNode("stmt", n), k);
        }
        case NK::Assign:
            return withKids(ptNode("stmt", n), {leaf("IDENT " + n->name), leaf("'='"), ptExpr(n->a), leaf("';'")});
        case NK::If: {
            std::vector<Json> k{leaf("'if'"), leaf("'('"), ptExpr(n->a), leaf("')'"), ptBlock(n->b)};
            if (n->c) { k.push_back(leaf("'else'")); k.push_back(ptBlock(n->c)); }
            return withKids(ptNode("stmt", n), k);
        }
        case NK::Buy: return withKids(ptNode("stmt", n), {leaf("'buy'"), ptExpr(n->a), leaf("';'")});
        case NK::Sell: return withKids(ptNode("stmt", n), {leaf("'sell'"), ptExpr(n->a), leaf("';'")});
        case NK::Flatten: return withKids(ptNode("stmt", n), {leaf("'flatten'"), leaf("';'")});
        default: return ptNode(nkName(n->kind), n);
    }
}

static Json ptItem(const Node* n) {
    Json it;
    switch (n->kind) {
        case NK::ConstDecl: case NK::ParamDecl: case NK::StateDecl: {
            const char* kw = n->kind == NK::ConstDecl ? "const" : n->kind == NK::ParamDecl ? "param" : "state";
            std::string nt = std::string(kw) + "_decl";
            it = withKids(ptNode(nt, n), {leaf(std::string("'") + kw + "'"), leaf("IDENT " + n->name), leaf("':'"),
                                          typeLeaf(n->declType), leaf("'='"), ptExpr(n->a), leaf("';'")});
            break;
        }
        case NK::SeriesDecl: {
            std::vector<Json> k{leaf("'series'"), leaf("IDENT " + n->name), leaf("':'"), typeLeaf(n->declType)};
            if (n->b) {
                Json io = ptNode("init_opt", n->b);
                k.push_back(withKids(io, {leaf("'init'"), ptExpr(n->b)}));
            }
            k.push_back(leaf("'='"));
            k.push_back(ptExpr(n->a));
            k.push_back(leaf("';'"));
            it = withKids(ptNode("series_decl", n), k);
            break;
        }
        case NK::FuncDecl: {
            std::vector<Json> k{leaf("'func'"), leaf("IDENT " + n->name), leaf("'('")};
            if (!n->list.empty()) {
                std::vector<Json> fk;
                for (size_t i = 0; i < n->list.size(); ++i) {
                    if (i) fk.push_back(leaf("','"));
                    const Node* f = n->list[i];
                    fk.push_back(withKids(ptNode("formal", f), {leaf("IDENT " + f->name), leaf("':'"), typeLeaf(f->declType)}));
                }
                k.push_back(withKids(ptNode("formals", n), fk));
            }
            k.push_back(leaf("')'"));
            k.push_back(leaf("'->'"));
            k.push_back(typeLeaf(n->declType));
            k.push_back(leaf("'='"));
            k.push_back(ptExpr(n->a));
            k.push_back(leaf("';'"));
            it = withKids(ptNode("func_decl", n), k);
            break;
        }
        case NK::Handler:
            it = withKids(ptNode("handler", n), {leaf("'on'"), leaf(n->handlerKind == 0 ? "'bar_open'" : "'bar_close'"), ptBlock(n->a)});
            break;
        default: it = ptNode(nkName(n->kind), n);
    }
    return withKids(ptNode("item", n), {it});
}

Json parseTreeJson(const Node* n) {
    if (!n) return Json();
    std::vector<Json> items;
    for (Node* i : n->list) items.push_back(ptItem(i));
    Json itemsNode = ptNode("items", n);
    return withKids(ptNode("program", n), {leaf("'strategy'"), leaf("IDENT " + n->name), leaf("'{'"), withKids(itemsNode, items), leaf("'}'")});
}
