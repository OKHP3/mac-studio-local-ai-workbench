---
title: "OpenClaw hardening and successor handoff"
date: 2026-08-02
status: "Dated current-state record"
---

# OpenClaw hardening and successor handoff

## Purpose and evidence boundary

This is a public-safe closeout record for the August 2, 2026 Mac Studio local
AI workbench hardening thread. It is designed to let a successor thread resume
from verified evidence rather than reconstructing the work from historical
notes. It does not replace the May 2026 baseline records or claim that the
workbench is a hosted service, a completed RAG deployment, or an unattended
autonomous system.

Unless noted as historical, the observations below came from direct host checks
during this thread. Secret values, private Notion identifiers, raw connector
configuration, and local logs are intentionally excluded.

## Current verdict

**Operational local foundation, materially hardened, with sandbox execution and
end-to-end integration still incomplete.**

The strongest working route is host-native Ollama and LM Studio, with Docker
services for Open WebUI, SearXNG, and Qdrant. OpenClaw is a loopback-only
LaunchAgent using `ollama/gemma3:27b`, but its agent turns are presently blocked
by a missing required Docker sandbox image.

## Completed in this thread

### OpenClaw hardening

- Confirmed OpenClaw `2026.7.1-2` is managed by a loaded macOS LaunchAgent and
  is loopback-bound on port `18789`.
- Set `gateway.controlUi.allowInsecureAuth` to `false`.
- Set `agents.defaults.sandbox.mode` to `all`.
- Denied `group:web` and `browser` for the small default model
  `ollama/gemma3:27b`.
- Restarted the gateway and confirmed that `openclaw gateway status
  --require-rpc` succeeds.
- Migrated the gateway token and local Ollama credential to Keychain-backed
  SecretRefs. `openclaw secrets audit --check --allow-exec` now reports no
  plaintext, unresolved, shadowed, or legacy findings.
- The deep security audit now reports **0 critical** findings. Its small-model
  control is satisfied: sandboxing is required and web/browser tools are off
  for the default model.

### Local runtimes and services

- Confirmed the Ollama service is running with the configured external model
  store, Flash Attention, and q8_0 KV cache. A deterministic `gemma3:12b`
  request returned exactly `READY.`.
- Confirmed LM Studio is running on port `1234`; its deterministic local API
  completion returned exactly `READY.` using `google/gemma-3-4b`.
- Confirmed Open WebUI responds successfully and is now published only on
  `127.0.0.1:3000`.
- Confirmed Qdrant reports ready and is now published only on
  `127.0.0.1:6333-6334`.
- Confirmed SearXNG responds successfully and returns JSON results for a
  controlled local query.
- Confirmed Docker is running the expected Open WebUI, Qdrant, SearXNG, and
  `zen_ellis` containers. Open WebUI and `zen_ellis` reported healthy.

## Remaining work

### Blocker: build the OpenClaw sandbox image

The configured `sandbox.mode: all` is enforced. A no-delivery OpenClaw agent
smoke turn fails before model execution because the required image
`openclaw-sandbox:bookworm-slim` is absent. The npm-installed OpenClaw package
documents an inline Docker build based on Debian Bookworm with Bash, CA
certificates, curl, Git, jq, Python 3, and ripgrep. An earlier build attempt
did not complete while resolving the Debian base-image metadata.

Acceptance condition:

1. Build and inspect `openclaw-sandbox:bookworm-slim` from the documented
   Dockerfile.
2. Run a no-delivery OpenClaw exact-response smoke turn in a dedicated session.
3. Record the response, latency, and sandbox container state without storing
   transcripts, credentials, or runtime logs in this repository.

### OpenClaw follow-up

- Resolve or explicitly accept the deep-audit probe warning for missing
  `operator.read`. The gateway RPC read probe itself succeeds; the discrepancy
  must not be described as resolved until the deep audit agrees or the OpenClaw
  limitation is documented.
- Keep the Control UI loopback-only unless a separate proxy decision defines
  trusted proxies and authentication.
- Define a separate, sandboxed research agent if OpenClaw needs web or browser
  access. Do not re-enable those tools for the current 27B default agent by
  assumption.

### Service boundary and integration follow-up

- SearXNG was narrowed to `127.0.0.1:8888` during this thread. Decide whether
  any future LAN access is required before changing that boundary.
- Confirm LM Studio's intended bind policy before treating it as a LAN service.
  Its local API works, but LAN access is not an acceptance requirement without
  a documented consumer.
- Prove the OpenClaw-to-SearXNG path only through an approved, separately
  scoped research-agent policy. Direct SearXNG JSON availability is confirmed;
  the hardened default agent intentionally cannot use web tools.
- Prove or reject RAG with a disposable sanitized fixture: create or use a test
  collection, index, retrieve, verify the intended consumer, and record the
  cleanup. Qdrant readiness is not RAG proof.
- Identify `zen_ellis` from its declared configuration, owner, data mounts, and
  consumer relationship before changing or treating it as a workbench component.
- Replace or deliberately accept rolling container image references, including
  the observed SearXNG `latest` and `zen_ellis` `main` images, after locating
  their source configuration.

## Suggested successor-thread runbook

1. Re-run `openclaw gateway status --require-rpc`, `openclaw security audit
   --deep`, and `openclaw secrets audit --check --allow-exec` before changing
   anything.
