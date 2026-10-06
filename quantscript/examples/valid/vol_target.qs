// Volatility-targeted sizing: pow/sqrt with correct dimensions.
//   pow(price, 2) : price^2      sqrt(price^2) : price      notional / price : volume
strategy VolTarget {
    const N : int = 20;
    param riskBudget : notional = 2000ntl;
    state pos : volume = 0vol;
    series m : price = mean(close, N);
    series range : price = high[0] - low[0];
    series atr : price = mean(range, N);
    on bar_close {
        let var = pow(atr[0], 2) + pow(close[0] - m[0], 2);   // price^2
        let vol : price = sqrt(var);                          // price
        let qty : volume = riskBudget / vol;                  // volume
        if (close[0] > m[0] + 0.5 * vol && pos == 0vol) { buy qty; pos = qty; }
        if (close[0] < m[0] && pos > 0vol) { flatten; pos = 0vol; }
    }
}
