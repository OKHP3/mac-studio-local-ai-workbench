---
title: "Mac Studio Local Workbench Status"
artifact_type: "setup_status"
created_date: "2026-05-12"
machine: "OverKill-Hills-Mac-Studio"
volume: "/Volumes/OKH-Local"
status: "active_setup"
---

# Mac Studio Local Workbench Status

## Operating model

This Mac Studio is the local workbench for the OKHP3 tooling workflow.

Canonical roles:

- Notion = working canon and ideation consolidation surface
- GitHub = durable, versioned, machine-readable corpus
- Mac Studio = local processing, repo mirrors, local AI runtime, export cleanup, and future RAG lab
- Replit = constrained high-cost execution/build layer
- Claude and ChatGPT = senior reasoning and synthesis layer
- Perplexity and Copilot Researcher = research-intern artifact generators

## External workbench root

`/Volumes/OKH-Local`

## GitHub mirrors

Located at:

`/Volumes/OKH-Local/04_GitHub_Mirrors`

Currently cloned:

- OKHP3/OverKill-Hill
- OKHP3/first-diagram-is-a-liar
- OKHP3/mermaid-theme-builder
- OKHP3/mermaid-diagram-bpmn

## Active local AI storage

Normalized active runtime model folders:

- Ollama models: `/Volumes/OKH-Local/07_Local_LLMs/ollama/models`
- LM Studio models: `/Volumes/OKH-Local/07_Local_LLMs/lm-studio/models`

Compatibility symlinks are retained at:

- `/Volumes/OKH-Local/ollama -> /Volumes/OKH-Local/07_Local_LLMs/ollama`
- `/Volumes/OKH-Local/lm-studio -> /Volumes/OKH-Local/07_Local_LLMs/lm-studio`

## Local AI governance folders

Planned governance folders:

- `/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache`
- `/Volumes/OKH-Local/07_Local_LLMs/manifests`
- `/Volumes/OKH-Local/07_Local_LLMs/quarantine`
- `/Volumes/OKH-Local/07_Local_LLMs/mlx`

## Hugging Face cache settings

- `HF_HOME=/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache`
- `HUGGINGFACE_HUB_CACHE=/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache/hub`

## Architecture clarification

GitHub is the durable corpus. It is not automatically a vector database or graph database. RAG behavior requires a retrieval layer such as search, embeddings, connectors, or an index.


## Ollama normalization confirmed

- Date confirmed: 2026-05-12
- Service manager: Homebrew services
- Model path: `/Volumes/OKH-Local/07_Local_LLMs/ollama/models`
- Compatibility symlink: `/Volumes/OKH-Local/ollama -> /Volumes/OKH-Local/07_Local_LLMs/ollama`
- Validation: `ollama list` shows existing models after `brew services start ollama`
- Runtime smoke test: `llama3.1:8b` responded successfully from normalized storage

## Local AI storage verification

- Date verified: 2026-05-12
- `OLLAMA_MODELS=/Volumes/OKH-Local/07_Local_LLMs/ollama/models`
- `HF_HOME=/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache`
- `HUGGINGFACE_HUB_CACHE=/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache/hub`
- Ollama models visible after normalization:
  - llama3.1:8b
  - mistral-small3.1:24b
  - codestral:22b
  - gemma3:27b
  - gemma3:12b
  - phi4:14b
- Active storage:
  - Ollama models: 63G
  - LM Studio models: 27G
  - Hugging Face external cache: validated and migrated to 2.0G on external storage

## Hugging Face cache validation confirmed

- Date confirmed: 2026-05-12
- Authenticated user: `okhp3`
- Token profile: `OKH-Mac-Studio-ReadOnly`
- Token type: fine-grained read-only
- Cache path: `/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache`
- Test download: `bert-base-uncased` with `README.md` and `config.json`
- Validation result: download completed successfully; cache was later migrated and consolidated externally

## Hugging Face internal cache cleanup confirmed

- Date confirmed: 2026-05-12
- Internal cache removed: `~/.cache/huggingface`
- External cache retained: `/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache`
- External cache size after migration: 2.0G
- Marker file created: `~/.cache/HUGGINGFACE_CACHE_MOVED_TO_OKH_LOCAL.txt`

## LAN exposure fix confirmed (2026-09-12)

- Full scan and fix pass to make Mac Studio-hosted services reachable from the <HOME_SSID> LAN (for the Windows/Asus OpenClaw instance and the broader SHOAL local-AI-server goal). Full detail: [`docs/18-lan-exposure-fix-2026-09-12.md`](../docs/18-lan-exposure-fix-2026-09-12.md).
- Current LAN address: `<MAC_LAN_IP>` (Wi-Fi `<HOME_SSID>`).
- Fixed and verified reachable from off-host: LM Studio (1234), Open WebUI (3000), Qdrant (6333/6334 — also fixed a stale `DKH-Local` → `OKH-Local` bind-mount path), SearXNG (8888).
- Still loopback-only, needs Jamie with real terminal access: Ollama (11434) — `launchctl setenv OLLAMA_HOST "0.0.0.0"` + `brew services restart ollama`; OpenClaw Gateway (18789) — no GUI bind-address setting found, likely needs an `openclaw.json` / env-var edit and gateway restart.
- Follow-up: re-check restart policy (`restart: always`) on the three recreated Docker containers; Open WebUI may need a fresh login after container recreation.

