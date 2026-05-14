---
title: "Toolchain"
artifact_type: "toolchain_inventory"
created_date: "2026-05-13"
project: "Mac Studio Local AI Workbench"
status: "baseline"
---

# Toolchain

## Core infrastructure

| Tool | Version | Purpose |
|---|---:|---|
| Homebrew | 5.1.8 | Package manager |
| Git | 2.54.0 | Version control |
| Python | 3.14.4 | Runtime for Python tooling |
| Node.js | 26.0.0 | JavaScript runtime and MCP support |
| npm | 11.12.1 | Node package management |
| GitHub CLI | 2.92.0 | Repository operations |
| git-lfs | Latest | Large file support |

## Local AI runtimes

| Tool | Version | Purpose |
|---|---:|---|
| Ollama | 0.23.1 | Primary local model inference server |
| LM Studio | 0.4.12 | Desktop model workspace and local server |
| mlx-lm | 0.31.3 | Direct Apple Silicon inference |
| Open WebUI | Latest | Browser-based chat interface over Ollama |
| Docker Desktop | 4.72.0 | Container runtime |

## Why three inference paths?

- **Ollama** is the primary API server and service-backed runtime.
- **LM Studio** is the GUI model browser and test bench.
- **mlx-lm** is the direct Apple Silicon path used when throughput matters.

## MCP layer

Claude Desktop is configured as an orchestration hub with multiple MCP connectors. The public repo records only the categories and operational lessons, not private connector configuration.

Connector categories include:

- private workspace access
- GitHub repository access
- diagramming support
- calendar and mail integrations
- document and cloud storage integrations
- Microsoft ecosystem integrations
- commerce and infrastructure integrations

**Critical configuration note:** desktop-launched MCP tools may not inherit shell PATH. Use full binary paths in private local configuration.

## Development tools

| Tool | Version | Purpose |
|---|---:|---|
| VSCode | 1.119.0 | Primary editor |
| Continue.dev | 1.2.22 | Local Copilot-style workflow using local models |
| GitHub Desktop | Latest | Visual Git management |

## VSCode extension categories

- Mermaid authoring and preview
- Markdown authoring and linting
- Git visualization and pull requests
- Python development
- formatting, spell check, and TODO tracking

## Desktop applications

| Application | Purpose |
|---|---|
| Claude Desktop | frontier AI and MCP orchestration |
| ChatGPT | frontier AI and code execution |
| Codex | autonomous coding agent |
| Copilot | Microsoft AI interface |
| Perplexity | research and citation-grade search |
| Notion Desktop | knowledge-base client |
| Microsoft Edge | browser and PWA host |
| Microsoft Office suite | document production |
| OneDrive | file sync |

## Edge PWAs

Pinned standalone apps include brand properties, AI tools, project platforms, productivity services, and publishing surfaces.
