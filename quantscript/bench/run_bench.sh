#!/usr/bin/env bash
# make bench: compile bench/bench.qs at -O0 (naive O(N) windows) and -O2
# (O(1) incremental accumulators), run both on 5,000,000 bars, report speed-up.
set -euo pipefail
cd "$(dirname "$0")/.."
BARS=${BARS:-5000000}
OUT=bench/out
mkdir -p "$OUT"
for lvl in O0 O2; do
    ./qsc -"$lvl" -o "$OUT/$lvl" bench/bench.qs
    g++ -std=c++17 -O2 -Wall -Wextra -Werror -I "$OUT/$lvl" bench/bench_main.cpp -o "$OUT/bench_$lvl"
done
echo "QuantScript benchmark: mean(close, 200) + std(close, 200), $BARS bars"
printf "%-6s %12s %16s %10s\n" "level" "seconds" "bars/second" "orders"
read -r n0 t0 o0 < <("$OUT/bench_O0" "$BARS")
read -r n2 t2 o2 < <("$OUT/bench_O2" "$BARS")
awk -v t="$t0" -v n="$n0" -v o="$o0" 'BEGIN { printf "%-6s %12.3f %16.0f %10d\n", "-O0", t, n / t, o }'
awk -v t="$t2" -v n="$n2" -v o="$o2" 'BEGIN { printf "%-6s %12.3f %16.0f %10d\n", "-O2", t, n / t, o }'
awk -v a="$t0" -v b="$t2" 'BEGIN { printf "speed-up -O2 vs -O0: %.1fx\n", a / b }'
if [ "$o0" != "$o2" ]; then
    echo "note: order counts differ ($o0 vs $o2): incremental vs naive rounding over $BARS bars"
fi
