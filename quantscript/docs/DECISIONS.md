# Design decisions

This file records every choice that the specification leaves open, and the few places where the implementation deliberately departs from a literal reading of the spec.

## Project and build

- **Location:** the project lives in `quantscript/` inside the portfolio repository. That directory is the root of the spec's layout (§3). The portfolio's ESLint config ignores it.
- **Parser statistics:** `bison -v` writes `build/parser.output`. A Makefile rule runs `tools/parser_stats.awk` on that file and writes `build/parser_stats.inc`, which `main.cpp` includes. The driver therefore carries its LALR statistics (states, terminals, nonterminals, rules, conflicts) with it and still works when moved away from the build tree. The current grammar has 163 LALR states, 56 terminals, 26 nonterminals, 77 rules and 0 conflicts.
- **Embedded harness:** `runtime/harness.hpp` is embedded into `qsc` as a raw string (`build/harness_embed.inc`). It is written next to every generated header, so `out/` is self-contained.
- **Flex output:** the generated scanner is compiled as C++ with `-Wall -Wextra`. Two pragmas in `%top` silence warnings that come from Flex's own skeleton (sign-compare and unused-function). The rest of the build has no suppressions.
- **Regex engine sharing:** the regex → DFA engine lives in `src/rdfa.cpp`. Both `tools/regex2dfa.cpp` and `qsc` use it; `qsc` uses it for the `lexer.dfa`/`lexer.dfas` keys of the phase dump.

## Lexer

- **Scan first, then parse:** the scanner tokenizes the whole file into a `std::vector<Token>` before parsing starts, and Bison's `yylex` pulls from that vector. This gives `--dump-tokens` the exact stream the parser saw, and lexing errors stop compilation before parsing (one phase, one error list).
- **Columns:** columns are 1-based and a tab counts as one column.
- **Number edge cases:** `12abc` (a digit run followed by identifier characters) is E103 "unknown unit suffix". `1.` with no fraction digits is E103 "malformed number". `100px` beats the E103 rule because Flex picks the first rule on equal-length matches and the unit rule comes first.
- **Percent literals:** `5%` and `2.5%` are both allowed and become scalars (0.05 and 0.025).

## Grammar

- **`volume` as type and name:** the lexer always emits `T_VOLUME`. The grammar accepts it in two disjoint contexts: in `type` (after `:` or `->`) and in `name` (identifiers in expressions and assignments). These contexts never compete for the same lookahead, so the grammar stays LALR(1) without conflicts. The `name` nonterminal is also what makes `volume[0]` and `mean(volume, 20)` work.
- **Precedence:** expression precedence uses `%left`/`%nonassoc`/`%right` declarations. `UNARY` is a pseudo-token for prefix minus. Postfix indexing is a separate `postfix` nonterminal, so it needs no precedence declaration. There is no dangling-else problem because braces are mandatory: after `if (…) block`, the token `else` is never in FOLLOW(stmt).
- **Syntax error messages (`parse.error custom` instead of `verbose`):** Bison's `verbose` mode stops listing expected tokens once there are more than four. Expression positions have about a dozen, so the message degraded to "unexpected `state`" with nothing after it, while §19 asks E201 to *list expected tokens*. `yyreport_syntax_error` therefore lists up to 8 expected tokens with a "(N more)" suffix. When a `;` or `}` is missing at the end of a line, the error is reported right after the previous token (`expected ';' after '20'`). This is a deliberate change from §5.2's `%define parse.error verbose`; everything else in §5.2 is unchanged (`%locations`, `%expect 0`, error recovery, `-v`).
- **Error recovery:** the grammar uses `item: error ';' | error '}'` and `stmt: error ';'`. At most 20 syntax errors are reported per run. The parser never crashes on malformed input; it builds a partial AST, which is then discarded.
- **Memory:** AST nodes live in an `AstArena` (a vector of `unique_ptr<Node>`) owned by the driver. The Bison `%union` carries `Node*` values and token indices.

## Semantic analysis

