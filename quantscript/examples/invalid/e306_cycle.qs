// EXPECT: E306
// EXPECT-LINE: 4
strategy Bad {
    series a : price = a[0] + 1px;
    on bar_close { if (close[0] > a[1]) { flatten; } }
}
