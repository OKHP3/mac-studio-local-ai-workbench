# Docker container inventory and naming legend (2026-09-25)

Docker Desktop on the Mac Studio should show **8 containers** in steady state (through the rollback-retention window below).

## Legend

| Container | Role | Expected state | Keep? |
|---|---|---|---|
| `open-webui` | Open WebUI v0.11.4, chat front end (127.0.0.1:3000, Tailscale Serve :8443) | Running, restart=always | Yes, core service |
| `qdrant` | Qdrant v1.19.1 vector DB | Running, restart=always | Yes, core service |
| `searxng` | SearXNG private web search (feeds OpenClaw + Open WebUI web search) | Running, restart=always | Yes, core service |
| `open-webui-prev` | Rollback copy of the pre-upgrade Open WebUI container | Stopped, restart=no | Until ~2026-09-30, then delete |
| `qdrant-prev` | Rollback copy of the pre-pin Qdrant container | Stopped, restart=no | Until ~2026-10-02, then delete |
| `searxng-prev` | Rollback copy of the pre-pin SearXNG container | Stopped, restart=no | Until ~2026-10-02, then delete |
| `openclaw-sbx-workspace-<hash>` | OpenClaw agent sandbox, one per chat session (`sandbox.mode: all`, session scope) | Running while the session is live | Managed by OpenClaw; disposable |

## Reading an `openclaw-sbx-*` name

`openclaw-sbx-workspace-<hash>` = OpenClaw sandbox, workspace type, hashed session key.
The human-readable owner is in the container's labels (Docker Desktop > container > Inspect > Labels):

- `openclaw.sessionKey`: `agent:main:workspace:<session-id>` (agent `main`, which session)
- `openclaw.createdAtMs`, `openclaw.configHash`: when it was made and under which config

Workspace files live on the host bind mount `~/.openclaw/sandboxes/workspace-<hash>/`, not inside the container, so deleting a stopped sandbox container loses nothing. OpenClaw recreates one on the next turn in that session.

**Do not rename these.** OpenClaw looks up its sandbox by the derived name; a renamed container is orphaned and a fresh duplicate gets created, which is exactly how the list bloats.

## Why the list grew to 16

Every new OpenClaw chat session during the 2026-09-24/25 tuning spun up its own sandbox container. When a session goes idle the container stops but is not removed until OpenClaw's prune window catches it.

Cleanup 2026-09-25: deleted 8 stopped `openclaw-sbx-workspace-*` containers (b8088e2e, 50c7f79f, d38213c6, 66035dbd, 76df0061, 33b75d37, c699a46f, 4de01b26). Kept the 2 running sandboxes (sessions 247d4688..., 18ff670d...), the 3 services, and the 3 `-prev` rollbacks.

## Keeping it clean

- Tighten OpenClaw sandbox pruning (verify key names against current OpenClaw docs first): `agents.defaults.sandbox.prune.idleHours` / `maxAgeDays`.
- Or switch sandbox scope from session to agent (one container per agent, name becomes stable) if cross-session workspace sharing is acceptable.
- Manual sweep: delete stopped `openclaw-sbx-*` rows in Docker Desktop any time; never touch running ones.

## Image cleanup (2026-09-25)

Docker disk use went from 35.29 GB to 11.43 GB, about 24 GB freed.

Deleted six images that no container used: `open-webui:v0.11.0`, `open-webui:v0.10.2`, `open-webui:main`, and three untagged `<none>` leftovers from older pulls.

| Image | Used by | Status |
|---|---|---|
| `ghcr.io/open-webui/open-webui:v0.11.4` | `open-webui`, `open-webui-prev` | Keep |
| `qdrant/qdrant:v1.19.1` (same ID as `:latest`) | `qdrant`, `qdrant-prev` | Keep |
| `searxng/searxng:2026.9.25-12f8b6515` | `searxng` | Keep |
| `searxng/searxng:latest` | `searxng-prev` | Keep until the rollback retires (~2026-10-02) |
| `openclaw-sandbox:bookworm-slim` | OpenClaw sandboxes | Keep. **Built locally and not on any registry**, so if it's deleted, run `scripts/sandbox-setup.sh` again |
| `ghcr.io/microsoft/mcp-dotnet-samples/awesome-copilot` | Probably an MCP client that runs `docker run` on demand | Kept (188 MB). Can be pulled again |
| `ghcr.io/github/github-mcp-server:latest` | Probably an MCP client that runs `docker run` on demand | Kept (69 MB). Can be pulled again |

After the `-prev` containers are removed, delete `searxng:latest` too.
