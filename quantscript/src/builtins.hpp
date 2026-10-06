// Builtin function signature table and the list of look-ahead-unsafe names.
#pragma once
#include <string>
#include <vector>

enum class BKind {
    Window,     // mean/sum/std/highest/lowest/ema: (series D, const int) -> D
    Cross,      // crossover/crossunder: (series D, series D) -> bool
    Abs,        // D -> D
    MinMax,     // (D, D) -> D
    Clamp,      // (D, D, D) -> D
    Sign,       // D -> scalar
    Sqrt,       // (p,v) -> (p/2, v/2)
    Pow,        // (D, const int k) -> D^k
    LogExp      // scalar -> scalar
};

struct Builtin {
    const char* name;
    BKind kind;
    int arity;
    const char* signature;
};

const Builtin* findBuiltin(const std::string& name);
const std::vector<Builtin>& allBuiltins();

// Returns an explanation if `name` is a known look-ahead-unsafe function, else "".
std::string lookaheadUnsafeReason(const std::string& name);
