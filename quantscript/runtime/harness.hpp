// QuantScript runtime harness: bars, CSV reader, order collection, window
// helpers used by generated strategies, a backtester and a CLI driver.
// Hand-written; copied next to every generated strategy header.
#pragma once
#include <algorithm>
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>

namespace qs {

struct Bar {
    std::string date;
    double open = 0, high = 0, low = 0, close = 0, volume = 0;
};

enum class Side { Buy, Sell, Flatten };

struct Order {
    Side side;
    double qty;
};

struct Orders {
    std::vector<Order> list;
    void buy(double q) { list.push_back({Side::Buy, q}); }
    void sell(double q) { list.push_back({Side::Sell, q}); }
    void flatten() { list.push_back({Side::Flatten, 0.0}); }
    void clear() { list.clear(); }
};

// ---- ring buffers -------------------------------------------------------
// Slot of the value k bars ago; head = bars_seen - 1. Unsigned wrap-around makes
// reads before the first bar land on zero-initialized, never-written slots.
inline unsigned long slot(long bars_seen, long k, unsigned long mask) {
    return static_cast<unsigned long>(bars_seen - 1 - k) & mask;
}

// ---- naive O(N) windows (emitted at -O0/-O1) -----------------------------
inline double roll_sum(const double* b, unsigned long mask, long bars, long n) {
    double s = 0;
    for (long k = 0; k < n; ++k) s += b[slot(bars, k, mask)];
    return s;
}
inline double roll_mean(const double* b, unsigned long mask, long bars, long n) {
    return roll_sum(b, mask, bars, n) / static_cast<double>(n);
}
inline double roll_std(const double* b, unsigned long mask, long bars, long n) {
    double m = roll_sum(b, mask, bars, n) / static_cast<double>(n);
    double acc = 0;
    for (long k = 0; k < n; ++k) {
        double d = b[slot(bars, k, mask)] - m;
        acc += d * d;
    }
    return std::sqrt(acc / static_cast<double>(n));
}
inline double roll_max(const double* b, unsigned long mask, long bars, long n) {
    double m = b[slot(bars, 0, mask)];
    for (long k = 1; k < n; ++k) m = std::max(m, b[slot(bars, k, mask)]);
    return m;
}
inline double roll_min(const double* b, unsigned long mask, long bars, long n) {
    double m = b[slot(bars, 0, mask)];
    for (long k = 1; k < n; ++k) m = std::min(m, b[slot(bars, k, mask)]);
    return m;
}

// ---- O(1) incremental windows (emitted at -O2) ----------------------------
inline void rsum_update(double& acc, const double* b, unsigned long mask, long bars, long n) {
    acc += b[slot(bars, 0, mask)] - b[slot(bars, n, mask)];
}
inline void rsq_update(double& acc, const double* b, unsigned long mask, long bars, long n) {
    double x0 = b[slot(bars, 0, mask)], xn = b[slot(bars, n, mask)];
    acc += x0 * x0 - xn * xn;
}
inline double rstd(double sum, double sumsq, long n) {
    double nn = static_cast<double>(n);
    double m = sum / nn;
    double v = sumsq / nn - m * m;
    if (v < 0) v = 0;
    return std::sqrt(v);
}
inline void ema_update(double& e, double x0, double alpha, bool seed) {
    if (seed) e = x0;
    else e = alpha * x0 + (1.0 - alpha) * e;
}
// Monotonic deque of bar indices: amortized O(1) rolling max/min.
inline void wext_update(long* idx, unsigned long qmask, long& head, long& tail, const double* b, unsigned long bmask,
                        long bars, long n, bool isMax) {
    long cur = bars - 1;
    double x0 = b[static_cast<unsigned long>(cur) & bmask];
    while (tail > head) {
        double v = b[static_cast<unsigned long>(idx[static_cast<unsigned long>(tail - 1) & qmask]) & bmask];
        if (isMax ? v <= x0 : v >= x0) --tail;
        else break;
    }
    idx[static_cast<unsigned long>(tail) & qmask] = cur;
    ++tail;
    while (idx[static_cast<unsigned long>(head) & qmask] <= cur - n) ++head;
}
inline double wext_get(const long* idx, unsigned long qmask, long head, const double* b, unsigned long bmask) {
    return b[static_cast<unsigned long>(idx[static_cast<unsigned long>(head) & qmask]) & bmask];
}

// ---- dimension-checked wrapper types (--emit-strong-types) ----------------
namespace units {
template <int P, int V>
struct Q {
    double v;
};
using Scalar = Q<0, 0>;
using Price = Q<1, 0>;
using Volume = Q<0, 1>;
using Notional = Q<1, 1>;
template <int P, int V> Q<P, V> operator+(Q<P, V> a, Q<P, V> b) { return {a.v + b.v}; }
template <int P, int V> Q<P, V> operator-(Q<P, V> a, Q<P, V> b) { return {a.v - b.v}; }
template <int P, int V> Q<P, V> operator-(Q<P, V> a) { return {-a.v}; }
template <int P1, int V1, int P2, int V2> Q<P1 + P2, V1 + V2> operator*(Q<P1, V1> a, Q<P2, V2> b) { return {a.v * b.v}; }
template <int P1, int V1, int P2, int V2> Q<P1 - P2, V1 - V2> operator/(Q<P1, V1> a, Q<P2, V2> b) { return {a.v / b.v}; }
template <int P, int V> bool operator<(Q<P, V> a, Q<P, V> b) { return a.v < b.v; }
template <int P, int V> bool operator<=(Q<P, V> a, Q<P, V> b) { return a.v <= b.v; }
template <int P, int V> bool operator>(Q<P, V> a, Q<P, V> b) { return a.v > b.v; }
template <int P, int V> bool operator>=(Q<P, V> a, Q<P, V> b) { return a.v >= b.v; }
template <int P, int V> bool operator==(Q<P, V> a, Q<P, V> b) { return a.v == b.v; }
template <int P, int V> bool operator!=(Q<P, V> a, Q<P, V> b) { return a.v != b.v; }
template <int P, int V> Q<P, V> abs(Q<P, V> a) { return {std::fabs(a.v)}; }
template <int P, int V> Q<P, V> min(Q<P, V> a, Q<P, V> b) { return {std::min(a.v, b.v)}; }
template <int P, int V> Q<P, V> max(Q<P, V> a, Q<P, V> b) { return {std::max(a.v, b.v)}; }
template <int P, int V> Q<P, V> clamp(Q<P, V> a, Q<P, V> lo, Q<P, V> hi) { return {std::min(std::max(a.v, lo.v), hi.v)}; }
template <int P, int V> Scalar sign(Q<P, V> a) { return {static_cast<double>((a.v > 0) - (a.v < 0))}; }
template <int P, int V> Q<P / 2, V / 2> sqrt(Q<P, V> a) {
    static_assert(P % 2 == 0 && V % 2 == 0, "sqrt needs even dimension exponents");
    return {std::sqrt(a.v)};
}
template <int K, int P, int V> Q<P * K, V * K> pow(Q<P, V> a) { return {std::pow(a.v, K)}; }
inline Scalar log(Scalar a) { return {std::log(a.v)}; }
inline Scalar exp(Scalar a) { return {std::exp(a.v)}; }
inline void order_qty(Volume) {}
}  // namespace units

// ---- data ------------------------------------------------------------------
inline bool read_csv(const std::string& path, std::vector<Bar>& out, std::string& err) {
    std::ifstream f(path);
    if (!f) { err = "cannot open " + path; return false; }
    std::string line;
    size_t lineNo = 0;
    while (std::getline(f, line)) {
        ++lineNo;
        if (!line.empty() && line.back() == '\r') line.pop_back();
        if (line.empty()) continue;
        std::vector<std::string> c;
        std::stringstream ss(line);
        std::string cell;
        while (std::getline(ss, cell, ',')) c.push_back(cell);
        if (c.size() < 6) { err = path + ":" + std::to_string(lineNo) + ": expected 6 columns"; return false; }
        char* end = nullptr;
        double o = std::strtod(c[1].c_str(), &end);
        if (end == c[1].c_str()) {
            if (lineNo == 1) continue;  // header
            err = path + ":" + std::to_string(lineNo) + ": bad number";
            return false;
        }
        Bar b;
        b.date = c[0];
        b.open = o;
        b.high = std::strtod(c[2].c_str(), nullptr);
        b.low = std::strtod(c[3].c_str(), nullptr);
        b.close = std::strtod(c[4].c_str(), nullptr);
        b.volume = std::strtod(c[5].c_str(), nullptr);
        out.push_back(b);
    }
    return true;
}

// ---- backtester -------------------------------------------------------------
struct Trade {
    long bar;
    std::string date;
    const char* side;
    double qty, price, fee;
};

struct Summary {
    long trades = 0;
    double finalEquity = 0, maxDrawdown = 0, sharpe = 0;
};

// Fill model (§4.1): orders from on_open fill at open[0] of the same bar;
// orders from on_close fill at open[0] of the next bar.
template <class Strategy>
class Backtester {
public:
    explicit Backtester(Strategy s, double cash = 1000000.0, double fee = 0.0) : s_(s), cash_(cash), start_(cash), fee_(fee) {}

