// qsc: the QuantScript compiler driver (§16).
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <fstream>
#include <iostream>
#include <sstream>
#include <string>
#include <sys/stat.h>
#include <unistd.h>

#include "ast.hpp"
#include "causality.hpp"
#include "cfg.hpp"
#include "codegen_cpp.hpp"
#include "dataflow.hpp"
#include "diag.hpp"
#include "irgen.hpp"
#include "json.hpp"
#include "layout.hpp"
#include "lexer.hpp"
#include "opt.hpp"
#include "parser.tab.hpp"
#include "rdfa.hpp"
#include "regalloc.hpp"
#include "sema.hpp"
#include "symtab.hpp"
#include "tac.hpp"
#include "parser_stats.inc"
#include "harness_embed.inc"

namespace {

const char* kVersion = "1.0";

struct Options {
    std::string input, outDir = "out", jsonFile, interpretCsv, traceFile;
    int opt = 2, regs = 8;
    bool dumpTokens = false, dumpAst = false, dumpSymtab = false, dumpTac = false, dumpLayout = false;
    bool dumpCfg = false, dumpIg = false, strongTypes = false, asserts = false, noColor = false;
    bool jsonDiag = false, dumpCausality = false;
};

void usage(std::FILE* f) {
    std::fprintf(f,
                 "usage: qsc [options] input.qs\n\n"
                 "  -o DIR              output directory (default ./out)\n"
                 "  -O0 | -O1 | -O2     optimization level (default -O2)\n"
                 "  --regs K            F-class register count (default 8; B-class = min(4, K))\n"
                 "  --dump-json FILE    write the full phase dump for the viewer\n"
                 "  --dump-tokens       print token stream\n"
                 "  --dump-ast          print annotated AST\n"
                 "  --dump-symtab       print symbol table\n"
                 "  --dump-causality    print series phases, depths and every checked read\n"
                 "  --dump-tac          print TAC (before and after each pass)\n"
                 "  --dump-layout       print state layout report\n"
                 "  --dump-cfg          print basic blocks\n"
                 "  --dump-ig           print interference graph and coloring\n"
                 "  --interpret CSV     run the TAC interpreter on CSV and print orders\n"
                 "  --trace FILE        with --interpret: write per-bar series values to FILE\n"
                 "  --emit-strong-types emit dimension-checked wrapper types (units_check)\n"
                 "  --emit-asserts      emit runtime asserts (warm-up, ring indices, NaN)\n"
                 "  --json-diagnostics  print diagnostics as JSON on stderr\n"
                 "  --no-color\n"
                 "  --version / --help\n\n"
                 "exit codes: 0 success (warnings allowed), 1 compile errors, 2 usage/IO error\n");
}

bool parseArgs(int argc, char** argv, Options& o) {
    for (int i = 1; i < argc; ++i) {
        std::string a = argv[i];
        auto need = [&](std::string& dst) {
            if (i + 1 >= argc) {
                std::fprintf(stderr, "qsc: %s needs an argument\n", a.c_str());
                return false;
            }
            dst = argv[++i];
            return true;
        };
        if (a == "-o") { if (!need(o.outDir)) return false; }
        else if (a == "-O0") o.opt = 0;
        else if (a == "-O1") o.opt = 1;
        else if (a == "-O2") o.opt = 2;
        else if (a == "--regs") {
            std::string v;
            if (!need(v)) return false;
            o.regs = std::atoi(v.c_str());
            if (o.regs < 1) {
                std::fprintf(stderr, "qsc: --regs must be >= 1\n");
                return false;
            }
        }
        else if (a == "--dump-json") { if (!need(o.jsonFile)) return false; }
        else if (a == "--dump-tokens") o.dumpTokens = true;
        else if (a == "--dump-ast") o.dumpAst = true;
        else if (a == "--dump-symtab") o.dumpSymtab = true;
        else if (a == "--dump-causality") o.dumpCausality = true;
        else if (a == "--dump-tac") o.dumpTac = true;
        else if (a == "--dump-layout") o.dumpLayout = true;
        else if (a == "--dump-cfg") o.dumpCfg = true;
        else if (a == "--dump-ig") o.dumpIg = true;
        else if (a == "--interpret") { if (!need(o.interpretCsv)) return false; }
        else if (a == "--trace") { if (!need(o.traceFile)) return false; }
        else if (a == "--emit-strong-types") o.strongTypes = true;
        else if (a == "--emit-asserts") o.asserts = true;
        else if (a == "--json-diagnostics") o.jsonDiag = true;
        else if (a == "--no-color") o.noColor = true;
        else if (!a.empty() && a[0] == '-') {
            std::fprintf(stderr, "qsc: unknown option %s (see --help)\n", a.c_str());
            return false;
        } else if (o.input.empty()) o.input = a;
        else {
            std::fprintf(stderr, "qsc: more than one input file\n");
            return false;
        }
    }
    if (o.input.empty()) {
        std::fprintf(stderr, "qsc: no input file (see --help)\n");
        return false;
    }
    return true;
}

bool writeFile(const std::string& path, const std::string& text) {
    std::ofstream f(path, std::ios::binary);
    if (!f) return false;
    f << text;
    return static_cast<bool>(f);
}

std::string baseName(const std::string& p) {
    size_t s = p.find_last_of('/');
    return s == std::string::npos ? p : p.substr(s + 1);
}

class Driver {
public:
    explicit Driver(Options o) : opt(std::move(o)) {}

