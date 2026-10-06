/* QuantScript grammar (Bison, LALR(1)). Built with: bison -d -v */
%code requires {
#include <string>
#include <vector>
struct Node;
struct Token;
class DiagEngine;
struct AstArena;

// Parser context: the parser pulls tokens from the pre-scanned vector.
struct ParseCtx {
    const std::vector<Token>* toks = nullptr;
    size_t pos = 0;
    DiagEngine* diag = nullptr;
    AstArena* arena = nullptr;
    Node* root = nullptr;
    int errors = 0;
};
// Returns the Program node (possibly partial) and reports E201 errors.
Node* parseTokens(ParseCtx& ctx);
}

%code {
#include <cstdio>
#include "ast.hpp"
#include "diag.hpp"
#include "lexer.hpp"

static ParseCtx* P = nullptr;
static int yylex(void);
static void yyerror(const char* msg);

static Node* mk(NK k, const YYLTYPE& loc) {
    Node* n = P->arena->make(k);
    n->line = n->sline = loc.first_line;
    n->col = n->scol = loc.first_column;
    n->eline = loc.last_line;
    n->ecol = loc.last_column;
    return n;
}
static const Token& tok(int i) { return (*P->toks)[static_cast<size_t>(i)]; }
static Node* mkList(const YYLTYPE& loc) { return mk(NK::List, loc); }
static Node* bin(const char* op, Node* l, Node* r, const YYLTYPE& opLoc, const YYLTYPE& all) {
    Node* n = mk(NK::BinOp, all);
    n->name = op;
    n->line = opLoc.first_line;
    n->col = opLoc.first_column;
    n->a = l;
    n->b = r;
    return n;
}
static Node* un(const char* op, Node* e, const YYLTYPE& all) {
    Node* n = mk(NK::UnOp, all);
    n->name = op;
    n->a = e;
    return n;
}
static Node* lit(int t, const YYLTYPE& loc) {
    Node* n = mk(NK::NumLit, loc);
    const Token& k = tok(t);
    n->num = k.value;
    n->lexeme = k.lexeme;
    n->isInt = k.type == "INT_LIT";
    n->isPct = k.type == "PCT_LIT";
    n->hasUnit = k.type == "UNIT_LIT";
    n->unit = k.unit;
    return n;
}
}

%locations
%define parse.error custom
%expect 0

%union {
    Node* node;
    int tok;
    int tname;
}

%token <tok> T_IDENT "identifier"
%token <tok> T_INT_LIT "integer literal"
%token <tok> T_FLOAT_LIT "float literal"
%token <tok> T_UNIT_LIT "unit literal"
%token <tok> T_PCT_LIT "percent literal"
%token T_STRATEGY "strategy" T_PARAM "param" T_CONST "const" T_STATE "state"
%token T_SERIES "series" T_FUNC "func" T_LET "let" T_IF "if" T_ELSE "else"
%token T_ON "on" T_BAR_OPEN "bar_open" T_BAR_CLOSE "bar_close"
%token T_BUY "buy" T_SELL "sell" T_FLATTEN "flatten" T_INIT "init"
%token T_TRUE "true" T_FALSE "false"
%token T_PRICE "price" T_VOLUME "volume" T_NOTIONAL "notional" T_SCALAR "scalar"
%token T_BOOL "bool" T_INT "int"
%token T_EQ "==" T_NE "!=" T_LE "<=" T_GE ">=" T_AND "&&" T_OR "||" T_ARROW "->"

%type <node> program items item const_decl param_decl state_decl series_decl func_decl
%type <node> formals formal_list formal handler block stmts stmt else_opt init_opt
%type <node> expr postfix primary name args arg_list
%type <tname> type opt_type

%left T_OR
%left T_AND
%nonassoc T_EQ T_NE
%nonassoc '<' T_LE '>' T_GE
%left '+' '-'
%left '*' '/'
%right UNARY '!'

%%

program
    : T_STRATEGY T_IDENT '{' items '}'      { $$ = mk(NK::Program, @$); $$->name = tok($2).lexeme;
                                              $$->line = @2.first_line; $$->col = @2.first_column;
                                              $$->list = $4->list; P->root = $$; }
    ;

