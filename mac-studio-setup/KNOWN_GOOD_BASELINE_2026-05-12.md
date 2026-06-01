---
title: "Mac Studio Known-Good Baseline"
artifact_type: "known_good_baseline"
created_date: "2026-05-12"
machine: "OverKill-Hills-Mac-Studio"
status: "functional_baseline_verified"
---

# Mac Studio Known-Good Baseline

## Baseline status

The Mac Studio local AI workbench is functional, normalized, and documented.

## Verified components

- External workbench volume: `/Volumes/OKH-Local`
- Ollama model storage: `/Volumes/OKH-Local/07_Local_LLMs/ollama/models`
- LM Studio model storage: `/Volumes/OKH-Local/07_Local_LLMs/lm-studio/models`
- Hugging Face cache: `/Volumes/OKH-Local/07_Local_LLMs/huggingface-cache`
- Hugging Face internal cache: removed
- Ollama service: running through Homebrew services
- GitHub mirrors: initialized under `/Volumes/OKH-Local/04_GitHub_Mirrors`
- Benchmark workspace: `/Volumes/OKH-Local/06_RAG_Experiments/benchmarks/local-model-smoke-test-2026-05-12`

## Models benchmarked

- `llama3.1:8b`
- `phi4:14b`

## Benchmark conclusion

- `llama3.1:8b` is a baseline utility model.
- `phi4:14b` is stronger for cleanup and semantic interpretation.
- Neither model is governance-grade for strict YAML, Mermaid, or canonical artifacts under simple prompting.

## Next safe step

Before adding more tools or expanding RAG workflows, create a backup/checkpoint of this known-good state.

## Verification report

Baseline verification report created:

`/Volumes/OKH-Local/05_Research_Vault/mac-studio-setup/VERIFY_BASELINE_REPORT_2026-05-12.txt`

Result:

- All manual Homebrew formulae verified.
- All manual Homebrew casks verified.
- Local AI environment variables verified.
- Ollama service verified as started.
- Ollama model inventory verified.
