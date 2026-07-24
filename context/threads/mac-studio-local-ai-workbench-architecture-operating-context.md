---
title: "Mac Studio Local AI Workbench Operating Context"
primary_topic: "Mac Studio Local AI Workbench Architecture and Operating Context"
source_platform: "Claude"
capture_mode: "export-excerpt"
completeness: "partial"
extraction_depth: "comprehensive"
requested_extraction_depth: "comprehensive"
source_title: "Mac Studio Local AI Workbench architecture and deployment thread"
source_date: "unknown"
source_time_context: "Readable records dated May 2026; pasted excerpt supplied 2026-07-24; original Claude turn times unknown"
source_locator: "Private Claude conversation and local attachment bundle supplied by user; private locators withheld"
retention_decision: "redacted"
source_independence: "blocked"
generated_at: "2026-07-24T19:59:00Z"
schema_version: "2.0"
artifact_type: thread-context-extract
---

# Mac Studio Local AI Workbench Operating Context

## Introduction

This extract consolidates the readable portion of a user-supplied Claude source bundle about the Mac Studio Local AI Workbench. The available material describes a public-safe, local-first workstation built around a Mac Studio M4 Max with external NVMe storage, Ollama, LM Studio, direct `mlx-lm`, Open WebUI, OpenClaw with the local agent Larry, SearXNG, and a tiered Council of AIs. It preserves the strict six-model benchmark, the build and recovery rationale, the three architecture views, the model-routing recommendations, the memory and storage constraints, the distinction between a documented baseline and future RAG work, and a pasted Claude excerpt explaining how Mermaid syntax was repaired and how follow-on GitHub, Notion, and Replit work was intended to proceed. The named bundle also referenced prompts, scripts, a workspace file, memory material, and Replit or workflow handoffs, but those 17 files were not available at the supplied local paths during this capture. Their absence is recorded as a source-completeness blocker. The extract therefore provides a durable project handoff from the six readable repository counterparts and the newly supplied pasted excerpt while avoiding invented content, private URLs, secrets, and claims that the inaccessible Claude conversation or missing files were inspected.

## Extraction profile

- **Requested depth:** Highly detailed and very detailed context synthesis.
- **Selected depth:** Comprehensive.
- **Selection basis:** The user explicitly requested a high quality and very detailed synthesis using every named file.
- **Profile changes:** None. The profile was not downgraded for the missing files; unavailable material is cataloged individually.
- **Focus areas:** Workbench purpose and current state, reproducible local stack, benchmark evidence, model roles, architecture, RAG boundary, workflow and publishing context, and safe next actions.
- **Must preserve:** The strict benchmark result, model routing, memory ceiling, external-storage design, local service roles, architecture diagrams, documented versus planned status, provenance limits, and every named missing sidecar.
- **Safe exclusions:** Private local attachment paths, the private Claude URL, account or workspace identifiers, raw memory content, secrets, and unverified claims from unavailable files.
- **Coverage rule:** Readable repository counterparts are retained or compressed by subject. Missing attachments remain individual `flag-missing` entries. Repeated diagram content is retained once in the value inventory and cross-referenced from the three diagram artifacts.
- **Not carried forward:** No raw Claude transcript was supplied. The inaccessible conversation, missing prompt/script/workspace files, private memory contents, and any hidden Project instructions or artifact versions are not reconstructed.
- **Source-independence test:** Blocked for the requested full-bundle migration because 17 named sidecars and the Claude conversation payload were unavailable. The narrower workbench architecture and benchmark handoff is usable without Claude access.

## Coverage accounting

| Material class | Assessed | Retained | Compressed | Omitted with reason | Missing or unavailable | Notes |
|---|---:|---:|---:|---:|---:|---|
| Named source files | 23 | 6 | 0 | 0 | 17 | Six readable files were found as repository counterparts. The other 17 supplied names were checked and not found at the supplied path or searched local roots. |
| Turns or turn groups | 6 | 3 | 1 | 0 | 2 | This is a file-bundle capture with one pasted Claude excerpt, not a structured Claude export. No unseen dialogue turns are inferred. |
| Rich elements | 15 | 5 | 2 | 0 | 8 | Mermaid diagrams and the pasted repair/deployment excerpt were text-extracted; eight additional artifact-panel items are metadata-only and unavailable. |
| Artifact-panel references | 8 | 0 | 0 | 0 | 8 | The excerpt names an image, DOCX/Markdown workflow artifacts, and a sysdiagnose archive, but does not supply their payloads. |
| Decisions and alternatives | 12 | 10 | 2 | 0 | 4 | Decisions are derived only from readable files and current repository evidence; prompt-specific decisions in missing files remain unknown. |
| Reusable assets | 9 | 5 | 1 | 0 | 7 | Benchmark routing, build guide, architecture, and memory rules are retained. Missing scripts and prompts are not synthesized. |

