---
title: "Open WebUI Docker Update and Resilience"
primary_topic: "Open WebUI Docker update and resilience"
source_platform: "Claude + Notion + pasted text"
capture_mode: "export-excerpt"
completeness: "partial"
extraction_depth: "comprehensive"
requested_extraction_depth: "comprehensive"
source_title: "Open WebUI installation and restart-policy discussion"
source_date: "unknown"
source_time_context: "Attachment supplied 2026-07-22; Notion snapshot returned 2026-06-18; original Claude turn times unknown"
source_locator: "pasted-text.txt; private Claude share and Notion page withheld; official Open WebUI release page retained in provenance"
retention_decision: "redacted"
source_independence: "pass"
generated_at: "2026-07-22T16:20:47Z"
schema_version: "2.0"
artifact_type: thread-context-extract
---

# Open WebUI Docker Update and Resilience

## Introduction

This capture turns a mixed Claude-derived installation discussion, the supplied text attachment, the connected Notion setup snapshot, and the repository's current public records into a durable Open WebUI operations handoff. The durable decision is to treat the Mac Studio deployment as a Docker service on port 3000 backed by local Ollama, a persistent named volume, and an explicit container restart policy. The source moved from a native Python virtual environment proposal to a pinned Docker update for Open WebUI v0.10.2, then verified that the existing `open-webui` container already reports the `always` restart policy. The remaining operational gap is Docker Desktop launch at macOS login, plus a safe update procedure that first preserves the current image, environment, mounts, and data before recreating the container. The artifact also records conflicts between the historical Notion snapshot and the repository's current public boundary, so a future maintainer does not mistake a dated host record or an assistant claim for live telemetry.

## Extraction profile

- **Requested depth:** Highly detailed and very detailed context synthesis.
- **Selected depth:** Comprehensive.
- **Selection basis:** The user's request explicitly asked for a high quality and highly detailed transformation.
- **Profile changes:** None.
- **Focus areas:** Open WebUI installation path, version handling, Docker persistence, restart behavior, Ollama connectivity, Mac Studio fit, and safe next actions.
- **Must preserve:** The v0.10.2 correction, the Docker versus pip decision, the observed `always` policy, the Docker Desktop login dependency, the named-volume preservation requirement, and the version and configuration verification steps.
- **Safe exclusions:** Raw private workspace URLs, exact archive paths, credentials and token incidents, unrelated model inventory details, repeated assistant framing, and transcript/UI chrome.
- **Coverage rule:** Unique turns, decisions, commands, evidence, and missing sidecars are retained individually. Repetitive narrative, unrelated Notion timeline detail, and historical project facts outside the Open WebUI decision are compressed with their reason recorded.
- **Not carried forward:** Raw conversation transcript, private Notion ancestry and URLs, exact local volume paths, private archive locations, account identifiers, secrets or secret-adjacent incident details, and unverified claims about services not needed to resume this Open WebUI task.
- **Source-independence test:** Pass. A reader can understand the objective, current known state, update sequence, acceptance evidence, and unresolved gaps without Claude or Notion access. The missing Claude share and unfetched Notion child pages are explicitly cataloged as provenance gaps, not runtime dependencies.

## Coverage accounting

| Material class | Assessed | Retained | Compressed | Omitted with reason | Missing or unavailable | Notes |
|---|---:|---:|---:|---:|---:|---|
| Turns or turn groups | 10 | 8 | 2 | 0 | 0 | Mixed pasted blocks and source augmentations; role confidence is recorded per row. |
| Rich elements | 16 | 9 | 4 | 1 | 2 | Claude share and Notion child references remain missing or unavailable. |
| Decisions and alternatives | 8 | 7 | 1 | 0 | 0 | Pip, floating `main`, pinned `v0.10.2`, and restart-policy choices are distinguished. |
| Reusable assets | 6 | 5 | 1 | 0 | 0 | Safe inspection commands, update runbook, verification checklist, and future prompt retained. |

## Source synopsis

