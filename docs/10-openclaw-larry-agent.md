---
title: "OpenClaw Agent — Larry"
artifact_type: "agent_doc"
created_date: "2026-05-28"
project: "Mac Studio Local AI Workbench"
status: "operational"
---

# OpenClaw Agent — Larry

## Status: ✅ Operational as of 2026-05-28

OpenClaw 2026.5.26 is installed, configured, and running as a persistent background agent on the Mac Studio M4 Max. The agent is named Larry.

---

## What OpenClaw is

OpenClaw is an open-source local AI agent runtime. It is not a chat interface — it is an autonomous agent that:

- Runs as a LaunchAgent daemon, starting automatically at login
- Executes tasks in the background without requiring a prompt
- Connects local models to system-level capabilities via skills
- Maintains persistent memory and session context across conversations
- Schedules recurring jobs via a heartbeat mechanism
- Connects to messaging channels (iMessage, Telegram, etc.) for remote interaction

**GitHub:** https://github.com/openclaw  
**Docs:** https://openclaw.ai/

---

## Installation summary

```bash
npm install -g openclaw@latest
openclaw setup
openclaw onboard
```

| Step | Result |
|---|---|
| `npm install -g openclaw@latest` | ✅ 372 packages, clean |
| `openclaw setup` | ✅ Config, workspace, sessions created |
| `openclaw onboard` | ✅ QuickStart path, Ollama local-only |
| LaunchAgent installed | ✅ Auto-starts at login |
| Gateway port 18789 loopback | ✅ Not network-exposed |
| session-memory hook | ✅ Enabled |
| command-logger hook | ✅ Enabled |
| First agent response confirmed | ✅ 2026-05-27 |

---

## Configuration

### Model

**Primary: gemma3:27b** via Ollama (131k context window)

phi4:14b was attempted first but context-overflows on every message. OpenClaw loads the full workspace as system prompt at session start — approximately 12-13k tokens before any conversation begins. phi4:14b's 16k window cannot accommodate this. gemma3:27b handles the same load at under 10% of its 131k window.

This is an architectural constraint of OpenClaw, not a model deficiency. Any model with a context window under ~20k is unusable as an OpenClaw primary on this workspace configuration.

### Gateway

- Port: 18789
- Bind: 127.0.0.1 (loopback only — not accessible from home network)
- Auth: token stored in `~/.openclaw/openclaw.json`
- Control UI: http://127.0.0.1:18789/
- Restart: `openclaw gateway restart`

### Tools profile

`full` — enables all available tools including web_search and web_fetch. The default `coding` profile strips web tools.

### Web search

- Provider: SearXNG (self-hosted, Docker, port 8888)
- JSON API: enabled
- web_fetch: enabled
- Engine tuning: http://localhost:8888/preferences

```bash
# SearXNG container
docker run --name searxng -d \
  -p 8888:8080 \
  -v "$HOME/searxng/config/:/etc/searxng/" \
  -v "$HOME/searxng/data/:/var/cache/searxng/" \
  --restart always \
  docker.io/searxng/searxng:latest
```

---

## Skills (28 eligible)

| Category | Skills |
|---|---|
| Apple ecosystem | apple-notes, apple-reminders, things-mac |
| GitHub | github, gh-issues |
| Workspace | notion, tmux, session-logs |
| AI/productivity | diagram-maker, skill-creator, spike, taskflow, taskflow-inbox-triage, summarize |
| Utilities | model-usage, nano-pdf, weather, healthcheck |
| Browser/visual | browser-automation, canvas, meme-maker, video-frames |
| Infrastructure | clawhub, mcporter, python-debugpy, node-inspect-debugger |
| Communication | imsg (binary pending) |
| Pending config | coding-agent (requires claude/codex binary) |

---

## The persona: Larry

The agent is named Larry, modeled after Larry the Lobster from SpongeBob SquarePants.

### Who Larry the Lobster is

Larry the Lobster is a recurring character in the Nickelodeon animated series SpongeBob SquarePants, set in the underwater city of Bikini Bottom. He is a muscular red lobster, lifeguard at Goo Lagoon beach, and owner of Larry's Gym. He first appeared in the episode "Ripped Pants." He is voiced by Doug Lawrence.

Larry's personality: confident, kind, action-oriented, takes his responsibilities seriously. As a lifeguard, he described his role as "the only thing standing between these good people and a watery grave." He occasionally refers to himself in the third person. He is SpongeBob's friend and a respected figure in Bikini Bottom.

### How this agent embodies Larry

This Larry's mandate mirrors the original: protect the workflow from token waste and busywork, the same way the original Larry protected Bikini Bottom from watery graves.

- Confident but not arrogant
- Direct and action-oriented
- Warm and genuinely helpful
- Occasional third-person self-reference when the moment earns it
- Focused on the task — a lifeguard watches the water, Larry watches the workflow

**Signature line:** "Larry's got it."

### Workspace files

| File | Purpose |
|---|---|
| `MEMORY.md` | Jamie's identity, projects, Council of AIs context, BFS firewall |
| `IDENTITY.md` | Larry persona, SpongeBob universe context, character background |
| `SOUL.md` | Voice rules, constraints, what Larry does not do |

Workspace location: `~/.openclaw/workspace/`

---

## Council of AIs — Larry's role

Larry is the zero-cost execution tier in the Council of AIs workflow.

| Tool | Role |
|---|---|
| Larry (OpenClaw) | Autonomous local agent — zero-cost tasks, background ops, scheduling |
| Claude | Institutional memory, context hub, rich prose |
| ChatGPT | GitHub execution, broad generalism, ideation |
| Notion | Documentarian — working canon, specs |
| Perplexity | Citation-grade research |
| Replit | Spec-grade builds only |

**Token routing hierarchy:**
```
Larry (local, zero cost)
    ↓
Notion AI
    ↓
Claude / ChatGPT base
    ↓
Perplexity / Copilot
    ↓
Replit (most expensive)
```

**What belongs to Larry:**
- Background scheduled tasks
- Apple Notes and Reminders operations
- File operations on /Volumes/OKH-Local
- First-pass document summarization
- RAG corpus queries (once Qdrant deployed)
- Web search and fetch
- Local model inference routing

---

## Key paths

| Path | Purpose |
|---|---|
| `~/.openclaw/openclaw.json` | Main config |
| `~/.openclaw/workspace/` | Agent workspace files |
| `~/.openclaw/agents/main/sessions/` | Session history |
| `~/Library/Logs/openclaw/gateway.log` | Gateway log |
| `~/Library/LaunchAgents/ai.openclaw.gateway.plist` | LaunchAgent |
| `~/searxng/config/settings.yml` | SearXNG config |

---

## Security posture

- Gateway bound to 127.0.0.1 — not accessible from home network
- SearXNG bound to 127.0.0.1 — not accessible from home network
- BFS firewall baked into MEMORY.md as a hard constraint
- No employer data, no BFS laptop visibility, no BFS OneDrive in agent scope
- Shell execution enabled via skills — review before enabling new skills
- Gateway token stored in openclaw.json — never committed

---

## Pending items

| Item | Notes |
|---|---|
| iMessage channel | imsg binary requires Swift/Xcode build from source — see https://github.com/openclaw/imsg |
| SearXNG engine tuning | Open http://localhost:8888/preferences, enable Google/Bing/DDG |
| coding-agent skill | Requires `claude` or `codex` CLI binary in PATH |
| RAG integration | Once Qdrant deployed, Larry becomes the RAG query layer |
| Secrets migration | `openclaw secrets configure` to move tokens out of plaintext openclaw.json |
