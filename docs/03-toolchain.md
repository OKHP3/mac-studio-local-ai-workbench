---
title: "Toolchain"
artifact_type: "toolchain_inventory"
created_date: "2026-05-13"
updated_date: "2026-05-28"
project: "Mac Studio Local AI Workbench"
status: "baseline-plus-agent"
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

## Autonomous agent layer

| Tool | Version | Purpose |
|---|---:|---|
| OpenClaw | 2026.5.26 | Local AI agent runtime — autonomous, LaunchAgent-backed |
| SearXNG | Latest | Self-hosted private web search (Docker, port 8888) |

### OpenClaw

OpenClaw is a local AI agent that runs as a persistent background daemon, distinct from chat interfaces like Open WebUI.

- Gateway: port 18789, bound to 127.0.0.1 (loopback only)
- LaunchAgent: auto-starts at login
- Primary model: gemma3:27b via Ollama (131k context window)
- Tools profile: full
- Control UI: http://127.0.0.1:18789/
- Install: `npm install -g openclaw@latest`

**Why gemma3:27b, not phi4:14b:** OpenClaw loads all workspace files (AGENTS.md, SOUL.md, MEMORY.md, IDENTITY.md, TOOLS.md) as system prompt on session start — approximately 12-13k tokens before any conversation begins. phi4:14b's 16k window overflows immediately. gemma3:27b handles the same load at under 10% of its 131k window.

**Skills installed (28 eligible):** apple-notes, apple-reminders, things-mac, github, gh-issues, notion, tmux, session-logs, diagram-maker, skill-creator, spike, taskflow, taskflow-inbox-triage, summarize, model-usage, nano-pdf, weather, healthcheck, browser-automation, canvas, meme-maker, video-frames, clawhub, mcporter, python-debugpy, node-inspect-debugger, imsg (binary pending), coding-agent (pending config)

**Hooks enabled:** session-memory, command-logger

### SearXNG

Self-hosted privacy-respecting metasearch engine. Aggregates results from multiple search providers without tracking.

- Docker container, port 8888, loopback only
- JSON API enabled for OpenClaw web_search tool
- web_fetch also enabled
- Engine quality tuning: open http://localhost:8888/preferences to configure preferred engines
- Volume: `~/searxng/config/` and `~/searxng/data/`

### The agent persona: Larry

The OpenClaw agent is named Larry, modeled after Larry the Lobster from SpongeBob SquarePants.

Larry the Lobster is a muscular red lobster, lifeguard at Goo Lagoon in Bikini Bottom, gym owner, and SpongeBob's friend. He is confident, direct, warm, action-oriented, and occasionally refers to himself in the third person.

This Larry's mandate mirrors the original: the original Larry protected Bikini Bottom from watery graves. This Larry protects the workflow from token waste and busywork.

Workspace files:
- `MEMORY.md` — seeded with identity, Council of AIs context, BFS firewall rule
- `IDENTITY.md` — Larry persona and SpongeBob universe context
- `SOUL.md` — voice rules, constraints, signature line ("Larry's got it.")

### Open WebUI vs OpenClaw

| | Open WebUI | OpenClaw (Larry) |
|---|---|---|
| What it is | Chat interface | Autonomous agent |
| Interaction | You send a prompt | Works in background |
| Model | Any local Ollama model | gemma3:27b (131k context) |
| Starts at | Manual | Login (LaunchAgent) |
| Skills | None | 28 eligible |
| Best for | Interactive queries | Background tasks, automation |

These are complementary, not competing.

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
