// Diagnostics engine: collects errors/warnings with file:line:col, code, hint,
// and renders them rustc-style with a source excerpt and caret.
#pragma once
#include <deque>
#include <ostream>
#include <string>
#include <vector>

#include "json.hpp"

enum class Severity { Error, Warning };

// A source range underlined with '~' (single line).
struct Span {
    int line = 0;
    int col = 0;
    int len = 0;
};

struct Diagnostic {
    std::string code;
    Severity sev = Severity::Error;
    int line = 0;
    int col = 0;
    int caretLen = 1;
    std::string message;
    std::string hint;
    std::vector<std::string> notes;
    std::vector<Span> ranges;

    Diagnostic& withHint(const std::string& h) { hint = h; return *this; }
    Diagnostic& note(const std::string& n) { notes.push_back(n); return *this; }
    Diagnostic& range(int l, int c, int len) { if (len > 0) ranges.push_back({l, c, len}); return *this; }
    Diagnostic& caret(int len) { caretLen = len < 1 ? 1 : len; return *this; }
};

class DiagEngine {
public:
    static constexpr size_t kMaxReported = 50;

    void setSource(const std::string& filename, const std::string& text);

    // References stay valid (deque storage) so callers can chain .withHint().
    Diagnostic& error(const std::string& code, int line, int col, const std::string& msg);
    Diagnostic& warning(const std::string& code, int line, int col, const std::string& msg);

    size_t errorCount() const;
    size_t warningCount() const;
    size_t size() const { return diags_.size(); }

    // Sorted by (line, col), de-duplicated, capped at kMaxReported.
    std::vector<Diagnostic> finalList() const;

    std::string format(const Diagnostic& d, bool color) const;
    void print(std::ostream& os, bool color) const;
    Json toJson() const;

    const std::string& filename() const { return filename_; }
    const std::vector<std::string>& lines() const { return lines_; }

private:
    std::string filename_;
    std::vector<std::string> lines_;
    std::deque<Diagnostic> diags_;
};
