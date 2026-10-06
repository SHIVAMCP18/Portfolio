# QuantScript language reference

QuantScript is a small language for writing bar-by-bar trading rules. A program is one `strategy`. The compiler checks two properties of every program:

- the **units** of every expression (you cannot add a price to a volume)
- the **causality** of every data read (you cannot read a bar that has not happened yet)

## 1. Time model

Data arrives as **bars**, numbered `t = 0, 1, 2, …`. Each bar has the fields `open high low close volume`.

Each bar has two **phases**:

| Phase | Moment | What is known |
|---|---|---|
| `O` | the bar has just opened | `open` of this bar and everything from earlier bars |
| `C` | the bar has just closed | every field of this bar and everything earlier |

A strategy has up to two handlers:

```
on bar_open  { … }   // runs at (t, O); orders fill at open[0] of the same bar
on bar_close { … }   // runs at (t, C); orders fill at open[0] of the next bar
```

History is read with `name[k]`, which means **k bars ago**:

- `close[0]` is the current bar and `close[1]` is the previous bar.
- `k` must be a non-negative compile-time integer, written as a literal or a `const`.

Window functions such as `mean(close, 20)` take the bare series name.

## 2. Lexical structure

- **Comments:** `// to end of line` and `/* block */`. Block comments do not nest. An unterminated block comment is error E102.
- **Identifiers:** `[A-Za-z_][A-Za-z0-9_]*`.
- **Keywords:** `strategy param const state series func let if else on bar_open bar_close buy sell flatten init true false price volume notional scalar bool int`
- **`volume`:** this is both a type keyword and the built-in volume series. After `:` or `->` it is a type; everywhere else it is the series.
- **Numbers:**

  | Form | Example | Type |
  |---|---|---|
  | integer | `20` | `int` (compile-time constant) |
  | float | `2.5`, `1e-3` | `scalar` |
  | price literal | `100.5px` | `price` |
  | volume literal | `500vol` | `volume` |
  | notional literal | `1e6ntl` | `notional` |
  | percent | `5%` | `scalar` 0.05 |

  The unit suffix must touch the number. An unknown suffix such as `12abc`, or a malformed number such as `1.`, is error E103.
- **Operators:** `+ - * / ( ) { } [ ] , ; : = == != < <= > >= && || ! ->`. Any other character is error E101.

## 3. Types and dimensions

A numeric type is a dimension vector `(p, v)`, where `p` is the exponent of price and `v` is the exponent of volume.

| Name | `(p, v)` |
|---|---|
| `scalar` | (0, 0) |
| `price` | (1, 0) |
| `volume` | (0, 1) |
| `notional` | (1, 1) |

Other vectors arise in intermediate expressions and are written structurally: `price^2`, `price/volume`, `1/price`.

The other types are:

- `bool`
- `int`: a compile-time constant integer that converts to `scalar` when it meets other numbers

| Expression | Rule | Result |
|---|---|---|
| `a + b`, `a - b` | dimensions equal (E401) | same dimension |
| `a * b` | any | `(pa+pb, va+vb)` |
| `a / b` | any | `(pa-pb, va-vb)` |
| `-a` | numeric (E408 for bool) | same |
| `< <= > >= == !=` | dimensions equal (E401) | `bool` |
| `&& || !` | `bool` operands (E408) | `bool` |
| `int ∘ int` (`+ - *`) | constant-folded | `int` |
| `int / int` | | `scalar` |

Some examples:

```
close[0] * volume[0]     // notional
1000ntl / close[0]       // volume
close[0] / close[1]      // scalar (a return ratio)
close[0] + volume[0]     // E401: cannot add `price` and `volume`
close[0] > 100           // E401, help: did you mean `100px`?
```

## 4. Declarations

Declarations are processed **in order**, so a name must be declared before it is used (E301).

```
strategy Name {
    const  N : int = 20;                       // compile-time constant (literals and earlier consts)
    param  threshold : scalar = 2.0;           // runtime value, initialized with a literal
    state  position : volume = 0vol;           // persists across bars; the only assignable names
    series sma : price = mean(close, N);       // derived series, computed once per bar
    series e : price init close[0] = 0.1 * close[0] + 0.9 * e[1];   // recursive series
    func   pct(a : price, b : price) -> scalar = (a - b) / b;       // pure, inlined
    on bar_close { … }
    on bar_open  { … }
}
```

