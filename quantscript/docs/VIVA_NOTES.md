# Viva notes

These are prepared answers to likely viva questions, organized by syllabus unit.

## Lexical analysis (Unit II)

**1. How does Flex build its scanner?**

- Flex turns each rule's regex into an NFA (in effect Thompson's construction) and joins them with a new start state.
- It applies subset construction to get one DFA and minimizes it into compressed transition tables.
- Each accepting DFA state remembers the earliest rule that accepts there.
- At run time the scanner applies two disambiguation policies:
  - **longest match:** it keeps running until it gets stuck, then backs up to the last accepting position.
  - **first rule wins:** among matches of equal length, the earliest rule is chosen.

  That is why `100px` is a `UNIT_LIT` rather than E103: both rules match 5 characters, and the unit rule comes first.

**2. What does `regex2dfa` add?**

It implements the same pipeline explicitly so the state counts can be shown:

1. Thompson's construction.
2. Subset construction using ε-closures.
3. Hopcroft's partition refinement, with a sink state added to make the DFA total.

Example counts: the unit-literal class goes 64 NFA → 18 DFA → 12 minimal states. The tests compare the minimal DFA's verdict with Flex's own classification on 300 random strings per token class.

**3. Why is Hopcroft's algorithm O(n log n)?**

- Each time a block splits, only the *smaller* half is added to the worklist (or both halves replace the block if it was already in the worklist).
- So each state can be moved into a "smaller half" at most log n times.
- Each such move costs time proportional to the incoming transitions.

## Parsing (Unit III)

**4. Why LALR(1) rather than LL(1)?**

The grammar is naturally left-recursive: item lists, statement lists and binary operators. It also relies on operator precedence. LL(1) would need left-factoring and rewriting into precedence-climbing layers. LALR(1) handles left recursion directly, resolves precedence through `%left` and `%nonassoc`, and is what Bison generates. The grammar has 163 states and 0 conflicts.

**5. How did you get zero conflicts?**

- **Operator precedence:** precedence declarations resolve every operator shift/reduce conflict. `UNARY` resolves `-a * b`.
- **Indexing:** indexing is a separate `postfix` nonterminal, so it needs no precedence declaration.
- **No dangling else:** braces are mandatory, so `else` is never in FOLLOW(stmt).
- **`volume`:** `volume` is accepted in `type` and in `name`, and those contexts never share a lookahead.

**6. How does error recovery work?**

1. On a syntax error, Bison pops states until it reaches one that can shift the `error` token. In this grammar those are the `item: error ';'`, `item: error '}'` and `stmt: error ';'` productions.
2. It then discards input until a `;` or `}` can follow.
3. `yyerrok` resumes normal reporting.

This lets one run report several independent errors (capped at 20). A test checks that a file with two independent mistakes yields two E201 errors.

## Semantic analysis (Units IV and V)

**7. What is the dimension vector and why use integer exponents?**

- A dimension is the pair `(p, v)`, the exponents of price and volume, so dimensions form the group ℤ².
- Multiplication adds vectors and division subtracts them.
- Addition and comparison require equal vectors.
- Integer exponents keep the algebra exact and decidable: two dimensions are equal exactly when both integer pairs are equal.

**8. Why is `sqrt` restricted?**

`sqrt` halves each exponent. `sqrt(price^2)` is a price, but `sqrt(price)` would need exponent ½, which ℤ² cannot represent. So odd exponents are error E405. Rational exponents are a listed stretch goal.

**9. Why must `pow`'s exponent be a constant?**

The result dimension is `D^k`, so the type depends on the value of `k`. If `k` were a runtime value, the type would not be known statically, so a non-constant exponent is error E406 (or E504 if it is a `param`).

**10. What are syntax-directed attributes here?**

- Synthesized attributes: `type`, `dim`, `constValue` and `stamp`, computed bottom-up in a post-order walk.
- Inherited context: the current scope, whether the code is inside a `func`, the series being defined, and the handler phase.

**11. Why must declarations come before use?**

It gives a single-pass, deterministic order for evaluating series and inlining functions. It also makes forward-reference and recursion errors local and explainable (E301 and E307). The series dependency graph is still checked for cycles, which reports E306 with the path.

## Causality

**12. Why treat `open[0]` differently from `close[0]`?**

At the open of bar `t` the open price is known, but the high, low, close and volume of bar `t` are not. An `on bar_open` rule fills at `open[0]`, so letting it read `close[0]` would let a decision use information from later in the same bar. This is the classic look-ahead bug, and it is error E502.

**13. Prove that an accepted program cannot read the future (sketch).**

1. Every read has a stamp `(d, φ)`.
2. Fields have fixed phases.
3. A derived series' phase is computed in topological order as the latest phase it reads at delay 0, so its stamp is never earlier than the data it depends on.
4. E501 and E503 force `d` to be a non-negative constant.
5. E505 bans functions whose reads cannot be bounded.
6. The checker accepts a read in handler H only if `d ≥ 1` or `φ ≤ H`.

So every value used at time `(t, H)` was known at or before `(t, H)`.

**14. What does the causality checker *not* catch?**

- Survivorship bias, meaning a universe that contains only assets that survived.
- Unrealistic fills: slippage, liquidity, partial fills and fees beyond the per-share fee.
- Data snooping or overfitting of parameters.
- Revised or restated data.
- Look-ahead hidden *in the data itself*, such as adjusted prices computed with future splits.
- Corporate actions.

