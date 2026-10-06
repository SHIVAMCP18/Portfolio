// EXPECT: E103
// EXPECT-LINE: 5
strategy Bad {
    on bar_close {
        if (close[0] > 12abc) { flatten; }
    }
}
