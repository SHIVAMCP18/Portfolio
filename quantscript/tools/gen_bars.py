#!/usr/bin/env python3
"""Deterministic synthetic OHLCV generator: python3 tools/gen_bars.py N SEED > bars.csv"""
import math
import random
import sys


def main():
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 600
    seed = int(sys.argv[2]) if len(sys.argv) > 2 else 42
    rng = random.Random(seed)
    price = 100.0
    regime = 0.0
    print("date,open,high,low,close,volume")
    for i in range(n):
        if i % 60 == 0:
            regime = rng.uniform(-0.002, 0.002)  # trending / mean-reverting phases
        gap = rng.gauss(0, 0.004)
        o = price * math.exp(gap)
        ret = regime + rng.gauss(0, 0.012)
        c = o * math.exp(ret)
        hi = max(o, c) * math.exp(abs(rng.gauss(0, 0.004)))
        lo = min(o, c) * math.exp(-abs(rng.gauss(0, 0.004)))
        vol = int(1000 + 4000 * rng.random() + 3000 * abs(ret) / 0.012)
        day = f"2024-{1 + (i // 28) % 12:02d}-{1 + i % 28:02d}"
        print(f"{day}#{i},{o:.2f},{hi:.2f},{lo:.2f},{c:.2f},{vol}")
        price = c


if __name__ == "__main__":
    main()
