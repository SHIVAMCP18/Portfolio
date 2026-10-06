// Unit tests for the diagnostics engine, dimension names and the JSON writer (M0).
#include <cstdio>
#include <string>

#include "diag.hpp"
#include "dim.hpp"
#include "json.hpp"

static int failures = 0;
static int checks = 0;

static void expectEq(const std::string& got, const std::string& want, const char* what) {
    ++checks;
    if (got == want) return;
    ++failures;
    std::printf("FAIL %s\n--- want ---\n%s\n--- got ---\n%s\n", what, want.c_str(), got.c_str());
}

int main() {
    // §7.3 rendering: caret on the operator, '~' under both operands, note + help.
    DiagEngine d;
    d.setSource("momentum.qs", "strategy M {\n    on bar_close {\n        let x = close[0] + volume[0];\n    }\n}\n");
    d.error("E401", 3, 26, "cannot add `price` and `volume`")
        .range(3, 17, 8)
        .range(3, 28, 9)
        .note("left operand has dimension price (1,0), right has volume (0,1)")
        .withHint("if you want traded value, use `*` to get notional");
    std::string want =
        "momentum.qs:3:26: error[E401]: cannot add `price` and `volume`\n"
        "     3 |         let x = close[0] + volume[0];\n"
        "       |                 ~~~~~~~~ ^ ~~~~~~~~~\n"
        "       = note: left operand has dimension price (1,0), right has volume (0,1)\n"
        "       = help: if you want traded value, use `*` to get notional\n";
    expectEq(d.format(d.finalList()[0], false), want, "E401 formatting");

    // Sorting by (line, col), de-duplication and the 50-diagnostic cap.
    DiagEngine s;
    s.setSource("x.qs", "a\nb\nc\n");
    s.warning("W601", 3, 1, "late");
    s.error("E301", 1, 1, "early");
    s.error("E301", 1, 1, "early");  // duplicate
    auto list = s.finalList();
    expectEq(std::to_string(list.size()), "2", "dedup count");
    expectEq(list[0].code, "E301", "sorted first");
    expectEq(list[1].code, "W601", "sorted second");
    DiagEngine many;
    many.setSource("y.qs", "x\n");
    for (int i = 0; i < 80; ++i) many.error("E201", 1, i + 1, "e" + std::to_string(i));
    expectEq(std::to_string(many.finalList().size()), "50", "cap at 50");
    expectEq(s.toJson().dump(), "[{\"code\":\"E301\",\"severity\":\"error\",\"line\":1,\"col\":1,\"message\":\"early\",\"hint\":\"\",\"notes\":[]},"
                                "{\"code\":\"W601\",\"severity\":\"warning\",\"line\":3,\"col\":1,\"message\":\"late\",\"hint\":\"\",\"notes\":[]}]",
             "JSON diagnostics");

    // Dimension names (§4.3).
    expectEq(Dim(0, 0).name(), "scalar", "scalar");
    expectEq(Dim(1, 0).name(), "price", "price");
    expectEq(Dim(0, 1).name(), "volume", "volume");
    expectEq(Dim(1, 1).name(), "notional", "notional");
    expectEq(Dim(2, 0).name(), "price^2", "price^2");
    expectEq(Dim(1, -1).name(), "price/volume", "price/volume");
    expectEq(Dim(-1, 0).name(), "1/price", "1/price");
    expectEq(Dim(-1, -1).name(), "1/(price*volume)", "1/(price*volume)");
    expectEq((Dim::notional() - Dim::price()).name(), "volume", "notional / price");

    // JSON writer: insertion order, escaping, integers vs doubles.
    Json o = Json::object();
    o.set("b", 1);
    o.set("a", "q\"\n");
    o.set("c", 0.5);
    o.set("b", 2);
    expectEq(o.dump(), "{\"b\":2,\"a\":\"q\\\"\\n\",\"c\":0.5}", "json object");

    std::printf("test_diag: %d/%d checks passed\n", checks - failures, checks);
    return failures ? 1 : 0;
}