items
    : %empty                                { $$ = mkList(@$); }
    | items item                            { $$ = $1; if ($2) $$->list.push_back($2); }
    ;

item
    : const_decl | param_decl | state_decl | series_decl | func_decl | handler
    | error ';'                             { $$ = nullptr; yyerrok; }
    | error '}'                             { $$ = nullptr; yyerrok; }
    ;

const_decl
    : T_CONST T_IDENT ':' type '=' expr ';' { $$ = mk(NK::ConstDecl, @$); $$->name = tok($2).lexeme;
                                              $$->line = @2.first_line; $$->col = @2.first_column;
                                              $$->declType = static_cast<TypeName>($4); $$->a = $6; }
    ;
param_decl
    : T_PARAM T_IDENT ':' type '=' expr ';' { $$ = mk(NK::ParamDecl, @$); $$->name = tok($2).lexeme;
                                              $$->line = @2.first_line; $$->col = @2.first_column;
                                              $$->declType = static_cast<TypeName>($4); $$->a = $6; }
    ;
state_decl
    : T_STATE T_IDENT ':' type '=' expr ';' { $$ = mk(NK::StateDecl, @$); $$->name = tok($2).lexeme;
                                              $$->line = @2.first_line; $$->col = @2.first_column;
                                              $$->declType = static_cast<TypeName>($4); $$->a = $6; }
    ;
series_decl
    : T_SERIES T_IDENT ':' type init_opt '=' expr ';'
                                            { $$ = mk(NK::SeriesDecl, @$); $$->name = tok($2).lexeme;
                                              $$->line = @2.first_line; $$->col = @2.first_column;
                                              $$->declType = static_cast<TypeName>($4); $$->b = $5; $$->a = $7; }
    ;
init_opt
    : %empty                                { $$ = nullptr; }
    | T_INIT expr                           { $$ = $2; }
    ;
func_decl
    : T_FUNC T_IDENT '(' formals ')' T_ARROW type '=' expr ';'
                                            { $$ = mk(NK::FuncDecl, @$); $$->name = tok($2).lexeme;
                                              $$->line = @2.first_line; $$->col = @2.first_column;
                                              $$->list = $4->list; $$->declType = static_cast<TypeName>($7); $$->a = $9; }
    ;
formals
    : %empty                                { $$ = mkList(@$); }
    | formal_list                           { $$ = $1; }
    ;
formal_list
    : formal                                { $$ = mkList(@$); $$->list.push_back($1); }
    | formal_list ',' formal                { $$ = $1; $$->list.push_back($3); }
    ;
formal
    : T_IDENT ':' type                      { $$ = mk(NK::Formal, @$); $$->name = tok($1).lexeme;
                                              $$->declType = static_cast<TypeName>($3); }
    ;
handler
    : T_ON T_BAR_OPEN block                 { $$ = mk(NK::Handler, @$); $$->handlerKind = 0; $$->a = $3; }
    | T_ON T_BAR_CLOSE block                { $$ = mk(NK::Handler, @$); $$->handlerKind = 1; $$->a = $3; }
    ;

block
    : '{' stmts '}'                         { $$ = mk(NK::Block, @$); $$->list = $2->list; }
    ;
stmts
    : %empty                                { $$ = mkList(@$); }
    | stmts stmt                            { $$ = $1; if ($2) $$->list.push_back($2); }
    ;
stmt
    : T_LET T_IDENT opt_type '=' expr ';'   { $$ = mk(NK::Let, @$); $$->name = tok($2).lexeme;
                                              $$->line = @2.first_line; $$->col = @2.first_column;
                                              $$->hasType = $3 >= 0;
                                              if ($3 >= 0) $$->declType = static_cast<TypeName>($3);
                                              $$->a = $5; }
    | name '=' expr ';'                     { $$ = mk(NK::Assign, @$); $$->name = $1->name; $$->a = $3; }
    | T_IF '(' expr ')' block else_opt      { $$ = mk(NK::If, @$); $$->a = $3; $$->b = $5; $$->c = $6;
                                              $$->line = @3.first_line; $$->col = @3.first_column; }
    | T_BUY expr ';'                        { $$ = mk(NK::Buy, @$); $$->a = $2; }
    | T_SELL expr ';'                       { $$ = mk(NK::Sell, @$); $$->a = $2; }
    | T_FLATTEN ';'                         { $$ = mk(NK::Flatten, @$); }
    | error ';'                             { $$ = nullptr; yyerrok; }
    ;
