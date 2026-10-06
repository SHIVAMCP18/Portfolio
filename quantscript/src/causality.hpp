// Look-ahead (causality) checker, series phases and look-back / warm-up analysis (§8).
#pragma once
#include <string>
#include <vector>

#include "ast.hpp"
#include "diag.hpp"
#include "json.hpp"
#include "sema.hpp"

struct SeriesInfo {
    Symbol* sym = nullptr;
    bool isField = false;
    char phase = 'C';
    long depth = 0;       // earlier bars needed before the series is valid
    long bufsize = 0;     // ring-buffer slots required (0 = never read)
    std::string bufReason;
    std::string phaseReason;
};

struct ReadCheck {
    int line = 0, col = 0;
    std::string read;      // e.g. "close[0]" or "mean(close, 20)"
    std::string series;    // series name
    long d = 0;
    char phase = 'C';
    char at = 'C';         // moment the read is evaluated ('O' or 'C')
    std::string context;   // "on bar_open", "on bar_close", "series foo"
    bool ok = true;
    std::string code;      // E502 when not ok
};

struct CausalityResult {
    long warmup = 0;
    std::string warmupReason;
    std::vector<SeriesInfo> series;  // fields first, then derived series in topo order
    std::vector<ReadCheck> checks;
    const SeriesInfo* find(const std::string& name) const;
};

// One data read inside an expression.
struct Read {
    Symbol* sym = nullptr;
    long d = 0;       // stamp delay (bars ago at which the newest touched value lies)
    long reach = 0;   // oldest bar touched (for depth / warm-up)
    long need = 1;    // ring-buffer slots needed
    Node* at = nullptr;
    std::string text;
    std::string needText;  // human explanation of `need`
};
void collectReads(Node* e, std::vector<Read>& out);

class Causality {
public:
    Causality(DiagEngine& d, const SemaResult& sr) : d_(d), sr_(sr) {}
    bool run();
    const CausalityResult& result() const { return res_; }
    Json toJson() const;
    std::string toText() const;

private:
    DiagEngine& d_;
    const SemaResult& sr_;
    CausalityResult res_;
};
