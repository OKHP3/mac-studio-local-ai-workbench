---
title: "Build Journey"
artifact_type: "build_log"
created_date: "2026-05-13"
updated_date: "2026-05-28"
project: "Mac Studio Local AI Workbench"
status: "complete"
---

# Build Journey

10 days to baseline. 15 more days to agent layer.

## 2026-05-03 — Hardware planning and research

**Did:** Researched the full local AI stack before hardware arrived. Evaluated Ollama vs LM Studio vs direct MLX inference, MLX vs llama.cpp performance on Apple Silicon, HuggingFace tier requirements, and model selection policy.

**Decided:** Ollama + LM Studio + Open WebUI stack. HuggingFace free tier confirmed sufficient for model downloads. Western-lab models only — Meta, Google, Mistral, Microsoft.

**Rationale for Western-only policy:** Chinese cloud AI services operate under PRC data law. Open-weight models from Chinese labs are architecturally safe when run locally (weights have no network access once downloaded), but maintaining a clean Western-only boundary is simpler to reason about and easier to defend.

---

## 2026-05-04 — Hardware unboxed, OS baseline

**Did:** Unboxed Mac Studio M4 Max. Installed SN7100 NVMe into Satechi Stand Hub. Connected to KVM with Dell 34" widescreen. Ran macOS Sequoia updates. Configured Apple Watch Auto Unlock. Installed Claude Desktop and ChatGPT Desktop — used immediately as the setup runbook interface going forward.

**Worked:** Apple Watch Auto Unlock operational immediately. Claude and ChatGPT signed in and used to guide every subsequent installation step.

**Broke:** Nothing — clean start.

---

## 2026-05-05 — Development foundation

**Did:** Installed Homebrew 5.1.8. Installed Git 2.54.0 (Homebrew, overrides Apple Git). Installed Python 3.14.4. Configured PATH in `~/.zprofile`. Generated GitHub SSH key (ed25519), added to GitHub as "Mac Studio M4 Max", verified with `Hi OKHP3!`.

**Worked:** Full development foundation clean. Homebrew Git correctly precedes Apple Git in PATH. SSH authentication confirmed.

**Broke:** Duplicate `eval` lines in `.zprofile` from multi-paste during setup — cleaned to single line with `>` redirect.

---

## 2026-05-05 — Ollama install and first models

**Did:** Installed Ollama 0.23.1 via Homebrew. MLX and mlx-c installed automatically as dependencies — this means Apple's native ML framework is the inference engine, not just a wrapper. Renamed external NVMe to `OKH-Local`. Created model storage directory. Configured `OLLAMA_MODELS`, `OLLAMA_FLASH_ATTENTION`, and `OLLAMA_KV_CACHE_TYPE` in both `~/.zprofile` and the Homebrew plist. Pulled phi4:14b, gemma3:12b, gemma3:27b, codestral:22b.

**Worked:** Ollama running as Homebrew background service with MLX acceleration. First inference test passed.

**Broke:** `OLLAMA_MODELS` environment variable not picked up by the Homebrew launchd service — shell `.zprofile` variables don't propagate to background services. Fix required editing `/opt/homebrew/opt/ollama/homebrew.mxcl.ollama.plist` directly to add the environment variable. Models also initially landed in `~/.ollama` instead of OKH-Local — corrected with `mv` and manifest cleanup.

---

## 2026-05-06 — Model collection and LM Studio

**Did:** Pulled mistral-small3.1:24b (15GB) and llama3.1:8b (4.9GB). Attempted llama3.3:70b (42GB) — system froze and required hard restart. Confirmed 36GB unified memory: the 70B model at 42GB exceeds the practical ceiling with applications running. Removed 70B. Installed LM Studio 0.4.12, confirmed MLX v1.6.0 backend auto-detected, set models directory to OKH-Local, downloaded Gemma4 E2B, E4B, 26B A4B. Set model loading guardrails to Balanced. Moved LM Studio server from port 11434 (conflicts with Ollama) to 1234.

**Worked:** LM Studio MLX backend auto-detected and active. Gemma4 E4B multimodal model running cleanly.

**Broke:** llama3.3:70b caused system freeze — 42GB exceeds 36GB ceiling with apps running. Gemma4 31B rejected by LM Studio guardrails (reported 87GB requirement at default quantization — correct guardrail behavior).

---

## 2026-05-07 — Open WebUI, VSCode, and MCP foundation

**Did:** Installed Docker Desktop 4.72.0. Deployed Open WebUI container on `localhost:3000`. Installed VSCode 1.119.0 and Continue.dev v1.2.22. Configured Continue.dev with all local Ollama models, Codestral 22B as primary autocomplete. Installed Node.js 26.0.0 for MCP server support.

