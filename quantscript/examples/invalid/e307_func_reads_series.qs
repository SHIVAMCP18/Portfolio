// EXPECT: E307
// EXPECT-LINE: 4
strategy Bad {
    func lastClose() -> price = close[0];
    on bar_close { if (lastClose() > 100px) { flatten; } }
}
