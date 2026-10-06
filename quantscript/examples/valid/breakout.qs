// 20.3 Notional-sized breakout: notional / price = volume.
strategy Breakout {
    const N : int = 55;
    param budget : notional = 100000ntl;
    state pos : volume = 0vol;
    series hh : price = highest(high, N);
    on bar_close {
        if (close[0] > hh[1] && pos == 0vol) {
            let qty : volume = budget / close[0];     // notional / price = volume
            buy qty;  pos = qty;
        }
    }
}
