# OpenClaw and Related Local Runtime Readiness Audit

Date: 2026-08-02

Repository: mac-studio-local-ai-workbench

Scope: Current Mac Studio host state reviewed against the durable project records.

Evidence boundary: This report records observations made during the current thread. Dated repository and Notion records remain historical records unless explicitly confirmed by a current host check.

## Executive summary

The Mac Studio local AI workbench is substantially operational, but it is not yet in a clean fully-ready or fully-optimized state.

OpenClaw is installed, running, reachable on loopback, and configured around the local Ollama model gemma3:27b. Its gateway health is good and the LaunchAgent is active. The main readiness blockers are security hardening and operational completeness: plaintext secret-bearing configuration remains, insecure Control UI authentication is enabled, sandboxing is effectively off, the default small model can reach web and browser tools, operator-level authorization was not fully verified, and no messaging channel or paired node is configured.

Docker is healthy enough for the currently running local services. Open WebUI and the supporting SearXNG and Qdrant containers respond locally, and Open WebUI and the named helper container report healthy status. This proves service availability, not complete end-to-end integration with OpenClaw or a working RAG workflow.

LM Studio is installed and its local server is listening on port 1234. Its model catalog is visible through the local OpenAI-compatible endpoint, and the current Gemma 4 model is loaded in the desktop application. However, a direct chat-completion request timed out and the LAN-advertised address did not respond during the check. LM Studio should therefore be classified as partially ready, with inference reliability and network reachability still unresolved.

The repository is a documentation and configuration artifact layer, not a runtime test suite. This report is a new current-state record. It does not rewrite the older May 2026 installation records or claim that planned RAG, HTTPS, portal, or cross-machine deployment work is complete.

## Readiness at a glance

| Area | Current result | Confidence | Main qualification |
| --- | --- | --- | --- |
| OpenClaw installation | Ready | High | Current binary and gateway were directly checked |
| OpenClaw gateway service | Ready on loopback | High | LaunchAgent is loaded and local health is good |
| OpenClaw security posture | Needs hardening | High | Critical audit finding and multiple warnings remain |
| OpenClaw skills | Ready for eligible set | High | 28 eligible, 0 missing requirements |
| OpenClaw channels | Not configured | High | No channels and no paired nodes |
| Ollama | Ready locally | High | Local API returned the current model inventory |
| Docker engine | Ready | High | Client and server both report 29.6.2 |
| Docker services | Locally available | High | Open WebUI, SearXNG, and Qdrant responded |
| Qdrant/RAG integration | Unverified | High | Container presence does not prove application integration |
| LM Studio server | Partially ready | Medium | Listener and model catalog work; completion request timed out |
| LM Studio LAN endpoint | Unverified | Medium | Advertised 10.10.1.201 address timed out |
| End-to-end agent workflow | Not yet proven | High | No fresh authoritative multi-step workflow evidence |

## Evidence sources and method

The assessment combined:

- direct host checks of OpenClaw, its gateway, LaunchAgent, skills, plugins, configuration summary, doctor output, and security audit;
- direct local HTTP checks for Ollama, LM Studio, Open WebUI, SearXNG, and Qdrant;
- Docker engine, container, and health-state checks;
- inspection of the repository current guidance and dated OpenClaw records;
- a read-only OpenClaw Control UI self-audit attempt, treated as non-authoritative where it conflicted with direct host evidence;
- review of the existing Notion Mac Studio setup page and its relevant child pages.

Secrets and tokens were omitted from this report. Private Notion URLs and page identifiers are intentionally not stored in this public repository.

## OpenClaw current state

### Confirmed operational facts

- The installed executable is /opt/homebrew/bin/openclaw.
- The current installed version is OpenClaw 2026.7.1-2, build 0790d9f.
- The host is macOS 26.6 on arm64.
- The gateway is configured for loopback on 127.0.0.1:18789.
- The OpenClaw LaunchAgent is installed and loaded from ~/Library/LaunchAgents/ai.openclaw.gateway.plist.
- The gateway process is managed as a persistent user service with run-at-load and keep-alive behavior.
- The gateway health endpoint was reachable in the authoritative host check, with a healthy event loop and low observed latency.
- The default model is ollama/gemma3:27b.
- Memory is enabled through the memory-core plugin.
- The SearXNG web-search provider is enabled at http://127.0.0.1:8888.
- Web fetch is enabled.
- The iMessage channel is explicitly disabled.
- There are no configured channels and no paired or connected nodes.

### Skills and plugins

The skills check reported:

- 54 total skills discovered;
- 28 eligible and visible to the model;
- 27 available as commands;
- 26 disabled;
- 0 blocked by an allowlist;
- 0 missing requirements.

