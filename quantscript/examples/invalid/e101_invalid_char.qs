// EXPECT: E101
// EXPECT-LINE: 6
strategy Bad {
    state pos : volume = 0vol;
    on bar_close {
        if (close[0] > 100px # 2) { buy 1vol; pos = 1vol; }
    }
}
