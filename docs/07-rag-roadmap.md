---
title: "RAG Roadmap"
artifact_type: "roadmap"
created_date: "2026-05-13"
project: "Mac Studio Local AI Workbench"
status: "planned"
---

# RAG Roadmap

## The problem RAG solves

Every local AI session starts from zero unless the model can retrieve the user's actual context. The model does not automatically know the author's frameworks, prior decisions, project history, or current artifacts.

RAG, or Retrieval Augmented Generation, closes that gap. Instead of the model guessing, it retrieves relevant chunks of documented thinking before generating a response.

This is the difference between a generic local AI and a useful local second brain.

---

## Architecture overview

```text
Layer 1 — Corpus
Personal writing artifacts
AI conversation summaries
GitHub repo content
Private workspace exports
Benchmark and decision logs

Layer 2 — Vector store
Embedding model converts documents to vectors
Vector database stores and queries semantic similarity
Persistent storage lives on the external AI workbench volume

Layer 3 — Retrieval and inference
Query arrives
Query is embedded
Vector database returns matching chunks
Chunks are injected into local model context
Local model answers using retrieved context
```

---

## Component stack

| Component | Tool | Status |
|---|---|---|
| Embedding model | `nomic-embed-text` via Ollama | Not yet installed |
| Vector database | Qdrant via Docker | Not yet deployed |
| RAG interface | Open WebUI Knowledge | Running, needs vector-store wiring |

---

## Step 1 — Pull embedding model

```bash
ollama pull nomic-embed-text
```

Verify with:

```bash
ollama list
```

---

## Step 2 — Deploy Qdrant

```bash
docker run -d \
  -p 6333:6333 \
  -p 6334:6334 \
  -v /Volumes/OKH-Local/07_Local_LLMs/qdrant:/qdrant/storage \
  --name qdrant \
  --restart always \
  qdrant/qdrant
```

Verify:

```bash
curl http://localhost:6333/health
```

Qdrant dashboard:

```text
http://localhost:6333/dashboard
```

---

## Step 3 — Configure Open WebUI

Open WebUI settings:

- Embedding model engine: Ollama
- Embedding model: `nomic-embed-text`
- Vector database: Qdrant
- Qdrant URL: local Docker host URL

---

## Step 4 — Ingest corpus by priority

| Layer | Source | Why first |
|---|---|---|
| 1 | Personal writing artifacts | Establishes voice and frameworks |
| 2 | AI conversation summaries | Captures decisions and reasoning patterns |
| 3 | GitHub project docs | Architecture thinking and project history |
| 4 | Private workspace exports | Broadest knowledge coverage |
| 5 | Benchmark and decision logs | Operational history and evidence |

In Open WebUI, create a Knowledge Base and upload Markdown files. Open WebUI handles chunking, embedding, and indexing.

In chat, activate the knowledge base with the relevant `#` reference.

---

## The flywheel

```text
Frontier model produces high-quality synthesis
        ↓
Save to personal archive
        ↓
Periodic export, embedding, and re-indexing
        ↓
Local model gains access to that synthesis
        ↓
Local model produces better context-aware outputs
        ↓
Better outputs are saved back into the corpus
```

Over time, this creates a local AI layer that reflects actual thinking, frameworks, and accumulated decisions, not only generic training data.

---

## Network access from other devices

All local AI services can be accessed from other trusted devices on the same home network when the Mac Studio is awake and the service is bound correctly.

Find Mac Studio IP:

```bash
ipconfig getifaddr en0
```

| Service | Local URL pattern |
|---|---|
| Open WebUI | `http://[IP]:3000` |
| Ollama API | `http://[IP]:11434` |
| LM Studio API | `http://[IP]:1234` |
| Qdrant dashboard | `http://[IP]:6333/dashboard` |

For iPhone or iPad, open the Open WebUI URL in Safari and use Share → Add to Home Screen.

Requirement: Mac Studio must remain awake. Configure Energy settings to prevent automatic sleep when connected to power.

Do not expose these services directly to the public internet without an access-control layer.

---

## RAG vs fine-tuning

| Approach | What it does | When to use |
|---|---|---|
| RAG | Retrieves relevant context at query time | Factual recall, document reference, decision history |
| Fine-tuning / LoRA | Bakes style or behavior into model weights | Voice matching and consistent persona after corpus stabilizes |

Recommended sequence: RAG first, fine-tuning later if a stable style target emerges.
