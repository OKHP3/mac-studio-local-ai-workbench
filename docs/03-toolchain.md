---
title: "Toolchain"
artifact_type: "toolchain_document"
created_date: "2026-05-13"
project: "Mac Studio Local AI Workbench"
status: "public-candidate"
---

# Toolchain

## Core local runtime layer

- Ollama
- LM Studio
- MLX / mlx-lm
- Docker Desktop
- Open WebUI

## Development layer

- Homebrew
- Git
- GitHub CLI
- VS Code
- Continue.dev
- Node / pnpm
- Python 3.14

## Storage and corpus layer

- Dedicated external NVMe workbench volume
- GitHub mirror workspace
- Research vault
- RAG experiment workspace
- Local model storage area

Representative path pattern:

```text
/Volumes/<external-ai-volume>/04_GitHub_Mirrors
/Volumes/<external-ai-volume>/05_Research_Vault
/Volumes/<external-ai-volume>/06_RAG_Experiments
/Volumes/<external-ai-volume>/07_Local_LLMs
```

## Knowledge and project memory layer

- Private workspace notes are the working canon and project-memory surface.
- GitHub is the durable versioned artifact layer.
- Local files are the operational substrate.

## Interface layer

- Open WebUI for browser-based local model access
- LM Studio for GUI model testing and local server behavior
- VS Code + Continue.dev for development-side local model use
- Terminal for governed setup, scripts, and verification

## Important distinction

GitHub is not automatically RAG. It becomes useful for RAG only when paired with a retrieval layer such as search, embeddings, vector database indexing, or a connector with reliable file retrieval.

## Public/private boundary

This repository documents categories and patterns. It does not include private workspace links, raw MCP configuration, local credential files, tokens, private API keys, or service-specific secrets.
