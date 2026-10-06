// EXPECT: E408
// EXPECT-LINE: 5
strategy Bad {
    on bar_close {
        let up = (close[0] > open[0]) + 1;
        if (up > 0) { flatten; }
    }
}
