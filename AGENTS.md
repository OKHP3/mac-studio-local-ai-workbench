# mac-studio-local-ai-workbench

## Project identity

- **Suite:** SHOAL / Workbench
- **Type:** Public documentation, configuration, manifests, benchmarks, and recovery scripts
- **Repository:** `https://github.com/OKHP3/mac-studio-local-ai-workbench`
- **Public project page:** `https://overkillhill.com/projects/mac-studio-local-ai-workbench/`
- **Related repositories:** `shoal-ai-server`, `infusing-a-soul`

This repository is the sanitized, durable artifact layer for a Mac Studio M4 Max local AI workbench. It records the operating model, storage layout, local runtimes, model inventories, benchmarks, architecture notes, agent documentation, and recovery procedures.

## Current understanding

### Confirmed

- The baseline build, storage normalization, initial benchmark, operational hardening, and local archive were completed in May 2026.
- OpenClaw, with the local agent named Larry, was documented as operational on 2026-05-28. Its documented primary model is `gemma3:27b` through Ollama.
- The strict six-model Ollama benchmark was completed on 2026-05-30. `gemma3:12b` and `gemma3:27b` scored 5/5 under the documented strict prompt set.
- The repository contains shell scripts intended for baseline verification and restore, plus manifests for Homebrew formulae, casks, and model inventories. The dated `mac-studio-setup/` copies pass shell syntax validation. The current root copies have CRLF line endings and fail `bash -n` in this checkout, so they need separate script maintenance before being relied on.
- The documented inference paths are Ollama, LM Studio, and direct `mlx-lm`. Open WebUI is the documented chat front door. OpenClaw and SearXNG form the documented autonomous agent and private search layer.
- RAG and vector storage are planned, not represented as a completed repository capability. The local web portal and HTTPS front door are also future architecture work.
- This is not a hosted service, enterprise platform, or production deployment. It is a personal infrastructure case study and reference build.

### Inferred

- The primary users are the repository owner and future maintainers who need a reproducible, recoverable local AI workstation.
- The central value is operational trust: documented paths, explicit model roles, repeatable checks, recovery assets, and reviewable public artifacts.

### Unknown or intentionally not asserted

- No repository evidence establishes a formal release process, CI pipeline, package publication flow, or supported cross-machine automation contract.
- The repository does not prove that every historical pending smoke test in `docs/06-definition-of-done.md` has since been completed. Treat dated status documents as records, not live telemetry.
- Version numbers and host paths in dated documents describe captured workstation state and may be stale. Verify the host before treating them as current.

## Scope and boundaries

Keep this repository focused on the public artifact layer:

- setup and architecture documentation
- model and Homebrew manifests
- benchmark prompts and results
- restore and non-destructive verification scripts
- templates and sanitized configuration examples
- agent and operational documentation

Do not commit:

- model binaries, caches, or large local runtime data
- tokens, credentials, private keys, raw connector configuration, or secret-bearing files
- private workspace links or employer-specific material
- generated runtime output, local logs, or machine backups
- changes to application code in related repositories

The root `AGENTS.md` is the canonical project guide. `CLAUDE.md` is intentionally a short pointer to this file. The `.agents/skills/` tree contains vendored agent skills and is not project application code. Do not modify it unless the task explicitly concerns those skills.

## Repository map

- `README.md`: public project summary, architecture, current verdict, and repository purpose.
- `docs/`: project overview, build journey, storage architecture, toolchain, model inventory, benchmarks, definition of done, RAG roadmap, methodology, agent documentation, and Mermaid diagrams.
- `benchmarks/`: benchmark prompts and dated comparison artifacts.
- `manifests/`: repository-level Homebrew and model inventory inputs used by the root scripts.
- `scripts/`: current repository-aware restore and verification scripts.
- `mac-studio-setup/`: dated baseline snapshot, machine-specific records, and historical setup copies of the scripts.
- `templates/`: reusable health-check, model-role, RAG, update-policy, research, and validation templates.
- `context/threads/`: public-safe, provenance-aware extracts of supplied AI threads; keep source URLs, private workspace details, and raw transcripts redacted.
- `config/env.example`: sanitized example environment variables. It contains paths and tuning values, never secrets.
- `docs/publication-boundary.md`: publication hygiene boundary for this repository.
- `reports/public-release-check-2026-05-13.md`: dated public-release scan and its limitations.
- `.agents/skills/`: checked-in agent skill assets seeded in June 2026.

