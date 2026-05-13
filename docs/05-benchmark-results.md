---
title: "Benchmark Results"
artifact_type: "benchmark_summary"
created_date: "2026-05-13"
project: "Mac Studio Local AI Workbench"
status: "draft"
---

# Benchmark Results

## Benchmark prompt set

The initial smoke-test prompt set evaluated five behaviors:

1. Exact instruction following
2. Voice transcript cleanup
3. YAML front matter generation
4. Concise architecture summary
5. Mermaid flowchart generation

## Outcome table

| Test | `llama3.1:8b` | `phi4:14b` |
|---|---|---|
| Exact instruction following | Pass | Pass |
| Voice transcript cleanup | Functional pass with formatting issue | Pass |
| YAML generation | Fail | Fail |
| Architecture summary | Functional pass with semantic flaw | Partial fail |
| Mermaid generation | Fail | Partial fail |

## Comparative read

`phi4:14b` performed better than `llama3.1:8b` for transcript cleanup, semantic interpretation, and Mermaid structure.

However, neither model proved reliable enough for autonomous governance-grade structured artifact generation under simple prompting.

## Important interpretation

The failures may be prompt-harness failures rather than absolute model failures. A strict-prompt benchmark is required before declaring the models inadequate for structured output.

## Next benchmark pattern

Use prompts that enforce:

- output only
- no explanation
- do not invent values
- exact date and model values supplied
- Mermaid only when Mermaid is requested
- YAML only when YAML is requested
- explicit code fence or no-code-fence rule
