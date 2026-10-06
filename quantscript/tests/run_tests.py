#!/usr/bin/env python3
"""QuantScript test runner (§14). Run from the project root via `make test`.

    python3 tests/run_tests.py                 run everything
    python3 tests/run_tests.py --update-golden rewrite tests/golden/ from the current compiler
"""
import concurrent.futures
import json
import os
import re
import subprocess
import sys
import tempfile
from collections import OrderedDict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
QSC = str(ROOT / "qsc")
R2D = str(ROOT / "regex2dfa")
DATA = str(ROOT / "examples" / "data" / "sample_bars.csv")
VALID = sorted((ROOT / "examples" / "valid").glob("*.qs"))
INVALID = sorted((ROOT / "examples" / "invalid").glob("*.qs"))
GOLDEN = ROOT / "tests" / "golden"
TAC_GOLDEN = ["sma_cross", "zrevert", "momentum_func", "twin_mean", "channel"]
CXX = ["g++", "-std=c++17", "-O1", "-Wall", "-Wextra", "-Werror"]
UPDATE = "--update-golden" in sys.argv
WORK = Path(tempfile.mkdtemp(prefix="qs-tests-"))

CATEGORIES = ["unit", "lexer", "regex2dfa", "parser", "sema", "types", "causality", "warnings",
              "optimizer", "differential", "regalloc", "cleanliness", "determinism"]
results = OrderedDict((c, [0, 0]) for c in CATEGORIES)
failures = []


def check(cat, name, ok, detail=""):
    results[cat][0 if ok else 1] += 1
    if not ok:
        failures.append(f"[{cat}] {name}: {detail}")
        print(f"  FAIL [{cat}] {name}: {detail}", flush=True)


def run(args, stdin=None, cwd=ROOT):
    p = subprocess.run([str(a) for a in args], input=stdin, capture_output=True, text=True, cwd=cwd)
    return p.returncode, p.stdout, p.stderr


def golden(path, text, cat, name):
    path = GOLDEN / path
    if UPDATE:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text)
        check(cat, name, True)
        return
    if not path.exists():
        check(cat, name, False, f"missing golden file {path.relative_to(ROOT)} (run with --update-golden)")
        return
    want = path.read_text()
    if want == text:
        check(cat, name, True)
    else:
        wl, gl = want.splitlines(), text.splitlines()
        first = next((i for i in range(min(len(wl), len(gl))) if wl[i] != gl[i]), min(len(wl), len(gl)))
        check(cat, name, False, f"differs from {path.relative_to(ROOT)} at line {first + 1}")


def header(path, key):
    for line in Path(path).read_text().splitlines()[:6]:
        m = re.match(rf"//\s*{key}:\s*(\S+)", line)
        if m:
            return m.group(1)
    return None


def errors_of(stderr):
    return re.findall(r"^\S+:(\d+):(\d+): error\[(E\d+)\]", stderr, re.M)


def warnings_of(stderr):
    return re.findall(r"^\S+:(\d+):(\d+): warning\[(W\d+)\]", stderr, re.M)


def compile_qs(src, out, *flags):
    return run([QSC, "--no-color", "-o", out, *flags, src])


def build_and_run(outdir, exe):
    rc, _, err = run(CXX + [f"{outdir}/main.cpp", "-o", exe])
    if rc != 0:
        return None, err
    rc, out, err = run([exe, DATA, "--orders"])
    return (out if rc == 0 else None), err


# ---------------------------------------------------------------------------
def test_unit():
    print("unit: diagnostics formatting, dimensions, JSON writer")
    exe = WORK / "test_diag"
    rc, _, err = run(CXX + ["-I", "src", "tests/test_diag.cpp", "build/diag.o", "build/dim.o", "build/json.o", "-o", exe])
    if rc != 0:
        check("unit", "build test_diag", False, err[:300])
        return
    rc, out, _ = run([exe])
    check("unit", "test_diag", rc == 0, out.strip())


def test_lexer():
    print("lexer: golden token streams, E101-E103")
    for f in VALID:
        rc, out, err = run([QSC, "--no-color", "--dump-tokens", "-o", WORK / "lex", f])
        golden(f"tokens/{f.stem}.tokens", out, "lexer", f"tokens {f.stem}")


def test_invalid(prefixes, cat):
    for f in INVALID:
        code = header(f, "EXPECT")
        if not code or code[:2] not in prefixes:
            continue
        line = header(f, "EXPECT-LINE")
        rc, _, err = compile_qs(f, WORK / "inv")
        errs = errors_of(err)
        ok = rc == 1 and errs and errs[0][2] == code and (line is None or errs[0][0] == line)
        got = f"{errs[0][2]}@{errs[0][0]}" if errs else "no error"
        check(cat, f.name, bool(ok), f"expected {code}@{line}, got {got} (rc={rc})")


