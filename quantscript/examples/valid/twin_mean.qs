// Repeated mean(close, 20) and mean(open, 20) in both handlers:
// shows CSE inside a handler and accumulator sharing across handlers.
strategy TwinMean {
    const N : int = 20;
    state pos : volume = 0vol;
    on bar_open {
        if (open[0] < mean(open, N) - 1px && pos == 0vol) { buy 10vol; pos = 10vol; }
    }
    on bar_close {
        let a = close[0] - mean(close, N);
        let b = mean(close, N) - mean(open, N);
        let avgVol : volume = sum(volume, N) / 20.0;
        if (a > 0px && b > 0px && volume[0] > avgVol && pos > 0vol) { flatten; pos = 0vol; }
    }
}
