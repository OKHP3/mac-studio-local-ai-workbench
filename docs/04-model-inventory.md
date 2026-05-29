---
title: "Model Inventory"
artifact_type: "model_inventory"
created_date: "2026-05-13"
updated_date: "2026-05-28"
project: "Mac Studio Local AI Workbench"
status: "baseline-plus-agent"
---

# Model Inventory

## Baseline date: 2026-05-12 | Agent added: 2026-05-28

## Ollama models

| Model | Size | Runtime | Daily driver | Role |
|---|---:|---|---|---|
| `phi4:14b` | 9.1 GB | Ollama | ✅ Primary | Fast reasoning, instruction following |
| `gemma3:12b` | 8.1 GB | Ollama | — | General purpose, mid-tier |
| `gemma3:27b` | 17 GB | Ollama | ✅ Quality / ✅ Agent | Flagship general, heavy reasoning. **Also the OpenClaw primary model.** |
| `codestral:22b` | 12 GB | Ollama | ✅ Code | Code generation, Continue.dev autocomplete |
| `mistral-small3.1:24b` | 15 GB | Ollama | — | General purpose, fast |
| `llama3.1:8b` | 4.9 GB | Ollama | — | Lightweight utility, bulk tasks |

**Total Ollama footprint:** ~66 GB

**Storage path:** `/Volumes/OKH-Local/07_Local_LLMs/ollama/models`

**Service:** Homebrew background service, starts at login

**Performance flags:** `OLLAMA_FLASH_ATTENTION=1`, `OLLAMA_KV_CACHE_TYPE=q8_0`

### Why gemma3:27b is the OpenClaw primary model

OpenClaw loads the full agent workspace (AGENTS.md, SOUL.md, MEMORY.md, IDENTITY.md, TOOLS.md) as system prompt at session start — approximately 12-13k tokens before any conversation begins. phi4:14b's 16k context window overflows immediately. gemma3:27b handles the same load at under 10% of its 131k context window.

This is an architectural constraint of OpenClaw, not a model deficiency. Any Ollama model with a context window under ~20k is unusable as an OpenClaw primary on this workspace configuration.

## LM Studio models

| Model | Format | Size | Capability |
|---|---|---:|---|
| `gemma-4-E4B-it` | GGUF Q4_K_M | 6.33 GB | Multimodal image input, Mixture of Experts |
| `gemma-4-E2B-it` | GGUF | ~5 GB | Ultra-light, fastest responses |
| `gemma-4-26B-A4B-it` | GGUF | ~16 GB | MoE, only 4B params active per token |

**Storage path:** `/Volumes/OKH-Local/07_Local_LLMs/lm-studio/models`

**Server port:** 1234, OpenAI-compatible API

**Backend:** LM Studio MLX v1.6.0, auto-detected on Apple Silicon

Note on MoE models: Mixture of Experts architecture activates only a subset of parameters per inference pass. A `26B A4B` model has 26 billion total parameters but only 4 billion are active at a time, giving large-model knowledge at small-model memory and compute cost.

## MLX direct inference

| Model | Format | Size | Throughput |
|---|---|---:|---:|
| Phi-4-mini-instruct-4bit | MLX 4-bit | 2.18 GB | 139 tok/s |

**Cache path:** `/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache`

**Source:** `mlx-community/Phi-4-mini-instruct-4bit`

**Run command:** `mlx_lm.generate --model mlx-community/Phi-4-mini-instruct-4bit --prompt "your prompt" --max-tokens 500`

**Performance context:** 139 tok/s via direct MLX inference vs ~35 tok/s for the same model via Ollama. MLX operates directly on Apple Silicon's unified memory without abstraction layers.

## Model selection policy

**Western-lab models only:** Meta, Google, Mistral, Microsoft.

Chinese cloud AI services operate under PRC data law. This setup maintains a clean Western-only boundary for simplicity of reasoning and defensibility.

Note: open-weight models from any lab are architecturally isolated once downloaded; weights are inert files with no network access. The policy applies to cloud-connected services, not to the nature of the weights themselves. If your threat model differs, Qwen2.5-Coder 32B and DeepSeek are technically strong alternatives.

## Removed models

| Model | Size | Reason |
|---|---:|---|
| `llama3.3:70b` | 42 GB | Exceeds 36GB unified memory ceiling with applications running. Caused system freeze requiring hard restart. |
| `gemma-4-31B-it` | ~87 GB reported | LM Studio guardrails rejected load at default quantization. Incompatible with 36GB system. |

## Memory ceiling rule

**36GB unified memory.** Practical safe ceiling for model weights with normal application load: **~22GB**.

Context: macOS baseline overhead ~4-6GB, Docker + Open WebUI ~500MB, active apps ~1-2GB, KV cache during inference ~2-3GB. That leaves ~22GB for model weights before instability risk.

Models over 20GB should only be loaded when other heavy applications are closed first.

## Routing logic

```text
Fast task, no code        → phi4:14b
Heavy reasoning           → gemma3:27b
Code / autocomplete       → codestral:22b
Bulk / lightweight        → llama3.1:8b
Image analysis            → gemma-4-E4B-it (LM Studio)
Max throughput            → Phi-4-mini-instruct-4bit (mlx-lm direct)
OpenClaw agent (Larry)    → gemma3:27b (131k context, required for workspace overhead)
```