| Declaration | Rules |
|---|---|
| `const` | Initializer must be constant-foldable (E309) and match the declared type (E407). |
| `param` | Initializer is a literal (E309). A param is a runtime value, so it can never be a history index, window size or `pow` exponent (E504). It becomes a field of the generated `Params` struct and can be set with `--param name=value`. |
| `state` | Initializer is a literal or constant (E309). Only `state` names may be assigned (E303). |
| `series` | The type annotation is mandatory and must equal the inferred type (E407). A series may read `s[k]` with `k ≥ 1` of itself only with an `init` clause; `s[0]` inside `s` is a zero-delay cycle (E306). |
| `func` | The body is one pure expression over its parameters and consts. It may not read series, params or state, and may not call a later function (E307). Calls are inlined. |
| handlers | At most one of each (E305). A strategy with no handler, or one that never issues orders, gets warning W602. |

## 5. Statements

Statements appear only inside handlers:

```
let x : price = expr;        // immutable local; the annotation is optional
let y = expr;                // type inferred
position = expr;             // assignment to a `state` variable only (E303)
if (cond) { … } else { … }   // braces mandatory; cond must be bool (E402)
buy qty;  sell qty;          // qty must be volume (E403)
flatten;                     // close any open position
```

Scoping rules:

- Every block opens a scope.
- A `let` may shadow an outer name, but redeclaring a name in the same scope is error E302.
- A `let` is a runtime value even when its initializer is constant. This is why `close[n]` with `let n = 3` is error E503.

## 6. Expressions

Precedence, from lowest to highest:

| Level | Operators | Associativity |
|---|---|---|
| 1 | `\|\|` | left |
| 2 | `&&` | left |
| 3 | `==` `!=` | non-associative |
| 4 | `<` `<=` `>` `>=` | non-associative |
| 5 | `+` `-` | left |
| 6 | `*` `/` | left |
| 7 | unary `-` `!` | right |
| 8 | postfix `x[k]`, calls `f(args)` | |
| 9 | literals, names, `( expr )` | |

`&&` and `||` short-circuit.

A bare series name such as `close` (without `[k]`) is only allowed as the series argument of a window builtin or of `crossover`/`crossunder`. Anywhere else it is error E308, with the hint to write `close[0]`.

## 7. Builtins

| Builtin | Signature | Notes |
|---|---|---|
| `mean(x, N)` | `(series D, const int) → D` | simple moving average |
| `sum(x, N)` | `(series D, const int) → D` | |
| `std(x, N)` | `(series D, const int) → D` | population standard deviation |
| `highest(x, N)` | `(series D, const int) → D` | rolling maximum of `x[0..N-1]` |
| `lowest(x, N)` | `(series D, const int) → D` | rolling minimum |
| `ema(x, N)` | `(series D, const int) → D` | α = 2/(N+1), seeded with `x[0]` on the first valid bar |
| `crossover(a, b)` | `(series D, series D) → bool` | `a[0] > b[0] && a[1] <= b[1]` |
| `crossunder(a, b)` | `(series D, series D) → bool` | `a[0] < b[0] && a[1] >= b[1]` |
| `abs(x)` | `D → D` | |
| `min(a, b)`, `max(a, b)` | `(D, D) → D` | dimensions must match (E401) |
| `clamp(x, lo, hi)` | `(D, D, D) → D` | |
| `sign(x)` | `D → scalar` | −1, 0, +1 |
| `sqrt(x)` | `(p, v) → (p/2, v/2)` | both exponents must be even (E405) |
| `pow(x, k)` | `(D, const int k) → D^k` | `k` must be a compile-time integer (E406) |
| `log(x)`, `exp(x)` | `scalar → scalar` | the argument must be scalar (E404) |

**Look-ahead functions:** these names are deliberately rejected with error E505, along with an explanation:

- `future`, `next_close`, `next_open`
- `shift`, `lead`
- `centered_mean`
- `zigzag`, `pivot_high`, `pivot_low`, `fractal`

## 8. Causality rules

Every read has a **stamp** `(d, φ)`:

| Read | Stamp |
|---|---|
| `open[k]` | `(k, O)` |
| `high[k]`, `low[k]`, `close[k]`, `volume[k]` | `(k, C)` |
| `s[k]` for a derived series `s` | `(k, phase(s))` |
| window or cross builtin on `x` | `(0, phase(x))` |
| literal, `const`, `param`, `state` | always available |

A read is available in handler `H ∈ {O, C}` if either of these holds:

- `d ≥ 1`
- `d = 0` and `φ ≤ H`, where `O < C`

Otherwise the read is error **E502**.

The **phase of a derived series** is:

- `C` if its definition reads any `C`-phase value at delay 0.
- `O` otherwise. For example, `series gap : price = open[0] - close[1];` is phase `O`, so `gap[0]` is legal in `on bar_open`.