## Source synopsis

The supplied material represents a Claude conversation or project workflow that assembled public documentation for a personal Mac Studio local AI workbench. The durable objective is operational trust: keep model data off the internal system drive, document the local runtimes and service boundaries, measure model behavior under a repeatable prompt harness, route work to the least expensive capable model, and preserve enough setup and recovery information for a future maintainer to rebuild the workstation.

The readable build guide describes a Mac Studio M4 Max with 36 GB unified memory and 512 GB internal storage, paired with a 1 TB external NVMe in a USB4 enclosure. The external volume holds model weights, caches, future vector storage, research archives, and exports. The guide explains the Apple Silicon choice through unified memory and MLX acceleration, while its practical model policy limits active model weights to roughly 22 GB under normal application load. A smaller minimum viable configuration is also described: a Mac Mini M4 with 16 GB, external USB 3 storage, Ollama, Open WebUI, and smaller models.

The local inference layer has three paths. Ollama is the primary server on port 11434 and carries six documented models: `phi4:14b`, `gemma3:12b`, `gemma3:27b`, `codestral:22b`, `mistral-small3.1:24b`, and `llama3.1:8b`. LM Studio is the desktop model manager and local API on port 1234. Direct `mlx-lm` is the throughput path for compatible MLX models. Open WebUI is the browser chat front door on port 3000, running in Docker and connected to Ollama. OpenClaw is the autonomous background layer, with Larry as the local agent and `gemma3:27b` documented as its primary model. SearXNG is the private search layer on port 8888.

The strict benchmark dated 2026-05-30 is the strongest readable evidence. All six Ollama models were tested against five strict output tasks: exact instruction following, transcript cleanup, YAML, summary, and Mermaid. `gemma3:12b` and `gemma3:27b` achieved 5/5 and are recommended for governed artifact generation. `mistral-small3.1:24b` achieved 4/5. `phi4:14b`, `codestral:22b`, and `llama3.1:8b` were functional with formatting or structural defects. The benchmark's key prompt lesson is that four of six models still wrapped YAML in a code fence unless explicitly told to output raw YAML only. The readable artifacts therefore support role-based routing rather than a single-model default: use Gemma for governed documents, Codestral for code, Phi for speed, Llama for lightweight work, and direct MLX for maximum throughput.

The architecture artifacts present three views of the same system. The flowchart shows Jamie as orchestrator, cloud and free-tier AI services, the local agent and inference layers, a token-routing ladder from local zero-cost work to Replit as the expensive last resort, and a publishing path from GitHub to the public website. The mind map emphasizes the hardware, runtimes, 29-model inventory, local services, Council of AIs, token routing, and publishing surfaces. The architecture-beta diagram organizes the same concepts as bounded groups for Mac Studio, external storage, Docker, Ollama, MCP, and cloud tiers, with dependency lines among local services and selected cloud systems.

The newly supplied pasted excerpt adds the source conversation's immediate history. A Mermaid rendering error was repaired by changing architecture-beta group labels to square-bracket syntax rather than parentheses. The excerpt says the three diagrams then rendered correctly, and that the mind map initially needed special-character cleanup. It also records a correction to the Council of AIs model: Claude Pro is one paid frontier service among ChatGPT Plus, Perplexity Pro, Copilot Pro, GitHub Copilot, Notion Business, and Replit Core, with free access to Mistral, Gemini, Grok, and others. The intended token route is Larry, Notion AI, free tiers, Claude or ChatGPT base capacity, Perplexity or Copilot expiring capacity, and Replit last. These are source-stated workflow choices, not independently verified account or subscription facts.

