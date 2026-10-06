// §8.5 tricky-but-legal causality cases.
strategy OpenRules {
    state pos : volume = 0vol;
    series gap : price = open[0] - close[1];       // phase O (only open[0] at delay 0)
    series r : scalar = close[0] / close[1];       // phase C
    on bar_open {
        if (close[1] > open[0] && pos == 0vol) { buy 10vol; pos = 10vol; }   // gap rule: ok
        if (gap[0] > 0.2px && r[1] > 1.0 && pos > 0vol) { flatten; pos = 0vol; }  // gap[0] ok, r[1] ok
    }
}