    void run(const std::vector<Bar>& bars, std::vector<std::string>* orderLog = nullptr) {
        Orders pending, now;
        double prevEq = start_, peak = start_;
        std::vector<double> rets;
        for (size_t i = 0; i < bars.size(); ++i) {
            const Bar& b = bars[i];
            fillAll(pending, b, static_cast<long>(i));
            pending.clear();
            now.clear();
            s_.on_open(b.open, now);
            log(now, static_cast<long>(i), 'O', orderLog);
            fillAll(now, b, static_cast<long>(i));
            now.clear();
            s_.on_close(b.high, b.low, b.close, b.volume, now);
            log(now, static_cast<long>(i), 'C', orderLog);
            pending = now;
            double eq = cash_ + pos_ * b.close;
            equity_.push_back(eq);
            positions_.push_back(pos_);
            dates_.push_back(b.date);
            peak = std::max(peak, eq);
            if (peak > 0) sum_.maxDrawdown = std::max(sum_.maxDrawdown, (peak - eq) / peak);
            if (prevEq != 0) rets.push_back(eq / prevEq - 1.0);
            prevEq = eq;
        }
        sum_.trades = static_cast<long>(trades_.size());
        sum_.finalEquity = equity_.empty() ? start_ : equity_.back();
        if (rets.size() > 1) {
            double m = 0, v = 0;
            for (double r : rets) m += r;
            m /= static_cast<double>(rets.size());
            for (double r : rets) v += (r - m) * (r - m);
            v /= static_cast<double>(rets.size() - 1);
            sum_.sharpe = v > 0 ? m / std::sqrt(v) * std::sqrt(252.0) : 0.0;
        }
    }

