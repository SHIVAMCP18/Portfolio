// EXPECT: E505
// EXPECT-LINE: 4
strategy Bad {
    series z : price = zigzag(close, 5);
    on bar_close { if (close[0] > z[0]) { buy 1vol; } }
}