def test_regex2dfa():
    print("regex2dfa: Thompson/subset/Hopcroft vs Flex on random strings")
    classes = {"identifier": "IDENT", "integer": "INT_LIT", "float": "FLOAT_LIT", "unit_literal": "UNIT_LIT",
               "percent": "PCT_LIT", "operator": "OP", "punctuation": "PUNCT"}
    rc, table, _ = run([R2D])
    check("regex2dfa", "state table", rc == 0, table)
    print("    " + table.replace("\n", "\n    ").rstrip())
    for cls, ftype in classes.items():
        _, strings, _ = run([R2D, "--gen", cls, "300", "7"])
        lines = strings.splitlines()
        _, dfa, _ = run([R2D, "--match", cls], stdin=strings)
        _, flex, _ = run([QSC, "--classify"], stdin=strings)
        d, fl = dfa.split(), flex.split()
        agree = 0
        bad = []
        for s, a, t in zip(lines, d, fl):
            flex_accepts = t == ftype or (cls == "identifier" and t == "KEYWORD")
            if (a == "1") == flex_accepts:
                agree += 1
            elif len(bad) < 3:
                bad.append(f"{s!r}: dfa={a} flex={t}")
        positives = sum(1 for a in d if a == "1")
        ok = len(lines) >= 200 and agree == len(lines) == len(d) == len(fl) and positives >= 50
        check("regex2dfa", f"{cls} ({agree}/{len(lines)} agree, {positives} accepted)", ok, "; ".join(bad))
    rc, out, _ = run([R2D, "--regex", "(a|b)*abb"])
    check("regex2dfa", "dragon-book (a|b)*abb minimizes to 4 states", "minimal DFA 4 states" in out, out.strip())


def test_parser():
    print("parser: valid programs parse, E201, error recovery, LALR stats")
    for f in VALID:
        rc, _, err = compile_qs(f, WORK / "parse")
        check("parser", f"parse {f.name}", rc == 0, err[:300])
    test_invalid(("E2",), "parser")
    f = ROOT / "tests" / "parser" / "two_errors.qs"
    rc, _, err = compile_qs(f, WORK / "parse")
    n = sum(1 for e in errors_of(err) if e[2] == "E201")
    check("parser", "error recovery reports >= 2 errors", rc == 1 and n >= 2, f"got {n} E201 errors")
    dump = WORK / "stats.json"
    run([QSC, "--dump-json", dump, "-o", WORK / "parse", VALID[0]])
    p = json.loads(dump.read_text())["parser"]
    check("parser", f"LALR(1): {p['lalr_states']} states, {p['conflicts']} conflicts", p["conflicts"] == 0 and p["lalr_states"] > 0)


def test_types():
    print("types: §4.3 dimension algebra")
    ok_src = """strategy Dims {
    on bar_close {
        let n : notional = close[0] * volume[0];
        let v : volume = n / close[0];
        let r : scalar = close[0] / close[1];
        let p2 = pow(close[0], 2);
        let p : price = sqrt(p2);
        if (n > 0ntl && v > 0vol && r > 1.0 && p > 0px) { buy v; }
    }
}
"""
    f = WORK / "dims_ok.qs"
    f.write_text(ok_src)
    rc, _, err = compile_qs(f, WORK / "types")
    check("types", "price*volume=notional, notional/price=volume, price/price=scalar, sqrt(price^2)=price", rc == 0, err[:400])
    test_invalid(("E4",), "types")
    rc, _, err = compile_qs(ROOT / "examples/invalid/e401_unitless_literal.qs", WORK / "types")
    check("types", "close[0] > 100 hints `100px`", "did you mean `100px`?" in err, err[:300])
    rc, _, err = compile_qs(ROOT / "examples/invalid/e401_price_plus_volume.qs", WORK / "types")
    check("types", "price + volume message", "cannot add `price` and `volume`" in err and "notional" in err, err[:300])


def test_causality():
    print("causality: §8.4 negatives, §8.5 positives, warm-up")
    test_invalid(("E5",), "causality")
    rc, out, err = run([QSC, "--no-color", "--dump-causality", "-o", WORK / "c", ROOT / "examples/valid/open_rules.qs"])
    check("causality", "open_rules (gap rule, gap[0], r[1] in bar_open) accepted", rc == 0, err[:300])
    check("causality", "series gap is phase O", re.search(r"^gap\s+O\b", out, re.M) is not None, out[:400])
    check("causality", "series r is phase C", re.search(r"^r\s+C\b", out, re.M) is not None, out[:400])
    rc, out, err = run([QSC, "--no-color", "--dump-causality", "-o", WORK / "c", ROOT / "examples/valid/sma_cross.qs"])
    check("causality", "sma_cross WARMUP = 30", out.startswith("WARMUP = 30"), out.splitlines()[0] if out else err)
    rc, _, err = compile_qs(ROOT / "examples/invalid/e502_close_in_open.qs", WORK / "c")
    check("causality", "E502 explains the fill", "information not yet available" in err, err[:300])


