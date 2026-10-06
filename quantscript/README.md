# QuantScript

**A unit-checked trading-signal DSL that compiles to optimized C++17.**

Backtests often produce results no live strategy could reach, for two reasons:

- **Look-ahead bias:** a rule reads data that was not yet known when the decision was made (for example, trading at the open using that same bar's close).
- **Dimensional nonsense:** `price + volume`, `price * price` treated as a price, or buying "100 dollars" where a share count is expected.

The QuantScript compiler rejects both at compile time. It then lowers the strategy to three-address code, optimizes it, allocates registers by graph coloring, and emits a self-contained C++ class with a small backtest harness.

```
strategy ZRevert {
    const N : int = 20;
    param entry : scalar = 2.0;
    state pos : volume = 0vol;
    series m : price = mean(close, N);
    series sd : price = std(close, N);
    on bar_close {
        let z : scalar = (close[0] - m[0]) / sd[0];      // price / price = scalar
        if (z < -entry && pos == 0vol)  { buy 50vol;  pos = 50vol; }
        if (z >  entry && pos == 0vol)  { sell 50vol; pos = -50vol; }
        if (abs(z) < 0.2 && pos != 0vol) { flatten; pos = 0vol; }
    }
}
```

## Highlights

| | |
|---|---|
| **Units-of-measure type system** | Every value has a dimension vector `(p, v)` = exponents of price and volume. `close[0] * volume[0]` is `notional`, `notional / close[0]` is `volume`, and `close[0] + volume[0]` is error **E401**. |
| **Compile-time causality checker** | Every read carries a stamp `(bars ago, O/C phase)`. The compiler proves no rule reads the future. `close[0]` inside `on bar_open` is error **E502**, and `zigzag` is error **E505**. |
| **Window strength reduction** | `mean`/`sum`/`std` change from O(N) loops to O(1) running accumulators, and `highest`/`lowest` use monotonic deques. **69× faster** at window 200 (`make bench`). |
| **Phase viewer** | `viewer/index.html` is a static page that shows all 13 compiler phases: DFAs, parse tree, typed AST, causality timeline, optimizer diffs, CFG and an animated interference graph. |

## Build

Requirements: `g++` (C++17), `flex`, `bison` ≥ 3.6, `make`, `python3` (used for tests and sample data only).

```sh
cd quantscript
make            # builds ./qsc and ./regex2dfa with -Wall -Wextra and no warnings
make test       # runs every test category and prints a pass/fail table
make bench      # -O0 vs -O2 on 5,000,000 bars
make examples   # regenerates the viewer demo dumps (viewer/samples/samples.js)
```

## Quickstart

```sh
# Compile a strategy: writes out/ZRevert.hpp, out/main.cpp and out/harness.hpp
./qsc examples/valid/zrevert.qs

# Build and run the generated backtest
g++ -O2 -std=c++17 -Wall -Wextra out/main.cpp -o backtest
./backtest examples/data/sample_bars.csv          # writes trades.csv and equity.csv
#   strategy      ZRevert
#   bars          600 (warm-up 19)
#   trades        39
#   final equity  1000264.50
#   max drawdown  0.12%
#   sharpe        0.147

# Run the TAC interpreter instead (used for differential testing)
./qsc --interpret examples/data/sample_bars.csv examples/valid/zrevert.qs
#   23 C SELL 50
#   59 C FLATTEN
#   ...

# Explore the phases
./qsc --dump-json zrevert.json examples/valid/zrevert.qs
open viewer/index.html        # then "Open dump…", or click "Load demo"
```

Compile errors look like this:

```
e401_price_plus_volume.qs:5:26: error[E401]: cannot add `price` and `volume`
     5 |         let x = close[0] + volume[0];
       |                 ~~~~~~~~ ^ ~~~~~~~~~
       = note: left operand has dimension price (1,0), right has volume (0,1)
       = help: if you want traded value, use `*` to get notional

e502_close_in_open.qs:6:13: error[E502]: `close[0]` is not available in `on bar_open`: the current bar's close is only known when the bar closes
     6 |         if (close[0] > 100px) { buy 1vol; }
       |             ^^^^^^^^
       = note: the read has stamp (0,C) but the handler runs at (t,O); orders from `on bar_open` fill at open[0], so the fill would use information not yet available
       = help: use `close[1]` (the previous bar) or move this rule to `on bar_close`
```

## CLI

```
qsc [options] input.qs

  -o DIR              output directory (default ./out)
  -O0 | -O1 | -O2     optimization level (default -O2)
  --regs K            F-class register count (default 8; B-class = min(4, K))
  --dump-json FILE    write the full phase dump for the viewer
  --dump-tokens       print token stream
  --dump-ast          print annotated AST
  --dump-symtab       print symbol table
  --dump-causality    print series phases, depths and every checked read
  --dump-tac          print TAC (before and after each pass)
  --dump-layout       print state layout report
  --dump-cfg          print basic blocks
  --dump-ig           print interference graph and coloring
  --interpret CSV     run the TAC interpreter on CSV and print orders
  --trace FILE        with --interpret: write per-bar series values to FILE
  --emit-strong-types emit dimension-checked wrapper types (units_check)
  --emit-asserts      emit runtime asserts (warm-up, ring indices, NaN)
  --json-diagnostics  print diagnostics as JSON on stderr
  --no-color
  --version / --help
```

Exit codes: `0` success (warnings allowed), `1` compile errors, `2` usage or I/O error. The output is deterministic: the same input always produces byte-identical files, and the test suite checks this.

The generated backtest accepts `data.csv [--fee F] [--cash C] [--orders] [--out DIR] [--param name=value]`.

## Phase viewer

To use the viewer, open `viewer/index.html` straight from disk; it makes no network requests and needs no build step. Load a dump with the file picker, drag-and-drop or paste, or click **Load demo**. You can also run `make serve` and browse to `http://localhost:8000/viewer/`. The viewer has these panels:

1. **Source & diagnostics**: wavy underlines, hover for the message and hint, click a diagnostic to jump to it.
2. **Tokens**: click a token to highlight it in the source.
3. **Lexer DFA**: the minimized DFA per token class with NFA/DFA/min-DFA state counts. You can step through it with a typed string to see accept or reject.
4. **Parse tree**: collapsible, with source spans on hover and LALR statistics (163 states, 0 conflicts).
5. **Symbol table**: nested scope cards with dimension badges.
6. **Typed AST**: dimension badges per node, and the derivation on click (for example `(1,0)+(0,1) = (1,1) notional`).
7. **Causality timeline**: one arrow per read from its stamp to the handler moment. Legal reads are green; look-ahead reads are red with their error code.
8. **State layout**: a memory map of the generated `State` struct, including alignment padding.
9. **TAC & optimizer**: a side-by-side diff for every pass, plus a chart of the instruction count after each pass.
10. **CFG**: a layered drawing of the basic blocks.
11. **Interference graph**: circular layout with colors by register and spills outlined. A slider (or play button) replays the simplify and select stack.
12. **Generated C++**: syntax-highlighted. The `// L12` markers link back to the source.
13. **Compare -O0 / -O2**: instruction counts, the window ops with their O(N) vs O(1) cost, and both final listings.

The viewer works in dark and light themes. Use ←/→ to move between phases.

## Tests

`make test` builds a unit test and runs `tests/run_tests.py`, which checks every category in §14 of the spec:

```
Category        Passed  Failed
------------------------------
unit                 1       0
lexer               13       0
regex2dfa            9       0
parser              13       0
sema                 9       0
types               13       0
causality           11       0
warnings             4       0
optimizer           39       0
differential        40       0
regalloc            32       0
cleanliness         21       0
determinism         10       0
------------------------------
TOTAL              215       0
```

The categories cover the following:

- Golden token streams and golden TAC.
- `regex2dfa` against Flex on 300 random strings per token class.
- Every error code at its expected line.
- Error recovery.
- Interpreter agreement at `-O0` = `-O1` = `-O2`, with series values from the naive and incremental windows within 1e-9.
- Compiled C++ orders matching the interpreter at `--regs 8/4/2`, with spilling forced at `--regs 2`.
- Every generated header compiling with `-Wall -Wextra -Werror`, including the `--emit-strong-types` and `--emit-asserts` variants.
- Byte-identical output across runs.

Run `python3 tests/run_tests.py --update-golden` to refresh the golden files after an intentional change.

## Benchmark

```
$ make bench
QuantScript benchmark: mean(close, 200) + std(close, 200), 5000000 bars
level       seconds      bars/second     orders
-O0           3.281          1523826      53616
-O2           0.048        105165741      53616
speed-up -O2 vs -O0: 69.0x
```

## Milestones

Each milestone below lists its command and the expected result. All milestones are implemented.

| # | Milestone | Command | Expected |
|---|---|---|---|
| M0 | Skeleton, diagnostics, JSON, CLI | `make && ./qsc --help` | usage text; `make test` → `unit 1 0` |
| M1 | Flex lexer, `E101–E103` | `./qsc --dump-tokens examples/valid/sma_cross.qs` | `3:5 KEYWORD const …`; `examples/invalid/e10*.qs` give E101/E102/E103 |
| M2 | `regex2dfa` + Flex cross-check | `./regex2dfa` | table of NFA/DFA/min-DFA counts, e.g. `unit_literal 64 18 12`; tests: 100% agreement |
| M3 | Bison parser, AST, recovery | `./qsc --dump-ast examples/valid/zrevert.qs` | annotated tree; `build/parser.output`: 0 conflicts, 163 states |
| M4 | Symbol table, resolution | `./qsc --dump-symtab examples/valid/zrevert.qs` | nested scopes; `E301–E309` tests pass |
| M5 | Dimensional type checker | `./qsc examples/invalid/e401_price_plus_volume.qs` | E401 with note and help |
| M6 | Causality, phases, warm-up | `./qsc --dump-causality examples/valid/open_rules.qs` | `gap` phase O, `r` phase C, all reads ok |
| M7 | Layout | `./qsc --dump-layout examples/valid/zrevert.qs` | `close_buf double[32] … cap=32 (needs 21: mean(close,20) reads close[20])`, `TOTAL 304 bytes, WARMUP = 19` |
| M8 | TAC + interpreter | `./qsc --interpret examples/data/sample_bars.csv examples/valid/sma_cross.qs` | `90 C BUY 100` … |
| M9 | CFG, data-flow, passes | `./qsc --dump-tac --dump-cfg examples/valid/twin_mean.qs` | per-pass listings; acyclic CFGs; `-O0/-O1/-O2` tests pass |
| M10 | Register allocation | `./qsc --regs 2 --dump-ig examples/valid/vol_target.qs` | interference graph, spill slots used; tests: `--regs 2/4/8` agree |
| M11 | C++ backend + harness | `./qsc examples/valid/zrevert.qs && g++ -O2 -std=c++17 -Wall -Wextra -Werror out/main.cpp` | compiles cleanly; orders equal the interpreter's |
| M12 | Phase viewer | `open viewer/index.html` → Load demo | all 13 panels |
| M13 | Bench, docs, polish | `make test && make bench` | `ALL TESTS PASSED`; ≥ 10× speed-up |

## Repository layout

```
quantscript/
├── Makefile                 build, test, bench, serve, examples
├── src/                     compiler (lexer.l, parser.y, sema, causality, irgen, opt, regalloc, codegen…)
├── tools/regex2dfa.cpp      Thompson → subset construction → Hopcroft (shares src/rdfa.cpp)
├── runtime/harness.hpp      Bar/CSV/Orders, window helpers, Backtester, CLI driver
├── viewer/                  index.html, app.js, style.css, samples/samples.js
├── examples/valid/          10 strategies      examples/invalid/  29 programs with // EXPECT headers
├── examples/data/           sample_bars.csv (600 synthetic bars; tools/gen_bars.py)
├── tests/                   run_tests.sh / run_tests.py, test_diag.cpp, golden/, parser/, warnings/
├── bench/                   bench.qs, bench_main.cpp, run_bench.sh
└── docs/                    LANGUAGE.md, DECISIONS.md, REPORT_OUTLINE.md, VIVA_NOTES.md
```

See [docs/LANGUAGE.md](docs/LANGUAGE.md) for the language reference and [docs/DECISIONS.md](docs/DECISIONS.md) for every design choice the specification left open.