The same excerpt records an intended multi-platform handoff: pass the diagrams to the GitHub artifact repository, update the Mac Studio journey in Notion, and prepare a consolidated Replit directive for the public project page. It says GitHub tools were unavailable in that Claude session, that a Notion architecture page was created, and that a Replit prompt covered eight website changes including a status board, May 27-30 timeline, completion callout, Meet Larry section, Mermaid diagrams with CDN initialization, a Build Your Own aside, a hero stat pill, and metadata/Open Graph updates. These are claims made by the pasted source. No GitHub, Notion, or Replit write was performed by this extraction, and the private workspace URLs are withheld.

The project guide in the target repository qualifies the diagrams. The baseline build, storage normalization, benchmark, operational hardening, and local archive were completed in May 2026. Larry was documented as operational on 2026-05-28, and the strict benchmark was completed on 2026-05-30. However, RAG and vector storage remain planned in the canonical guide and roadmap. The diagrams show Qdrant as an architectural component, but that does not establish that Qdrant is deployed on the host. The same caution applies to exact version numbers, ports, model counts, and historical workstation paths. They are captured records or architecture notes and require host verification before being treated as live telemetry.

The user also named a set of files intended to supply additional workflow context: GitHub update prompts, RAG flywheel and identity prompts, ingestion and status scripts, a VS Code workspace, a repository patch script, Replit build prompts and final notes, a thread reinjection file, and a tooling-workflow synthesis. Those files were not present at the supplied Downloads path or in the searched local workspace. Because they may contain operational instructions, code, private memory, or current decisions, their contents are not inferred from their filenames. The complete Claude conversation, Project instructions, hidden knowledge files, artifacts, citations, and branch history are likewise unavailable.

## Turn ledger

| Turn | Role | Role confidence | Boundary evidence | Content elements | Summary |
|---|---|---|---|---|---|
| T001 | user | high | Explicit current request names the Claude source, destination folder, skills, and 23 files | E001-E024 | Requested extraction and transformation into `context/threads/`, using all named material and the supplied Claude conversation locator. |
| T002 | unknown source-artifact batch | medium | Six named files are readable as repository counterparts, but no speaker labels or Claude export structure are present | E001-E006 | Supplies the benchmark, build guide, architecture collection, flowchart, mind map, and architecture-beta diagram. |
| T003 | unknown source-artifact batch | high for metadata, unavailable for content | Seventeen names were supplied, but no files exist at the referenced path or searched local roots | E007-E023 | References missing prompts, memory, scripts, workspace, Replit artifacts, and workflow synthesis. Their contents are not reconstructed. |
| T004 | repository context | high | Active repository `AGENTS.md`, `README.md`, current docs, and existing thread extract are available in the destination checkout | E025-E026 | Establishes the public boundary, current-state qualifications, and the RAG/Qdrant status conflict. This is target context, not a claim about the missing Claude transcript. |
| T005 | source locator | high | User supplied a private Claude conversation URL but no export payload | E024 | Establishes provenance only. The source account, thread, Project, hidden instructions, and branch history were not accessed. |
| T006 | unknown source excerpt | medium | Newly supplied `pasted-text.txt` contains a short narrative, Mermaid code, source-assistant responses, artifact titles, and a file inventory; speaker labels are not explicit | E027 | Supplies the Mermaid repair rule, expanded Council of AIs rationale, intended GitHub/Notion/Replit handoff, and the names of additional Claude artifacts. |

## Content element ledger

