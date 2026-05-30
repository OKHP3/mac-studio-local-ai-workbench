---
title: "Build Your Own Local AI Workbench"
artifact_type: "resource_guide"
created_date: "2026-05-28"
project: "Mac Studio Local AI Workbench"
status: "canonical"
---

# Build Your Own Local AI Workbench

Everything you need to replicate this setup. Hardware, software, subscriptions, and the reasoning behind each choice.

Total hardware cost at time of build: approximately $2,250.
Total software cost: $0 — every tool is open-source, free, or covered by existing subscriptions.

---

## Hardware

### The machine

| Component | What was used | Where to get it | Notes |
|---|---|---|---|
| Mac Studio M4 Max | Mac Studio M4 Max, 36GB, 512GB | [apple.com/mac-studio](https://www.apple.com/mac-studio/) | 36GB is the minimum for running 20B+ models alongside apps. 48GB gives more headroom. M4 Max preferred over M4 Pro for memory bandwidth. |
| External NVMe | WD Black SN7100 1TB | [Best Buy](https://www.bestbuy.com) / [Amazon](https://www.amazon.com) / [B&H](https://www.bhphotovideo.com) | Models and cache live here, not on the internal SSD. Keeps the OS drive clean. 1TB is tight — 2TB recommended if budget allows. |
| NVMe enclosure | Satechi Stand Hub (USB4 / USB-C) | [satechi.net](https://satechi.net) | Sits under the Mac Studio, looks native. Delivers ~900-1000 MB/s — fast enough for model loading. |

### Why Apple Silicon specifically

Apple Silicon's unified memory architecture is the reason local AI works well on Mac. The CPU, GPU, and Neural Engine share the same memory pool. A 36GB M4 Max can run models that would require a 48GB discrete GPU on any other platform, because there's no VRAM ceiling.

MLX — Apple's native ML framework — runs inference directly on this unified memory without abstraction overhead. Throughput is approximately 4x faster than llama.cpp for compatible models.

---

## Inference stack

### Ollama

**What it is:** The primary local model inference server. Runs as a Homebrew background service. Exposes an OpenAI-compatible API on port 11434.

**Install:**
```bash
brew install ollama
```

**Get it:** [ollama.com](https://ollama.com)

**Models pulled in this build:**

| Model | Size | Role |
|---|---|---|
| phi4:14b | 9.1 GB | Fast reasoning, daily driver |
| gemma3:12b | 8.1 GB | General purpose |
| gemma3:27b | 17 GB | Quality daily driver |
| codestral:22b | 12 GB | Code generation |
| mistral-small3.1:24b | 15 GB | General purpose |
| llama3.1:8b | 4.9 GB | Lightweight utility |

**Performance flags (add to `~/.zprofile` and Homebrew plist):**
```bash
export OLLAMA_MODELS="/Volumes/OKH-Local/07_Local_LLMs/ollama/models"
export OLLAMA_FLASH_ATTENTION="1"
export OLLAMA_KV_CACHE_TYPE="q8_0"
```

**Critical:** The Homebrew launchd service does not inherit shell environment variables. Add the same variables directly to the Homebrew plist at `/opt/homebrew/opt/ollama/homebrew.mxcl.ollama.plist`.

---

### LM Studio

**What it is:** Desktop GUI for downloading, managing, and running local models. Also runs a local API server on port 1234. Uses the MLX backend automatically on Apple Silicon.

**Install:** `brew install --cask lm-studio` or download from [lmstudio.ai](https://lmstudio.ai)

**Models in this build:**
- gemma-4-E4B-it (GGUF Q4_K_M, 6.33GB) — multimodal, Mixture of Experts
- gemma-4-E2B-it (GGUF, ~5GB) — ultra-light
- gemma-4-26B-A4B-it (GGUF, ~16GB) — MoE, large knowledge at low memory cost

**Notes:**
- Move the LM Studio server port to 1234. Default is 11434, which conflicts with Ollama.
- Set model loading guardrails to Balanced to prevent loading models that exceed your memory ceiling.
- Point the models directory to your external NVMe, not the internal SSD.

---

### mlx-lm

**What it is:** Direct Python inference using Apple's MLX framework. Bypasses Ollama's abstraction layer. Approximately 4x faster throughput for compatible models.

**Install:**
```bash
pip3 install mlx-lm --break-system-packages
```

**Benchmark result:** 139 tok/s on Phi-4-mini-instruct-4bit (vs ~35 tok/s via Ollama for the same model).

**Use for:** Maximum throughput inference, MLX-format models from HuggingFace.

---

## Chat interface

### Open WebUI

**What it is:** Browser-based chat interface over Ollama. Runs in Docker. Supports multiple models, document upload, knowledge bases, and tool use.

**Requires:** Docker Desktop — [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)

**Install:**
```bash
docker run -d \\
  -p 3000:8080 \\
  --add-host=host.docker.internal:host-gateway \\
  -v open-webui:/app/backend/data \\
  --name open-webui \\
  --restart always \\
  ghcr.io/open-webui/open-webui:main
```

**Access:** `http://localhost:3000`

**Get it:** [openwebui.com](https://openwebui.com)

**Update command** (recreate container to pick up new image):
```bash
docker pull ghcr.io/open-webui/open-webui:main
docker stop open-webui && docker rm open-webui
docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway \\
  -v open-webui:/app/backend/data --name open-webui --restart always \\
  ghcr.io/open-webui/open-webui:main
```

---

## Autonomous agent layer

### OpenClaw

**What it is:** Local AI agent runtime. Runs as a LaunchAgent daemon. Not a chat interface — an autonomous agent that works in the background, executes tasks, maintains persistent memory, and connects local models to system-level capabilities.

**Install:**
```bash
npm install -g openclaw@latest
openclaw setup
openclaw onboard
```

**Get it:** [openclaw.ai](https://openclaw.ai)

**Critical model selection note:** OpenClaw loads all workspace files as system prompt at session start. This consumes approximately 12-13k tokens before any conversation begins. Any model with a context window under ~20k will overflow immediately. Use gemma3:27b (131k) or similar large-context models.

**Skills worth installing during onboard:**
apple-notes, apple-reminders, things-mac, github, gh-issues, notion, tmux, model-usage, nano-pdf, summarize, clawhub, mcporter

**After install, fix binaries:**
```bash
npm install -g clawhub mcporter
```

**Set tools profile to full** (default `coding` profile strips web search):
```bash
openclaw config set tools.profile full
openclaw gateway restart
```

---

### SearXNG (web search for the agent)

**What it is:** Self-hosted privacy-respecting metasearch engine. Gives the agent web search without routing queries through external API services.

**Install:**
```bash
mkdir -p ~/searxng/config ~/searxng/data

docker run --name searxng -d \\
  -p 8888:8080 \\
  -v "$HOME/searxng/config/:/etc/searxng/" \\
  -v "$HOME/searxng/data/:/var/cache/searxng/" \\
  --restart always \\
  docker.io/searxng/searxng:latest
```

**Enable JSON API** (required for OpenClaw):
```bash
cat >> ~/searxng/config/settings.yml << 'EOF'

search:
  formats:
    - html
    - json
EOF

docker restart searxng
```

**Configure in OpenClaw:**
```bash
openclaw configure --section web
# Select SearXNG, enter: http://127.0.0.1:8888
```

**Get it:** [searxng.github.io](https://searxng.github.io/searxng/)

---

## Development tools

### VSCode + Continue.dev

**VSCode:** [code.visualstudio.com](https://code.visualstudio.com) — primary editor. Install via `brew install --cask visual-studio-code`.

**Continue.dev:** Local Copilot-style autocomplete using your Ollama models. Install as VSCode extension. Configure Codestral 22B as the primary autocomplete model.

**Get Continue.dev:** [continue.dev](https://continue.dev)

---

### Claude Desktop + MCP servers

**Claude Desktop:** [claude.ai/download](https://claude.ai/download) — Frontier AI with MCP (Model Context Protocol) orchestration. The hub of the Council of AIs workflow.

**MCP servers to configure:**
- Notion: `npm install -g @notionhq/notion-mcp-server`
- GitHub: Docker image `ghcr.io/github/github-mcp-server`

**Critical:** Claude Desktop launches as a background service and does not inherit shell PATH. Use full binary paths in `claude_desktop_config.json`.

---

## Cloud subscriptions used

None of these are required to run local AI. They are part of the broader Council of AIs workflow.

| Service | Monthly cost | Role |
|---|---|---|
| Claude Pro | $20 | Institutional memory, context hub, prose |
| ChatGPT Plus | $20 | Ideation, GitHub execution, broad generalism |
| GitHub Pro + Copilot | ~$10 | Version control, code review |
| Microsoft 365 + Copilot Pro | ~$30 | M365 ecosystem, OneDrive sync |
| Perplexity Pro | $20 | Citation-grade research |
| Notion Business + AI | ~$16 | Working canon and documentation |
| Replit Core | $25 | Spec-grade code builds |

**Total cloud spend: ~$141/month** for the full Council of AIs stack.

For local AI inference only: $0/month beyond the hardware purchase.

---

## External storage architecture

All AI-related assets live on the external NVMe, not the internal SSD.

```text
/Volumes/OKH-Local/
  07_Local_LLMs/
    ollama/models/          <- Ollama model blobs
    lm-studio/models/       <- LM Studio model files
    huggingface-cache/      <- HuggingFace downloads
    qdrant/                 <- Vector DB (future)
  05_Research_Vault/        <- Baseline archives
  06_RAG_Experiments/       <- Benchmarks and RAG work
  03_Notion_Exports/        <- Periodic workspace exports
```

If the external drive is lost: re-pull models from Ollama registry and HuggingFace. Nothing stored there is irreplaceable.

---

## Memory ceiling rules

36GB unified memory. Practical safe ceiling for model weights with normal application load: **~22GB**.

Breakdown: macOS baseline ~4-6GB, Docker + Open WebUI ~500MB, active apps ~1-2GB, KV cache ~2-3GB. That leaves ~22GB for model weights.

- Under 10GB: always safe (phi4:14b, gemma3:12b, llama3.1:8b)
- 10-20GB: safe with awareness (codestral:22b, mistral-small3.1:24b)
- Over 20GB: close other heavy apps first (gemma3:27b at 17GB is fine; 70B models are not)

---

## Model selection policy

Western-lab models only: Meta, Google, Mistral, Microsoft.

Chinese cloud AI services operate under PRC data law. Open-weight models from any lab are architecturally isolated once downloaded (weights have no network access), but maintaining a clean Western-only boundary is simpler to reason about.

Alternatives if your threat model differs: Qwen2.5-Coder 32B and DeepSeek are technically strong open-weight alternatives.

---

## Minimum viable version

If budget is constrained, this is the minimum viable local AI workbench:

| Component | Minimum | Notes |
|---|---|---|
| Mac | Mac Mini M4 16GB | Limits models to ~8B parameters comfortably |
| External storage | Any USB3 SSD 512GB+ | Slower than NVMe but functional |
| Software | Ollama + Open WebUI | Free, sufficient for most use cases |
| Models | llama3.1:8b + phi4:14b | Both under 10GB, solid capability |

Estimated minimum hardware cost: ~$600-700.

---

## Quick reference — all install commands

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install core tools
brew install ollama git python node gh

# Pull starter models
ollama pull phi4:14b
ollama pull gemma3:27b
ollama pull codestral:22b
ollama pull llama3.1:8b

# Deploy Open WebUI
docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway \\
  -v open-webui:/app/backend/data --name open-webui --restart always \\
  ghcr.io/open-webui/open-webui:main

# Install OpenClaw
npm install -g openclaw@latest
openclaw setup && openclaw onboard

# Deploy SearXNG
docker run --name searxng -d -p 8888:8080 \\
  -v "$HOME/searxng/config/:/etc/searxng/" \\
  -v "$HOME/searxng/data/:/var/cache/searxng/" \\
  --restart always docker.io/searxng/searxng:latest

# Install mlx-lm
pip3 install mlx-lm --break-system-packages

# Verify everything is running
ollama list
curl -s http://localhost:3000 | head -3
openclaw skills check --agent main | grep Eligible
```

---

*Part of the Mac Studio Local AI Workbench project.*

*Public project page: https://overkillhill.com/projects/mac-studio-local-ai-workbench/*

*GitHub artifact repo: https://github.com/OKHP3/mac-studio-local-ai-workbench*