The supplied thread began with a request for a Mac installation script or prompt for the latest Open WebUI release, assuming Ollama was already running locally. The first captured answer treated the requested `v0.10.2` as nonexistent, proposed a Python 3.11 virtual environment under `~/open-webui`, and used `pip install --upgrade open-webui` followed by `open-webui serve` on port 8080. That route is technically a possible alternative, but it does not match the documented Mac Studio architecture in the Notion snapshot or this repository, both of which describe Open WebUI as a Docker service on `localhost:3000`.

The supplied material then included the official release tag and a correction that v0.10.2 was the current release at the time of the conversation. The revised answer pinned the package or Docker image to `0.10.2` and summarized release changes relevant to this workbench: streamed reasoning display, folder structure preservation for knowledge-base uploads, a memory system-context toggle, security and access-control fixes, safer SQLite upgrades, and non-admin settings-save fixes. The official Open WebUI GitHub releases page independently lists v0.10.2 as the latest release at the extraction checkpoint on 2026-07-22 and includes the security-advisory and SQLite-upgrade cautions. This is a verification checkpoint added during extraction, not proof that every claim in the original conversation was independently verified at the time it was written.

The discussion then shifted from installation to resilience. It separated container-level restart behavior from Docker Desktop startup on macOS. The proposed check was `docker inspect open-webui --format='{{.HostConfig.RestartPolicy.Name}}'`. The source compared `always`, `unless-stopped`, and `on-failure`, initially recommending `unless-stopped` to avoid a manually stopped container returning unexpectedly. The pasted terminal evidence showed the actual policy was `always`. The final interpretation accepted that state and recommended no container-policy change. It identified Docker Desktop's Start Docker Desktop when you log in setting as the remaining unconfirmed dependency. The named `open-webui` volume was treated as the persistence mechanism that survives container recreation, but the source did not capture the full mount, environment, image digest, or current application version.

The connected Notion page, titled Mac Studio Local AI Setup Journey, supplies the broader operating context. It records a Mac Studio M4 Max with 36 GB unified memory, external NVMe model storage, Ollama, LM Studio, direct MLX inference, Docker Desktop, Open WebUI on port 3000, and a local-first goal of a governed and restorable personal AI workstation. It records Open WebUI updates in May 2026 and later describes a wider RAG and OpenClaw stack. Those details are useful context, but they are dated source records. The repository's current project guide is authoritative for the public artifact boundary and explicitly treats RAG and vector storage as planned rather than as a completed repository capability. This extract therefore preserves the Notion claims as historical context and flags the status conflict instead of silently promoting them to current repository facts.

The repository records reinforce the Docker path: Open WebUI is the browser chat front door, Docker is the container runtime, Ollama is the local inference backend, port 3000 is the documented access point, and existing guidance uses a named `open-webui` volume plus a restart policy. The repository also contains a historical v0.9.5 update record and update guidance using a floating `main` image. That creates a concrete follow-up decision: keep a floating monthly-update policy, or revise the live guidance to a pinned release and document the upgrade checkpoint. This extract does not change host state or repository guidance; it gives a future operator enough information to make that decision safely.

## Turn ledger

| Turn | Role | Role confidence | Boundary evidence | Content elements | Summary |
|---|---|---|---|---|---|
| T001 | user | high | Explicit request sentence at the beginning of the supplied text | E001 | Asked for a Mac installation script or prompt for the latest Open WebUI, assuming local Ollama. |
| T002 | unknown, likely assistant | medium | Response-style heading, shell code block, and explanatory notes; no explicit speaker label | E005, E006 | Proposed pip and virtual-environment installation, first claiming v0.10.2 was unavailable and using port 8080. |
| T003 | unknown | low | Release URL followed by correction language; the preceding user turn is not present | E004 | Captured the version discrepancy and moved the source position to v0.10.2. |
| T004 | unknown, likely assistant | medium | Response-style heading, pinned shell and Docker blocks, release-note summary | E007 | Proposed pinned v0.10.2 installation and Docker equivalent, with security and database-upgrade rationale. |
| T005 | unknown, likely assistant | medium | Response-style heading, comparison table, commands, and recommendation | E009, E010, E011 | Explained the difference between container restart policy and Docker Desktop login startup. |
| T006 | tool or terminal output | high | Shell prompt, explicit `docker inspect` command, and returned value | E008 | Recorded the observed `open-webui` restart policy as `always`. |
| T007 | unknown, likely assistant | medium | Final response framing and next-action checklist | E009, E010 | Accepted `always`, identified Docker Desktop login launch as unconfirmed, and suggested checking Qdrant and SearXNG. |
| T008 | tool | high | Notion connector fetch result with page title, properties, content, and child references | E003, E012, E013, E014, E015 | Supplied the dated Mac Studio architecture, setup journey, runtime inventory, benchmark context, Open WebUI state, and historical next phases. |
| T009 | tool | high | Local repository files and project guide searched from the destination checkout | E016 | Supplied the current public boundary, Docker/Open WebUI documentation, restart examples, and the repository's warning that RAG is not a completed capability. |
| T010 | tool | high | Official Open WebUI GitHub release page fetched during extraction | E004 | Independently checked the v0.10.2 release listing and relevant security, memory, folder-upload, and SQLite notes. |

