---
title: "Model Inventory"
artifact_type: "model_inventory"
created_date: "2026-05-13"
project: "Mac Studio Local AI Workbench"
status: "draft"
---

# Model Inventory

## Ollama models

| Model | Approx Size | Initial role |
|---|---:|---|
| `llama3.1:8b` | 4.9 GB | Baseline utility model |
| `mistral-small3.1:24b` | 15 GB | General reasoning candidate |
| `codestral:22b` | 12 GB | Coding and structured artifact candidate |
| `gemma3:27b` | 17 GB | Heavier reasoning candidate |
| `gemma3:12b` | 8.1 GB | Lightweight reasoning candidate |
| `phi4:14b` | 9.1 GB | Voice cleanup and semantic reasoning candidate |

## LM Studio model folders

| Model folder | Initial role |
|---|---|
| `gemma-4-26B-A4B-it-GGUF` | GUI runtime candidate |
| `gemma-4-E2B-it-GGUF` | Lightweight GUI candidate |
| `gemma-4-E4B-it-GGUF` | Midweight GUI candidate |

## Benchmarked so far

- `llama3.1:8b`
- `phi4:14b`

## Benchmark conclusion

- `llama3.1:8b` is suitable for basic local smoke tests and low-risk utility tasks.
- `phi4:14b` is stronger for transcript cleanup and semantic interpretation.
- Neither model should be trusted for governance-grade YAML, Mermaid, or canonical artifacts under loose prompting.

## Next benchmark candidates

- `codestral:22b`
- `mistral-small3.1:24b`
- `gemma3:27b`
- strict-prompt retest of `phi4:14b`
