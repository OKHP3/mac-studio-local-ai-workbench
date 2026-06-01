#!/usr/bin/env bash
set -euo pipefail

SETUP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Starting Mac Studio baseline restore from:"
echo "$SETUP_DIR"
echo

echo "Updating Homebrew..."
brew update

echo
echo "Installing manual formulae..."
xargs brew install < "$SETUP_DIR/brew-formulae.manual.txt"

echo
echo "Installing manual casks..."
xargs brew install --cask < "$SETUP_DIR/brew-casks.manual.txt"

echo
echo "Starting Ollama service..."
brew services start ollama || true

echo
echo "Restore complete."