- **Passes:** the declaration pass registers all globals, records each one's position in declaration order, and detects E302 and E305. The resolution pass then reports a use of a global declared at the same or a later position as E301 "used before its declaration". Inside a `func`, the same situation for a function name is E307.
- **Error codes for cases §19 does not name:**
  - A function name used without a call is E304.
  - Indexing a non-series (for example `position[1]`) is E308.
  - A non-bare window argument (`mean(close[0], 20)`) is E404.
  - A `func` argument whose type differs from the parameter's type is E407.
  - A recursive series without `init`, or an `init` that reads its own series, is E306.
  - A `param` inside a `const` initializer or a `pow` exponent is E504.
  - A `param` initializer that is not a literal is E309.
- **Integer arithmetic:** `int / int` yields `scalar`, never `int`. `+`, `-` and `*` on two ints stay `int` and are folded.
- **`let` values are runtime values:** this holds even when the initializer is constant. An `int` initializer becomes a `scalar` local. This is what makes `close[n]` with `let n` an E503, as §8.4 requires.
- **`param` and `state` declared `int`:** these are runtime scalars stored as `double`. Bool params and state are supported.
- **Look-ahead function names:** these are checked before symbol lookup, so `zigzag(…)` is E505 rather than E301. A user `func` with the same name would take precedence, because user names are looked up first.
- **W601 (unused declaration):** a declaration counts as used only when it is read; assigning to a `state` does not count. Names starting with `_` are exempt.
- **W603 (division by constant zero):** this is reported during type checking, so it appears at every optimization level. The optimizer never folds such a division.

## Causality, warm-up and buffers

- **Phase order:** the phases compare as `O < C` through an explicit rank; they are not compared as characters.
- **Window read stamps:** the stamp of a window read is `(0, phase(x))`. Its *reach* (used for depth and WARMUP) is `N − 1` for `mean/sum/std/highest/lowest`, `0` for `ema` and `1` for `crossover`.
- **WARMUP for `mean(close, 20)` is 19, not 20:** §8.3 counts a window read as `x[N−1]` and keeps the extra slot that the incremental form needs (`x[N]`) in `bufsize`, not in the depth. The `WARMUP = 20` in the §10.2 layout example would require counting `x[N]` as a read. The rule text is followed here: `mean(close,20)` gives `WARMUP = 19` and `close_buf` capacity 32 ("needs 21").
- **`bufsize`:** `x[k]` needs `k+1`. `mean`, `sum` and `std` need `N+1`. `highest` and `lowest` need `N`. `ema` needs 1 and `crossover` needs 2. The same `N+1` is used at every optimization level so that the layout does not depend on `-O`.
- **Ring buffers:**
  - Every stored series (a field or a derived series) gets `double name_buf[cap]`, where `cap` is the smallest power of two ≥ `bufsize`.
  - A series read only at `[0]` has `cap = 1`.
  - All buffers share one head, `bars_seen − 1`, because every series is pushed exactly once per bar.
  - Index arithmetic is unsigned: `(bars_seen − 1 − k) & (cap − 1)`. A read before the start of history therefore lands on a never-written, zero-initialized slot.
- **Series gating:** a derived series is evaluated only when `bars_seen > depth(s)`; until then it pushes `0`. Without this, a series such as `close[0]/close[1]` would compute `x/0 = ∞` on the first bar. That value would enter a running sum and turn it into `∞ − ∞ = NaN` forever. With gating, every value pushed into a buffer is either a real value or one of the zeros that the incremental sums already assume. A recursive series uses `init` on the bar where `bars_seen == depth(s) + 1`.
- **Window updates every bar:** window accumulators and `ema` update in the prologue on every bar, including warm-up bars. Only the handlers are skipped. `ema` must update every bar at every optimization level, so its update (`EMA_UPD`) is always emitted in the prologue right after the source series is pushed.
- **Position bookkeeping:** this lives in the harness's `Backtester` (cash, position, fills), not in the strategy's `State`. A strategy tracks its own position through a `state` variable if it needs one.

## IR

- **Extra TAC operations:** besides §9.2, the IR has:
  - `PARAM %p` to read a runtime parameter.
  - `BARS_GT k` (bool `bars_seen > k`) for gating.
  - `TICK` (`++bars_seen` at the start of `on_open`).
  - `NOP`, used internally by passes.
  - The low-level window ops `ALOAD &acc`, `RSUM_UPD`, `RSQ_UPD`, `RSTD &sum,&sumsq,N`, `EMA_UPD`, `WMAX_UPD`/`WMIN_UPD` and `WMAX_GET`/`WMIN_GET`.
