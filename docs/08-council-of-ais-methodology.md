---
title: "Council of AIs — Operational Methodology"
artifact_type: "methodology_doc"
created_date: "2026-05-13"
project: "Mac Studio Local AI Workbench"
status: "canonical"
---

# Council of AIs — Operational Methodology

This document captures the strategic AI production workflow that motivated the Mac Studio build. The local workbench is infrastructure. This is the operating model it serves.

---

## The core insight

The bottleneck in 2026 is not access to AI capability. It is routing cognition efficiently.

**Cheap tokens think broadly. Expensive tokens act precisely.**

That rule governs the routing decisions in this workflow.

---

## Why this works in 2026

| Old manual process | Council of AIs workflow |
|---|---|
| Linear handoffs | Parallel passes |
| Cognitive load at every transition | Tools read content, not provenance |
| Validation equals one read by one person | Validation equals independent reads from multiple systems |
| Revision means manual re-entry at every loop | Revision becomes a directive back to the builder |
| Audit trail is whatever was saved | Audit trail is GitHub plus working documents |
| Cost is senior time times number of passes | Cost is token fractions plus fixed subscriptions |

---

## The five phases

### Phase 1 — Blind ideation loop

Claude and ChatGPT both read from and write to a shared consolidation hub. Neither tool needs to know content provenance. Content is treated as material on the page. This keeps ideation divergent and merit-based.

### Phase 2 — Consolidation and requirements

Once ideation stabilizes, working-document AI capabilities polish the raw material and generate formal specs, requirements, and marching orders. Stream-of-consciousness becomes executable directive.

### Phase 3 — Replit execution

Replit receives marching orders and executes against the spec. It should not be used to discover requirements that should have been clarified earlier. Every token spent on ambiguity is waste.

### Phase 4 — GitHub as versioned source of truth

Replit commits output to GitHub. GitHub is not merely a backup. It is the durable artifact layer and a future RAG corpus for downstream tools.

### Phase 5 — Validation loop

Claude, ChatGPT, and the working document independently read the GitHub artifacts and compare against requirements. Misalignments become revision directives that loop back to Replit until the spec is locked.

---

## Token cost hierarchy

| Tool | Cost tier | Constraint | Waste risk |
|---|---|---|---|
| Replit | Highest | Paid build/execution capacity | Burns on ambiguous directives |
| Perplexity Pro | High | Limited monthly capacity | Expires unused |
| Claude Pro | Medium | Subscription limits | Extended thinking overuse |
| ChatGPT Plus | Medium | Subscription limits | Deep reasoning overuse |
| GitHub Copilot | Low-medium | Monthly included capacity | Underutilized |
| M365 Copilot Pro | Low | Included | Underutilized |
| Notion AI | Lowest | Effectively included | Rarely a concern |

---

## Model selection by phase

| Phase | Right choice | Wrong choice | Why |
|---|---|---|---|
| Ideation | Base Claude / GPT chat | Extended thinking | Divergence needs speed, not depth |
| Polishing | Working-document AI | Frontier model | Cheap synthesis is sufficient |
| Low-risk spec validation | Base Claude or ChatGPT | Extended reasoning | Alignment checks do not always need depth |
| High-risk pre-build validation | Frontier + extended reasoning | Base models | One expensive pass can prevent a bad build |
| Code review / pre-filter | GitHub Copilot | Frontier chat | Purpose-built, expiring capacity |
| Research briefs | Perplexity or Copilot Researcher | Claude / ChatGPT | Grounded research belongs with research tools |

---

## The research intern pattern

Lower-cost or expiring-capacity tools are context acquisition agents. They gather and structure material that primary reasoning tools exploit later.

What to send to the intern tier:

- Competitive landscape scans
- Technology horizon scans
- Failure mode catalogs
- API behavior verification
- Standards and best-practice deep dives

All intern output should land as Markdown with YAML front matter, committed to GitHub for machine-readable consumption by Claude, ChatGPT, and Replit.

---

## Research prompt generator

Use this pattern to generate a prompt for a lower-cost research agent:

```text
You are a senior research director creating a task brief for a lower-cost research agent.

The research agent will be: Perplexity Pro / Microsoft Copilot Researcher

Your job is not to perform the research. Generate a precise, ready-to-paste researcher prompt.

Research Topic: [INSERT TOPIC]
Purpose: [Why this matters]
Downstream Consumers: GitHub, Claude, ChatGPT, Replit
Research Scope: [What is in scope]
Out of Scope: [What must be excluded]
Currency: Prioritize 2025-2026 sources.

Required Output Format: GitHub-ready Markdown with YAML front matter.
Required Sections: Executive Summary, Key Findings, Implications, Risks/Unknowns, Next Action, Sources.
Tone: Concise, structured, machine-readable. No marketing. No fluff.

Now generate the exact researcher prompt.
```

---

## The seven operating rules

1. **Ideate cheaply.** Use base chat for ideation. Do not waste extended thinking on brainstorming.
2. **Consolidate centrally.** Working documents are the canon. Authorship is irrelevant once content lands there.
3. **Formalize before execution.** Specs go to Replit. Never the reverse.
4. **Delegate research to the intern tier.** Research tools gather evidence. Output lands in GitHub as Markdown.
5. **Execute precisely.** Replit builds. Every ambiguity costs tokens.
6. **Preserve state durably.** GitHub is the versioned source of truth.
7. **Validate recursively.** Independent reads create divergence, divergence becomes revision directives, and the loop closes.

---

## How the local stack fits in

The Mac Studio local AI workbench is the zero-marginal-cost intern tier for this methodology.

Local models on Ollama replace the lowest-cost cloud inference for:

- Bulk document processing
- RAG corpus queries
- Repetitive validation checks
- First-pass summarization
- Voice transcript cleanup

This extends the token budget. Every task a local model handles is a task Claude Pro or ChatGPT Plus does not need to.

Routing hierarchy:

```text
Local models → Notion AI → Claude/ChatGPT base → Perplexity/Copilot → Replit
```