## Ollama LAN exposure fixed by Jamie (2026-09-13)

- Ran `launchctl setenv OLLAMA_HOST "0.0.0.0"` + `brew services restart ollama` directly in Terminal. Confirmed via live curl: `http://<MAC_LAN_IP>:11434/api/tags` now returns HTTP 200 — reachable from off-host.
- Open item: that same response was `{"models":[]}` — empty, despite the models listed earlier in this file. Suspect `OLLAMA_MODELS` isn't visible to the `brew services` launchd daemon the way it is to a Terminal session. Needs `launchctl getenv OLLAMA_MODELS` / `ollama list` check and possibly `launchctl setenv OLLAMA_MODELS "/Volumes/OKH-Local/07_Local_LLMs/ollama/models"` + another restart. Not yet re-verified.
- OpenClaw Gateway (18789) remains the only unresolved item from the 2026-09-12 LAN exposure pass — still loopback-only, no GUI setting found.

## Ollama model visibility fixed (2026-09-13, same-day follow-up)

- Root cause confirmed: `launchctl getenv OLLAMA_MODELS` was empty after the LAN-exposure fix, so the `brew services` daemon fell back to Ollama's default (empty) model directory.
- Fix: `launchctl setenv OLLAMA_MODELS "/Volumes/OKH-Local/07_Local_LLMs/ollama/models"` + `brew services restart ollama`.
- `ollama list` now shows all 10 models: ministral-3:8b, command-r7b:latest, llama3.2:3b, nomic-embed-text:latest, llama3.1:8b, mistral-small3.1:24b, codestral:22b, gemma3:27b, gemma3:12b, phi4:14b.
- Confirmed visible over the LAN via live curl to `http://<MAC_LAN_IP>:11434/api/tags`, not just locally.
- Ollama LAN exposure is now fully resolved end to end. Only remaining open item from the 2026-09-12/13 passes is the OpenClaw Gateway (18789) bind address.

## Cross-repo program tracker (2026-09-20)

- A standing readiness/blocker tracker across all three SHOAL repos (this one, infusing-a-soul, shoal-ai-server) now lives at `shoal-ai-server/docs/program-status.md`. Check it first in a new thread before re-deriving status.
- New finding not yet reflected above: OpenClaw Control on this Mac is currently showing a failed auto-update (2026-09-19) and reports its configured model as unavailable — separate from anything in the LAN-exposure work above. Not yet fixed. See the program tracker for detail.

## LM Studio provider add attempt on this Mac's own OpenClaw (2026-09-20)

- Attempted to add LM Studio as a second model provider inside OpenClaw Control's Models settings page, per Jamie's approval to keep working past the broken-update state.
- Blocked by the GUI itself, independent of the broken-update issue: the "Add provider" quick-add form only offers a closed list of named cloud providers (Anthropic, Google, Huggingface, Litellm, Nvidia, Ollama Cloud, OpenAI, Opencode Go, OpenRouter, Together, Xai), each with just a provider + API-key field pair. No base-URL override is exposed for any of them.
- Selecting "OpenAI" does not reveal a custom endpoint field — saving a key there would point at the real OpenAI cloud API, not at LM Studio's local server. Not done.
- Backed out of the Add Provider form cleanly (Cancel) with nothing saved.
- Conclusion: the CLI path (`openclaw config set models.providers.lmstudio.type openai` / `.baseUrl http://<MAC_LAN_IP>:1234/v1` / `.apiKey lmstudio`) is required on this Mac too, same as the Windows playbook in `infusing-a-soul`. That in turn needs blocker #1 (the failed update / `openclaw triage`) resolved first, since a broken install is not a reliable place to run config commands. Full detail and cross-repo status: `shoal-ai-server/docs/program-status.md`.

## Stack update + reboot hardening (2026-09-24)

