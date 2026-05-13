---
title: "Model Roles Template"
artifact_type: "template"
created_date: "2026-05-13"
project: "Mac Studio Local AI Workbench"
status: "template"
---

# Model Roles

## Purpose

Every installed model should have a reason to exist. Models without roles should be benchmarked, archived, or removed.

## Role table

| Model | Runtime | Size | Role | Status | Notes |
|---|---|---:|---|---|---|
| `model-name` | Ollama / LM Studio / MLX | TBD | TBD | candidate | TBD |

## Role categories

- baseline utility
- voice cleanup
- code generation
- structured artifact generation
- architecture reasoning
- Mermaid generation
- YAML/frontmatter generation
- RAG answer generation
- embedding model
- experimental only

## Model lifecycle

```text
candidate -> smoke-tested -> assigned role -> daily rotation OR archived OR removed
```

## Required before daily use

- [ ] Smoke test completed
- [ ] Role assigned
- [ ] Failure modes documented
- [ ] Context limits known
- [ ] Storage location confirmed
