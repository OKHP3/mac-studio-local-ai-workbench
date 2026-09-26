# 22 — LM Studio tuning, cross-device access and skills (2026-09-25)

Scope: LM Studio 0.4.25 (Build 1) on the Mac Studio M4 Max, 36 GB unified memory (LM Studio reports 28.08 GB usable as GPU memory). Companion to [19](19-reference-stack-2026-09.md) and [20](20-open-webui-tuning-and-remote-access-2026-09.md). Tailnet names are redacted as `<host>.<tailnet>.ts.net`.

## Audit: what is set today (read from the app, 2026-09-25 ~20:40 CT)

| Area | Setting | Current | Target | Why |
|---|---|---|---|---|
| Server | Port | 1234 | 1234 | Keep. Every client is wired to it. |
| Server | Require Authentication | OFF, 0 tokens | **ON**, one token per client | LAN-reachable API with no auth. Verified: `GET http://<lan-ip>:1234/v1/models` returns 200 with no header. |
| Server | Serve on Local Network | ON | ON (with auth) | Needed for LAN clients; safe only once auth is on. |
| Server | Allow per-request MCPs | ON | **OFF** | Lets any unauthenticated caller make the Mac connect to arbitrary remote MCP servers. Nothing in the stack uses it. |
| Server | Allow calling servers from mcp.json | OFF (greyed) | OFF | Requires auth; no need. |
| Server | Enable CORS | OFF | OFF | No browser page calls LM Studio directly. Open WebUI and OpenClaw call server-side. |
| Server | JIT model loading | ON | ON | OpenClaw fallback/utility models load on demand. Verified: cold JIT load of lfm2.5-1.2b = 6.4 s. |
| Server | Auto unload JIT models / idle TTL | ON / 15 min | ON / 15 min | Matches Ollama `KEEP_ALIVE=15m`. Docs default is 60. |
| Server | Only keep last JIT model | ON | ON | 36 GB is shared with Ollama gpt-oss:20b. One JIT model at a time is the right ceiling. |
| Model Defaults | Default context length | **Model maximum** | **Custom 32768** | lfm2.5-1.2b JIT-loaded at 128000. Gemma-4 26B would load at 262144, Devstral 2 at 393216. KV cache scales with context; Strict guardrails then refuse the load and the fallback silently fails. 32k matches Ollama. |
| Model Defaults | Loading guardrails | Strict | Strict | Correct for a box that also runs Ollama + Docker. |
| Model Defaults | Bypass memory load warnings | **No restriction** | **Requires holding Alt/Option** | "No restriction" undercuts Strict. |
| Model Defaults | Image input max edge | 2048 px | 2048 px | Fine for the Gemma-4 VLMs. |
| Developer | Local LLM Service (headless) | ON | ON | Server survives the window closing. Already part of the cold-boot chain. |
| Runtime | GGUF / MLX engines | Metal llama.cpp v2.45.0 / LM Studio MLX v1.11.0, auto-update, Stable | Same | Keep Stable. |
| LM Link | Enabled / allow loading here | ON / ON | ON / ON | Rename device from `Mac` to `mac-studio`. |

## Per-model load overrides (set in My Models > gear, or `lms load --context-length`)

| Model | Role | Context | Notes |
|---|---|---|---|
| liquid/lfm2-24b-a2b (MLX 4-bit) | OpenClaw fallback #1 | 65536 | Hybrid conv/attention arch keeps KV small; matches gpt-oss 64k so a fallback does not truncate the session. |
| liquid/lfm2.5-1.2b (MLX 8-bit) | OpenClaw utility | 32768 | Consider a manual (non-JIT) load so it is never evicted by the fallback model. 1.25 GB. |
| google/gemma-4-26b-a4b-qat (MLX) | Interactive | 32768, raise per chat | Largest resident footprint in the LM Studio set. |
| mistralai/devstral-small-2-2512 | Coding | 32768 to 65536 | Never at the 393k native max on 36 GB. |
| GGUF models (Gemma-4 12B QAT, E4B, Muse-Glimmer) | Interactive | 32768 | Flash attention ON; KV cache q8_0 where offered. |

