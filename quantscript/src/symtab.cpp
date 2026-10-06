#include "symtab.hpp"

#include <algorithm>
#include <sstream>

const char* symKindName(SymKind k) {
    switch (k) {
        case SymKind::Const: return "Const";
        case SymKind::Param: return "Param";
        case SymKind::State: return "State";
        case SymKind::Series: return "Series";
        case SymKind::Func: return "Func";
        case SymKind::Let: return "Let";
        case SymKind::Formal: return "Formal";
        case SymKind::BuiltinSeries: return "BuiltinSeries";
        case SymKind::BuiltinFunc: return "BuiltinFunc";
    }
    return "?";
}

SymTab::SymTab() {
    Scope g;
    g.id = 0;
    g.parent = -1;
    g.kind = "global";
    scopes_.push_back(g);
    stack_.push_back(0);
}

int SymTab::enter(const std::string& kind) {
    Scope s;
    s.id = static_cast<int>(scopes_.size());
    s.parent = stack_.back();
    s.kind = kind;
    scopes_.push_back(s);
    stack_.push_back(s.id);
    return s.id;
}

void SymTab::exit() {
    if (stack_.size() > 1) stack_.pop_back();
}

Symbol* SymTab::declare(const std::string& name, SymKind kind, Type type, int line, int col, Symbol** existing) {
    Scope& sc = scopes_[stack_.back()];
    auto it = sc.map.find(name);
    if (it != sc.map.end()) {
        if (existing) *existing = it->second;
        return nullptr;
    }
    owned_.push_back(std::make_unique<Symbol>());
    Symbol* s = owned_.back().get();
    s->name = name;
    s->kind = kind;
    s->type = type;
    s->declLine = line;
    s->declCol = col;
    s->scope = sc.id;
    s->isMutable = kind == SymKind::State;
    sc.map[name] = s;
    sc.syms.push_back(s);
    return s;
}

Symbol* SymTab::lookup(const std::string& name) const {
    for (auto it = stack_.rbegin(); it != stack_.rend(); ++it) {
        const Scope& sc = scopes_[*it];
        auto f = sc.map.find(name);
        if (f != sc.map.end()) return f->second;
    }
    return nullptr;
}

int editDistance(const std::string& a, const std::string& b) {
    std::vector<int> prev(b.size() + 1), cur(b.size() + 1);
    for (size_t j = 0; j <= b.size(); ++j) prev[j] = static_cast<int>(j);
    for (size_t i = 1; i <= a.size(); ++i) {
        cur[0] = static_cast<int>(i);
        for (size_t j = 1; j <= b.size(); ++j) {
            int sub = prev[j - 1] + (a[i - 1] == b[j - 1] ? 0 : 1);
            cur[j] = std::min({prev[j] + 1, cur[j - 1] + 1, sub});
        }
        std::swap(prev, cur);
    }
    return prev[b.size()];
}

std::string SymTab::suggest(const std::string& name) const {
    std::string best;
    int bestD = 3;
    for (auto it = stack_.rbegin(); it != stack_.rend(); ++it) {
        for (Symbol* s : scopes_[*it].syms) {
            int d = editDistance(name, s->name);
            if (d < bestD || (d == bestD && s->name < best)) { bestD = d; best = s->name; }
        }
    }
    return bestD <= 2 ? best : "";
}

std::vector<Symbol*> SymTab::allSymbols() const {
    std::vector<Symbol*> v;
    for (auto& sc : scopes_)
        for (Symbol* s : sc.syms) v.push_back(s);
    return v;
}

static std::string symTypeStr(const Symbol* s) {
    if (s->kind == SymKind::BuiltinFunc) return "builtin";
    if (s->kind == SymKind::Func) return "func -> " + s->type.name();
    return s->type.name();
}

Json SymTab::toJson() const {
    Json scopes = Json::array();
    for (auto& sc : scopes_) {
        Json o = Json::object();
        o.set("id", sc.id);
        o.set("parent", sc.parent < 0 ? Json() : Json(sc.parent));
        o.set("kind", sc.kind);
        Json syms = Json::array();
        for (Symbol* s : sc.syms) {
            Json j = Json::object();
            j.set("name", s->name);
            j.set("kind", symKindName(s->kind));
            j.set("type", symTypeStr(s));
            if (s->type.kind == TKind::Num || s->type.kind == TKind::Int) {
                Json d = Json::array();
                d.push(s->type.numDim().p);
                d.push(s->type.numDim().v);
                j.set("dim", d);
            }
            j.set("line", s->declLine);
            j.set("col", s->declCol);
            j.set("mutable", s->isMutable);
            j.set("used", s->used);
            if (s->constValue) j.set("const", *s->constValue);
            if (s->kind == SymKind::Series || s->kind == SymKind::BuiltinSeries) {
                j.set("phase", std::string(1, s->phase));
                j.set("maxHistoryRead", s->maxHistoryRead);
            }
            syms.push(j);
        }
        o.set("symbols", syms);
        scopes.push(o);
    }
    Json root = Json::object();
    root.set("scopes", scopes);
    return root;
}

std::string SymTab::toText() const {
    std::ostringstream os;
    for (auto& sc : scopes_) {
        int depth = 0;
        for (int p = sc.parent; p >= 0; p = scopes_[p].parent) ++depth;
        std::string ind(static_cast<size_t>(depth * 2), ' ');
        os << ind << "scope #" << sc.id << " (" << sc.kind << ")";
        if (sc.parent >= 0) os << " parent=#" << sc.parent;
        os << "\n";
        for (Symbol* s : sc.syms) {
            os << ind << "  " << s->name << " : " << symKindName(s->kind) << " " << symTypeStr(s);
            if (s->type.isNumeric()) os << " " << s->type.numDim().vec();
            if (s->declLine) os << "  @" << s->declLine << ":" << s->declCol;
            if (s->constValue) os << "  const=" << *s->constValue;
            if (s->kind == SymKind::Series || s->kind == SymKind::BuiltinSeries) os << "  phase=" << s->phase;
            if (!s->used && s->declLine) os << "  (unused)";
            os << "\n";
        }
    }
    return os.str();
}
