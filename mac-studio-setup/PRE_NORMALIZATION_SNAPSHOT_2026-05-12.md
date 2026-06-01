---
title: "Pre-Normalization Snapshot"
artifact_type: "setup_snapshot"
created_date: "2026-05-12"
machine: "OverKill-Hills-Mac-Studio"
status: "pre_normalization"
---

# Pre-Normalization Snapshot

## PATH

```
/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/opt/pkg/env/active/bin:/opt/pmk/env/global/bin:/Users/okh/.lmstudio/bin
```

## zprofile

```bash
eval "$(/opt/homebrew/bin/brew shellenv zsh)"
export OLLAMA_MODELS="/Volumes/OKH-Local/ollama/models"
export OLLAMA_FLASH_ATTENTION="1"
export OLLAMA_KV_CACHE_TYPE="q8_0"
alias okhp3="cd ~/OneDrive/Documents/OverKill\ Hill\ P³\ \(Protocol-Driven\ Power\ Prompts\)"

# OKHP3 Local AI cache paths
export HF_HOME="/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache"
export HUGGINGFACE_HUB_CACHE="/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache/hub"
```

## Model storage before normalization

- LM Studio root store:  27G	/Volumes/OKH-Local/lm-studio
- Ollama root store:  63G	/Volumes/OKH-Local/ollama
- Hugging Face internal cache: 2.0G	/Users/okh/.cache/huggingface
- Hugging Face external cache:   0B	/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache

## Brew formulae

```
ada-url
bat
brotli
c-ares
ca-certificates
fd
fmt
fzf
gettext
gh
git
hdrhistogram_c
icu4c@78
libgit2
libidn2
libnghttp2
libnghttp3
libngtcp2
libssh2
libunistring
libuv
llhttp
lz4
merve
mlx
mlx-c
mpdecimal
nbytes
node
ollama
oniguruma
openssl@3
pcre2
pnpm
python@3.14
readline
ripgrep
simdjson
simdutf
sqlite
tree
uvwasi
wget
xz
yq
zstd
```

## Brew casks

```
docker-desktop
lm-studio
microsoft-edge
onedrive
visual-studio-code
```