else_opt
    : %empty                                { $$ = nullptr; }
    | T_ELSE block                          { $$ = $2; }
    ;
opt_type
    : %empty                                { $$ = -1; }
    | ':' type                              { $$ = $2; }
    ;
type
    : T_PRICE                               { $$ = static_cast<int>(TypeName::Price); }
    | T_VOLUME                              { $$ = static_cast<int>(TypeName::Volume); }
    | T_NOTIONAL                            { $$ = static_cast<int>(TypeName::Notional); }
    | T_SCALAR                              { $$ = static_cast<int>(TypeName::Scalar); }
    | T_BOOL                                { $$ = static_cast<int>(TypeName::Bool); }
    | T_INT                                 { $$ = static_cast<int>(TypeName::Int); }
    ;

expr
    : expr T_OR expr                        { $$ = bin("||", $1, $3, @2, @$); }
    | expr T_AND expr                       { $$ = bin("&&", $1, $3, @2, @$); }
    | expr T_EQ expr                        { $$ = bin("==", $1, $3, @2, @$); }
    | expr T_NE expr                        { $$ = bin("!=", $1, $3, @2, @$); }
    | expr '<' expr                         { $$ = bin("<", $1, $3, @2, @$); }
    | expr T_LE expr                        { $$ = bin("<=", $1, $3, @2, @$); }
    | expr '>' expr                         { $$ = bin(">", $1, $3, @2, @$); }
    | expr T_GE expr                        { $$ = bin(">=", $1, $3, @2, @$); }
    | expr '+' expr                         { $$ = bin("+", $1, $3, @2, @$); }
    | expr '-' expr                         { $$ = bin("-", $1, $3, @2, @$); }
    | expr '*' expr                         { $$ = bin("*", $1, $3, @2, @$); }
    | expr '/' expr                         { $$ = bin("/", $1, $3, @2, @$); }
    | '-' expr %prec UNARY                  { $$ = un("-", $2, @$); }
    | '!' expr                              { $$ = un("!", $2, @$); }
    | postfix                               { $$ = $1; }
    ;
postfix
    : primary                               { $$ = $1; }
    | postfix '[' expr ']'                  { $$ = mk(NK::Index, @$); $$->a = $1; $$->b = $3; }
    ;
primary
    : T_INT_LIT                             { $$ = lit($1, @$); }
    | T_FLOAT_LIT                           { $$ = lit($1, @$); }
    | T_UNIT_LIT                            { $$ = lit($1, @$); }
    | T_PCT_LIT                             { $$ = lit($1, @$); }
    | T_TRUE                                { $$ = mk(NK::BoolLit, @$); $$->num = 1; }
    | T_FALSE                               { $$ = mk(NK::BoolLit, @$); $$->num = 0; }
    | name                                  { $$ = $1; }
    | name '(' args ')'                     { $$ = mk(NK::Call, @$); $$->name = $1->name; $$->list = $3->list; }
    | '(' expr ')'                          { $$ = $2; $$->sline = @$.first_line; $$->scol = @$.first_column;
                                              $$->eline = @$.last_line; $$->ecol = @$.last_column; }
    ;
name
    : T_IDENT                               { $$ = mk(NK::Ident, @$); $$->name = tok($1).lexeme; }
    | T_VOLUME                              { $$ = mk(NK::Ident, @$); $$->name = "volume"; }
    ;
args
    : %empty                                { $$ = mkList(@$); }
    | arg_list                              { $$ = $1; }
    ;
arg_list
    : expr                                  { $$ = mkList(@$); $$->list.push_back($1); }
    | arg_list ',' expr                     { $$ = $1; $$->list.push_back($3); }
    ;

%%

