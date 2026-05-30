---
title: "Storage Architecture"
artifact_type: "architecture_doc"
created_date: "2026-05-13"
updated_date: "2026-05-28"
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
/Volumes/OKH-Local/07_Local_LLMs/qdrant          (future — vector database)
```

## Compatibility symlinks

```text
/Volumes/OKH-Local/ollama
/Volumes/OKH-Local/lm-studio
```

These root-level entries point back to canonical folders under `07_Local_LLMs`.

## Agent and service paths (home directory)

These paths live in the user home directory, not on OKH-Local. They hold configuration and runtime state, not model weights.

```text
~/.openclaw/workspace/        OpenClaw agent workspace
  MEMORY.md                   Persistent identity and context
  IDENTITY.md                 Larry persona and character context
  SOUL.md                     Voice rules and constraints
  AGENTS.md                   Agent configuration
  HEARTBEAT.md                Scheduled task definitions

~/searxng/config/             SearXNG search engine configuration
~/searxng/data/               SearXNG runtime data

~/Library/LaunchAgents/       macOS LaunchAgent plists
  homebrew.mxcl.ollama.plist  Ollama service configuration
  ai.openclaw.gateway.plist   OpenClaw gateway service
```

## Service configuration note

The Ollama background service and the OpenClaw gateway both run as launchd services. Neither inherits shell environment variables from `~/.zprofile`. Environment variables must be configured directly in each service's plist file.

For Ollama: `/opt/homebrew/opt/ollama/homebrew.mxcl.ollama.plist`

For OpenClaw: the gateway reads from `~/.openclaw/openclaw.json` — not from the shell environment.

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

If the external workbench volume is lost:

1. Re-create the folder structure
2. Re-pull Ollama models: `ollama pull modelname` for each
3. Re-download LM Studio models via LM Studio UI
4. Re-authenticate HuggingFace: `huggingface-cli login`
5. Restore agent workspace from backup or re-seed MEMORY.md manually
6. Restore repo documentation and scripts from GitHub

Nothing on OKH-Local is irreplaceable. Everything either re-downloads from a registry or rebuilds from GitHub.