| Element | Turn | Type | Owner | Fidelity | Source locator | Destination reference | Catalog action |
|---|---|---|---|---|---|---|---|
| E001 | T002 | file | unknown | text-extracted | `docs/05-benchmark-results.md` repository counterpart | Source synopsis, decisions, and reusable assets | retain |
| E002 | T002 | file | unknown | text-extracted | `docs/11-build-your-own-local-ai.md` repository counterpart | Source synopsis, architecture, and handoff | retain |
| E003 | T002 | artifact | unknown | text-extracted | `docs/12-architecture-diagrams.md` repository counterpart | Architecture synthesis and rich-element accounting | compress |
| E004 | T002 | diagram | unknown | text-extracted | `docs/12-diagram-flowchart.md` repository counterpart | Architecture synthesis and reusable routing model | retain |
| E005 | T002 | diagram | unknown | text-extracted | `docs/13-diagram-mindmap.md` repository counterpart | Architecture synthesis and system inventory | retain |
| E006 | T002 | diagram | unknown | text-extracted | `docs/14-diagram-architecture.md` repository counterpart | Architecture synthesis and dependency model | retain |
| E007 | T003 | file | unknown | referenced-not-supplied | User-named `chatgpt-github-update-prompt.md` | Missing sidecars and open questions | flag-missing |
| E008 | T003 | file | unknown | referenced-not-supplied | User-named `MEMORY.md` | Privacy-sensitive missing material; no content retained | flag-missing |
| E009 | T003 | file | unknown | referenced-not-supplied | User-named `new-thread-rag-flywheel-seed-prompt.md` | RAG workflow gap | flag-missing |
| E010 | T003 | file | unknown | referenced-not-supplied | User-named `okh-identity-extraction-memory-prompt.md` | Identity and memory workflow gap | flag-missing |
| E011 | T003 | file | unknown | referenced-not-supplied | User-named `okh-rag-ingest.py` | RAG ingestion implementation gap | flag-missing |
| E012 | T003 | file | unknown | referenced-not-supplied | User-named `okh-status-check.sh` | Host status-check implementation gap | flag-missing |
| E013 | T003 | file | unknown | referenced-not-supplied | User-named `OverKill-Hill.code-workspace` | Workspace and path configuration gap | flag-missing |
| E014 | T003 | file | unknown | referenced-not-supplied | User-named `patch-mac-studio-repo.sh` | Repository patch workflow gap | flag-missing |
| E015 | T003 | file | unknown | referenced-not-supplied | User-named `replit-add-larry-prompt.md` | Replit and Larry integration gap | flag-missing |
| E016 | T003 | file | unknown | referenced-not-supplied | User-named `replit-final-build-complete.md` | Replit completion evidence gap | flag-missing |
| E017 | T003 | file | unknown | referenced-not-supplied | User-named `replit-final-complete-prompt.md` | Replit completion prompt gap | flag-missing |
| E018 | T003 | file | unknown | referenced-not-supplied | User-named `replit-larry-and-links-final.md` | Larry and public-links handoff gap | flag-missing |
| E019 | T003 | file | unknown | referenced-not-supplied | User-named `replit-links-aside-update.md` | Public UI links update gap | flag-missing |
| E020 | T003 | file | unknown | referenced-not-supplied | User-named `replit-page-update-prompt.md` | Public project-page update gap | flag-missing |
| E021 | T003 | file | unknown | referenced-not-supplied | User-named `replit-v06-final.md` | Replit versioned build record gap | flag-missing |
| E022 | T003 | file | unknown | referenced-not-supplied | User-named `thread-reinjection-mac-studio-build.md` | Cross-thread resume context gap | flag-missing |
| E023 | T003 | file | unknown | referenced-not-supplied | User-named `tooling-workflow-synthesis.md` | Cross-tool operating model gap | flag-missing |
| E024 | T005 | citation | user | metadata-only | Private Claude conversation locator supplied by the user; URL withheld from the public artifact | Provenance and open questions | flag-missing |
| E025 | T004 | file | repository | text-extracted | `AGENTS.md`, `README.md`, and current project docs | Boundary, evidence classification, and current-state caveats | retain |
| E026 | T004 | thread extract | repository | text-extracted | `context/threads/open-webui-docker-update-resilience.md` | Related operational context only; not treated as a Claude transcript | compress |
| E027 | T006 | file and transcript excerpt | user | text-extracted | Newly supplied `pasted-text.txt`; local attachment path withheld | Mermaid repair, Council of AIs correction, intended deployment handoff, and artifact inventory | retain |
| E028 | T006 | generated_file | unknown | referenced-not-supplied | Claude artifact panel: `ChatGPT Image May 1, 2026, 01_12_58 PM.png` | Image provenance and open questions | flag-missing |
| E029 | T006 | generated_file | unknown | referenced-not-supplied | Claude artifact panel: `ChatGPT-to-Copilot--Token-Aware-Multi-Tool-AI-Production-Workflow.docx` | Cross-tool workflow gap | flag-missing |
| E030 | T006 | generated_file | unknown | referenced-not-supplied | Claude artifact panel: `ChatGPT-to-M365--Token-Aware-M.docx` | Cross-tool workflow gap | flag-missing |
| E031 | T006 | generated_file | unknown | referenced-not-supplied | Claude artifact panel: `ChatGPT-to-Perplexity--Token-Aware-Multi-Tool-AI-Production-Workflow.md` | Cross-tool workflow gap | flag-missing |
| E032 | T006 | generated_file | unknown | referenced-not-supplied | Claude artifact panel: `Claude-to-Copilot--Token-Aware-Multi-Tool-AI-Production-Workflow.docx` | Cross-tool workflow gap | flag-missing |
| E033 | T006 | generated_file | unknown | referenced-not-supplied | Claude artifact panel: `Claude-to-M365--Token-Aware-Mu.docx` | Cross-tool workflow gap | flag-missing |
| E034 | T006 | generated_file | unknown | referenced-not-supplied | Claude artifact panel: `Claude-to-Perplexity--Token-Aware-Multi-Tool-AI-Production-Workflow.md` | Cross-tool workflow gap | flag-missing |
| E035 | T006 | generated_file | unknown | referenced-not-supplied | Claude artifact panel: `sysdiagnose_2026_05_07_08-49-46-0500_macOS_Mac_25E253_tar.gz` | Potentially sensitive machine diagnostic; do not retain without privacy review | flag-missing |

