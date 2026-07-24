---
title: "OpenClaw (Larry) Onboarding and Channel Configuration Issues"
primary_topic: "OpenClaw Larry onboarding and channel configuration issues"
source_platform: "OpenClaw CLI and gateway log, pasted text"
capture_mode: "export-excerpt"
completeness: "partial"
extraction_depth: "balanced"
requested_extraction_depth: "not supplied"
source_title: "OpenClaw onboarding wizard and gateway log"
source_date: "unknown"
source_time_context: "Gateway log entries explicitly timestamped 2026-05-27"
source_locator: "not supplied"
retention_decision: "redacted"
source_independence: "pass"
generated_at: "2026-07-24T20:11:18Z"
schema_version: "2.0"
artifact_type: thread-context-extract
---

# OpenClaw (Larry) Onboarding and Channel Configuration Issues

## Introduction

This capture turns a pasted sequence of `openclaw` CLI onboarding transcripts and a later gateway log into a durable record of how "Larry" (the user's name for the local OpenClaw agent, also referenced as a service in this project's architecture diagrams) was configured on the Mac Studio: default model `ollama/phi4:14b`, an iMessage channel requiring the separately-installed `imsg` CLI, eleven configured skills, two enabled hooks (`command-logger`, `session-memory`), and a browser-hatched dashboard. The durable operational finding is that the setup was not fully stable afterward: the gateway log shows repeated iMessage auto-restart attempts and a webchat disconnect on 2026-05-27, a later attempt to seed OpenClaw's memory file from `~/Downloads/MEMORY.md` failed because the file was not actually present at that path, and a recommended config-repair pass flagged that no command owner is configured for the agent.

## Extraction profile

- **Requested depth:** Not specified with a canonical trigger word; governed by the user's overall "highly detailed" synthesis instruction.
- **Selected depth:** Balanced.
- **Selection basis:** The onboarding flow itself is a fairly linear, low-ambiguity CLI wizard; the higher-value content is the small number of concrete follow-on problems (channel instability, the failed memory-file copy, the missing command owner), which balanced depth captures fully without inflating the routine wizard steps into an oversized ledger.
- **Profile changes:** None.
- **Focus areas:** The iMessage channel's post-setup stability, the failed `MEMORY.md` seeding attempt, and the "no command owner configured" gap.
- **Must preserve:** The default model, the full skill and hook lists, the exact gateway-log lines showing instability, and the failed `cp` command with its exact error.
- **Safe exclusions:** The dashboard token itself (referenced but not supplied), and the exact content of small attached `excerpt_from_previous_claude_message.txt` files, none of which were supplied with body text.
- **Coverage rule:** Each onboarding decision point and each post-setup incident is retained individually; the multiple thin attachment references are grouped as one element.
- **Not carried forward:** Full ASCII banner art and decorative CLI framing.
- **Source-independence test:** Pass. A reader can understand the configured state, the identified instability, and the two concrete follow-up gaps without reopening the terminal session.

## Coverage accounting

| Material class | Assessed | Retained | Compressed | Omitted with reason | Missing or unavailable | Notes |
|---|---:|---:|---:|---:|---:|---|
| Turns or turn groups | 9 | 8 | 1 | 0 | 0 | Five thin attachment references are grouped as one element rather than expanded into separate turns. |
| Rich elements | 6 | 5 | 0 | 0 | 1 | The dashboard access token is referenced but not supplied. |
| Decisions and alternatives | 4 | 4 | 0 | 0 | 0 | Model choice, channel choice, skill/hook selection, and the memory-seeding attempt are distinguished. |
| Reusable assets | 3 | 3 | 0 | 0 | 0 | Skill list, hook list, and the gateway-log check pattern are retained. |

## Source synopsis

The onboarding wizard (`openclaw onboard`, version 2026.5.26) opens with a banner describing itself as "Half butler, half debugger, full crustacean" and sets the default model to `ollama/phi4:14b`, matching the locally-installed Ollama model confirmed in the companion toolchain extract. A brief explanation of channel behavior states that inbound DMs default to a pairing-code safety model for unknown senders. The user then installed `imsg` via Homebrew (`brew install imsg`, pulling from a `ghcr.io`-hosted Homebrew core port) to satisfy the requirement that "imsg CLI path required to enable iMessage," and selected iMessage as the QuickStart channel.

Skill configuration was accepted ("Configure skills now? Yes"), installing missing dependencies for eleven skills: `apple-notes`, `apple-reminders`, `clawhub`, `imsg`, `mcporter`, `model-usage`, `nano-pdf`, `sag`, `summarize`, `things-mac`, and `tmux`, using `npm` as the preferred Node package manager. Two hooks were then enabled: `command-logger` and `session-memory`. The agent was "hatched" in the browser, and a dashboard link containing an access token was produced (the token itself was not supplied in the paste and is not reconstructed here).

