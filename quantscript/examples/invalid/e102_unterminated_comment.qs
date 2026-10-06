// EXPECT: E102
// EXPECT-LINE: 5
strategy Bad {
    on bar_close { flatten; }
    /* this comment never ends
}
