#!/usr/bin/env bash
# Entry point for `make test`: runs every §14 category and prints a pass/fail table.
set -u
cd "$(dirname "$0")/.."
exec python3 tests/run_tests.py "$@"