def test_warnings():
    print("warnings: W601-W604")
    for f in sorted((ROOT / "tests" / "warnings").glob("*.qs")):
        code = header(f, "EXPECT-WARN")
        rc, _, err = compile_qs(f, WORK / "w")
        codes = [w[2] for w in warnings_of(err)]
        check("warnings", f.name, rc == 0 and code in codes, f"expected {code}, got {codes} rc={rc}")


def dump_json(f, *flags):
    out = WORK / f"{f.stem}{''.join(flags).replace('-', '_')}.json"
    rc, _, err = run([QSC, "--no-color", "--dump-json", out, "-o", WORK / "dj", *flags, f])
    return (json.loads(out.read_text()) if rc == 0 else None), err


def count(listing, op):
    return sum(1 for i in listing if re.search(rf"\b{op}\b", i["text"]))


def test_optimizer():
    print("optimizer: golden TAC, instruction counts, data-flow sweeps")
    for name in TAC_GOLDEN:
        rc, out, err = run([QSC, "--no-color", "--dump-tac", "-o", WORK / "opt", ROOT / f"examples/valid/{name}.qs"])
        golden(f"tac/{name}.O2.tac", out, "optimizer", f"golden TAC {name}")
    for f in VALID:
        d0, _ = dump_json(f, "-O0")
        d1, _ = dump_json(f, "-O1")
        d2, _ = dump_json(f)
        if not (d0 and d1 and d2):
            check("optimizer", f"counts {f.stem}", False, "compile failed")
            continue
        c0, c1, c2 = d0["tac"]["finalCount"], d1["tac"]["finalCount"], d2["tac"]["finalCount"]
        # -O2 may exceed -O1 statically: window strength reduction trades one O(N)
        # ROLL* instruction for ALOAD/DIV plus an O(1) update in the prologue.
        check("optimizer", f"{f.stem}: static count -O0 {c0} >= -O1 {c1}, -O2 {c2} < -O0", c0 >= c1 and c2 < c0)
        check("optimizer", f"{f.stem}: data-flow converges in <= 2 sweeps", d2["tac"]["maxSweeps"] <= 2, d2["tac"]["maxSweeps"])
        if count(d2["tac"]["initial"], "ROLL(MEAN|SUM|STD|MAX|MIN)"):
            check("optimizer", f"{f.stem}: windows strength-reduced at -O2", count(d2["tac"]["final"], "ROLL(MEAN|SUM|STD|MAX|MIN)") == 0)
            check("optimizer", f"{f.stem}: -O0 keeps naive windows", count(d0["tac"]["final"], "ROLL(MEAN|SUM|STD|MAX|MIN)") > 0)
    d, _ = dump_json(ROOT / "examples/valid/twin_mean.qs")
    before = count(d["tac"]["initial"], "ROLLMEAN")
    after_cse = next(p for p in d["tac"]["passes"] if p["name"] == "global-cse")["after"]
    check("optimizer", f"twin_mean: repeated mean loses >= 1 ROLLMEAN in CSE ({before} -> {count(after_cse, 'ROLLMEAN')})",
          count(after_cse, "ROLLMEAN") <= before - 1)
    accs = [m["name"] for m in d["layout"]["members"] if m["kind"] == "acc"]
    check("optimizer", f"twin_mean: one accumulator per (series, N): {accs}", len(accs) == len(set(accs)) == 3)


