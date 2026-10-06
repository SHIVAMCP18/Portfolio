// Token stream produced by the Flex scanner (src/lexer.l).
#pragma once
#include <string>
#include <vector>

#include "diag.hpp"
#include "dim.hpp"
#include "json.hpp"

struct Token {
    int kind = 0;          // Bison token number (parser.tab.hpp)
    std::string type;      // IDENT, INT_LIT, FLOAT_LIT, UNIT_LIT, PCT_LIT, KEYWORD, OP, PUNCT
    std::string lexeme;
    int line = 0, col = 0;
    double value = 0;      // numeric value (PCT already divided by 100)
    Dim unit;              // for UNIT_LIT
};

// Tokenizes `src`. Lexical errors (E101-E103) go to `diag`; scanning continues
// after each error. Returns true when no lexical error occurred.
bool lexSource(const std::string& src, DiagEngine& diag, std::vector<Token>& out);

std::string tokensToText(const std::vector<Token>& toks);
Json tokensToJson(const std::vector<Token>& toks);

// Classifies a whole string with the real Flex scanner: returns the token type
// if `s` scans as exactly one token without errors, otherwise "NONE".
// Used to cross-check the regex2dfa tool against Flex.
std::string classifyWithFlex(const std::string& s);
