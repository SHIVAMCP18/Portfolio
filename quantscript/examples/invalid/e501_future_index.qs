// EXPECT: E501
// EXPECT-LINE: 4
strategy Bad {
    series s : price = close[-1];
    on bar_close { if (s[0] > close[0]) { buy 1vol; } }
}