## Content element ledger

| Element | Turn | Type | Owner | Fidelity | Source locator | Destination reference | Catalog action |
|---|---|---|---|---|---|---|---|
| E001 | T001 | file | user | text-extracted | Local attachment `pasted-text.txt` | Source synopsis and provenance | retain |
| E002 | T003 | citation | unknown | referenced-not-supplied | User-supplied Claude share link, withheld from the public artifact | Provenance and open questions | flag-missing |
| E003 | T008 | tool_event | tool | text-extracted | Connected Notion page titled Mac Studio Local AI Setup Journey; private URL withheld | Source synopsis and provenance | retain |
| E004 | T003, T010 | citation | user, tool | text-extracted | Official Open WebUI GitHub releases page and v0.10.2 tag | Source synopsis, reusable methods, and open questions | retain |
| E005 | T002 | generated_file | assistant or unknown | text-extracted | Pip and virtual-environment shell block | Decisions and rationale as rejected alternative | compress |
| E006 | T002 | generated_file | assistant or unknown | text-extracted | Docker `:main` shell block | Decisions and rationale as superseded floating-tag option | compress |
| E007 | T004 | generated_file | assistant or unknown | text-extracted | Docker `v0.10.2` shell block and pinned pip variant | Reusable methods and assets | retain |
| E008 | T006 | tool_event | user or terminal | text-extracted | `docker inspect` command and returned value `always` | Current state and handoff | retain |
| E009 | T005, T007 | artifact | assistant or unknown | text-extracted | Restart-policy comparison and recommendation | Decisions and rationale | retain |
| E010 | T005, T007 | artifact | assistant or unknown | description-only | Docker Desktop login-start setting | Actionable handoff | retain |
| E011 | T004, T005 | artifact | assistant or unknown | text-extracted | Named volume persistence explanation | Decisions, update runbook, and acceptance evidence | retain |
| E012 | T008 | artifact | tool | text-extracted | Notion status, model, benchmark, and routing tables | Historical context and limits | compress |
| E013 | T008 | diagram | tool | text-extracted | Notion Council of AIs and local-runtime code block | Reusable architecture context | retain |
| E014 | T008 | citation | tool | metadata-only | Notion child pages and task database listed below the supplied page | Provenance and open questions | flag-missing |
| E015 | T008 | file | tool | text-extracted | Private paths, archive references, account details, and secret-bearing incident references in the source page | Privacy gate only | omit-with-reason |
| E016 | T009 | ui_chrome | tool | metadata-only | Repository search context and dated-record framing | Boundary evidence only | exclude-chrome |

## Normalization exceptions

1. The supplied text is a flattened mixed capture, not a structured Claude export. Several response blocks are assigned medium-confidence roles from headings, code blocks, and response framing. The release-link correction lacks the preceding user turn and is therefore recorded as an unknown or low-confidence boundary rather than reconstructed.
2. Repeated phrases such as corrected version discrepancy and reconciled cached data discrepancy are treated as response framing or duplicate narrative, not as separate decisions.
3. The Claude share is a supplied locator, not a captured transcript. The available reader could not retrieve its conversation payload, so no claim is made about hidden turns, Project instructions, files, artifacts, citations, or branches.
4. The Notion page was fetched successfully, but the linked child pages and task database were not individually fetched. Their titles and references are metadata only.
5. Exact Notion workspace URLs, ancestor pages, machine-specific archive paths, account identifiers, and token or credential incident details are not retained in this public repository artifact.
6. Notion reports later RAG and service completion, while the current repository guide says RAG and vector storage remain planned and are not represented as a completed repository capability. The public artifact follows the repository boundary and records the Notion statement as dated and unresolved.
7. The source combines historical versions. The repository records an earlier v0.9.5 Open WebUI update, the source discussion targets v0.10.2, and the official release page was checked separately on 2026-07-22. A future operator must inspect the actual running image before deciding whether an upgrade is needed.

