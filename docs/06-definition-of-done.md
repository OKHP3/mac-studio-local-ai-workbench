---
title: "Definition of Done"
artifact_type: "punch_list"
created_date: "2026-05-13"
updated_date: "2026-05-28"
project: "Mac Studio Local AI Workbench"
status: "in-progress"
---

# Definition of Done

This document defines what "done for now" means for the Mac Studio Local AI Workbench baseline phase, and what ongoing maintenance looks like after that.

---

## Category 1 — Blocking items

Must be resolved before the project can be called complete.

| Item | Status |
|---|---|
| Verify Ollama plist path post-normalization | ✅ Done 2026-05-13 |
| Update Open WebUI to v0.9.5 | ✅ Done 2026-05-13, container recreated |
| Resolve Edge PWA localhost auth | ✅ Done 2026-05-13 |
| Backup baseline archive offsite (OneDrive) | ✅ Done 2026-05-18 |
| ASUS VSCode extension cleanup | ⬜ Pending |
| BFS VSCode extension cleanup | ⬜ Pending |

---

## Category 2 — Smoke tests

Acceptance criteria. Nothing is "done" until each of these is confirmed end-to-end.

| Test | Confirmation | Status |
|---|---|---|
| Ollama — all 6 models respond | `ollama run modelname "Reply with: working."` on each | ⬜ Pending |
| Continue.dev autocomplete fires | Open Python file in VSCode, start typing a function | ⬜ Pending |
| Open WebUI loads and switches models | Load local Open WebUI, switch between 3 models | ✅ Done 2026-05-13 |
| LM Studio API responds | Local model list endpoint returns models | ⬜ Pending |
| mlx-lm generates at 139 tok/s | Confirmed 2026-05-11 | ✅ Done 2026-05-11 |
| Notion MCP responds | Ask Claude to find a known page | ⬜ Pending |
| GitHub MCP responds | Ask Claude to list OKHP3 repos | ⬜ Pending |
| PageSpace MCP responds | Ask Claude to list PageSpace drives | ⬜ Pending |
| OneDrive sync confirmed | Edit file on Mac, confirm on ASUS within 60 seconds | ⬜ Pending |
| Git SSH pull on settled repo | Pull after OneDrive sync settles | ⬜ Pending |
| OpenClaw agent responds | `openclaw chat` — agent introduces itself as Larry | ✅ Done 2026-05-28 |
| SearXNG returns results | `curl http://localhost:8888/search?q=test&format=json` | ✅ Done 2026-05-28 |

---

## Category 3 — Quality bar

Required before publishing as a completed project.

| Item | Status |
|---|---|
| Strict prompt benchmark — all 6 Ollama models, same 5 tests | ⬜ Pending |
| Architecture diagram showing full stack | ⬜ Pending |
| `.zprofile` full audit — confirm all env vars correct and no duplicates | ⬜ Pending |
| Startup sequence documented — what runs automatically vs manual | ⬜ Pending |
| Token expiration calendar | ⬜ Pending |
| Time Machine setup for internal SSD | ⬜ Pending |

---

## Category 4 — Maintenance cadence

| Frequency | Task |
|---|---|
| Weekly | Update Homebrew metadata and review available upgrades |
| Monthly | Refresh local models intentionally, one at a time |
| Monthly | Update Open WebUI: `docker pull ghcr.io/open-webui/open-webui:main` then recreate container |
| Monthly | Check LM Studio for app updates |
| Monthly | Export Notion workspace to `/Volumes/OKH-Local/03_Notion_Exports/` for RAG corpus |
| Monthly | Re-ingest Notion export into OKH Personal Corpus (once RAG deployed) |
| Quarterly | Audit OKH-Local disk: `du -sh /Volumes/OKH-Local/07_Local_LLMs/*/` |
| Quarterly | Review model roster — remove unused, evaluate new releases |
| Quarterly | Review OpenClaw skill roster — install new eligible skills |
| Annually | Rotate access tokens before expiry (GitHub PAT due ~May 2027) |
| On new model releases | Evaluate lab/source, memory fit, and benchmark before adding to rotation |

---

## Category 5 — Growth items, post-done

Not required for this phase but the natural next chapter.

| Item | Value | Priority | Status |
|---|---|---|---|
| Pull `nomic-embed-text` embedding model | Foundation for all RAG | High | ⬜ Pending |
| Deploy Qdrant vector database | Persistent vector store on OKH-Local | High | ⬜ Pending |
| Configure Open WebUI with embeddings and vector store | Enables document-aware chat | High | ⬜ Pending |
| Export Notion workspace and ingest as corpus | Makes local models aware of actual content | High | ⬜ Pending |
| SearXNG engine quality tuning | Better search results from Larry | Medium | ⬜ Pending |
| OpenClaw iMessage channel | Larry accessible via iMessage — requires imsg binary build | Medium | ⬜ Pending |
| Strict prompt template library | Fixes benchmark failures, makes models more capable | Medium | ⬜ Pending |
| Fine-tuning experiment with MLX-LM LoRA | Adapt model style after corpus stabilizes | Low | ⬜ Pending |

---

## Completion sequence

In order:

1. ~~Backup archive offsite~~ ✅ Done 2026-05-18
2. Run all Category 2 smoke tests
3. Clean ASUS and BFS VSCode extensions
4. Audit `.zprofile`
5. Set up Time Machine
6. Run strict prompt benchmark on all 6 models
7. Build architecture diagram
8. Declare baseline complete
