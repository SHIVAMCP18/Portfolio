#include "tac.hpp"

#include <algorithm>
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <fstream>
#include <sstream>

#include "layout.hpp"

const char* opName(Op op) {
    switch (op) {
        case Op::CONST: return "CONST";
        case Op::COPY: return "COPY";
        case Op::LOADFIELD: return "LOADFIELD";
        case Op::HIST: return "HIST";
        case Op::SPUSH: return "SPUSH";
        case Op::SLOAD: return "SLOAD";
        case Op::SSTORE: return "SSTORE";
        case Op::PARAM: return "PARAM";
        case Op::BARS_GT: return "BARS_GT";
        case Op::TICK: return "TICK";
        case Op::ADD: return "ADD";
        case Op::SUB: return "SUB";
        case Op::MUL: return "MUL";
        case Op::DIV: return "DIV";
        case Op::NEG: return "NEG";
        case Op::LT: return "LT";
        case Op::LE: return "LE";
        case Op::GT: return "GT";
        case Op::GE: return "GE";
        case Op::EQ: return "EQ";
        case Op::NE: return "NE";
        case Op::AND: return "AND";
        case Op::OR: return "OR";
        case Op::NOT: return "NOT";
        case Op::ABS: return "ABS";
        case Op::MIN: return "MIN";
        case Op::MAX: return "MAX";
        case Op::SQRT: return "SQRT";
        case Op::LOG: return "LOG";
        case Op::EXP: return "EXP";
        case Op::POW: return "POW";
        case Op::SIGN: return "SIGN";
        case Op::CLAMP: return "CLAMP";
        case Op::ROLLMEAN: return "ROLLMEAN";
        case Op::ROLLSUM: return "ROLLSUM";
        case Op::ROLLSTD: return "ROLLSTD";
        case Op::ROLLMAX: return "ROLLMAX";
        case Op::ROLLMIN: return "ROLLMIN";
        case Op::EMA: return "EMA";
        case Op::EMA_UPD: return "EMA_UPD";
        case Op::RSUM_UPD: return "RSUM_UPD";
        case Op::RSQ_UPD: return "RSQ_UPD";
        case Op::ALOAD: return "ALOAD";
        case Op::RSTD: return "RSTD";
        case Op::WMAX_UPD: return "WMAX_UPD";
        case Op::WMIN_UPD: return "WMIN_UPD";
        case Op::WMAX_GET: return "WMAX_GET";
        case Op::WMIN_GET: return "WMIN_GET";
        case Op::LABEL: return "LABEL";
        case Op::JMP: return "JMP";
        case Op::JZ: return "JZ";
        case Op::JNZ: return "JNZ";
        case Op::BUY: return "BUY";
        case Op::SELL: return "SELL";
        case Op::FLATTEN: return "FLATTEN";
        case Op::NOP: return "NOP";
    }
    return "?";
}

size_t TacProgram::instrCount() const {
    size_t n = 0;
    for (auto& f : funcs)
        for (auto& in : f.code) n += in.op != Op::LABEL && in.op != Op::NOP;
    return n;
}

bool opHasDst(Op op) {
    switch (op) {
        case Op::SPUSH: case Op::SSTORE: case Op::TICK: case Op::EMA_UPD: case Op::RSUM_UPD: case Op::RSQ_UPD:
        case Op::WMAX_UPD: case Op::WMIN_UPD: case Op::LABEL: case Op::JMP: case Op::JZ: case Op::JNZ:
        case Op::BUY: case Op::SELL: case Op::FLATTEN: case Op::NOP:
            return false;
        default: return true;
    }
}

bool opIsPure(Op op) { return opHasDst(op); }

bool opIsJump(Op op) { return op == Op::JMP || op == Op::JZ || op == Op::JNZ; }

bool opIsCommutative(Op op) {
    return op == Op::ADD || op == Op::MUL || op == Op::EQ || op == Op::NE || op == Op::AND || op == Op::OR ||
           op == Op::MIN || op == Op::MAX;
}