static int yylex(void) {
    if (P->pos >= P->toks->size()) {
        const Token* last = P->toks->empty() ? nullptr : &P->toks->back();
        int l = last ? last->line : 1, c = last ? last->col + static_cast<int>(last->lexeme.size()) : 1;
        yylloc.first_line = yylloc.last_line = l;
        yylloc.first_column = yylloc.last_column = c;
        return 0;
    }
    int i = static_cast<int>(P->pos++);
    const Token& t = tok(i);
    yylloc.first_line = t.line;
    yylloc.first_column = t.col;
    yylloc.last_line = t.line;
    yylloc.last_column = t.col + static_cast<int>(t.lexeme.size());
    yylval.tok = i;
    return t.kind;
}

// Bison symbol names come quoted ("state", ';'); show them as `state`.
static std::string shown(const char* raw) {
    std::string s = raw;
    if (s.size() >= 2 && (s[0] == '"' || s[0] == '\'') && s.back() == s[0]) s = s.substr(1, s.size() - 2);
    if (s == "end of file") return "end of input";
    if (s == "identifier" || s.find(" literal") != std::string::npos) return s;
    return "`" + s + "`";
}

static void report(int line, int col, int len, const std::string& msg, const std::string& hint) {
    ++P->errors;
    if (P->errors > 20) return;
    P->diag->error("E201", line, col, "syntax error: " + msg).withHint(hint).caret(len);
}

// Custom syntax-error reporter: lists every expected token (verbose mode caps
// the list at four) and points at the end of the previous token when a `;`
// or `}` is missing at the end of a line.
static int yyreport_syntax_error(const yypcontext_t* ctx) {
    enum { kMax = 64 };
    yysymbol_kind_t exp[kMax];
    int n = yypcontext_expected_tokens(ctx, exp, kMax);
    if (n < 0) n = 0;
    yysymbol_kind_t un = yypcontext_token(ctx);
    const YYLTYPE* loc = yypcontext_location(ctx);
    bool wantSemi = false, wantBrace = false;
    std::vector<std::string> names;
    for (int i = 0; i < n; ++i) {
        std::string nm = shown(yysymbol_name(exp[i]));
        if (nm == "`;`") wantSemi = true;
        if (nm == "`}`") wantBrace = true;
        names.push_back(nm);
    }
    std::string list;
    const size_t show = 8;
    for (size_t i = 0; i < names.size() && i < show; ++i) list += (i ? (i + 1 == names.size() ? " or " : ", ") : "") + names[i];
    if (names.size() > show) list += " (or " + std::to_string(names.size() - show) + " more)";
    std::string unexpected = un == YYSYMBOL_YYEMPTY ? "?" : shown(yysymbol_name(un));
    // A missing terminator is reported right after the previous token.
    if ((wantSemi || wantBrace) && P->pos >= 2) {
        const Token& prev = (*P->toks)[P->pos - 2];
        if (prev.line < loc->first_line || un == YYSYMBOL_YYEOF) {
            const char* what = wantSemi ? "`;`" : "`}`";
            report(prev.line, prev.col + static_cast<int>(prev.lexeme.size()), 1,
                   std::string("expected ") + what + " after `" + prev.lexeme + "`, found " + unexpected,
                   wantSemi ? "statements and declarations end with `;`" : "a block is missing its closing `}`");
            return 0;
        }
    }
    std::string msg = "unexpected " + unexpected;
    if (!list.empty()) msg += ", expected " + list;
    std::string hint = "check the statement near this token";
    if (wantSemi) hint = "statements and declarations end with `;`";
    else if (unexpected == "`=`") hint = "declarations need a type annotation, e.g. `const N : int = 20;`";
    else if (unexpected == "end of input") hint = "a `}` may be missing";
    int len = 1;
    if (P->pos > 0 && P->pos <= P->toks->size() && un != YYSYMBOL_YYEOF) len = static_cast<int>((*P->toks)[P->pos - 1].lexeme.size());
    report(loc->first_line, loc->first_column, len, msg, hint);
    return 0;
}

static void yyerror(const char* msg) { report(yylloc.first_line, yylloc.first_column, 1, msg, "the parser gave up here"); }

Node* parseTokens(ParseCtx& ctx) {
    P = &ctx;
    ctx.pos = 0;
    ctx.errors = 0;
    ctx.root = nullptr;
    int rc = yyparse();
    if (rc != 0 && ctx.errors == 0) {
        ++ctx.errors;
        ctx.diag->error("E201", 1, 1, "syntax error: unable to parse input");
    }
    P = nullptr;
    return ctx.root;
}
