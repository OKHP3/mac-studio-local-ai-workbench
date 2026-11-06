---
title: Mac Studio local inference reference stack (September 2026)
updated_date: 2026-11-05
status: current
---

# Mac Studio local inference reference stack (September 2026)

One Mac Studio M4 Max (36 GB unified memory) serving local models to a chat UI, an agent runtime, and the home LAN. Everything below was verified live on 2026-09-24/25, including a cold reboot. Versions and binds in the topology table are current as of 2026-11-05; see [November 2026 update](#november-2026-update-2026-11-02-to-2026-11-05).

## Topology

| Layer | Component | Version | Bind | Starts via | Self-heals |
|---|---|---|---|---|---|
| Inference | Ollama (brew) | 0.40.14 | `127.0.0.1:11434` + Tailscale Serve TCP `11434` (tailnet only) | `sh.brew.ollama` + `com.okh.ollama-env` LaunchAgents | launchd KeepAlive |
| Inference | LM Studio (headless service) | 0.4.28 | `127.0.0.1:1234`, token required | Login item + "Enable Local LLM Service" | App service |
| Chat UI | Open WebUI (Docker) | v0.13.0 | `127.0.0.1:3000` (Tailscale Serve `:8443`) | Docker Desktop autostart | `--restart always` |
| Retrieval | Qdrant (Docker) | v1.20.0 (pinned tag) | `127.0.0.1:6333/6334` | Docker Desktop autostart | `--restart always` |
| Search | SearXNG (Docker) | 2026.11.5 (pinned dated tag) | `127.0.0.1:8888` | Docker Desktop autostart | `--restart always` |
| Agent | OpenClaw gateway ("Larry") | 2026.11.1 (auto-updates) | `127.0.0.1:18789` (Tailscale Serve `:443`) | `ai.openclaw.gateway` LaunchAgent | KeepAlive |
| Network | Tailscale Standalone | 1.104.5 | tailnet | Login item + VPN On Demand | `com.okh.tailscale-guard` LaunchAgent (every 60 s) |
| Runtime | Docker Desktop / Node | 4.97.0 / 26.13.0 | n/a | Login item / brew | n/a |

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
- FileVault is on with no auto-login. `pmset autorestart 1` (found reset to 0 on 2026-11-03, restored 2026-11-05) brings the Mac back after a power loss, but services start only after someone logs in at the FileVault prompt.
- Open WebUI search answers are only as good as the page they land on (it confused LM Studio with another product on the same site).

## Closeout (2026-09-25 to 2026-09-27): resolved

The original ask: every component on its latest mainstream version, and every component back on its own after a reboot. Both are met and proven.

| Check | Result |
|---|---|
| Versions | OpenClaw 2026.9.6, Ollama 0.34.4, LM Studio 0.4.25, Docker Desktop 4.92.0, Tailscale 1.102.4, Open WebUI v0.11.4, Qdrant v1.19.1, SearXNG 2026.9.25: all current against npm, Homebrew, GitHub releases and Docker Hub |
| Cold reboot, no manual launches | All services back; 7/7 health checks PASS (Ollama, LM Studio, Open WebUI, Qdrant, SearXNG, OpenClaw `readyz`, Tailscale Serve URL) |
| OpenClaw Updates page | "Up to date"; last managed update succeeded; rollback cleanup preview had nothing to retire |

What changed in this pass:

1. **Containers pinned.** Qdrant and SearXNG moved off `:latest` to explicit tags, matching Open WebUI. Floating tags made "current" unverifiable.
2. **Model pruning.** About 230 GB of duplicate, superseded and bake-off-failing models removed (LM Studio 268 GB to 97 GB, Ollama 95 GB to 34 GB). OpenClaw's allowlist, per-model defaults and Ollama catalog were pruned to match, so no picker offers a model that no longer exists.
3. **Accuracy over speed.** `agents.defaults.thinkingDefault: "high"`, `tools.web.search.maxResults: 8`, and a "Research & Accuracy Standard" in the agent workspace `AGENTS.md`: current facts need live sources, 2+ searches, read 2 to 3 pages, prefer primary sources, cross-check, state freshness, never gap-fill, cite. The bar is an answer at least as good as a careful manual search. `/think low` per message when speed matters more.
4. **One app address for every device.** Edge syncs installed web apps across desktops, so an app installed from `localhost` breaks everywhere except the Mac. OpenClaw Control is installed from `https://<host>.<tailnet>.ts.net/` instead, which works on the Mac, the Windows laptop (with Tailscale) and iPhone/iPad.

Root causes worth remembering:

- "Provider rejected the request schema or tool payload" was OpenClaw's rendering of an HTTP 400 from LM Studio's memory guardrail. One old session was pinned to LM Studio's copy of gpt-oss while Ollama's copy was already resident. The duplicate model is gone.
- Doctor's "device-required" gateway error is doctor's own probe. Run `openclaw doctor --allow-exec` when gateway credentials come from the keychain.
- `brew outdated` flags LM Studio and Docker Desktop because both self-update and Homebrew's record goes stale. Compare app bundle versions instead.

## November 2026 update (2026-11-02 to 2026-11-05)

### Versions brought current

| Component | Before | After | How |
|---|---|---|---|
| Open WebUI | v0.11.4 | v0.13.0 | `okh-openwebui-upgrade.command` (see doc 20) |
| Ollama | 0.34.4 | 0.40.14 | `brew upgrade ollama`, then `brew services restart ollama` |
| Qdrant | v1.19.1 | v1.20.0 | Container clone with data backup and rollback |
| SearXNG | 2026.9.25 | 2026.11.5 | Container clone with rollback |
| OpenClaw | 2026.10.5 | 2026.11.1 | Its own auto-update (after Node was raised) |
| Node | 26.10.0 | 26.13.0 | brew |
| Tailscale | 1.104.1 | 1.104.5 | App menu > Check for Updates, then Relaunch |
| LM Studio | 0.4.26 | 0.4.28 | Its own updater |

How "latest" is checked: GitHub's releases API (`/repos/<owner>/<repo>/releases/latest`), the npm registry, the Homebrew formula and cask APIs, Docker Hub's tags API for SearXNG, and the vendors' own pages for LM Studio and Docker Desktop. Not GitHub's releases web page, which served a stale "latest" on 2026-11-02.

### What changed and why

1. **Loopback-only containers.** Open WebUI, Qdrant and SearXNG now publish on `127.0.0.1` only. Qdrant has no API key, so on all interfaces anything on the LAN could read or write it. Every consumer was checked first: OpenClaw uses `127.0.0.1:8888`, and Open WebUI uses `host.docker.internal:8888`, which still works because Docker Desktop routes that name to the host's loopback.
2. **Ollama 0.40 runs on MLX by default on Apple Silicon.** Engine change, not just a version bump. Test generations on `llama3.2:3b` and `gpt-oss:20b` passed and the tuning environment was unchanged, but the first start after the upgrade took about 6 minutes before the API answered.
3. **Tailscale guard.** OpenClaw 2026.10.x refuses to start without Tailscale ("managed ingress remains required"). `com.okh.tailscale-guard` runs every 60 seconds: if the Tailscale app isn't running it opens it; if the backend isn't `Running` it runs `tailscale up` with no flags; if the gateway's tailnet URL fails three checks in a row it restarts the gateway (at most once per 15 minutes). It never acts on `NeedsLogin`. Turn it off with `touch ~/.okh/tailscale-guard.disabled`; log at `~/Library/Logs/okh-tailscale-guard.log`.
4. **Open WebUI sub-agent limits** tightened to 2 concurrent / 2 background / 20 tool loops (doc 20).
5. **Ollama off the home network, still on the tailnet (2026-11-06).** Its request log showed the Windows laptop calling it over Tailscale as recently as 2026-10-22, so a Mac-only bind would have broken that. `OLLAMA_HOST` is now `127.0.0.1:11434` (in `~/.okh/bin/ollama-env.sh`), and `tailscale serve --bg --tcp 11434 tcp://127.0.0.1:11434` republishes the same port on the tailnet only. Verified: loopback 200, Open WebUI via `host.docker.internal` 200, tailnet address 200 with a test generation, LAN address closed. Undo with `tailscale serve --tcp=11434 off` and the `.bak` copy of the env script.
6. **LM Studio requires a token and listens on loopback only (2026-11-06).** One token per client: `openclaw` (Keychain service `openclaw-lmstudio-api-key`, read by OpenClaw's Keychain SecretRef resolver) and `open-webui` (stored in Open WebUI's LM Studio connection). Serve on Local Network and per-request MCPs are off. The laptop keeps using the Mac's models through LM Link, which doesn't depend on the LAN server. Verified: no token 401, each client's token 200, LAN and tailnet addresses closed. Lesson: a hidden terminal prompt gives no feedback, and one token was pasted twice (twice the normal length, rejected with 401); check stored length when a token fails.

### Incidents and root causes

| Date | Symptom | Root cause | Fix |
|---|---|---|---|
| 2026-11-02 | OpenClaw tailnet URL (`:443`) refused; Open WebUI `:8443` fine | OpenClaw auto-update to 2026.10.9 failed in npm preinstall (needed Node 26.12.1 or newer, Mac had 26.10.0). The gateway stayed up but lost its Tailscale Serve claim | `openclaw gateway restart`; Node to 26.13.0; update completed |
| 2026-11-03 | Everything on the tailnet down after an overnight reboot; load average ~25 | Tailscale came back stopped. OpenClaw crash-looped (launchd ran it 235 times) because it requires Tailscale | `tailscale up` with **no flags** (any flag triggers the "mention all non-default flags" check). Prevention: the Tailscale guard above |

Gotchas: the post-boot test now reads boot time with `sed -E 's/^\{ sec = ([0-9]+),.*/\1/'` (the first version matched `usec`). `tailscale serve status` never lists OpenClaw's `:443` claim even when it's healthy, so probe it with `curl`. `tailscale update` is a silent no-op on the Standalone app; update from the app instead. Homebrew can't quit apps for a cask upgrade unless Terminal has Automation permission for System Events.

### Cold-reboot retest

PASS, 2026-11-06 00:07 CT, after `pmset -a autorestart 1` was restored (still 1 after the reboot). FileVault login is still a manual step, so times are measured from login by a one-shot LaunchAgent (`com.okh.postboot-test`):

| Service | Up after login |
|---|---|
| Tailscale (Running), LM Studio `:1234` | +3 s |
| Docker, Qdrant, SearXNG, Ollama | +27 s |
| OpenClaw loopback and tailnet `:443`, Open WebUI `:3000` and tailnet `:8443` | +40 s |
| `gpt-oss:20b` first generation (cold load) | 32 s |

No manual launches. The Tailscale guard took no action (Tailscale came up by itself). Ollama's tuning environment (flash attention, q8_0 KV cache, 32k context) was applied at login.

## Operator scripts

`~/Downloads/files/`: `okh-stack-inventory.sh` (read-only audit), `okh-stack-apply.sh` (update + hardening), `okh-postboot-check.sh` (PASS/FAIL after reboot), `okh-ollama-tune.sh` (memory tuning), `okh-final-verify.sh` (installed vs latest, auto-start wiring, health, OpenClaw update follow-ups; read-only), `okh-final-fixes.sh` (container tag pinning with auto-rollback), `okh-model-cleanup.sh` (dry-run-first model pruning; LM Studio folders moved, not deleted).

November 2026 (same folder; `.command` files are double-clicked on the Mac): `okh-openwebui-upgrade.command` (Open WebUI upgrade with database copy, rollback and image pruning), `okh-maint-20261105.command` (Qdrant, SearXNG, Ollama, LM Studio, Tailscale upgrades with backups and rollback), `okh-prereboot-20261105.command` (loopback rebinds, Tailscale guard, Ollama model pulls, one-shot post-boot timing test), `okh-ts-health-20261105.command` (after any Tailscale change: bring it up if stopped, check both tailnet URLs, restart the gateway if needed).

## Publishing hygiene

This repo is public and documents a real machine, so machine and network identifiers are replaced with placeholders: `<MAC_LAN_IP>`, `<ROUTER_IP>`, `<HOME_SSID>`, `<host>.<tailnet>.ts.net`, and `~` for the home path. Hardware serials and UUIDs are never committed. `.gitleaks.toml` holds generic detection rules and `.githooks/pre-commit` enforces them (enable per clone with `git config core.hooksPath .githooks`). Real literal values live only in the untracked `.git/info/okh-denylist`.
