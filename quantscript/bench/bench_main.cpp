// Benchmark driver: generates synthetic bars in memory (a geometric random walk
// from a fixed-seed xorshift generator), then times only the strategy calls.
// Compiled once against the -O0 and once against the -O2 QuantScript output.
#include <chrono>
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <vector>

#include "Bench.hpp"

int main(int argc, char** argv) {
    long n = argc > 1 ? std::atol(argv[1]) : 5000000;
    std::vector<double> open(static_cast<size_t>(n)), close(static_cast<size_t>(n));
    unsigned long long x = 88172645463325252ULL;
    double p = 100.0;
    for (long i = 0; i < n; ++i) {
        x ^= x << 13; x ^= x >> 7; x ^= x << 17;
        double u = static_cast<double>(x >> 11) * (1.0 / 9007199254740992.0) - 0.5;
        open[static_cast<size_t>(i)] = p;
        p *= std::exp(0.02 * u);
        close[static_cast<size_t>(i)] = p;
    }
    Bench s;
    qs::Orders out;
    long orders = 0;
    auto t0 = std::chrono::steady_clock::now();
    for (long i = 0; i < n; ++i) {
        size_t k = static_cast<size_t>(i);
        s.on_open(open[k], out);
        s.on_close(std::max(open[k], close[k]), std::min(open[k], close[k]), close[k], 1000.0, out);
        orders += static_cast<long>(out.list.size());
        out.clear();
    }
    double secs = std::chrono::duration<double>(std::chrono::steady_clock::now() - t0).count();
    std::printf("%ld %.6f %ld\n", n, secs, orders);
    return 0;
}
