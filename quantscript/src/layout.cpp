#include "layout.hpp"

#include <algorithm>
#include <cstdio>
#include <set>
#include <sstream>

long nextPow2(long n) {
    long c = 1;
    while (c < n) c <<= 1;
    return c;
}

const Member* Layout::find(const std::string& name) const {
    for (auto& m : members)
        if (m.name == name) return &m;
    return nullptr;
}

Layout computeLayout(const TacProgram& p, const CausalityResult& c) {
    Layout L;
    L.warmup = p.warmup;
    std::vector<Member> ms;
    auto add = [&](Member m) { ms.push_back(m); };

    Member bars;
    bars.name = "bars_seen";
    bars.ctype = "long";
    bars.kind = "bars";
    bars.note = "bars processed so far (ring-buffer head = bars_seen - 1)";
    add(bars);

    // Series ring buffers, fields first then derived series in topo order.
    for (auto& s : c.series) {
        if (s.bufsize <= 0) continue;
        long cap = nextPow2(s.bufsize);
        L.cap[s.sym->name] = cap;
        Member m;
        m.name = s.sym->name + "_buf";
        m.ctype = "double";
        m.count = cap;
        m.kind = "buffer";
        m.ref = s.sym->name;
        m.note = cap == 1 ? "cap=1 (current value only)"
                          : "cap=" + std::to_string(cap) + " (needs " + std::to_string(s.bufsize) + ": " + s.bufReason + ")";
        add(m);
    }

    // Accumulators created by window lowering / ema, deduplicated.
    std::set<std::string> seen;
    for (auto& f : p.funcs) {
        for (auto& in : f.code) {
            if (in.op == Op::RSUM_UPD || in.op == Op::RSQ_UPD || in.op == Op::EMA_UPD) {
                if (!seen.insert(in.sym).second) continue;
                Member m;
                m.name = in.sym;
                m.ctype = "double";
                m.kind = "acc";
                m.ref = in.sym;
                const std::string& s = in.sym2;
                if (in.op == Op::RSUM_UPD) m.note = "accumulator: running sum for mean/sum/std(" + s + "," + std::to_string(in.n) + ")";
                else if (in.op == Op::RSQ_UPD) m.note = "accumulator: running sum of squares for std(" + s + "," + std::to_string(in.n) + ")";
                else m.note = "accumulator: ema(" + s + "," + std::to_string(in.n) + ") value";
                add(m);
            } else if (in.op == Op::WMAX_UPD || in.op == Op::WMIN_UPD) {
                if (!seen.insert(in.sym).second) continue;
                long cap = nextPow2(in.n + 1);
                L.dqcap[in.sym] = cap;
                const std::string& s = in.sym2;
                std::string what = std::string(in.op == Op::WMAX_UPD ? "highest" : "lowest") + "(" + s + "," + std::to_string(in.n) + ")";
                Member idx;
                idx.name = in.sym + "_idx";
                idx.ctype = "long";
                idx.count = cap;
                idx.kind = "deque";
                idx.ref = in.sym;
                idx.note = "monotonic deque of bar indices for " + what;
                add(idx);
                Member h = idx;
                h.name = in.sym + "_head";
                h.count = 0;
                h.note = "deque front";
                add(h);
                Member t = h;
                t.name = in.sym + "_tail";
                t.note = "deque back";
                add(t);
            }
        }
    }

    // State variables: numbers first, bools last (to show alignment padding).
    std::set<std::string> names;
    for (auto& m : ms) names.insert(m.name);
    auto addState = [&](const ParamInfo& st) {
        Member m;
        m.name = names.count(st.name) ? st.name + "_st" : st.name;
        m.ctype = st.cls == 'B' ? "bool" : "double";
        m.kind = "state";
        m.ref = st.name;
        m.note = "state " + st.type;
        L.stateMember[st.name] = m.name;
        names.insert(m.name);
        add(m);
    };
    for (auto& st : p.states)
        if (st.cls != 'B') addState(st);
    for (auto& st : p.states)
        if (st.cls == 'B') addState(st);

    long off = 0;
    long maxAlign = 1;
    for (auto& m : ms) {
        long elem = m.ctype == "bool" ? 1 : 8;
        m.align = elem;
        m.size = elem * (m.count ? m.count : 1);
        off = (off + m.align - 1) / m.align * m.align;
        m.offset = off;
        off += m.size;
        maxAlign = std::max(maxAlign, m.align);
    }
    L.total = (off + maxAlign - 1) / maxAlign * maxAlign;
    L.members = ms;
    return L;
}

std::string Layout::toText() const {
    std::ostringstream os;
    char buf[512];
    std::snprintf(buf, sizeof buf, "%-22s %-12s %7s %6s   %s\n", "Member", "Type", "Offset", "Size", "Note");
    os << buf;
    for (auto& m : members) {
        std::snprintf(buf, sizeof buf, "%-22s %-12s %7ld %6ld   %s\n", m.name.c_str(), m.typeText().c_str(), m.offset, m.size, m.note.c_str());
        os << buf;
    }
    long used = 0;
    for (auto& m : members) used += m.size;
    os << "TOTAL " << total << " bytes";
    if (total != used) os << " (" << (total - used) << " bytes padding)";
    os << ", WARMUP = " << warmup << "\n";
    return os.str();
}

Json Layout::toJson() const {
    Json o = Json::object();
    Json arr = Json::array();
    for (auto& m : members) {
        Json j = Json::object();
        j.set("name", m.name);
        j.set("type", m.typeText());
        j.set("offset", m.offset);
        j.set("size", m.size);
        j.set("align", m.align);
        j.set("kind", m.kind);
        j.set("note", m.note);
        arr.push(j);
    }
    o.set("members", arr);
    o.set("total", total);
    o.set("warmup", warmup);
    return o;
}