char opResultClass(Op op) {
    switch (op) {
        case Op::LT: case Op::LE: case Op::GT: case Op::GE: case Op::EQ: case Op::NE:
        case Op::AND: case Op::OR: case Op::NOT: case Op::BARS_GT:
            return 'B';
        case Op::CONST: case Op::COPY: return 0;
        default: return 'F';
    }
}

void instrUses(const Instr& in, std::vector<int>& out) {
    out.clear();
    for (const Opnd* o : {&in.a, &in.b, &in.c})
        if (o->isTemp()) out.push_back(o->t);
}

// Shortest decimal form that round-trips exactly (deterministic output).
std::string fmtNum(double v) {
    char buf[48];
    if (std::isfinite(v) && v == std::floor(v) && std::fabs(v) < 1e15) {
        std::snprintf(buf, sizeof buf, "%.1f", v);
        return buf;
    }
    for (int prec = 1; prec <= 17; ++prec) {
        std::snprintf(buf, sizeof buf, "%.*g", prec, v);
        if (std::strtod(buf, nullptr) == v) break;
    }
    return buf;
}

std::string opndText(const Opnd& o) {
    if (o.isTemp()) return "t" + std::to_string(o.t);
    if (o.isConst()) return fmtNum(o.c);
    return "_";
}

std::string instrText(const Instr& in) {
    std::string d = in.dst >= 0 ? "t" + std::to_string(in.dst) + " = " : "";
    std::string op = opName(in.op);
    auto a = opndText(in.a), b = opndText(in.b), c = opndText(in.c);
    switch (in.op) {
        case Op::CONST: return d + "CONST " + a;
        case Op::LOADFIELD: return d + "LOADFIELD " + in.sym;
        case Op::HIST: return d + "HIST $" + in.sym + ", " + std::to_string(in.k);
        case Op::SPUSH: return "SPUSH $" + in.sym + ", " + a;
        case Op::SLOAD: return d + "SLOAD @" + in.sym;
        case Op::SSTORE: return "SSTORE @" + in.sym + ", " + a;
        case Op::PARAM: return d + "PARAM %" + in.sym;
        case Op::BARS_GT: return d + "BARS_GT " + std::to_string(in.k);
        case Op::TICK: return "TICK";
        case Op::ROLLMEAN: case Op::ROLLSUM: case Op::ROLLSTD: case Op::ROLLMAX: case Op::ROLLMIN:
            return d + op + " $" + in.sym + ", " + std::to_string(in.k);
        case Op::EMA: return d + "EMA &" + in.sym;
        case Op::EMA_UPD:
            return "EMA_UPD &" + in.sym + ", $" + in.sym2 + ", " + std::to_string(in.n) + ", warm=" + std::to_string(in.k);
        case Op::RSUM_UPD: case Op::RSQ_UPD: case Op::WMAX_UPD: case Op::WMIN_UPD:
            return op + " &" + in.sym + ", $" + in.sym2 + ", " + std::to_string(in.n);
        case Op::ALOAD: return d + "ALOAD &" + in.sym;
        case Op::RSTD: return d + "RSTD &" + in.sym + ", &" + in.sym2 + ", " + std::to_string(in.n);
        case Op::WMAX_GET: case Op::WMIN_GET: return d + op + " &" + in.sym + ", $" + in.sym2;
        case Op::LABEL: return "L" + std::to_string(in.label) + ":";
        case Op::JMP: return "JMP L" + std::to_string(in.label);
        case Op::JZ: case Op::JNZ: return op + " " + a + ", L" + std::to_string(in.label);
        case Op::BUY: case Op::SELL: return op + " " + a;
        case Op::FLATTEN: return "FLATTEN";
        case Op::NOP: return "NOP";
        default: break;
    }
    std::string s = d + op;
    if (in.a.k != Opnd::None) s += " " + a;
    if (in.b.k != Opnd::None) s += ", " + b;
    if (in.c.k != Opnd::None) s += ", " + c;
    return s;
}

