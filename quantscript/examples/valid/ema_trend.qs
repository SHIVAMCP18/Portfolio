// 20.5 EMA trend with a recursive series seeded by `init`.
strategy EmaTrend {
    param alpha : scalar = 0.1;
    series e : price init close[0] = alpha * close[0] + (1.0 - alpha) * e[1];
    state pos : volume = 0vol;
    on bar_close {
        if (close[0] > e[0] && pos == 0vol) { buy 20vol; pos = 20vol; }
        if (close[0] < e[0] && pos > 0vol)  { flatten; pos = 0vol; }
    }
}
