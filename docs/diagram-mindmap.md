---
title: "Architecture Diagram — Mind Map"
artifact_type: "diagram"
created_date: "2026-05-30"
project: "Mac Studio Local AI Workbench"
diagram_type: "mindmap"
status: "canonical"
---

# Mac Studio Local AI Workbench — Mind Map

Shows how everything radiates outward from the Mac Studio M4 Max core — hardware, runtimes, models, services, the full Council of AIs (paid, execution, and free tiers), token routing hierarchy, and publishing surfaces.

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
