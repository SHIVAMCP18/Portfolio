// regex2dfa: Thompson construction -> subset construction -> Hopcroft minimization.
//
//   regex2dfa                       state counts for every QuantScript token class
//   regex2dfa --json                all token-class DFAs as JSON
//   regex2dfa --regex RE [--json]   a custom regex
//   regex2dfa --match CLASS         read lines on stdin, print 1/0 (minimal DFA accepts?)
//   regex2dfa --gen CLASS N SEED    print N test strings (regex samples + noise)
#include <cstdio>
#include <cstdlib>
#include <iostream>
#include <random>
#include <string>

#include "rdfa.hpp"

static int usage() {
    std::fprintf(stderr,
                 "usage: regex2dfa [--json] | --regex RE [--json] | --match CLASS | --gen CLASS N SEED\n");
    return 2;
}

int main(int argc, char** argv) {
    std::string mode = argc > 1 ? argv[1] : "";
    if (mode == "-h" || mode == "--help") { usage(); return 0; }
    if (mode == "--regex") {
        if (argc < 3) return usage();
        TokenClassDfa tc;
        tc.name = "custom";
        tc.regex = argv[2];
        std::string err;
        if (!buildTokenClass(tc, err)) {
            std::fprintf(stderr, "regex error: %s\n", err.c_str());
            return 1;
        }
        if (argc > 3 && std::string(argv[3]) == "--json") std::cout << dfaJson(tc).dump(2) << "\n";
        else std::printf("%s: NFA %d states, DFA %d states, minimal DFA %d states\n", tc.regex.c_str(), tc.nfaStates, tc.dfaStates, tc.minStates);
        return 0;
    }
    auto classes = quantscriptTokenClasses();
    if (mode.empty()) {
        std::printf("%-14s %6s %6s %8s  %s\n", "class", "NFA", "DFA", "min-DFA", "regex");
        for (auto& c : classes)
            std::printf("%-14s %6d %6d %8d  %s\n", c.name.c_str(), c.nfaStates, c.dfaStates, c.minStates, c.regex.c_str());
        return 0;
    }
    if (mode == "--json") {
        Json arr = Json::array();
        for (auto& c : classes) arr.push(dfaJson(c));
        std::cout << arr.dump(2) << "\n";
        return 0;
    }
    if (mode == "--match" || mode == "--gen") {
        if (argc < 3) return usage();
        std::string name = argv[2];
        TokenClassDfa* tc = nullptr;
        for (auto& c : classes)
            if (c.name == name) tc = &c;
        if (!tc) {
            std::fprintf(stderr, "unknown class %s\n", name.c_str());
            return 2;
        }
        if (mode == "--match") {
            std::string line;
            while (std::getline(std::cin, line)) std::printf("%d\n", tc->min.matches(line) ? 1 : 0);
            return 0;
        }
        if (argc < 5) return usage();
        int n = std::atoi(argv[3]);
        std::mt19937 rng(static_cast<unsigned>(std::atoi(argv[4])));
        const std::string alphabet = "0123456789.eE+-pxvolnt%_aZq*/=!<>&|(){}[],;:";
        for (int i = 0; i < n; ++i) {
            std::string s = i % 2 ? noiseString(alphabet, rng) : sampleRegex(tc->ast.get(), rng);
            if (s.empty()) s = "0";
            std::printf("%s\n", s.c_str());
        }
        return 0;
    }
    return usage();
}