**Worked:** Open WebUI auto-detecting Ollama models at launch. Continue.dev configured as a zero-cost local Copilot replacement inside VSCode.

**Broke:** Docker Desktop failed initial start — Rosetta update required. Resolved after macOS Rosetta update prompt.

---

## 2026-05-08 — MCP servers and app ecosystem

**Did:** Installed `@notionhq/notion-mcp-server` via npm. Created Notion integration token. Created GitHub PAT with minimal scopes. Configured Claude Desktop `claude_desktop_config.json` with Notion and GitHub MCP servers. Used full binary paths (`/opt/homebrew/bin/notion-mcp-server`, `/usr/local/bin/docker`) to fix PATH issues — Claude Desktop launches as a background service and does not inherit shell PATH. Pulled GitHub MCP server image via Docker. Verified 11 MCP servers connected in Claude Desktop.

**Active MCP connections:** Notion, GitHub, PageSpace, Mermaid Chart (enterprise), Google Calendar, Gmail, Google Drive, Microsoft 365, PayPal, Cloudflare Developer Platform, Indeed, Microsoft Learn.

**Worked:** All 11 MCP servers live. Claude Desktop now has direct access to GitHub repos and can read/write Notion workspace via MCP.

**Broke:** GitHub PAT accidentally exposed in conversation — immediately rotated both Notion and GitHub tokens. GitHub MCP npm package deprecated — switched to Docker-based server image (`ghcr.io/github/github-mcp-server`). Full binary paths required for both MCP commands.

---

## 2026-05-09 — App ecosystem and Edge PWAs

**Did:** Installed Microsoft Edge, Office suite (Word, Excel, PowerPoint, Outlook, OneNote), OneDrive, Notion Desktop, Perplexity (native), GitHub Desktop. Removed duplicate Office apps that had installed via both Homebrew and DMG. Inventoried all Edge PWAs. Confirmed brand PWAs (AskJamie™, OverKill Hill P³™, Glee-fully™) present and functional. Installed PageSpace MCP.

**Worked:** Full app ecosystem clean. 26 applications in `/Applications/`. 30+ Edge PWAs in `~/Applications/Edge Apps.localized/`. All brand properties pinned as standalone apps.

**Broke:** Several Office apps installed twice — one from Homebrew cask, one from DMG. Cleaned duplicates with `sudo rm -rf "/Applications/Microsoft [App] 2.app"`.

---

## 2026-05-10 — VSCode extension audit across machines

**Did:** Exported extension lists from ASUS personal laptop (62 extensions) and BFS work laptop (72 extensions). Conducted full cross-machine audit — identified Windows-only, work-specific, and redundant extensions. Built three MVP extension lists. Installed 43 extensions on Mac Studio via bulk `code --install-extension` command. Enabled VSCode Settings Sync signed in with GitHub.

**Worked:** All 43 extensions installed clean in one pass. Settings Sync pushing Solarized Light theme across machines.

**Broke:** Continue.dev flagged a Photos Library permissions error on startup — harmless macOS extended attributes scan hitting a locked system folder.

---

## 2026-05-11 — Git workspace, OneDrive sync, and repos

**Did:** Configured Git global identity (OKHP3 / noreply GitHub email). Set up OneDrive sync — confirmed full OKH folder structure synced from ASUS Windows machine. Created `okhp3` Terminal alias in `.zprofile` for fast navigation to OKH working directory. Updated VSCode workspace file — moved from inside OverKill-Hill-FoundRy to OKH root, corrected GPT repo paths from `GPT-Forge/` to `Projects/` (actual ASUS structure). Inventoried all 28 GitHub repos. Updated all 28 SSH remotes from HTTPS to SSH via batch script. Installed mlx-lm 0.31.3 — verified at 139 tok/s on Phi-4 mini via direct Apple Silicon inference.

**Worked:** Workspace file correctly opening all 28 repos. SSH remotes updated in one pass. mlx-lm functional at approximately 4x the throughput of the equivalent Ollama inference path.

**Broke:** Git pull on repos inside OneDrive timing out — OneDrive holding `.git/index` with file locks during initial sync. Decision: accepted risk and moved on. Primary commits come from cloud tools (Replit, Claude Code, Codex) and the Mac Studio directly; ASUS is read-mostly.

---

## 2026-05-12 — Normalization, benchmarking, and baseline archive