std::string instrLine(const TacProgram& p, const Instr& in) {
    std::string s = in.op == Op::LABEL ? instrText(in) : "  " + instrText(in);
    if (in.dst >= 0 && static_cast<size_t>(in.dst) < p.temps.size() && !p.temps[in.dst].dim.empty()) {
        if (s.size() < 34) s.resize(34, ' ');
        s += " ; " + p.temps[in.dst].dim;
    }
    return s;
}

std::string functionText(const TacProgram& p, const Function& f) {
    std::ostringstream os;
    os << "func " << f.name << ":\n";
    for (size_t i = 0; i < f.code.size(); ++i) {
        char idx[32];
        std::snprintf(idx, sizeof idx, "%3zu ", i);
        os << idx << instrLine(p, f.code[i]) << "\n";
    }
    return os.str();
}

std::string programText(const TacProgram& p) { return functionText(p, p.funcs[0]) + functionText(p, p.funcs[1]); }

Json functionJson(const TacProgram& p, const Function& f) {
    Json arr = Json::array();
    for (size_t i = 0; i < f.code.size(); ++i) {
        Json o = Json::object();
        o.set("func", f.name);
        o.set("i", static_cast<long>(i));
        o.set("text", instrLine(p, f.code[i]));
        o.set("line", f.code[i].line);
        arr.push(o);
    }
    return arr;
}

Json programJson(const TacProgram& p) {
    Json arr = Json::array();
    for (auto& f : p.funcs) {
        for (size_t i = 0; i < f.code.size(); ++i) {
            Json o = Json::object();
            o.set("func", f.name);
            o.set("i", static_cast<long>(i));
            o.set("text", instrLine(p, f.code[i]));
            o.set("line", f.code[i].line);
            arr.push(o);
        }
    }
    return arr;
}

// ---- interpreter -------------------------------------------------------

Interpreter::Interpreter(const TacProgram& p, const Layout& lay) : p_(p) {
    for (auto& [name, cap] : lay.cap) buf_[name].assign(static_cast<size_t>(cap), 0.0);
    for (auto& [name, cap] : lay.dqcap) {
        Deque d;
        d.idx.assign(static_cast<size_t>(cap), 0);
        dq_[name] = d;
    }
    for (auto& s : p.states) state_[s.name] = s.value;
    for (auto& s : p.params) param_[s.name] = s.value;
    t_.assign(p.temps.size() + 1, 0.0);
}

double Interpreter::rd(const Opnd& o) const {
    if (o.isTemp()) return t_[static_cast<size_t>(o.t)];
    return o.c;
}

static unsigned long slotOf(long bars, long k, size_t cap) {
    return static_cast<unsigned long>(bars - 1 - k) & static_cast<unsigned long>(cap - 1);
}

double Interpreter::hist(const std::string& s, long k) const {
    auto it = buf_.find(s);
    if (it == buf_.end()) return 0.0;
    return it->second[slotOf(bars_, k, it->second.size())];
}

