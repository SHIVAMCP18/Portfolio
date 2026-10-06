#include "rdfa.hpp"

#include <algorithm>
#include <map>
#include <set>

// ---- regex parser (recursive descent) -------------------------------------

namespace {

struct RParser {
    const std::string& s;
    size_t i = 0;
    std::string err;

    explicit RParser(const std::string& src) : s(src) {}
    bool eof() const { return i >= s.size(); }
    char peek() const { return eof() ? '\0' : s[i]; }

    std::unique_ptr<RNode> mk(RNode::K k) {
        auto n = std::make_unique<RNode>();
        n->k = k;
        return n;
    }

    std::unique_ptr<RNode> alt() {
        auto l = cat();
        while (!eof() && peek() == '|') {
            ++i;
            auto n = mk(RNode::Alt);
            n->l = std::move(l);
            n->r = cat();
            l = std::move(n);
        }
        return l;
    }
    std::unique_ptr<RNode> cat() {
        std::unique_ptr<RNode> l;
        while (!eof() && peek() != '|' && peek() != ')') {
            auto r = post();
            if (!l) l = std::move(r);
            else {
                auto n = mk(RNode::Cat);
                n->l = std::move(l);
                n->r = std::move(r);
                l = std::move(n);
            }
        }
        return l ? std::move(l) : mk(RNode::Empty);
    }
    std::unique_ptr<RNode> post() {
        auto a = atom();
        while (!eof() && (peek() == '*' || peek() == '+' || peek() == '?')) {
            char c = s[i++];
            auto n = mk(c == '*' ? RNode::Star : c == '+' ? RNode::Plus : RNode::Opt);
            n->l = std::move(a);
            a = std::move(n);
        }
        return a;
    }
    char escaped(char c) {
        switch (c) {
            case 'n': return '\n';
            case 't': return '\t';
            default: return c;
        }
    }
    std::unique_ptr<RNode> atom() {
        char c = s[i++];
        auto n = mk(RNode::Chars);
        if (c == '(') {
            auto inner = alt();
            if (peek() != ')') err = "missing ')'";
            else ++i;
            return inner;
        }
        if (c == '\\' && !eof()) {
            n->set.set(static_cast<unsigned char>(escaped(s[i++])) & 127);
            return n;
        }
        if (c == '.') {
            for (int ch = 32; ch < 127; ++ch) n->set.set(static_cast<size_t>(ch));
            return n;
        }
        if (c == '[') {
            bool neg = peek() == '^';
            if (neg) ++i;
            CharSet cs;
            bool first = true;
            while (!eof() && (peek() != ']' || first)) {
                first = false;
                char a = s[i++];
                if (a == '\\' && !eof()) a = escaped(s[i++]);
                if (peek() == '-' && i + 1 < s.size() && s[i + 1] != ']') {
                    ++i;
                    char b = s[i++];
                    if (b == '\\' && !eof()) b = escaped(s[i++]);
                    for (int ch = static_cast<unsigned char>(a); ch <= static_cast<unsigned char>(b); ++ch) cs.set(static_cast<size_t>(ch & 127));
                } else {
                    cs.set(static_cast<unsigned char>(a) & 127);
                }
            }
            if (peek() != ']') err = "missing ']'";
            else ++i;
            if (neg) {
                CharSet all;
                for (int ch = 32; ch < 127; ++ch) all.set(static_cast<size_t>(ch));
                cs = all & ~cs;
            }
            n->set = cs;
            return n;
        }
        n->set.set(static_cast<unsigned char>(c) & 127);
        return n;
    }
};

// ---- Thompson NFA ------------------------------------------------------------
struct Nfa {
    struct St {
        std::vector<int> eps;
        CharSet on;
        int to = -1;
    };
    std::vector<St> st;
    int start = 0, accept = 0;
    int add() {
        st.push_back(St());
        return static_cast<int>(st.size()) - 1;
    }
};

std::pair<int, int> thompson(const RNode* n, Nfa& m) {
    switch (n->k) {
        case RNode::Empty: {
            int a = m.add(), b = m.add();
            m.st[static_cast<size_t>(a)].eps.push_back(b);
            return {a, b};
        }
        case RNode::Chars: {
            int a = m.add(), b = m.add();
            m.st[static_cast<size_t>(a)].on = n->set;
            m.st[static_cast<size_t>(a)].to = b;
            return {a, b};
        }
        case RNode::Cat: {
            auto x = thompson(n->l.get(), m);
            auto y = thompson(n->r.get(), m);
            m.st[static_cast<size_t>(x.second)].eps.push_back(y.first);
            return {x.first, y.second};
        }
        case RNode::Alt: {
            int a = m.add();
            auto x = thompson(n->l.get(), m);
            auto y = thompson(n->r.get(), m);
            int b = m.add();
            m.st[static_cast<size_t>(a)].eps = {x.first, y.first};
            m.st[static_cast<size_t>(x.second)].eps.push_back(b);
            m.st[static_cast<size_t>(y.second)].eps.push_back(b);
            return {a, b};
        }
        case RNode::Star: case RNode::Plus: case RNode::Opt: {
            int a = m.add();
            auto x = thompson(n->l.get(), m);
            int b = m.add();
            m.st[static_cast<size_t>(a)].eps.push_back(x.first);
            if (n->k != RNode::Plus) m.st[static_cast<size_t>(a)].eps.push_back(b);
            m.st[static_cast<size_t>(x.second)].eps.push_back(b);
            if (n->k != RNode::Opt) m.st[static_cast<size_t>(x.second)].eps.push_back(x.first);
            return {a, b};
        }
    }
    return {0, 0};
}

std::set<int> closure(const Nfa& m, std::set<int> s) {
    std::vector<int> work(s.begin(), s.end());
    while (!work.empty()) {
        int x = work.back();
        work.pop_back();
        for (int e : m.st[static_cast<size_t>(x)].eps)
            if (s.insert(e).second) work.push_back(e);
    }
    return s;
}

Dfa subset(const Nfa& m) {
    Dfa d;
    std::map<std::set<int>, int> id;
    std::vector<std::set<int>> sets;
    auto get = [&](const std::set<int>& s) {
        auto it = id.find(s);
        if (it != id.end()) return it->second;
        int k = static_cast<int>(sets.size());
        id[s] = k;
        sets.push_back(s);
        d.accept.push_back(s.count(m.accept) > 0);
        d.next.push_back(std::vector<int>(128, -1));
        return k;
    };
    d.start = get(closure(m, {m.start}));
    for (size_t k = 0; k < sets.size(); ++k) {
        for (int c = 0; c < 128; ++c) {
            std::set<int> mv;
            for (int x : sets[k]) {
                const auto& s = m.st[static_cast<size_t>(x)];
                if (s.to >= 0 && s.on.test(static_cast<size_t>(c))) mv.insert(s.to);
            }
            if (mv.empty()) continue;
            int t = get(closure(m, mv));
            d.next[k][static_cast<size_t>(c)] = t;
        }
    }
    return d;
}

// Hopcroft's partition-refinement minimization on the completed DFA.
Dfa hopcroft(const Dfa& d) {
    int n = d.size();
    int dead = n;  // explicit sink to make the DFA total
    int N = n + 1;
    auto delta = [&](int s, int c) {
        if (s == dead) return dead;
        int t = d.next[static_cast<size_t>(s)][static_cast<size_t>(c)];
        return t < 0 ? dead : t;
    };
    // Alphabet compression: characters with identical columns are one symbol.
    std::map<std::vector<int>, int> colId;
    std::vector<int> rep;  // representative char per symbol
    for (int c = 0; c < 128; ++c) {
        std::vector<int> col(static_cast<size_t>(N));
        for (int s = 0; s < N; ++s) col[static_cast<size_t>(s)] = delta(s, c);
        if (!colId.count(col)) {
            colId[col] = static_cast<int>(rep.size());
            rep.push_back(c);
        }
    }
    // Inverse transitions per symbol.
    std::vector<std::vector<std::vector<int>>> inv(rep.size(), std::vector<std::vector<int>>(static_cast<size_t>(N)));
    for (size_t a = 0; a < rep.size(); ++a)
        for (int s = 0; s < N; ++s) inv[a][static_cast<size_t>(delta(s, rep[a]))].push_back(s);

    std::vector<std::set<int>> P;
    std::set<int> F, NF;
    for (int s = 0; s < N; ++s) (s < n && d.accept[static_cast<size_t>(s)] ? F : NF).insert(s);
    if (!F.empty()) P.push_back(F);
    if (!NF.empty()) P.push_back(NF);
    std::vector<std::set<int>> W;
    if (!F.empty() && !NF.empty()) W.push_back(F.size() <= NF.size() ? F : NF);
    else if (!F.empty()) W.push_back(F);
    while (!W.empty()) {
        std::set<int> A = W.back();
        W.pop_back();
        for (size_t a = 0; a < rep.size(); ++a) {
            std::set<int> X;
            for (int t : A)
                for (int s : inv[a][static_cast<size_t>(t)]) X.insert(s);
            if (X.empty()) continue;
            std::vector<std::set<int>> newP;
            for (auto& Y : P) {
                std::set<int> i1, i2;
                for (int y : Y) (X.count(y) ? i1 : i2).insert(y);
                if (i1.empty() || i2.empty()) {
                    newP.push_back(Y);
                    continue;
                }
                newP.push_back(i1);
                newP.push_back(i2);
                auto it = std::find(W.begin(), W.end(), Y);
                if (it != W.end()) {
                    *it = i1;
                    W.push_back(i2);
                } else {
                    W.push_back(i1.size() <= i2.size() ? i1 : i2);
                }
            }
            P.swap(newP);
        }
    }
    // Build the minimal DFA, dropping the dead block; number blocks in BFS order.
    std::vector<int> blockOf(static_cast<size_t>(N), -1);
    for (size_t b = 0; b < P.size(); ++b)
        for (int s : P[b]) blockOf[static_cast<size_t>(s)] = static_cast<int>(b);
    int deadBlock = blockOf[static_cast<size_t>(dead)];
    std::map<int, int> order;
    std::vector<int> queue{blockOf[static_cast<size_t>(d.start)]};
    order[queue[0]] = 0;
    Dfa m;
    for (size_t qi = 0; qi < queue.size(); ++qi) {
        int b = queue[qi];
        int s = *P[static_cast<size_t>(b)].begin();
        for (int c = 0; c < 128; ++c) {
            int tb = blockOf[static_cast<size_t>(delta(s, c))];
            if (tb == deadBlock || order.count(tb)) continue;
            order[tb] = static_cast<int>(queue.size());
            queue.push_back(tb);
        }
    }
    m.start = 0;
    m.accept.assign(queue.size(), false);
    m.next.assign(queue.size(), std::vector<int>(128, -1));
    for (size_t qi = 0; qi < queue.size(); ++qi) {
        int s = *P[static_cast<size_t>(queue[qi])].begin();
        m.accept[qi] = s < n && d.accept[static_cast<size_t>(s)];
        for (int c = 0; c < 128; ++c) {
            int tb = blockOf[static_cast<size_t>(delta(s, c))];
            if (tb != deadBlock) m.next[qi][static_cast<size_t>(c)] = order[tb];
        }
    }
    return m;
}

std::string rangeText(const std::vector<int>& chars) {
    auto show = [](int c) {
        if (c == '\\' || c == '-' || c == ']') return std::string("\\") + static_cast<char>(c);
        if (c < 32 || c >= 127) return std::string("\\x") + std::to_string(c);
        return std::string(1, static_cast<char>(c));
    };
    std::string out;
    for (size_t i = 0; i < chars.size();) {
        size_t j = i;
        while (j + 1 < chars.size() && chars[j + 1] == chars[j] + 1) ++j;
        if (j >= i + 2) out += show(chars[i]) + "-" + show(chars[j]);
        else
            for (size_t k = i; k <= j; ++k) out += show(chars[k]);
        i = j + 1;
    }
    return out;
}

Json oneDfaJson(const Dfa& d) {
    Json o = Json::object();
    Json states = Json::array(), acc = Json::array(), tr = Json::array();
    for (int s = 0; s < d.size(); ++s) {
        Json st = Json::object();
        st.set("id", s);
        st.set("accepting", static_cast<bool>(d.accept[static_cast<size_t>(s)]));
        states.push(st);
        if (d.accept[static_cast<size_t>(s)]) acc.push(s);
        std::map<int, std::vector<int>> byTarget;
        for (int c = 0; c < 128; ++c) {
            int t = d.next[static_cast<size_t>(s)][static_cast<size_t>(c)];
            if (t >= 0) byTarget[t].push_back(c);
        }
        for (auto& [t, cs] : byTarget) {
            Json e = Json::array();
            e.push(s);
            e.push(rangeText(cs));
            e.push(t);
            tr.push(e);
        }
    }
    o.set("states", states);
    o.set("start", d.start);
    o.set("accepting", acc);
    o.set("transitions", tr);
    return o;
}

int reachableCount(const Dfa& d) {
    std::vector<bool> seen(static_cast<size_t>(d.size()), false);
    std::vector<int> st{d.start};
    seen[static_cast<size_t>(d.start)] = true;
    int c = 0;
    while (!st.empty()) {
        int s = st.back();
        st.pop_back();
        ++c;
        for (int t : d.next[static_cast<size_t>(s)])
            if (t >= 0 && !seen[static_cast<size_t>(t)]) {
                seen[static_cast<size_t>(t)] = true;
                st.push_back(t);
            }
    }
    return c;
}

}  // namespace

