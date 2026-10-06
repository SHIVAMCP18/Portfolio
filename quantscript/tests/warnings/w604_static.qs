// EXPECT-WARN: W604
strategy Static {
    on bar_close { if (close[1] > close[2]) { buy 1vol; } }
}
