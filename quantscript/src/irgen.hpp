// AST -> TAC lowering (§9.3).
#pragma once
#include "causality.hpp"
#include "sema.hpp"
#include "tac.hpp"

// Produces two functions: on_open (OPEN_PROLOGUE + bar_open body) and
// on_close (CLOSE_PROLOGUE + bar_close body).
TacProgram generateTac(Node* program, const SemaResult& sr, const CausalityResult& cr);

// Canonical accumulator names, shared by IR generation and window lowering.
std::string accName(const std::string& kind, const std::string& series, long n);
