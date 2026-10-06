// 20.2 Z-score mean reversion: a dimensionless signal built from prices.
strategy ZRevert {
    const N : int = 20;
    param entry : scalar = 2.0;
    state pos : volume = 0vol;
    series m : price = mean(close, N);
    series sd : price = std(close, N);
    on bar_close {
        let z : scalar = (close[0] - m[0]) / sd[0];
        if (z < -entry && pos == 0vol)  { buy 50vol;  pos = 50vol; }
        if (z >  entry && pos == 0vol)  { sell 50vol; pos = -50vol; }
        if (abs(z) < 0.2 && pos != 0vol) { flatten; pos = 0vol; }
    }
}
