---
title: "Mac Studio Local AI Workbench"
artifact_type: "project_readme"
created_date: "2026-05-13"
project: "Mac Studio Local AI Workbench"
status: "baseline-built-public-candidate"
visibility: "public-candidate"
---

# Mac Studio Local AI Workbench

This repository captures the governed baseline build of a Mac Studio M4 Max local AI workbench.

The purpose is not merely to document that local AI tools were installed. The purpose is to preserve the operating model, scripts, benchmarks, decisions, and future RAG roadmap needed to make the workstation maintainable, recoverable, and useful.

## Current status

Baseline phase: **DONE**

The local AI workbench has been:

- built
- normalized
- documented
- benchmarked
- verified
- archived locally

Operational hardening is still in progress. The next phase is backup, update governance, Open WebUI state capture, stricter model benchmarks, and a small RAG/vector database smoke test.

## Core architecture

```text
Mac Studio M4 Max
  -> external NVMe workbench volume
  -> Ollama runtime
  -> LM Studio model workspace
  -> Hugging Face external cache
  -> Open WebUI front door
  -> local benchmark harness
  -> future RAG/vector database layer
```

## Example local path pattern

This repository uses sanitized example paths instead of publishing private workstation-specific details.

```text
/Volumes/<external-ai-volume>/05_Research_Vault/mac-studio-setup
/Volumes/<external-ai-volume>/06_RAG_Experiments
/Volumes/<external-ai-volume>/07_Local_LLMs/ollama/models
/Volumes/<external-ai-volume>/07_Local_LLMs/lm-studio/models
/Volumes/<external-ai-volume>/07_Local_LLMs/huggingface-cache
```

The original build used a dedicated external NVMe volume. If adapting this repo, set your own volume path through environment variables or local-only configuration.

## Repository purpose

This repo is the durable, sanitized artifact layer for the Mac Studio local AI workbench.

It should contain:

- setup documentation
- restore and verification scripts
- model inventories
- benchmark summaries
- architecture notes
- update policy templates
- RAG roadmap artifacts
- publishable project-page source material

It should not contain:

- model binaries
- Hugging Face cache contents
- Ollama blobs
- LM Studio downloaded models
- tokens
- secrets
- private keys
- unsanitized config files
- private Notion URLs or page IDs
- private MCP configuration files
- local credential stores

## Public/private boundary

The private build journal is maintained separately for personal and MCP consumption only.

Public-facing documentation is copied, summarized, and sanitized into this repository under:

- `docs/`
- `benchmarks/`
- `manifests/`
- `templates/`

The public narrative case study lives on OverKill Hill:

```text
https://overkillhill.com/projects/mac-studio-local-ai-workbench/
```

## Security and publication posture

Before making this repository public, run a final review for:

- Notion URLs or page IDs
- API tokens, PATs, keys, passwords, or secrets
- raw MCP configuration files
- Hugging Face cache/token files
- model binaries or downloaded model blobs
- private machine paths that should remain local
- private LAN/IP details
- employer-specific or non-public information

See `SECURITY.md` for the publication boundary and disclosure policy.

## Baseline verdict

The system is functional as a local AI workbench baseline. The project is best understood as a governed personal AI workstation reference build: repeatable enough to learn from, but intentionally not a production service or enterprise platform.
