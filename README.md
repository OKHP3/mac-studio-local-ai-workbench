---
title: "Mac Studio Local AI Workbench"
artifact_type: "project_readme"
created_date: "2026-05-13"
updated_date: "2026-05-28"
project: "Mac Studio Local AI Workbench"
status: "baseline-complete-agent-online"
---

# Mac Studio Local AI Workbench

This repository captures the governed baseline build of a Mac Studio M4 Max local AI workbench — plus the autonomous agent layer added in May 2026.

The purpose is not merely to document that local AI tools were installed. The purpose is to preserve the operating model, scripts, benchmarks, decisions, and future RAG roadmap needed to make the workstation maintainable, recoverable, and useful.

## Current status

Baseline phase: **DONE**

Agent layer: **ONLINE** — OpenClaw 2026.5.26, agent named Larry, as of 2026-05-28.

The local AI workbench has been:

- built
- normalized
- documented
- benchmarked
- verified
- archived locally
- extended with an autonomous background agent

## Core architecture

```text
Mac Studio M4 Max
  -> external NVMe workbench volume (OKH-Local)
  -> Ollama runtime (MLX-accelerated, port 11434)
  -> LM Studio model workspace (MLX backend, port 1234)
  -> Hugging Face external cache
  -> Open WebUI front door (Docker, port 3000)
  -> OpenClaw agent — Larry (LaunchAgent, port 18789)
     -> SearXNG web search (Docker, port 8888)
     -> 28 skills (Apple Notes, GitHub, Notion, web search, more)
  -> local benchmark harness
  -> future RAG/vector database layer
```

## Two AI interaction layers

| Layer | Tool | What it does |
|---|---|---|
| Chat interface | Open WebUI | You send a prompt, model responds |
| Autonomous agent | OpenClaw (Larry) | Runs in background, works without prompting |

These are complementary. Open WebUI is for interactive queries. Larry handles the zero-cost execution tier — background tasks, scheduling, file operations, Apple Notes/Reminders, web search, and RAG queries.

## Canonical local paths

```text
/Volumes/OKH-Local/05_Research_Vault/mac-studio-setup
/Volumes/OKH-Local/06_RAG_Experiments
/Volumes/OKH-Local/07_Local_LLMs/ollama/models
/Volumes/OKH-Local/07_Local_LLMs/lm-studio/models
/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache
~/searxng/config/          (SearXNG configuration)
~/.openclaw/workspace/     (agent workspace — MEMORY.md, SOUL.md, IDENTITY.md)
```

## Repository purpose

This repo is the durable, sanitized artifact layer for the Mac Studio local AI workbench.

It should contain:

- setup documentation
- restore and verification scripts
- model inventories
- benchmark summaries
- architecture notes
- agent configuration documentation
- update policy templates
- RAG roadmap artifacts
- publishable project-page source material

It should not contain:

- model binaries
- Hugging Face cache contents
- Ollama blobs
- LM Studio downloaded models
- tokens or secrets
- private keys
- unsanitized config files
- links to private workspaces

## Repository structure

```text
docs/
  00-project-overview.md       Project thesis, hardware, build status
  01-build-journey.md          Dated build log — May 3 through May 28
  02-storage-architecture.md   OKH-Local volume layout, env vars
  03-toolchain.md              Full software stack including OpenClaw
  04-model-inventory.md        All 10 models with routing logic
  05-benchmark-results.md      Smoke test results, MLX benchmark
  06-definition-of-done.md     Punch list, smoke tests, growth items
  07-rag-roadmap.md            RAG architecture and deployment guide
  08-council-of-ais-methodology.md  Multi-AI workflow methodology
  09-token-economics.md        Token routing and cost decisions
  10-openclaw-larry-agent.md   OpenClaw agent — full documentation
  local-web-portal-https.md    Future local portal and HTTPS boundary
  diagram-flowchart.md         Architecture flowchart
  diagram-mindmap.md           Architecture mind map
  diagram-architecture.md      System architecture diagram
  15-technology-version-management.md  Technology update tracking
  16-local-ai-stack-readiness-research-2026-08-02.md  Readiness research
  16-openclaw-readiness-and-local-to-cloud-ai-pipeline-2026-08-02.md  Dated readiness record
  17-openclaw-hardening-handoff-2026-08-02.md  Hardening handoff
benchmarks/
  smoke-test-prompts.md        The 5-test benchmark suite
  local-model-smoke-test-2026-05-12/
reports/
  technology-update-report.md
  openclaw-related-runtime-readiness-audit-2026-08-02.md
  mac-studio-hardening-execution-2026-08-02.md
context/threads/                Sanitized provenance and continuity extracts
config/technology-inventory.json Technology tracking input
templates/
  research-artifact-template.md
  validation-brief-template.md
manifests/
  ollama-model-inventory-2026-05-12.md
scripts/
  restore_mac_studio_baseline.sh
  verify_mac_studio_baseline.sh
config/env.example
```

## Project page

Public project page:

```text
https://overkillhill.com/projects/mac-studio-local-ai-workbench/
```

## Current verdict

The Mac Studio M4 Max is a functional, governed local AI workbench with an active autonomous agent layer. The baseline is documented, benchmarked, verified, and archived. The next phase is the RAG corpus build, expanded model benchmarks, and the architecture diagram.
