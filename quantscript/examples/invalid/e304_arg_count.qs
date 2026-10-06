// EXPECT: E304
// EXPECT-LINE: 4
strategy Bad {
    series m : price = mean(close);
    on bar_close { if (close[0] > m[0]) { flatten; } }
}
