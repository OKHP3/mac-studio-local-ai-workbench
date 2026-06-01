---
title: "Final Storage Checkpoint"
artifact_type: "setup_checkpoint"
created_date: "2026-05-12"
machine: "OverKill-Hills-Mac-Studio"
status: "storage_normalized_verified"
---

# Final Storage Checkpoint

## Verified storage state

- Ollama models: `/Volumes/OKH-Local/07_Local_LLMs/ollama/models`
- LM Studio models: `/Volumes/OKH-Local/07_Local_LLMs/lm-studio/models`
- Hugging Face cache: `/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache`

## Verified sizes

- Ollama models: 63G
- LM Studio models: 27G
- Hugging Face cache: 2.0G

## Internal cache status

- Internal Hugging Face cache removed
- Marker file retained at `/Users/okh/.cache/HUGGINGFACE_CACHE_MOVED_TO_OKH_LOCAL.txt`

## Ollama service

- Managed by Homebrew services
- Status verified as started
- Existing models visible through `ollama list`

## Visible Ollama models

- llama3.1:8b
- mistral-small3.1:24b
- codestral:22b
- gemma3:27b
- gemma3:12b
- phi4:14b

## Result

The Mac Studio local AI storage layer is normalized, externalized, documented, and ready for model inventory and benchmarking.

## Model inventory artifact

- Ollama inventory file created:
  `/Volumes/OKH-Local/07_Local_LLMs/manifests/OLLAMA_MODEL_INVENTORY_2026-05-12.txt`

## LM Studio inventory artifact

- LM Studio inventory file created:
  `/Volumes/OKH-Local/07_Local_LLMs/manifests/LM_STUDIO_MODEL_INVENTORY_2026-05-12.txt`
- LM Studio path corrected to avoid nested `models/models`.
- Visible LM Studio model families:
  - gemma-4-26B-A4B-it-GGUF
  - gemma-4-E2B-it-GGUF
  - gemma-4-E4B-it-GGUF
