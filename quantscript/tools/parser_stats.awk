# Extracts LALR statistics from Bison's -v report (parser.output) and prints
# a C++ include with #defines consumed by the qsc driver (src/main.cpp).
/^Grammar$/                                   { sec = "grammar"; next }
/^Terminals, with rules where they appear$/   { sec = "term"; next }
/^Nonterminals, with rules where they appear$/ { sec = "nonterm"; next }
/^State [0-9]+$/                              { sec = "state"; states++; next }
/conflict/                                    { if (match($0, /[0-9]+ (shift\/reduce|reduce\/reduce)/)) { split(substr($0, RSTART, RLENGTH), a, " "); conflicts += a[1] } }
sec == "grammar" && /^ *[0-9]+ /              { if ($1 + 0 > 0) rules++ }
sec == "term" && /^    [^ ]/                  { terms++ }
sec == "nonterm" && /^    [^ ]/               { nonterms++ }
END {
    printf "#define QS_LALR_STATES %d\n", states
    printf "#define QS_TERMINALS %d\n", terms
    printf "#define QS_NONTERMINALS %d\n", nonterms
    printf "#define QS_RULES %d\n", rules
    printf "#define QS_CONFLICTS %d\n", conflicts
}
