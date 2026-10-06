#include "dim.hpp"

#include <vector>

static std::string power(const char* base, int e) {
    if (e == 1) return base;
    return std::string(base) + "^" + std::to_string(e);
}

std::string Dim::name() const {
    if (p == 0 && v == 0) return "scalar";
    if (p == 1 && v == 0) return "price";
    if (p == 0 && v == 1) return "volume";
    if (p == 1 && v == 1) return "notional";
    std::vector<std::string> num, den;
    if (p > 0) num.push_back(power("price", p));
    if (v > 0) num.push_back(power("volume", v));
    if (p < 0) den.push_back(power("price", -p));
    if (v < 0) den.push_back(power("volume", -v));
    std::string n;
    for (size_t i = 0; i < num.size(); ++i) n += (i ? "*" : "") + num[i];
    if (n.empty()) n = "1";
    if (den.empty()) return n;
    std::string d;
    for (size_t i = 0; i < den.size(); ++i) d += (i ? "*" : "") + den[i];
    if (den.size() > 1) d = "(" + d + ")";
    return n + "/" + d;
}

std::string Dim::vec() const { return "(" + std::to_string(p) + "," + std::to_string(v) + ")"; }

std::string Type::name() const {
    switch (kind) {
        case TKind::Error: return "<error>";
        case TKind::Void: return "void";
        case TKind::Int: return "int";
        case TKind::Bool: return "bool";
        case TKind::Num: return dim.name();
    }
    return "?";
}

Type typeFromName(TypeName n) {
    switch (n) {
        case TypeName::Price: return Type::num(Dim::price());
        case TypeName::Volume: return Type::num(Dim::volume());
        case TypeName::Notional: return Type::num(Dim::notional());
        case TypeName::Scalar: return Type::num(Dim::scalar());
        case TypeName::Bool: return Type::boolT();
        case TypeName::Int: return Type::intT();
    }
    return Type::error();
}

const char* typeNameStr(TypeName n) {
    switch (n) {
        case TypeName::Price: return "price";
        case TypeName::Volume: return "volume";
        case TypeName::Notional: return "notional";
        case TypeName::Scalar: return "scalar";
        case TypeName::Bool: return "bool";
        case TypeName::Int: return "int";
    }
    return "?";
}
