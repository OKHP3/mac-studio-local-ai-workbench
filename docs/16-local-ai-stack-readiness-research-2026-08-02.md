# Local AI Stack Readiness Research

**Project:** mac-studio-local-ai-workbench  
**Suite:** SHOAL / Workbench  
**Capture date:** 2026-08-02  
**Capture type:** Host-readiness research, deployment guidance, and delegated execution plan  
**Status:** Research complete. Execution is intentionally gated on owner review.

## Purpose

This record preserves the findings from the August 2026 review of the Mac Studio local AI stack. It records what was observed on the host, what the official project documentation recommends, where the current installation is aligned, and which gaps must be resolved before the stack can be called optimized.

This is an operational readiness record, not proof of a hosted service, enterprise deployment, or production platform. Historical claims in the repository and the companion Notion project page remain historical records. Current host evidence takes precedence for present-state conclusions.

No configuration changes, secret migrations, service restarts, package installations, or container modifications were performed during this research pass.

## Executive conclusion

The overall architecture is sound for a personal Apple Silicon workstation:

- Ollama and LM Studio should remain host-native inference runtimes.
- Docker should host auxiliary services such as Open WebUI, SearXNG, and Qdrant.
- OpenClaw should remain a locally supervised gateway with a deliberately narrow trust boundary.
- External NVMe storage should hold model and cache data where supported.
- Local-only network binding should be the default unless remote access is explicitly required.

The installation is not yet fully optimized or acceptance-ready. OpenClaw has material security findings, LM Studio has an unresolved live-inference failure, Qdrant is exposed on all interfaces, and the Docker service configuration has not yet been reconciled against reproducibility and persistence requirements.

## Evidence boundary

The following conclusions are based on direct host checks performed on 2026-08-02, repository documentation, and official documentation for the relevant projects.

### Confirmed on the host

- OpenClaw is installed at `/opt/homebrew/bin/openclaw`, version `2026.7.1-2`.
- The OpenClaw LaunchAgent is installed and running on loopback port `18789`.
- OpenClaw reports a reachable gateway and a default model of `ollama/gemma3:27b`.
- OpenClaw reports 54 discovered skills, 28 eligible and visible to the model.
- No OpenClaw nodes are paired and no channels are configured for active use.
- Ollama version `0.23.1` is available through its local API on port `11434`.
- The Ollama inventory includes `nomic-embed-text`, `llama3.1:8b`, `mistral-small3.1:24b`, `codestral:22b`, `gemma3:27b`, `gemma3:12b`, and `phi4:14b`.
- LM Studio is installed, serving on port `1234`, and advertising a current model catalog.
- LM Studio is listening on all interfaces according to the socket check, while the local API responds through localhost.
- A fresh LM Studio chat-completion smoke test timed out or returned no usable content. This is a readiness failure, not a successful inference validation.
- Docker client and server are version `29.6.2`.
- The running containers include `open-webui`, `qdrant`, `searxng`, and `zen_ellis`.
- Open WebUI, SearXNG, and Qdrant responded to basic local health checks. `zen_ellis` reported healthy.
- Qdrant ports `6333` and `6334` are currently published on `0.0.0.0`.

### Historical or repository-derived context

- The documented primary OpenClaw model is `gemma3:27b` through Ollama.
- The documented model storage roots are under `/Volumes/OKH-Local/07_Local_LLMs/`.
- The repository records a 36 GB unified-memory Mac Studio and warns against oversized models such as the previously attempted 70B model.
- The repository records successful strict benchmark results for `gemma3:12b` and `gemma3:27b`.
- Current repository version records are dated snapshots and require reconciliation with the live host before being treated as current.

## Tool-by-tool assessment

### OpenClaw

#### Current state

OpenClaw is operational at the process and gateway level. Its macOS LaunchAgent is running, the gateway is reachable, and the configured model is available through Ollama. The current deployment is appropriately loopback-bound for a personal workstation.

The direct audit found one critical finding and several warnings:

