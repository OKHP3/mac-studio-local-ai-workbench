#!/usr/bin/env bash
set -euo pipefail

SETUP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SETUP_DIR/.." && pwd)"

FORMULAE_FILE="$REPO_ROOT/manifests/brew-formulae.manual.txt"
CASKS_FILE="$REPO_ROOT/manifests/brew-casks.manual.txt"
LOCAL_AI_VOLUME="${LOCAL_AI_VOLUME:-${OKH_LOCAL_VOLUME:-/Volumes/OKH-Local}}"
LOCAL_LLMS_DIR="$LOCAL_AI_VOLUME/07_Local_LLMs"

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
echo "LOCAL_AI_VOLUME=$LOCAL_AI_VOLUME"
echo "OLLAMA_MODELS=${OLLAMA_MODELS:-unset}"
echo "HF_HOME=${HF_HOME:-unset}"
echo "HUGGINGFACE_HUB_CACHE=${HUGGINGFACE_HUB_CACHE:-unset}"

echo
echo "===== VERIFY SYMLINKS ====="
if [[ -d "$LOCAL_AI_VOLUME" ]]; then
  ls -la "$LOCAL_AI_VOLUME" | grep -E 'ollama|lm-studio' || true
else
  echo "Missing local AI volume: $LOCAL_AI_VOLUME"
fi

echo
echo "===== VERIFY LOCAL AI STORAGE SIZES ====="
du -sh "$LOCAL_LLMS_DIR/ollama/models" 2>/dev/null || echo "Missing Ollama model path"
du -sh "$LOCAL_LLMS_DIR/lm-studio/models" 2>/dev/null || echo "Missing LM Studio model path"
du -sh "$LOCAL_LLMS_DIR/huggingface-cache" 2>/dev/null || echo "Missing Hugging Face cache path"

echo
echo "===== VERIFY OLLAMA ====="
brew services list | grep ollama || true
ollama list || true

echo
echo "===== VERIFY OPEN WEBUI CONTAINER ====="
docker ps --filter name=open-webui --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' || true

echo
echo "Verification complete."
