// EXPECT: E502
// EXPECT-LINE: 6
// Classic look-ahead bug: deciding at the open using that same bar's close.
strategy Peek {
    on bar_open {
        if (close[0] > 100px) { buy 1vol; }
    }
}