bool Dfa::matches(const std::string& s) const {
    int st = start;
    for (unsigned char c : s) {
        if (c >= 128) return false;
        st = next[static_cast<size_t>(st)][c];
        if (st < 0) return false;
    }
    return accept[static_cast<size_t>(st)];
}

std::unique_ptr<RNode> parseRegex(const std::string& re, std::string& err) {
    RParser p(re);
    auto n = p.alt();
    if (!p.eof()) p.err = "unexpected ')' at " + std::to_string(p.i);
    err = p.err;
    return n;
}

bool buildTokenClass(TokenClassDfa& tc, std::string& err) {
    tc.ast = parseRegex(tc.regex, err);
    if (!err.empty()) return false;
    Nfa m;
    auto se = thompson(tc.ast.get(), m);
    m.start = se.first;
    m.accept = se.second;
    tc.nfaStates = static_cast<int>(m.st.size());
    tc.dfa = subset(m);
    tc.dfaStates = reachableCount(tc.dfa);
    tc.min = hopcroft(tc.dfa);
    tc.minStates = tc.min.size();
    return true;
}

std::vector<TokenClassDfa> quantscriptTokenClasses() {
    const std::string num = "[0-9]+|[0-9]+\\.[0-9]+([eE][+-]?[0-9]+)?|[0-9]+[eE][+-]?[0-9]+";
    struct Def { const char* name; std::string re; const char* flex; };
    std::vector<Def> defs = {
        {"identifier", "[A-Za-z_][A-Za-z0-9_]*", "IDENT"},
        {"integer", "[0-9]+", "INT_LIT"},
        {"float", "[0-9]+\\.[0-9]+([eE][+-]?[0-9]+)?|[0-9]+[eE][+-]?[0-9]+", "FLOAT_LIT"},
        {"unit_literal", "(" + num + ")(px|vol|ntl)", "UNIT_LIT"},
        {"percent", "(" + num + ")%", "PCT_LIT"},
        {"operator", "\\+|-|\\*|/|==|!=|<=|>=|<|>|&&|\\|\\||!|->|=", "OP"},
        {"punctuation", "[(){}\\[\\],;:]", "PUNCT"},
    };
    std::vector<TokenClassDfa> out;
    for (auto& d : defs) {
        TokenClassDfa tc;
        tc.name = d.name;
        tc.regex = d.re;
        tc.flexType = d.flex;
        std::string err;
        buildTokenClass(tc, err);
        out.push_back(std::move(tc));
    }
    return out;
}

