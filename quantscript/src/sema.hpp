// Name resolution and the dimensional type checker (passes 1-3 of §7.2).
#pragma once
#include <map>
#include <vector>

#include "ast.hpp"
#include "diag.hpp"
#include "symtab.hpp"

struct SemaResult {
    std::vector<Symbol*> fields;       // open, high, low, close, volume
    std::vector<Symbol*> seriesTopo;   // derived series in evaluation order
    std::vector<Symbol*> consts, params, states, funcs;
    Node* handlers[2] = {nullptr, nullptr};  // [0] = bar_open, [1] = bar_close
    bool ordersIssued = false;
};

class Sema {
public:
    Sema(DiagEngine& diag, SymTab& st, Node* program) : d_(diag), st_(st), prog_(program) {}

    // Runs the declaration, resolution/type and dependency passes. Stops after
    // the first pass that produced errors. Returns true if there were no errors.
    bool run();
    const SemaResult& result() const { return res_; }

private:
    void declareBuiltins();
    void declarationPass();
    void typePass();
    void dependencyPass();
    void warnings();

    void checkItem(Node* item);
    void checkBlock(Node* block, bool newScope);
    void checkStmt(Node* s);
    Type expr(Node* e);
    Type binop(Node* e);
    Type unop(Node* e);
    Type index(Node* e);
    Type ident(Node* e);
    Type call(Node* e);
    Type builtinCall(Node* e, Symbol* fn);
    Symbol* resolve(const std::string& name, int line, int col, bool asFunction = false);
    Symbol* seriesArg(Node* arg, const char* fname);
    // Requires a compile-time constant integer; reports `code` (or E504 for params).
    bool constInt(Node* e, const char* code, const std::string& what, long* out);
    bool refsParam(const Node* e) const;
    bool compatible(const Type& declared, const Type& found) const;
    void noteRead(Symbol* s, long k);

    DiagEngine& d_;
    SymTab& st_;
    Node* prog_;
    SemaResult res_;

    int curOrder_ = 0;
    Symbol* curSeries_ = nullptr;
    bool inInit_ = false;
    bool inFunc_ = false;
    Symbol* curFunc_ = nullptr;
    std::map<Symbol*, std::vector<std::pair<Symbol*, Node*>>> deps_;  // zero-delay reads
};
