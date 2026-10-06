// EXPECT: E308
// EXPECT-LINE: 5
strategy Bad {
    on bar_close {
        if (close > 100px) { flatten; }
    }
}
