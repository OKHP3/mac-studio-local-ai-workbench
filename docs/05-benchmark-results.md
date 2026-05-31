---
title: "Benchmark Results"
artifact_type: "benchmark_summary"
created_date: "2026-05-12"
updated_date: "2026-05-30"
project: "Mac Studio Local AI Workbench"
status: "strict-benchmark-complete"
---

# Benchmark Results

## Summary

Two benchmark passes completed:

- **2026-05-12:** Loose/default prompting — 2 models tested, established baseline
- **2026-05-30:** Strict output-only prompting — all 6 models tested

Key finding: strict prompting eliminated all outright failures. The May 2026 failures were prompt engineering issues, not model deficiencies.

---

## Strict prompt benchmark — 2026-05-30

All 6 Ollama models tested against the same 5 tests with strict output-only instructions.

### Scoring

- ✅ Pass — output exactly meets criteria
- ⚠️ Functional — output usable but violates at least one formatting constraint
- ❌ Fail — output not usable without significant correction

### Results

| Model | T1 Exact | T2 Transcript | T3 YAML | T4 Summary | T5 Mermaid | Score |
|---|---|---|---|---|---|---|
| phi4:14b | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | 3P / 2F |
| gemma3:12b | ✅ | ✅ | ✅ | ✅ | ✅ | **5P / 0F** |
| gemma3:27b | ✅ | ✅ | ✅ | ✅ | ✅ | **5P / 0F** |
| codestral:22b | ⚠️ | ✅ | ⚠️ | ✅ | ⚠️ | 2P / 3F |
| mistral-small3.1:24b | ✅ | ✅ | ⚠️ | ✅ | ✅ | 4P / 1F |
| llama3.1:8b | ✅ | ⚠️ | ⚠️ | ✅ | ⚠️ | 2P / 3F |

**Zero outright failures across all 6 models.**

### Individual verdicts

**gemma3:12b** — Clean sweep. Best strict-prompt performer. 5/5. Recommended for governed artifact generation.

**gemma3:27b** — Clean sweep. 5/5. Quality daily driver and OpenClaw primary. Recommended for governed artifact generation.

**mistral-small3.1:24b** — 4/5. Only failure: YAML wrapped in code fence. Strong general performer.

**phi4:14b** — 3/5. YAML wrapped in code fence. Mermaid generated undeclared node. Fast daily driver suitable for tasks not requiring strict structured output.

**codestral:22b** — 2/5 functional. Leading space on T1, code fence on YAML, extra nodes in Mermaid. Expected for a code generation model — use it for code, not governed documents.

**llama3.1:8b** — 2/5 functional. Retained "So" on transcript, YAML missing closing fence, Mermaid space in node name. Suitable for lightweight tasks where minor formatting issues are acceptable.

### Key finding: YAML code fence pattern

4 of 6 models default to wrapping YAML output in a code fence even when not instructed to. Fix: add "do not use a code fence, output raw YAML only" to any YAML generation prompt.

---

## Baseline benchmark — 2026-05-12

Two Ollama models benchmarked using loose, default-style prompting.

### Models tested

- `llama3.1:8b`
- `phi4:14b`

### Test suite

| Test | llama3.1:8b | phi4:14b |
|---|---|---|
| Exact instruction following | ✅ Pass | ✅ Pass |
| Voice transcript cleanup | ⚠️ Functional (formatting issue) | ✅ Pass |
| YAML generation | ❌ Fail | ❌ Fail |
| Architecture summary | ⚠️ Functional (semantic flaw) | ⚠️ Partial fail |
| Mermaid diagram generation | ❌ Fail | ⚠️ Partial fail |

### Baseline conclusion

The YAML and Mermaid failures under loose prompting reflected weak prompt harness, not model incapability. Both were confirmed capable under strict prompting in the May 30 pass.

---

## MLX direct inference benchmark

| Model | Runtime | Quantization | Throughput |
|---|---|---|---|
| Phi-4-mini-instruct-4bit | mlx-lm direct | 4-bit | 139 tok/s |
| Phi-4-mini-instruct-4bit | Ollama | 4-bit, estimated | ~35 tok/s |

MLX direct inference is approximately 4x faster than Ollama for compatible models.

---

## Routing recommendations (post-benchmark)

| Task | Recommended model | Reason |
|---|---|---|
| Governed document generation | gemma3:12b or gemma3:27b | Only models with 5/5 strict pass |
| Code generation | codestral:22b | Purpose-built, strong code output |
| Fast general tasks | phi4:14b | Speed, 3/5 strict pass |
| Lightweight / bulk | llama3.1:8b | Smallest footprint, acceptable for low-stakes tasks |
| OpenClaw agent | gemma3:27b | Required for 131k context window |
| Max throughput | Phi-4-mini-instruct-4bit (mlx-lm) | 139 tok/s |
