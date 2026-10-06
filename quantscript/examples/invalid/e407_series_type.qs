// EXPECT: E407
// EXPECT-LINE: 4
strategy Bad {
    series x : volume = close[0];
    on bar_close { if (x[0] > 0vol) { flatten; } }
}
