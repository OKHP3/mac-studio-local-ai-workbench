---
title: "Architecture Diagram — Flowchart"
artifact_type: "diagram"
created_date: "2026-05-30"
project: "Mac Studio Local AI Workbench"
diagram_type: "flowchart"
status: "canonical"
---

# Mac Studio Local AI Workbench — Flowchart

Shows how work moves through the full system: from Jamie as orchestrator, through the tiered Council of AIs, into the local Mac Studio stack, and out through the publishing pipeline.

```mermaid
flowchart TD
    JAMIE(["👤 Jamie\nOrchestrator"])

    subgraph PAID_FRONTIER["💳 Paid Frontier Tier"]
        CLAUDE["🟠 Claude Pro\nInstitutional Memory\n+ MCP Hub"]
        CHATGPT["🟢 ChatGPT Plus\nGitHub Execution\n+ Ideation"]
        PERPLEXITY["🔵 Perplexity Pro\nCitation Research"]
        COPILOT_PRO["🟣 Copilot Pro\nM365 Ecosystem"]
    end

    subgraph EXEC_TIER["⚙️ Execution Tier"]
        REPLIT["🔴 Replit Core\nBuild Engine\nSpec-Grade Only"]
        GH_COPILOT["🐙 GitHub Copilot\nCode Review\nPre-filter"]
        NOTION["📝 Notion Business\nWorking Canon\nDocumentarian"]
    end

    subgraph FREE_TIER["🆓 Free Access Tier"]
        GEMINI["✨ Gemini\nGoogle Ecosystem"]
        GROK["⚡ Grok\nReal-time Web"]
        MISTRAL["💫 Mistral\nOpen Weight\nEU-based"]
    end

    subgraph MAC["🖥️ Mac Studio M4 Max — 36GB · 512GB + 1TB OKH-Local"]
        subgraph AGENT["🦞 Agent Layer"]
            LARRY["Larry / OpenClaw\nPort 18789\ngemma3:27b"]
            SEARXNG["SearXNG\nPort 8888"]
        end

        subgraph INFERENCE["⚡ Inference Layer"]
            OLLAMA["Ollama 0.23.1\nPort 11434 · 6 Models"]
            LMSTUDIO["LM Studio 0.4.12\nPort 1234 · 22 Models"]
            MLX["mlx-lm 0.31.3\n139 tok/s"]
        end

        subgraph INTERFACES["💬 Interface + Vector Layer"]
            OPENWEBUI["Open WebUI · Port 3000"]
            QDRANT["Qdrant · Port 6333"]
        end

        STORAGE[("OKH-Local\n~272GB Models\n+ Vector Index")]
    end

    subgraph TOKEN_FLOW["💰 Token Routing — Cheapest First"]
        T1["1️⃣ Larry · Local · $0"]
        T2["2️⃣ Notion AI · ~$0"]
        T3["3️⃣ Free Tier · $0"]
        T4["4️⃣ Claude / ChatGPT Base"]
        T5["5️⃣ Perplexity / Copilot\nExpiring Capacity"]
        T6["6️⃣ Replit · Most Expensive\nSpec Must Be Locked"]
        T1 --> T2 --> T3 --> T4 --> T5 --> T6
    end

    subgraph PUBLISH["📤 Publishing Layer"]
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

    classDef paid fill:#2d4a7a,stroke:#4a7ac8,color:#fff
    classDef exec fill:#3a2d4a,stroke:#7a4ac8,color:#fff
    classDef free fill:#2a3d2a,stroke:#4a8a4a,color:#fff
    classDef agent fill:#5a2a2a,stroke:#c84a4a,color:#fff
    classDef local fill:#2a3d3a,stroke:#4a8a7a,color:#fff
    classDef storage fill:#3a3a2a,stroke:#a0a04a,color:#fff
    classDef publish fill:#2a3a4a,stroke:#4a7aaa,color:#fff
    classDef jamie fill:#FF3C00,stroke:#cc2e00,color:#fff

    class CLAUDE,CHATGPT,PERPLEXITY,COPILOT_PRO paid
    class REPLIT,GH_COPILOT,NOTION exec
    class GEMINI,GROK,MISTRAL free
    class LARRY,SEARXNG agent
    class OLLAMA,LMSTUDIO,MLX,OPENWEBUI,QDRANT local
    class STORAGE storage
    class GH_REPO,WEBSITE publish
    class JAMIE jamie
```
