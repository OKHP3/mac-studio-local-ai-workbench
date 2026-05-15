---
title: "Storage Architecture"
artifact_type: "architecture_doc"
created_date: "2026-05-13"
project: "Mac Studio Local AI Workbench"
status: "normalized"
---

# Storage Architecture

## Design principle

Local AI projects need explicit storage governance. Model weights, cache folders, benchmark outputs, exports, and repo mirrors should live on a dedicated external workbench volume rather than crowding the internal SSD.

The internal SSD runs macOS and applications. The external volume holds replaceable runtime assets and project artifacts.

## Volume layout

```text
/Volumes/OKH-Local/
  00_Inbox/
  01_ChatGPT_Exports/
  02_Claude_Exports/
  03_Notion_Exports/
  04_GitHub_Mirrors/
  05_Research_Vault/
  06_RAG_Experiments/
  07_Local_LLMs/
  08_Media_Staging/
  09_Archive_Cold/
  99_Temp_Scratch/
```

## Local model storage

```text
/Volumes/OKH-Local/07_Local_LLMs/ollama/models
/Volumes/OKH-Local/07_Local_LLMs/lm-studio/models
/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache
```

## Compatibility symlinks

```text
/Volumes/OKH-Local/ollama
/Volumes/OKH-Local/lm-studio
```

These root-level entries point back to canonical folders under `07_Local_LLMs`.

## Service configuration note

The Ollama background service must see the same model directory that the interactive shell uses. Shell profile variables do not automatically flow into background services, so service configuration must be verified after changes.

## Disk usage baseline

| Path | Size |
|---|---:|
| Ollama models | 63 GB |
| LM Studio models | 45 GB |
| Hugging Face cache | 2.18 GB |
| Total used | ~110 GB |
| Drive capacity | 931 GB |
| Available | ~820 GB |

## Recovery path

If the external workbench volume is lost, re-create the folder structure, re-pull models, restore workspace exports if needed, and restore repo documentation and scripts from GitHub.
