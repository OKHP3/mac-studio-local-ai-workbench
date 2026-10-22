# OpenClaw browser access: closeout checkpoint

Date: 2026-10-22, America/Chicago

Status: BLOCKED, fresh browser acceptance requires desktop access

## Scope and source boundary

The available conversation and task readback contain the original browser
comparison, the owner's authorization to use the existing Keychain gateway
token, the authentication work, the device setup explanation, and this closeout
request. No additional implementation commitments or Replit projects belong
to this task. The repository's static viewer and its Replit configuration are
separate work. No deployment is required by this browser-authentication task.

## Completed commitments from 2026-08-19

The recorded tool results establish that Edge and its OpenClaw Control PWA
loaded Settings with Gateway Online. Chrome and the in-app Browser initially
lacked working authentication. Safari's expanded error reported a gateway
token mismatch. With owner authorization, the existing Keychain token was
entered into the three failing browser sessions. All three then displayed
Gateway Online; reload checks also succeeded. Safari required direct input
after the initial accessibility value assignment failed to update application
state. Its password-manager update prompt was declined.

These are historical results, not a claim that every browser was retested on
2026-10-22. The original work changed browser authentication state and made
no repository commit or gateway configuration change.

## Fresh evidence on 2026-10-22

| Check | Result |
| --- | --- |
| Settings HTTP endpoint | PASS, HTTP 200 |
| Gateway service | PASS, loaded LaunchAgent, running |
| Installed CLI and gateway | Both report 2026.10.5 |
| Gateway RPC read check | PASS, read-only capability |
| Listener exposure | PASS, IPv4 and IPv6 loopback on port 18789 |
| Authentication configuration | Token mode; token represented by a SecretRef object |
| Insecure-auth setting | Field absent in current configuration; no assertion about an explicit false value |
| Native desktop access | BLOCKED, Mac locked and automatic unlock unavailable |
| Browser inventory | Edge connected; Chrome and in-app Browser not advertised |
| Fresh Edge UI acceptance | BLOCKED, stale page capture followed by debugger-detachment error |
| Chrome, Safari, in-app Browser, PWA UI acceptance | NOT RUN in this closeout pass |

The Edge test created temporary tab 1575687955. The tab list subsequently
reported an OpenClaw appearance-settings route rather than the requested
general-settings route. Without a rendered state this does not establish
authenticated acceptance or a routing defect. A close attempt timed out and
reset the control session. Its cleanup outcome is unconfirmed; do not retry
blindly or close another tab with a reused identifier.

## Repository reconciliation and preservation

- Verified repository: OKHP3/mac-studio-local-ai-workbench.
- Canonical branch: main, confirmed through GitHub repository metadata.
- Origin: git@github.com:OKHP3/mac-studio-local-ai-workbench.git.
- Fetched local main and origin/main both identify
  `214b26045e2b6597b9ad0d4da291d03e9513b8a3`.
- Before this receipt, tracked changes and ordinary untracked files were
  absent. No stashes or unpublished commits were listed.
- One registered worktree exists: the shared canonical clone. The nested
  repository scan found only its root Git metadata.
- No attached PRs or worktrees belong to this task. GitHub returned no open
  PRs. The remote README branch is unrelated and was preserved.
- Ignored platform metadata, Python caches, and an existing ignored context
  document were inventoried and preserved in place. Nothing was scheduled for
  deletion, so no relocation or recovery bundle was needed.
- Multiple processes use the canonical clone. The app inventory confirmed
  this task's identity and showed concurrent maintenance activity. No branch
  switch, reset, shared checkout deletion, or runtime restart was performed.
- No source change from the original authentication work awaits integration.
  This checkpoint is a local, uncommitted report pending final acceptance.
  No new commit, push, merge, CI pass, or deployment is claimed.

## Device setup and recovery procedure

1. Use `http://127.0.0.1:18789/settings/general` consistently in every browser.
   Different hostnames, ports, profiles, and private windows have separate
   authentication state even when they reach the same local service.
2. Authenticate each normal browser profile once using the current gateway
   token from its existing authorized Keychain source. Keep the WebSocket
   target `ws://127.0.0.1:18789`. Enter the token in the local Gateway Token
   field and select Connect.
3. Confirm that Settings renders and Gateway reports Online, then reload.
   A reload verifies persistence across page loads, not across app restarts,
   browser upgrades, or cleared site data.
4. Retain local site data for profiles that should stay signed in. New
   profiles, cleared site data, and token rotation can require authentication
   again. Private sessions are temporary.
5. If connection fails, inspect the expanded Raw error before retrying.
   A token mismatch calls for the current credential; a transport error
   calls for checking the local service and WebSocket target. A pairing
   request requires inspecting the exact device request before approval.
6. Keep gateway authentication and loopback isolation in effect. Use a clean
   bookmark without credentials. Do not put a token in a public document,
   repository, shared URL, or screenshot.

## Remaining acceptance and exact restart checkpoint

The owner must unlock the Mac manually. Browser control also needs to expose
Chrome and the in-app Browser, or native access must permit their inspection.
Do not attempt to bypass the lock screen. Existing authorization to use the
local Keychain token for these local sessions remains recorded in the task.

After access returns:

1. Rediscover current browser tabs and apps. Locate any surviving temporary
   tab by its current identity, title, URL, and ownership before cleanup.
2. Test Chrome, Edge, Safari, the in-app Browser, and OpenClaw Control PWA at
   the same Settings destination. Reauthenticate only sessions that require it.
3. Confirm Gateway Online, successful Settings rendering, and persistence
   after reload for each surface. Record actual errors and fix only scoped
   authentication or browser defects.
4. Recheck the original obligations independently. Update this dated report
   additively with fresh results, review it for public safety, then integrate
   scoped documentation through the repository's applicable workflow and CI.
5. Fetch and verify canonical local/remote parity again. Clean up only
   confirmed task-owned temporary resources. Archive this task only after
   all required acceptance, integration, and cleanup are complete.

## Validation and limitations

The receipt was checked against the available conversation, fresh endpoint,
service, Git, GitHub, and browser-control results. Repository application
tests and deployment checks do not establish local browser authentication,
so they were not substituted for the blocked UI acceptance. No shell script,
viewer source, dependency, or workflow was edited. This task remains open;
archival has not been requested.

A second pass verified the live GitHub main ref against both local refs,
confirmed no open PRs, and verified the ignored context document's SHA-256
was unchanged. The initial whitespace check caught a Markdown hard-break
space; it was removed and the check was rerun. No secret values, raw runtime
logs, or private connector configuration are included in this report.
