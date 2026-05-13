---
title: "Local Model Smoke Test Benchmark Summary"
artifact_type: "benchmark_summary"
created_date: "2026-05-12"
status: "completed"
---

# Local Model Smoke Test Benchmark Summary

## Models assessed

- `llama3.1:8b`
- `phi4:14b`

## Runtime

- Ollama

## Result

The initial smoke-test benchmark established that local models are useful but require careful role assignment and prompt governance.

## Test outcomes

| Test | llama3.1:8b | phi4:14b |
|---|---|---|
| Exact instruction following | Pass | Pass |
| Voice transcript cleanup | Functional pass | Pass |
| YAML generation | Fail | Fail |
| Architecture summary | Functional pass with semantic flaw | Partial fail |
| Mermaid generation | Fail | Partial fail |

## Recommendation

Use `llama3.1:8b` for low-risk utility tasks. Use `phi4:14b` for cleaner text cleanup and better semantic interpretation.

Do not rely on either model for strict YAML, Mermaid, architecture artifacts, or governance-grade documentation without review.
