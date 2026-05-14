---
title: "Storage Architecture"
artifact_type: "architecture_document"
created_date: "2026-05-13"
project: "Mac Studio Local AI Workbench"
status: "public-candidate"
---

# Storage Architecture

## Core principle

Model and cache storage should live on a dedicated external workbench volume, not the Mac Studio internal SSD.

The exact volume name used in the original build is intentionally generalized in this public repository. Adapt the paths below to your own local environment.

## External workbench volume pattern

```text
/Volumes/<external-ai-volume>
```

## Canonical local AI storage paths

```text
/Volumes/<external-ai-volume>/07_Local_LLMs/ollama/models
/Volumes/<external-ai-volume>/07_Local_LLMs/lm-studio/models
/Volumes/<external-ai-volume>/07_Local_LLMs/huggingface-cache
/Volumes/<external-ai-volume>/07_Local_LLMs/manifests
/Volumes/<external-ai-volume>/07_Local_LLMs/mlx
/Volumes/<external-ai-volume>/07_Local_LLMs/quarantine
```

## Compatibility symlinks

Compatibility symlinks may be retained for tools or old references that expect root-level folders:

```text
/Volumes/<external-ai-volume>/ollama -> /Volumes/<external-ai-volume>/07_Local_LLMs/ollama
/Volumes/<external-ai-volume>/lm-studio -> /Volumes/<external-ai-volume>/07_Local_LLMs/lm-studio
```

## Environment variables

```bash
export OKH_LOCAL_VOLUME="/Volumes/<external-ai-volume>"
export OLLAMA_MODELS="$OKH_LOCAL_VOLUME/07_Local_LLMs/ollama/models"
export OLLAMA_FLASH_ATTENTION="1"
export OLLAMA_KV_CACHE_TYPE="q8_0"
export HF_HOME="$OKH_LOCAL_VOLUME/07_Local_LLMs/huggingface-cache"
export HUGGINGFACE_HUB_CACHE="$HF_HOME/hub"
```

## Ollama service path

The Homebrew Ollama service should be able to see the same model path used by the shell environment:

```text
/Volumes/<external-ai-volume>/07_Local_LLMs/ollama/models
```

This should be verified after service restart and model visibility confirmation.

## Design rationale

Externalized storage provides:

- lower internal SSD pressure
- easier backup of setup artifacts
- clearer separation between runtime storage and documentation
- easier future migration to another workstation
- explicit storage governance before RAG/vector databases grow

## Publication note

This repository documents the storage pattern. It intentionally does not store model binaries, Ollama blobs, Hugging Face cache contents, LM Studio downloads, local credential files, or private machine configuration.
