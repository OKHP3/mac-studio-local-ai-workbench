---
title: "Architecture Diagrams"
artifact_type: "diagram_collection"
created_date: "2026-05-30"
project: "Mac Studio Local AI Workbench"
status: "canonical"
---

# Architecture Diagrams

Three views of the same system. Each diagram tells a different story.

Validated in Mermaid Chart Enterprise — 2026-05-30.

---

## Diagram 1 — Flowchart

How work moves through the system. Jamie at the top, the full Council of AIs across paid frontier, execution, and free tiers, the local Mac Studio stack in the middle, and the publishing pipeline at the bottom. Token routing hierarchy shown explicitly — Larry at zero cost, Replit as the last resort.

```mermaid
flowchart TD
    JAMIE(["Jamie\nOrchestrator"])

    subgraph PAID_FRONTIER["Paid Frontier Tier"]
        CLAUDE["Claude Pro\nInstitutional Memory + MCP Hub"]
        CHATGPT["ChatGPT Plus\nGitHub Execution + Ideation"]
        PERPLEXITY["Perplexity Pro\nCitation Research"]
        COPILOT_PRO["Copilot Pro\nM365 Ecosystem"]
    end

    subgraph EXEC_TIER["Execution Tier"]
        REPLIT["Replit Core\nBuild Engine\nSpec-Grade Only"]
        GH_COPILOT["GitHub Copilot\nCode Review + Pre-filter"]
        NOTION["Notion Business\nWorking Canon + Documentarian"]
    end

    subgraph FREE_TIER["Free Access Tier"]
        GEMINI["Gemini\nGoogle Ecosystem"]
        GROK["Grok\nReal-time Web"]
        MISTRAL["Mistral\nEU Open Weight"]
    end

    subgraph MAC["Mac Studio M4 Max — 36GB · 512GB + 1TB OKH-Local"]
        subgraph AGENT["Agent Layer"]
            LARRY["Larry / OpenClaw\nPort 18789 · gemma3:27b"]
            SEARXNG["SearXNG\nPort 8888"]
        end

        subgraph INFERENCE["Inference Layer"]
            OLLAMA["Ollama 0.23.1\nPort 11434 · 6 Models"]
            LMSTUDIO["LM Studio 0.4.12\nPort 1234 · 22 Models"]
            MLX["mlx-lm 0.31.3\n139 tok/s"]
        end

        subgraph INTERFACES["Interface + Vector Layer"]
            OPENWEBUI["Open WebUI · Port 3000"]
            QDRANT["Qdrant · Port 6333"]
        end

        STORAGE[("OKH-Local\n~272GB Models + Vector Index")]
    end

    subgraph TOKEN_FLOW["Token Routing — Cheapest First"]
        T1["1 Larry · Local · $0"]
        T2["2 Notion AI · ~$0"]
        T3["3 Free Tier · $0"]
        T4["4 Claude / ChatGPT Base"]
        T5["5 Perplexity / Copilot · Expiring Capacity"]
        T6["6 Replit · Most Expensive · Spec Must Be Locked"]
        T1 --> T2 --> T3 --> T4 --> T5 --> T6
    end

    subgraph PUBLISH["Publishing Layer"]
        GH_REPO["GitHub\nArtifact Repo"]
        WEBSITE["overkillhill.com"]
    end

    JAMIE --> PAID_FRONTIER
    JAMIE --> EXEC_TIER
    JAMIE --> FREE_TIER
    JAMIE --> MAC

    LARRY --> OLLAMA
    LARRY --> SEARXNG
    OPENWEBUI --> OLLAMA
    OPENWEBUI --> QDRANT
    OLLAMA --- STORAGE
    LMSTUDIO --- STORAGE
    QDRANT --- STORAGE

    REPLIT -->|commits| GH_REPO
    GH_REPO -->|deploys| WEBSITE
```

---

## Diagram 2 — Mind Map

The full scope of the stack as a mind map. Everything radiates outward from the Mac Studio M4 Max core — hardware, inference runtimes, 29 local models, running services, the complete Council of AIs (paid and free tiers), token routing hierarchy, and publishing layer.

