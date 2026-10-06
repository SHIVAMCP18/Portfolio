// Three-address code: quadruple-style instructions, printer and interpreter (§9).
#pragma once
#include <map>
#include <set>
#include <string>
#include <vector>

#include "json.hpp"

enum class Op {
    // data
    CONST, COPY, LOADFIELD, HIST, SPUSH, SLOAD, SSTORE, PARAM, BARS_GT, TICK,
    // arithmetic
    ADD, SUB, MUL, DIV, NEG,
    // compare / logic
    LT, LE, GT, GE, EQ, NE, AND, OR, NOT,
    // math
    ABS, MIN, MAX, SQRT, LOG, EXP, POW, SIGN, CLAMP,
    // high-level windows (before lowering)
    ROLLMEAN, ROLLSUM, ROLLSTD, ROLLMAX, ROLLMIN, EMA,
    // low-level windows (after strength reduction)
    EMA_UPD, RSUM_UPD, RSQ_UPD, ALOAD, RSTD, WMAX_UPD, WMIN_UPD, WMAX_GET, WMIN_GET,
    // control
    LABEL, JMP, JZ, JNZ,
    // orders
    BUY, SELL, FLATTEN,
    NOP
};

const char* opName(Op op);

struct Opnd {
    enum K { None, Temp, Const } k = None;
    int t = -1;
    double c = 0;
    static Opnd temp(int id) { Opnd o; o.k = Temp; o.t = id; return o; }
    static Opnd konst(double v) { Opnd o; o.k = Const; o.c = v; return o; }
    bool isTemp() const { return k == Temp; }
    bool isConst() const { return k == Const; }
    bool operator==(const Opnd& o) const { return k == o.k && (k != Temp || t == o.t) && (k != Const || c == o.c); }
};

struct Instr {
    Op op = Op::NOP;
    int dst = -1;
    Opnd a, b, c;
    std::string sym;   // $series, @state, %param, field name, &accumulator
    std::string sym2;  // second accumulator / series (RSTD, WMAX_GET)
    long k = 0;        // history index, window N, BARS_GT threshold, EMA warm depth
    long n = 0;        // window N for update ops
    int label = -1;    // LABEL / JMP / JZ / JNZ target
    int line = 0;      // originating source line
};

struct TempInfo {
    char cls = 'F';     // F = double, B = bool
    std::string dim;    // dimension comment for dumps
};

struct Function {
    std::string name;   // "on_open" / "on_close"
    std::vector<Instr> code;
};

struct ParamInfo {
    std::string name;
    double value = 0;
    char cls = 'F';
    std::string type;
};

struct TacProgram {
    std::string strategy;
    Function funcs[2];
    std::vector<TempInfo> temps;  // index = temp id; temps[0] unused
    int nextLabel = 1;
    long warmup = 0;
    std::vector<ParamInfo> params, states;

    int newTemp(char cls, const std::string& dim) {
        if (temps.empty()) temps.push_back(TempInfo());
        temps.push_back(TempInfo{cls, dim});
        return static_cast<int>(temps.size()) - 1;
    }
    int newLabel() { return nextLabel++; }
    size_t instrCount() const;
};

bool opHasDst(Op op);
bool opIsPure(Op op);          // removable when its result is dead
bool opIsJump(Op op);
bool opIsCommutative(Op op);
char opResultClass(Op op);     // 'F', 'B' or 0 (depends on operand, e.g. COPY/CONST)
void instrUses(const Instr& in, std::vector<int>& out);

std::string opndText(const Opnd& o);
std::string fmtNum(double v);
std::string instrText(const Instr& in);
// Instruction text padded with "; dim" comment for the destination temp.
std::string instrLine(const TacProgram& p, const Instr& in);
std::string functionText(const TacProgram& p, const Function& f);
std::string programText(const TacProgram& p);
Json functionJson(const TacProgram& p, const Function& f);
Json programJson(const TacProgram& p);

// ---- interpreter -------------------------------------------------------

struct BarData {
    std::string date;
    double open = 0, high = 0, low = 0, close = 0, volume = 0;
};

struct OrderRec {
    long bar = 0;
    char phase = 'C';
    std::string side;
    double qty = 0;
};

struct Layout;

class Interpreter {
public:
    Interpreter(const TacProgram& p, const Layout& lay);
    // Runs all bars; returns orders in issue order. If `trace` is non-null,
    // appends per-bar values of every derived series ("bar name value").
    std::vector<OrderRec> run(const std::vector<BarData>& bars, std::vector<std::string>* trace = nullptr);

private:
    void exec(const Function& f, const BarData& bar, char phase, long barIndex, std::vector<OrderRec>& orders);
    double rd(const Opnd& o) const;
    double hist(const std::string& s, long k) const;
    struct Deque { std::vector<long> idx; long head = 0, tail = 0; };

    const TacProgram& p_;
    const Layout& lay_;
    long bars_ = 0;
    std::map<std::string, std::vector<double>> buf_;
    std::map<std::string, double> state_, param_, acc_;
    std::map<std::string, Deque> dq_;
    std::vector<double> t_;
};

bool readCsv(const std::string& path, std::vector<BarData>& out, std::string& err);
std::string orderText(const OrderRec& o);
