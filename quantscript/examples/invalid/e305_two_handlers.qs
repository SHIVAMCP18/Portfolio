// EXPECT: E305
// EXPECT-LINE: 5
strategy Bad {
    on bar_close { flatten; }
    on bar_close { buy 1vol; }
}
