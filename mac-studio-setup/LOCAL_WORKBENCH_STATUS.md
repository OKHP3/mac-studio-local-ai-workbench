---
title: "Mac Studio Local Workbench Status"
artifact_type: "setup_status"
created_date: "2026-05-12"
machine: "OverKill-Hills-Mac-Studio"
volume: "/Volumes/OKH-Local"
status: "active_setup"
---

# Mac Studio Local Workbench Status

## Operating model

This Mac Studio is the local workbench for the OKHP3 tooling workflow.

Canonical roles:

- Notion = working canon and ideation consolidation surface
- GitHub = durable, versioned, machine-readable corpus
- Mac Studio = local processing, repo mirrors, local AI runtime, export cleanup, and future RAG lab
- Replit = constrained high-cost execution/build layer
- Claude and ChatGPT = senior reasoning and synthesis layer
- Perplexity and Copilot Researcher = research-intern artifact generators

## External workbench root

`/Volumes/OKH-Local`

## GitHub mirrors

Located at:

`/Volumes/OKH-Local/04_GitHub_Mirrors`

Currently cloned:

- OKHP3/OverKill-Hill
- OKHP3/first-diagram-is-a-liar
- OKHP3/mermaid-theme-builder
- OKHP3/mermaid-diagram-bpmn

## Active local AI storage

Normalized active runtime model folders:

- Ollama models: `/Volumes/OKH-Local/07_Local_LLMs/ollama/models`
- LM Studio models: `/Volumes/OKH-Local/07_Local_LLMs/lm-studio/models`

Compatibility symlinks are retained at:

- `/Volumes/OKH-Local/ollama -> /Volumes/OKH-Local/07_Local_LLMs/ollama`
- `/Volumes/OKH-Local/lm-studio -> /Volumes/OKH-Local/07_Local_LLMs/lm-studio`

## Local AI governance folders

Planned governance folders:

- `/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache`
- `/Volumes/OKH-Local/07_Local_LLMs/manifests`
- `/Volumes/OKH-Local/07_Local_LLMs/quarantine`
- `/Volumes/OKH-Local/07_Local_LLMs/mlx`

## Hugging Face cache settings

- `HF_HOME=/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache`
- `HUGGINGFACE_HUB_CACHE=/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache/hub`

## Architecture clarification

GitHub is the durable corpus. It is not automatically a vector database or graph database. RAG behavior requires a retrieval layer such as search, embeddings, connectors, or an index.


## Ollama normalization confirmed

- Date confirmed: 2026-05-12
- Service manager: Homebrew services
- Model path: `/Volumes/OKH-Local/07_Local_LLMs/ollama/models`
- Compatibility symlink: `/Volumes/OKH-Local/ollama -> /Volumes/OKH-Local/07_Local_LLMs/ollama`
- Validation: `ollama list` shows existing models after `brew services start ollama`
- Runtime smoke test: `llama3.1:8b` responded successfully from normalized storage

## Local AI storage verification

- Date verified: 2026-05-12
- `OLLAMA_MODELS=/Volumes/OKH-Local/07_Local_LLMs/ollama/models`
- `HF_HOME=/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache`
- `HUGGINGFACE_HUB_CACHE=/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache/hub`
- Ollama models visible after normalization:
  - llama3.1:8b
  - mistral-small3.1:24b
  - codestral:22b
  - gemma3:27b
  - gemma3:12b
  - phi4:14b
- Active storage:
  - Ollama models: 63G
  - LM Studio models: 27G
  - Hugging Face external cache: validated and migrated to 2.0G on external storage

## Hugging Face cache validation confirmed

- Date confirmed: 2026-05-12
- Authenticated user: `okhp3`
- Token profile: `OKH-Mac-Studio-ReadOnly`
- Token type: fine-grained read-only
- Cache path: `/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache`
- Test download: `bert-base-uncased` with `README.md` and `config.json`
- Validation result: download completed successfully; cache was later migrated and consolidated externally

## Hugging Face internal cache cleanup confirmed

- Date confirmed: 2026-05-12
- Internal cache removed: `/Users/okh/.cache/huggingface`
- External cache retained: `/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache`
- External cache size after migration: 2.0G
- Marker file created: `/Users/okh/.cache/HUGGINGFACE_CACHE_MOVED_TO_OKH_LOCAL.txt`
