# Mac Studio hardening execution record

Date: 2026-08-02

This record captures host-state changes and checks completed against the Mac Studio local AI workbench. It is an execution record, not proof of a hosted service or production deployment.

## Completed changes

- OpenClaw gateway Control UI insecure-auth fallback disabled. The gateway remains loopback-only on `127.0.0.1:18789`.
- OpenClaw gateway and Ollama credentials were moved out of plaintext configuration into macOS Keychain-backed exec SecretRefs. The repository-side resolver is [scripts/openclaw-keychain-resolver.sh](../scripts/openclaw-keychain-resolver.sh). No secret values are stored in this repository.
- OpenClaw now reports `agents.defaults.sandbox.mode=all`. The primary `ollama/gemma3:27b` model has web and browser tool groups denied.
- LM Studio was restarted with a loopback-only bind on `127.0.0.1:1234`.
- Qdrant, Open WebUI, and SearXNG were recreated with localhost-only host bindings. Their existing storage/configuration mounts were preserved. The prior containers remain stopped as rollback points with the `-pre-hardening-2026-08-02` suffix.
- A protected pre-change OpenClaw configuration backup was created on the host.

## Fresh verification

- Ollama `gemma3:12b` returned exactly `READY.` through the local API in 11.9 seconds.
- LM Studio `google/gemma-3-4b` returned exactly `READY.` through the local OpenAI-compatible API in 0.58 seconds.
- Open WebUI is healthy and returns HTTP 200 on its local health endpoint.
- SearXNG returns HTTP 200 for its local endpoint and a JSON search for `OpenAI` returned a result.
- Qdrant returns HTTP 200 from its readiness endpoint.
- OpenClaw gateway status reports a running LaunchAgent, a successful read probe, and no plaintext, unresolved, shadowed, or legacy secrets.
- OpenClaw doctor reports `ok=true`, 24 checks run, and no findings.
- OpenClaw security audit reports 0 critical findings. The two warnings are the expected loopback-only trusted-proxy warning and a missing `operator.read` scope on the local diagnostic probe.

## Remaining boundary

The sandbox policy is configured, but the required `openclaw-sandbox:bookworm-slim` image is not present. The documented npm-install Docker build was attempted twice and did not produce an image. No unrelated local image was substituted. Until the Debian base image can be pulled by the Docker builder, an OpenClaw agent run that requires Docker sandboxing remains unverified.

RAG and application-level Qdrant integration remain unverified. Qdrant readiness alone is not evidence that a working RAG pipeline exists. The `zen_ellis` container was not changed because its role and integration contract are not established by this repository.

## Follow-up acceptance check

After Docker Hub access is working for the Docker builder, build the documented `openclaw-sandbox:bookworm-slim` image, recreate configured sandbox containers, and rerun `openclaw status --all` plus a bounded local agent smoke test. Then re-run the OpenClaw security audit and this record's endpoint checks.

## Thread closeout and successor handoff

This is the final closeout state for the execution thread. The repository and
Notion records should be read together: this report is the concise host
execution record, while `docs/17-openclaw-hardening-handoff-2026-08-02.md` is
the successor-thread runbook.

### Complete and verified

- Reviewed the adjacent same-project Codex threads and the supplied Notion
  setup journey before applying changes.
- Preserved a protected OpenClaw configuration backup on the host.
- Moved OpenClaw gateway and Ollama credentials to macOS Keychain-backed
  SecretRefs through the public-safe resolver script.
- Disabled insecure Control UI authentication, retained loopback gateway
  binding, enabled effective sandbox mode `all`, and denied web/browser groups
  for the default `ollama/gemma3:27b` model.
- Rebound LM Studio, Ollama, Open WebUI, Qdrant, and SearXNG to loopback-only
  listeners where verified.
- Preserved existing data/configuration mounts and stopped rollback containers
  for Qdrant, Open WebUI, and SearXNG.
- Verified deterministic local inference, endpoint health, SearXNG JSON search,
  OpenClaw gateway reachability, clean secrets audit, clean doctor output, and
  zero critical OpenClaw security findings.
- Removed temporary credential-bearing inspection files and smoke artifacts.

### Explicitly not complete

- The required `openclaw-sandbox:bookworm-slim` image is still absent. The
  documented Docker build was attempted twice without producing an image.
- A sandboxed OpenClaw agent turn has not passed. The prior no-delivery attempt
  failed before model execution because the image was missing.
- The deep diagnostic still reports the `operator.read` scope mismatch.
- Open WebUI-to-Ollama, OpenClaw-to-SearXNG, and application-level Qdrant/RAG
  integration have not been proven as end-to-end workflows.
- The role and configuration source of `zen_ellis` remain unknown.
- No LAN access is required by the current evidence. Any future LAN exposure is
  a new owner decision, not a default follow-up change.

### Handoff safety rules

- Do not weaken gateway authentication or disable sandbox policy to bypass the
  missing image or diagnostic warning.
- Do not call Qdrant readiness, a running container, or a model catalog proof
  of an integrated application capability.
- Do not change `zen_ellis` until its source configuration, mounts, owner, and
  consumer relationship are identified.
- Keep secrets, Keychain values, private Notion identifiers, raw connector
  configuration, and local runtime logs out of the repository.
- The current repository changes are local and uncommitted. Review and sync
  them through the normal GitHub workflow after inspection.