**Did (ChatGPT session):** Normalized Ollama model storage to `/Volumes/OKH-Local/07_Local_LLMs/ollama/models`. Flattened LM Studio nested `models/models` path caused by UI misconfiguration. Created compatibility symlinks at root level. Externalized HuggingFace cache to `/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache`, authenticated as okhp3 with fine-grained read-only token. Migrated and removed internal HF cache. Created model inventories, benchmark workspace, restore script, verification script. Benchmarked llama3.1:8b and phi4:14b across 5 tests. Created known-good baseline documentation. Produced and integrity-checked a closure archive.

**Worked:** Full storage normalization verified. All 6 Ollama models confirmed after normalization. Benchmark smoke tests completed. Closure archive integrity check passed.

**Broke:** Ollama stale path behavior after move — required service stop, path fix, and restart with explicit environment variables. LM Studio nested `models/models` path caused by pointing the UI at the wrong level of the folder hierarchy. HuggingFace first token attempt failed (token permissions too restrictive) — second fine-grained read-only token succeeded.

---

## 2026-05-13 — Punch list and public prep

**Did:** Verified Ollama plist path post-normalization (was pointing at old path via symlink, corrected to canonical). Updated Open WebUI — container recreated with latest image, v0.9.5 banner resolved. Resolved Edge PWA localhost auth for Open WebUI. Created this GitHub repository. Prepared public project page at overkillhill.com.

**Worked:** All three blockers resolved. Open WebUI updated and running as pinned Edge PWA.

---

## 2026-05-18 — Offsite backup

**Did:** Copied baseline archive to OneDrive: `cp /Volumes/OKH-Local/05_Research_Vault/mac-studio-setup_DONE_2026-05-12.tar.gz ~/OneDrive/Documents/`. Verified archive contents (15 files: restore scripts, verification scripts, Homebrew manifests, system profile, baseline documentation). Confirmed OneDrive sync status: up to date, no errors.

**Worked:** Archive confirmed intact — 5.6K compressed, 15 text files. OneDrive syncing to cloud and ASUS.

---

## 2026-05-27 — OpenClaw installation

**Did:** Installed OpenClaw 2026.5.26 via `npm install -g openclaw@latest` (372 packages). Ran `openclaw setup` and `openclaw onboard` wizards via QuickStart path. Configured Ollama local-only mode. Selected iMessage as channel (imsg binary not available — channel crash-looped, later disabled). Installed 11 skills during onboard. Configured session-memory and command-logger hooks. LaunchAgent installed — auto-starts at login on port 18789. Attempted phi4:14b as primary model — context overflow on every message (system prompt overhead ~12-13k tokens exceeds 16k window). Switched to gemma3:27b (131k context, 9% utilization). Resolved context overflow by clearing bloated session files from iMessage crash loop. Agent confirmed responding.

**Worked:** OpenClaw 2026.5.26 running as LaunchAgent. gemma3:27b responding cleanly. Control UI at localhost:18789.

**Broke:** phi4:14b context overflow — architectural constraint of OpenClaw workspace file overhead. iMessage channel crash-looping due to missing imsg binary (not available via npm or Homebrew — requires Swift/Xcode build from source). Disabled with `openclaw channels remove --channel imessage`.

---

## 2026-05-28 — Larry goes live

**Did:** Named agent Larry, modeled after Larry the Lobster from SpongeBob SquarePants. Rewrote `IDENTITY.md` with full character context and `SOUL.md` with voice rules and constraints. Seeded `MEMORY.md` from a multi-AI identity consolidation (Claude + ChatGPT + Copilot + Perplexity + Gemini + Notion) — agent now context-aware about Jamie, the Council of AIs stack, active projects, and the BFS firewall. Ran `openclaw doctor` — corrected context windows for all 7 configured models, raised bootstrap character limit to 20,000. Fixed clawhub and mcporter binary paths (`npm install -g clawhub mcporter`). Deployed SearXNG in Docker on port 8888, enabled JSON API, configured as Larry's web_search provider. Set `tools.profile` to `full` (was `coding`, which stripped web tools). Confirmed web_search returning results via SearXNG. Eligible skill count: 28.

**Worked:** Larry introduced himself correctly on cold start from workspace files alone — no session history required. Web search confirmed functional via SearXNG JSON API. Control UI at localhost:18789 stable.

**Broke:** SearXNG returned stale version data on first search query — result quality depends on which search engines SearXNG federates. Engine quality tuning pending (open `localhost:8888/preferences` to configure preferred engines).

---

## Current verdict

The Mac Studio M4 Max is a functional, governed local AI workbench with an active autonomous agent layer. The baseline is documented, benchmarked, verified, and archived. Larry (OpenClaw) is online with 28 skills, web search, and full context awareness. The next phase is the RAG corpus build, expanded model benchmarks, and the architecture diagram.
