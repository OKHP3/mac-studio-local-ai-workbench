# 18 — Mac Studio LAN Exposure Fix (2026-09-12)

## Context

The Asus/Windows-hosted OpenClaw instance needs to forward AI requests to Mac Studio-hosted models (LM Studio, Ollama, and eventually the Mac's own OpenClaw Gateway) over the HillHouse LAN. Jamie flagged that "the Mac's systems have undergone a number of recent modifications, and the IP address and Port number may not be correct any longer," blocking that path.

This doc records a full scan of the Mac Studio's current network configuration (System Settings, LM Studio, Open WebUI, OpenClaw Control, Docker, and Homebrew-managed services) plus the fixes applied. Companion doc: [`infusing-a-soul/docs/asus-gateway-runbook.md`](https://github.com/OKHP3/infusing-a-soul/blob/main/docs/asus-gateway-runbook.md), section "Mac Studio Recovery — Completed 2026-09-12" — that doc covers the Windows/Companion side and the architecture implications; this doc is the Mac-side technical record.

Jamie's authorization for this pass, given mid-thread: if adjustments to the Mac were needed to let Windows, iPhone, or iPad connect to it as a "local AI server" (the SHOAL goal — see [`shoal-ai-server`](https://github.com/OKHP3/shoal-ai-server)), Claude had approval to execute those adjustments directly, not just document them. All changes below were made via direct screen control on the Mac Studio, verified live rather than trusted from UI display alone.

## Current network identity

- LAN address: `10.10.1.201`
- Wi-Fi network: `HillHouse`
- Subnet mask: `255.255.255.0`
- Router: `10.10.1.254`
- Firewall: Inactive (not a blocker)
- Local Network privacy permissions: already granted for Docker, LM Studio, OpenClaw Control, and the relevant Edge/PWA instances

This is almost certainly the address that drifted since the last verified pass and broke any cached `mac-studio.local` or stale-IP assumptions on the Windows side.

## Verification method

Live `curl` checks were run from a separate network path (not the Mac itself) against `10.10.1.201` on each service's port, both before and after each fix. UI displays were treated as claims, not proof — this caught a false positive (see OpenClaw Gateway below).

## Findings and fixes, by service

### LM Studio (port 1234) — fixed

- Before: bound to `127.0.0.1` only. Server Settings → "Serve on Local Network" was off.
- Fix: enabled "Serve on Local Network" in LM Studio's server settings popover.
- After: `http://10.10.1.201:1234` reachable, HTTP 200.

### Open WebUI (port 3000) — fixed

- Before: Docker port binding was explicit loopback-only, `127.0.0.1:3000->8080`.
- Fix: recreated the `open-webui` container from the same image (`ghcr.io/open-webui/open-webui:v0.11.0`), same named volume (`open-webui:/app/backend/data`, so all users/chats/settings persisted), with an all-interfaces port publish (`-p 3000:8080`).
- After: `http://10.10.1.201:3000` reachable, HTTP 200.
- Note: recreation drops container-level state that isn't in the volume (e.g. any active login session) — Jamie may need to log back in on first visit from a new client.
- Admin Panel → Settings → Connections still shows the backend model provider URLs (OpenAI API, Ollama API via `host.docker.internal`) — unchanged by this fix, listed here for reference since that's the panel to check if Open WebUI itself needs to reach Ollama/LM Studio differently later.

### Ollama (port 11434) — fixed 2026-09-13 by Jamie

- Before / after: bound to `127.0.0.1` only, unreachable from off-host both before and after this pass.
- Why not fixed: no Ollama.app is installed (confirmed via app-access resolution returning "not installed"); it runs headless via `brew services` (per this file's own service-manager note above). The automation doing this pass has click-level access to GUI apps but not terminal-typing access to Terminal.app, so the fix couldn't be executed directly.
- Fix Jamie needs to run in a real Terminal on the Mac Studio:

```zsh
launchctl setenv OLLAMA_HOST "0.0.0.0"
brew services restart ollama
```

- Verify with `curl http://10.10.1.201:11434/api/tags` from another device on HillHouse.
- If `launchctl setenv` doesn't survive a reboot in practice, the more durable fix is adding `Environment="OLLAMA_HOST=0.0.0.0"` to the Homebrew-managed launchd plist for the ollama service — `brew services info ollama --json` shows the plist path — then restarting the service.

**Update 2026-09-13:** Jamie ran both commands directly in a Terminal on the Mac Studio (output confirmed: `Successfully stopped ollama` / `Successfully started ollama`). Live off-host curl now returns HTTP 200 from `http://10.10.1.201:11434/api/tags` — Ollama is LAN-reachable.

**Follow-up — resolved 2026-09-13:** confirmed. `launchctl getenv OLLAMA_MODELS` was empty and `ollama list` showed zero models right after the `OLLAMA_HOST` fix — the `brew services` launchd daemon wasn't inheriting `OLLAMA_MODELS`. Fixed with `launchctl setenv OLLAMA_MODELS "/Volumes/OKH-Local/07_Local_LLMs/ollama/models"` + another `brew services restart ollama`. All 10 models now show in `ollama list`, and a live off-host curl to `http://10.10.1.201:11434/api/tags` confirms the full list is visible over the LAN. Ollama is fully resolved.

### Qdrant (ports 6333 HTTP / 6334 gRPC) — fixed, plus an unrelated latent bug caught

- Before: both ports bound to `127.0.0.1` only.
- Also found: the running container's storage bind mount pointed at `/Volumes/DKH-Local/07_Local_LLMs/qdrant` — a path that no longer exists on this Mac. The drive was renamed to `OKH-Local` at some point; the running container kept its open file handle across the rename and never noticed, so this was invisible until a restart was attempted (which would have failed silently the next time the container needed to restart, e.g. after a reboot).
- Fix: recreated the container against the corrected current path `/Volumes/OKH-Local/07_Local_LLMs/qdrant` (data — collections, `raft_state.json` — confirmed intact at that path before recreation), with all-interfaces port publish on both 6333 and 6334.
- A dead/never-started container had also claimed the name `qdrant` from an earlier failed attempt at this same fix (path was still wrong on that attempt) — that had to be deleted before the corrected recreation could proceed.
- After: `http://10.10.1.201:6333` reachable, HTTP 200. Verified the bind path via zoomed screenshot of the Inspect/Raw-JSON tab to be certain it read `OKH-Local`, not `DKH-Local`.

### SearXNG (port 8888) — fixed

- Before: Docker port binding was `127.0.0.1:8888->8080`.
- Fix: recreated the `searxng` container from the same image (`searxng/searxng:latest`) with the same two host bind mounts (`/Users/okh/searxng/config`, `/Users/okh/searxng/data`), all-interfaces port publish (`-p 8888:8080`).
- After: `http://10.10.1.201:8888` reachable, HTTP 200.

### OpenClaw Gateway (port 18789) — NOT fixed, needs Jamie

- OpenClaw Control's Gateway settings page shows a "Gateway Host" info card cosmetically displaying `10.10.1.201:18789` — this is only the host's self-reported LAN address for display purposes, not proof the gateway is actually listening on that interface. Live `curl` against `10.10.1.201:18789` from off-host failed to connect, both before and after this pass, confirming it's still bound to `127.0.0.1` only.
- No bind/listen-address setting is exposed anywhere in OpenClaw Control's GUI — Gateway settings only expose the client-side connect target (`ws://127.0.0.1:18789`, i.e. where the Control UI itself connects, since it runs on the same Mac).
- The bind address most likely lives in the gateway's own config file (`openclaw.json` or similar) as something like `gateway.host` / `gateway.bindHost`, or an environment variable read at gateway process startup. Needs Jamie, or a session with real terminal access to the Mac Studio, to locate that key, set it to `0.0.0.0`, and restart the gateway process.
- Verify after the fix with a WebSocket/HTTP check against `10.10.1.201:18789` from another device on HillHouse.

**Locate-and-fix playbook** (same class of problem Ollama had, one layer deeper — nothing in the GUI exposes this, so it's locate-then-fix, not a single command):

1. Try the OpenClaw CLI first (already used elsewhere in this project for `config get` / `doctor` / `secrets`):
   ```zsh
   openclaw config list
   openclaw config get gateway
   ```
   If it reports a `gateway.host` / `gateway.bindHost` / `gateway.listen` key, set it directly:
   ```zsh
   openclaw config set gateway.host 0.0.0.0
   ```
2. If the CLI doesn't expose it, find the raw config file. `~/.openclaw/` is the confirmed convention (GJS-LAPTOP deploys workspace files there; the folder also exists on this Mac), and `openclaw.json` is confirmed to hold a `gateway.auth.token` key on the Windows side, so this Mac's copy almost certainly has a parallel `gateway.*` block:
   ```zsh
   find ~/.openclaw -maxdepth 4 -type f \( -iname "*.json" -o -iname "*.yaml" -o -iname "*.yml" -o -iname "*.toml" \) 2>/dev/null
   find ~/Library/Application\ Support -maxdepth 2 -iname "*openclaw*" 2>/dev/null
   ```
3. Grep whatever file step 2 finds for the bind setting:
   ```zsh
   grep -n "gateway" ~/.openclaw/openclaw.json
   grep -in "host\|bind\|listen\|18789\|127.0.0.1\|0.0.0.0" ~/.openclaw/openclaw.json
   ```
4. Confirm how the gateway process is managed, so you know how to restart it:
   ```zsh
   ps aux | grep -i openclaw
   launchctl list | grep -i openclaw
   brew services list | grep -i openclaw
   ```
5. Edit and restart: a CLI-settable key gets `openclaw config set <key> 0.0.0.0` then a Control app quit/reopen (or `openclaw gateway restart` if that exists); a raw file edit should be backed up first (`cp openclaw.json openclaw.json.bak`) and changed via script, not by hand, to avoid breaking JSON formatting.
6. Re-verify from off the Mac: `curl -v --max-time 5 http://10.10.1.201:18789` — any response beats a connection failure; `000` still means loopback-only.

Full version of this playbook, with the fuller architectural context, also lives in [`infusing-a-soul/docs/asus-gateway-runbook.md`](https://github.com/OKHP3/infusing-a-soul/blob/main/docs/asus-gateway-runbook.md) and in [`shoal-ai-server`](https://github.com/OKHP3/shoal-ai-server)'s docs.
- Separately: OpenClaw Control → Devices currently lists only this Mac Studio itself and its own `openclaw-control-ui` client. No Windows, iPhone, or iPad device has been paired to this gateway yet — that pairing is a deliberate step on each client device, done after the bind-address fix, not something that follows automatically from the gateway becoming reachable.

## Docker follow-up needed

Container recreation (Open WebUI, SearXNG, Qdrant) does not automatically preserve a custom restart policy. Jamie should check that all three have `restart: always` (or whatever policy was previously set) re-applied via Docker Desktop, so they come back up automatically after a Mac reboot.

## Summary table

| Service | Port | Status after this pass |
| --- | ---: | --- |
| LM Studio | 1234 | Fixed — reachable |
| Open WebUI | 3000 | Fixed — reachable (may need re-login) |
| Ollama | 11434 | Fixed 2026-09-13 by Jamie — reachable, all 10 models visible over LAN |
| Qdrant | 6333 / 6334 | Fixed — reachable (also fixed a stale bind-mount path) |
| SearXNG | 8888 | Fixed — reachable |
| OpenClaw Gateway | 18789 | Not fixed — needs Jamie (terminal access, no GUI setting found) |

## Architecture note (Windows side)

Per the companion runbook in `infusing-a-soul`: GJS-LAPTOP's OpenClaw Companion app runs its own internal gateway and is not, today, a client of this Mac Studio's Gateway. The fastest path to "Windows-hosted OpenClaw uses the Mac's models" is adding LM Studio (and Ollama, once fixed) as model providers directly inside GJS-LAPTOP's own OpenClaw config, pointed at `http://10.10.1.201:1234/v1` — separately blocked on the Windows side by an unrelated broken `gpt-5.6-sol` model reference, which is Jamie's to fix on that machine.

If the actual goal is the fuller SHOAL vision — one Mac-hosted Gateway that Windows, iPhone, and iPad all pair into as clients — the OpenClaw Gateway LAN-exposure fix above is the blocking item, with device pairing as the step after that.
