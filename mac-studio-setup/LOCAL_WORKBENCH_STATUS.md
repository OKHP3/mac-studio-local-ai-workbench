---
title: "Mac Studio Local Workbench Status"
artifact_type: "setup_status"
created_date: "2026-05-12"
machine: "OverKill-Hills-Mac-Studio"
volume: "/Volumes/OKH-Local"
status: "active_setup"
---

# Mac Studio Local Workbench Status

## Operating model

This Mac Studio is the local workbench for the OKHP3 tooling workflow.

Canonical roles:

- Notion = working canon and ideation consolidation surface
- GitHub = durable, versioned, machine-readable corpus
- Mac Studio = local processing, repo mirrors, local AI runtime, export cleanup, and future RAG lab
- Replit = constrained high-cost execution/build layer
- Claude and ChatGPT = senior reasoning and synthesis layer
- Perplexity and Copilot Researcher = research-intern artifact generators

## External workbench root

`/Volumes/OKH-Local`

## GitHub mirrors

Located at:

`/Volumes/OKH-Local/04_GitHub_Mirrors`

Currently cloned:

- OKHP3/OverKill-Hill
- OKHP3/first-diagram-is-a-liar
- OKHP3/mermaid-theme-builder
- OKHP3/mermaid-diagram-bpmn

## Active local AI storage

Normalized active runtime model folders:

- Ollama models: `/Volumes/OKH-Local/07_Local_LLMs/ollama/models`
- LM Studio models: `/Volumes/OKH-Local/07_Local_LLMs/lm-studio/models`

Compatibility symlinks are retained at:

- `/Volumes/OKH-Local/ollama -> /Volumes/OKH-Local/07_Local_LLMs/ollama`
- `/Volumes/OKH-Local/lm-studio -> /Volumes/OKH-Local/07_Local_LLMs/lm-studio`

## Local AI governance folders

Planned governance folders:

- `/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache`
- `/Volumes/OKH-Local/07_Local_LLMs/manifests`
- `/Volumes/OKH-Local/07_Local_LLMs/quarantine`
- `/Volumes/OKH-Local/07_Local_LLMs/mlx`

## Hugging Face cache settings

- `HF_HOME=/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache`
- `HUGGINGFACE_HUB_CACHE=/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache/hub`

## Architecture clarification

GitHub is the durable corpus. It is not automatically a vector database or graph database. RAG behavior requires a retrieval layer such as search, embeddings, connectors, or an index.


## Ollama normalization confirmed

- Date confirmed: 2026-05-12
- Service manager: Homebrew services
- Model path: `/Volumes/OKH-Local/07_Local_LLMs/ollama/models`
- Compatibility symlink: `/Volumes/OKH-Local/ollama -> /Volumes/OKH-Local/07_Local_LLMs/ollama`
- Validation: `ollama list` shows existing models after `brew services start ollama`
- Runtime smoke test: `llama3.1:8b` responded successfully from normalized storage

## Local AI storage verification

- Date verified: 2026-05-12
- `OLLAMA_MODELS=/Volumes/OKH-Local/07_Local_LLMs/ollama/models`
- `HF_HOME=/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache`
- `HUGGINGFACE_HUB_CACHE=/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache/hub`
- Ollama models visible after normalization:
  - llama3.1:8b
  - mistral-small3.1:24b
  - codestral:22b
  - gemma3:27b
  - gemma3:12b
  - phi4:14b
- Active storage:
  - Ollama models: 63G
  - LM Studio models: 27G
  - Hugging Face external cache: validated and migrated to 2.0G on external storage

## Hugging Face cache validation confirmed

- Date confirmed: 2026-05-12
- Authenticated user: `okhp3`
- Token profile: `OKH-Mac-Studio-ReadOnly`
- Token type: fine-grained read-only
- Cache path: `/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache`
- Test download: `bert-base-uncased` with `README.md` and `config.json`
- Validation result: download completed successfully; cache was later migrated and consolidated externally

## Hugging Face internal cache cleanup confirmed

- Date confirmed: 2026-05-12
- Internal cache removed: `~/.cache/huggingface`
- External cache retained: `/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache`
- External cache size after migration: 2.0G
- Marker file created: `~/.cache/HUGGINGFACE_CACHE_MOVED_TO_OKH_LOCAL.txt`

## LAN exposure fix confirmed (2026-09-12)

- Full scan and fix pass to make Mac Studio-hosted services reachable from the <HOME_SSID> LAN (for the Windows/Asus OpenClaw instance and the broader SHOAL local-AI-server goal). Full detail: [`docs/18-lan-exposure-fix-2026-09-12.md`](../docs/18-lan-exposure-fix-2026-09-12.md).
- Current LAN address: `<MAC_LAN_IP>` (Wi-Fi `<HOME_SSID>`).
- Fixed and verified reachable from off-host: LM Studio (1234), Open WebUI (3000), Qdrant (6333/6334 — also fixed a stale `DKH-Local` → `OKH-Local` bind-mount path), SearXNG (8888).
- Still loopback-only, needs Jamie with real terminal access: Ollama (11434) — `launchctl setenv OLLAMA_HOST "0.0.0.0"` + `brew services restart ollama`; OpenClaw Gateway (18789) — no GUI bind-address setting found, likely needs an `openclaw.json` / env-var edit and gateway restart.
- Follow-up: re-check restart policy (`restart: always`) on the three recreated Docker containers; Open WebUI may need a fresh login after container recreation.

## Ollama LAN exposure fixed by Jamie (2026-09-13)

- Ran `launchctl setenv OLLAMA_HOST "0.0.0.0"` + `brew services restart ollama` directly in Terminal. Confirmed via live curl: `http://<MAC_LAN_IP>:11434/api/tags` now returns HTTP 200 — reachable from off-host.
- Open item: that same response was `{"models":[]}` — empty, despite the models listed earlier in this file. Suspect `OLLAMA_MODELS` isn't visible to the `brew services` launchd daemon the way it is to a Terminal session. Needs `launchctl getenv OLLAMA_MODELS` / `ollama list` check and possibly `launchctl setenv OLLAMA_MODELS "/Volumes/OKH-Local/07_Local_LLMs/ollama/models"` + another restart. Not yet re-verified.
- OpenClaw Gateway (18789) remains the only unresolved item from the 2026-09-12 LAN exposure pass — still loopback-only, no GUI setting found.

## Ollama model visibility fixed (2026-09-13, same-day follow-up)

- Root cause confirmed: `launchctl getenv OLLAMA_MODELS` was empty after the LAN-exposure fix, so the `brew services` daemon fell back to Ollama's default (empty) model directory.
- Fix: `launchctl setenv OLLAMA_MODELS "/Volumes/OKH-Local/07_Local_LLMs/ollama/models"` + `brew services restart ollama`.
- `ollama list` now shows all 10 models: ministral-3:8b, command-r7b:latest, llama3.2:3b, nomic-embed-text:latest, llama3.1:8b, mistral-small3.1:24b, codestral:22b, gemma3:27b, gemma3:12b, phi4:14b.
- Confirmed visible over the LAN via live curl to `http://<MAC_LAN_IP>:11434/api/tags`, not just locally.
- Ollama LAN exposure is now fully resolved end to end. Only remaining open item from the 2026-09-12/13 passes is the OpenClaw Gateway (18789) bind address.
