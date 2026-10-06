// Scoped symbol table (stack of hash-map scopes; all scopes are retained for dumping).
#pragma once
#include <memory>
#include <optional>
#include <string>
#include <unordered_map>
#include <vector>

#include "dim.hpp"
#include "json.hpp"

struct Node;

enum class SymKind { Const, Param, State, Series, Func, Let, Formal, BuiltinSeries, BuiltinFunc };
const char* symKindName(SymKind k);

struct Symbol {
    std::string name;
    SymKind kind = SymKind::Let;
    Type type;
    int declLine = 0, declCol = 0;
    bool isMutable = false;
    std::optional<double> constValue;
    char phase = 'C';         // series phase 'O' or 'C' (filled by causality)
    long maxHistoryRead = 0;  // largest k read as x[k]
    long depth = 0;           // look-back depth (causality)
    long bufsize = 0;         // ring-buffer requirement (causality)
    std::string bufReason;    // which read determined bufsize
    bool used = false;
    bool hasInit = false;     // recursive series with init clause
    int order = 0;            // global declaration order
    int scope = 0;
    Node* decl = nullptr;
};

struct Scope {
    int id = 0;
    int parent = -1;
    std::string kind;  // global, func, handler, block
    std::vector<Symbol*> syms;
    std::unordered_map<std::string, Symbol*> map;
};

class SymTab {
public:
    SymTab();
    int enter(const std::string& kind);
    void exit();
    int current() const { return stack_.back(); }

    // Returns the new symbol, or nullptr if the name already exists in the current
    // scope (then *existing is set).
    Symbol* declare(const std::string& name, SymKind kind, Type type, int line, int col, Symbol** existing = nullptr);
    Symbol* lookup(const std::string& name) const;
    // Closest visible name within edit distance <= 2, or "".
    std::string suggest(const std::string& name) const;

    const std::vector<Scope>& scopes() const { return scopes_; }
    std::vector<Symbol*> allSymbols() const;
    Json toJson() const;
    std::string toText() const;

private:
    std::vector<std::unique_ptr<Symbol>> owned_;
    std::vector<Scope> scopes_;
    std::vector<int> stack_;
};

int editDistance(const std::string& a, const std::string& b);
