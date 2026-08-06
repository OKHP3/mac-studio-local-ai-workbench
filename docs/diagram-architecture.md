---
title: "Architecture Diagram — System Architecture"
artifact_type: "diagram"
created_date: "2026-05-30"
project: "Mac Studio Local AI Workbench"
diagram_type: "architecture-beta"
status: "canonical"
---

# Mac Studio Local AI Workbench — System Architecture

C4-style structural view using Mermaid architecture-beta format. Shows physical and logical groupings — storage, Docker runtime, Ollama runtime, MCP layer — alongside the full Council of AIs cloud tiers, with dependency connections between services.

```mermaid
architecture-beta
    group mac_studio["🖥️ Mac Studio M4 Max — 36GB · macOS Sequoia"]
    group okhlocal["💾 OKH-Local 1TB NVMe"] in mac_studio
    group docker_runtime["🐳 Docker Runtime"] in mac_studio
    group ollama_runtime["⚡ Ollama Runtime"] in mac_studio
    group mcp_layer["🔌 MCP Layer — 11 Servers"] in mac_studio
    group cloud_paid["💳 Paid Cloud Tier"]
    group cloud_exec["⚙️ Execution Tier"]
    group cloud_free["🆓 Free Access Tier"]

    service soc(server)["M4 Max SoC
    36GB Unified Memory
    MLX Accelerated"] in mac_studio

    service nvm(disk)["WD Black SN7100
    1TB NVMe"] in okhlocal

    service model_store(database)["Model Weights
    ~272GB · 29 Models"] in okhlocal

    service qdrant_store(database)["Qdrant Storage
    Vector Index"] in okhlocal

    service ollama(server)["Ollama 0.23.1
    Port 11434 · 6 Models"] in ollama_runtime

    service lmstudio(server)["LM Studio 0.4.12
    Port 1234 · 22 Models"] in mac_studio

    service mlx(server)["mlx-lm 0.31.3
    139 tok/s"] in mac_studio

    service openwebui(internet)["Open WebUI
    Port 3000"] in docker_runtime

    service qdrant(database)["Qdrant 1.18.1
    Port 6333"] in docker_runtime

    service searxng(internet)["SearXNG
    Port 8888"] in docker_runtime

    service larry(server)["Larry / OpenClaw
    Port 18789 · 28 Skills"] in mac_studio

    service claude_desktop(internet)["Claude Desktop
    11 MCP Servers"] in mcp_layer

    service vscode(internet)["VSCode 1.119
    Continue.dev"] in mac_studio

    service claude_pro(internet)["Claude Pro
    Memory + MCP Hub"] in cloud_paid

    service chatgpt(internet)["ChatGPT Plus
    GitHub + Ideation"] in cloud_paid

    service perplexity(internet)["Perplexity Pro
    Citation Research"] in cloud_paid

    service copilot_pro(internet)["Copilot Pro
    M365 Ecosystem"] in cloud_paid

    service replit(server)["Replit Core
    Build Engine"] in cloud_exec

    service gh_copilot(internet)["GitHub Copilot
    Code Review"] in cloud_exec

    service notion(internet)["Notion Business
    Working Canon"] in cloud_exec

    service gemini(internet)["Gemini
    Google"] in cloud_free

    service grok(internet)["Grok
    Real-time"] in cloud_free

    service mistral_free(internet)["Mistral
    EU Open Weight"] in cloud_free

    soc:R -- L:nvm
    ollama:B -- T:model_store
    lmstudio:B -- T:model_store
    mlx:B -- T:model_store
    qdrant:B -- T:qdrant_store
    openwebui:R -- L:ollama
    openwebui:B -- T:qdrant
    larry:R -- L:ollama
    larry:B -- T:searxng
    vscode:R -- L:ollama
    claude_desktop:B -- T:larry
    claude_pro:R -- L:claude_desktop
    chatgpt:R -- L:replit
    notion:R -- L:replit
```
