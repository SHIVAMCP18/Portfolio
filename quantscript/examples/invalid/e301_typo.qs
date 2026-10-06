// EXPECT: E301
// EXPECT-LINE: 5
strategy Bad {
    on bar_close {
        if (clsoe[0] > 100px) { flatten; }
    }
}
