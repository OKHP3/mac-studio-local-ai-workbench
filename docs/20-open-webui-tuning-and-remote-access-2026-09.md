# 20 — Open WebUI tuning and cross-device access (2026-09-25)

Scope: Open WebUI v0.11.4 (Docker, `:3000`) on the Mac Studio. Companion to [19](19-reference-stack-2026-09.md). Tailnet names are redacted as `<host>.<tailnet>.ts.net`.

## Decision: one tailnet HTTPS URL for every device

The Edge PWA is synced across Mac, ASUS, iPhone and iPad. A PWA installed from `http://localhost:3000` (or `127.0.0.1`) only works on the Mac. A PWA's identity is its origin (scheme + host + port), so the fix is to install it once from an origin every device can resolve.

**Chosen:** Tailscale Serve, tailnet-only, on HTTPS port 8443:

```
https://<host>.<tailnet>.ts.net:8443   ->  http://127.0.0.1:3000
```

- Port 443 on the same name already belongs to the OpenClaw gateway (`gateway.tailscale.mode=serve`, a foreground claim). The bare `https://<host>.<tailnet>.ts.net` opens OpenClaw Control, not Open WebUI.
- Open WebUI does not support sub-path hosting (`/openwebui`), so a separate port is required, not a path.
- The Mac is on the tailnet too, so the same URL works locally. Every device needs the Tailscale client running.

| Option | Works off-LAN | HTTPS (installable PWA) | Effort | Verdict |
|---|---|---|---|---|
| Tailscale Serve `:8443` | Yes | Yes (ts.net cert) | One command | **Chosen** |
| Tailscale Services (`openwebui.<tailnet>.ts.net`) | Yes | Yes | Host must switch to tag-based identity | Later, if clean hostnames matter |
| LAN IP `http://<MAC_LAN_IP>:3000` | No | No | None | Rejected: DHCP drift already bit this stack, no secure context |
| Caddy front door with local subdomains | LAN only | Needs internal CA on every device | High | Parked (see `local-web-portal-https.md`) |

Script: `~/Downloads/files/okh-openwebui-tailscale.sh` (apply) / `--off` (revert). It verifies `/health` over the tailnet and confirms the OpenClaw root still answers.

## Finding: every container recreate logs out all devices

`start.sh` writes the JWT signing key to `/app/backend/.webui_secret_key` when `WEBUI_SECRET_KEY` is unset. That path is outside the `open-webui:/app/backend/data` volume, so each upgrade or recreate mints a new key and invalidates every session, including every PWA. This explains the "may need to re-login" note in doc 18.

Fix: `WEBUI_SECRET_KEY_FILE=/app/backend/data/.webui_secret_key`, seeded from the current key so the fix itself causes no logout. Scripts: `okh-openwebui-recreate.sh`, `okh-openwebui-tune.sh` (DB settings, backup first), `okh-openwebui-audit.sh`. Script: `okh-openwebui-recreate.sh` (dry run by default; `--apply`; `OWUI_IMAGE=...` doubles as the upgrade path). It keeps `open-webui-prev` with `restart=no` (a stopped `always` container restarts on daemon start and fights for `:3000`) and auto-rolls back on a failed health check.

## Configuration model gotcha

In v0.11 most settings are persisted per key in the `config` table (`webui.url`, `task.*`, `rag.*`, `web.search.*`). After first launch the database wins over environment variables (`ENABLE_PERSISTENT_CONFIG=True` default). Change these in **Admin Panel > Settings**, not in `docker run -e`. Env-only knobs (`WEBUI_SECRET_KEY_FILE`, `VECTOR_DB`, `CORS_ALLOW_ORIGIN`, thread pool, timeouts) need a recreate.

## Tuning targets (quality over speed)

| Area | Setting (Admin Panel > Settings) | Code default | Target | Why |
|---|---|---|---|---|
| General | WebUI URL | empty | `https://<host>.<tailnet>.ts.net:8443` | Correct links, notifications, future OAuth |
| Interface | Local task model | current model | `llama3.2:3b` (already) | Titles/queries off the 20B |
| Interface | External task model | current model | `llama3.2:3b` | Otherwise LM Studio chats run background tasks on the big LM Studio model, triggering JIT loads |
| Interface | Autocomplete | off | off | Per-keystroke inference; highest-cost task |
| Interface | Tags / Follow-ups | on / on | off / off | Extra inference after every answer, low value single-user |
| Interface | Search + retrieval query generation | on | on | Drives web-search quality |
| Web Search | Result count | 3 | 8 | Mirrors OpenClaw `maxResults: 8` |
| Web Search | Bypass embedding and retrieval | off | off | With 32k to 64k context, full-page stuffing of 8 results overflows |
| Documents | Embedding engine/model | code default is SentenceTransformers on CPU | Ollama `nomic-embed-text` (Metal) | Already set on this host |
| Documents | Hybrid search + reranker | off | on, `BAAI/bge-reranker-v2-m3` | Better precision; reranker runs on CPU, back off first if latency hurts |
| Documents | Top K / Top K reranker | 3 / 3 | 8 / 5 | More candidates, reranker trims |
| Models | `gpt-oss:20b` `think` | default | high | Matches OpenClaw `thinkingDefault: high` |
| Models | `gpt-oss:20b` `num_ctx` | 32768 | 65536 | Matches OpenClaw; room for search + RAG context |
| Models | Unused models | visible | hidden | Cleaner picker, fewer accidental JIT loads |

