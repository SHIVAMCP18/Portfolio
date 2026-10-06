%top{
// Generated from src/lexer.l by Flex. Do not edit the generated file.
#pragma GCC diagnostic ignored "-Wsign-compare"
#pragma GCC diagnostic ignored "-Wunused-function"
}

%{
#include <cctype>
#include <cstdlib>
#include <sstream>
#include <string>
#include <vector>

#include "lexer.hpp"
#include "parser.tab.hpp"

namespace {
int curLine = 1, curCol = 1;      // position after the last consumed character
int tokLine = 1, tokCol = 1;      // position of the current match
int cmtLine = 1, cmtCol = 1;      // start of an open block comment
DiagEngine* gDiag = nullptr;
bool gOk = true;
Token gTok;

void advance(const char* text, int len) {
    tokLine = curLine;
    tokCol = curCol;
    for (int i = 0; i < len; ++i) {
        if (text[i] == '\n') { ++curLine; curCol = 1; }
        else ++curCol;
    }
}

int emit(int kind, const char* type) {
    gTok = Token();
    gTok.kind = kind;
    gTok.type = type;
    gTok.lexeme = qstext;
    gTok.line = tokLine;
    gTok.col = tokCol;
    return kind;
}

int emitNumber(int kind, const char* type, double value, Dim unit) {
    emit(kind, type);
    gTok.value = value;
    gTok.unit = unit;
    return kind;
}

Dim unitFromSuffix(const std::string& lex, size_t* numLen) {
    auto ends = [&](const char* s) {
        size_t n = std::char_traits<char>::length(s);
        return lex.size() > n && lex.compare(lex.size() - n, n, s) == 0;
    };
    if (ends("px")) { *numLen = lex.size() - 2; return Dim::price(); }
    if (ends("vol")) { *numLen = lex.size() - 3; return Dim::volume(); }
    *numLen = lex.size() - 3;  // ntl
    return Dim::notional();
}

void lexError(const char* code, const std::string& msg, const std::string& hint, int len) {
    gOk = false;
    if (gDiag) gDiag->error(code, tokLine, tokCol, msg).withHint(hint).caret(len);
}
}  // namespace

#define YY_USER_ACTION advance(qstext, static_cast<int>(qsleng));
%}

%option noyywrap nounput noinput never-interactive
%option prefix="qs"
%x CMT

D       [0-9]
EXP     [eE][+-]?{D}+
FLT     {D}+\.{D}+{EXP}?|{D}+{EXP}
ID      [A-Za-z_][A-Za-z0-9_]*

%%

[ \t\r\n]+                  { /* whitespace */ }
"//"[^\n]*                  { /* line comment */ }
"/*"                        { cmtLine = tokLine; cmtCol = tokCol; BEGIN(CMT); }
<CMT>"*/"                   { BEGIN(INITIAL); }
<CMT>[^*\n]+                { }
<CMT>"*"                    { }
<CMT>\n                     { }
<CMT><<EOF>>                {
                              gOk = false;
                              if (gDiag) gDiag->error("E102", cmtLine, cmtCol, "unterminated block comment")
                                  .withHint("close the comment with `*/` (block comments do not nest)").caret(2);
                              BEGIN(INITIAL);
                              return 0;
                            }

"strategy"                  { return emit(T_STRATEGY, "KEYWORD"); }
"param"                     { return emit(T_PARAM, "KEYWORD"); }
"const"                     { return emit(T_CONST, "KEYWORD"); }
"state"                     { return emit(T_STATE, "KEYWORD"); }
"series"                    { return emit(T_SERIES, "KEYWORD"); }
"func"                      { return emit(T_FUNC, "KEYWORD"); }
"let"                       { return emit(T_LET, "KEYWORD"); }
"if"                        { return emit(T_IF, "KEYWORD"); }
"else"                      { return emit(T_ELSE, "KEYWORD"); }
"on"                        { return emit(T_ON, "KEYWORD"); }
"bar_open"                  { return emit(T_BAR_OPEN, "KEYWORD"); }
"bar_close"                 { return emit(T_BAR_CLOSE, "KEYWORD"); }
"buy"                       { return emit(T_BUY, "KEYWORD"); }
"sell"                      { return emit(T_SELL, "KEYWORD"); }
"flatten"                   { return emit(T_FLATTEN, "KEYWORD"); }
"init"                      { return emit(T_INIT, "KEYWORD"); }
"true"                      { return emit(T_TRUE, "KEYWORD"); }
"false"                     { return emit(T_FALSE, "KEYWORD"); }
"price"                     { return emit(T_PRICE, "KEYWORD"); }
"volume"                    { return emit(T_VOLUME, "KEYWORD"); }
"notional"                  { return emit(T_NOTIONAL, "KEYWORD"); }
"scalar"                    { return emit(T_SCALAR, "KEYWORD"); }
"bool"                      { return emit(T_BOOL, "KEYWORD"); }
"int"                       { return emit(T_INT, "KEYWORD"); }