## Normalization exceptions

1. The source boundary is a user-supplied file manifest plus readable local files, not a structured Claude export. No assistant or human turns are reconstructed from the six documents.
2. The six readable files exist in the repository under `docs/`, while the user-referenced Downloads directory was absent. They are treated as corresponding repository counterparts, not as proof that the original attachment bytes were preserved.
3. Seventeen named files were not found. Their names establish that the source thread referenced them, but filenames do not establish their contents, safety, currentness, or intended authority.
4. The Claude URL is treated as a private locator only. No direct Claude account access, scraping, or source-thread replay was performed. Project instructions, knowledge files, artifacts, citations, hidden branches, and tool output remain unknown.
5. The combined architecture document repeats the individual flowchart, mind map, and architecture-beta artifacts. The combined collection is compressed after the individual diagram sources are retained.
6. The diagrams depict Qdrant, vector storage, and a larger local-service topology. The target repository's canonical guide and RAG roadmap state that RAG/vector storage are planned and Qdrant is not yet deployed. This is a material status conflict, not a formatting difference.
7. Historical documents assert versions, ports, model counts, and validation dates. They are retained as dated records. They are not treated as current host telemetry, and no host-dependent restore or verification script was run.
8. The source bundle includes a file named `MEMORY.md`, but it was unavailable and may contain private or identity-sensitive material. No memory content is inferred or copied.
9. The newly supplied excerpt contains source-assistant claims such as "Notion page created" and "all three updated" without connector payloads or write receipts. They are recorded as stated history, not verified current state.
10. The excerpt lists more Claude artifacts than the original local file manifest, including a pasted-text source, an image, several workflow documents, and cross-platform production-workflow documents. Only the pasted-text excerpt itself was supplied in this turn; the additional listed artifacts remain referenced-not-supplied.

## Value inventory

| Area | Extracted value | Claim class | Source support |
|---|---|---|---|
| Purpose | Build a reproducible, recoverable personal local AI workstation with documented operating choices, benchmarks, model roles, and future RAG readiness. | stated | E001-E006, E025 |
| Context and constraints | Mac Studio M4 Max, 36 GB unified memory, 512 GB internal SSD, 1 TB external NVMe, local-first inference, externalized model storage, and a practical model-weight ceiling near 22 GB. | stated | E002, E004-E006 |
| Inference architecture | Ollama on port 11434, LM Studio on port 1234, and direct `mlx-lm` form complementary inference paths. | stated | E002, E004-E006 |
| Interactive and autonomous layers | Open WebUI is the documented browser chat front door on port 3000. OpenClaw/Larry is the background agent layer, and SearXNG is the documented private search layer. | stated | E002, E004-E006, E025 |
| Benchmark evidence | Gemma 3 12B and 27B scored 5/5 under the strict six-model prompt set. The main formatting failure pattern was YAML code-fence insertion. | stated | E001 |
| Model routing | Use Gemma 3 12B or 27B for governed documents, Codestral for code, Phi 4 for speed, Llama 3.1 for lightweight work, and MLX direct inference for throughput. | proposal based on stated results | E001 |
| Architecture and cost routing | Route work from local zero-cost Larry through near-zero and free tiers, then paid frontier services, with Replit last after the specification is locked. | stated in diagrams; operating policy remains proposal | E004-E006 |
| Publication model | GitHub is the durable artifact repository and overkillhill.com is the public presentation surface, with Notion represented as working canon in the diagrams. | stated in diagrams; current ownership is not independently verified here | E004-E006 |
| Current-state boundary | Baseline, benchmark, and Larry documentation are complete records, while RAG/Qdrant, the local web portal, HTTPS front door, and broader network access remain planned or architectural. | stated | E025 |

