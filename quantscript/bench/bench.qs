// Benchmark strategy (§15): rolling mean and std over 200 bars.
strategy Bench {
    const N : int = 200;
    param k : scalar = 2.0;
    state pos : volume = 0vol;
    series m : price = mean(close, N);
    series sd : price = std(close, N);
    on bar_close {
        let z : scalar = (close[0] - m[0]) / sd[0];
        if (z < -k && pos == 0vol) { buy 1vol; pos = 1vol; }
        if (z > k && pos == 0vol) { sell 1vol; pos = -1vol; }
        if (abs(z) < 0.1 && pos != 0vol) { flatten; pos = 0vol; }
    }
}
