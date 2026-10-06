// Abstract syntax tree for QuantScript. One Node struct with a kind tag keeps
// the Bison %union simple; nodes live in an arena owned by the compiler context.
#pragma once
#include <memory>
#include <optional>
#include <string>
#include <vector>

#include "dim.hpp"
#include "json.hpp"

struct Symbol;

enum class NK {
    Program,
    ConstDecl, ParamDecl, StateDecl, SeriesDecl, FuncDecl, Formal,
    Handler, Block,
    Let, Assign, If, Buy, Sell, Flatten,
    BinOp, UnOp, Index, Call,
    NumLit, BoolLit, Ident,
    List  // parser-internal helper
};

const char* nkName(NK k);

// Time stamp of a data read: d = bars ago, phase 'O' or 'C'.
struct Stamp {
    bool valid = false;
    long d = 0;
    char phase = 'C';
};

struct Ann {
    Type type;
    Stamp stamp;
    Symbol* sym = nullptr;
    std::optional<double> constValue;
    std::string derivation;  // e.g. "(1,0)+(0,1) = (1,1) notional"
};

struct Node {
    NK kind = NK::List;
    // Anchor position (for BinOp: the operator) and full source span.
    int line = 0, col = 0;
    int sline = 0, scol = 0, eline = 0, ecol = 0;

    std::string name;  // identifier / declared name / operator / callee
    TypeName declType = TypeName::Scalar;
    bool hasType = false;

    // Literals
    double num = 0;
    Dim unit;
    bool isInt = false;
    bool isPct = false;
    bool hasUnit = false;
    std::string lexeme;

    int handlerKind = 0;  // 0 = bar_open, 1 = bar_close

    Node* a = nullptr;
    Node* b = nullptr;
    Node* c = nullptr;
    std::vector<Node*> list;

    Ann ann;
};

struct AstArena {
    std::vector<std::unique_ptr<Node>> nodes;
    Node* make(NK k) {
        nodes.push_back(std::make_unique<Node>());
        nodes.back()->kind = k;
        return nodes.back().get();
    }
};

// Source text of an expression reconstructed from the AST (e.g. "close[0]").
std::string exprText(const Node* n);
// Indented, annotated text dump.
std::string astToText(const Node* n);
// JSON dump with annotations (for the viewer).
Json astToJson(const Node* n);
// Concrete-style parse tree derived from the AST (grammar nonterminal names).
Json parseTreeJson(const Node* n);
