#include "builtins.hpp"

const std::vector<Builtin>& allBuiltins() {
    static const std::vector<Builtin> table = {
        {"mean", BKind::Window, 2, "(series D, const int) -> D"},
        {"sum", BKind::Window, 2, "(series D, const int) -> D"},
        {"std", BKind::Window, 2, "(series D, const int) -> D"},
        {"highest", BKind::Window, 2, "(series D, const int) -> D"},
        {"lowest", BKind::Window, 2, "(series D, const int) -> D"},
        {"ema", BKind::Window, 2, "(series D, const int) -> D"},
        {"crossover", BKind::Cross, 2, "(series D, series D) -> bool"},
        {"crossunder", BKind::Cross, 2, "(series D, series D) -> bool"},
        {"abs", BKind::Abs, 1, "D -> D"},
        {"min", BKind::MinMax, 2, "(D, D) -> D"},
        {"max", BKind::MinMax, 2, "(D, D) -> D"},
        {"clamp", BKind::Clamp, 3, "(D, D, D) -> D"},
        {"sign", BKind::Sign, 1, "D -> scalar"},
        {"sqrt", BKind::Sqrt, 1, "(p, v) -> (p/2, v/2)"},
        {"pow", BKind::Pow, 2, "(D, const int k) -> D^k"},
        {"log", BKind::LogExp, 1, "scalar -> scalar"},
        {"exp", BKind::LogExp, 1, "scalar -> scalar"},
    };
    return table;
}

const Builtin* findBuiltin(const std::string& name) {
    for (auto& b : allBuiltins())
        if (name == b.name) return &b;
    return nullptr;
}

std::string lookaheadUnsafeReason(const std::string& name) {
    if (name == "zigzag" || name == "pivot_high" || name == "pivot_low" || name == "fractal")
        return "`" + name + "` repaints using bars after the signal bar; it cannot be used in a causal strategy.";
    if (name == "future" || name == "next_close" || name == "next_open")
        return "`" + name + "` reads a bar that has not happened yet; it cannot be used in a causal strategy.";
    if (name == "shift" || name == "lead")
        return "`" + name + "` can move data backwards in time (a negative lag reads the future); it cannot be used in a causal strategy.";
    if (name == "centered_mean")
        return "`centered_mean` averages bars on both sides of the current bar, including future ones; it cannot be used in a causal strategy.";
    return "";
}