## Technology and architecture

The repository itself has no application package, dependency manifest, build system, or test framework. It is primarily Markdown, shell, plain-text manifests, JSON templates, Mermaid, and YAML front matter.

The documented host architecture is:

```text
Mac Studio M4 Max
  -> external OKH-Local NVMe storage
  -> Ollama, LM Studio, or direct mlx-lm inference
  -> Open WebUI for interactive local chat
  -> OpenClaw / Larry for background agent work
  -> SearXNG for private web search
  -> future RAG and vector storage layer
```

The canonical example storage locations are under `/Volumes/OKH-Local/07_Local_LLMs/`. The repository may contain exact workstation paths in historical records, but new public documentation should use generalized paths such as `/Volumes/<external-ai-volume>/...` unless the exact path is necessary to explain a verified setup.

## Working conventions

- Preserve dated historical records. Correct a live guide when evidence shows it is stale, but do not rewrite history to make old snapshots look current.
- Keep documentation claims tied to a file, captured result, or executable check. Label conclusions as confirmed, inferred, or unknown when useful.
- Preserve standalone punchy lines and do not flatten them into paragraphs.
- Do not use em dashes in generated content.
- Use explicit dates for status claims and distinguish baseline completion from ongoing maintenance or planned work.
- Keep secrets out of examples. `config/env.example` is safe only when it remains sanitized.
- Respect the memory ceiling documented in the model and storage records. Do not recommend adding models without checking available unified memory, storage, quantization, and benchmark role.
- Use `scripts/` for current repository-aware validation and restore work. Treat `mac-studio-setup/` copies as dated baseline artifacts unless a task explicitly targets that snapshot.
- Do not assume local services are available from this repository checkout. Ollama, Docker, LM Studio, OpenClaw, SearXNG, Homebrew, and host paths belong to the Mac Studio environment.

## Verified and available operations

From the repository root:

```bash
# Syntax-check the dated baseline script copies without changing the host.
bash -n mac-studio-setup/restore_mac_studio_baseline.sh \
  mac-studio-setup/verify_mac_studio_baseline.sh

# Run the repository-aware, non-destructive host verification.
./scripts/verify_mac_studio_baseline.sh

# Restore Homebrew packages and start Ollama on the target Mac Studio.
# This changes host state and should follow a backup or checkpoint.
./scripts/restore_mac_studio_baseline.sh
```

The root verification and restore scripts are the intended repository-aware entry points, but their current CRLF line endings must be corrected before they can be relied on. The `mac-studio-setup/` copies use the dated baseline layout and do not perform the expanded storage and container checks. Both script families are host-dependent. The restore scripts run `brew update`, install curated manifest entries, and start Ollama. Do not run them automatically as part of documentation-only changes.

There is no repository-local application test suite. For documentation and script changes, use the narrowest practical checks:

1. Re-read every changed guidance or documentation file.
2. Run `bash -n` on changed shell scripts. Resolve the known CRLF issue in the root scripts before treating those checks as passing.
3. Verify referenced files and commands exist where practical.
4. Run `git diff --check`.
5. Run the host verification script only when the Mac Studio services and paths are intentionally in scope.

## Safe change procedure

1. Check `git status` and preserve existing user changes.
2. Read the relevant dated source records and `docs/publication-boundary.md` before changing a claim.
3. Make the smallest scoped documentation, manifest, or script change.
4. Do not alter application code, dependencies, CI behavior, secrets, or generated artifacts for a context-maintenance task.
5. Validate the changed files and report any host-dependent checks that could not run.
6. Update this guide only when repository structure, commands, boundaries, or durable project facts change.

## Known risks and open questions

- Several documents are dated snapshots and contain exact versions, host paths, and pending checklists. Their freshness is not guaranteed.
- `scripts/` and `mac-studio-setup/` contain parallel script copies with different input locations. Keep their scopes clear when editing.
- The repository has no CI or automated Markdown validation evident in the current tree.
- RAG, Qdrant, Caddy, the local portal, and broader network access remain documented plans or architecture notes. Do not describe them as deployed without new evidence.
- A formal branch strategy, release cadence, and owner-approved definition of current status are not established in repository evidence.

## Keeping this guide current

When the workbench changes, update the relevant source document first, then revise this guide if the change affects project identity, architecture, commands, boundaries, or validation. Prefer a dated evidence record for host state. Keep this file concise, factual, and useful to a new agent starting from the repository root.
