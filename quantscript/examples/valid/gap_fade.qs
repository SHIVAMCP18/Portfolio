// 20.4 Opening-gap rule: a valid use of `on bar_open`.
strategy GapFade {
    state pos : volume = 0vol;
    series gap : price = open[0] - close[1];          // phase O: known at the open
    on bar_open {
        if (gap[0] > 0.5px && pos == 0vol) { sell 10vol; pos = -10vol; }
    }
    on bar_close { if (pos != 0vol) { flatten; pos = 0vol; } }
}