The other causality checks are:

| Code | Check |
|---|---|
| E501 | a negative index, such as `close[-1]`, which reads the future |
| E503 | an index or window size that is not a compile-time non-negative integer |
| E504 | a runtime `param` used where a constant is required |
| E505 | a known look-ahead function |
| E306 | a zero-delay series cycle |

## 9. Warm-up

`depth(s)` is the number of earlier bars that series `s` needs:

- Fields have depth 0.
- `x[k]` contributes `k + depth(x)`.
- A window of size N contributes `N − 1 + depth(x)`.
- `crossover` contributes `1 + depth(x)`.
- `ema` contributes `depth(x)`.

`WARMUP` is the largest such reach over all reads.

During warm-up the generated code still updates every buffer and accumulator, but it skips both handlers until `bars_seen > WARMUP`. A series is evaluated only once its own inputs are valid; before that, `0` is pushed. A recursive series uses its `init` expression on its first valid bar.

## 10. Diagnostics

| Code | Meaning |
|---|---|
| E101 | invalid character |
| E102 | unterminated block comment |
| E103 | malformed number or unknown unit suffix |
| E201 | syntax error (lists the expected tokens) |
| E301 | undefined identifier, or used before declaration (with "did you mean") |
| E302 | redeclaration in the same scope |
| E303 | assignment to a non-`state` name |
| E304 | wrong number of arguments, or a function used without a call |
| E305 | duplicate handler |
| E306 | zero-delay cyclic series dependency, or a recursive series without `init` |
| E307 | a `func` body reads a series, param or state, or calls a later function |
| E308 | a bare series name used as a value, or indexing a non-series |
| E309 | a `state`, `const` or `param` initializer that is not constant |
| E401 | dimension mismatch in `+ -`, comparisons, `min`, `max`, `clamp` or `crossover` |
| E402 | a condition that is not `bool` |
| E403 | an order quantity that is not `volume` |
| E404 | an illegal builtin argument (`log(price)`, a non-series window argument) |
| E405 | `sqrt` of an odd exponent |
| E406 | a `pow` exponent that is not a constant integer |
| E407 | a declared type that differs from the inferred type |
| E408 | a bool used in arithmetic, or a number used in logic |
| E501 | a negative history index (a future bar) |
| E502 | a read of data not yet available at this phase |
| E503 | a non-constant history index or window size |
| E504 | a runtime `param` used as a compile-time constant |
| E505 | a call to a look-ahead-unsafe function |
| W601 | an unused declaration (names starting with `_` are exempt) |
| W602 | a strategy with no handlers, or one that never issues orders |
| W603 | division by a constant zero |
| W604 | a handler that reads nothing from the current bar |

## 11. Worked examples

All of these examples are in `examples/valid/`.

### SMA crossover (`sma_cross.qs`)

```
strategy SmaCross {
    const FAST : int = 10;
    const SLOW : int = 30;
    state position : volume = 0vol;
    series fast : price = mean(close, FAST);
    series slow : price = mean(close, SLOW);
    on bar_close {
        if (crossover(fast, slow) && position == 0vol) { buy 100vol; position = 100vol; }
        if (crossunder(fast, slow) && position > 0vol) { flatten; position = 0vol; }
    }
}
```

`WARMUP = 30`, because `crossover` reads `slow[1]` and `slow` already needs 29 earlier bars.

### Notional sizing (`breakout.qs`)

```
let qty : volume = budget / close[0];     // notional / price = volume
buy qty;
```

### Volatility targeting (`vol_target.qs`)

```
let var = pow(atr[0], 2) + pow(close[0] - m[0], 2);   // price^2
let vol : price = sqrt(var);                          // sqrt halves the exponents
let qty : volume = riskBudget / vol;                  // notional / price = volume
```

### Opening-gap rule (`gap_fade.qs`)

```
series gap : price = open[0] - close[1];   // phase O
on bar_open { if (gap[0] > 0.5px && pos == 0vol) { sell 10vol; pos = -10vol; } }
```

### Recursive EMA (`ema_trend.qs`)

```
series e : price init close[0] = alpha * close[0] + (1.0 - alpha) * e[1];
```

### Programs the compiler rejects (`examples/invalid/`)

```
on bar_open { if (close[0] > 100px) { buy 1vol; } }   // E502 look-ahead
series s : price = close[-1];                          // E501 future bar
series m : price = mean(close, p);                     // E504 (p is a param)
series z : price = zigzag(close, 5);                   // E505 repaints
buy close[0];                                          // E403 a price is not a quantity
let s = sqrt(close[0]);                                // E405 sqrt(price) has no dimension
```