1. `gemma3:27b` is configured with web search, web fetch, and browser capability while sandboxing is not enabled.
2. `gateway.controlUi.allowInsecureAuth` is enabled.
3. Secret-bearing values remain in plaintext configuration fields.
4. Reverse-proxy trust is not configured. This is acceptable while the gateway remains loopback-only, but not sufficient for a proxy-exposed service.
5. The deep gateway probe lacks the expected operator read scope.

#### Best-practice implementation

OpenClaw should use the supervised per-user LaunchAgent model documented for macOS. State and credentials should remain on local, non-synced storage. The trust model should be treated as a personal assistant boundary, not a hostile multi-tenant boundary.

The preferred hardening sequence is:

- Enable sandboxing for agent work that can receive untrusted web content, or restrict web and browser tools for the affected model.
- Disable insecure Control UI authentication unless the gateway is strictly local and the compatibility behavior is explicitly required.
- Migrate credentials to OpenClaw SecretRefs and verify with the secrets audit command.
- Keep nodes and channels disabled until their trust model and owner use case are explicit.
- Use gateway status, doctor, skills check, security audit, and an end-to-end agent smoke test as separate acceptance checks.

Official references: [OpenClaw macOS gateway](https://docs.openclaw.ai/platforms/mac/bundled-gateway), [OpenClaw security](https://docs.openclaw.ai/gateway/security), [OpenClaw tools](https://docs.openclaw.ai/gateway/config-tools), [OpenClaw secrets](https://docs.openclaw.ai/gateway/secrets), and [Control UI security](https://docs.openclaw.ai/control-ui).

### Ollama

#### Current state

Ollama is healthy as a host-native service. The API responds locally and the expected models are present. The model collection is appropriate for a 36 GB unified-memory workstation when model loading is serialized and context sizes are controlled.

The current research pass did not change or fully prove the effective service environment. The following remain verification items:

- Effective `OLLAMA_MODELS` storage path.
- Effective context length and parallel-request settings.
- Flash attention and KV-cache settings at service launch.
- Actual resident model and memory behavior from `ollama ps`.
- Cloud-disable policy for this private local installation.

#### Best-practice implementation

Ollama should remain outside Docker so it can use the host’s Apple Silicon acceleration. Model storage should remain on the external NVMe volume, with service-level environment configuration applied to the Homebrew LaunchAgent rather than only to an interactive shell.

Tuning should be evidence-led. Context length, keep-alive, queue size, parallelism, and the number of simultaneously loaded models should be selected against unified memory and the actual workload. Flash attention and a lower-memory KV-cache format may be retained if benchmark evidence confirms the expected benefit.

Official references: [Ollama API](https://docs.ollama.com/api/introduction), [Ollama macOS](https://docs.ollama.com/macos), and [Ollama FAQ and configuration](https://docs.ollama.com/faq).

### LM Studio

#### Current state

LM Studio is installed and its server is available on port `1234`. The server advertises a substantial local model catalog, including MLX models. The current UI showed a Gemma 4 MLX 4-bit model loaded with just-in-time model loading active.

The live inference result is not acceptable for readiness:

- A direct API request to the current model timed out.
- A Computer Use retry produced no usable model content.
- Historical conversation content showed an earlier successful response, but that does not validate the current state.

The server also appears to be listening on all interfaces. The local API works, but the advertised LAN address was not validated. LAN serving should therefore be treated as an exposure risk and disabled unless explicitly needed.

#### Best-practice implementation

LM Studio should remain a host-native alternative inference runtime using Apple Silicon and MLX. New health checks should use LM Studio’s documented v1 REST API and the `lms` command-line interface. OpenAI-compatible endpoints may remain for compatibility with clients that require them.

Recommended guardrails are:

- Bind locally by default.
- Require authentication if network serving is enabled.
- Retain just-in-time loading and automatic unloading.
- Keep only the last JIT model loaded when unified-memory pressure is material.
- Validate model loading, context fit, generation, and unload behavior with a bounded smoke test.

Official references: [LM Studio REST API](https://lmstudio.ai/docs/developer/rest), [REST quickstart](https://lmstudio.ai/docs/developer/rest/quickstart), [server settings](https://lmstudio.ai/docs/developer/core/server/settings), and [LM Studio CLI chat](https://www.lmstudio.ai/docs/cli/local-models/chat).

### Docker Desktop

#### Current state

Docker Desktop and its engine are running. Four containers are visible, and the primary services have basic local health evidence.

This is process-level evidence only. The Compose source, image tags or digests, volume mappings, restart policies, resource limits, and effective environment variables still need inspection.

#### Best-practice implementation

Docker should host auxiliary services and remain separate from Apple GPU inference. Before changes, the effective configuration should be rendered with `docker compose config`. Images should use intentional release tags or digests, persistent volumes should be explicit, and restart policies and health checks should be documented.

For this personal local stack, published ports should normally bind to `127.0.0.1`. Any LAN or remote access should be an explicit architecture decision with authentication and a secure access path.

Official references: [Docker Desktop for Mac](https://docs.docker.com/desktop/), [Docker Desktop resource settings](https://docs.docker.com/desktop/settings-and-maintenance/settings/), and [Compose trust model](https://docs.docker.com/compose/trust-model/).

### Open WebUI

Open WebUI is responding on port `3000` and its container reports healthy. The deployment pattern is supported by the project’s Docker guidance.

The remaining readiness checks are:

- Confirm persistent `/app/backend/data` storage.
- Confirm a persistent `WEBUI_SECRET_KEY`.
- Record the image tag and digest.
- Confirm restart policy and WebSocket behavior.
- Confirm the container’s configured Ollama base URL and actual model discovery.

Rolling tags such as `main` or `latest` should not be used when reproducibility is important. Official reference: [Open WebUI Docker quick start](https://docs.openwebui.com/getting-started/quick-start/).

### SearXNG

SearXNG is responding on port `8888`, and OpenClaw is configured to use a local SearXNG provider. The remaining proof is functional rather than process-level:

- Confirm JSON output is enabled.
- Run a local search API request.
- Verify OpenClaw can consume the response.
- Confirm the service remains loopback-only unless remote search is intentional.

Official references: [SearXNG Docker installation](https://docs.searxng.org/admin/installation-docker.html) and [SearXNG search API](https://docs.searxng.org/dev/search_api.html).

### Qdrant

Qdrant is running and its readiness endpoint reports that all shards are ready. This confirms service availability, not RAG functionality.

The current wildcard port publication is broader than necessary for local use. Qdrant’s self-hosted deployment is not secure by default, so the preferred local posture is loopback binding. If remote access is required, API keys, TLS, and a controlled network boundary are required.

Before describing Qdrant as part of a completed RAG system, verify persistent storage, backup behavior, collection creation, embedding dimensions, and a real client integration from Open WebUI or OpenClaw.

Official references: [Qdrant security](https://qdrant.tech/documentation/security/), [Qdrant quick start](https://qdrant.tech/documentation/quick-start/), and [secure self-hosted Qdrant](https://qdrant.tech/documentation/tutorials-operations/secure-qdrant/).

### Supporting services and integrations

Homebrew is the host service manager for Ollama and OpenClaw’s CLI/runtime environment. No OpenClaw nodes are paired. iMessage is present in configuration but disabled. These are not defects by themselves; they are scope decisions that must remain explicit.

The `zen_ellis` container is healthy but was not assigned a confirmed role during this pass. It must be identified from its Compose definition and mounted data before any changes are proposed.

## Recommended architecture

```text
Mac Studio Apple Silicon
  |
  +-- Host-native Ollama ------------ local model API :11434
  +-- Host-native LM Studio --------- local model API :1234
  +-- Host-native OpenClaw ----------- supervised gateway :18789
  |
  +-- Docker Desktop
       +-- Open WebUI ---------------- local chat front door :3000
       +-- SearXNG ------------------- private search :8888
       +-- Qdrant -------------------- vector service :6333/:6334
       +-- zen_ellis ----------------- identify before modifying
```

The default network posture should be local-only. The default memory posture should avoid simultaneous loading of large models. The default security posture should assume that web content is untrusted and that OpenClaw credentials and workspace data are sensitive.

## Delegatable execution tasks

The following tasks can be delegated after owner approval of execution. Mutating tasks should produce a proposed diff or dry-run result before applying changes.

### Systems inventory agent

- Capture versions, processes, LaunchAgents, listeners, containers, images, volumes, restart policies, and relevant paths.
- Record current configuration hashes or sanitized summaries.
- Produce a baseline artifact without secrets.

### OpenClaw security agent

- Re-run status, doctor, skills, and security audits.
- Produce a minimal hardening proposal for sandboxing, web/browser tools, Control UI authentication, and operator scope.
- Prepare a SecretRefs migration plan without exposing or copying secret values.
- Apply changes only after the owner confirms the security posture.

### Ollama runtime agent

- Verify service-level environment and model storage.
- Check model residency and memory behavior.
- Validate context, queue, parallelism, keep-alive, flash attention, and KV-cache settings against benchmarks.
- Produce a bounded model smoke-test report.

### LM Studio runtime agent

- Diagnose the current timeout and empty-response behavior.
- Test the v1 REST endpoint and `lms` CLI independently.
- Confirm model loading and context fit.
- Apply only the smallest configuration correction needed for reliable inference.

### Docker services agent

- Locate and render the effective Compose configuration.
- Identify the role of `zen_ellis`.
- Check image tags, digests, volumes, secrets, restart policies, health checks, and port bindings.
- Propose loopback binding and Qdrant security changes.

### Integration agent

- Validate Open WebUI to Ollama connectivity.
- Validate SearXNG JSON search through OpenClaw.
- Validate Qdrant persistence and client integration if RAG is in scope.
- Perform one end-to-end local workflow test.

### Documentation agent

- Update dated repository records only with confirmed current evidence.
- Preserve historical baseline records.
- Add the final acceptance result, known limitations, and recovery instructions.

## Acceptance criteria

The stack should not be marked optimized until all applicable criteria are met:

- OpenClaw security audit has no unresolved critical findings.
- OpenClaw credentials are no longer stored in plaintext configuration fields, or the exception is explicitly documented and accepted.
- The Control UI exposure and authentication posture are intentional.
- Ollama storage and service environment are verified.
- LM Studio passes a current generation smoke test through a supported API.
- Docker images, volumes, restart policies, and bindings are documented.
- Open WebUI has persistent data and a persistent secret key.
- SearXNG passes an actual JSON API query.
- Qdrant is loopback-bound or protected with deliberate authentication and TLS.
- No RAG, node, channel, or remote-access capability is claimed without an integration test.
- Repository documentation distinguishes confirmed live evidence from historical or planned material.

## Open owner decisions

1. Should the entire stack remain local-only, or is LAN access required for any service?
2. Should OpenClaw use sandboxing globally, or should web/browser tools be restricted by model and agent?
3. Should OpenClaw SecretRefs migration be performed during the first execution pass?
4. Are OpenClaw nodes, iMessage, or other channels in scope?
5. Is Qdrant part of the immediate deliverable, or should it remain a prepared but unintegrated future component?
6. What is the confirmed role of `zen_ellis`?

## Capture provenance

- Repository artifact: this file.
- Companion destination: the existing private Notion page titled “Mac Studio - Local AI Setup Journey,” updated with a dated readiness section.
- Host evidence date: 2026-08-02.
- Research basis: direct local checks, repository guidance, official OpenClaw, Ollama, LM Studio, Docker, Open WebUI, SearXNG, and Qdrant documentation.
- Privacy boundary: no credentials, tokens, private Notion identifiers, or private workspace links are stored in this public repository artifact.

## Current verdict

**NEEDS HARDENING AND VALIDATION**

The architecture is viable and the major components are installed. The next safe step is a read-only baseline capture followed by owner-approved hardening and integration tests. Historical completion claims should not be promoted to current readiness claims until those tests pass.
