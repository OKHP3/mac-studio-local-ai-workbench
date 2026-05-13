---
title: "Local Model Smoke Test Comparison"
artifact_type: "benchmark_comparison"
created_date: "2026-05-12"
status: "completed"
models:
  - "llama3.1:8b"
  - "phi4:14b"
runtime: "Ollama"
---

# Local Model Smoke Test Comparison

## Models compared

- `llama3.1:8b`
- `phi4:14b`

## Outcome table

| Test | llama3.1:8b | phi4:14b |
|---|---|---|
| Exact instruction following | Pass | Pass |
| Voice transcript cleanup | Functional pass with formatting issue | Pass |
| YAML generation | Fail | Fail |
| Architecture summary | Functional pass with semantic flaw | Partial fail |
| Mermaid generation | Fail | Partial fail |

## Comparative read

`phi4:14b` is better than `llama3.1:8b` for transcript cleanup, architecture semantics, and Mermaid structure.

However, neither model is reliable enough for autonomous governance-grade structured artifacts under simple prompting.

## Recommended use

### Use `llama3.1:8b` for

- basic local smoke tests
- simple instruction following
- rough low-risk cleanup
- quick utility prompts

### Use `phi4:14b` for

- cleaner voice transcript cleanup
- first-pass architecture interpretation
- rough Mermaid drafts
- slightly more semantic local reasoning

## Do not rely on either model for

- strict YAML front matter
- final Mermaid diagrams
- canonical architecture documentation
- unsupervised governance artifacts

## Next benchmark recommendation

Test the same prompt set using stricter prompts before declaring the models inadequate.

Recommended next pattern:

- require output only
- specify do not invent values
- provide exact date and model value
- prohibit explanations
- require code fence or no code fence explicitly
