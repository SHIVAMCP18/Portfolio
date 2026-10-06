// EXPECT: E404
// EXPECT-LINE: 5
strategy Bad {
    on bar_close {
        let r = log(close[0]);
        if (r > 0.0) { flatten; }
    }
}
