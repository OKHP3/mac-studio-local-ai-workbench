---
title: "Model Inventory"
artifact_type: "model_inventory"
created_date: "2026-05-13"
updated_date: "2026-05-29"
project: "Mac Studio Local AI Workbench"
status: "expanded"
---

# Model Inventory

## Last updated: 2026-05-29

Total: **28 models across 3 runtimes, 270GB on disk**

---

## Ollama models (6)

Storage: `/Volumes/OKH-Local/07_Local_LLMs/ollama/models` (~66GB)

| Model | Size | Daily driver | Role |
|---|---:|---|---|
| phi4:14b | 9.1 GB | ✅ Primary | Fast reasoning, instruction following |
| gemma3:12b | 8.1 GB | — | General purpose, mid-tier |
| gemma3:27b | 17 GB | ✅ Quality / ✅ Agent | Flagship general. Also OpenClaw (Larry) primary model. |
| codestral:22b | 12 GB | ✅ Code | Code generation, Continue.dev autocomplete |
| mistral-small3.1:24b | 15 GB | — | General purpose, fast |
| llama3.1:8b | 4.9 GB | — | Lightweight utility, bulk tasks |

**Performance flags:** `OLLAMA_FLASH_ATTENTION=1`, `OLLAMA_KV_CACHE_TYPE=q8_0`

**Why gemma3:27b is the OpenClaw primary:** OpenClaw loads all workspace files as system prompt at session start (~12-13k tokens). phi4:14b's 16k window overflows immediately. gemma3:27b handles it at under 10% of its 131k context window.

---

## LM Studio models (22)

Storage: `/Volumes/OKH-Local/07_Local_LLMs/lm-studio/models/` (~204GB)

Three subdirectories (consolidated 2026-05-29 from scattered root-level folders):

### lmstudio-community/ (GGUF, 27GB)

| Model | Format | Size | Capability |
|---|---|---:|---|
| gemma-4-E4B-it | GGUF Q4_K_M | 6.33 GB | Multimodal image input, Mixture of Experts |
| gemma-4-E2B-it | GGUF Q4_K_M | ~4 GB | Ultra-light, fastest responses |
| gemma-4-26B-A4B-it | GGUF Q4_K_M | ~17 GB | MoE, only 4B params active per token |

### lmstudio-community-mlx/ (MLX, 126GB)

| Model | Size | Notes |
|---|---:|---|
| Olmo-3-32B-Think-MLX-4bit | 18.1 GB | AllenAI reasoning model |
| NVIDIA-Nemotron-3-Nano-30B-A3B-MLX-4bit | 17.8 GB | NVIDIA MoE |
| Mistral-Small-3.2-24B-Instruct-2506-MLX-4bit | 13.5 GB | Mistral Small 3.2 |
| Magistral-Small-2509-MLX-4bit | 14.1 GB | Mistral reasoning |
| Magistral-Small-2506-MLX-4bit | 13.3 GB | Mistral reasoning (earlier) |
| devstral-small-2505-MLX-4bit | 13.3 GB | Mistral coding agent |
| Devstral-Small-2507-MLX-4bit | 13.3 GB | Mistral coding agent (updated) |
| LFM2-24B-A2B-MLX-4bit | 13.4 GB | Liquid AI MoE |
| LFM2-1.2B-MLX-8bit | 1.2 GB | Liquid AI ultra-light |
| LFM2.5-1.2B-Instruct-MLX-8bit | 1.2 GB | Liquid AI ultra-light (v2.5) |
| Phi-4-reasoning-plus-MLX-4bit | 8.3 GB | Microsoft reasoning |
| Phi-4-mini-reasoning-MLX-4bit | 2.2 GB | Microsoft reasoning, compact |
| gemma-3n-E4B-it-MLX-4bit | 5.9 GB | Google Gemma 3n MoE |

### mlx-community/ (MLX, 51GB)

| Model | Size | Notes |
|---|---:|---|
| Devstral-Small-2-24B-Instruct-2512-4bit | 14.1 GB | Mistral coding agent (latest) |
| gemma-3-27b-it-qat-4bit | 16.9 GB | Google Gemma 3 27B |
| gemma-3-12b-it-qat-4bit | 8.1 GB | Google Gemma 3 12B |
| gpt-oss-20b-MXFP4-Q8 | 12.1 GB | OpenAI OSS 20B |
| gemma-3-4b-it-qat-4bit | 3.0 GB | Google Gemma 3 4B |
| gemma-3-1b-it-qat-4bit | 771 MB | Google Gemma 3 1B |

---

## MLX direct inference (1)

Storage: `/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache/` (~2.18GB)

| Model | Size | Throughput |
|---|---:|---:|
| Phi-4-mini-instruct-4bit | 2.18 GB | 139 tok/s |

**Run command:** `mlx_lm.generate --model mlx-community/Phi-4-mini-instruct-4bit --prompt "your prompt" --max-tokens 500`

---

## Storage summary

| Location | Size | Count |
|---|---:|---:|
| Ollama models | ~66 GB | 6 |
| LM Studio GGUF | 27 GB | 3 |
| LM Studio MLX (lmstudio-community-mlx) | 126 GB | 13 |
| LM Studio MLX (mlx-community) | 51 GB | 6 |
| HuggingFace cache (mlx-lm) | 2.18 GB | 1 |
| **Total** | **~272 GB** | **29** |

---

## Storage normalization history

- **2026-05-12:** Initial normalization. Ollama models moved to `/Volumes/OKH-Local/07_Local_LLMs/ollama/models`. LM Studio set to `/Volumes/OKH-Local/07_Local_LLMs/lm-studio/models`.
- **2026-05-29:** LM Studio discovered to be saving newer MLX models outside the `models/` directory (at `/lm-studio/mlx-community/` and `/lm-studio/lmstudio-community/`). Consolidated all three locations into `models/` subdirectories. LM Studio confirmed all 22 models visible after consolidation.

---

## Model selection policy

Western-lab models only: Meta, Google, Mistral, Microsoft, NVIDIA, Liquid AI, AllenAI, OpenAI.

All models in this inventory are from Western labs. Chinese cloud AI services are excluded.

Note: open-weight models from any lab are architecturally isolated once downloaded. The policy applies to cloud-connected services.

---

## Memory ceiling rule

36GB unified memory. Practical safe ceiling with normal application load: ~22GB.

Ollama routing logic:
```text
Fast task, no code        → phi4:14b
Heavy reasoning           → gemma3:27b
Code / autocomplete       → codestral:22b
Bulk / lightweight        → llama3.1:8b
Image analysis            → gemma-4-E4B-it (LM Studio)
Max throughput            → Phi-4-mini-instruct-4bit (mlx-lm direct)
OpenClaw agent (Larry)    → gemma3:27b (131k context required)
```

## Removed models

| Model | Reason |
|---|---|
| llama3.3:70b (42GB) | Caused system freeze. Exceeds 36GB ceiling with apps running. |
| gemma-4-31B-it | LM Studio guardrails rejected at default quantization (~87GB required). |
