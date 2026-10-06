// Dimension vectors and value types for QuantScript.
#pragma once
#include <string>

// A financial dimension: exponent of price and exponent of volume.
struct Dim {
    int p = 0;
    int v = 0;

    Dim() = default;
    Dim(int p_, int v_) : p(p_), v(v_) {}

    static Dim scalar() { return {0, 0}; }
    static Dim price() { return {1, 0}; }
    static Dim volume() { return {0, 1}; }
    static Dim notional() { return {1, 1}; }

    bool operator==(const Dim& o) const { return p == o.p && v == o.v; }
    bool operator!=(const Dim& o) const { return !(*this == o); }
    Dim operator+(const Dim& o) const { return {p + o.p, v + o.v}; }
    Dim operator-(const Dim& o) const { return {p - o.p, v - o.v}; }
    Dim scaled(int k) const { return {p * k, v * k}; }
    bool isScalar() const { return p == 0 && v == 0; }

    // Human name: scalar, price, volume, notional, or a structural form
    // such as price^2, price/volume, 1/price.
    std::string name() const;
    // Vector form "(1,0)".
    std::string vec() const;
};

enum class TKind { Error, Void, Num, Int, Bool };

// Type of an expression. Int is a compile-time constant integer (dimension scalar).
struct Type {
    TKind kind = TKind::Error;
    Dim dim;

    static Type error() { return {}; }
    static Type voidT() { Type t; t.kind = TKind::Void; return t; }
    static Type num(Dim d) { Type t; t.kind = TKind::Num; t.dim = d; return t; }
    static Type intT() { Type t; t.kind = TKind::Int; return t; }
    static Type boolT() { Type t; t.kind = TKind::Bool; return t; }

    bool isError() const { return kind == TKind::Error; }
    bool isNumeric() const { return kind == TKind::Num || kind == TKind::Int; }
    bool isBool() const { return kind == TKind::Bool; }
    // Int promoted to scalar for mixing with numbers.
    Dim numDim() const { return kind == TKind::Int ? Dim::scalar() : dim; }
    bool operator==(const Type& o) const { return kind == o.kind && (kind != TKind::Num || dim == o.dim); }
    bool operator!=(const Type& o) const { return !(*this == o); }
    std::string name() const;
};

enum class TypeName { Price, Volume, Notional, Scalar, Bool, Int };

Type typeFromName(TypeName n);
const char* typeNameStr(TypeName n);
