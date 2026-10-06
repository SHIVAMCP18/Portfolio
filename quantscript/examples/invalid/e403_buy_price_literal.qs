// EXPECT: E403
// EXPECT-LINE: 5
strategy Bad {
    on bar_close {
        buy 100px;
    }
}