The plugin inventory reported 53 of 68 plugins enabled. Relevant enabled components include Ollama, LM Studio, memory-core, SearXNG, browser control, Canvas, and Notion. The iMessage plugin is present, but the iMessage channel itself is disabled.

This is a healthy capability inventory for a local assistant, but it is not evidence that each enabled plugin has been exercised end to end.

## OpenClaw security and optimization findings

The current configuration is usable, but several settings should be treated as hardening work before the system is considered optimized.

### Critical finding: small model with broad tools and no effective sandbox

The deep security audit identified ollama/gemma3:27b as a small model under the audit threshold. It is the default model, sandboxing is effectively off, and web search, web fetch, and browser tools are available.

This combination increases the impact of prompt injection, mistaken tool use, and untrusted web content. The audit recommendation is to either:

1. enable sandbox mode all for the default agent and verify the resulting behavior;
2. remove web and browser capabilities from the small-model agent; or
3. create a more restrictive dedicated agent for web research and keep the general local agent on a constrained tool profile.

The best practical optimization is a layered design: keep the local assistant useful, but put browser and web access behind a sandboxed or separately scoped agent. Do not treat model size alone as a security boundary.

### Plaintext secret-bearing configuration

The deep doctor lint reported that the OpenClaw configuration contains plaintext secret-bearing fields at:

- gateway.auth.token
- models.providers.ollama.apiKey

The values were not copied into this report. The recommended next action is to migrate these fields to supported SecretRefs and confirm the result with the OpenClaw secrets audit. A successful configuration migration should be followed by a gateway restart and a fresh health and security check.

### Insecure Control UI authentication

The safe configuration summary showed gateway.controlUi.allowInsecureAuth: true. A dry-run change to set this value to false succeeded, but no configuration mutation was made during this audit.

This should be changed, then the Control UI should be tested again using the secure authentication path. Since the gateway is loopback-only, this is still a local risk rather than an internet exposure, but the setting weakens the intended security posture and is explicitly flagged by the audit.

### Operator scope

The gateway status showed a connected local runtime, but the deep security audit also reported a missing operator.read scope during probing. This is not evidence that the gateway is unhealthy. It means that clean operator-level authorization was not fully demonstrated by the current command path and should be resolved or explicitly documented.

### Other warnings

- Reverse-proxy headers are not trusted. This is appropriate while the gateway remains loopback-only. Revisit it only if a deliberately configured local or remote proxy is introduced.
- Elevated tools are enabled. Their scope and use should be reviewed after sandboxing and authentication are hardened.
- Internal hooks, including session memory and command logging, are enabled. Their data handling and retention should be periodically reviewed.

## Ollama readiness

The local Ollama API responded successfully and returned this current inventory:

- nomic-embed-text:latest
- llama3.1:8b
- mistral-small3.1:24b
- codestral:22b
- gemma3:27b
- gemma3:12b
- phi4:14b

This confirms that Ollama is a live local inference provider and that both the documented default model and the embedding model are present. It does not by itself confirm current throughput, model quality, memory pressure, or OpenClaw completion behavior under load.

The repository older benchmark and installation records remain useful historical evidence. They should not be treated as a fresh benchmark for the August 2026 host state.

## Docker and supporting services

The Docker client and server both reported version 29.6.2.

The following containers were running:

- open-webui, up for approximately two days and reporting healthy;
- qdrant, up for approximately two days;
- searxng, up for approximately two days;
- zen_ellis, up for approximately two days and reporting healthy.

Local endpoint checks returned:

- Open WebUI: HTTP 200 at http://127.0.0.1:3000/;
- SearXNG: HTTP 200 at http://127.0.0.1:8888/;
- Qdrant: all shards are ready at http://127.0.0.1:6333/readyz.

The result is local services available. It is not yet the whole local AI stack integrated. In particular, there is no current evidence in this audit that:

- OpenClaw is using Qdrant;
- Open WebUI is configured to use Qdrant for the intended corpus;
- a document can be ingested, retrieved, and cited through the intended RAG path;
- the zen_ellis service is part of the active OpenClaw workflow.

Those should be validated with a small, disposable end-to-end retrieval test before the repository describes RAG as operational.

## LM Studio readiness

LM Studio desktop was available, and its local server reported support for OpenAI-compatible endpoints on port 1234. The local listener was confirmed by the host check, and the local model catalog endpoint returned 26 models, including:

- google/gemma-4-26b-a4b-qat;
- google/gemma-4-12b;
- google/gemma-3-12b;
- google/gemma-3-27b;
- openai/gpt-oss-20b;
- text-embedding-nomic-embed-text-v1.5.