## Decisions and rationale

### 1. Externalize model and cache storage

The build places Ollama models, LM Studio files, Hugging Face downloads, future Qdrant storage, research archives, and exports on the external OKH-Local volume. The rationale is to preserve internal SSD capacity and make the model layer replaceable. The guide states that lost model data can be re-pulled, so the external volume is important operational storage but not the only copy of the project knowledge.

Claim status: `stated` for the documented design, `proposal` for applying it to a future rebuild, and `unknown` for current host mount health.

### 2. Use multiple local inference paths by workload

Ollama is the general local server and Open WebUI backend. LM Studio provides a GUI and separate API port. Direct `mlx-lm` is reserved for compatible MLX models when throughput matters. This avoids treating a single runtime as universally optimal and reflects the measured 139 tok/s direct MLX result versus approximately 35 tok/s through Ollama for the compared Phi model.

Claim status: `stated` for the captured benchmark and documented runtime roles. Current comparative performance needs re-verification if versions, model formats, or host state change.

### 3. Route governed document work to Gemma 3

The strict benchmark makes `gemma3:12b` and `gemma3:27b` the only documented clean-sweep models. The practical prompt rule is to ask explicitly for raw YAML without a code fence. `gemma3:27b` is also the documented Larry/OpenClaw primary because the agent's workspace consumes a large context budget at session start.

Claim status: `stated` for benchmark scores and documented Larry role; `proposal` for future routing; `needs verification` before assuming the same scores on a changed host or newer model release.

### 4. Preserve a memory ceiling before adding models

The guide estimates a 22 GB safe practical ceiling for model weights after macOS, Docker, applications, and KV cache. Models under 10 GB are treated as always safe, models between 10 and 20 GB require awareness, and larger models should be loaded only after closing heavy applications. This is an operating constraint, not a performance guarantee.

Claim status: `stated` as a captured workstation policy. It must be rechecked against actual unified-memory pressure before adding or changing models.

### 5. Treat the Council of AIs as a routing system, not a single product

The diagrams place paid frontier services, execution tools, free access tiers, local Larry, Notion, GitHub, and Replit in a deliberate hierarchy. Local work is preferred when capable; higher-cost services are reserved for capabilities that local inference cannot provide. Replit is shown as the last resort and requires a locked specification first. This is a cost and governance model, not evidence of live account configuration or current subscription state.

Claim status: `stated` in the diagrams and build guide; `proposal` as a reusable operating policy.

### 6. Keep Qdrant and RAG in the planned boundary until host evidence exists

The diagrams include Qdrant and vector storage as part of the target architecture, while the repository guide and RAG roadmap state that they are not a completed capability. The safe decision is to preserve the architecture intent but not claim deployment. A future operator must verify the actual container, storage path, API, and Open WebUI knowledge-store wiring before updating current-state documentation.

Claim status: `stated` for both source positions, `unresolved` for the host's actual state, and `proposal` for the verification step.

## Actionable handoff

- **Current state:** The public repository documents a functional local AI workbench baseline, the May 2026 strict benchmark, the documented Larry/OpenClaw agent layer, the local inference paths, and a future RAG architecture. The six readable source files and the newly supplied Mermaid/deployment excerpt are represented in this extract. Seventeen named source files and the original Claude payload remain unavailable.
- **Resume point:** First restore or re-supply the missing 17 files, then reconcile their claims against `AGENTS.md`, the current README, the benchmark results, and the RAG roadmap before changing project documentation.
- **Required context:** Read the target repository guide, publication boundary, current README, benchmark results, model inventory, toolchain, definition of done, RAG roadmap, and existing related thread extract. Treat dated records as historical evidence and host-dependent commands as unrun unless explicitly verified.