- **Two TAC functions:** `on_open` holds `TICK`, the open prologue and the `bar_open` body. `on_close` holds the close prologue and the `bar_close` body. Temporary names are unique across both functions.
- **Not strict SSA:** the result of `&&`/`||` is assigned on both branches (`r = COPY b` and `r = CONST 0`), and a gated series value is assigned on up to three paths. Passes therefore use reaching definitions, or require a single definition, before they rewrite anything.
- **Constants in operands:** constant propagation can replace a temporary operand with an immediate constant, which prints as `GT t3, 0.0`.
- **Number printing:** numbers print in the shortest decimal form that round-trips exactly (`0.05`, not `0.050000000000000003`). Constants are therefore bit-identical in the dumps, the interpreter and the generated C++.

## Optimizer

- **Pass pipeline:**
  - `-O0` runs no passes. Windows stay as naive `ROLL*` loops.
  - `-O1` runs `fold, propagate, dce`.
  - `-O2` runs `fold, algebraic, propagate, lvn-cse, global-cse, dce, window-sr, peephole`, then a cleanup round of `fold, propagate, lvn-cse, global-cse, dce`.
- **Static instruction count at `-O2`:** window strength reduction replaces one `ROLLMEAN` with `ALOAD` plus `DIV` plus an `RSUM_UPD` in the prologue. `-O2` can therefore have more static instructions than `-O1` while doing O(1) work per bar instead of O(N). The tests check `-O0 ≥ -O1` and `-O2 < -O0`.
- **CSE memory model:**
  - Every pure instruction records the memory resources it reads (`$series`, `@state`, `&accumulator`, `bars`).
  - `SPUSH`, `SSTORE`, `*_UPD` and `TICK` kill the expressions that read what they write.
  - `SPUSH $s, a` and `SSTORE @x, a` also make `HIST $s,0` and `SLOAD @x` available with value `a` (store-to-load forwarding). This is how `HIST $fast, 0` disappears in `sma_cross`.
- **CSE keys and constants:** `CONST` is never a CSE key. Constant propagation handles constants better, and a CSE key would mix a bool constant 0 with a double constant 0.
- **Global CSE:** global CSE is "available expressions with a fixed holder". The data-flow fact is an `(expression → temporary)` pair, and the meet keeps a pair only if every predecessor agrees on the same holder temporary. Because the holder is fixed, no new temporaries or copies are needed.
- **Data-flow framework:** a generic round-robin worklist solver visits blocks in reverse post-order (or post-order for backward problems). QuantScript has no loops and every jump goes forward, so each CFG is a DAG. The first sweep therefore reaches the fixed point and the second only confirms it. The dump records the number of sweeps, and the tests assert it is ≤ 2.
- **Window lowering:**
  - `mean` and `sum` of the same `(series, N)` share one `sum_s_N` accumulator; `std` adds `sumsq_s_N`.
  - Updates are inserted right after the series' `SPUSH`, in a deterministic order (series, then N, then kind).
  - The incremental std is `sqrt(max(0, sumsq/N − (sum/N)²))`. The naive form is the two-pass population std. The tests check that series values from the two forms agree within 1e-9 relative error.
  - `highest` and `lowest` use a **monotonic deque** of bar indices, which is amortized O(1). It is stored as `long idx[cap]` plus head and tail counters with `cap = pow2(N+1)`, and values are read back from the series ring buffer. Before history is full, the deque and the naive scan disagree only on bars where no handler or series reads the result.
- **NaN assumptions:** `NOT (GT a,b) → LE a,b` (and the other inversions) and `x*0 → 0` are valid only without NaN or infinity. The argument rests on warm-up and gating: handlers run only after every read value has been computed from real inputs, so no NaN comes from pre-history zeros. The remaining risk is a genuine `0/0` in user code, such as the z-score of a perfectly flat price series. `--emit-asserts` adds `assert(!isnan(a) && !isnan(b))` to every comparison to catch that case.
- **Unreachable code:** unreachable blocks (for example after a `JZ` on a constant) are removed in `dce`. That pass also removes jumps to the immediately following label and labels nothing jumps to.

## Register allocation

