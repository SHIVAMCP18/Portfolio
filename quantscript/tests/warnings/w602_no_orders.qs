// EXPECT-WARN: W602
strategy NoOrders {
    state hits : scalar = 0.0;
    on bar_close { if (close[0] > close[1]) { hits = hits + 1.0; } }
}