```mermaid
mindmap
  root((Mac Studio M4 Max 36GB))
    Hardware
      Apple M4 Max SoC
        36GB Unified Memory
        512GB Internal SSD
      OKH-Local 1TB NVMe
        WD Black SN7100
        Satechi Stand Hub
      Peripherals
        Dell 34in Widescreen
        KVM Switch
    Inference Runtimes
      Ollama 0.23.1
        6 Models Port 11434
        MLX Accelerated
      LM Studio 0.4.12
        22 Models Port 1234
        MLX v1.8.5
      mlx-lm 0.31.3
        139 tok per second
    Local Models 29 Total
      Ollama 6
        gemma3 27b Quality
        phi4 14b Speed
        codestral 22b Code
        gemma3 12b General
        mistral-small 24b
        llama3.1 8b Light
      LM Studio 22
        Gemma4 GGUF x3
        MLX Models x19
      mlx-lm 1
        Phi-4-mini 4bit
    Local Services
      Larry OpenClaw
        Port 18789
        28 Skills
        gemma3 27b
      Open WebUI
        Port 3000 Docker
      Qdrant
        Port 6333 Docker
      SearXNG
        Port 8888 Docker
    Council of AIs Paid
      Claude Pro
        Memory and MCP Hub
      ChatGPT Plus
        GitHub and Ideation
      Perplexity Pro
        Citation Research
      Copilot Pro
        M365 Ecosystem
      GitHub Copilot
        Code Review
      Notion Business
        Working Canon
      Replit Core
        Build Engine Last
    Council of AIs Free
      Gemini
        Google Ecosystem
      Grok
        Real-time Web
      Mistral
        EU Open Weight
    Token Routing Cheapest First
      Larry Local Zero Cost
      Notion AI Near Zero
      Free Tier Zero Cost
      Claude ChatGPT Base
      Perplexity Copilot Expiring
      Replit Last Resort
    Publishing
      overkillhill.com
      GitHub OKHP3
      Notion Master Truth
```

---

## Diagram 3 — Architecture (C4-style)

Structural view using Mermaid's `architecture-beta` format. Shows physical and logical groupings as bounded containers — OKH-Local NVMe, Docker Runtime, Ollama Runtime, MCP Layer, and all four cloud tiers (paid, execution, free access) — with services connected by dependency lines.

Note: `architecture-beta` group labels use square brackets, not parentheses.

```mermaid
architecture-beta
    group mac_studio["Mac Studio M4 Max — 36GB · macOS Sequoia"]
    group okhlocal["OKH-Local 1TB NVMe"] in mac_studio
    group docker_runtime["Docker Runtime"] in mac_studio
    group ollama_runtime["Ollama Runtime"] in mac_studio
    group mcp_layer["MCP Layer — 11 Servers"] in mac_studio
    group cloud_paid["Paid Cloud Tier"]
    group cloud_exec["Execution Tier"]
    group cloud_free["Free Access Tier"]

    service soc(server)["M4 Max SoC\n36GB Unified Memory\nMLX Accelerated"] in mac_studio
    service nvm(disk)["WD Black SN7100\n1TB NVMe"] in okhlocal
    service model_store(database)["Model Weights\n~272GB · 29 Models"] in okhlocal
    service qdrant_store(database)["Qdrant Storage\nVector Index"] in okhlocal
    service ollama(server)["Ollama 0.23.1\nPort 11434 · 6 Models"] in ollama_runtime
    service lmstudio(server)["LM Studio 0.4.12\nPort 1234 · 22 Models"] in mac_studio
    service mlx(server)["mlx-lm 0.31.3\n139 tok/s"] in mac_studio
    service openwebui(internet)["Open WebUI\nPort 3000"] in docker_runtime
    service qdrant(database)["Qdrant 1.18.1\nPort 6333"] in docker_runtime
    service searxng(internet)["SearXNG\nPort 8888"] in docker_runtime
    service larry(server)["Larry / OpenClaw\nPort 18789 · 28 Skills"] in mac_studio
    service claude_desktop(internet)["Claude Desktop\n11 MCP Servers"] in mcp_layer
    service vscode(internet)["VSCode 1.119\nContinue.dev"] in mac_studio
    service claude_pro(internet)["Claude Pro\nMemory + MCP Hub"] in cloud_paid
    service chatgpt(internet)["ChatGPT Plus\nGitHub + Ideation"] in cloud_paid
    service perplexity(internet)["Perplexity Pro\nCitation Research"] in cloud_paid
    service copilot_pro(internet)["Copilot Pro\nM365 Ecosystem"] in cloud_paid
    service replit(server)["Replit Core\nBuild Engine"] in cloud_exec
    service gh_copilot(internet)["GitHub Copilot\nCode Review"] in cloud_exec
    service notion(internet)["Notion Business\nWorking Canon"] in cloud_exec
    service gemini(internet)["Gemini\nGoogle"] in cloud_free
    service grok(internet)["Grok\nReal-time"] in cloud_free
    service mistral_free(internet)["Mistral\nEU Open Weight"] in cloud_free

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

---

## Notes

- All diagrams validated in Mermaid Chart Enterprise, 2026-05-30
- `architecture-beta` group labels require square brackets (`["label"]`), not parentheses
- Flowchart and mind map use standard syntax compatible with all Mermaid renderers
- Full Council of AIs reflected: paid frontier (Claude Pro, ChatGPT Plus, Perplexity Pro, Copilot Pro), execution tier (Replit Core, GitHub Copilot, Notion Business), free access (Gemini, Grok, Mistral), and local zero-cost (Larry / OpenClaw)
