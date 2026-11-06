# Docker container inventory and naming legend (2026-09-25, updated 2026-11-05)

Docker Desktop on the Mac Studio shows **3 running services**, up to **3 stopped `-prev` rollback copies** during a retention window after an upgrade, and any OpenClaw sandbox containers.

## Legend (2026-11-05)

| Container | Role | Bind | Expected state | Keep? |
|---|---|---|---|---|
| `open-webui` | Open WebUI v0.13.0, chat front end (Tailscale Serve `:8443` in front) | `127.0.0.1:3000` | Running, restart=always | Yes, core service |
| `qdrant` | Qdrant v1.20.0 vector DB (currently holds almost no data; not yet Open WebUI's `VECTOR_DB`) | `127.0.0.1:6333-6334` | Running, restart=always | Yes, core service |
| `searxng` | SearXNG private web search, pinned dated tag `2026.11.5-3e95f6cd2` (feeds OpenClaw via `127.0.0.1:8888` and Open WebUI via `host.docker.internal:8888`) | `127.0.0.1:8888` | Running, restart=always | Yes, core service |
| `open-webui-prev` | Rollback copy, Open WebUI v0.12.5 | none | Stopped, restart=no | Until ~2026-11-12, then delete with its image |
| `qdrant-prev` | Rollback copy, Qdrant v1.19.1 | none | Stopped, restart=no | Until ~2026-11-12, then delete with its image |
| `searxng-prev` | Rollback copy, SearXNG `2026.9.25-12f8b6515` | none | Stopped, restart=no | Until ~2026-11-12, then delete with its image |
| `openclaw-sbx-workspace-<hash>` | OpenClaw agent sandbox, one per chat session (`sandbox.mode: all`, session scope) | none | Running while the session is live | Managed by OpenClaw; disposable |

All three services bind to loopback only (2026-11-02 for Open WebUI, 2026-11-05 for Qdrant and SearXNG). Nothing on the home LAN can reach them directly; other devices use the Tailscale Serve URLs. Containers reach host-published loopback ports through `host.docker.internal` on Docker Desktop.

A stopped `-prev` container must keep `restart=no`: a stopped `always` container restarts when the Docker daemon starts and fights the live container for its port.

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

## Image cleanup

### 2026-11-05

| Image | Used by | Status |
|---|---|---|
| `ghcr.io/open-webui/open-webui:v0.13.0` | `open-webui` | Keep |
| `ghcr.io/open-webui/open-webui:v0.12.5` | `open-webui-prev` | Delete with the rollback (~2026-11-12) |
| `qdrant/qdrant:v1.20.0` | `qdrant` | Keep |
| `qdrant/qdrant:v1.19.1` (same ID as `:latest`) | `qdrant-prev` | Delete both tags with the rollback |
| `searxng/searxng:2026.11.5-3e95f6cd2` | `searxng` | Keep |
| `searxng/searxng:2026.9.25-12f8b6515` | `searxng-prev` | Delete with the rollback |
| `openclaw-sandbox:bookworm-slim` | OpenClaw sandboxes | Keep. **Built locally and not on any registry**, so if it's deleted, run `scripts/sandbox-setup.sh` again |
| `ghcr.io/microsoft/mcp-dotnet-samples/awesome-copilot` (2 tags) | Probably an MCP client that runs `docker run` on demand | Unused; can be pulled again |
| `ghcr.io/github/github-mcp-server:latest` | Probably an MCP client that runs `docker run` on demand | Unused; can be pulled again |

Removed this month: `open-webui:v0.11.4` (~5.9 GB), `open-webui:v0.12.4`, `searxng:latest`, and the September `qdrant-prev` / `searxng-prev` containers. The Open WebUI upgrade script now deletes the image of the rollback container it retires, as long as nothing else uses it.

### 2026-09-25

Docker disk use went from 35.29 GB to 11.43 GB, about 24 GB freed, by deleting six images no container used: `open-webui:v0.11.0`, `open-webui:v0.10.2`, `open-webui:main`, and three untagged `<none>` leftovers from older pulls.
