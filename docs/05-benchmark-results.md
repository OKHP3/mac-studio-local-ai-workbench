---
title: "Benchmark Results"
artifact_type: "benchmark_summary"
created_date: "2026-05-12"
project: "Mac Studio Local AI Workbench"
status: "smoke-test-complete"
---

# Benchmark Results

## Smoke test — 2026-05-12

Initial benchmark of two Ollama models using loose, default-style prompting. Purpose was to establish a baseline, not to determine the ceiling.

### Models tested

- `llama3.1:8b` — Meta's 8B parameter model
- `phi4:14b` — Microsoft's 14B parameter reasoning model

### Test suite

| Test | Prompt intent | llama3.1:8b | phi4:14b |
|---|---|---|---|
| Exact instruction following | Reply with exactly the requested sentence | ✅ Pass | ✅ Pass |
| Voice transcript cleanup | Clean up a dictated paragraph while preserving meaning | ⚠️ Functional, added framing text | ✅ Pass |
| YAML generation | Produce valid YAML front matter for a document | ❌ Fail, invented fields and added prose | ❌ Fail, invented fields and added prose |
| Architecture summary | Summarize a technical architecture in 5 bullets | ⚠️ Functional, semantic flaw | ⚠️ Partial fail, correct semantics but returned 7 items not 5 |
| Mermaid diagram generation | Generate a Mermaid flowchart from a description | ❌ Fail, invalid syntax and added prose | ⚠️ Partial fail, mostly valid, still added prose |

### Individual verdicts

**llama3.1:8b**

Suitable for: simple instruction following, rough transcript cleanup, first-pass summarization, smoke tests.

Not suitable for: strict YAML, Mermaid generation, canonical architecture documents, unsupervised governance artifacts.

**phi4:14b**

Suitable for: everything llama3.1:8b handles, plus cleaner transcript cleanup and more semantically accurate architecture interpretation.

Not suitable for: strict structured artifact generation without tighter prompting.

### Key finding

The YAML and Mermaid failures under loose prompting do not prove that the models are incapable. They show that the prompt harness was too loose for governed artifact generation.

A strict prompt benchmark pass is required before concluding these models are inadequate for structured artifact work.

Suggested strict-prompt pattern:

- Require output only, no preamble, no explanation
- Require exact field names and values
- Supply the expected date and model values explicitly
- State whether code fences are required or prohibited
- Test both fenced and raw-output modes

---

## MLX direct inference benchmark

| Model | Runtime | Quantization | Throughput |
|---|---|---|---:|
| Phi-4-mini-instruct-4bit | mlx-lm direct | 4-bit | 139 tok/s |
| Phi-4-mini-instruct-4bit | Ollama | 4-bit, estimated | ~35 tok/s |

MLX direct inference was approximately 4x faster than Ollama for the compatible Phi-4 mini test model. Peak memory usage during MLX inference was 2.23 GB.

---

## Models not yet benchmarked

| Model | Expected strength | Priority |
|---|---|---|
| codestral:22b | Code generation, structured output | High |
| gemma3:27b | General reasoning, quality output | High |
| gemma3:12b | General purpose | Medium |
| mistral-small3.1:24b | General purpose | Medium |

---

## Next benchmark phase

Run the same 5-test suite on all 6 Ollama models using strict prompts. Compare results against the loose-prompt baseline and document which models cross the threshold for autonomous structured artifact generation.
