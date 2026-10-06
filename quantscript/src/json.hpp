// Tiny hand-written JSON value + deterministic serializer (no dependencies).
#pragma once
#include <string>
#include <vector>

class Json {
public:
    enum class T { Null, Bool, Num, Str, Arr, Obj };

    Json() = default;
    Json(std::nullptr_t) {}
    Json(bool b) : t_(T::Bool), b_(b) {}
    Json(int n) : t_(T::Num), n_(n) {}
    Json(long n) : t_(T::Num), n_(static_cast<double>(n)) {}
    Json(long long n) : t_(T::Num), n_(static_cast<double>(n)) {}
    Json(unsigned long n) : t_(T::Num), n_(static_cast<double>(n)) {}
    Json(double n) : t_(T::Num), n_(n) {}
    Json(const char* s) : t_(T::Str), s_(s) {}
    Json(const std::string& s) : t_(T::Str), s_(s) {}

    static Json array() { Json j; j.t_ = T::Arr; return j; }
    static Json object() { Json j; j.t_ = T::Obj; return j; }

    T type() const { return t_; }
    // Array append; returns *this for chaining.
    Json& push(Json v);
    // Object insert (keeps insertion order; replaces existing key).
    Json& set(const std::string& key, Json v);
    size_t size() const { return t_ == T::Arr ? arr_.size() : keys_.size(); }
    const std::vector<Json>& items() const { return arr_; }

    std::string dump(int indent = -1) const;

private:
    void write(std::string& out, int indent, int depth) const;

    T t_ = T::Null;
    bool b_ = false;
    double n_ = 0;
    std::string s_;
    std::vector<Json> arr_;
    std::vector<std::string> keys_;
    std::vector<Json> vals_;
};

std::string jsonEscape(const std::string& s);
