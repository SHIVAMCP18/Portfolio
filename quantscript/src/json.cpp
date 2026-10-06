#include "json.hpp"

#include <cmath>
#include <cstdio>

Json& Json::push(Json v) {
    if (t_ != T::Arr) { *this = array(); }
    arr_.push_back(std::move(v));
    return *this;
}

Json& Json::set(const std::string& key, Json v) {
    if (t_ != T::Obj) { *this = object(); }
    for (size_t i = 0; i < keys_.size(); ++i) {
        if (keys_[i] == key) { vals_[i] = std::move(v); return *this; }
    }
    keys_.push_back(key);
    vals_.push_back(std::move(v));
    return *this;
}

std::string jsonEscape(const std::string& s) {
    std::string o;
    o.reserve(s.size() + 2);
    o += '"';
    for (unsigned char c : s) {
        switch (c) {
            case '"': o += "\\\""; break;
            case '\\': o += "\\\\"; break;
            case '\n': o += "\\n"; break;
            case '\r': o += "\\r"; break;
            case '\t': o += "\\t"; break;
            default:
                if (c < 0x20) {
                    char buf[8];
                    std::snprintf(buf, sizeof buf, "\\u%04x", c);
                    o += buf;
                } else {
                    o += static_cast<char>(c);
                }
        }
    }
    o += '"';
    return o;
}

static void newline(std::string& out, int indent, int depth) {
    if (indent < 0) return;
    out += '\n';
    out.append(static_cast<size_t>(indent * depth), ' ');
}

void Json::write(std::string& out, int indent, int depth) const {
    switch (t_) {
        case T::Null: out += "null"; break;
        case T::Bool: out += b_ ? "true" : "false"; break;
        case T::Num: {
            if (!std::isfinite(n_)) { out += "null"; break; }
            char buf[40];
            if (n_ == std::floor(n_) && std::fabs(n_) < 1e15)
                std::snprintf(buf, sizeof buf, "%.0f", n_);
            else
                std::snprintf(buf, sizeof buf, "%.17g", n_);
            out += buf;
            break;
        }
        case T::Str: out += jsonEscape(s_); break;
        case T::Arr: {
            out += '[';
            for (size_t i = 0; i < arr_.size(); ++i) {
                if (i) out += ',';
                newline(out, indent, depth + 1);
                arr_[i].write(out, indent, depth + 1);
            }
            if (!arr_.empty()) newline(out, indent, depth);
            out += ']';
            break;
        }
        case T::Obj: {
            out += '{';
            for (size_t i = 0; i < keys_.size(); ++i) {
                if (i) out += ',';
                newline(out, indent, depth + 1);
                out += jsonEscape(keys_[i]);
                out += indent < 0 ? ":" : ": ";
                vals_[i].write(out, indent, depth + 1);
            }
            if (!keys_.empty()) newline(out, indent, depth);
            out += '}';
            break;
        }
    }
}

std::string Json::dump(int indent) const {
    std::string out;
    write(out, indent, 0);
    return out;
}
