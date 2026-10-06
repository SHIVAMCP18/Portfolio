// EXPECT: E303
// EXPECT-LINE: 6
strategy Bad {
    on bar_close {
        let x = close[0];
        x = close[1];
        if (x > 100px) { flatten; }
    }
}
