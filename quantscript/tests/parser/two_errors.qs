// Two independent syntax errors; error recovery must report both.
// EXPECT-ERRORS: 2
strategy TwoErrors {
    const N : int 20;
    state pos : volume = 0vol;
    on bar_close {
        let x = close[0] * ;
        if (x > 0ntl && pos == 0vol) { buy 1vol; pos = 1vol; }
    }
}
