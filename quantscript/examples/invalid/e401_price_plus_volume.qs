// EXPECT: E401
// EXPECT-LINE: 5
strategy Bad {
    on bar_close {
        let x = close[0] + volume[0];
        if (x > 0px) { flatten; }
    }
}
