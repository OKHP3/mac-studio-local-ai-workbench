---
title: "Project Overview"
artifact_type: "project_overview"
created_date: "2026-05-13"
project: "Mac Studio Local AI Workbench"
status: "public-candidate"
---

# Project Overview

## Thesis

This project documents the conversion of a Mac Studio M4 Max into a governed local AI workbench.

The project is not framed as a generic local AI installation. It is framed as a practical operating model for local AI infrastructure: externalized storage, reproducible setup, restore scripts, health checks, model benchmarks, update governance, and RAG readiness.

## Why it matters

Local AI becomes useful when it is more than a pile of installed tools. A durable setup needs:

- normalized storage paths
- documented environment variables
- model inventories
- known-good baseline checks
- controlled update policy
- backup and recovery plan
- model role classification
- RAG/corpus governance

## Build status

Baseline build: **done**.

Operational hardening: **in progress**.

Public project page: **published as a case study**.

## Primary local components

- Mac Studio M4 Max
- Dedicated external NVMe workbench volume
- Ollama
- LM Studio
- Hugging Face cache
- Open WebUI
- Docker Desktop
- VS Code
- GitHub CLI
- private project-memory workspace
- GitHub durable artifact repo

## Repository role

This repository is the sanitized durable artifact layer. It should preserve documentation, scripts, benchmark results, manifests, and templates without storing model binaries, secrets, private tokens, private workspace links, raw MCP configuration, or cache contents.

## Public/private boundary

Private working notes, raw build transcripts, private workspace pages, and MCP-oriented memory are intentionally kept outside this public-candidate repo.

Public materials should be:

- summarized
- sanitized
- useful without private links
- free of secrets or local credential details
- safe to read without access to the original private workspace