The desktop UI showed the Gemma 4 26B A4B QAT model loaded with MLX 4-bit quantization and a reported size of approximately 15.64 GB.

Two important limitations remain:

- the advertised address 10.10.1.201:1234 timed out during the direct check;
- a direct local chat-completions request to localhost:1234 timed out after 30 seconds without output.

The desktop UI also returned a blank-content response to a simple exact-output test. That result is not sufficient to conclude that the model is broken, because the UI and server may have been loading or switching models, but it does mean that LM Studio has not yet passed a repeatable inference smoke test.

Recommended LM Studio next step:

1. keep the server bound to localhost while diagnosing;
2. select one small known-good model;
3. wait for model loading to complete;
4. run a short deterministic completion request with a generous first-load timeout;
5. repeat the request to measure warm latency;
6. only then test the LAN address or expose the service to other local components.

## Repository and documentation state

The repository remains a public-safe documentation, configuration, manifest, benchmark, and recovery artifact layer. It does not contain an application dependency manifest or a repository-local runtime test suite.

The existing OpenClaw documentation records the May 2026 baseline, including OpenClaw 2026.5.26, Larry, the local model path, SearXNG, and the earlier skills inventory. Those records are preserved as historical snapshots. This report provides the current August 2026 host evidence without rewriting those dated records.

The repository existing guidance correctly distinguishes planned RAG, Qdrant, HTTPS, and portal work from completed capability. The live presence of Qdrant now warrants a new integration check, but it does not justify changing the architecture status to RAG complete yet.

## Delegatable completion tasks

### Security hardening

- Migrate OpenClaw gateway and Ollama credentials from plaintext configuration to SecretRefs. Completion evidence: secrets audit passes or reports only explicitly accepted exceptions; no secret values appear in logs or repository files.
- Disable insecure Control UI authentication. Completion evidence: configuration readback shows false and the authenticated Control UI remains usable.
- Enable sandbox mode for the agent that can access web, browser, or other external tools. Completion evidence: configuration readback, a successful constrained tool test, and a fresh deep security audit with the critical finding resolved.
- Review elevated tool permissions and separate general local assistance from web research if needed. Completion evidence: documented agent/tool matrix and a smoke test for each retained capability.
- Resolve or document the missing operator.read scope. Completion evidence: gateway status and deep audit both show the intended operator authorization state.

### Runtime verification

- Run an OpenClaw fresh-session smoke test using the current default Ollama model. Completion evidence: exact prompt, timestamp, response, latency, and session identifier recorded without exposing secrets.
- Run a warm and cold Ollama model check for the primary and backup models. Completion evidence: repeatable latency and memory observations.
- Run an LM Studio deterministic completion smoke test. Completion evidence: successful local API response, warm and cold timings, selected model, and endpoint.
- Resolve LM Studio LAN reachability only if another local component requires it. Completion evidence: justified bind address, firewall review, and successful client test.

### Integration verification

- Prove the intended OpenClaw to SearXNG search path. Completion evidence: one controlled search request and a captured result path.
- Prove Qdrant ingestion and retrieval through the intended client. Completion evidence: disposable test document, indexed point or collection, successful retrieval, and cleanup record.
- Prove Open WebUI RAG behavior if Open WebUI is part of the target architecture. Completion evidence: uploaded test document, retrieved passage, and citation or source display.
- Determine whether zen_ellis is in scope. Completion evidence: service purpose, owner, dependency relationship, and decision to retain, reconfigure, or leave outside the workbench contract.

### Documentation maintenance

- Add a dated current-state pointer to the older OpenClaw installation record without rewriting its historical claims.
- Record accepted security exceptions and the intended operating boundary.
- Refresh the definition-of-done checklist using current evidence.

## Recommended order of operations

1. Capture a configuration backup and confirm recovery paths.
2. Migrate secrets and disable insecure Control UI authentication.
3. Apply sandboxing or tool separation for web-capable agents.
4. Re-run gateway status, skills check, doctor lint, and deep security audit.
5. Run fresh OpenClaw and Ollama smoke tests.
6. Diagnose LM Studio with a deterministic local completion test.
7. Validate SearXNG and Qdrant integrations separately.
8. Refresh the dated documentation and definition-of-done records.

## Final assessment

The workbench has a strong local foundation. OpenClaw, Ollama, Docker, Open WebUI, SearXNG, and Qdrant are present in a usable local arrangement, and the host is capable of supporting the documented operating model.

The system should currently be described as:

**Operational baseline with security hardening and integration verification still required.**

It should not yet be described as a fully optimized, end-to-end autonomous or RAG-enabled deployment. The remaining work is bounded and delegatable, and the most important next step is to close the OpenClaw security findings before expanding external-tool or network-facing behavior.