void Interpreter::exec(const Function& f, const BarData& bar, char phase, long barIndex, std::vector<OrderRec>& orders) {
    std::map<int, size_t> labels;
    for (size_t i = 0; i < f.code.size(); ++i)
        if (f.code[i].op == Op::LABEL) labels[f.code[i].label] = i;
    size_t pc = 0;
    while (pc < f.code.size()) {
        const Instr& in = f.code[pc++];
        double& D = in.dst >= 0 ? t_[static_cast<size_t>(in.dst)] : t_[0];
        double A = rd(in.a), B = rd(in.b), C = rd(in.c);
        switch (in.op) {
            case Op::TICK: ++bars_; break;
            case Op::CONST: D = in.a.c; break;
            case Op::COPY: D = A; break;
            case Op::LOADFIELD:
                D = in.sym == "open" ? bar.open : in.sym == "high" ? bar.high : in.sym == "low" ? bar.low
                    : in.sym == "close" ? bar.close : bar.volume;
                break;
            case Op::HIST: D = hist(in.sym, in.k); break;
            case Op::SPUSH: {
                auto& b = buf_[in.sym];
                b[slotOf(bars_, 0, b.size())] = A;
                break;
            }
            case Op::SLOAD: D = state_[in.sym]; break;
            case Op::SSTORE: state_[in.sym] = A; break;
            case Op::PARAM: D = param_[in.sym]; break;
            case Op::BARS_GT: D = bars_ > in.k ? 1.0 : 0.0; break;
            case Op::ADD: D = A + B; break;
            case Op::SUB: D = A - B; break;
            case Op::MUL: D = A * B; break;
            case Op::DIV: D = A / B; break;
            case Op::NEG: D = -A; break;
            case Op::LT: D = A < B; break;
            case Op::LE: D = A <= B; break;
            case Op::GT: D = A > B; break;
            case Op::GE: D = A >= B; break;
            case Op::EQ: D = A == B; break;
            case Op::NE: D = A != B; break;
            case Op::AND: D = (A != 0) && (B != 0); break;
            case Op::OR: D = (A != 0) || (B != 0); break;
            case Op::NOT: D = A == 0; break;
            case Op::ABS: D = std::fabs(A); break;
            case Op::MIN: D = std::min(A, B); break;
            case Op::MAX: D = std::max(A, B); break;
            case Op::SQRT: D = std::sqrt(A); break;
            case Op::LOG: D = std::log(A); break;
            case Op::EXP: D = std::exp(A); break;
            case Op::POW: D = std::pow(A, B); break;
            case Op::SIGN: D = static_cast<double>((A > 0) - (A < 0)); break;
            case Op::CLAMP: D = std::min(std::max(A, B), C); break;
            case Op::ROLLMEAN: case Op::ROLLSUM: {
                double s = 0;
                for (long k = 0; k < in.k; ++k) s += hist(in.sym, k);
                D = in.op == Op::ROLLMEAN ? s / static_cast<double>(in.k) : s;
                break;
            }
            case Op::ROLLSTD: {
                double s = 0;
                for (long k = 0; k < in.k; ++k) s += hist(in.sym, k);
                double m = s / static_cast<double>(in.k);
                double acc = 0;
                for (long k = 0; k < in.k; ++k) {
                    double dv = hist(in.sym, k) - m;
                    acc += dv * dv;
                }
                D = std::sqrt(acc / static_cast<double>(in.k));
                break;
            }
            case Op::ROLLMAX: case Op::ROLLMIN: {
                double m = hist(in.sym, 0);
                for (long k = 1; k < in.k; ++k) m = in.op == Op::ROLLMAX ? std::max(m, hist(in.sym, k)) : std::min(m, hist(in.sym, k));
                D = m;
                break;
            }
            case Op::EMA: case Op::ALOAD: D = acc_[in.sym]; break;
            case Op::EMA_UPD: {
                double x0 = hist(in.sym2, 0);
                double alpha = 2.0 / (static_cast<double>(in.n) + 1.0);
                double& e = acc_[in.sym];
                if (bars_ <= in.k + 1) e = x0;
                else e = alpha * x0 + (1.0 - alpha) * e;
                break;
            }
            case Op::RSUM_UPD: acc_[in.sym] += hist(in.sym2, 0) - hist(in.sym2, in.n); break;
            case Op::RSQ_UPD: {
                double x0 = hist(in.sym2, 0), xn = hist(in.sym2, in.n);
                acc_[in.sym] += x0 * x0 - xn * xn;
                break;
            }
            case Op::RSTD: {
                double n = static_cast<double>(in.n);
                double m = acc_[in.sym] / n;
                double v = acc_[in.sym2] / n - m * m;
                if (v < 0) v = 0;
                D = std::sqrt(v);
                break;
            }
            case Op::WMAX_UPD: case Op::WMIN_UPD: {
                Deque& q = dq_[in.sym];
                auto& b = buf_[in.sym2];
                unsigned long bm = b.size() - 1, qm = q.idx.size() - 1;
                long cur = bars_ - 1;
                double x0 = b[static_cast<unsigned long>(cur) & bm];
                bool isMax = in.op == Op::WMAX_UPD;
                while (q.tail > q.head) {
                    double v = b[static_cast<unsigned long>(q.idx[static_cast<unsigned long>(q.tail - 1) & qm]) & bm];
                    if (isMax ? v <= x0 : v >= x0) --q.tail;
                    else break;
                }
                q.idx[static_cast<unsigned long>(q.tail) & qm] = cur;
                ++q.tail;
                while (q.idx[static_cast<unsigned long>(q.head) & qm] <= cur - in.n) ++q.head;
                break;
            }
            case Op::WMAX_GET: case Op::WMIN_GET: {
                Deque& q = dq_[in.sym];
                auto& b = buf_[in.sym2];
                D = b[static_cast<unsigned long>(q.idx[static_cast<unsigned long>(q.head) & (q.idx.size() - 1)]) & (b.size() - 1)];
                break;
            }
            case Op::LABEL: case Op::NOP: break;
            case Op::JMP: pc = labels[in.label]; break;
            case Op::JZ: if (A == 0) pc = labels[in.label]; break;
            case Op::JNZ: if (A != 0) pc = labels[in.label]; break;
            case Op::BUY: orders.push_back({barIndex, phase, "BUY", A}); break;
            case Op::SELL: orders.push_back({barIndex, phase, "SELL", A}); break;
            case Op::FLATTEN: orders.push_back({barIndex, phase, "FLATTEN", 0}); break;
        }
        (void)C;
    }
}

