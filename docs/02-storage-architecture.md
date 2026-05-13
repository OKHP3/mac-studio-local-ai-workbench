---
title: "Storage Architecture"
artifact_type: "architecture_document"
created_date: "2026-05-13"
project: "Mac Studio Local AI Workbench"
status: "draft"
---

# Storage Architecture

## Core principle

Model and cache storage should live on the external workbench volume, not the Mac Studio internal SSD.

## External workbench volume

```text
/Volumes/OKH-Local
```

## Canonical local AI storage paths

```text
/Volumes/OKH-Local/07_Local_LLMs/ollama/models
/Volumes/OKH-Local/07_Local_LLMs/lm-studio/models
/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache
/Volumes/OKH-Local/07_Local_LLMs/manifests
/Volumes/OKH-Local/07_Local_LLMs/mlx
/Volumes/OKH-Local/07_Local_LLMs/quarantine
```

## Compatibility symlinks

Compatibility symlinks are retained for tools or old references that expect root-level folders:

```text
/Volumes/OKH-Local/ollama -> /Volumes/OKH-Local/07_Local_LLMs/ollama
/Volumes/OKH-Local/lm-studio -> /Volumes/OKH-Local/07_Local_LLMs/lm-studio
```

## Environment variables

```bash
export OLLAMA_MODELS="/Volumes/OKH-Local/07_Local_LLMs/ollama/models"
export OLLAMA_FLASH_ATTENTION="1"
export OLLAMA_KV_CACHE_TYPE="q8_0"
export HF_HOME="/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache"
export HUGGINGFACE_HUB_CACHE="/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache/hub"
```

## Ollama service path

The Homebrew Ollama plist must point to:

```text
/Volumes/OKH-Local/07_Local_LLMs/ollama/models
```

This was verified on 2026-05-13 after service restart and model visibility confirmation.

## Design rationale

Externalized storage provides:

- lower internal SSD pressure
- easier backup of setup artifacts
- clearer separation between runtime storage and documentation
- easier future migration to another workstation
- explicit storage governance before RAG/vector databases grow