| Action | Owner | Status | Dependencies | Evidence or acceptance condition |
|---|---|---|---|---|
| Re-supply or mount the 17 missing named files | user | blocked | Original attachment bundle or a new export | Every E007-E023 item is readable and assigned a disposition. |
| Obtain a human-supplied Claude export or turn-by-turn paste | user | blocked | Source account access and safe export selection | Source title, capture method, completeness, turns, and rich elements can be assessed without scraping. |
| Re-run the synthesis with the missing prompts, scripts, and workspace | agent | proposed | E007-E024 available | Workflow, RAG, Replit, and memory claims are reconciled without filename-based inference. |
| Verify current host state before promoting diagram claims | user or agent on the Mac Studio | proposed | Host access and explicit authorization | Qdrant, SearXNG, Open WebUI, Ollama, ports, model inventory, and storage paths are checked and dated. |
| Reconcile Qdrant architecture with the canonical RAG status | project owner | proposed | Host evidence and current roadmap decision | Documentation clearly marks deployed, planned, or intentionally removed components. |
| Review current model routing against available memory and versions | project owner | proposed | Current model inventory and host memory | Routing recommendations carry current evidence and do not exceed the documented memory ceiling. |
| Add the extract to any Notion destination | user | pending | Explicit page/database destination and connector access | Destination is resolved and schema-fetched before any write; no Notion write is authorized by this request. |

## Reusable methods and assets

### Benchmark-to-routing method

1. Use a fixed prompt suite with explicit pass, functional, and fail criteria.
2. Test every candidate model against the same tasks.
3. Record formatting defects separately from outright unusability.
4. Route governed artifacts to models that pass strict structured-output tests.
5. Add explicit negative instructions for recurring output errors, especially raw YAML without a code fence.
6. Re-run the suite after model, runtime, or prompt-harness changes.

### Local workbench build pattern

1. Externalize model and cache storage.
2. Install Ollama as the primary local server.
3. Add LM Studio for GUI management and a separate API port.
4. Use direct MLX inference when the model format and throughput target justify it.
5. Put Open WebUI in Docker as the interactive front door.
6. Add OpenClaw/Larry only after selecting a model with enough context for the loaded workspace.
7. Add SearXNG for private search where host evidence supports it.
8. Keep RAG and Qdrant as planned until deployment and wiring are verified.

### Architecture reading method

- Use the flowchart to understand work movement, token routing, and publication.
- Use the mind map to inventory components, model roles, services, and ecosystem relationships.
- Use the architecture-beta diagram to inspect bounded containers and dependency lines.
- Compare all three against the canonical project guide before treating a diagram node as current infrastructure.

### Mermaid architecture-beta repair rule

For Mermaid `architecture-beta`, use square-bracket group labels such as `group mac_studio["Mac Studio"]` and do not use parentheses for those labels. Treat rendered validation as evidence that the syntax was accepted by the selected renderer, not as proof that the architecture claims are current. If a mind map render fails because of special characters, simplify the labels only as needed and preserve the meaning in the source documentation.

### Cross-platform handoff pattern

The source excerpt proposes a three-surface sequence: commit or manually upload the public Markdown diagrams to GitHub, document the architecture in the intended Notion working-canon page, and pass a consolidated Replit directive to update the public project page. The handoff should list exact files, page sections, Mermaid initialization requirements, acceptance checks, and any tool limitations. In this extraction, it remains a reusable proposal because no destination was authorized for writes and no external write was attempted.

### Reusable safety rules

- Do not infer a service deployment from a diagram.
- Do not treat an assistant assertion or copied citation as independently verified fact.
- Do not run restore, update, or host-dependent scripts as part of documentation-only extraction.
- Do not copy private memory, account details, secrets, or private workspace links into the public repository.
- Do not add models without checking unified memory, storage, quantization, and benchmark role.
- Preserve dated status documents as history; correct live guides only when newer evidence supports the change.

### Missing reusable assets

The named `okh-rag-ingest.py`, `okh-status-check.sh`, `patch-mac-studio-repo.sh`, workspace file, RAG seed prompt, identity-memory prompt, GitHub update prompt, Replit prompts and final notes, thread reinjection file, and tooling synthesis could materially extend this section. Their absence is a documented gap, not permission to recreate them from filenames.

