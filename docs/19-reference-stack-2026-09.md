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
| Agent model bake-off, same web task | `gpt-oss:20b`: correct answer + URL, 52 s. `mistral-small3.1:24b`: 2 min 38 s to first action at 131k ctx, then both tool calls failed and it (honestly) gave up |

## Context budget

Catalog context windows were cut from 131k to 32k for `llama3.1:8b`, `mistral-small3.1:24b`, `gemma3:*` (a 131k KV cache on a 24B model is what made the bake-off run take minutes on 36 GB). `gpt-oss:20b` runs at 64k (`num_ctx` 65536, `contextWindow` 65536 so compaction triggers at the real limit). Open WebUI defaults to 32k.

## Tool-calling bake-off (LM Studio, 2026-09-25)

Harness: OpenAI-compatible calls to LM Studio over the LAN, temperature 0. Easy = 4 single-shot routing cases (web_search / exec / memory_search / no tool) with 6 tools. Hard = 25 tools, ~6k-token system prompt, two-step search then fetch, must answer `v0.34.4` with a GitHub URL.

| Model (LM Studio) | Easy | Hard (multi-step) | Notes |
|---|---|---|---|
| openai/gpt-oss-20b | 4/4 | PASS (33 s) | Exact tag URL |
| google/gemma-4-26b-a4b-qat | 4/4 | PASS (36 s) | Non-QAT build refused by guardrail (~35 GB) |
| liquid/lfm2-24b-a2b | 3/4 (declined `exec`) | PASS (33 s incl. load) | MoE, 2B active; fast once loaded |
| ibm/granite-4-h-tiny | 4/4 | FAIL (search loop) | |
| liquid/lfm2.5-1.2b | 4/4 | FAIL (hallucinated "2.0.0" without fetching) | Router/utility only |
| nvidia-nemotron-3-nano-30b-a3b | 4/4 | FAIL (empty, reasoning ate budget) | |
| phi4:14b (Ollama) | n/a | n/a | No tool support in Ollama; removed from OpenClaw allowlist |

Resulting OpenClaw config: primary `ollama/gpt-oss:20b`; fallbacks `lmstudio/liquid/lfm2-24b-a2b` then `ollama/llama3.1:8b` (cross-engine fallback, so an Ollama tool-parser error does not end the run); `lmstudio/google/gemma-4-26b-a4b-qat` and `lmstudio/liquid/lfm2.5-1.2b` allowlisted. LM Studio provider: `models.providers.lmstudio` (`openai-completions`, `http://127.0.0.1:1234/v1`).

Observed failure worth knowing: `Agent run failed (model: ollama/gpt-oss:20b)` with Ollama returning a malformed-JSON error after the model emitted a bad tool call (about 88k tokens of cumulative context across calls). The same model served by LM Studio passed the hard test.

## Mobile pairing

`gateway.bind` is now `lan` (token auth). Setup codes generate at `ws://<MAC_LAN_IP>:18789`, and OpenClaw automatically downgrades them to **Limited access** because the URL is plaintext. Full access for iPhone/iPad needs `wss://` (Tailscale Serve or a TLS front door). iPad and iPhone paired on 2026-09-25 as Limited access. 2026-09-25 07:45: Tailscale Standalone 1.102.4 installed, Serve enabled, `gateway.tailscale.mode=serve` + `gateway.bind=loopback` (validation requires loopback first, then serve). Gateway reachable at `https://<host>.<tailnet>.ts.net` (200). Old Limited pairings for iPhone and iPad removed; new setup codes issue as **Full access** over `wss://`. Script: `~/Downloads/files/okh-tailscale-setup.sh`: Standalone Tailscale app (the only macOS variant that supports Serve), `gateway.tailscale.mode=serve`, `gateway.bind=loopback`, then re-pair with Full access over `wss://<host>.ts.net`.

Utility model: `lmstudio/liquid/lfm2.5-1.2b` (`agents.defaults.utilityModel`), used for small background jobs only.

