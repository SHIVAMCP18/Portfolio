#include "cfg.hpp"

#include <algorithm>
#include <functional>
#include <map>
#include <sstream>

CFG buildCFG(const Function& f) {
    CFG g;
    const auto& code = f.code;
    size_t n = code.size();
    g.blockOf.assign(n, -1);
    if (n == 0) return g;
    std::vector<bool> leader(n, false);
    leader[0] = true;
    for (size_t i = 0; i < n; ++i) {
        if (code[i].op == Op::LABEL) leader[i] = true;
        if (opIsJump(code[i].op) && i + 1 < n) leader[i + 1] = true;
    }
    std::map<int, int> labelBlock;
    for (size_t i = 0; i < n; ++i) {
        if (leader[i]) {
            Block b;
            b.id = static_cast<int>(g.blocks.size());
            b.first = static_cast<int>(i);
            g.blocks.push_back(b);
        }
        g.blocks.back().last = static_cast<int>(i);
        g.blockOf[i] = g.blocks.back().id;
        if (code[i].op == Op::LABEL) labelBlock[code[i].label] = g.blocks.back().id;
    }
    auto edge = [&](int a, int b) {
        auto& s = g.blocks[a].succ;
        if (std::find(s.begin(), s.end(), b) == s.end()) {
            s.push_back(b);
            g.blocks[b].pred.push_back(a);
        }
    };
    for (auto& b : g.blocks) {
        const Instr& last = code[static_cast<size_t>(b.last)];
        bool fall = last.op != Op::JMP;
        if (opIsJump(last.op) && labelBlock.count(last.label)) edge(b.id, labelBlock[last.label]);
        if (fall && b.id + 1 < static_cast<int>(g.blocks.size())) edge(b.id, b.id + 1);
    }
    // Reverse post-order from the entry block.
    std::vector<int> post;
    std::vector<bool> seen(g.blocks.size(), false);
    std::function<void(int)> dfs = [&](int b) {
        seen[static_cast<size_t>(b)] = true;
        for (int s : g.blocks[static_cast<size_t>(b)].succ)
            if (!seen[static_cast<size_t>(s)]) dfs(s);
        post.push_back(b);
    };
    dfs(0);
    g.rpo.assign(post.rbegin(), post.rend());
    return g;
}

bool CFG::reachable(int b) const { return std::find(rpo.begin(), rpo.end(), b) != rpo.end(); }

bool cfgIsAcyclic(const CFG& g) {
    std::vector<int> pos(g.blocks.size(), -1);
    for (size_t i = 0; i < g.rpo.size(); ++i) pos[static_cast<size_t>(g.rpo[i])] = static_cast<int>(i);
    for (int b : g.rpo)
        for (int s : g.blocks[static_cast<size_t>(b)].succ)
            if (pos[static_cast<size_t>(s)] <= pos[static_cast<size_t>(b)]) return false;
    return true;
}

std::string cfgText(const Function& f, const CFG& g, const TacProgram& p) {
    std::ostringstream os;
    os << "func " << f.name << ": " << g.blocks.size() << " basic block(s)" << (cfgIsAcyclic(g) ? ", acyclic" : ", CYCLIC") << "\n";
    for (auto& b : g.blocks) {
        os << "  B" << b.id << " [" << b.first << ".." << b.last << "]";
        os << "  pred:";
        for (int x : b.pred) os << " B" << x;
        os << "  succ:";
        for (int x : b.succ) os << " B" << x;
        if (!g.reachable(b.id)) os << "  (unreachable)";
        os << "\n";
        for (int i = b.first; i <= b.last; ++i) os << "      " << instrLine(p, f.code[static_cast<size_t>(i)]) << "\n";
    }
    return os.str();
}

Json cfgJson(const Function& f, const CFG& g, const TacProgram& p, int idBase) {
    Json arr = Json::array();
    for (auto& b : g.blocks) {
        Json o = Json::object();
        o.set("id", b.id + idBase);
        o.set("func", f.name);
        o.set("label", "B" + std::to_string(b.id));
        Json ins = Json::array(), txt = Json::array();
        for (int i = b.first; i <= b.last; ++i) {
            ins.push(i);
            txt.push(instrText(f.code[static_cast<size_t>(i)]));
        }
        o.set("instrs", ins);
        o.set("text", txt);
        Json succ = Json::array();
        for (int s : b.succ) succ.push(s + idBase);
        o.set("succ", succ);
        o.set("reachable", g.reachable(b.id));
        arr.push(o);
    }
    (void)p;
    return arr;
}
