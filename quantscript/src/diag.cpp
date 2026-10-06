#include "diag.hpp"

#include <algorithm>
#include <sstream>
#include <tuple>

void DiagEngine::setSource(const std::string& filename, const std::string& text) {
    filename_ = filename;
    lines_.clear();
    std::string cur;
    for (char c : text) {
        if (c == '\n') { lines_.push_back(cur); cur.clear(); }
        else if (c != '\r') cur += c;
    }
    lines_.push_back(cur);
}

Diagnostic& DiagEngine::error(const std::string& code, int line, int col, const std::string& msg) {
    Diagnostic d;
    d.code = code;
    d.sev = Severity::Error;
    d.line = line;
    d.col = col;
    d.message = msg;
    diags_.push_back(d);
    return diags_.back();
}

Diagnostic& DiagEngine::warning(const std::string& code, int line, int col, const std::string& msg) {
    Diagnostic& d = error(code, line, col, msg);
    d.sev = Severity::Warning;
    return d;
}

size_t DiagEngine::errorCount() const {
    size_t n = 0;
    for (auto& d : diags_) n += d.sev == Severity::Error;
    return n;
}

size_t DiagEngine::warningCount() const { return diags_.size() - errorCount(); }

std::vector<Diagnostic> DiagEngine::finalList() const {
    std::vector<Diagnostic> v(diags_.begin(), diags_.end());
    std::stable_sort(v.begin(), v.end(), [](const Diagnostic& a, const Diagnostic& b) {
        return std::tie(a.line, a.col) < std::tie(b.line, b.col);
    });
    std::vector<Diagnostic> out;
    for (auto& d : v) {
        bool dup = false;
        for (auto& o : out)
            if (o.code == d.code && o.line == d.line && o.col == d.col && o.message == d.message) dup = true;
        if (!dup) out.push_back(d);
        if (out.size() >= kMaxReported) break;
    }
    return out;
}

std::string DiagEngine::format(const Diagnostic& d, bool color) const {
    const char* red = color ? "\033[1;31m" : "";
    const char* yellow = color ? "\033[1;33m" : "";
    const char* blue = color ? "\033[1;34m" : "";
    const char* bold = color ? "\033[1m" : "";
    const char* reset = color ? "\033[0m" : "";
    bool err = d.sev == Severity::Error;
    std::ostringstream os;
    os << bold << filename_ << ":" << d.line << ":" << d.col << ":" << reset << " "
       << (err ? red : yellow) << (err ? "error" : "warning") << "[" << d.code << "]" << reset << ": "
       << bold << d.message << reset << "\n";
    if (d.line >= 1 && static_cast<size_t>(d.line) <= lines_.size()) {
        const std::string& src = lines_[d.line - 1];
        std::string num = std::to_string(d.line);
        std::string pad(num.size() < 6 ? 6 - num.size() : 0, ' ');
        os << blue << pad << num << " |" << reset << " " << src << "\n";
        // Marker line: '~' over ranges, '^' at the primary column.
        size_t width = src.size() + 1;
        for (auto& r : d.ranges)
            if (r.line == d.line) width = std::max(width, static_cast<size_t>(r.col - 1 + r.len));
        width = std::max(width, static_cast<size_t>(d.col - 1 + d.caretLen));
        std::string mark(width, ' ');
        for (size_t i = 0; i < src.size() && i < mark.size(); ++i)
            if (src[i] == '\t') mark[i] = '\t';
        for (auto& r : d.ranges) {
            if (r.line != d.line) continue;
            for (int i = 0; i < r.len; ++i) {
                size_t pos = static_cast<size_t>(r.col - 1 + i);
                if (pos < mark.size()) mark[pos] = '~';
            }
        }
        for (int i = 0; i < d.caretLen; ++i) {
            size_t pos = static_cast<size_t>(d.col - 1 + i);
            if (pos < mark.size()) mark[pos] = '^';
        }
        while (!mark.empty() && mark.back() == ' ') mark.pop_back();
        os << blue << std::string(7, ' ') << "|" << reset << " " << (err ? red : yellow) << mark << reset << "\n";
    }
    for (auto& n : d.notes) os << blue << std::string(7, ' ') << "=" << reset << " note: " << n << "\n";
    if (!d.hint.empty()) os << blue << std::string(7, ' ') << "=" << reset << " help: " << d.hint << "\n";
    return os.str();
}

void DiagEngine::print(std::ostream& os, bool color) const {
    auto list = finalList();
    for (auto& d : list) os << format(d, color);
    size_t e = 0, w = 0;
    for (auto& d : list) (d.sev == Severity::Error ? e : w)++;
    if (e || w) {
        os << (e ? std::to_string(e) + " error" + (e == 1 ? "" : "s") : std::string("0 errors"));
        if (w) os << ", " << w << " warning" << (w == 1 ? "" : "s");
        if (diags_.size() > list.size() && list.size() >= kMaxReported) os << " (output capped at " << kMaxReported << ")";
        os << " generated.\n";
    }
}

Json DiagEngine::toJson() const {
    Json arr = Json::array();
    for (auto& d : finalList()) {
        Json o = Json::object();
        o.set("code", d.code);
        o.set("severity", d.sev == Severity::Error ? "error" : "warning");
        o.set("line", d.line);
        o.set("col", d.col);
        o.set("message", d.message);
        o.set("hint", d.hint);
        Json notes = Json::array();
        for (auto& n : d.notes) notes.push(n);
        o.set("notes", notes);
        arr.push(o);
    }
    return arr;
}