## Tool Search off for local models (2026-09-25)

A session started from the iPhone could not browse: `gpt-oss:20b` called `web_search` directly ("Tool web_search not found", because it was deferred behind Tool Search) and sent malformed `tool_search` batches ("set limit on each batch query"). Fix: `tools.toolSearch: false`. Session tool count went from 11 to 20 with web tools directly visible. The same Seahawks question then ran 6 searches and 6 fetches and returned a table (Week 1 vs Patriots 13-10, Sep 9; Week 2 vs Cardinals 31-7, Sep 20). Residual: Ollama's gpt-oss parser sometimes leaks raw Harmony `commentary to=functions...` text into the answer's source list.

Memory budget rule: do not run the same 20B-class model in both engines at once. Loading `openai/gpt-oss-20b` in LM Studio while Ollama held `gpt-oss:20b` and LM Studio held `mistral-small-3.2-24b` was refused by LM Studio's guardrail (HTTP 400 in OpenClaw).

## Skill collection review disabled (2026-09-25)

The weekly "Skill collection review (main)" automation failed 4 runs in a row with `sandbox workspace is not read-write; collection review skipped`. The agent sandbox uses the default `workspaceAccess: none`, and the review is designed to autonomously consolidate, retire and rewrite skills in the agent's skill folder. Here that folder is a symlink into the curated `OKHP3/skillz` repo (`openclaw` family). Granting `rw` would let an unattended 20B model rewrite canonical, git-tracked skills, so the job was turned off instead: `skills.workshop.autonomous.mode: "off"` (global; OpenClaw has no per-agent opt-out yet, see upstream issue #144515). Skill curation stays with the skillz repo tooling (`okhp3-openclaw-skillz-sync`, cataloger).

## Tailscale must stay running (2026-09-25)

Quitting the Tailscale app (for example from the Dock) takes the Mac off the tailnet and every phone/iPad loses OpenClaw ("Gateway reconnect failed ... :443", NSURLError -1001). Settings that avoid it: Launch Tailscale at login ON, Hide Dock Icon ON (the app lives in the menu bar once its windows close), VPN On Demand enabled. Close windows, never Quit. `okh-postboot-check.sh` now also checks the `ts.net` gateway URL and whether the Tailscale app is running.

## Known limits (open items)

- Host-ops skills (for example `okhp3-openclaw-stack-status`) need `curl`/`docker` on the host; the sandboxed agent cannot reach them (`network=none`). Needs a deliberate choice: a separate non-sandboxed ops agent with exec approvals, or keep them CLI-only.
- `gpt-oss:20b` still occasionally treats skill names as tools (`tool_search` / `tool_describe` misfires). `mistral-small3.1:24b` lost the bake-off (tool calls failed), so `gpt-oss:20b` stays primary.
- Full-access mobile pairing needs TLS (`wss://`); LAN pairing is limited access only.
- FileVault is on with no auto-login and `autorestart 0`: services recover after a login, not after an unattended power loss.
- Open WebUI search answers are only as good as the page they land on (it confused LM Studio with another product on the same site).

## Operator scripts

`~/Downloads/files/`: `okh-stack-inventory.sh` (read-only audit), `okh-stack-apply.sh` (update + hardening), `okh-postboot-check.sh` (PASS/FAIL after reboot), `okh-ollama-tune.sh` (memory tuning).

## Publishing hygiene

This repo is public and documents a real machine, so machine and network identifiers are replaced with placeholders: `<MAC_LAN_IP>`, `<ROUTER_IP>`, `<HOME_SSID>`, `<host>.<tailnet>.ts.net`, and `~` for the home path. Hardware serials and UUIDs are never committed. `.gitleaks.toml` holds generic detection rules and `.githooks/pre-commit` enforces them (enable per clone with `git config core.hooksPath .githooks`). Real literal values live only in the untracked `.git/info/okh-denylist`.