It guarantees causality relative to the bar data it is given, nothing more.

**15. Why can the incremental mean be wrong without warm-up?**

- The running sum `acc += x[0] − x[N]` equals the true window sum only after N real values have entered it. Before that, the zero-initialized slots stand in for bars that do not exist, so `sum/N` underestimates the mean.
- Separately, a derived series computed from pre-history zeros can produce `x/0 = ∞`, and an infinity entering the accumulator makes it `NaN` permanently.

Gating series until `bars_seen > depth` and skipping handlers until `bars_seen > WARMUP` fixes both problems.

## Intermediate code and optimization (Units V and VII)

**16. Why is the CFG acyclic and what does that make easier?**

The language has no loops and no recursion; `if/else` and short-circuit operators only jump forward. So each function's CFG is a DAG. A DAG has a topological order, so a forward data-flow problem solved in reverse post-order reaches its fixed point in one sweep, and a second sweep only confirms it. The framework is the general iterative worklist algorithm anyway, and it records ≤ 2 sweeps.

**17. Explain window strength reduction.**

- The naive `mean(x, N)` reads N buffer slots every bar, which is O(N).
- The reduced form keeps an accumulator updated once per bar in the prologue (`sum += x[0] − x[N]`) and computes the mean as `sum/N`, which is O(1).
- `std` also keeps a running sum of squares and uses `sqrt(max(0, E[x²] − E[x]²))`.
- `highest` and `lowest` use a monotonic deque, which is amortized O(1).
- At window 200 over 5M bars: 3.28 s → 0.048 s, 69× faster.

**18. How do you know the optimizer is correct?**

Differential testing:

- The TAC interpreter runs the -O0, -O1 and -O2 programs on the sample data and must produce identical order lists.
- Series values from the naive and incremental forms must agree within 1e-9 relative error.
- The compiled C++ must produce the same orders as the interpreter at several register counts.
- Golden TAC files catch unintended changes.

**19. Global CSE versus local value numbering?**

- **LVN** works inside one basic block. It gives every definition a version number, so identical expressions over the same versions are recognized.
- **Global CSE** uses available expressions across blocks. Here the data-flow fact is "expression E is held in temporary h on every path". The meet keeps E only if all predecessors agree on the same h, so a redundant computation can simply become `t = COPY h`.
- **Memory:** state and series reads are killed by stores to the same slot.

**20. Why is `NOT (a > b) → a <= b` only valid without NaN?**

With IEEE floating point, `NaN > b` and `NaN <= b` are both false, so `!(NaN > b)` is true while `NaN <= b` is false. Warm-up and series gating ensure that no NaN reaches a handler from missing history. A genuine `0/0` in user code is the remaining caveat, and `--emit-asserts` traps it.

## Register allocation and code generation (Units VI and VII)

**21. What does the interference graph represent?**

- Nodes are TAC temporaries.
- An edge means the two temporaries are live at the same time, so they cannot share a register. More precisely, one is live at a definition of the other.
- Coloring with K colors assigns K registers.
- There are separate graphs for doubles (F) and bools (B).

**22. Chaitin versus Briggs?**

- **Chaitin** spills as soon as no node has degree < K.
- **Briggs** is *optimistic*: it pushes a spill candidate anyway, chosen by lowest cost/degree, because its neighbors may end up sharing colors. It spills only if no color is free during select.
- Briggs's *conservative coalescing* merges a copy's source and destination only if the merged node has fewer than K neighbors of significant degree, so coalescing never makes the graph uncolorable.

**23. How does spilling work in your backend?**

An actually-spilled temporary lives in a per-function array slot (`fs[i]`), and every instruction uses that slot as a memory operand. The spilled nodes are removed and coloring re-runs until it succeeds. Slots are shared by coloring the spilled nodes' own interference. This works for any K ≥ 1. The tests run `--regs 1/2/4/8` and check that the orders are identical.

**24. Describe the runtime storage layout.**

- **One struct:** everything lives in one `State` struct with no heap allocation after construction. It holds `bars_seen`, a ring buffer for each series that is read, accumulators and deques, and the `state` variables.
- **Ring buffers:** capacities are rounded up to powers of two so that the index `(head − k) & (cap − 1)` is a mask, not a modulo. All buffers share the head `bars_seen − 1`.
- **Offsets:** offsets are computed with natural alignment, and bool state goes last, so the report shows tail padding.
- **Example:** `zrevert` uses 304 bytes.

**25. What does `--emit-strong-types` buy you?**

It is a second, independent check of units, done by the C++ compiler. The generated `units_check()` member re-expresses the program with `Q<P,V>` wrapper types that only allow dimensionally legal operators. If the QuantScript type checker had a bug and accepted `price + volume`, the C++ build would fail.

## Project-level questions

**26. Is the compiler deterministic?**

Yes. It uses ordered containers, fixed number formatting, sorted and de-duplicated diagnostics, and no pointer-keyed output. The tests compile every example twice and compare all outputs byte for byte.

**27. What would you do next?**

- Compile `qsc` to WebAssembly so the viewer can compile in the browser.
- Add rational exponents and a currency dimension.
- Add interval analysis to prove divisions safe, which would remove the NaN caveat.
- Add a random-program fuzzer that checks -O0 against -O2.
