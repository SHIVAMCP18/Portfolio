// EXPECT: E309
// EXPECT-LINE: 4
strategy Bad {
    state anchor : price = close[0];
    on bar_close { if (close[0] > anchor) { flatten; } }
}
