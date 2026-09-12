# OpenClaw (Larry) Configuration Review & Best-Practice Recommendations

**Instance reviewed:** OpenClaw Gateway on OverKill-Hill's Mac Studio (agent "Larry"), local at `ws://127.0.0.1:18789`
**Date:** 2026-09-11
**Goal:** Minimize Frontier (Claude/GPT/Grok) token spend by routing through local Ollama models, given no API licensing or paid developer plans currently held — only paid UI plans (Claude Pro, Perplexity Pro, ChatGPT Pro, Notion AI Business, Mermaid Enterprise, GitHub Copilot, Replit Core).

---

## Executive Summary

- Larry is already configured local-first: primary model is `ollama/phi4:14b`, the only configured provider is `ollama`, and zero secrets/API keys exist for any Frontier provider. There is currently no accidental cloud-spend path.
- Fallback model is set to "No fallback model." That's consistent with your no-API-key posture (a fallback to Claude/GPT would fail anyway without a key), but it means Larry hard-fails instead of degrading gracefully if `phi4:14b` errors or the Mac Studio is under load.
- **Memory is the real risk, not tokens.** The Gateway Host panel shows 99% RAM used (481 MB free of 36 GB) with `phi4:14b` loaded. That's a stability problem today, independent of anything model-routing related, and it will get worse before it gets better if you load bigger local models.
- Security posture is loose relative to OpenClaw's own documented defaults: Tool profile is "Full," and Automation has `Allow Bash Chat Command`, `Allow /config`, `Allow /debug`, and `Allow /mcp` all switched on (each defaults to `false` per OpenClaw's docs). This is lower-stakes than it looks because zero channels are connected (no Discord/Slack/Telegram/WhatsApp) and the Gateway is bound to loopback only, so nobody outside this Mac can reach it. But it's worth a deliberate decision, not a default you inherited.
- Talk (realtime voice) is unconfigured, which is correct for a token-minimization goal. If you ever add an OpenAI or xAI key for something else, "Auto" provider selection could silently light up paid realtime voice. Worth a guardrail now while it's free to set.
- OpenClaw's own docs describe exactly the routing pattern you want: primary/fallback ordering with local models first, a separate low-cost "Utility Model" for internal chores (titles, progress narration), and `models.mode: "merge"` so a future Frontier key stays a genuine fallback instead of becoming the default path.

---

## Current Configuration Snapshot

| Setting | Current value | Notes |
|---|---|---|
| Primary model (agent default) | `ollama/phi4:14b` | Local, correct for your goal |
| Utility Model | Auto | Resolves to primary (ollama) since no other provider has credentials |
| Fallback Model | None configured | No degradation path if phi4:14b fails |
| Thinking (agent default) | Off | Reduces local compute per turn |
| Fast Mode | Default | Not overridden |
| Configured model providers | 1 (`ollama`) | Zero Frontier providers, zero stored secrets |
| Gateway binding | `127.0.0.1:18789`, token auth | Loopback only, not LAN/internet exposed |
| Gateway host resources | CPU 2.5% load, **RAM 99% used**, Disk 49%/35% | RAM is the outlier |
| Tool profile | Full | Docs default is narrower; Minimal/Coding/Messaging also available |
| Exec policy | Allowlist, 0 targets configured | Safe primitive, but empty allowlist + "Full" profile is worth clarifying intent |
| Allow Bash Chat Command | On | Docs default: off (requires elevated) |
| Allow /config, /debug, /mcp | On | Docs default: off for each |
| Forward Exec Approvals | Off | Fine, no external channels to forward to anyway |
| Connected channels | None | No Discord/Slack/Telegram/WhatsApp/Signal/iMessage/nostr configured |
| Cloud workers | 0 profiles, 0 repos | No ephemeral cloud machine spend risk |
| MCP servers | None configured | MCP Apps rendering is enabled but has nothing to render |
| Talk / realtime voice | Not configured, provider "Auto" | Correct today; latent risk if a paid key gets added later |

---

## Options