A later `tail -50` of the OpenClaw gateway log shows real post-setup instability: at `2026-05-27T16:07:34.883-05:00`, the log records `[imessage] [default] auto-restart attempt 7/10 in 300s`, meaning the iMessage channel had already failed and restarted at least seven times and was on a five-minute backoff before its next retry; about ninety seconds later, at `2026-05-27T16:08:57.222-05:00`, a separate `[ws]` entry shows `webchat disconnected code=1001 reason=n/a conn=746aa055-43b6-4b08-a9ff-7f47ac56d87d`, a normal WebSocket closure code but with no reason given, on a distinct connection from the browser-hatched dashboard.

Two further attempts appear to seed OpenClaw's own memory file from a locally downloaded `MEMORY.md`. In the first, `cp ~/Downloads/MEMORY.md ~/.openclaw/workspace/MEMORY.md` is followed directly by `openclaw gateway restart`, a `sleep 5`, and `openclaw chat`, which opens with a banter line ("Welcome to the command line: where dreams compile and confidence segfaults.") around a 09:4x timestamp; no error is shown for the copy itself in this instance. In the second occurrence of the identical command sequence, the `cp` step explicitly fails: `cp: /Users/okh/Downloads/MEMORY.md: No such file or directory`, yet the following `openclaw gateway restart` and `openclaw chat` proceed regardless, opening with a different banter line ("If you can describe..."). This means at least one restart cycle ran without successfully refreshing the agent's memory file, because the source file was not actually present in `~/Downloads` at that moment.

Finally, a config-repair prompt ("Apply recommended config repairs now? Yes") surfaces at least one concrete finding: "No command owner is configured," meaning OpenClaw does not have a designated owner identity set for command execution, an unresolved configuration gap at the point this transcript ends. Several small, separately attached `excerpt_from_previous_claude_message.txt` files (ranging from 1 to 14 lines) are referenced alongside this material but their bodies were not supplied.

## Turn ledger

| Turn | Role | Role confidence | Boundary evidence | Content elements | Summary |
|---|---|---|---|---|---|
| T001 | tool | high | `openclaw onboard` banner and wizard prompts | E001 | Set default model to `ollama/phi4:14b`; explained pairing-code channel safety default. |
| T002 | tool | high | `brew install imsg` transcript and QuickStart channel-selection prompt | E002 | Installed the `imsg` CLI dependency and selected iMessage as the QuickStart channel. |
| T003 | tool | high | "Configure skills now?" prompt, skill dependency list, node-manager prompt | E003 | Installed eleven skill dependencies via npm. |
| T004 | tool | high | "Enable hooks?" prompt and confirmation | E004 | Enabled `command-logger` and `session-memory` hooks. |
| T005 | tool | high | "How do you want to hatch your agent?" prompt and dashboard-ready confirmation | E005 | Hatched the agent in-browser; produced a dashboard link with an access token. |
| T006 | tool | high | `tail -50` gateway log output with explicit ISO timestamps | E006 | Showed 7 of 10 iMessage auto-restart attempts and a webchat disconnect roughly 90 seconds later, on 2026-05-27. |
| T007 | tool | high | `cp`/`gateway restart`/`sleep`/`chat` command sequence, shown twice with different outcomes | E007 | First run: memory file copy proceeded without a shown error. Second run: the copy explicitly failed with a file-not-found error, yet the gateway restarted and chat opened anyway. |
| T008 | tool | high | "Apply recommended config repairs now?" prompt and "Command owner" finding | E008 | Applied recommended config repairs; surfaced that no command owner is configured. |
| T009 | user | high | Multiple attached files named `excerpt_from_previous_claude_message.txt` with stated line counts (11, 1, 1, 8, 14) | E009 | Five small text attachments referenced without supplied body content. |

## Content element ledger

| Element | Turn | Type | Owner | Fidelity | Source locator | Destination reference | Catalog action |
|---|---|---|---|---|---|---|---|
| E001 | T001 | tool_event | tool | verbatim | `openclaw onboard` CLI transcript | Source synopsis | retain |
| E002 | T002 | tool_event | tool | verbatim | `brew install imsg` transcript and wizard prompt | Decisions and rationale | retain |
| E003 | T003 | tool_event | tool | verbatim | Skill-dependency list and node-manager prompt | Reusable methods and assets | retain |
| E004 | T004 | tool_event | tool | verbatim | Hook-enablement confirmation | Reusable methods and assets | retain |
| E005 | T005 | tool_event | tool | text-extracted | Dashboard-ready confirmation; token value not supplied | Open questions and limits | flag-missing |
| E006 | T006 | tool_event | tool | verbatim | `~/Library/Logs/openclaw/gateway.log` tail output | Decisions and rationale, actionable handoff | retain |
| E007 | T007 | tool_event | tool | verbatim | Shell transcript of the memory-file seeding attempts, one success and one failure | Decisions and rationale, actionable handoff | retain |
| E008 | T008 | tool_event | tool | text-extracted | Config-repair wizard output | Actionable handoff | retain |
| E009 | T009 | file | user | referenced-not-supplied | Five `excerpt_from_previous_claude_message.txt` attachments, 1-14 lines each, bodies not supplied | Open questions and limits | flag-missing |

