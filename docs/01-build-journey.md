---
title: "Build Journey Summary"
artifact_type: "build_log"
created_date: "2026-05-13"
project: "Mac Studio Local AI Workbench"
status: "public-candidate"
---

# Build Journey Summary

## Phase 1 — Direction and operating model

The workbench began as a local AI exploration effort, then matured into a governed infrastructure build. The key strategic decision was to treat the Mac Studio as a durable local AI node rather than another unmanaged tool installation.

## Phase 2 — External volume taxonomy

A dedicated external NVMe volume became the operating substrate for local AI artifacts, model storage, research exports, GitHub mirrors, RAG experiments, and cold archives.

Important folder classes include:

- GitHub mirrors
- research vault
- RAG experiments
- local LLM storage
- cold archive
- temporary scratch space

Representative path pattern:

```text
/Volumes/<external-ai-volume>/04_GitHub_Mirrors
/Volumes/<external-ai-volume>/05_Research_Vault
/Volumes/<external-ai-volume>/06_RAG_Experiments
/Volumes/<external-ai-volume>/07_Local_LLMs
```

## Phase 3 — Storage normalization

Ollama, LM Studio, and Hugging Face cache locations were normalized under the local LLM storage area on the external workbench volume.

The major correction was eliminating accidental fragmentation between root-level runtime folders and canonical storage folders.

## Phase 4 — Verification and closure

A known-good baseline was documented, scripts were created, a verification report was captured, and a compressed closure archive was created locally.

The closure archive is intentionally not committed to this repository.

## Phase 5 — Benchmarking

Two Ollama models were smoke-tested:

- `llama3.1:8b`
- `phi4:14b`

The tests showed that both models are useful, but neither is governance-grade for strict structured artifact generation under loose prompting.

## Phase 6 — Next phase

The next phase is operational hardening:

- off-volume backup
- Open WebUI state capture
- expanded smoke tests
- strict prompt benchmarks
- local RAG/vector database smoke test
- public project page refinement

## Publication note

This build journey is a sanitized public summary. Raw transcripts, private workspace links, local-only logs, and credential-bearing configuration are intentionally excluded.
