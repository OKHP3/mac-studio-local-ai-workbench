#!/usr/bin/env bash
set -euo pipefail

SETUP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SETUP_DIR/.." && pwd)"

FORMULAE_FILE="$REPO_ROOT/manifests/brew-formulae.manual.txt"
CASKS_FILE="$REPO_ROOT/manifests/brew-casks.manual.txt"

echo "Starting Mac Studio baseline restore from repository:"
echo "$REPO_ROOT"
echo

if ! command -v brew >/dev/null 2>&1; then
  echo "ERROR: Homebrew is not installed or not on PATH."
  exit 1
fi

echo "Updating Homebrew..."
brew update

echo
echo "Installing manual formulae..."
xargs brew install < "$FORMULAE_FILE"

echo
echo "Installing manual casks..."
xargs brew install --cask < "$CASKS_FILE"

echo
echo "Starting Ollama service..."
brew services start ollama || true

echo
echo "Restore complete. Run scripts/verify_mac_studio_baseline.sh next."