## Normalization exceptions

1. E005's dashboard link explicitly includes an access token in the source UI; that token is not reproduced anywhere in this extract, including in redacted or partial form.
2. T007 combines two separate occurrences of the identical command sequence with different outcomes (one apparently successful copy, one explicit failure) into a single turn row because they represent the same operational pattern tested twice, not two unrelated actions.
3. The exact chat-session timestamp for the first `openclaw chat` invocation is partially cut off in the source ("09:4[x]"); it is recorded as approximate.
4. E009's five attachments are grouped because none of their bodies were supplied; only their filenames and line counts are known, and all share the same generic filename, which prevents distinguishing them further.

## Value inventory

| Area | Extracted value | Claim class | Source support |
|---|---|---|---|
| Purpose | Configure "Larry," a local OpenClaw agent, with a default local model, an iMessage channel, a working skill and hook set, and a browser dashboard, on the Mac Studio. | stated | T001-T005 |
| Context and constraints | The agent defaults to `ollama/phi4:14b`, matching the model already present locally; iMessage requires the separately-installed `imsg` CLI; inbound DMs use a pairing-code safety default. | stated | T001, T002 |
| Reasoning and alternatives | Enabling `command-logger` and `session-memory` hooks supports later auditing and continuity of the agent's own operating context, complementing the manual `MEMORY.md` seeding attempts. | inferred | T004, T007 |
| Decisions and outcomes | Onboarding completed with eleven skills and two hooks; the iMessage channel required repeated auto-restarts (7 of 10 attempts logged) shortly after setup; one memory-file seeding attempt failed outright; a command-repair pass flagged no configured command owner. | stated | T003, T004, T006-T008 |
| Reusable assets | The full skill list, the hook list, and the gateway-log tail command as a standard health check for the iMessage and webchat channels. | stated | T003, T004, T006 |
| Limits | The dashboard access token, the full config-repair output beyond the command-owner finding, and the root cause of the iMessage channel's repeated restarts, are unknown. | unknown | E005, E008 |

## Decisions and rationale

### 1. Default to the already-installed local model

Setting `ollama/phi4:14b` as OpenClaw's default model reuses the model already confirmed present and working on this Mac Studio (see the companion toolchain extract), avoiding a redundant download or a mismatch between what OpenClaw expects and what is actually installed.

### 2. Choose iMessage as the QuickStart channel, accepting the `imsg` CLI dependency