| Option | What it does | Tradeoff |
|---|---|---|
| **A. Leave as-is** | No changes | RAM pressure risk stays; Tool profile/Automation stays broader than OpenClaw's documented defaults |
| **B. Tighten to documented defaults** | Drop Tool profile to Coding or Minimal, turn off Bash/`/config`/`/debug`/`/mcp` unless you're actively using them, add an explicit local fallback model | Matches OpenClaw's own security guidance; costs you a few seconds re-enabling something if you need it later |
| **C. Full local-first hardening (recommended)** | B, plus: fix the RAM problem, add a second smaller local model as fallback, lock Talk's provider to explicit/disabled rather than "Auto," set `models.mode: "merge"` | Most work up front, but it's the configuration that actually delivers "local by default, Frontier only when I choose it" |

---

## Recommendation

Go with **Option C**. You're not fighting cost risk right now (there's no key to leak spend through), so the actual leverage is in reliability and intent-locking the setup so it stays local-first even after you inevitably add a Frontier key for some experiment later.

Concretely:

1. **Fix the RAM first.** 481 MB free on a 36 GB machine while running `phi4:14b` (roughly 9-10 GB at Q4) means something else is consuming the rest, or you have other models/services loaded simultaneously (Open WebUI, LM Studio, Qdrant, SearXNG per your stack). Check `ollama ps` and Activity Monitor before doing anything else. A gateway that's swapping will produce worse output and slower responses than any model-routing change could fix.
2. **Add a local fallback model**, not a Frontier one. Something smaller and faster than `phi4:14b` (e.g., a 7-8B quantized model you already have among your 28-model roster) as `agents.defaults.model.fallbacks`. This gives you graceful degradation under memory pressure without ever touching a paid API.
3. **Set `models.mode: "merge"`** now, even with no Frontier key configured. Per OpenClaw's docs this preserves hosted-provider slots for genuine fallback without making them the default path the moment you do add a key. It's a one-time decision that pays off the day you're debugging something and reach for Claude Pro's API out of habit.
4. **Decide Talk deliberately.** Either leave it fully unconfigured (current state, fine) or set an explicit provider so "Auto" can't silently pick a paid realtime voice API the first time credentials exist for any reason.
5. **Right-size the Tool profile and Automation toggles to what you actually use.** OpenClaw's documented defaults for `Allow Bash Chat Command`, `/config`, `/debug`, and `/mcp` are all off, and Tool profile ships narrower than Full. Given zero channels are connected, this isn't a live security emergency, but "Full plus four elevated toggles on" reads more like defaults nobody revisited than a deliberate choice. If you're actively developing skills/plugins against Larry, keep Coding; if you're mostly just talking to it, Minimal or Messaging is a smaller surface.
6. **Leave Exec policy on Allowlist** and use `argPattern` constraints if you do add exec targets later, per OpenClaw's own hardening guidance, rather than moving to Auto or Full exec mode.

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| RAM exhaustion causes OOM kills, swap thrashing, or degraded model output | Check `ollama ps` / Activity Monitor now; consider unloading unused models, or capping concurrent model residency |
| No fallback means any local model hiccup is a hard failure, tempting you to bolt on a Frontier key as a quick fix later without thinking it through | Add a local fallback model now, before you're in a hurry |
| "Auto" Talk provider could quietly start using paid realtime voice APIs if a key ever gets added for an unrelated reason | Set Talk's provider explicitly or leave the feature disabled at the config level |
| Tool profile "Full" + Bash/`/config`/`/debug`/`/mcp` on is broader than OpenClaw's documented defaults | Not urgent given zero external channels, but revisit to match actual usage; tighten before you ever connect Discord/Telegram/Slack |
| Empty exec allowlist with "Full" tool profile is a slightly confusing combination to reason about later | Document your intent (no exec targets = exec effectively inert) or add explicit allowlist entries with `argPattern` restrictions if you start using exec for real |

---

## Next Actions