def differential_one(f):
    """Interpreter -O0/-O1/-O2 + series traces + compiled C++ at several register counts."""
    res = []
    orders = {}
    for lvl in ("-O0", "-O1", "-O2"):
        trace = WORK / f"{f.stem}{lvl}.trace"
        rc, out, err = run([QSC, "--no-color", lvl, "--interpret", DATA, "--trace", trace, f])
        orders[lvl] = out if rc == 0 else None
    same = orders["-O0"] is not None and orders["-O0"] == orders["-O1"] == orders["-O2"]
    res.append(("differential", f"{f.stem}: interpreter -O0 == -O1 == -O2 ({len((orders['-O2'] or '').splitlines())} orders)", same, ""))
    t0 = (WORK / f"{f.stem}-O0.trace").read_text().split("\n") if (WORK / f"{f.stem}-O0.trace").exists() else []
    t2 = (WORK / f"{f.stem}-O2.trace").read_text().split("\n") if (WORK / f"{f.stem}-O2.trace").exists() else []
    worst = 0.0
    ok = len(t0) == len(t2)
    for a, b in zip(t0, t2):
        if not a:
            continue
        x, y = float(a.split()[2]), float(b.split()[2])
        if a.split()[:2] != b.split()[:2]:
            ok = False
            break
        rel = abs(x - y) / max(1.0, abs(x), abs(y))
        worst = max(worst, rel)
    res.append(("differential", f"{f.stem}: series values naive vs incremental within 1e-9 (worst {worst:.1e})", ok and worst <= 1e-9, ""))
    for regs in ("8", "4", "2"):
        outdir = WORK / f"cpp_{f.stem}_{regs}"
        rc, _, err = run([QSC, "--no-color", "--regs", regs, "-o", outdir, f])
        got, err = build_and_run(outdir, WORK / f"bt_{f.stem}_{regs}")
        cat = "differential" if regs == "8" else "regalloc"
        res.append((cat, f"{f.stem}: compiled C++ (--regs {regs}) == interpreter", got is not None and got == orders["-O2"], (err or "")[:300]))
    outdir = WORK / f"cpp_{f.stem}_O0"
    run([QSC, "--no-color", "-O0", "-o", outdir, f])
    got, err = build_and_run(outdir, WORK / f"bt_{f.stem}_O0")
    res.append(("differential", f"{f.stem}: compiled C++ -O0 == interpreter", got is not None and got == orders["-O2"], (err or "")[:300]))
    for flag in ("--emit-strong-types", "--emit-asserts"):
        outdir = WORK / f"cpp_{f.stem}{flag}"
        run([QSC, "--no-color", flag, "-o", outdir, f])
        got, err = build_and_run(outdir, WORK / f"bt_{f.stem}{flag}")
        res.append(("cleanliness", f"{f.stem}: {flag} compiles with -Werror and agrees", got is not None and got == orders["-O2"], (err or "")[:300]))
    return res


def test_differential():
    print("differential / regalloc / cleanliness: interpreter vs compiled C++ (parallel)")
    with concurrent.futures.ThreadPoolExecutor(max_workers=os.cpu_count() or 4) as ex:
        for res in ex.map(differential_one, VALID):
            for cat, name, ok, detail in res:
                check(cat, name, ok, detail)
    spilled = []
    for f in VALID:
        d, _ = dump_json(f, "--regs", "2")
        if d and d["regalloc"]["spilled"]:
            spilled.append(f.stem)
    check("regalloc", f"--regs 2 forces spilling ({len(spilled)} programs: {', '.join(spilled[:4])}...)", len(spilled) > 0)
    d, _ = dump_json(ROOT / "examples/valid/zrevert.qs")
    order = d["regalloc"]["order"]
    kinds = {e["op"] for e in order}
    check("regalloc", f"simplify/select stack order dumped ({len(order)} events)", {"simplify", "select"} <= kinds)


def test_cleanliness():
    print("cleanliness: harness compiles standalone with -Werror")
    probe = WORK / "probe.cpp"
    probe.write_text('#include "harness.hpp"\nint main() { return 0; }\n')
    rc, _, err = run(CXX + ["-I", "runtime", probe, "-o", WORK / "probe"])
    check("cleanliness", "runtime/harness.hpp", rc == 0, err[:300])


def test_determinism():
    print("determinism: byte-identical output across runs")
    for f in VALID:
        outs = []
        for i in range(2):
            od = WORK / f"det{i}"
            js = WORK / f"det{i}.json"
            run([QSC, "--no-color", "--dump-json", js, "-o", od, f])
            outs.append((js.read_bytes(), b"".join(p.read_bytes() for p in sorted(od.glob("*")))))
        check("determinism", f.stem, outs[0] == outs[1])


def main():
    if not Path(QSC).exists():
        print("qsc not built; run `make` first")
        return 2
    test_unit()
    test_lexer()
    test_invalid(("E1",), "lexer")
    test_regex2dfa()
    test_parser()
    print("sema: E301-E309")
    test_invalid(("E3",), "sema")
    test_types()
    test_causality()
    test_warnings()
    test_optimizer()
    test_differential()
    test_cleanliness()
    test_determinism()

    print()
    print(f"{'Category':<14} {'Passed':>7} {'Failed':>7}")
    print("-" * 30)
    tp = tf = 0
    for cat, (p, fl) in results.items():
        tp, tf = tp + p, tf + fl
        print(f"{cat:<14} {p:>7} {fl:>7}")
    print("-" * 30)
    print(f"{'TOTAL':<14} {tp:>7} {tf:>7}")
    if UPDATE:
        print("golden files updated")
    if failures:
        print("\nFAILURES:")
        for x in failures:
            print("  " + x)
        return 1
    print("\nALL TESTS PASSED")
    return 0


if __name__ == "__main__":
    sys.exit(main())