Selecting iMessage required installing the separate `imsg` CLI via Homebrew first. This is a reasonable choice for a personal, Mac-native assistant, but it introduces an external dependency (the `imsg` CLI's own reliability) that is a plausible contributor to the later auto-restart pattern seen in the gateway log.

### 3. Enable `command-logger` and `session-memory` hooks for continuity and auditability

These two hooks were chosen over other available hooks, aligning with a general goal of being able to reconstruct what the agent did and said across restarts, which is directly relevant to why a manual `MEMORY.md` seeding step was also being attempted.

### 4. The `MEMORY.md` seeding pattern is not yet reliable

Copying a memory file from `~/Downloads/MEMORY.md` into `~/.openclaw/workspace/MEMORY.md` before each gateway restart assumes the file is freshly present in Downloads every time. The second attempt shows this assumption failing outright, with the restart proceeding anyway on a stale or absent memory file. A more durable pattern would source the memory file from a fixed, version-controlled location rather than a Downloads folder that can be emptied or not yet populated.

## Actionable handoff

- **Current state:** OpenClaw ("Larry") is onboarded with `ollama/phi4:14b`, an iMessage channel via `imsg`, eleven skills, two hooks, and a browser dashboard. The gateway log shows the iMessage channel needed at least 7 of 10 allowed auto-restarts around 2026-05-27, and a webchat connection separately disconnected. A command-owner configuration gap was flagged and not confirmed resolved.
- **Resume point:** Re-check the current gateway log for iMessage channel stability, confirm whether `imsg`'s CLI path is still correctly configured, and set an explicit command owner during the next config-repair pass.
- **Required context:** Shell access to the Mac Studio, the current `~/Library/Logs/openclaw/gateway.log`, and the current `~/.openclaw/workspace/MEMORY.md` contents.

| Action | Owner | Status | Dependencies | Evidence or acceptance condition |
|---|---|---|---|---|
| Re-check the gateway log for continued iMessage auto-restarts | user | ready | Shell access to the Mac Studio | The log shows no repeated auto-restart attempts over a representative recent window. |
| Set an explicit command owner in OpenClaw's configuration | user | ready | Access to OpenClaw config or `openclaw onboard` repair flow | Re-running the config-repair check no longer reports a missing command owner. |
| Establish a durable, non-Downloads source location for `MEMORY.md` seeding | user | proposed | A fixed path (e.g., a repository-tracked file) to copy from | The seeding `cp` command no longer depends on a file that can be transiently absent from Downloads. |
| Confirm whether the webchat disconnect (code 1001) recurs and whether it correlates with the iMessage restarts | user | proposed | Ability to reproduce or monitor a webchat session | A clear correlation, or lack of one, is documented. |

## Reusable methods and assets

### Configured skill set

`apple-notes`, `apple-reminders`, `clawhub`, `imsg`, `mcporter`, `model-usage`, `nano-pdf`, `sag`, `summarize`, `things-mac`, `tmux` (installed via `npm`).

### Configured hooks

`command-logger`, `session-memory`.

### Gateway health-check pattern

```bash
tail -50 ~/Library/Logs/openclaw/gateway.log
```

Look specifically for `auto-restart attempt N/10` lines (channel instability) and `webchat disconnected code=...` lines (dashboard/websocket instability) as the two known failure signatures from this incident.

### Memory-seeding pattern (as attempted; needs a more durable source path)

```bash
cp ~/Downloads/MEMORY.md ~/.openclaw/workspace/MEMORY.md
openclaw gateway restart
sleep 5
openclaw chat
```

## Open questions and limits

- What is the root cause of the iMessage channel's repeated auto-restarts? Not established in the supplied log excerpt; see T006.
- Is the webchat disconnect (code 1001) related to the iMessage instability, coincidental, or a normal client-side disconnect? Unknown.
- Was the command-owner gap (E008) ever resolved in a later config pass? Not shown in the supplied material.
- What do the five `excerpt_from_previous_claude_message.txt` attachments (E009) actually contain? Not supplied.
- What is the current, authoritative source location intended for `MEMORY.md` before it is copied into `~/.openclaw/workspace/`? Not established; the observed pattern relies on `~/Downloads`, which is not reliable.

## Rehydration test

| Test | Result | Evidence or gap |
|---|---|---|
| A reader can explain the objective without the source platform | pass | Introduction and source synopsis describe the OpenClaw onboarding objective and configured state. |
| Decisions and consequential rationale are recoverable | pass | Decisions 1-4 cover the model, channel, hook, and memory-seeding choices. |
| Current state and next action are unambiguous | pass | Actionable handoff specifies re-checking the gateway log and setting a command owner as concrete next steps. |
| Retained assets are available or missing assets are explicitly cataloged | pass | Skill list, hook list, and health-check pattern are retained; the dashboard token and attachment bodies are explicitly flagged missing. |
| No source account, thread, project, canvas, or connector is a runtime dependency | pass | All retained facts and commands are directly usable on the Mac Studio without reopening a chat thread. |

- **Overall source-independence result:** Pass.
- **Blocked capability, if any:** Diagnosing the exact root cause of the iMessage channel instability remains blocked without a longer or more recent gateway-log capture.

## Provenance and retention

- **Capture boundary:** Pasted `openclaw` CLI onboarding transcripts, a gateway-log tail, two memory-seeding attempts, and a config-repair pass, all from the Mac Studio.
- **Completeness:** Partial. The onboarding wizard steps appear complete for the choices actually made; the gateway log is a 50-line tail, not a full history; the dashboard token and several small attachments are not supplied.
- **Source time context:** The gateway-log entries are explicitly timestamped `2026-05-27T16:07:34.883-05:00` and `2026-05-27T16:08:57.222-05:00`. The onboarding wizard and memory-seeding attempts are not independently dated in the supplied text but are consistent with the same general build period (May 2026) referenced elsewhere in this project's material.
- **Retention decision:** Redacted. A connection identifier (`conn=746aa055-...`) and a dashboard-token reference are present in the source; the token value itself is not reproduced.
- **Source caveats:** This is a reviewed semantic extract of CLI wizard output and a log tail, not a complete operational history of the OpenClaw deployment. The cause of the observed instability is not independently verified and should be treated as an open diagnostic question, not a settled finding.
