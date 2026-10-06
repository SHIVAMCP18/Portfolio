// EXPECT-WARN: W601
strategy Unused {
    const N : int = 20;
    on bar_close { if (close[0] > close[1]) { buy 1vol; } }
}
