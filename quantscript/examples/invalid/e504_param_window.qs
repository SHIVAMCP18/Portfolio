// EXPECT: E504
// EXPECT-LINE: 5
strategy Bad {
    param p : int = 20;
    series m : price = mean(close, p);
    on bar_close { if (close[0] > m[0]) { flatten; } }
}
