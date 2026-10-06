/* QuantScript phase viewer — vanilla JS + SVG, no build step, no network. */
(function () {
  "use strict";

  // ------------------------------------------------------------------ state
  const S = { dump: null, dump2: null, name: "", name2: "", phase: "source", pending: null };
  const PHASES = [
    ["source", "Source & diagnostics", (d) => d.source !== undefined],
    ["tokens", "Tokens", (d) => !!d.lexer],
    ["dfa", "Lexer DFA", (d) => !!(d.lexer && (d.lexer.dfas || d.lexer.dfa))],
    ["parse", "Parse tree", (d) => !!d.parser],
    ["symtab", "Symbol table", (d) => !!d.symtab],
    ["ast", "Typed AST", (d) => !!d.ast],
    ["causality", "Causality timeline", (d) => !!d.causality],
    ["layout", "State layout", (d) => !!d.layout],
    ["tac", "TAC & optimizer", (d) => !!d.tac],
    ["cfg", "Control-flow graph", (d) => !!d.cfg],
    ["ig", "Interference graph", (d) => !!d.regalloc],
    ["cpp", "Generated C++", (d) => typeof d.cpp === "string"],
    ["compare", "Compare -O0 / -O2", () => true],
  ];
  const PALETTE = ["#4263eb", "#f76707", "#2f9e44", "#ae3ec9", "#e8590c", "#1098ad", "#d6336c", "#74b816",
                   "#7048e8", "#f59f00", "#0ca678", "#c2255c", "#3bc9db", "#845ef7", "#fab005", "#20c997"];

  // ---------------------------------------------------------------- helpers
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s === undefined || s === null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v === undefined || v === null || v === false) continue;
        if (k === "class") e.className = v;
        else if (k === "html") e.innerHTML = v;
        else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
        else e.setAttribute(k, v === true ? "" : v);
      }
    }
    for (const k of kids.flat()) {
      if (k === undefined || k === null || k === false) continue;
      e.appendChild(typeof k === "string" || typeof k === "number" ? document.createTextNode(String(k)) : k);
    }
    return e;
  }
  const SVGNS = "http://www.w3.org/2000/svg";
  function s(tag, attrs, ...kids) {
    const e = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs || {})) if (v !== undefined && v !== null) e.setAttribute(k, v);
    for (const k of kids.flat()) {
      if (k === undefined || k === null) continue;
      e.appendChild(typeof k === "string" || typeof k === "number" ? document.createTextNode(String(k)) : k);
    }
    return e;
  }
  function arrowDefs(svg, id, color) {
    const defs = s("defs", {});
    const m = s("marker", { id, viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" });
    m.appendChild(s("path", { d: "M0,0 L10,5 L0,10 z", fill: color }));
    defs.appendChild(m);
    svg.appendChild(defs);
  }
  function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  function dimClass(t) {
    if (!t) return "other";
    if (["price", "volume", "notional", "scalar", "bool", "int"].includes(t)) return t;
    return "other";
  }
  function dimBadge(type, vec) {
    if (!type) return null;
    const title = vec ? `(${vec[0]},${vec[1]})` : "";
    return h("span", { class: "dim " + dimClass(type), title }, type + (vec && dimClass(type) === "other" ? " " + title : ""));
  }
  function empty(msg) { return h("div", { class: "empty" }, msg); }
  function section(title, sub) {
    const c = $("content");
    c.innerHTML = "";
    c.appendChild(h("h2", null, title));
    if (sub) c.appendChild(h("div", { class: "sub", html: sub }));
    return c;
  }

  // ---------------------------------------------------------------- tooltip
  const tip = h("div", { class: "tip" });
  tip.style.display = "none";
  document.body.appendChild(tip);
  function showTip(html, ev) {
    tip.innerHTML = html;
    tip.style.display = "block";
    const x = Math.min(ev.clientX + 14, window.innerWidth - tip.offsetWidth - 8);
    const y = Math.min(ev.clientY + 14, window.innerHeight - tip.offsetHeight - 8);
    tip.style.left = x + "px";
    tip.style.top = y + "px";
  }
  function hideTip() { tip.style.display = "none"; }

  // ------------------------------------------------------------ source view
  function sourceView(src, opts) {
    opts = opts || {};
    const lines = String(src || "").split("\n");
    if (lines.length > 1 && lines[lines.length - 1] === "") lines.pop();
    const byLine = {};
    for (const d of opts.diags || []) (byLine[d.line] = byLine[d.line] || []).push(d);
    const wrap = h("div", { class: "src" });
    if (opts.maxHeight) wrap.style.maxHeight = opts.maxHeight;
    const rows = [];
    lines.forEach((t, i) => {
      const n = i + 1;
      const ds = byLine[n] || [];
      const cls = ds.some((d) => d.severity === "error") ? "err" : ds.length ? "warn" : "";
      const tx = h("span", { class: "tx" }, t || " ");
      const row = h("div", { class: "ln " + cls, "data-line": n }, h("span", { class: "no" }, n), tx);
      if (ds.length) {
        row.addEventListener("mousemove", (ev) => showTip(ds.map((d) =>
          `<div><span class="code">${esc(d.code)}</span> ${esc(d.message)}</div>` +
          (d.hint ? `<div class="muted">help: ${esc(d.hint)}</div>` : "")).join("<hr>"), ev));
        row.addEventListener("mouseleave", hideTip);
      }
      rows.push({ row, tx, text: t });
      wrap.appendChild(row);
    });
    let marked = [];
    const api = {
      el: wrap,
      clear() {
        for (const i of marked) rows[i].tx.textContent = rows[i].text || " ";
        marked = [];
      },
      highlight(span) {
        api.clear();
        if (!span || span.length < 4 || !span[0]) return;
        const [l1, c1, l2, c2] = span;
        for (let l = l1; l <= Math.max(l1, l2); l++) {
          const r = rows[l - 1];
          if (!r) continue;
          const t = r.text;
          const a = l === l1 ? c1 - 1 : 0;
          const b = l === l2 ? Math.max(a, c2 - 1) : t.length;
          r.tx.innerHTML = esc(t.slice(0, a)) + "<mark>" + esc(t.slice(a, b) || " ") + "</mark>" + esc(t.slice(b));
          marked.push(l - 1);
        }
        const r = rows[l1 - 1];
        if (r) r.row.scrollIntoView({ block: "nearest" });
      },
      flash(line) {
        const r = rows[line - 1];
        if (!r) return;
        r.row.scrollIntoView({ block: "center" });
        r.row.classList.remove("flash");
        void r.row.offsetWidth;
        r.row.classList.add("flash");
      },
    };
    return api;
  }

  // ============================================================== panels
  const panels = {};

  // 1. Source + diagnostics -------------------------------------------------
  panels.source = function () {
    const d = S.dump;
    const diags = d.diagnostics || [];
    const ne = diags.filter((x) => x.severity === "error").length;
    const c = section("Source & diagnostics", `${esc(d.file || S.name)} — ${ne} error(s), ${diags.length - ne} warning(s). Hover a squiggly line for details; click a diagnostic to jump to it.`);
    const sv = sourceView(d.source, { diags });
    const list = h("div", { class: "grow" });
    if (!diags.length) list.appendChild(empty("No diagnostics — the program compiled cleanly."));
    for (const x of diags) {
      list.appendChild(h("div", { class: "diag " + x.severity, onclick: () => sv.flash(x.line) },
        h("div", { class: "where" }, `${d.file || ""}:${x.line}:${x.col}  ${x.severity}[${x.code}]`),
        h("div", null, x.message),
        ...(x.notes || []).map((n) => h("div", { class: "hint" }, "note: " + n)),
        x.hint ? h("div", { class: "hint" }, "help: " + x.hint) : null));
    }
    const left = h("div", { class: "grow" }, sv.el);
    list.style.maxWidth = "42%";
    c.appendChild(h("div", { class: "row" }, left, list));
    S.pendingFlash && (sv.flash(S.pendingFlash), (S.pendingFlash = 0));
  };

  // 2. Tokens -----------------------------------------------------------------
  panels.tokens = function () {
    const toks = (S.dump.lexer && S.dump.lexer.tokens) || [];
    const c = section("Tokens", `${toks.length} tokens from the Flex scanner. Click a token to highlight it in the source.`);
    const sv = sourceView(S.dump.source, { maxHeight: "70vh" });
    const tbody = h("tbody");
    let sel = null;
    toks.forEach((t) => {
      const tr = h("tr", null, h("td", null, h("span", { class: "kind" }, t.type)), h("td", { class: "mono" }, t.lexeme + (t.unit ? "  (" + t.unit + ")" : "")),
        h("td", { class: "mono muted" }, `${t.line}:${t.col}`));
      tr.addEventListener("click", () => {
        if (sel) sel.classList.remove("sel");
        sel = tr;
        tr.classList.add("sel");
        sv.highlight([t.line, t.col, t.line, t.col + t.lexeme.length]);
      });
      tbody.appendChild(tr);
    });
    const table = h("div", { class: "scroll card", style: "padding:0" }, h("table", null, h("thead", null, h("tr", null, h("th", null, "type"), h("th", null, "lexeme"), h("th", null, "line:col"))), tbody));
    const left = h("div", { style: "width:420px;flex:none" }, table);
    c.appendChild(h("div", { class: "row" }, left, h("div", { class: "grow" }, sv.el)));
  };

  // 3. Lexer DFA ---------------------------------------------------------------
  function parseLabel(label) {
    const chars = [];
    const raw = [];
    for (let i = 0; i < label.length; i++) {
      if (label[i] === "\\" && i + 1 < label.length) { raw.push({ c: label[++i], lit: true }); continue; }
      raw.push({ c: label[i], lit: false });
    }
    for (let i = 0; i < raw.length; i++) {
      if (i + 2 < raw.length && raw[i + 1].c === "-" && !raw[i + 1].lit) {
        for (let k = raw[i].c.charCodeAt(0); k <= raw[i + 2].c.charCodeAt(0); k++) chars.push(String.fromCharCode(k));
        i += 2;
      } else chars.push(raw[i].c);
    }
    return new Set(chars);
  }
  panels.dfa = function () {
    const lex = S.dump.lexer;
    const dfas = lex.dfas || [lex.dfa];
    const c = section("Lexer DFA", "Each token class: regex → Thompson NFA → subset-construction DFA → Hopcroft-minimized DFA (the drawing). Type a string to step through it.");
    const sel = h("select", null, ...dfas.map((d, i) => h("option", { value: i }, d.name || "class " + i)));
    const input = h("input", { type: "text", value: "100.5px", spellcheck: "false" });
    const runBtn = h("button", { class: "primary" }, "Step through");
    const stats = h("div", { class: "card" });
    const holder = h("div", { class: "svgwrap" });
    const step = h("div", { class: "card" });
    c.append(h("div", { class: "toolbar" }, "token class ", sel, input, runBtn), stats, holder, step);
    let timer = null;
    let nodesById = {};
    function draw() {
      const d = dfas[+sel.value];
      const st = d.stats || {};
      stats.innerHTML = `<span class="stat">regex <b class="mono">${esc(d.regex || "")}</b></span><br>` +
        `<span class="stat">NFA states <b>${st.nfa_states}</b></span><span class="stat">DFA states <b>${st.dfa_states}</b></span>` +
        `<span class="stat">minimal DFA states <b>${st.min_dfa_states}</b></span>`;
      const states = d.states.map((x) => x.id);
      const acc = new Set(d.accepting || []);
      const out = {};
      for (const [f, lab, t] of d.transitions) (out[f] = out[f] || []).push([lab, t]);
      const depth = { [d.start]: 0 };
      const q = [d.start];
      while (q.length) {
        const x = q.shift();
        for (const [, t] of out[x] || []) if (depth[t] === undefined) { depth[t] = depth[x] + 1; q.push(t); }
      }
      const levels = {};
      for (const id of states) (levels[depth[id] || 0] = levels[depth[id] || 0] || []).push(id);
      const pos = {};
      const maxLevel = Math.max(...Object.keys(levels).map(Number));
      let maxRows = 1;
      for (const [lv, ids] of Object.entries(levels)) {
        ids.forEach((id, i) => { pos[id] = { x: 90 + lv * 190, y: 90 + i * 120 }; });
        maxRows = Math.max(maxRows, ids.length);
      }
      const W = 180 + (maxLevel + 1) * 190, H = 120 + maxRows * 120;
      const svg = s("svg", { width: W, height: H });
      const ink = cssVar("--text"), acc1 = cssVar("--accent");
      arrowDefs(svg, "arr-dfa", ink);
      // start arrow
      const p0 = pos[d.start];
      svg.appendChild(s("line", { x1: p0.x - 60, y1: p0.y, x2: p0.x - 24, y2: p0.y, stroke: ink, "marker-end": "url(#arr-dfa)" }));
      svg.appendChild(s("text", { x: p0.x - 70, y: p0.y - 8, class: "faint" }, "start"));
      for (const [f, lab, t] of d.transitions) {
        const a = pos[f], b = pos[t];
        let path, lx, ly;
        if (f === t) {
          path = `M${a.x - 12},${a.y - 20} C${a.x - 40},${a.y - 75} ${a.x + 40},${a.y - 75} ${a.x + 12},${a.y - 20}`;
          lx = a.x; ly = a.y - 66;
        } else {
          const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
          const ux = dx / len, uy = dy / len;
          const bend = f < t ? 26 : -26;
          const sx = a.x + ux * 23, sy = a.y + uy * 23, ex = b.x - ux * 25, ey = b.y - uy * 25;
          const cx = (sx + ex) / 2 - uy * bend, cy = (sy + ey) / 2 + ux * bend;
          path = `M${sx},${sy} Q${cx},${cy} ${ex},${ey}`;
          lx = cx; ly = cy - 4;
        }
        svg.appendChild(s("path", { d: path, fill: "none", stroke: ink, "stroke-width": 1.3, "marker-end": "url(#arr-dfa)" }));
        const short = lab.length > 18 ? lab.slice(0, 17) + "…" : lab;
        const tx = s("text", { x: lx, y: ly, "text-anchor": "middle" }, short);
        tx.appendChild(s("title", {}, lab));
        svg.appendChild(tx);
      }
      nodesById = {};
      for (const id of states) {
        const p = pos[id];
        const g = s("g", {});
        const circ = s("circle", { cx: p.x, cy: p.y, r: 22, fill: cssVar("--panel"), stroke: ink, "stroke-width": 1.6 });
        g.appendChild(circ);
        if (acc.has(id)) g.appendChild(s("circle", { cx: p.x, cy: p.y, r: 17, fill: "none", stroke: ink, "stroke-width": 1.2 }));
        g.appendChild(s("text", { x: p.x, y: p.y + 4, "text-anchor": "middle" }, "q" + id));
        svg.appendChild(g);
        nodesById[id] = circ;
      }
      holder.innerHTML = "";
      holder.appendChild(svg);
      step.innerHTML = '<span class="muted">Type a string and press “Step through”.</span>';
      return { d, out, acc, acc1 };
    }
    let model = draw();
    function run() {
      clearInterval(timer);
      model = draw();
      const str = input.value;
      const trans = {};
      for (const [f, lab, t] of model.d.transitions) (trans[f] = trans[f] || []).push([parseLabel(lab), t]);
      let cur = model.d.start, i = 0;
      const paint = () => {
        for (const c2 of Object.values(nodesById)) c2.setAttribute("fill", cssVar("--panel"));
        if (cur !== null && nodesById[cur]) nodesById[cur].setAttribute("fill", cssVar("--hl"));
        const shown = [...str].map((ch, k) => `<span class="${k < i ? "done" : k === i ? "cur" : ""}">${esc(ch)}</span>`).join("");
        let res = "";
        if (cur === null) res = `<span class="result bad">rejected: no transition on ‘${esc(str[i - 1])}’</span>`;
        else if (i >= str.length) res = model.acc.has(cur) ? '<span class="result ok">accepted</span>' : '<span class="result bad">rejected: q' + cur + " is not accepting</span>";
        step.innerHTML = `<div class="dfa-step">${shown || "<span class='muted'>(empty)</span>"}</div><div>state ${cur === null ? "dead" : "q" + cur} ${res}</div>`;
      };
      paint();
      timer = setInterval(() => {
        if (cur === null || i >= str.length) { clearInterval(timer); return; }
        const ch = str[i++];
        const hit = (trans[cur] || []).find(([set]) => set.has(ch));
        cur = hit ? hit[1] : null;
        paint();
      }, 450);
    }
    sel.addEventListener("change", () => {
      clearInterval(timer);
      const name = dfas[+sel.value].name;
      input.value = { identifier: "close_buf", integer: "200", float: "1.5e3", unit_literal: "100.5px", percent: "5%", operator: "<=", punctuation: "{" }[name] || "";
      model = draw();
    });
    runBtn.addEventListener("click", run);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") run(); });
    const idx = dfas.findIndex((x) => x.name === "unit_literal");
    if (idx >= 0) { sel.value = idx; model = draw(); }
  };

  // 4. Parse tree ----------------------------------------------------------------
  function treeView(root, label, onHover, opts) {
    opts = opts || {};
    const wrap = h("div", { class: "tree" });
    let selected = null;
    function build(n, depth) {
      const kids = n.children || [];
      const li = h("li", { class: kids.length && depth >= (opts.openDepth || 4) ? "closed" : "" });
      const tog = h("span", { class: "tog" }, kids.length ? (li.className === "closed" ? "▸" : "▾") : "");
      tog.addEventListener("click", (e) => {
        e.stopPropagation();
        li.classList.toggle("closed");
        tog.textContent = li.classList.contains("closed") ? "▸" : "▾";
      });
      const node = h("span", { class: "node" }, ...label(n));
      node.addEventListener("mouseenter", () => onHover && onHover(n));
      node.addEventListener("click", () => {
        if (selected) selected.classList.remove("sel");
        selected = node;
        node.classList.add("sel");
        opts.onClick && opts.onClick(n);
      });
      li.append(tog, node);
      if (kids.length) li.appendChild(h("ul", null, ...kids.map((k) => build(k, depth + 1))));
      return li;
    }
    wrap.appendChild(h("ul", null, build(root, 0)));
    return wrap;
  }
  panels.parse = function () {
    const p = S.dump.parser;
    const c = section("Parse tree", "Bison LALR(1) parser; hover a node to highlight its source span.");
    c.appendChild(h("div", { class: "card", html:
      `<span class="stat">LALR states <b>${p.lalr_states}</b></span><span class="stat">terminals <b>${p.terminals}</b></span>` +
      `<span class="stat">nonterminals <b>${p.nonterminals}</b></span><span class="stat">rules <b>${p.rules}</b></span>` +
      `<span class="stat">conflicts <b>${p.conflicts}</b></span><span class="stat">syntax errors <b>${p.syntax_errors || 0}</b></span>` }));
    if (!p.parse_tree) { c.appendChild(empty("No parse tree: the input has syntax errors (see Source & diagnostics).")); return; }
    const sv = sourceView(S.dump.source, { maxHeight: "68vh" });
    const tree = treeView(p.parse_tree, (n) => [n.terminal ? h("span", { class: "term" }, n.name) : h("span", null, n.name)],
      (n) => n.span && sv.highlight(n.span), { openDepth: 5 });
    c.appendChild(h("div", { class: "row" }, h("div", { class: "grow card scroll" }, tree), h("div", { class: "grow" }, sv.el)));
  };

  // 5. Symbol table ----------------------------------------------------------------
  panels.symtab = function () {
    const scopes = S.dump.symtab.scopes || [];
    const c = section("Symbol table", "Scopes as nested cards (global → func / handler → block). Struck-through names are never read (W601).");
    const showB = h("input", { type: "checkbox" });
    c.appendChild(h("label", { class: "toolbar" }, showB, " show builtin functions"));
    const holder = h("div");
    c.appendChild(holder);
    const kids = {};
    for (const sc of scopes) if (sc.parent !== null && sc.parent !== undefined) (kids[sc.parent] = kids[sc.parent] || []).push(sc);
    function card(sc) {
      const box = h("div", { class: "scope" }, h("div", { class: "title" }, `#${sc.id} ${sc.kind}`));
      for (const sym of sc.symbols || []) {
        if (sym.kind === "BuiltinFunc" && !showB.checked) continue;
        box.appendChild(h("div", { class: "sym" + (sym.used || sym.line === 0 ? "" : " unused") },
          h("span", { class: "name" }, sym.name), h("span", { class: "kind" }, sym.kind),
          sym.dim || sym.type === "bool" ? dimBadge(sym.type, sym.dim) : h("span", { class: "muted" }, sym.type),
          sym.const !== undefined ? h("span", { class: "muted" }, "= " + sym.const) : null,
          sym.phase ? h("span", { class: "muted" }, "phase " + sym.phase) : null,
          sym.line ? h("span", { class: "muted" }, "line " + sym.line) : h("span", { class: "muted" }, "builtin")));
      }
      for (const k of kids[sc.id] || []) box.appendChild(card(k));
      return box;
    }
    const draw = () => { holder.innerHTML = ""; for (const sc of scopes.filter((x) => x.parent === null || x.parent === undefined)) holder.appendChild(card(sc)); };
    showB.addEventListener("change", draw);
    draw();
  };

  // 6. Typed AST ------------------------------------------------------------------------
  panels.ast = function () {
    const c = section("Typed AST", "Every node carries its inferred dimension (price, volume, notional, scalar, bool) and data stamp. Click a node for its derivation.");
    c.appendChild(h("div", { class: "legend toolbar" }, ...["price", "volume", "notional", "scalar", "bool"].map((k) => h("span", null, h("span", { class: "dim " + k }, k)))));
    const sv = sourceView(S.dump.source, { maxHeight: "40vh" });
    const info = h("div", { class: "deriv" }, "Click a node.");
    const tree = treeView(S.dump.ast, (n) => {
      const a = n.ann || {};
      const out = [h("span", { class: "muted" }, n.role ? n.role + ": " : ""), h("span", null, n.kind), " ", h("b", null, n.label || "")];
      if (n.declType) out.push(h("span", { class: "muted" }, " : " + n.declType));
      if (a.type) out.push(dimBadge(a.type, a.dim));
      if (a.stamp) out.push(h("span", { class: "kind", style: "margin-left:6px" }, `@(${a.stamp[0]},${a.stamp[1]})`));
      return out;
    }, (n) => n.span && sv.highlight(n.span), {
      openDepth: 12,
      onClick: (n) => {
        const a = n.ann || {};
        info.textContent = [`${n.kind} ${n.label || ""}   [line ${n.line}:${n.col}]`,
          a.type ? `type       ${a.type}${a.dim ? "  (" + a.dim.join(",") + ")" : ""}` : "type       —",
          a.stamp ? `stamp      (${a.stamp[0]}, ${a.stamp[1]})  = ${a.stamp[0]} bar(s) ago, known at ${a.stamp[1] === "O" ? "bar open" : "bar close"}` : null,
          a.const !== undefined ? `constant   ${a.const}` : null,
          a.derivation ? `derivation ${a.derivation}` : null].filter(Boolean).join("\n");
      },
    });
    c.appendChild(h("div", { class: "row" }, h("div", { class: "grow card scroll" }, tree), h("div", { style: "width:44%;flex:none" }, info, h("div", { style: "height:10px" }), sv.el)));
  };

  // 7. Causality timeline ---------------------------------------------------------------
  panels.causality = function () {
    const ca = S.dump.causality;
    const checks = ca.checks || [];
    const bad = checks.filter((x) => !x.ok).length;
    const c = section("Causality timeline", `Each read is an arrow from its stamp (bar, phase) to the moment the rule runs. Green = available, red = look-ahead. WARMUP = <b>${ca.warmup}</b> bars${ca.warmupReason ? " (" + esc(ca.warmupReason) + ")" : ""}.`);
    const maxD = Math.min(12, Math.max(3, ...checks.map((x) => x.stamp[0])));
    const LW = 330, BW = 104, RH = 26, top = 46;
    const W = LW + (maxD + 1) * BW + 170, H = top + checks.length * RH + 20;
    const svg = s("svg", { width: W, height: Math.max(H, 90) });
    const okC = cssVar("--ok"), badC = cssVar("--err"), grid = cssVar("--border");
    arrowDefs(svg, "arr-ok", okC);
    arrowDefs(svg, "arr-bad", badC);
    const xOf = (d, ph) => LW + (maxD - Math.min(d, maxD)) * BW + (ph === "O" ? 0.28 : 0.72) * BW;
    for (let d = maxD; d >= 0; d--) {
      const x0 = LW + (maxD - d) * BW;
      svg.appendChild(s("rect", { x: x0 + 2, y: 8, width: BW - 4, height: 18, rx: 4, fill: cssVar("--panel-2") }));
      svg.appendChild(s("text", { x: x0 + BW / 2, y: 21, "text-anchor": "middle" }, d === 0 ? "bar t" : `t-${d}${d === maxD && maxD < Math.max(...checks.map((x) => x.stamp[0]), 0) ? "…" : ""}`));
      for (const ph of ["O", "C"]) {
        const x = xOf(d, ph);
        svg.appendChild(s("line", { x1: x, y1: 30, x2: x, y2: H, stroke: grid, "stroke-dasharray": "3,3" }));
        svg.appendChild(s("text", { x, y: 41, "text-anchor": "middle", class: "faint" }, ph));
      }
    }
    checks.forEach((k, i) => {
      const y = top + i * RH + RH / 2;
      const label = `${k.context}: ${k.read}`;
      const t = s("text", { x: 8, y: y + 4 }, label.length > 44 ? label.slice(0, 43) + "…" : label);
      t.appendChild(s("title", {}, `line ${k.line}:${k.col}  ${label}`));
      svg.appendChild(t);
      const x1 = xOf(k.stamp[0], k.stamp[1]), x2 = xOf(0, k.handler);
      const col = k.ok ? okC : badC;
      svg.appendChild(s("circle", { cx: x1, cy: y, r: 4, fill: col }));
      if (Math.abs(x2 - x1) > 6) {
        svg.appendChild(s("path", { d: `M${x1},${y} L${x2 - (x2 > x1 ? 3 : -3)},${y}`, stroke: col, "stroke-width": 2, fill: "none", "marker-end": `url(#arr-${k.ok ? "ok" : "bad"})` }));
      } else {
        svg.appendChild(s("circle", { cx: x2, cy: y, r: 7, fill: "none", stroke: col, "stroke-width": 2 }));
      }
      if (!k.ok) svg.appendChild(s("text", { x: Math.max(x1, x2) + 12, y: y + 4, fill: badC, style: `fill:${badC};font-weight:700` }, k.code + " look-ahead"));
    });
    if (!checks.length) svg.appendChild(s("text", { x: 10, y: 70, class: "faint" }, "no data reads"));
    c.appendChild(h("div", { class: "card", html: `<span class="stat">reads checked <b>${checks.length}</b></span><span class="stat">illegal <b style="color:${badC}">${bad}</b></span><span class="stat">WARMUP <b>${ca.warmup}</b></span>` }));
    c.appendChild(h("div", { class: "svgwrap" }, svg));
    const rows = (ca.series || []).filter((x) => !x.field || x.bufsize > 0).map((x) => h("tr", null,
      h("td", { class: "mono" }, x.name + (x.field ? "  (field)" : "")), h("td", null, h("span", { class: "kind" }, x.phase)),
      h("td", { class: "mono" }, x.depth), h("td", { class: "mono" }, x.bufsize), h("td", { class: "muted" }, x.phaseReason), h("td", { class: "muted" }, x.bufReason)));
    c.appendChild(h("div", { class: "card", style: "margin-top:12px" }, h("table", null,
      h("thead", null, h("tr", null, ...["series", "phase", "depth", "bufsize", "why this phase", "buffer driven by"].map((x) => h("th", null, x)))), h("tbody", null, ...rows))));
  };

  // 8. State layout ------------------------------------------------------------------------
  panels.layout = function () {
    const L = S.dump.layout;
    const c = section("State layout", `The generated <span class="mono">State</span> struct: ${L.total} bytes, 8-byte aligned, no heap allocation. WARMUP = ${L.warmup}.`);
    const map = h("div", { class: "memmap" });
    let off = 0;
    const blocks = [];
    for (const m of L.members) {
      if (m.offset > off) blocks.push({ name: "padding", kind: "pad", offset: off, size: m.offset - off, type: "", note: "alignment padding" });
      blocks.push(m);
      off = m.offset + m.size;
    }
    if (L.total > off) blocks.push({ name: "padding", kind: "pad", offset: off, size: L.total - off, type: "", note: "tail padding to 8-byte alignment" });
    for (const b of blocks) {
      const div = h("div", { class: "k-" + b.kind }, b.size >= L.total * 0.06 ? b.name : "");
      div.style.flex = `${Math.max(b.size, L.total * 0.018)} 0 0`;
      div.addEventListener("mousemove", (ev) => showTip(`<b class="mono">${esc(b.name)}</b> ${esc(b.type)}<br>offset ${b.offset}, size ${b.size} bytes<br><span class="muted">${esc(b.note || "")}</span>`, ev));
      div.addEventListener("mouseleave", hideTip);
      map.appendChild(div);
    }
    c.appendChild(h("div", { class: "card" }, map, h("div", { class: "legend", style: "margin-top:8px" },
      ...[["bars", "counter"], ["buffer", "ring buffer"], ["acc", "accumulator"], ["deque", "deque"], ["state", "state var"], ["pad", "padding"]].map(([k, n]) => h("span", null, h("i", { class: "k-" + k }), n)))));
    c.appendChild(h("div", { class: "card" }, h("table", null,
      h("thead", null, h("tr", null, ...["member", "type", "offset", "size", "note"].map((x) => h("th", null, x)))),
      h("tbody", null, ...L.members.map((m) => h("tr", null, h("td", { class: "mono" }, m.name), h("td", { class: "mono" }, m.type),
        h("td", { class: "mono" }, m.offset), h("td", { class: "mono" }, m.size), h("td", { class: "muted" }, m.note)))))));
  };

  // 9. TAC & optimizer -------------------------------------------------------------------
  function listingLines(list) {
    const out = [];
    let fn = null;
    for (const it of list || []) {
      if (it.func !== fn) { fn = it.func; out.push("func " + fn + ":"); }
      out.push(it.text);
    }
    return out;
  }
  function diffLines(a, b) {
    const n = a.length, m = b.length;
    const L = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    const ops = [];
    let i = 0, j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) { ops.push(["eq", a[i], b[j]]); i++; j++; }
      else if (L[i + 1][j] >= L[i][j + 1]) ops.push(["del", a[i++], null]);
      else ops.push(["add", null, b[j++]]);
    }
    while (i < n) ops.push(["del", a[i++], null]);
    while (j < m) ops.push(["add", null, b[j++]]);
    // Pair runs of deletions followed by additions as "changed" lines.
    const rows = [];
    for (let k = 0; k < ops.length;) {
      if (ops[k][0] === "eq") { rows.push(ops[k++]); continue; }
      const dels = [], adds = [];
      while (k < ops.length && ops[k][0] === "del") dels.push(ops[k++][1]);
      while (k < ops.length && ops[k][0] === "add") adds.push(ops[k++][2]);
      for (let x = 0; x < Math.max(dels.length, adds.length); x++) {
        const l = dels[x] !== undefined ? dels[x] : null, r = adds[x] !== undefined ? adds[x] : null;
        rows.push([l !== null && r !== null ? "chg" : l !== null ? "del" : "add", l, r]);
      }
    }
    return rows;
  }
  function costTag(text) {
    if (/\bROLL(MEAN|SUM|STD|MAX|MIN)\b/.test(text)) return h("span", { class: "cost on" }, "O(N) loop");
    if (/\b(ALOAD|RSTD|RSUM_UPD|RSQ_UPD|WMAX_UPD|WMIN_UPD|WMAX_GET|WMIN_GET|EMA_UPD)\b/.test(text)) return h("span", { class: "cost o1" }, "O(1)");
    return null;
  }
  function tacBox(lines, cls) {
    return h("div", { class: "tac" }, ...lines.map((l, i) => h("div", { class: cls ? cls[i] : "" }, l === null ? " " : l, l ? costTag(l) : null)));
  }
  panels.tac = function () {
    const T = S.dump.tac;
    const passes = T.passes || [];
    const c = section("TAC & optimizer", `Three-address code before/after each pass (-O${S.dump.optLevel}). Red = removed, green = added, yellow = rewritten. ${T.initialCount} → ${T.finalCount} instructions; data-flow sweeps ≤ ${T.maxSweeps}.`);
    // stats chart
    const counts = [["initial", T.initialCount]].concat(passes.map((p) => [p.name, p.countAfter]));
    const maxC = Math.max(1, ...counts.map((x) => x[1]));
    const bw = 58, ch = 150;
    const svg = s("svg", { width: Math.max(300, counts.length * bw + 40), height: ch + 86 });
    counts.forEach(([n, v], i) => {
      const bh = (v / maxC) * ch, x = 30 + i * bw;
      svg.appendChild(s("rect", { x, y: 22 + ch - bh, width: bw - 14, height: bh, rx: 3, fill: i === 0 ? cssVar("--dim-scalar") : cssVar("--accent") }));
      svg.appendChild(s("text", { x: x + (bw - 14) / 2, y: 17 + ch - bh, "text-anchor": "middle" }, v));
      svg.appendChild(s("text", { x: x + 4, y: ch + 38, transform: `rotate(35 ${x + 4} ${ch + 38})`, class: "faint" }, n));
    });
    c.appendChild(h("div", { class: "card" }, h("div", { class: "muted" }, "instruction count after each pass"), svg));
    const bar = h("div", { class: "toolbar passes" });
    const stat = h("div", { class: "muted", style: "margin-bottom:6px" });
    const holder = h("div", { class: "row" });
    c.append(bar, stat, holder);
    const buttons = [];
    function showPass(i) {
      buttons.forEach((b, k) => b.classList.toggle("active", k === i));
      let before, after, title;
      if (i < 0) { before = listingLines(T.initial); after = listingLines(T.final); title = "initial → final"; }
      else { const p = passes[i]; before = listingLines(p.before); after = listingLines(p.after); title = `${p.name}: ${p.countBefore} → ${p.countAfter} instructions, ${p.changed} rewritten${p.sweeps ? ", data-flow sweeps " + p.sweeps : ""}`; }
      stat.textContent = title;
      const rows = diffLines(before, after);
      const L = rows.map((r) => r[1]), R = rows.map((r) => r[2]);
      const cl = rows.map((r) => (r[0] === "del" || r[0] === "chg" ? r[0] : r[0] === "add" ? "pad" : "")), cr = rows.map((r) => (r[0] === "add" || r[0] === "chg" ? r[0] : r[0] === "del" ? "pad" : ""));
      holder.innerHTML = "";
      const lb = tacBox(L, cl), rb = tacBox(R, cr);
      lb.addEventListener("scroll", () => { rb.scrollTop = lb.scrollTop; });
      rb.addEventListener("scroll", () => { lb.scrollTop = rb.scrollTop; });
      holder.append(h("div", { class: "grow" }, h("b", null, "before"), lb), h("div", { class: "grow" }, h("b", null, "after"), rb));
    }
    const all = h("button", { onclick: () => showPass(-1) }, "initial → final");
    buttons.push(all);
    bar.appendChild(all);
    passes.forEach((p, i) => {
      const b = h("button", { onclick: () => showPass(i), title: `${p.countBefore} → ${p.countAfter}` }, p.name, h("span", { class: "muted" }, " " + (p.countAfter < p.countBefore ? "−" + (p.countBefore - p.countAfter) : p.countAfter > p.countBefore ? "+" + (p.countAfter - p.countBefore) : "±0")));
      buttons.push(b);
      bar.appendChild(b);
    });
    showPass(-1);
    if (!passes.length) bar.appendChild(h("span", { class: "muted" }, "(-O0: no passes run)"));
  };

  // 10. CFG ------------------------------------------------------------------------------------
  panels.cfg = function () {
    const blocks = S.dump.cfg.blocks || [];
    const funcs = [...new Set(blocks.map((b) => b.func))];
    const c = section("Control-flow graph", "Basic blocks of the final TAC. QuantScript has no loops, so every CFG is a DAG (layered by longest path from the entry).");
    const sel = h("select", null, ...funcs.map((f) => h("option", { value: f }, f)));
    const holder = h("div", { class: "svgwrap" });
    c.append(h("div", { class: "toolbar" }, "function ", sel), holder);
    function draw() {
      const bs = blocks.filter((b) => b.func === sel.value);
      holder.innerHTML = "";
      if (!bs.length) { holder.appendChild(empty("empty function")); return; }
      const byId = {};
      bs.forEach((b) => (byId[b.id] = b));
      const level = {};
      bs.forEach((b) => (level[b.id] = level[b.id] || 0));
      for (const b of [...bs].sort((x, y) => x.id - y.id)) for (const t of b.succ) if (byId[t]) level[t] = Math.max(level[t] || 0, level[b.id] + 1);
      const levels = {};
      bs.forEach((b) => (levels[level[b.id]] = levels[level[b.id]] || []).push(b));
      const size = {};
      bs.forEach((b) => {
        const lines = b.text.length ? b.text : ["(empty)"];
        size[b.id] = { w: Math.min(360, 22 + 7.3 * Math.max(8, ...lines.map((t) => t.length))), h: 24 + 15 * lines.length };
      });
      const pos = {};
      let y = 20, W = 0;
      for (const lv of Object.keys(levels).map(Number).sort((a, b) => a - b)) {
        let x = 20, rowH = 0;
        for (const b of levels[lv]) {
          pos[b.id] = { x, y };
          x += size[b.id].w + 40;
          rowH = Math.max(rowH, size[b.id].h);
        }
        W = Math.max(W, x);
        y += rowH + 50;
      }
      const svg = s("svg", { width: W + 20, height: y });
      const ink = cssVar("--text");
      arrowDefs(svg, "arr-cfg", cssVar("--muted"));
      for (const b of bs) for (const t of b.succ) {
        if (!pos[t]) continue;
        const a = pos[b.id], z = pos[t];
        const x1 = a.x + size[b.id].w / 2, y1 = a.y + size[b.id].h, x2 = z.x + size[t].w / 2, y2 = z.y;
        svg.appendChild(s("path", { d: `M${x1},${y1} C${x1},${y1 + 30} ${x2},${y2 - 30} ${x2},${y2 - 2}`, fill: "none", stroke: cssVar("--muted"), "stroke-width": 1.4, "marker-end": "url(#arr-cfg)" }));
      }
      for (const b of bs) {
        const p = pos[b.id], sz = size[b.id];
        svg.appendChild(s("rect", { x: p.x, y: p.y, width: sz.w, height: sz.h, rx: 6, fill: cssVar("--panel-2"), stroke: b.reachable ? ink : cssVar("--err"), "stroke-width": 1.2 }));
        svg.appendChild(s("text", { x: p.x + 8, y: p.y + 15, style: "font-weight:700" }, `${b.label}  [${b.instrs[0]}..${b.instrs[b.instrs.length - 1]}]`));
        (b.text.length ? b.text : ["(empty)"]).forEach((t, i) => {
          const tt = t.length > 46 ? t.slice(0, 45) + "…" : t;
          svg.appendChild(s("text", { x: p.x + 10, y: p.y + 32 + i * 15 }, tt));
        });
      }
      holder.appendChild(svg);
    }
    sel.addEventListener("change", draw);
    if (funcs.includes("on_close")) sel.value = "on_close";
    draw();
  };

  // 11. Interference graph ------------------------------------------------------------------------
  panels.ig = function () {
    const R = S.dump.regalloc;
    const funcs = (R.funcs || []).map((f) => f.name);
    const c = section("Interference graph", `Chaitin–Briggs coloring with K = ${R.K} (F) and ${R.KB} (B) registers. Nodes are TAC temporaries; edges join temporaries that are live at the same time. Drag the slider to replay simplify → select.`);
    const fsel = h("select", null, ...funcs.map((f) => h("option", { value: f }, f)));
    const csel = h("select", null, h("option", { value: "F" }, "class F (double)"), h("option", { value: "B" }, "class B (bool)"));
    const slider = h("input", { type: "range", min: 0, max: 0, value: 0, style: "width:280px" });
    const play = h("button", null, "▶ play");
    const stepLbl = h("span", { class: "mono muted" });
    const info = h("div", { class: "card" });
    const holder = h("div", { class: "svgwrap", style: "flex:1" });
    const stackBox = h("div", { class: "card", style: "width:250px;flex:none" });
    c.append(h("div", { class: "toolbar" }, "function ", fsel, csel, slider, play, stepLbl), info, h("div", { class: "row" }, holder, stackBox));
    let timer = null;
    function draw() {
      clearInterval(timer);
      play.textContent = "▶ play";
      const fn = fsel.value, cl = csel.value;
      const nodes = R.nodes.map((n, i) => ({ ...n, idx: i })).filter((n) => n.func === fn && n.cls === cl);
      const idset = new Set(nodes.map((n) => n.idx));
      const edges = R.edges.filter(([a, b]) => idset.has(a) && idset.has(b));
      const ids = new Set(nodes.map((n) => n.id));
      const events = (R.order || []).filter((e) => e.func === fn && (e.op === "rerun" || ids.has(e.node)));
      const fi = (R.funcs || []).find((f) => f.name === fn) || {};
      info.innerHTML = `<span class="stat">nodes <b>${nodes.length}</b></span><span class="stat">edges <b>${edges.length}</b></span>` +
        `<span class="stat">registers used <b>${cl === "F" ? fi.fregs : fi.bregs}</b></span><span class="stat">spill slots <b>${cl === "F" ? fi.fspill : fi.bspill}</b></span>` +
        `<span class="stat">coloring rounds <b>${fi.rounds}</b></span>`;
      slider.max = events.length;
      slider.value = events.length;
      const N = Math.max(nodes.length, 1);
      const r = Math.max(120, Math.min(300, 30 * N / Math.PI));
      const cx = r + 60, cy = r + 50;
      const pos = {};
      nodes.forEach((n, i) => { const a = (2 * Math.PI * i) / N - Math.PI / 2; pos[n.idx] = { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }; });
      const svg = s("svg", { width: 2 * r + 120, height: 2 * r + 100 });
      const eg = s("g", {});
      for (const [a, b] of edges) eg.appendChild(s("line", { x1: pos[a].x, y1: pos[a].y, x2: pos[b].x, y2: pos[b].y, stroke: cssVar("--border"), "stroke-width": 1.2 }));
      svg.appendChild(eg);
      const circles = {};
      for (const n of nodes) {
        const p = pos[n.idx];
        const g = s("g", {});
        const circ = s("circle", { cx: p.x, cy: p.y, r: 15, "stroke-width": 2 });
        g.appendChild(circ);
        g.appendChild(s("text", { x: p.x, y: p.y + 4, "text-anchor": "middle", style: "font-size:11px" }, n.id));
        g.addEventListener("mousemove", (ev) => showTip(`<b class="mono">${n.id}</b> (${n.cls})<br>live [${n.live[0]}, ${n.live[1]}], cost ${n.cost}, degree ${n.degree}<br>` +
          (n.spilled ? `<span style="color:${cssVar("--err")}">spilled → slot ${n.slot}</span>` : `color ${n.color} → ${n.cls === "B" ? "b" : "r"}${n.color}`) + (n.rep !== n.id ? `<br>coalesced into ${n.rep}` : ""), ev));
        g.addEventListener("mouseleave", hideTip);
        svg.appendChild(g);
        circles[n.id] = circ;
      }
      holder.innerHTML = "";
      holder.appendChild(svg);
      function render(step) {
        const colorOf = {}, removed = new Set(), spilled = new Set(), merged = {};
        let stack = [];
        for (let i = 0; i < step; i++) {
          const e = events[i];
          if (e.op === "coalesce") merged[e.with] = e.node;
          else if (e.op === "simplify" || e.op === "spill_candidate") { removed.add(e.node); stack.push((e.op === "spill_candidate" ? "? " : "") + e.node); }
          else if (e.op === "select") { colorOf[e.node] = e.color; stack = stack.filter((x) => x.replace("? ", "") !== e.node); }
          else if (e.op === "spill") { spilled.add(e.node); stack = stack.filter((x) => x.replace("? ", "") !== e.node); }
          else if (e.op === "rerun") { for (const k of Object.keys(colorOf)) delete colorOf[k]; removed.clear(); stack = []; }
        }
        for (const n of nodes) {
          const rep = merged[n.id] || n.id;
          const circ = circles[n.id];
          const col = colorOf[rep];
          circ.setAttribute("fill", col !== undefined ? PALETTE[col % PALETTE.length] : cssVar("--panel"));
          circ.setAttribute("stroke", spilled.has(rep) ? cssVar("--err") : cssVar("--text"));
          circ.setAttribute("stroke-dasharray", spilled.has(rep) ? "4,3" : "");
          circ.setAttribute("opacity", removed.has(rep) && col === undefined && !spilled.has(rep) ? 0.35 : 1);
        }
        const e = events[step - 1];
        stepLbl.textContent = `step ${step}/${events.length}` + (e ? `: ${e.op} ${e.node || ""}${e.with ? " ← " + e.with : ""}${e.color !== undefined ? " color " + e.color : ""}` : "");
        stackBox.innerHTML = "<b>simplify stack</b> <span class='muted'>(top first; ? = optimistic spill candidate)</span>";
        stackBox.appendChild(h("div", { class: "mono" }, ...(stack.length ? [...stack].reverse().map((x) => h("div", null, x)) : [h("div", { class: "muted" }, "(empty)")])));
        stackBox.appendChild(h("div", { class: "muted", style: "margin-top:8px" }, `spilled: ${[...spilled].join(", ") || "none"}`));
      }
      slider.oninput = () => render(+slider.value);
      play.onclick = () => {
        if (timer) { clearInterval(timer); timer = null; play.textContent = "▶ play"; return; }
        if (+slider.value >= events.length) slider.value = 0;
        play.textContent = "❚❚ pause";
        timer = setInterval(() => {
          if (+slider.value >= events.length) { clearInterval(timer); timer = null; play.textContent = "▶ play"; return; }
          slider.value = +slider.value + 1;
          render(+slider.value);
        }, 280);
      };
      render(events.length);
    }
    fsel.addEventListener("change", draw);
    csel.addEventListener("change", draw);
    if (funcs.includes("on_close")) fsel.value = "on_close";
    draw();
  };

  // 12. Generated C++ ---------------------------------------------------------------------------
  function highlightCpp(code) {
    const KW = /\b(if|goto|return|double|bool|long|struct|static|constexpr|const|void|explicit|private|public|true|false|unsigned|char|int|auto|using|template|typename|static_assert)\b/;
    const re = /("(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(?:UL)?\b)|(\b[A-Za-z_]\w*\b)|(#\w+)/g;
    return code.split("\n").map((line) => {
      let ci = -1;
      for (let i = 0, q = false; i < line.length - 1; i++) {
        if (line[i] === '"' && line[i - 1] !== "\\") q = !q;
        if (!q && line[i] === "/" && line[i + 1] === "/") { ci = i; break; }
      }
      const codePart = ci >= 0 ? line.slice(0, ci) : line;
      const com = ci >= 0 ? line.slice(ci) : "";
      const hl = esc(codePart).replace(re, (m, str, num, id, pp) => {
        if (str) return `<span class="str">${str}</span>`;
        if (num) return `<span class="num">${num}</span>`;
        if (pp) return `<span class="kw">${pp}</span>`;
        if (KW.test(id)) return `<span class="kw">${id}</span>`;
        if (id === "qs" || /^(Orders|Params|State|Q|Price|Volume|Notional|Scalar)$/.test(id)) return `<span class="ty">${id}</span>`;
        return id;
      });
      let ce = esc(com);
      ce = ce.replace(/^\/\/ L(\d+)/, (m, n) => `// <a class="srcl" data-line="${n}">L${n}</a>`);
      return hl + (ce ? `<span class="com">${ce}</span>` : "");
    }).join("\n");
  }
  panels.cpp = function () {
    const c = section("Generated C++", "Header-only strategy class. Every statement carries <span class='mono'>// L&lt;line&gt; &lt;TAC&gt;</span>; click a line marker to jump to the source.");
    const pre = h("pre", { class: "code", html: highlightCpp(S.dump.cpp) });
    pre.addEventListener("click", (e) => {
      const a = e.target.closest("a.srcl");
      if (!a) return;
      S.pendingFlash = +a.dataset.line;
      go("source");
    });
    c.appendChild(pre);
  };

  // 13. Compare -O0 / -O2 ------------------------------------------------------------------------
  panels.compare = function () {
    const c = section("Compare -O0 / -O2", "Load a second dump of the same program at another optimization level. Window ops are annotated with their per-bar cost.");
    const load2 = h("button", { onclick: () => $("fileInput2").click() }, "Load second dump…");
    const demo = window.QS_SAMPLES && window.QS_SAMPLES["zrevert_O0.json"] && window.QS_SAMPLES["zrevert_O2.json"]
      ? h("button", { onclick: () => { setDump(window.QS_SAMPLES["zrevert_O2.json"], "zrevert_O2.json"); S.dump2 = window.QS_SAMPLES["zrevert_O0.json"]; S.name2 = "zrevert_O0.json"; go("compare"); } }, "Use demo pair (zrevert -O0 / -O2)") : null;
    c.appendChild(h("div", { class: "toolbar" }, load2, demo, S.dump2 ? h("span", { class: "muted mono" }, "second: " + S.name2) : null));
    if (!S.dump2) { c.appendChild(empty("Only one dump loaded. Produce both with  qsc -O0 --dump-json a.json prog.qs  and  qsc -O2 --dump-json b.json prog.qs.")); return; }
    let A = S.dump, B = S.dump2, nA = S.name, nB = S.name2;
    if ((A.optLevel || 0) > (B.optLevel || 0)) { [A, B] = [B, A]; [nA, nB] = [nB, nA]; }
    const summary = (d) => {
      const fin = (d.tac && d.tac.final) || [];
      const roll = fin.filter((i) => /\bROLL(MEAN|SUM|STD|MAX|MIN)\b/.test(i.text)).length;
      const o1 = fin.filter((i) => /\b(ALOAD|RSTD|RSUM_UPD|RSQ_UPD|WMAX_UPD|WMIN_UPD|WMAX_GET|WMIN_GET)\b/.test(i.text)).length;
      const ops = {};
      for (const i of fin) { const m = /(?:=\s*)?([A-Z_]+)\b/.exec(i.text.replace(/^\s*t\d+\s*=\s*/, "")); if (m) ops[m[1]] = (ops[m[1]] || 0) + 1; }
      return { count: d.tac ? d.tac.finalCount : "–", roll, o1, bytes: d.layout ? d.layout.total : "–", warm: d.causality ? d.causality.warmup : "–", ops };
    };
    const a = summary(A), b = summary(B);
    c.appendChild(h("div", { class: "card" }, h("table", null,
      h("thead", null, h("tr", null, h("th", null, ""), h("th", null, `-O${A.optLevel} (${nA})`), h("th", null, `-O${B.optLevel} (${nB})`))),
      h("tbody", null,
        h("tr", null, h("td", null, "final TAC instructions"), h("td", { class: "mono" }, a.count), h("td", { class: "mono" }, b.count)),
        h("tr", null, h("td", null, "O(N) window loops per bar"), h("td", { class: "mono" }, a.roll), h("td", { class: "mono" }, b.roll)),
        h("tr", null, h("td", null, "O(1) window ops (accumulators / deques)"), h("td", { class: "mono" }, a.o1), h("td", { class: "mono" }, b.o1)),
        h("tr", null, h("td", null, "State size (bytes)"), h("td", { class: "mono" }, a.bytes), h("td", { class: "mono" }, b.bytes)),
        h("tr", null, h("td", null, "WARMUP"), h("td", { class: "mono" }, a.warm), h("td", { class: "mono" }, b.warm))))));
    const opsAll = [...new Set([...Object.keys(a.ops), ...Object.keys(b.ops)])].sort();
    c.appendChild(h("div", { class: "card" }, h("b", null, "instruction mix"), h("table", null,
      h("thead", null, h("tr", null, h("th", null, "op"), h("th", null, `-O${A.optLevel}`), h("th", null, `-O${B.optLevel}`))),
      h("tbody", null, ...opsAll.map((o) => h("tr", null, h("td", { class: "mono" }, o, costTag(o)), h("td", { class: "mono" }, a.ops[o] || 0), h("td", { class: "mono" }, b.ops[o] || 0)))))));
    const LA = listingLines(A.tac && A.tac.final), LB = listingLines(B.tac && B.tac.final);
    c.appendChild(h("div", { class: "row" }, h("div", { class: "grow" }, h("b", null, `-O${A.optLevel} final TAC`), tacBox(LA)), h("div", { class: "grow" }, h("b", null, `-O${B.optLevel} final TAC`), tacBox(LB))));
  };

  // ============================================================== shell
  function go(phase) {
    S.phase = phase;
    renderSidebar();
    hideTip();
    const c = $("content");
    if (!S.dump) { welcome(); return; }
    const def = PHASES.find((p) => p[0] === phase);
    if (def && !def[2](S.dump)) {
      section(def[1]);
      const stopped = (S.dump.diagnostics || []).some((d) => d.severity === "error");
      c.appendChild(empty(stopped ? "Not available: compilation stopped with errors before this phase (see Source & diagnostics)." : "Not present in this dump."));
      return;
    }
    try { panels[phase](); }
    catch (err) {
      section(def ? def[1] : phase);
      c.appendChild(empty("Could not render this panel: " + err.message));
    }
  }
  function renderSidebar() {
    const nav = $("sidebar");
    nav.innerHTML = "";
    PHASES.forEach(([id, name, ok], i) => {
      const avail = S.dump ? ok(S.dump) : false;
      const a = h("a", { href: "#" + id, class: (S.phase === id ? "active " : "") + (S.dump && !avail ? "missing" : "") }, h("span", { class: "num" }, i + 1), name);
      a.addEventListener("click", (e) => { e.preventDefault(); if (S.dump) go(id); });
      nav.appendChild(a);
    });
    nav.appendChild(h("div", { class: "hint" }, "← / → switch phases"));
  }
  function welcome() {
    const c = $("content");
    c.innerHTML = "";
    const samples = window.QS_SAMPLES ? Object.keys(window.QS_SAMPLES) : [];
    c.appendChild(h("div", { id: "welcome" },
      h("h2", null, "QuantScript phase viewer"),
      h("p", { class: "muted" }, "Visualizes every compiler phase from a phase dump: tokens, DFAs, parse tree, symbols, typed AST, causality timeline, layout, optimizer passes, CFG, interference graph and generated C++."),
      h("div", { class: "drop" }, h("p", null, "Drop a dump here, or"), h("button", { class: "primary", onclick: () => $("fileInput").click() }, "Open dump…"), " ",
        h("button", { onclick: openPaste }, "Paste JSON"),
        h("p", { class: "muted mono", style: "margin-top:16px" }, "qsc --dump-json dump.json examples/valid/zrevert.qs")),
      samples.length ? h("div", null, h("p", null, "Or open a bundled example:"),
        ...samples.map((k) => h("button", { style: "margin:4px", onclick: () => { setDump(window.QS_SAMPLES[k], k); if (k === "zrevert_O2.json" && window.QS_SAMPLES["zrevert_O0.json"]) { S.dump2 = window.QS_SAMPLES["zrevert_O0.json"]; S.name2 = "zrevert_O0.json"; } } }, k))) : null));
  }
  function setDump(d, name) {
    if (!d || typeof d !== "object") throw new Error("not a QuantScript dump");
    S.dump = d;
    S.name = name || d.file || "dump.json";
    $("fileName").textContent = S.name;
    const diags = d.diagnostics || [];
    const ne = diags.filter((x) => x.severity === "error").length;
    const nw = diags.length - ne;
    const st = $("status");
    st.className = "badge " + (ne ? "err" : nw ? "warn" : "ok");
    st.textContent = ne ? `${ne} error${ne > 1 ? "s" : ""}` : nw ? `OK · ${nw} warning${nw > 1 ? "s" : ""}` : "OK";
    $("optLevel").textContent = d.optLevel !== undefined ? "-O" + d.optLevel : "-O?";
    go(ne ? "source" : S.phase || "source");
  }
  function loadText(text, name, second) {
    let d;
    try { d = JSON.parse(text); }
    catch (e) { alert("Not valid JSON: " + e.message); return; }
    if (second) { S.dump2 = d; S.name2 = name; go("compare"); }
    else setDump(d, name);
  }
  function readFile(file, second) {
    const r = new FileReader();
    r.onload = () => loadText(String(r.result), file.name, second);
    r.readAsText(file);
  }
  function openPaste() { $("pasteModal").classList.add("open"); $("pasteArea").focus(); }

  // ---- wiring ----
  $("openBtn").addEventListener("click", () => $("fileInput").click());
  $("fileInput").addEventListener("change", (e) => { if (e.target.files[0]) readFile(e.target.files[0], false); e.target.value = ""; });
  $("fileInput2").addEventListener("change", (e) => { if (e.target.files[0]) readFile(e.target.files[0], true); e.target.value = ""; });
  $("pasteBtn").addEventListener("click", openPaste);
  $("pasteCancel").addEventListener("click", () => $("pasteModal").classList.remove("open"));
  $("pasteOk").addEventListener("click", () => { $("pasteModal").classList.remove("open"); loadText($("pasteArea").value, "pasted.json", false); });
  $("demoBtn").addEventListener("click", () => {
    const sm = window.QS_SAMPLES;
    if (!sm || !sm["zrevert_O2.json"]) { alert("No bundled samples (run `make examples`)."); return; }
    S.dump2 = sm["zrevert_O0.json"] || null;
    S.name2 = "zrevert_O0.json";
    setDump(sm["zrevert_O2.json"], "zrevert_O2.json");
  });
  if (!window.QS_SAMPLES) $("demoBtn").style.display = "none";
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("qs-theme", t); } catch (e) { /* storage unavailable */ }
  }
  let theme = null;
  try { theme = localStorage.getItem("qs-theme"); } catch (e) { theme = null; }
  if (!theme) theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  applyTheme(theme);
  $("themeBtn").addEventListener("click", () => {
    applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
    if (S.dump) go(S.phase);
  });
  document.addEventListener("keydown", (e) => {
    if (!S.dump || /INPUT|TEXTAREA|SELECT/.test((e.target && e.target.tagName) || "")) return;
    const i = PHASES.findIndex((p) => p[0] === S.phase);
    if (e.key === "ArrowRight" && i < PHASES.length - 1) go(PHASES[i + 1][0]);
    else if (e.key === "ArrowLeft" && i > 0) go(PHASES[i - 1][0]);
  });
  ["dragenter", "dragover"].forEach((t) => document.addEventListener(t, (e) => { e.preventDefault(); document.body.classList.add("dragging"); }));
  ["dragleave", "drop"].forEach((t) => document.addEventListener(t, (e) => { e.preventDefault(); if (t === "drop" || e.target === document.documentElement) document.body.classList.remove("dragging"); }));
  document.addEventListener("drop", (e) => {
    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) readFile(f, S.phase === "compare" && !!S.dump);
  });
  renderSidebar();
  welcome();
})();