- [ ] Run `ollama ps` and check Activity Monitor on the Mac Studio to find what's eating RAM alongside `phi4:14b`
- [ ] Add a smaller local model as `agents.defaults.model.fallbacks` (no Frontier entries)
- [ ] Set `models.mode: "merge"` in Larry's config
- [ ] Set Talk's provider explicitly (or confirm you want it left fully unconfigured)
- [ ] Review Tool profile (Full vs. Coding/Minimal/Messaging) against what you actually use Larry for day to day
- [ ] Turn off `Allow Bash Chat Command`, `/config`, `/debug`, `/mcp` unless you're actively relying on each one
- [ ] If you ever configure exec targets, add `argPattern` restrictions rather than broad binary allowlisting

---

## Suggested Follow-Ups

1. Want me to pull the exact RAM/process breakdown from the Mac Studio via terminal to confirm what's consuming memory before you touch any OpenClaw settings?
2. Want a short list of which of your 28 local models is the best fallback candidate for `phi4:14b` by size/speed tradeoff?
3. Want me to draft the actual config diff (YAML/JSON) for `models.mode: merge` + fallback + Talk provider lock, so you can paste it in rather than click through the UI?
4. Should this review get filed into the `mac-studio-local-ai-workbench` repo docs, or does it stay Notion-side per your usual capture flow?
5. Want the same pass run against the Windows/GJS-LAPTOP OpenClaw instance (Glee-fully) for consistency?

---