std::string sampleRegex(const RNode* n, std::mt19937& rng) {
    switch (n->k) {
        case RNode::Empty: return "";
        case RNode::Chars: {
            std::vector<int> cs;
            for (int c = 0; c < 128; ++c)
                if (n->set.test(static_cast<size_t>(c))) cs.push_back(c);
            if (cs.empty()) return "";
            return std::string(1, static_cast<char>(cs[rng() % cs.size()]));
        }
        case RNode::Cat: return sampleRegex(n->l.get(), rng) + sampleRegex(n->r.get(), rng);
        case RNode::Alt: return rng() % 2 ? sampleRegex(n->l.get(), rng) : sampleRegex(n->r.get(), rng);
        case RNode::Star: case RNode::Plus: case RNode::Opt: {
            int lo = n->k == RNode::Plus ? 1 : 0, hi = n->k == RNode::Opt ? 1 : 4;
            int k = lo + static_cast<int>(rng() % static_cast<unsigned>(hi - lo + 1));
            std::string s;
            for (int i = 0; i < k; ++i) s += sampleRegex(n->l.get(), rng);
            return s;
        }
    }
    return "";
}

std::string noiseString(const std::string& alphabet, std::mt19937& rng) {
    int len = 1 + static_cast<int>(rng() % 7);
    std::string s;
    for (int i = 0; i < len; ++i) s += alphabet[rng() % alphabet.size()];
    return s;
}

Json dfaJson(const TokenClassDfa& tc) {
    Json o = oneDfaJson(tc.min);
    o.set("name", tc.name);
    o.set("regex", tc.regex);
    Json st = Json::object();
    st.set("nfa_states", tc.nfaStates);
    st.set("dfa_states", tc.dfaStates);
    st.set("min_dfa_states", tc.minStates);
    o.set("stats", st);
    return o;
}
