---
title: "RAG Roadmap"
artifact_type: "roadmap"
created_date: "2026-05-13"
project: "Mac Studio Local AI Workbench"
status: "draft"
---

# RAG Roadmap

## Objective

Turn local AI from a model runtime into a local memory and retrieval system that can reason over Jamie's curated Notion, GitHub, benchmark, and writing artifacts.

## Design principle

Do not dump everything into one index. Build governed corpus layers.

## Fast path

Use Open WebUI Knowledge first:

1. Create a small knowledge base from the Mac Studio setup documentation.
2. Upload clean Markdown/text files.
3. Ask known-answer questions.
4. Verify source-grounded retrieval before expanding.

## Durable path

Use Qdrant as a persistent local vector database:

```text
Documents -> chunking -> embeddings -> Qdrant -> retrieval -> local model answer
```

## Recommended embedding model

```bash
ollama pull nomic-embed-text
```

## Recommended first corpus

Use the Mac Studio setup docs before ingesting broader Notion exports.

Initial corpus candidates:

- `README.md`
- `KNOWN_GOOD_BASELINE_2026-05-12.md`
- `PROJECT_DONE_2026-05-12.md`
- `FINAL_STORAGE_CHECKPOINT_2026-05-12.md`
- `LOCAL_WORKBENCH_STATUS.md`
- `VERIFY_BASELINE_REPORT_2026-05-12.txt`

## Known-answer test questions

- Where is the final Mac Studio setup archive stored?
- What is the canonical Ollama model path?
- Which two models were benchmarked first?
- What caused the LM Studio nested `models/models` issue?
- What is the next recommended action before expanding?

## Future corpus layers

1. Mac Studio setup documents
2. OKHP3 writing artifacts
3. Notion project pages
4. ChatGPT and Claude conversation summaries
5. GitHub project docs
6. Benchmark logs and decision records

## Safety boundary

Do not mix BFS-sensitive material into public OKHP3 corpora or public-facing repository artifacts.