*Sources: [Local models · OpenClaw](https://docs.openclaw.ai/gateway/local-models), [Models CLI · OpenClaw](https://docs.openclaw.ai/concepts/models), [Permission modes · OpenClaw](https://docs.openclaw.ai/tools/permission-modes), [Exec approvals · OpenClaw](https://docs.openclaw.ai/tools/exec-approvals)*

---

## Addendum: Changes Applied + RAM Root Cause (2026-09-11, later same day)

### What got changed in OpenClaw

| Setting | Before | After |
|---|---|---|
| Agent fallback model | None configured | `ollama/llama3.1:8b` added (local, no Frontier) |
| Tool profile | Full | Coding |
| Allow Bash Chat Command | On | Off |
| Allow /config | On | Off |
| Allow /debug | On | Off |
| Allow /mcp | On | Off |
| Model Catalog Mode | merge (already correct) | unchanged, confirmed via Advanced > Models |

Primary model stays `ollama/phi4:14b`. No Frontier provider was added or enabled anywhere in this pass. One thing surfaced while making these changes: OpenClaw's "Test connection" on the `ollama` provider returned a failure when clicked from inside the Control panel. Ollama itself is confirmed running (see below), so this reads as a one-off probe hiccup rather than a real outage, but worth a manual click-to-verify next time you're in Settings > Models.

### RAM root cause: it's not OpenClaw, Ollama, Open WebUI, or LM Studio

Pulled directly from Activity Monitor (All Processes, sorted by Memory), rather than relying on the Gateway panel's "99% used / 481 MB free" figure, which counts literal free pages only. macOS deliberately runs that number near zero by design (spare RAM gets used for file cache), so it reads as scarier than the actual picture: Memory Used was 29.6-29.9 GB of 36 GB (about 82%), Swap Used was a modest 1.44 GB, and Compressed sat at 12.6 GB, which is the real tell that the system has been working hard to avoid swapping, driven by sheer number of apps open at once, not by any one runaway process.

**Ollama: 55.3 MB, idle, no model loaded.** That's the whole footprint. It's correctly unloading models between uses, exactly what you want for a local-first setup — no fix needed here.

**LM Studio: ~550 MB combined (main process + GPU helper), nothing loaded.** Matches what the app itself showed ("0 GB" / "0.0%").

**Open WebUI lives inside Docker Desktop's VM**, which reported only 1.98 GB / 7.57 GB container memory in its own UI — not the culprit either.

**The actual top consumers**, all unrelated to local-model tooling:

| Process | Memory |
|---|---|
| Virtual Machine Service for Docker | 3.81 GB |
| Virtual Machine Service for Claude (this Cowork session's own bridge) | 1.55 GB |
| Code Helper (Plugin) — VS Code | 904 MB |
| Codex (Renderer) | 852 MB |
| WindowServer (macOS, normal) | 758 MB |
| ChatGPT Classic | 739 MB |
| Claude Helper (Renderer) | 688 MB |
| Microsoft Edge + 7 separate Edge Helper (Renderer) processes | 603 MB + ~2.6 GB combined |
| Codex (Service) | 576 MB |
| Claude Helper | 571 MB |
| Microsoft Outlook | 479 MB |
| Notion Helper (Renderer) | 457 MB |
| ChatGPT (separate from ChatGPT Classic) | 326 MB |

The pattern: you're running several full Electron/Chromium desktop apps simultaneously (VS Code, Notion, Outlook, two separate ChatGPT app versions, Codex's GUI, Claude desktop), plus Docker Desktop's Linux VM, plus Edge hosting multiple pinned PWAs (OpenClaw Control, Open WebUI as "OKH Local AI," M365 Copilot, GitHub) each as its own renderer process. Each of those is individually reasonable; together they add up to the pressure.

### Guardrails (none of these touch OpenClaw/Ollama/Open WebUI/LM Studio — they're all already fine)

| Guardrail | Why |
|---|---|
| Cap Docker Desktop's VM memory (Docker Desktop → Settings → Resources) to a fixed ceiling, e.g. 4-6 GB | It's the single largest consumer at 3.81 GB just idling; an unbounded VM allocation grows into whatever's available |
| Quit one of "ChatGPT Classic" vs "ChatGPT" if both aren't actively needed | You're running two versions of the same product simultaneously for ~1 GB combined |
| Consolidate Edge PWA sprawl — close pinned PWAs (OpenClaw Control, Open WebUI, M365 Copilot, GitHub) when not actively in use rather than leaving all four resident | Each PWA is a full separate Edge process tree, not a lightweight tab |
| Treat "Virtual Machine Service for Claude" (1.55 GB) as the known cost of an active Cowork/device-bridge session | Not a leak, just overhead while this feature is in use — closes when the session ends |
| Watch Compressed Memory, not "% used," as your real pressure signal | macOS's free-memory number is misleading by design; Compressed climbing toward Physical Memory size (here 12.6 GB of 36 GB) is the earlier, more honest warning than swap actually kicking in |

---

## Addendum 2: Sandbox Error Fix + Exec Hardening + Docker Resource Check (2026-09-11, same day)

### Sandbox image error — root cause and fix

You hit this on the Model Setup page:

> `Sandbox image not found: openclaw-sandbox:bookworm-slim. Build it with scripts/sandbox-setup.sh before enabling Docker sandboxing.`

This looked like it might be fallout from the earlier Tool profile change, but it wasn't. Per OpenClaw's docs (`gateway/sandbox-vs-tool-policy-vs-elevated`), Tool Profile, Sandbox Mode, and Exec Target are three independent settings. The actual trigger was clicking "Test & use" on the auto-detected Codex/OpenAI CLI provider row, which exercised **Exec Target**, found under Advanced > Agent Defaults > Tools. That was set to `auto` — meaning "try Docker sandbox first" — but no sandbox image had ever been built via `scripts/sandbox-setup.sh`, so it failed looking for an image that doesn't exist.

**Fix applied:** Exec Target set from `auto` to `gateway`, pinning execution to the Gateway process directly rather than attempting Docker sandboxing. Confirmed persisted (rendered bold/selected, survived navigate-away-and-back).

This is a legitimate long-term choice, not just a workaround: your exec allowlist is currently empty, so there's nothing to sandbox yet either way. Building the actual `openclaw-sandbox:bookworm-slim` image is a Terminal task (running `scripts/sandbox-setup.sh`) that needs typing access I'm intentionally not using without you asking directly — it's a fine thing to do yourself later if you start adding real exec allowlist entries and want the extra container isolation on top of the allowlist itself.

### Exec Ask set explicitly

Found unset (no option highlighted among off / on-miss / always). Set to **on-miss**, which matches OpenClaw's documented "cautious preset" (`security=allowlist, ask=on-miss, askFallback=deny`): known allowlisted commands run without friction, anything not on the list prompts you rather than silently running or silently failing.

### Docker Desktop resource check — already correct, no change needed

Went in expecting to cap Docker's VM memory per the Addendum 1 guardrail. Found it already capped: **Memory limit 8 GB** (not unbounded), CPU limit 14, and **Resource Saver already enabled** (auto-shrinks the VM when idle). That's a better guardrail than the 4-6 GB I'd suggested blind — Resource Saver handles the "idling at 3.81 GB doing nothing" problem dynamically instead of a fixed ceiling. Left as-is.

---

## Best-Practices Deployment Roadmap

A single view of where Larry's configuration stands, phased by who does the work.

### Phase 1 — Done (this session, via Cowork)

| Area | Change | Status |
|---|---|---|
| Model routing | Fallback model added (`ollama/llama3.1:8b`), primary stays `ollama/phi4:14b` | ✅ Done |
| Model routing | Model Catalog Mode confirmed `merge` | ✅ Verified, no change needed |
| Attack surface | Tool profile: Full → Coding | ✅ Done |
| Attack surface | Automation toggles (Bash Chat Command, /config, /debug, /mcp): all Off | ✅ Done |
| Exec policy | Exec Target: auto → gateway (fixes sandbox error, no image dependency) | ✅ Done |
| Exec policy | Exec Ask: unset → on-miss (documented cautious preset) | ✅ Done |
| RAM guardrail | Docker Desktop VM memory cap + Resource Saver | ✅ Verified already correct (8 GB cap, Resource Saver on) |
| RAM root cause | Confirmed Ollama/LM Studio/Open WebUI are NOT the RAM pressure source | ✅ Diagnosed |

### Phase 2 — Yours to do (needs Terminal typing or app-switching I'm not doing unprompted)

| Area | Action | Priority |
|---|---|---|
| Sandbox (optional) | Run `scripts/sandbox-setup.sh` to build `openclaw-sandbox:bookworm-slim` only if/when you start adding real exec allowlist entries and want container isolation on top of the allowlist | Low — nothing to sandbox yet |
| Desktop sprawl | Quit one of "ChatGPT" vs "ChatGPT Classic" | Low-medium, easy win |
| Desktop sprawl | Consolidate pinned Edge PWAs (OpenClaw Control, Open WebUI, M365 Copilot, GitHub) — close what's not actively in use | Low-medium |
| Talk / voice | Decide explicitly: leave fully unconfigured, or set an explicit provider so "Auto" can't opportunistically light up paid realtime voice if a key ever lands for an unrelated reason | Low, cheap insurance |
| Verification | Manually click "Test connection" on the `ollama` provider in Settings > Models once, to confirm the earlier probe failure was transient | Low |

### Phase 3 — Open decisions (need your input, not just execution)

| Decision | Options |
|---|---|
| Codex/OpenAI CLI auto-detected login | Formally document it as a zero-marginal-cost fallback provider (you're already paying for ChatGPT Pro), or leave it untouched/unused |
| Exec allowlist | Stays empty (exec effectively inert, current state) until you have a specific command you want Larry to run — add with `argPattern` restrictions when you do |
| Sandbox build | Build now for defense-in-depth, or defer until there's an actual allowlist entry to protect |

### What "good" looks like now

Local-first routing: intact and verified (single provider, zero Frontier secrets, sane fallback chain). Attack surface: matches OpenClaw's documented defaults rather than inherited maximal settings. Exec policy: explicit and internally consistent (gateway target, on-miss asking, empty allowlist as a deliberate no-op state, not an oversight). RAM: root-caused and exonerated the local-AI stack specifically, with guardrails already in place or documented for the actual desktop-app-sprawl cause.

The only genuinely open technical debt is the Codex/OpenAI CLI provider sitting there auto-detected and undocumented — worth a five-minute decision next time you're in Settings > Models, not urgent.


