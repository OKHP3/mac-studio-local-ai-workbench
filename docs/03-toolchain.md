---
title: "Toolchain"
artifact_type: "toolchain_document"
created_date: "2026-05-13"
project: "Mac Studio Local AI Workbench"
status: "draft"
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

- External NVMe volume: `/Volumes/OKH-Local`
- GitHub mirrors under `/Volumes/OKH-Local/04_GitHub_Mirrors`
- Research vault under `/Volumes/OKH-Local/05_Research_Vault`
- RAG experiments under `/Volumes/OKH-Local/06_RAG_Experiments`
- Local model storage under `/Volumes/OKH-Local/07_Local_LLMs`

## Knowledge and project memory layer

- Notion is the working canon and project-memory surface.
- GitHub is the durable versioned artifact layer.
- Local files are the operational substrate.

## Interface layer

- Open WebUI for browser-based local model access
- LM Studio for GUI model testing and local server behavior
- VS Code + Continue.dev for development-side local model use
- Terminal for governed setup, scripts, and verification

## Important distinction

GitHub is not automatically RAG. It becomes useful for RAG only when paired with a retrieval layer such as search, embeddings, vector database indexing, or a connector with reliable file retrieval.