    const Summary& summary() const { return sum_; }
    const std::vector<Trade>& trades() const { return trades_; }

    bool writeCsv(const std::string& dir) const {
        std::string base = dir.empty() ? "" : dir + "/";
        std::FILE* t = std::fopen((base + "trades.csv").c_str(), "w");
        std::FILE* e = std::fopen((base + "equity.csv").c_str(), "w");
        if (!t || !e) {
            if (t) std::fclose(t);
            if (e) std::fclose(e);
            return false;
        }
        std::fprintf(t, "bar,date,side,qty,price,fee\n");
        for (auto& x : trades_) std::fprintf(t, "%ld,%s,%s,%.10g,%.10g,%.10g\n", x.bar, x.date.c_str(), x.side, x.qty, x.price, x.fee);
        std::fprintf(e, "bar,date,equity,position\n");
        for (size_t i = 0; i < equity_.size(); ++i)
            std::fprintf(e, "%zu,%s,%.10g,%.10g\n", i, dates_[i].c_str(), equity_[i], positions_[i]);
        std::fclose(t);
        std::fclose(e);
        return true;
    }

private:
    static void log(const Orders& o, long bar, char phase, std::vector<std::string>* out) {
        if (!out) return;
        for (auto& x : o.list) {
            char buf[96];
            if (x.side == Side::Flatten) std::snprintf(buf, sizeof buf, "%ld %c FLATTEN", bar, phase);
            else std::snprintf(buf, sizeof buf, "%ld %c %s %.10g", bar, phase, x.side == Side::Buy ? "BUY" : "SELL", x.qty);
            out->push_back(buf);
        }
    }
    void fill(double signedQty, const Bar& b, long bar) {
        if (signedQty == 0) return;
        double q = std::fabs(signedQty);
        double fee = fee_ * q;
        cash_ -= signedQty * b.open + fee;
        pos_ += signedQty;
        trades_.push_back({bar, b.date, signedQty > 0 ? "BUY" : "SELL", q, b.open, fee});
    }
    void fillAll(const Orders& o, const Bar& b, long bar) {
        for (auto& x : o.list) {
            if (x.side == Side::Buy) fill(x.qty, b, bar);
            else if (x.side == Side::Sell) fill(-x.qty, b, bar);
            else fill(-pos_, b, bar);
        }
    }