2. Diagnose Docker base-image resolution, build the OpenClaw sandbox image, and
   run the constrained no-delivery agent smoke test.
3. Resolve the `operator.read` deep-audit discrepancy or capture it as an
   accepted product limitation with version and recovery notes.
4. Make explicit decisions for SearXNG and LM Studio network exposure.
5. Run the disposable Qdrant integration test and document whether RAG is
   active or remains planned.
6. Update this dated record or add a new one with fresh evidence. Preserve the
   older May and August records as historical snapshots.

## Validation completed for this record

- `openclaw gateway status --require-rpc`: passed.
- `openclaw security audit --deep`: 0 critical; remaining warnings are the
  loopback reverse-proxy advisory and the `operator.read` deep-probe mismatch.
- `openclaw secrets audit --check --allow-exec`: passed cleanly.
- Ollama deterministic local request: passed.
- LM Studio deterministic local API request: passed.
- Open WebUI HTTP check, SearXNG JSON query, and Qdrant readiness check:
  passed.
- `sh -n scripts/openclaw-keychain-resolver.sh` and `git diff --check` passed;
  the changed handoff and execution records were re-read after writing.

## Related records

- `docs/16-local-ai-stack-readiness-research-2026-08-02.md`: pre-hardening
  research and execution plan.
- `docs/16-openclaw-readiness-and-local-to-cloud-ai-pipeline-2026-08-02.md`:
  broader local-to-cloud operating model and delegation backlog.
- `reports/openclaw-related-runtime-readiness-audit-2026-08-02.md`: earlier
  readiness audit. Its pre-hardening findings are superseded where this record
  provides direct post-change evidence.

## Final turn closeout and successor contract

This addendum records the final state of this thread. It supersedes any earlier
same-day statement in this file that describes SearXNG as LAN-published or
describes the local inference smoke results with placeholder response text.

### Work completed and preserved

- Reviewed the adjacent same-project Codex threads and the linked Notion setup
  journey before changing host state.
- Created a protected pre-change OpenClaw configuration backup at the host-local
  path `~/.openclaw/backups/2026-08-02-pre-hardening-1/openclaw.json`.
- Added the public-safe Keychain resolver at
  `scripts/openclaw-keychain-resolver.sh`; no credential values are present in
  the repository.
- Migrated the OpenClaw gateway token and Ollama credential to Keychain-backed
  SecretRefs, disabled insecure Control UI authentication, and restarted the
  gateway.
- Applied the small-model web/browser restriction and verified effective
  sandbox mode `all`.
- Rebound LM Studio, Ollama, Open WebUI, Qdrant, and SearXNG to loopback-only
  service boundaries where those listeners are in scope.
- Recreated Qdrant, Open WebUI, and SearXNG with their existing persistent or
  configuration mounts. The prior containers remain stopped with the
  `-pre-hardening-2026-08-02` suffix for rollback.
- Ran fresh deterministic local checks. Ollama `gemma3:12b` and LM Studio
  `google/gemma-3-4b` both returned exactly `READY.`. Open WebUI health,
  SearXNG JSON search, and Qdrant readiness also passed.
- Removed temporary Docker environment snapshots and smoke-test files after
  verification.

### Final evidence state

- `openclaw gateway status --require-rpc`: LaunchAgent running, loopback
  gateway, successful read probe, `connected-no-operator-scope` capability.
- `openclaw secrets audit --check --allow-exec`: clean, with zero plaintext,
  unresolved, shadowed, or legacy findings.
- `openclaw doctor --lint --deep --non-interactive`: `ok=true`, 24 checks run,
  no findings.
- `openclaw security audit --deep`: 0 critical findings, with the loopback
  trusted-proxy advisory and the missing `operator.read` deep-probe scope
  remaining as warnings.
- The local Docker service layer is healthy and loopback-bound. `zen_ellis`
  remains running but its role and ownership were not established.

### Work still remaining

1. Build the documented `openclaw-sandbox:bookworm-slim` image. Two Docker
   builder attempts did not produce the image, so no unrelated application
   image was substituted.
2. After the image exists, run a bounded no-delivery OpenClaw agent smoke test
   and capture public-safe evidence that a sandboxed turn actually executes.
3. Resolve or explicitly document the `operator.read` mismatch between the
   successful gateway read probe and the deep security diagnostic.
4. Prove Open WebUI-to-Ollama connectivity and the intended SearXNG consumer
   path, rather than relying on separate service health checks.
5. Run a disposable Qdrant ingestion and retrieval fixture through the intended
   consumer. Do not describe RAG as complete from readiness alone.
6. Identify `zen_ellis` from its source configuration, mounts, owner, and
   consumer relationship before changing it.
7. Decide whether any LAN access is required. The present safe state is
   loopback-only for the verified local services.
8. Locate the source of the Docker container definitions and decide whether
   rolling references such as SearXNG `latest` and `zen_ellis` `main` should be
   pinned for reproducibility.

### Successor-thread first actions

1. Read this file and `reports/mac-studio-hardening-execution-2026-08-02.md`.
2. Re-run the gateway, secrets, doctor, and deep security checks before making
   changes.
3. Diagnose Docker base-image resolution, build the required sandbox image,
   and verify the image before running an agent turn.
4. Preserve the loopback boundary while resolving the operator scope issue.
5. Test service integration and the disposable RAG fixture separately.
6. Update this record with new evidence and leave older dated records intact.