    int run() {
        std::ifstream f(opt.input, std::ios::binary);
        if (!f) {
            std::fprintf(stderr, "qsc: cannot read %s\n", opt.input.c_str());
            return 2;
        }
        std::stringstream ss;
        ss << f.rdbuf();
        src = ss.str();
        diag.setSource(baseName(opt.input), src);
        dump = Json::object();
        dump.set("version", "1.0");
        dump.set("file", baseName(opt.input));
        dump.set("optLevel", opt.opt);
        dump.set("source", src);
        dump.set("diagnostics", Json::array());
        int rc = compile();
        finish();
        return rc;
    }

private:
    int compile() {
        // ---- lexing ----
        std::vector<Token> toks;
        bool lexOk = lexSource(src, diag, toks);
        Json lex = Json::object();
        lex.set("tokens", tokensToJson(toks));
        auto classes = quantscriptTokenClasses();
        Json dfas = Json::array();
        for (auto& c : classes) dfas.push(dfaJson(c));
        lex.set("dfa", dfaJson(classes[0]));
        lex.set("dfas", dfas);
        dump.set("lexer", lex);
        if (opt.dumpTokens) std::cout << tokensToText(toks);
        if (!lexOk) return 1;

        // ---- parsing ----
        ParseCtx pc;
        pc.toks = &toks;
        pc.diag = &diag;
        pc.arena = &arena;
        Node* prog = parseTokens(pc);
        Json par = Json::object();
        par.set("lalr_states", QS_LALR_STATES);
        par.set("terminals", QS_TERMINALS);
        par.set("nonterminals", QS_NONTERMINALS);
        par.set("rules", QS_RULES);
        par.set("conflicts", QS_CONFLICTS);
        par.set("syntax_errors", pc.errors);
        if (prog && pc.errors == 0) par.set("parse_tree", parseTreeJson(prog));
        dump.set("parser", par);
        if (pc.errors || !prog) return 1;

        // ---- semantic analysis ----
        Sema sema(diag, symtab, prog);
        bool semaOk = sema.run();
        dump.set("symtab", symtab.toJson());
        dump.set("ast", astToJson(prog));
        if (opt.dumpSymtab) std::cout << symtab.toText();
        if (!semaOk) {
            if (opt.dumpAst) std::cout << astToText(prog);
            return 1;
        }

        // ---- causality ----
        Causality caus(diag, sema.result());
        bool causOk = caus.run();
        dump.set("ast", astToJson(prog));  // now with stamps
        dump.set("causality", caus.toJson());
        if (opt.dumpAst) std::cout << astToText(prog);
        if (opt.dumpCausality) std::cout << caus.toText();
        if (!causOk) return 1;

        // ---- IR + optimization ----
        TacProgram tac = generateTac(prog, sema.result(), caus.result());
        TacProgram initial = tac;
        OptReport rep = optimize(tac, opt.opt);
        Layout lay = computeLayout(tac, caus.result());
        Json tj = Json::object();
        tj.set("initial", programJson(initial));
        tj.set("passes", optJson(rep));
        tj.set("final", programJson(tac));
        tj.set("initialCount", static_cast<long>(initial.instrCount()));
        tj.set("finalCount", static_cast<long>(tac.instrCount()));
        tj.set("maxSweeps", rep.maxSweeps);
        dump.set("layout", lay.toJson());
        dump.set("tac", tj);
        if (opt.dumpTac) {
            std::cout << optText(rep, initial);
            std::cout << "== final TAC (" << tac.instrCount() << " instructions) ==\n" << programText(tac);
        }
        if (opt.dumpLayout) std::cout << lay.toText();

        Json cfgBlocks = Json::array();
        int base = 0;
        for (auto& fn : tac.funcs) {
            CFG g = buildCFG(fn);
            Json bj = cfgJson(fn, g, tac, base);
            for (const Json& b : bj.items()) cfgBlocks.push(b);
            base += static_cast<int>(g.blocks.size());
            if (opt.dumpCfg) std::cout << cfgText(fn, g, tac);
        }
        Json cj = Json::object();
        cj.set("blocks", cfgBlocks);
        dump.set("cfg", cj);

        if (!opt.interpretCsv.empty()) {
            std::vector<BarData> bars;
            std::string err;
            if (!readCsv(opt.interpretCsv, bars, err)) {
                std::fprintf(stderr, "qsc: %s\n", err.c_str());
                return 2;
            }
            Interpreter in(tac, lay);
            std::vector<std::string> trace;
            auto orders = in.run(bars, opt.traceFile.empty() ? nullptr : &trace);
            for (auto& o : orders) std::cout << orderText(o) << "\n";
            if (!opt.traceFile.empty()) {
                std::string t;
                for (auto& l : trace) t += l + "\n";
                if (!writeFile(opt.traceFile, t)) {
                    std::fprintf(stderr, "qsc: cannot write %s\n", opt.traceFile.c_str());
                    return 2;
                }
            }
        }

        // ---- register allocation + C++ ----
        RegAllocResult ra = allocateRegisters(tac, opt.regs, std::min(4, opt.regs));
        dump.set("regalloc", ra.json);
        if (opt.dumpIg) std::cout << ra.text;
        CodegenOptions co;
        co.strongTypes = opt.strongTypes;
        co.asserts = opt.asserts;
        co.optLevel = opt.opt;
        co.sourceName = baseName(opt.input);
        std::string hdr = generateHeader(tac, ra, lay, sema.result(), prog, co);
        dump.set("cpp", hdr);
        if (opt.interpretCsv.empty()) {
            ::mkdir(opt.outDir.c_str(), 0755);
            std::string dir = opt.outDir + "/";
            if (!writeFile(dir + tac.strategy + ".hpp", hdr) || !writeFile(dir + "main.cpp", generateMain(tac.strategy)) ||
                !writeFile(dir + "harness.hpp", kHarnessSource)) {
                std::fprintf(stderr, "qsc: cannot write to %s\n", opt.outDir.c_str());
                return 2;
            }
        }
        return 0;
    }

    void finish() {
        dump.set("diagnostics", diag.toJson());
        if (opt.jsonDiag) std::cerr << diag.toJson().dump(2) << "\n";
        else diag.print(std::cerr, !opt.noColor && isatty(2));
        if (!opt.jsonFile.empty() && !writeFile(opt.jsonFile, dump.dump(1) + "\n"))
            std::fprintf(stderr, "qsc: cannot write %s\n", opt.jsonFile.c_str());
    }

    Options opt;
    std::string src;
    DiagEngine diag;
    AstArena arena;
    SymTab symtab;
    Json dump;
};

}  // namespace

int main(int argc, char** argv) {
    for (int i = 1; i < argc; ++i) {
        std::string a = argv[i];
        if (a == "--help" || a == "-h") { usage(stdout); return 0; }
        if (a == "--version") { std::printf("qsc (QuantScript) %s\n", kVersion); return 0; }
        if (a == "--classify") {
            // Hidden test hook (M2): classify each stdin line with the Flex scanner.
            std::string line;
            while (std::getline(std::cin, line)) std::printf("%s\n", classifyWithFlex(line).c_str());
            return 0;
        }
    }
    Options o;
    if (!parseArgs(argc, argv, o)) return 2;
    Driver d(o);
    return d.run();
}
