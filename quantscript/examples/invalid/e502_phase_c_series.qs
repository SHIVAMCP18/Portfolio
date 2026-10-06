// EXPECT: E502
// EXPECT-LINE: 7
strategy Peek {
    series r : scalar = close[0] / close[1];   // phase C
    on bar_open {
        if (r[1] > 1.0) { buy 1vol; }           // ok: yesterday's ratio
        if (r[0] > 1.0) { sell 1vol; }          // illegal: today's close
    }
}
