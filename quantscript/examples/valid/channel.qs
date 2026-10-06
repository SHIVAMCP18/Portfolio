// Donchian channel + ema trend filter: highest/lowest (monotonic deques at -O2),
// the ema builtin, `||`, `!` and a bool state.
strategy Channel {
    const N : int = 20;
    state pos : volume = 0vol;
    state armed : bool = true;
    series up : price = highest(high, N);
    series dn : price = lowest(low, N);
    series trend : price = ema(close, 50);
    on bar_close {
        if (armed && close[0] > up[1] && close[0] > trend[0] && pos == 0vol) {
            buy 30vol; pos = 30vol; armed = false;
        }
        if (!(close[0] > dn[1]) || abs(close[0] - trend[0]) > 15px) {
            if (pos > 0vol) { flatten; pos = 0vol; }
            armed = true;
        }
        if (highest(close, 5) < lowest(close, 10)) { armed = false; }
    }
}