({D}+|{FLT})(px|vol|ntl)    {
                              std::string lex = qstext;
                              size_t n = 0;
                              Dim u = unitFromSuffix(lex, &n);
                              return emitNumber(T_UNIT_LIT, "UNIT_LIT", std::strtod(lex.substr(0, n).c_str(), nullptr), u);
                            }
({D}+|{FLT})"%"             {
                              std::string lex = qstext;
                              return emitNumber(T_PCT_LIT, "PCT_LIT", std::strtod(lex.substr(0, lex.size() - 1).c_str(), nullptr) / 100.0, Dim());
                            }
{FLT}                       { return emitNumber(T_FLOAT_LIT, "FLOAT_LIT", std::strtod(qstext, nullptr), Dim()); }
{D}+                        { return emitNumber(T_INT_LIT, "INT_LIT", std::strtod(qstext, nullptr), Dim()); }
({D}+|{FLT}){ID}            {
                              std::string lex = qstext;
                              size_t i = 0;
                              while (i < lex.size() && (std::isdigit(static_cast<unsigned char>(lex[i])) || lex[i] == '.')) ++i;
                              lexError("E103", "unknown unit suffix `" + lex.substr(i) + "` on number `" + lex + "`",
                                       "valid suffixes are `px` (price), `vol` (volume), `ntl` (notional) and `%`; separate a name from a number with a space",
                                       static_cast<int>(qsleng));
                            }
{D}+"."                     {
                              lexError("E103", std::string("malformed number `") + qstext + "`",
                                       "write at least one digit after the decimal point, e.g. `1.0`", static_cast<int>(qsleng));
                            }

{ID}                        { return emit(T_IDENT, "IDENT"); }

"=="                        { return emit(T_EQ, "OP"); }
"!="                        { return emit(T_NE, "OP"); }
"<="                        { return emit(T_LE, "OP"); }
">="                        { return emit(T_GE, "OP"); }
"&&"                        { return emit(T_AND, "OP"); }
"||"                        { return emit(T_OR, "OP"); }
"->"                        { return emit(T_ARROW, "OP"); }
[-+*/<>=!]                  { return emit(qstext[0], "OP"); }
[(){}\[\],;:]               { return emit(qstext[0], "PUNCT"); }

.                           {
                              unsigned char ch = static_cast<unsigned char>(qstext[0]);
                              std::string shown = ch >= 0x20 && ch < 0x7f ? std::string(1, static_cast<char>(ch)) : "\\x" + std::to_string(ch);
                              lexError("E101", "invalid character `" + shown + "`",
                                       "QuantScript operators are + - * / ( ) { } [ ] , ; : = == != < <= > >= && || ! ->", 1);
                            }

%%

bool lexSource(const std::string& src, DiagEngine& diag, std::vector<Token>& out) {
    curLine = curCol = tokLine = tokCol = 1;
    gDiag = &diag;
    gOk = true;
    YY_BUFFER_STATE buf = qs_scan_bytes(src.data(), static_cast<int>(src.size()));
    BEGIN(INITIAL);
    for (;;) {
        int k = qslex();
        if (k == 0) break;
        out.push_back(gTok);
    }
    qs_delete_buffer(buf);
    gDiag = nullptr;
    return gOk;
}

std::string classifyWithFlex(const std::string& s) {
    DiagEngine scratch;
    scratch.setSource("<classify>", s);
    std::vector<Token> toks;
    bool ok = lexSource(s, scratch, toks);
    if (!ok || toks.size() != 1 || toks[0].lexeme != s) return "NONE";
    return toks[0].type;
}

std::string tokensToText(const std::vector<Token>& toks) {
    std::ostringstream os;
    for (const Token& t : toks) {
        os << t.line << ":" << t.col << "\t" << t.type << "\t" << t.lexeme;
        if (t.type == "UNIT_LIT") os << "\t(" << t.value << " " << t.unit.name() << ")";
        if (t.type == "PCT_LIT") os << "\t(" << t.value << ")";
        os << "\n";
    }
    return os.str();
}

Json tokensToJson(const std::vector<Token>& toks) {
    Json arr = Json::array();
    for (const Token& t : toks) {
        Json o = Json::object();
        o.set("type", t.type);
        o.set("lexeme", t.lexeme);
        o.set("line", t.line);
        o.set("col", t.col);
        if (t.type == "UNIT_LIT") o.set("unit", t.unit.name());
        arr.push(o);
    }
    return arr;
}
