// EXPECT: E401
// EXPECT-LINE: 5
strategy Bad {
    on bar_close {
        if (close[0] > 100) { flatten; }
    }
}
