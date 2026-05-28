---
title: "Project Overview"
artifact_type: "project_overview"
created_date: "2026-05-13"
updated_date: "2026-05-28"
project: "Mac Studio Local AI Workbench"
status: "baseline-complete-agent-online"
---

# Project Overview

## Thesis

This project documents the conversion of a Mac Studio M4 Max into a governed local AI workbench — not just an installation of tools, but a deliberate operating model: externalized storage, reproducible setup, restore scripts, health verification, model benchmarks, update governance, a RAG readiness layer, and an autonomous agent tier.

The distinction matters. Most local AI setups are a pile of downloads. This one is built to be maintainable, recoverable, and useful over time.

## Why it matters

Local AI becomes genuinely useful only when the infrastructure underneath it is trustworthy. A durable setup needs:

- Normalized storage paths that survive reboots and version bumps
- Documented environment variables so you know why things work
- Model inventories that track what's running and why
- Known-good baseline checks you can run after changes
- A controlled update policy that doesn't break things silently
- Backup and recovery that actually works when you need it
- Model role classification so you're not using a 27B model for a task that an 8B handles fine
- RAG and corpus governance for when you want the AI to know your actual content
- An autonomous agent tier so local AI works without requiring a prompt

## The hardware

| Component | Spec |
|---|---|
| Machine | Mac Studio M4 Max (2025) |
| Unified memory | 36GB |
| Internal SSD | 512GB |
| External NVMe | 1TB WD Black SN7100 (via Satechi Stand Hub, `/Volumes/OKH-Local`) |
| macOS | Sequoia (latest as of 2026-05-04) |

## Build status

| Phase | Status |
|---|---|
| Baseline build | ✅ Done — 2026-05-12 |
| Storage normalization | ✅ Done — 2026-05-12 |
| Smoke test benchmarks | ✅ Done — 2026-05-12 |
| Operational hardening | ✅ Done — 2026-05-13 |
| OpenClaw agent layer | ✅ Done — 2026-05-28 |
| Full benchmark pass | ⬜ Pending |
| RAG/vector database | ⬜ Planned |

## Primary software stack

| Tool | Version | Role |
|---|---|---|
| Homebrew | 5.1.8 | Package manager |
| Git | 2.54.0 | Version control (overrides Apple Git) |
| Python | 3.14.4 | Runtime |
| Node.js | 26.0.0 | MCP server support |
| GitHub CLI | 2.92.0 | Repo operations |
| Docker Desktop | 4.72.0 | Container runtime |
| Ollama | 0.23.1 | Local model inference (MLX-accelerated) |
| LM Studio | 0.4.12 | Model GUI, MLX backend |
| Open WebUI | Latest | Browser-based chat interface |
| mlx-lm | 0.31.3 | Direct Apple Silicon inference |
| OpenClaw | 2026.5.26 | Autonomous local AI agent (Larry) |
| SearXNG | Latest | Self-hosted private web search |
| VSCode | 1.119.0 | Editor |
| Continue.dev | 1.2.22 | Local Copilot replacement in VSCode |
| Claude Desktop | Latest | Frontier AI + MCP orchestration hub |

## Two AI interaction layers

This workbench distinguishes between a chat interface and an autonomous agent.

| Layer | Tool | Interaction model |
|---|---|---|
| Chat interface | Open WebUI | Synchronous — you prompt, model responds |
| Autonomous agent | OpenClaw / Larry | Asynchronous — runs in background, works without prompting |

Larry (the OpenClaw agent) uses gemma3:27b as its primary model and has 28 eligible skills including Apple Notes, GitHub, Notion, web search, file operations, and task scheduling.

## Repository role

This repo is the sanitized, durable artifact layer. It stores documentation, scripts, benchmark results, manifests, and templates — without model binaries, secrets, tokens, cache contents, or links to private workspaces.

## Public project page

https://overkillhill.com/projects/mac-studio-local-ai-workbench/
