#!/usr/bin/env bash
set -euo pipefail

SETUP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "===== VERIFY HOMEBREW FORMULAE ====="
while read -r formula; do
  [[ -z "$formula" ]] && continue
  if brew list --formula "$formula" >/dev/null 2>&1; then
    echo "OK formula: $formula"
  else
    echo "MISSING formula: $formula"
  fi
done < "$SETUP_DIR/brew-formulae.manual.txt"

echo
echo "===== VERIFY HOMEBREW CASKS ====="
while read -r cask; do
  [[ -z "$cask" ]] && continue
  if brew list --cask "$cask" >/dev/null 2>&1; then
    echo "OK cask: $cask"
  else
    echo "MISSING cask: $cask"
  fi
done < "$SETUP_DIR/brew-casks.manual.txt"

echo
echo "===== VERIFY LOCAL AI PATHS ====="
echo "OLLAMA_MODELS=${OLLAMA_MODELS:-unset}"
echo "HF_HOME=${HF_HOME:-unset}"
echo "HUGGINGFACE_HUB_CACHE=${HUGGINGFACE_HUB_CACHE:-unset}"

echo
echo "===== VERIFY OLLAMA ====="
brew services list | grep ollama || true
ollama list || true

echo
echo "Verification complete."
