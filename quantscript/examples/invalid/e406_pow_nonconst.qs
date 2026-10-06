// EXPECT: E406
// EXPECT-LINE: 6
strategy Bad {
    on bar_close {
        let n = 2;
        let p = pow(close[0], n);
        if (p > p) { flatten; }
    }
}
