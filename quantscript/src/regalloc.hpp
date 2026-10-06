// Interference graph + Chaitin-Briggs graph-coloring register allocation (§12).
#pragma once
#include <map>
#include <string>
#include <vector>

#include "json.hpp"
#include "tac.hpp"

struct Loc {
    char cls = 'F';
    bool spilled = false;
    int idx = 0;  // register number or spill slot
};

struct RAFunc {
    std::string name;
    int fregs = 0, bregs = 0;    // registers used
    int fspill = 0, bspill = 0;  // spill slots used
    int rounds = 0;              // simplify/select rounds (re-runs after spilling)
};

struct RegAllocResult {
    int K = 8, KB = 4;
    std::map<int, Loc> loc;  // temp -> location
    RAFunc funcs[2];
    Json json;
    std::string text;
    std::string locName(int temp) const;  // r3, b1, fs[0], bs[2]
};

RegAllocResult allocateRegisters(const TacProgram& p, int K, int KB);
