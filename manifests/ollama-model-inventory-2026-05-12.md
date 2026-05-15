---
title: "Ollama Model Inventory"
artifact_type: "model_manifest"
created_date: "2026-05-12"
project: "Mac Studio Local AI Workbench"
inventory_date: "2026-05-12"
status: "baseline"
---

# Ollama Model Inventory — 2026-05-12

Generated from: `ollama list`

| NAME | ID | SIZE | MODIFIED |
|---|---|---:|---|
| llama3.1:8b | 46e0c10c039e | 4.9 GB | 5 days ago |
| mistral-small3.1:24b | b9aaf0c2586a | 15 GB | 7 minutes ago |
| codestral:22b | 0898a8b286d5 | 12 GB | 25 hours ago |
| gemma3:27b | a418f5838eaf | 17 GB | 32 hours ago |
| gemma3:12b | f4031aab637d | 8.1 GB | 32 hours ago |
| phi4:14b | ac896e5b8b34 | 9.1 GB | 33 hours ago |

**Total:** 66.1 GB

**Storage path:** `/Volumes/OKH-Local/07_Local_LLMs/ollama/models`

**Removed before baseline:** `llama3.3:70b` (42 GB) — exceeded 36GB memory ceiling, caused system freeze.

## Service status at baseline

- Ollama version: 0.23.1
- Service manager: Homebrew, starts at login
- Flash Attention: enabled (`OLLAMA_FLASH_ATTENTION=1`)
- KV cache type: q8_0 (`OLLAMA_KV_CACHE_TYPE=q8_0`)
- API endpoint: `http://localhost:11434`
