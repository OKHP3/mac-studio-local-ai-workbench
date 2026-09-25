---
title: Mac Studio local inference reference stack (September 2026)
updated_date: 2026-09-25
status: current
---

# Mac Studio local inference reference stack (September 2026)

One Mac Studio M4 Max (36 GB unified memory) serving local models to a chat UI, an agent runtime, and the home LAN. Everything below was verified live on 2026-09-24/25, including a cold reboot.

## Topology

| Layer | Component | Version | Bind | Starts via | Self-heals |
|---|---|---|---|---|---|
| Inference | Ollama (brew) | 0.34.4 | `0.0.0.0:11434` | `sh.brew.ollama` + `com.okh.ollama-env` LaunchAgents | launchd KeepAlive |
| Inference | LM Studio (headless service) | 0.4.25 | `0.0.0.0:1234` | Login item + "Enable Local LLM Service" | App service |
| Chat UI | Open WebUI (Docker) | v0.11.4 | `:3000` | Docker Desktop autostart | `--restart always` |
| Retrieval | Qdrant (Docker) | v1.19.1 | `:6333/6334` | Docker Desktop autostart | `--restart always` |
| Search | SearXNG (Docker) | 2026.9.23 | `:8888` | Docker Desktop autostart | `--restart always` |
| Agent | OpenClaw gateway ("Larry") | 2026.9.6 | `127.0.0.1:18789` | `ai.openclaw.gateway` LaunchAgent | KeepAlive |
| Runtime | Docker Desktop / Node | 4.92.0 / 26.10.0 | n/a | Login item / brew | n/a |

## Design decisions (and why)

1. **Two inference engines, one job each.** Ollama is the always-on API for agents and Open WebUI (GGUF, tool-calling models). LM Studio is the MLX lab: JIT loading, auto-evict, 15 min idle TTL, so it holds zero memory until asked.
2. **Environment is re-applied at every login.** `launchctl setenv` does not survive a reboot (proven 2026-09-15). `~/.okh/bin/ollama-env.sh` waits for the `OKH-Local` volume, sets `OLLAMA_HOST` / `OLLAMA_MODELS` (and, via `okh-ollama-tune.sh`, flash attention, q8_0 KV cache, 32k context, 1 parallel slot, 2 resident models, 15 min keep-alive), then kickstarts the brew service.
3. **Containers use `restart: always`, not `unless-stopped`.** Qdrant and SearXNG sat dead for 9 days after a Docker restart under `unless-stopped` with a bind mount on an external volume.
4. **Default agent model is `gpt-oss:20b`.** Tool-calling capable, Western-origin, fits beside a second model. `gemma3` is excluded from agent use (no tool support in Ollama; web tools denied for it). Fallback: `llama3.1:8b`.
5. **Agent sandbox stays on (`sandbox.mode: all`), web tools are explicitly re-allowed.** `tools.sandbox.tools.alsoAllow: ["group:web","group:memory"]`. Without it, `web_search` is enabled and "live" in the UI but filtered out of sandboxed sessions, and the model loops on `tool_search`.
6. **The model allowlist is explicit.** `agents.defaults.modelPolicy.allow` is the list the UI and model picker honor. It was pinned to `phi4:14b` only, which is why "Allowed models (1)" never changed no matter what the provider catalog said.
7. **Memory and search are local.** OpenClaw memory search uses Ollama `nomic-embed-text` (was OpenAI with no key, silently broken). Web search for both OpenClaw and Open WebUI goes through the local SearXNG container.
8. **Open WebUI sees both engines.** Ollama at `host.docker.internal:11434`; LM Studio as an OpenAI-compatible connection at `host.docker.internal:1234/v1` with prefix `lmstudio.` so identical model names don't collide.
9. **Open WebUI defaults tuned for a 36 GB box.** Default model `gpt-oss:20b` with web search on by default and a "search first, cite, don't guess" system prompt; `num_ctx` 32768; background tasks (titles, follow-ups) on `llama3.2:3b`; context compaction at 24k tokens.

## Verification evidence

| Check | Result |
|---|---|
| Cold reboot, all 9 HTTP endpoints (local + LAN) | 200 at +5 min, no manual steps |
| Ollama models visible after reboot | 11/11 |
| OpenClaw agent, web search task | `v0.34.4` + GitHub release URL in 52 s on `gpt-oss:20b` |
| Open WebUI, web search task | Correct Ollama version, cited `github.com` |
| OpenClaw memory embeddings | Ready (Ollama / nomic-embed-text) |
| OpenClaw config edits | Hot-reloaded, `valid: true` in config audit |

## Known limits (open items)

- Host-ops skills (for example `okhp3-openclaw-stack-status`) need `curl`/`docker` on the host; the sandboxed agent cannot reach them (`network=none`). Needs a deliberate choice: a separate non-sandboxed ops agent with exec approvals, or keep them CLI-only.
- `gpt-oss:20b` still occasionally treats skill names as tools (`tool_search` / `tool_describe` misfires). A 24B-class tool model (`mistral-small3.1:24b`) is allowlisted for comparison.
- Gateway is loopback-only; LAN pairing (SHOAL) needs `gateway.bind=lan` plus token auth.
- FileVault is on with no auto-login and `autorestart 0`: services recover after a login, not after an unattended power loss.
- Open WebUI search answers are only as good as the page they land on (it confused LM Studio with another product on the same site).

## Operator scripts

`~/Downloads/files/`: `okh-stack-inventory.sh` (read-only audit), `okh-stack-apply.sh` (update + hardening), `okh-postboot-check.sh` (PASS/FAIL after reboot), `okh-ollama-tune.sh` (memory tuning).