Deferred: Qdrant as `VECTOR_DB` (recreate + reingest; do it when knowledge bases grow), Tika/Docling extraction, explicit `CORS_ALLOW_ORIGIN` (current `*` is acceptable on a tailnet/LAN-only single-user box; an explicit list breaks websockets whenever the LAN IP drifts).

## Runbook

1. `./okh-openwebui-audit.sh` (read-only baseline).
2. `./okh-openwebui-recreate.sh`, review, then `--apply`.
3. `./okh-openwebui-tailscale.sh`.
4. Admin UI changes from the table; Documents > Reindex if the embedding model changed.
5. Reinstall the PWA from the tailnet URL on the Mac; remove the localhost PWA (`edge://apps`). Edge sync carries it to the ASUS. iPhone/iPad: open the URL, Share > Add to Home Screen, delete the old icon.
6. Re-run the audit and compare.

## Applied 2026-09-25 (verified by re-audit)

| Item | Result |
|---|---|
| Session key | `WEBUI_SECRET_KEY_FILE` on the volume; old in-image key gone. Recreate kept everyone signed in. `open-webui-prev` retained, restart=no |
| Tailscale Serve | `https://<host>.<tailnet>.ts.net:8443` -> `127.0.0.1:3000`, tailnet only, `/health` 200; OpenClaw root still 200 |
| Config (DB) | `webui.url` set; `task.model.external=llama3.2:3b`; tags + follow-ups off; `web.search.result_count` 5 -> 8; hybrid search on with `BAAI/bge-reranker-v2-m3` (CrossEncoder loaded, ~2 GB cached); `rag.top_k` 8, `rag.top_k_reranker` 5 |
| gpt-oss:20b | `think: high`, `num_ctx: 65536` (Ollama root param; Open WebUI maps `think`, not `reasoning_effort`, for Ollama). System prompt kept. Same 64k as OpenClaw, so switching between the two no longer forces a reload |
| Already correct | Embeddings were already Ollama `nomic-embed-text`: no reindex needed |
| Footprint | open-webui 1.1 GiB RSS in an 8 GiB Docker VM; gpt-oss 76 tok/s generation warm |

Lesson: the `config.value` column has NUMERIC affinity, so numeric settings are stored as integers and everything else as JSON text. Direct edits must handle both (first tune run aborted before commit on this; no partial writes).

## Agent skills (OKHP3/skillz -> Open WebUI native Skills)

Open WebUI v0.11 has first-class Skills (`skill` table, Workspace > Skills). With native function calling (the default) every **active** skill is listed by id, name and description in an `<available_skills>` block appended to the system prompt, and the model pulls the full body on demand with the built-in `view_skill` tool. Typing `$` in the chat box picks a skill and injects its full content directly. Inactive skills are invisible to both paths until toggled on.

Design (revised 2026-09-25: quality over quantity):
- New `openwebui` host family in OKHP3/skillz (branch `feat/openwebui-family`): `okhp3-openwebui-research-brief`, `-decision-memo`, `-draft-critique`, `-capture-note` (Open WebUI Notes via `write_note`), `-model-compare`. Written for Open WebUI built-in tools and 20B local models; validated with agentskills `skills-ref` and the repo's catalog-integrity suite.
- `openwebui/FAMILY.md` declares the loadout between `OPENWEBUI_LOADOUT` markers: the 5 native skills plus 7 portable ones (evidence-standard, session-handoff, linkedin voice/post/comment, mermaid core/repair). ~1.2k manifest tokens per prompt.
- Copilot Cowork skills were rejected for this host: their contract returns `NOT SUPPORTED` on mobile, the main Open WebUI surface.
- `okh-openwebui-skills-sync.sh` imports only the loadout (all active) and deactivates any other skillz skill already in Open WebUI. `SKILLZ_SOURCE`/`SKILLZ_REF` select the clone and branch; default GitHub `main`.
- Scripts are listed as reference only (no terminal). Evals, agent metadata, and benchmarks are not inlined.

## Sources

- Open WebUI performance guide: https://docs.openwebui.com/troubleshooting/performance/
- Open WebUI hardening: https://docs.openwebui.com/getting-started/advanced-topics/hardening/
- Open WebUI env configuration (PersistentConfig): https://docs.openwebui.com/reference/env-configuration/
- Open WebUI connection errors (CORS and websockets): https://docs.openwebui.com/troubleshooting/connection-error/
- Open WebUI v0.11.4 source: `backend/start.sh`, `backend/open_webui/config.py`, `backend/open_webui/models/config.py`
- Sub-path limitation: https://github.com/open-webui/open-webui/issues/17257
- Tailscale Serve CLI: https://tailscale.com/docs/reference/tailscale-cli/serve
- Tailscale Services: https://tailscale.com/docs/features/tailscale-services
- OpenClaw Tailscale integration: https://docs.openclaw.ai/gateway/tailscale
