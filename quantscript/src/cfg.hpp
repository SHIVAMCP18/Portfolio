// Basic blocks and control-flow graph over one TAC function (§11.1).
// QuantScript has no loops, so every CFG is acyclic (a DAG); see docs/DECISIONS.md.
#pragma once
#include <string>
#include <vector>

#include "json.hpp"
#include "tac.hpp"

struct Block {
    int id = 0;
    int first = 0, last = -1;  // inclusive instruction range
    std::vector<int> succ, pred;
};

struct CFG {
    std::vector<Block> blocks;
    std::vector<int> blockOf;  // instruction index -> block id
    std::vector<int> rpo;      // reverse post-order of reachable blocks
    bool reachable(int b) const;
};

CFG buildCFG(const Function& f);
bool cfgIsAcyclic(const CFG& g);
std::string cfgText(const Function& f, const CFG& g, const TacProgram& p);
Json cfgJson(const Function& f, const CFG& g, const TacProgram& p, int idBase);
