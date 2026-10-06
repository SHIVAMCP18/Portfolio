// EXPECT: E405
// EXPECT-LINE: 5
strategy Bad {
    on bar_close {
        let s = sqrt(close[0]);
        if (s > 0.0) { flatten; }
    }
}