## Value inventory

| Area | Extracted value | Claim class | Source support |
|---|---|---|---|
| Purpose | Provide a repeatable Mac procedure for installing or updating Open WebUI alongside local Ollama, then make the service survive restarts and reboots. | stated | T001, T004, T005 |
| Context and constraints | The project is a personal, local-first Mac Studio workbench with Docker as the documented Open WebUI runtime, Ollama as the local backend, and a named volume for application data. | stated | T008, T009 |
| Reasoning and alternatives | Pip and Docker are both possible, but Docker matches the existing host architecture and port mapping. A pinned image improves reproducibility during a security-sensitive update, while a floating `main` tag simplifies ongoing updates. | inferred, proposal | T002, T004, T009, T010 |
| Decisions and outcomes | The observed restart policy is `always`, so no policy change is required. Docker Desktop login startup remains unconfirmed and is a separate prerequisite. | stated, unresolved | T006, T007 |
| Reusable assets | Inspect-first commands, a volume-preserving pinned-image runbook, a restart-policy model, an acceptance checklist, and a future operator prompt. | proposal | T004-T007, T009 |
| Limits | The full Claude share, Notion child pages, current image digest, full container environment, and actual Docker Desktop login setting are not captured. | unknown | E002, E014, T006, T007 |

## Decisions and rationale

### 1. Use the documented Docker deployment as the primary path

The pip/venv proposal is retained as a rejected or alternate path because it was part of the supplied reasoning. It assumes Python 3.11, starts on port 8080, and creates application state inside a Python environment. The Mac Studio project records instead establish Docker Desktop, Open WebUI on port 3000, and a container-backed data volume. Switching runtimes would create a second state location and a second operational model. The project-aligned choice is therefore Docker.

### 2. Preserve the existing data volume during an update

The source uses `open-webui:/app/backend/data`. This is the key persistence boundary for chat history, settings, and the SQLite database in the documented Docker model. A container can be recreated while the named volume remains, but the source did not prove that the live container uses only this volume or that no additional mounts and environment variables matter. Inspect the live configuration and take a checkpoint before recreation.

### 3. Pin v0.10.2 for the release-specific update

The source first suggested a floating `:main` tag and later pinned `v0.10.2` after the release correction. The pinned tag is the safer handoff for a security and database-migration checkpoint because the operator knows exactly what was pulled. The tradeoff is that a pin does not receive later updates automatically. The repository's existing monthly update guidance uses `main`, so this is a documentation-policy choice that still needs owner confirmation before live guides are changed.

### 4. Keep the observed `always` restart policy

The terminal evidence reports `always`. The source considered `unless-stopped` more convenient during maintenance, but the final interpretation accepted `always` because this workstation is intended to run the service continuously and no repeated manual stop workflow was established. No `docker update` action is required for Open WebUI based on the supplied evidence.

### 5. Treat Docker Desktop login startup as a separate dependency

Docker's restart policy only takes effect after the Docker daemon is running. On a reboot, Docker Desktop must launch at login before the container can be restarted. This setting was not verified in the source. It is the first host-side resilience check after the read-only container inspection.

### 6. Extend the same resilience check to adjacent services only after evidence

The source suggests checking Qdrant and SearXNG. That is a useful proposal for a coherent local stack, but the repository currently does not establish a completed RAG deployment. Check only services that exist on the host and record their current policies. Do not infer deployment from a dated Notion checklist.

## Actionable handoff

