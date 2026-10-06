// Regex -> NFA (Thompson) -> DFA (subset construction) -> minimal DFA (Hopcroft).
// Used by tools/regex2dfa and by qsc to put the lexer DFAs into the phase dump.
#pragma once
#include <bitset>
#include <cstdint>
#include <memory>
#include <random>
#include <string>
#include <vector>

#include "json.hpp"

using CharSet = std::bitset<128>;

struct RNode {
    enum K { Chars, Cat, Alt, Star, Plus, Opt, Empty } k = Empty;
    CharSet set;
    std::unique_ptr<RNode> l, r;
};

struct Dfa {
    int start = 0;
    std::vector<bool> accept;
    std::vector<std::vector<int>> next;  // next[s][c] (c < 128), -1 = reject
    int size() const { return static_cast<int>(accept.size()); }
    bool matches(const std::string& s) const;
};

struct TokenClassDfa {
    std::string name;
    std::string regex;
    std::string flexType;  // token type the Flex scanner reports for this class
    int nfaStates = 0, dfaStates = 0, minStates = 0;
    Dfa dfa, min;
    std::unique_ptr<RNode> ast;
};

// Parses a regex (literals, \escapes, ., [classes], | * + ? and parentheses).
std::unique_ptr<RNode> parseRegex(const std::string& re, std::string& err);
// Builds all three automata for a regex.
bool buildTokenClass(TokenClassDfa& tc, std::string& err);
// The token classes of QuantScript's lexer (§4.2).
std::vector<TokenClassDfa> quantscriptTokenClasses();
// Random string generation: either a sample of the regex or noise from its alphabet.
std::string sampleRegex(const RNode* n, std::mt19937& rng);
std::string noiseString(const std::string& alphabet, std::mt19937& rng);

Json dfaJson(const TokenClassDfa& tc);
