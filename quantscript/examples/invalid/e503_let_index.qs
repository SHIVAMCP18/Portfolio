// EXPECT: E503
// EXPECT-LINE: 6
strategy Bad {
    on bar_close {
        let n = 3;
        let z = close[n];
        if (z > 0px) { flatten; }
    }
}
