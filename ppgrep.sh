function ppgrep() { pgrep "$@" | xargs --no-run-if-empty ps -p; }

ppgrep "$@" 