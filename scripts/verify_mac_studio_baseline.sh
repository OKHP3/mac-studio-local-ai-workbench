#!/usr/bin/env bash
set -euo pipefail

SETUP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SETUP_DIR/.." && pwd)"

FORMULAE_FILE="$REPO_ROOT/manifests/brew-formulae.manual.txt"
CASKS_FILE="$REPO_ROOT/manifests/brew-casks.manual.txt"

echo "===== VERIFY HOMEBREW FORMULAE ====="
while read -r formula; do
  [[ -z "$formula" ]] && continue
  if brew list --formula "$formula" >/dev/null 2>&1; then
    echo "OK formula: $formula"
  else
    echo "MISSING formula: $formula"
  fi
done < "$FORMULAE_FILE"

echo
echo "===== VERIFY HOMEBREW CASKS ====="
while read -r cask; do
  [[ -z "$cask" ]] && continue
  if brew list --cask "$cask" >/dev/null 2>&1; then
    echo "OK cask: $cask"
  else
    echo "MISSING cask: $cask"
  fi
done < "$CASKS_FILE"

echo
echo "===== VERIFY LOCAL AI PATHS ====="
echo "OLLAMA_MODELS=${OLLAMA_MODELS:-unset}"
echo "HF_HOME=${HF_HOME:-unset}"
echo "HUGGINGFACE_HUB_CACHE=${HUGGINGFACE_HUB_CACHE:-unset}"

echo
echo "===== VERIFY SYMLINKS ====="
ls -la /Volumes/OKH-Local | grep -E 'ollama|lm-studio' || true

echo
echo "===== VERIFY LOCAL AI STORAGE SIZES ====="
du -sh /Volumes/OKH-Local/07_Local_LLMs/ollama/models 2>/dev/null || echo "Missing Ollama model path"
du -sh /Volumes/OKH-Local/07_Local_LLMs/lm-studio/models 2>/dev/null || echo "Missing LM Studio model path"
du -sh /Volumes/OKH-Local/07_Local_LLMs/huggingface-cache 2>/dev/null || echo "Missing Hugging Face cache path"

echo
echo "===== VERIFY OLLAMA ====="
brew services list | grep ollama || true
ollama list || true

echo
echo "===== VERIFY OPEN WEBUI CONTAINER ====="
docker ps --filter name=open-webui --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' || true

echo
echo "Verification complete."