- **Current state:** The repository documents Open WebUI as a Docker service on port 3000. Historical repository records mention a v0.9.5 update. The supplied terminal evidence shows the live `open-webui` container had restart policy `always`. The proposed target is v0.10.2. This extraction did not change the Mac or any container.
- **Resume point:** On the Mac, capture the live container image, digest, mounts, environment, port mapping, restart policy, and volume state. Confirm Docker Desktop starts at login. Back up the application data before any recreation.
- **Required context:** Docker Desktop must be installed and running, Ollama must remain reachable from the container, the current Open WebUI configuration must be preserved, and the operator must choose pinned-release maintenance versus the repository's floating-tag policy.

| Action | Owner | Status | Dependencies | Evidence or acceptance condition |
|---|---|---|---|---|
| Inspect current image, digest, mounts, environment, ports, volume, and restart policy | user | ready | Docker Desktop and `open-webui` container available | A saved read-only inspection shows the configuration that must be preserved. |
| Confirm Docker Desktop starts when the user logs in | user | ready | Access to Docker Desktop settings | Docker Desktop launches after a macOS login or reboot test. |
| Create a recoverable checkpoint of Open WebUI data | user | ready | Named volume identified; enough storage for backup | The backup exists and can be located before container recreation. |
| Pull and recreate the container with a pinned v0.10.2 image while preserving configuration | user or agent | proposed | Checkpoint complete; image available; env and mounts reviewed | `docker inspect` reports the intended v0.10.2 image, port 3000 remains reachable, and the named volume is unchanged. |
| Verify Ollama routing and model visibility through Open WebUI | user | proposed | Updated container running; Ollama available on the host | Open WebUI loads, local models appear, and a small inference test completes. |
| Inspect restart policies for Qdrant and SearXNG if they are actually deployed | user | proposed | Host evidence that each container exists | Each existing service has a documented policy and remains reachable after Docker restart. |
| Reconcile repository guidance that uses `main` with the pinned-release decision | maintainer | proposed | Owner choice on update policy | The live guide states whether updates are floating, pinned, or checkpointed per release. |

## Reusable methods and assets

### Inspect-first commands

These commands are read-only and should precede any container recreation:

```bash
docker inspect open-webui --format='image={{.Config.Image}}'
docker inspect open-webui --format='restart={{.HostConfig.RestartPolicy.Name}}'
docker inspect open-webui --format='ports={{json .HostConfig.PortBindings}}'
docker inspect open-webui --format='mounts={{json .Mounts}}'
docker inspect open-webui --format='env={{json .Config.Env}}'
docker volume inspect open-webui
docker ps --filter name=open-webui --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
```

Review the output for hidden configuration before copying the run command. In particular, preserve any explicit Ollama endpoint, authentication, web-search, embedding, or storage environment variables that are present on the live container. The source only proves the restart policy, not the rest of the configuration.

### Project-aligned pinned update runbook

This is a reviewable runbook, not an instruction that was executed during extraction. The `docker run` line is intentionally shown as a baseline. Add all environment and mount options discovered during inspection before using it.

```bash
set -euo pipefail

IMAGE='ghcr.io/open-webui/open-webui:v0.10.2'
CONTAINER='open-webui'
VOLUME='open-webui'

docker pull "$IMAGE"
docker stop "$CONTAINER"
docker rm "$CONTAINER"

docker run -d \
  --name "$CONTAINER" \
  -p 3000:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v "$VOLUME:/app/backend/data" \
  --restart always \
  "$IMAGE"

docker ps --filter name="$CONTAINER" --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
curl -fsS http://localhost:3000/ | head -3
```

Do not use this baseline verbatim if the inspection shows additional configuration. Container removal is recoverable only when the data volume and all required configuration have been preserved. A host backup or checkpoint is a prerequisite.

### Future operator prompt

> On the Mac Studio, update the existing Docker deployment of Open WebUI to the pinned `ghcr.io/open-webui/open-webui:v0.10.2` image. First perform read-only inspection of the current image, digest, mounts, environment, ports, named volumes, and restart policy. Do not stop or remove the container until the configuration is captured and the application data has a recoverable checkpoint. Preserve the existing Ollama connection, port 3000, named application-data volume, and restart policy `always`. Recreate only after reviewing the complete configuration. Then verify the running image, container status, Open WebUI at `http://localhost:3000`, local Ollama model visibility, a small inference request, and the restart policy. Separately confirm Docker Desktop starts at macOS login. If any required configuration or backup is missing, stop and report the gap instead of guessing.

