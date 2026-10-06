// C++17 backend: emits <Strategy>.hpp (header-only class) and main.cpp (§13).
#pragma once
#include <string>

#include "ast.hpp"
#include "layout.hpp"
#include "regalloc.hpp"
#include "sema.hpp"
#include "tac.hpp"

struct CodegenOptions {
    bool strongTypes = false;
    bool asserts = false;
    int optLevel = 2;
    std::string sourceName;
};

std::string generateHeader(const TacProgram& p, const RegAllocResult& ra, const Layout& lay, const SemaResult& sr,
                           Node* program, const CodegenOptions& opt);
std::string generateMain(const std::string& strategy);
