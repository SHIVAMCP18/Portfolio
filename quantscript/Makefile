# QuantScript build. Targets: all (default), test, bench, serve, clean.
CXX      ?= g++
CXXFLAGS ?= -std=c++17 -O2 -Wall -Wextra
BISON    ?= bison
FLEX     ?= flex
BUILD    := build

SRC      := $(filter-out src/main.cpp,$(wildcard src/*.cpp))
OBJ      := $(patsubst src/%.cpp,$(BUILD)/%.o,$(SRC)) $(BUILD)/parser.tab.o $(BUILD)/lexer.o
GEN      := $(BUILD)/parser.tab.cpp $(BUILD)/parser.tab.hpp $(BUILD)/parser_stats.inc $(BUILD)/harness_embed.inc
INC      := -Isrc -I$(BUILD)

.PHONY: all test bench serve clean examples
all: qsc regex2dfa

qsc: $(BUILD)/main.o $(OBJ)
	$(CXX) $(CXXFLAGS) -o $@ $^

regex2dfa: tools/regex2dfa.cpp $(BUILD)/rdfa.o $(BUILD)/json.o
	$(CXX) $(CXXFLAGS) $(INC) -o $@ $^

$(BUILD):
	@mkdir -p $(BUILD)

$(BUILD)/parser.tab.cpp $(BUILD)/parser.tab.hpp $(BUILD)/parser.output &: src/parser.y | $(BUILD)
	$(BISON) -d -v -Werror=conflicts-sr -Werror=conflicts-rr -o $(BUILD)/parser.tab.cpp src/parser.y

$(BUILD)/parser_stats.inc: $(BUILD)/parser.output tools/parser_stats.awk
	awk -f tools/parser_stats.awk $(BUILD)/parser.output > $@

$(BUILD)/lexer.cpp: src/lexer.l $(BUILD)/parser.tab.hpp | $(BUILD)
	$(FLEX) -o $@ src/lexer.l

# Embed runtime/harness.hpp so generated output directories are self-contained.
$(BUILD)/harness_embed.inc: runtime/harness.hpp | $(BUILD)
	{ printf 'static const char* const kHarnessSource = R"QSHARNESS('; cat runtime/harness.hpp; printf ')QSHARNESS";\n'; } > $@

$(BUILD)/%.o: src/%.cpp $(GEN) $(wildcard src/*.hpp) | $(BUILD)
	$(CXX) $(CXXFLAGS) $(INC) -c -o $@ $<

$(BUILD)/parser.tab.o: $(BUILD)/parser.tab.cpp $(wildcard src/*.hpp)
	$(CXX) $(CXXFLAGS) $(INC) -c -o $@ $<

$(BUILD)/lexer.o: $(BUILD)/lexer.cpp $(BUILD)/parser.tab.hpp $(wildcard src/*.hpp)
	$(CXX) $(CXXFLAGS) $(INC) -c -o $@ $<

test: all
	@bash tests/run_tests.sh

bench: all
	@bash bench/run_bench.sh

serve:
	@echo "Viewer at http://localhost:8000/viewer/index.html"
	python3 -m http.server 8000

# Regenerate the phase dumps bundled with the viewer demo (viewer/samples/samples.js).
examples: all
	@mkdir -p viewer/samples $(BUILD)/samples
	./qsc --dump-json $(BUILD)/samples/zrevert_O2.json -o $(BUILD)/out examples/valid/zrevert.qs
	./qsc -O0 --dump-json $(BUILD)/samples/zrevert_O0.json -o $(BUILD)/out examples/valid/zrevert.qs
	./qsc --dump-json $(BUILD)/samples/channel_O2.json -o $(BUILD)/out examples/valid/channel.qs
	./qsc --regs 2 --dump-json $(BUILD)/samples/vol_target_regs2.json -o $(BUILD)/out examples/valid/vol_target.qs
	./qsc --dump-json $(BUILD)/samples/lookahead_error.json -o $(BUILD)/out examples/invalid/e502_phase_c_series.qs 2>/dev/null || true
	./qsc --dump-json $(BUILD)/samples/type_error.json -o $(BUILD)/out examples/invalid/e401_price_plus_volume.qs 2>/dev/null || true
	python3 tools/make_samples.py viewer/samples/samples.js $(BUILD)/samples/zrevert_O2.json $(BUILD)/samples/zrevert_O0.json \
		$(BUILD)/samples/channel_O2.json $(BUILD)/samples/vol_target_regs2.json $(BUILD)/samples/lookahead_error.json $(BUILD)/samples/type_error.json

clean:
	rm -rf $(BUILD) qsc regex2dfa out