std::vector<OrderRec> Interpreter::run(const std::vector<BarData>& bars, std::vector<std::string>* trace) {
    std::vector<OrderRec> orders;
    static const std::set<std::string> fields = {"open", "high", "low", "close", "volume"};
    for (size_t i = 0; i < bars.size(); ++i) {
        exec(p_.funcs[0], bars[i], 'O', static_cast<long>(i), orders);
        exec(p_.funcs[1], bars[i], 'C', static_cast<long>(i), orders);
        if (trace) {
            for (auto& [name, b] : buf_) {
                if (fields.count(name)) continue;
                char line[128];
                std::snprintf(line, sizeof line, "%zu %s %.17g", i, name.c_str(), hist(name, 0));
                trace->push_back(line);
            }
        }
    }
    return orders;
}

std::string orderText(const OrderRec& o) {
    char buf[96];
    if (o.side == "FLATTEN")
        std::snprintf(buf, sizeof buf, "%ld %c FLATTEN", o.bar, o.phase);
    else
        std::snprintf(buf, sizeof buf, "%ld %c %s %.10g", o.bar, o.phase, o.side.c_str(), o.qty);
    return buf;
}

bool readCsv(const std::string& path, std::vector<BarData>& out, std::string& err) {
    std::ifstream f(path);
    if (!f) { err = "cannot open " + path; return false; }
    std::string line;
    size_t lineNo = 0;
    while (std::getline(f, line)) {
        ++lineNo;
        if (!line.empty() && line.back() == '\r') line.pop_back();
        if (line.empty()) continue;
        std::vector<std::string> cols;
        std::stringstream ss(line);
        std::string c;
        while (std::getline(ss, c, ',')) cols.push_back(c);
        if (cols.size() < 6) { err = path + ":" + std::to_string(lineNo) + ": expected 6 columns"; return false; }
        char* end = nullptr;
        double o = std::strtod(cols[1].c_str(), &end);
        if (end == cols[1].c_str()) {
            if (lineNo == 1) continue;  // header
            err = path + ":" + std::to_string(lineNo) + ": bad number";
            return false;
        }
        BarData b;
        b.date = cols[0];
        b.open = o;
        b.high = std::strtod(cols[2].c_str(), nullptr);
        b.low = std::strtod(cols[3].c_str(), nullptr);
        b.close = std::strtod(cols[4].c_str(), nullptr);
        b.volume = std::strtod(cols[5].c_str(), nullptr);
        out.push_back(b);
    }
    return true;
}
