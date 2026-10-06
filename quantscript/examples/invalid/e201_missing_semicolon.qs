// EXPECT: E201
// EXPECT-LINE: 4
strategy Bad {
    const N : int = 20
    state pos : volume = 0vol;
    on bar_close { flatten; }
}