    Strategy s_;
    double cash_, start_, fee_;
    double pos_ = 0;
    Summary sum_;
    std::vector<Trade> trades_;
    std::vector<double> equity_, positions_;
    std::vector<std::string> dates_;
};

// CLI used by the generated main.cpp:
//   ./backtest data.csv [--fee F] [--cash C] [--orders] [--out DIR] [--param name=value]...
template <class Strategy>
int run_main(int argc, char** argv) {
    std::string data, outDir;
    double fee = 0, cash = 1000000.0;
    bool orders = false;
    typename Strategy::Params params;
    for (int i = 1; i < argc; ++i) {
        std::string a = argv[i];
        auto next = [&]() -> std::string { return i + 1 < argc ? argv[++i] : ""; };
        if (a == "--fee") fee = std::atof(next().c_str());
        else if (a == "--cash") cash = std::atof(next().c_str());
        else if (a == "--orders") orders = true;
        else if (a == "--out") outDir = next();
        else if (a == "--param") {
            std::string kv = next();
            size_t eq = kv.find('=');
            if (eq == std::string::npos || !Strategy::set_param(params, kv.substr(0, eq), std::atof(kv.substr(eq + 1).c_str()))) {
                std::fprintf(stderr, "unknown param: %s\n", kv.c_str());
                return 2;
            }
        } else if (a == "-h" || a == "--help") {
            std::printf("usage: %s data.csv [--fee F] [--cash C] [--orders] [--out DIR] [--param name=value]\n", argv[0]);
            return 0;
        } else data = a;
    }
    if (data.empty()) {
        std::fprintf(stderr, "usage: %s data.csv [--fee F] [--cash C] [--orders] [--out DIR]\n", argv[0]);
        return 2;
    }
    std::vector<Bar> bars;
    std::string err;
    if (!read_csv(data, bars, err)) {
        std::fprintf(stderr, "error: %s\n", err.c_str());
        return 2;
    }
    Backtester<Strategy> bt(Strategy(params), cash, fee);
    std::vector<std::string> log;
    bt.run(bars, orders ? &log : nullptr);
    if (orders) {
        for (auto& l : log) std::printf("%s\n", l.c_str());
        return 0;
    }
    if (!bt.writeCsv(outDir)) {
        std::fprintf(stderr, "error: cannot write trades.csv / equity.csv\n");
        return 2;
    }
    const Summary& s = bt.summary();
    std::printf("strategy      %s\n", Strategy::NAME);
    std::printf("bars          %zu (warm-up %ld)\n", bars.size(), Strategy::WARMUP);
    std::printf("trades        %ld\n", s.trades);
    std::printf("final equity  %.2f\n", s.finalEquity);
    std::printf("max drawdown  %.2f%%\n", s.maxDrawdown * 100.0);
    std::printf("sharpe        %.3f\n", s.sharpe);
    return 0;
}

}  // namespace qs