- **Model:** registers are C++ locals: `double r0..r{K-1}` for class F and `bool b0..` for class B. B-class K is `min(4, K)`, so `--regs 2` constrains both classes.
- **Coalescing:** conservative Briggs coalescing runs on `COPY` instructions before simplify. The result is visible as `/* coalesced */` statements in the generated C++.
- **Spilling uses memory operands instead of load/store rewriting:** an actually-spilled temporary lives in a per-function array (`double fs[M]` or `bool bs[M]`), and every use or definition refers to that slot directly. The spilled nodes are removed and coloring re-runs until no further spill occurs, which is the spec's "re-run until success". Spill slots are shared by greedy coloring of the spilled nodes' own interference. Classic short-range reload temporaries would make `CLAMP x, lo, hi` need three simultaneous registers, which would make `--regs 2` impossible. Memory operands avoid that, and every `K ≥ 1` works; the test suite runs `K = 1, 2, 4, 8`.
- **Spill cost:** the spill cost is the number of uses plus definitions; loop depth is always 1. The spill candidate is the node with the lowest `cost / degree`.

## C++ backend

- **Control flow:** control flow uses `goto`. A label is emitted only if something jumps to it, so `-Wunused-label` never fires. Every label is written as `L5:;`, so it is legal at the end of a block.
- **Clean compilation under `-Wall -Wextra -Werror`:**
  - Registers are zero-initialized and cast to `(void)` once, which avoids maybe-uninitialized and unused-but-set warnings at `-O0`.
  - Unused handler parameters are commented out (`double /*high*/`).
  - Strategies without params get `(void)` casts in `set_param`.
- **Constructors:** the spec's `explicit S(Params p = {})` does not compile with GCC when `Params` is a nested struct with default member initializers. Two constructors are emitted instead: `S()` and `explicit S(Params p)`.
- **Line comments:** every emitted statement ends with `// L<source line> <TAC>`. `L0` marks compiler-generated prologue code.
- **`--emit-strong-types`:** this option emits a `units_check()` member that is never called. It re-expresses every series definition, `let`, assignment, condition and order quantity of the source, using `qs::units::Q<P,V>` wrappers that only define dimensionally legal operators (for example, `sqrt` has a `static_assert` on even exponents). It is an independent second check: if the QuantScript type checker ever accepted `price + volume`, the C++ compiler would reject the program.

## Harness and outputs

- **Fill model:** orders from `on_open` fill at that bar's open; orders from `on_close` fill at the next bar's open. Equity is marked to market at each close.
- **Sharpe ratio:** the reported Sharpe is the mean of per-bar returns divided by their standard deviation, times √252.
- **Fees:** `--fee F` charges `F` per share.
- **Order log format:** the interpreter (`--interpret`) and the generated backtest (`--orders`) print the same `bar phase SIDE qty` format, with quantities formatted as `%.10g`, so the outputs can be compared byte for byte. `FLATTEN` prints no quantity.
- **CSV input:** the first row is skipped if it is not numeric (a header).

## Benchmark

- **Bar generation:** `make bench` generates its 5,000,000 bars in memory with a fixed-seed xorshift random walk, instead of writing a CSV file of roughly 250 MB. Only the strategy calls are timed. Both builds use `g++ -O2`; the only difference is the QuantScript optimization level.

## Viewer

- **Phase dump keys:**
  - `lexer.dfa` holds the identifier DFA, matching the §17 schema. `lexer.dfas` holds every token class.
  - `regalloc.nodes` carry a `func` field; `regalloc.order` is the event list (`coalesce`, `simplify`, `spill_candidate`, `select`, `spill`, `rerun`).
  - `parser.parse_tree` is reconstructed from the AST using the grammar's nonterminal names, with terminal leaves and source spans.
- **Demo samples:** `viewer/samples/samples.js` (built by `make examples`) assigns `window.QS_SAMPLES`. Browsers block `fetch()` on `file://` pages, but a `<script src>` tag still loads.
- **Panel failures:** a panel whose key is missing from a partial dump shows a "not available" note. A panel that fails while rendering shows the error message instead of breaking the page.

## Determinism

- **Ordered containers:** all maps are ordered (`std::map`/`std::set`), and there is no pointer-keyed iteration in any output path.
- **Fixed number formats:** numbers use fixed formats.
- **Diagnostics:** diagnostics are sorted by `(line, col)`, de-duplicated and capped at 50.
- **Testing:** the test suite compiles every example twice and compares the JSON dump and the generated files byte for byte.