- Versions after pass: OpenClaw 2026.9.6 (npm, managed update verified), Ollama 0.34.4 (brew), Node 26.10.0, Open WebUI v0.11.4, Qdrant v1.19.1, SearXNG 2026.9.23, LM Studio 0.4.25+1 (already current), Docker Desktop 4.92.0 (already current).
- Reboot finding confirmed: the 2026-09-13 `launchctl setenv` fix for Ollama did not survive the ~2026-09-15 reboot (Ollama was back to loopback-only with an empty model dir). Fix: new LaunchAgent `~/Library/LaunchAgents/com.okh.ollama-env.plist` runs `~/.okh/bin/ollama-env.sh` at login; it waits for `/Volumes/OKH-Local`, sets `OLLAMA_HOST=0.0.0.0:11434` and `OLLAMA_MODELS=/Volumes/OKH-Local/07_Local_LLMs/ollama/models`, then `launchctl kickstart -k gui/$UID/sh.brew.ollama`. Log: `~/Library/Logs/okh-ollama-env.log`. All 11 models visible again; `gpt-oss:20b` (pulled 2026-09-23 into the default `~/.ollama/models`) merged into OKH-Local.
- Qdrant and SearXNG had been down since 2026-09-15 (Exited 255, `unless-stopped` did not bring them back). Recreated on latest images with `--restart always`; `open-webui` also switched to `always`. Rollback copies kept: `qdrant-prev`, `searxng-prev`, `open-webui-v0.11.0` (stopped).
- OpenClaw update failure root causes (not just model setup): (1) `duckduckgo` plugin install incomplete (missing package.json) failed candidate plugin resolution; (2) state DB already at schema 18, unreadable by 2026.9.4; (3) default model `ollama/gpt-oss:20b` missing from `models.providers.ollama.models` catalog. Fixed by npm install of 2026.9.6, `openclaw plugins update` for codex/discord/duckduckgo, adding a gpt-oss:20b catalog entry (num_ctx 65536, tools on), then a clean managed `openclaw update` ("restarted and verified").
- OpenClaw backups now work: `~/.openclaw/cache` symlink changed from absolute to relative (`../../../Volumes/OKH-Local/07_Local_LLMs/openclaw/cache`); first archive written to `~/`.
- Reboot posture: all services user-level (LaunchAgents + login items: Docker Desktop, LM Studio, OpenClaw Control). FileVault on and no auto-login, so nothing starts until login. `pmset autorestart` still 0 (declined this pass).
- Open items: gateway still loopback-only (18789); memory search points at OpenAI with no key; stale `gemma4` catalog entry; no command owner set; controlled reboot test not yet run.
- Scripts used (run from Jamie's Terminal): `~/Downloads/files/okh-stack-inventory.sh`, `okh-stack-apply.sh`, `okh-stack-fix3.sh` with logs alongside.
- Reboot test PASSED (2026-09-24 23:08 login, check at +5 min): `com.okh.ollama-env` re-applied env at 23:09, Ollama on `*:11434` with 11 models, all 9 endpoints (Ollama/LM Studio/Open WebUI local+LAN, Qdrant, SearXNG, OpenClaw gateway) returned 200, containers auto-started, OpenClaw 2026.9.6 gateway up, gpt-oss:20b inference OK. Only residual: `openclaw models list` / `models status` "Allowed (1)" still shows only phi4:14b, but `openclaw models list --all --provider ollama` shows `ollama/gpt-oss:20b` as `default,configured` with auth OK, config and allowlist are correct, `agents.list` is empty and the agent `models.json` is `{}`. Treated as an OpenClaw 2026.9.6 display quirk, not a routing fault (inference on gpt-oss:20b verified). Note: `--all` also lists `gemma4` as local/auth OK even though it is not pulled, so that view reflects config, not Ollama inventory. Script: `~/Downloads/files/okh-postboot-check.sh`.
- Post-reboot autopilot pass (2026-09-24 ~23:25, via OpenClaw Control UI):
  - Memory search switched from `openai` (no key, silently broken) to provider `ollama` / model `nomic-embed-text`; Memory > Engine health shows Embeddings **Ready**.
  - SearXNG OpenClaw plugin enabled (was disabled, so Search reported "No search provider available"); Search > Test SearXNG Search succeeded (~1.1 s).
  - Live agent test on `ollama/gpt-oss:20b`: model route and tool execution work, but the agent never reached a web-search tool. It looped on `tool_search`, `SKILL.md` reads and `curl` (fails: sandbox containers run `network=none`), then ended with `tool_search tool validation failed: invalid arguments`. The "Ask OpenClaw" helper panel has no tools and hallucinated an Ollama version (v0.6.1); do not use it for factual checks.
  - Open item: expose the web_search tool to the main agent (tool profile / sandbox policy) and re-test; consider a stronger tool-calling model if gpt-oss:20b keeps mis-forming `tool_search` arguments.
- 2026-09-25 tuning pass: root cause of OpenClaw "Allowed models (1)" was `agents.defaults.modelPolicy.allow` pinned to phi4 (now gpt-oss:20b, mistral-small3.1:24b, llama3.1:8b, gemma3:27b, phi4:14b); stale `gemma4` catalog entry removed; fallback normalized to `ollama/llama3.1:8b`. Web search fixed for the sandboxed agent via `tools.sandbox.tools.alsoAllow: ["group:web","group:memory"]` (agent returned v0.34.4 + GitHub URL). Open WebUI: LM Studio connection added (prefix `lmstudio`), SearXNG web search enabled (lang `en`, 5 results), gpt-oss:20b default with web search on + cite-sources prompt, num_ctx 32768, task model llama3.2:3b, compaction at 24k. Reference write-up: [`docs/19-reference-stack-2026-09.md`](../docs/19-reference-stack-2026-09.md).