### Resilience model

| Layer | What it controls | Source status |
|---|---|---|
| Container restart policy | Restarting `open-webui` after crashes, stops, or Docker daemon restart according to the policy | Confirmed `always` from T006 |
| Docker Desktop login launch | Starting the Docker daemon after macOS login or reboot | Unconfirmed; first host check |
| Named application-data volume | Preserving Open WebUI state across container recreation | Documented and proposed; live mount still needs inspection |
| Ollama backend | Providing local model inference to Open WebUI | Documented in project context; live connectivity needs verification |
| Adjacent containers | Keeping RAG or private search services available | Conditional; do not infer deployment from dated records |

## Open questions and limits

- What image tag or digest is currently running? The source only records the restart policy. The repository's v0.9.5 record is historical and is not live telemetry.
- Does the current container use only the named `open-webui` volume, or also bind mounts, environment variables, secrets, custom networks, or provider settings? Full inspection is required before recreation.
- Is Docker Desktop configured to start when the user logs in? This was identified as the likely resilience gap but was not verified.
- Does the host currently need an explicit `OLLAMA_BASE_URL` or equivalent endpoint? The source says Ollama may be auto-detected, but that behavior must be verified for this Docker network.
- Should the repository's update policy continue using `:main`, switch to pinned tags, or document a checkpointed release workflow? The source contains both recommendations.
- Are Qdrant and SearXNG actually present and healthy on the target host? The repository and Notion records differ on the RAG completion state. Verify containers rather than relying on either dated claim.
- What content, instructions, artifacts, or citations exist in the inaccessible Claude share? Unknown. The current Open WebUI handoff is not blocked by that gap, but a lossless Claude migration would require a human-supplied export.
- What details are in the referenced Notion child pages and task database? Unknown. Only their titles and links were visible in the fetched parent page.
- Have all v0.10.2 release notes and security advisory details been reviewed for this local use case? The official release page confirms the advisory language, but this extract does not reproduce or assess private advisory details.

## Rehydration test

| Test | Result | Evidence or gap |
|---|---|---|
| A reader can explain the objective without the source platform | pass | T001, the introduction, and the source synopsis define the install, update, and resilience objective. |
| Decisions and consequential rationale are recoverable | pass | Docker over pip, pinned versus floating image, named-volume preservation, and `always` policy rationale are recorded in Decisions and rationale. |
| Current state and next action are unambiguous | pass | The current known state is `always` restart policy with Docker Desktop login launch unconfirmed; the first action is read-only inspection and checkpointing. |
| Retained assets are available or missing assets are explicitly cataloged | pass | Commands and runbook are included. The Claude share and Notion child pages are marked missing or metadata-only. |
| No source account, thread, project, canvas, or connector is a runtime dependency | pass | The artifact contains the operating context and does not require reopening Claude or Notion to resume. |

- **Overall source-independence result:** Pass.
- **Blocked capability, if any:** A complete transcript archive or reconstruction of the linked Claude thread remains unavailable. That does not block the narrower Open WebUI update and restart-policy handoff.

## Provenance and retention

- **Capture boundary:** Supplied local text attachment, user-provided Claude share locator, fetched Notion page titled Mac Studio Local AI Setup Journey, relevant files in the destination repository, and the official Open WebUI GitHub release page checked during extraction. The linked Claude payload and Notion child pages were not captured.
- **Completeness:** Partial. The supplied text and fetched parent Notion page were assessed in full for this artifact's scope, but the original Claude conversation and referenced Notion children are incomplete or unavailable.
- **Source time context:** Attachment file was supplied in the current thread and is dated by local filesystem metadata 2026-07-22. The Notion connector returned a page snapshot as of 2026-06-18, with dated project updates through June 2026. The original Claude conversation date and turn times are unknown. The official release page was checked on 2026-07-22.
- **Retention decision:** Redacted.
- **Source caveats:** This is a reviewed semantic extract, not a lossless transcript. Assistant assertions are not automatically verified facts. Historical host paths, versions, status checklists, private workspace structure, and source-platform UI content were generalized, compressed, or omitted. The official release page is retained as a public verification reference: [Open WebUI releases](https://github.com/open-webui/open-webui/releases).
