// Reusable iterative data-flow framework + liveness, reaching definitions and
// available expressions (§11.1).
#pragma once
#include <algorithm>
#include <map>
#include <set>
#include <string>
#include <vector>

#include "cfg.hpp"
#include "tac.hpp"

template <class S>
struct DFResult {
    std::vector<S> in, out;
    int sweeps = 0;  // full passes over the blocks until nothing changed
};

// Generic round-robin worklist solver. Blocks are visited in reverse post-order
// (forward problems) or post-order (backward problems). On an acyclic CFG the
// first sweep already reaches the fixed point and the second only confirms it,
// so `sweeps` is at most 2 for every QuantScript program.
template <class S, class Meet, class Xfer>
DFResult<S> solveDataflow(const CFG& g, bool forward, const S& boundary, const S& init, Meet meet, Xfer xfer) {
    DFResult<S> r;
    size_t n = g.blocks.size();
    r.in.assign(n, init);
    r.out.assign(n, init);
    if (n == 0) return r;
    std::vector<int> order = g.rpo;
    if (!forward) std::reverse(order.begin(), order.end());
    std::vector<bool> live(n, false);
    for (int b : g.rpo) live[static_cast<size_t>(b)] = true;
    bool changed = true;
    while (changed) {
        changed = false;
        ++r.sweeps;
        for (int b : order) {
            const Block& B = g.blocks[static_cast<size_t>(b)];
            if (forward) {
                S x = init;
                bool first = true;
                if (b == 0) { x = boundary; first = false; }
                for (int p : B.pred) {
                    if (!live[static_cast<size_t>(p)]) continue;
                    if (first) { x = r.out[static_cast<size_t>(p)]; first = false; }
                    else x = meet(x, r.out[static_cast<size_t>(p)]);
                }
                r.in[static_cast<size_t>(b)] = x;
                S o = xfer(b, x);
                if (!(o == r.out[static_cast<size_t>(b)])) changed = true;
                r.out[static_cast<size_t>(b)] = o;
            } else {
                S x = boundary;
                bool first = true;
                for (int s : B.succ) {
                    if (first) { x = r.in[static_cast<size_t>(s)]; first = false; }
                    else x = meet(x, r.in[static_cast<size_t>(s)]);
                }
                r.out[static_cast<size_t>(b)] = x;
                S i = xfer(b, x);
                if (!(i == r.in[static_cast<size_t>(b)])) changed = true;
                r.in[static_cast<size_t>(b)] = i;
            }
        }
    }
    return r;
}

using TempSet = std::set<int>;

// Liveness of temporaries (backward, union).
DFResult<TempSet> liveness(const Function& f, const CFG& g);
// live-out set after each instruction.
std::vector<TempSet> liveOutPerInstr(const Function& f, const CFG& g, const DFResult<TempSet>& lv);

// Reaching definitions (forward, union); elements are instruction indices.
DFResult<std::set<int>> reachingDefs(const Function& f, const CFG& g);
// Definitions reaching just before each instruction.
std::vector<std::set<int>> reachingPerInstr(const Function& f, const CFG& g, const DFResult<std::set<int>>& rd);

// Available expressions (forward, intersection). Each entry maps an expression
// key to the temporary that holds its value on every incoming path.
struct AvailEntry {
    int holder = -1;
    std::vector<int> temps;            // operand temporaries
    std::vector<std::string> reads;    // memory resources read ($s, @x, &acc, bars)
    bool operator==(const AvailEntry& o) const { return holder == o.holder; }
};
struct AvailSet {
    bool top = true;  // "all expressions" (identity of intersection)
    std::map<std::string, AvailEntry> m;
    bool operator==(const AvailSet& o) const { return top == o.top && m == o.m; }
};

// Expression key for CSE; false if the instruction is not a reusable pure expression.
bool cseKey(const Instr& in, std::string& key, std::vector<int>& temps, std::vector<std::string>& reads);
// Memory resources written by a side-effecting instruction.
std::vector<std::string> writesOf(const Instr& in);
// Applies one instruction to an available set (kills, then gens).
void availStep(const Instr& in, AvailSet& s);
DFResult<AvailSet> availableExprs(const Function& f, const CFG& g);