## Open questions and limits

- Is the complete Claude source available as a safe export or turn-by-turn paste? Unknown. The current URL is provenance only.
- Were the six readable repository files exact attachment copies, or only matching files already present in the repository? Unknown.
- What content and instructions were in `MEMORY.md`? Unknown and potentially private; no content was inferred.
- What behavior and safeguards do `okh-rag-ingest.py` and `okh-status-check.sh` implement? Unknown. Do not run or recreate them without the files.
- What paths, tasks, and extensions are encoded in `OverKill-Hill.code-workspace`? Unknown.
- What changes were intended by `patch-mac-studio-repo.sh`? Unknown. Do not execute it from its filename alone.
- What RAG flywheel, identity extraction, or thread reinjection workflow was intended? Unknown until the named prompts are available.
- What did the Replit final-build and page-update artifacts establish about Larry, public links, version 0.6, and the website? Unknown until those artifacts are available.
- Is Qdrant deployed and healthy on the target Mac Studio? The repository evidence says it is planned, while the diagrams show it architecturally. Host status is unresolved.
- Are the exact versions and model counts in the diagrams still current? Unknown. They are dated records and need verification.
- Does the current root script CRLF issue affect any missing or referenced workflow scripts? The repository guide says the root copies need maintenance. Missing sidecar scripts were not inspected.
- Is there an authorized Notion destination for this extract? Not supplied. The Notion router is therefore report-only and no page, database, or data-source write was attempted.
- Did the source session actually complete the GitHub, Notion, and Replit writes it described? Unknown. The pasted excerpt reports outcomes, but it provides no durable commit, page-fetch, or deployment verification evidence.
- What were the exact eight Replit changes and their final implementation state? The excerpt names them at a high level, but the consolidated Replit prompt artifact was not supplied.
- Which extra files listed in the pasted Claude artifact panel were part of the original source? The panel shows names for an image, DOCX workflow artifacts, and additional Markdown artifacts, but their contents are unavailable.

## Rehydration test

| Test | Result | Evidence or gap |
|---|---|---|
| A reader can explain the objective without the source platform | pass | Introduction, source synopsis, value inventory, and E001-E006 provide the workbench purpose and architecture. |
| Decisions and consequential rationale are recoverable | pass | Benchmark routing, external storage, memory ceiling, runtime separation, and RAG boundary are recorded. |
| Current state and next action are unambiguous | pass | Current repository state is separated from diagram intent; first action is to restore the missing source bundle and reconcile it. |
| Retained assets are available or missing assets are explicitly cataloged | pass | Six readable documents and the pasted excerpt are retained. Seventeen missing files and the extra artifact-panel references are explicitly cataloged. |
| No source account, thread, project, canvas, or connector is a runtime dependency | pass | The narrower workbench handoff can be understood without Claude or Notion access. |
| The requested full source bundle was completely assessed | blocked | Seventeen named files and the Claude conversation payload were unavailable, so full-bundle completeness cannot be claimed. |

- **Overall source-independence result:** Blocked for the requested full-bundle migration; pass for the narrower readable workbench handoff.
- **Blocked capability:** A future reader cannot recover the missing RAG, identity, status-check, repository-patch, workspace, Replit, thread-reinjection, tooling-synthesis, or memory-specific decisions from this artifact because their source files were not supplied.

## Provenance and retention

- **Capture boundary:** User-supplied names for 23 local files, six readable repository counterparts, a private Claude conversation locator, the target repository's active project guide and current documentation, and one existing related thread extract. The Claude conversation payload and 17 named sidecars were not captured.
- **Completeness:** Partial. The six readable repository counterparts were assessed; the named bundle and original Claude source are incomplete.
- **Source time context:** The readable documents carry dated records from May 2026. The newly supplied pasted excerpt refers to diagram and deployment work after those records, but its original turn times are unknown. The current capture date is 2026-07-24. The original Claude conversation date, Project state, and attachment timestamps are unknown.
- **Retention decision:** Redacted.
- **Source caveats:** This is a reviewed semantic extract, not a lossless transcript or a full attachment archive. Private local paths, private Claude URL details, memory content, secrets, and account or workspace identifiers are not retained. Historical versions and architecture nodes are labeled as records or proposals until host evidence confirms them.
