// A user `func` called several times: shows inlining + CSE of repeated reads.
strategy Momentum {
    func pct(a : price, b : price) -> scalar = (a - b) / b;
    func clip(x : scalar) -> scalar = clamp(x, -0.05, 0.05);
    state pos : volume = 0vol;
    on bar_close {
        let r1 = pct(close[0], close[1]);
        let r5 = pct(close[0], close[5]);
        let r10 = pct(close[0], close[10]);
        let score = clip(r1) + clip(r5) + clip(r10);
        if (score > 3% && pos == 0vol) { buy 50vol; pos = 50vol; }
        if (score < -3% && pos > 0vol) { flatten; pos = 0vol; }
    }
}
