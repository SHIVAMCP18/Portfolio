// EXPECT-WARN: W603
strategy DivZero {
    on bar_close {
        let r = close[0] / 0.0;
        if (r > 1px) { buy 1vol; }
    }
}
