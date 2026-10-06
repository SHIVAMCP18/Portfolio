# Project report outline: QuantScript

This is the chapter skeleton for the project report. The bullets under each chapter list what to write, with real numbers taken from this repository, along with the figure or table that supports it and the command that produces it.

## 1. Introduction and motivation

- Backtest look-ahead bugs: trading at the open on that bar's close, indicators that repaint (zigzag, pivots), centered moving averages. These bugs inflate backtest performance in ways a live run can never reproduce.
- Unit errors: `price + volume`, buying a dollar amount where a share count is expected, `sqrt(price)`.
- Thesis: both classes of error can be caught **statically** by a small DSL with a units-of-measure type system and a time-stamp (causality) analysis.
- Contributions:
  1. A dimension-vector type system.
  2. A two-phase causality checker.
  3. Window strength reduction with a measured 69× speed-up.
  4. A phase viewer.
- Mapping to the syllabus (§1.4 table).

## 2. Language design

- Bars, the two phases (O and C), handlers and the fill model (figure: one bar with O and C ticks).
- Declarations (`const`, `param`, `state`, `series`, `func`) and why each exists.
- Statements and expressions; the precedence table.
- Builtins and the deliberately banned look-ahead functions.
- Non-goals: loops, recursion, multiple assets.

## 3. Lexical analysis

- Token classes and the Flex specification: unit-suffixed literals (`100.5px`, `1e6ntl`, `5%`) and the rules for E101, E102 and E103.
- Regex → NFA → DFA → minimal DFA (`tools/regex2dfa`):
  - Thompson's construction, subset construction, Hopcroft's partition refinement, and alphabet compression into character classes.
  - Table of state counts from `./regex2dfa`: identifier 6 → 3 → 2, integer 4 → 2 → 2, float 38 → 10 → 7, unit_literal 64 → 18 → 12, percent 46 → 11 → 8, operator 72 → 18 → 6.
  - Check: the textbook regex `(a|b)*abb` minimizes to 4 states.
- Cross-check against Flex: 300 random strings per token class, half sampled from the regex and half noise, with 100% agreement (tests category `regex2dfa`).
- Figure: the viewer's DFA panel stepping through `1e6ntl`.

## 4. Parsing

- The grammar (EBNF in §5.1), then the Bison version with precedence declarations.
- LALR(1) statistics from `build/parser.output`: 163 states, 56 terminals, 26 nonterminals, 77 rules, **0 conflicts** (`%expect 0`).
- How `volume` works as both a type and a name without conflicts. Why there is no dangling else.
- Error recovery (`error ';'`, `error '}'`), the custom error reporter that lists expected tokens, and pointing at a missing `;` on the previous line.
- Figure: parse tree panel.

## 5. Semantic analysis

- Scoped symbol table, the declaration-order rule, and "did you mean" suggestions (edit distance ≤ 2).
- The dimension algebra: the group ℤ² under `+`, with `*`/`/` adding and subtracting vectors, `sqrt` halving (only defined on even exponents), and `pow` scaling.
- Soundness argument: by induction on expressions, the dimension of every value at run time equals its static dimension vector. Literals carry their unit, field reads are typed, and each operator rule preserves the invariant. So an accepted program never adds quantities of different dimensions.
- The type-error catalogue (E401–E408) with example messages (caret plus `~` ranges, notes and hints).
- Figure: typed AST panel with dimension badges and a derivation.

## 6. Causality checker

- Stamps `(d, φ)` and the availability order: available at H ⟺ d ≥ 1 ∨ (d = 0 ∧ φ ≤ H), with O < C.
- Series phases computed in topological order; why `gap = open[0] − close[1]` is phase O.
- Proof sketch that accepted programs never read future data:
  1. Every value a handler reads is a field read, a series read or a window over a series, and each of these has a stamp.
  2. The checker rejects (E502) every stamp that is unavailable at the handler's moment.
  3. Series phases are an upper bound on the stamps they read, by induction in topological order.
  4. E501 and E503 make every delay a non-negative constant, and E505 excludes the functions whose stamps cannot be bounded.
  5. The run-time fill model matches the phase semantics: `on_open` orders fill at `open[0]`, which is known at O.
- Look-back depth and WARMUP; buffer sizing.
- Limits: what the checker does *not* catch (see the viva notes).
- Figure: causality timeline for `examples/invalid/e502_phase_c_series.qs` (green `r[1]`, red `r[0]`).

## 7. Intermediate representation and optimization

- TAC design: two functions per strategy, prologues, series gating, short-circuit lowering.
- CFG and the data-flow framework (liveness, reaching definitions, available expressions). Acyclic CFGs converge in ≤ 2 sweeps (recorded in each dump).
- The passes, each with a before/after example:
  - fold and algebraic simplification
  - propagation using reaching definitions
  - LVN and global CSE with store-to-load forwarding
  - DCE with unreachable-block removal
  - **window strength reduction**
  - peephole
- Per-pass instruction counts (chart from the viewer's TAC panel), for example `zrevert`: 68 → 55.
- Correctness evidence: interpreter agreement at -O0, -O1 and -O2, and series values within 1e-9.
- **Benchmark** (`make bench`, 5,000,000 bars, window 200): -O0 3.28 s (1.5 M bars/s) against -O2 0.048 s (105 M bars/s), a **69× speed-up**, with identical order counts.

## 8. Register allocation

- Live ranges, the interference graph, and why there are two register classes (F and B).
- Chaitin–Briggs: simplify, optimistic spill candidates, select. Conservative Briggs coalescing.
- Spilling with memory operands and re-coloring; why it works at any K.
- Results: register and spill counts at `--regs 8/4/2/1`, with orders identical in every case.
- Figure: interference graph panel at `--regs 2` with spilled nodes outlined.

## 9. Code generation and runtime layout

- The generated class: `Params`, `WARMUP`, `on_open` and `on_close`, `State`, `goto`-based control flow, and line/TAC trace comments.
- Layout report: offsets, sizes, alignment, ring-buffer capacities and the reason for each capacity. Example from `zrevert`: 304 bytes, `close_buf double[32]`, needs 21 slots.
- Harness: CSV reader, fill model, equity, drawdown, Sharpe.
- `--emit-strong-types` as an independent C++-level units check; `--emit-asserts`.

## 10. Testing

- The 13 categories and 215 checks (table from `make test`).
- Golden files, differential testing (interpreter against compiled C++), allocator equivalence, `-Werror` cleanliness and determinism.

## 11. Limitations and future work

- No loops or multi-asset portfolios. Fill-model assumptions (no slippage, no partial fills).
- Floating-point drift in very long incremental sums. A possible mitigation is periodic re-summation.
- Stretch goals:
  - WebAssembly build, so the viewer can compile in the browser
  - a Python backend
  - rational dimension exponents
  - a currency dimension
  - interval analysis to prove divisions safe
  - a random-program fuzzer for -O0 = -O2
  - LSP-style diagnostics
