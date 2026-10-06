// Optimization passes and pass manager (§11).
#pragma once
#include <string>
#include <vector>

#include "json.hpp"
#include "tac.hpp"

struct PassRecord {
    std::string name;
    Json before, after;      // TAC listings (programJson)
    std::string afterText;   // printable listing after the pass
    long countBefore = 0, countAfter = 0;
    long changed = 0;        // instructions rewritten by the pass
    int sweeps = 0;          // max data-flow sweeps used (0 = no data-flow)
};

struct OptReport {
    int level = 2;
    long initialCount = 0;
    std::vector<PassRecord> passes;
    int maxSweeps = 0;
};

// Runs the pass pipeline for -O0/-O1/-O2 in place.
OptReport optimize(TacProgram& p, int level);
Json optJson(const OptReport& r);
std::string optText(const OptReport& r, const TacProgram& initial);
