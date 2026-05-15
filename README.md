---
title: "Mac Studio Local AI Workbench"
artifact_type: "project_readme"
created_date: "2026-05-13"
project: "Mac Studio Local AI Workbench"
status: "baseline-complete"
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

## Canonical local paths

```text
/Volumes/OKH-Local/05_Research_Vault/mac-studio-setup
/Volumes/OKH-Local/06_RAG_Experiments
/Volumes/OKH-Local/07_Local_LLMs/ollama/models
/Volumes/OKH-Local/07_Local_LLMs/lm-studio/models
/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache
```

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

## Project page

Public project page:

```text
https://overkillhill.com/projects/mac-studio-local-ai-workbench/
```

## Baseline verdict

The system is functional as a local AI workbench baseline. The next phase is operational hardening: backup, update governance, Open WebUI state capture, stricter model benchmarks, and a small RAG/vector database smoke test.
