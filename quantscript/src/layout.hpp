// Runtime storage layout of the generated strategy's State struct (§10).
#pragma once
#include <map>
#include <string>
#include <vector>

#include "causality.hpp"
#include "json.hpp"
#include "tac.hpp"

struct Member {
    std::string name;
    std::string ctype;   // C++ element type: long, double, bool
    long count = 0;      // array length (0 = scalar)
    long offset = 0, size = 0, align = 8;
    std::string kind;    // bars, buffer, acc, deque, state
    std::string ref;     // series / accumulator / state name
    std::string note;
    std::string typeText() const { return count ? ctype + "[" + std::to_string(count) + "]" : ctype; }
};

struct Layout {
    std::vector<Member> members;
    long total = 0;
    long warmup = 0;
    std::map<std::string, long> cap;          // series -> ring capacity (power of two)
    std::map<std::string, long> dqcap;        // deque accumulator -> capacity
    std::map<std::string, std::string> stateMember;  // state name -> member name

    const Member* find(const std::string& name) const;
    std::string toText() const;
    Json toJson() const;
};

long nextPow2(long n);
Layout computeLayout(const TacProgram& p, const CausalityResult& c);
