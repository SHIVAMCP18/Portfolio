// 20.1 SMA crossover
strategy SmaCross {
    const FAST : int = 10;
    const SLOW : int = 30;
    state position : volume = 0vol;
    series fast : price = mean(close, FAST);
    series slow : price = mean(close, SLOW);
    on bar_close {
        if (crossover(fast, slow) && position == 0vol) { buy 100vol; position = 100vol; }
        if (crossunder(fast, slow) && position > 0vol) { flatten; position = 0vol; }
    }
}