Memory reality: gpt-oss:20b (Ollama, 64k, q8 KV) plus LFM2-24B-A2B is roughly at the 28 GB GPU ceiling. Neither runtime knows about the other. Strict guardrails will refuse the second load and OpenClaw falls through to `ollama/llama3.1:8b`. That is acceptable behavior; the alternative (loosening guardrails) risks swap on the whole box.

## Cross-device access

LM Studio has no browser UI. `GET /` on :1234 returns JSON (verified). A PWA "installed" from `http://localhost:1234` or `127.0.0.1:1234` is not an app on any device, and fails outright on the ASUS, iPhone and iPad. The bare `https://<host>.<tailnet>.ts.net` is the OpenClaw gateway (443), not LM Studio.

| Need | Path | Status |
|---|---|---|
| Chat in a browser on any device | Open WebUI PWA at `https://<host>.<tailnet>.ts.net:8443`, with LM Studio added as an OpenAI connection (`http://host.docker.internal:1234/v1` + token) | Open WebUI PWA done (doc 20). Connection to verify/add. |
| iPhone / iPad native | **Locally** (LM Studio's iOS app) + LM Link | Install, sign in with the same LM Studio account. |
| ASUS (Windows) with LM Studio's own UI | LM Studio for Windows + LM Link. Mac models appear on the ASUS at `localhost:1234`, so WSL2/OpenClaw on the ASUS can use them too. | LM Link already ON on the Mac. |
| Tool clients off-LAN without LM Link | Optional: `tailscale serve --bg --https=1234 http://127.0.0.1:1234` (tailnet-only), token required | Only after auth is ON. |

LM Link caveat: it runs its own userspace Tailscale node (tsnet) and the LM Studio FAQ says it "will not work well with any existing Tailscale networks". It is already enabled beside the Mac's tailnet client; validate from the ASUS before relying on it, and keep the Tailscale Serve endpoint as the fallback.

## Skills

- LM Studio (the app) has no native Agent Skills. Skills live in **Bionic**, LM Studio's separate agent app (skills support announced 2026-08-17). Bionic reads the Agent Skills `SKILL.md` format, installs from a URL (`@Install Skill`), and can use skills found in Claude Code and Codex folders ("Use skills found in other apps").
- Community plugin `wclin/skills` adds `$skill-name` expansion inside LM Studio chat. Not recommended: third-party code with file tools, tested on a 3B model.
- Bionic can route to LM Studio Secure Cloud models. Pin sessions to local or LM Link models to keep the local-first and Western-models-only policies intact.

Decision: **no `lmstudio/` family in skillz yet.** The platform with the skill runtime is Bionic, and it already consumes the canonical `SKILL.md` format, so a platform-specific fork adds maintenance with no behavioral gain. Point Bionic at the existing synced skills folder and a curated active set (same ~30-skill discipline as Open WebUI: small local models degrade as the skill catalog grows). Revisit a `bionic/` family only if a skill needs Bionic-specific tool names or LM Studio ops (`lms load`, model manifests, LM Link health).

## Sources

- LM Studio server settings: https://lmstudio.ai/docs/developer/core/server/settings
- Serve on local network: https://lmstudio.ai/docs/developer/core/server/serve-on-network
- Authentication / API tokens: https://lmstudio.ai/docs/developer/core/authentication
- TTL and auto-evict: https://lmstudio.ai/docs/developer/core/ttl-and-auto-evict
- Headless: https://lmstudio.ai/docs/developer/core/headless
- LM Link docs and FAQ: https://lmstudio.ai/docs/lmlink , https://lmstudio.ai/docs/lmlink/basics/faq
- Tailscale on LM Link (tsnet): https://tailscale.com/blog/lm-link-remote-llm-access
- Locally + LM Link (2026-06-04): https://lmstudio.ai/blog/locally-lm-link
- Bionic: https://lmstudio.ai/docs/bionic , skills: https://lmstudio.ai/docs/bionic/agent/skills , https://lmstudio.ai/blog/skills
