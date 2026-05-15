---
title: "Smoke Test Prompt Suite"
artifact_type: "benchmark_prompts"
created_date: "2026-05-12"
project: "Mac Studio Local AI Workbench"
status: "v1"
---

# Smoke Test Prompt Suite

Five prompts used in the 2026-05-12 baseline benchmark. Use these to evaluate any new model before adding it to the rotation.

## How to run

```bash
ollama run [modelname] "[PROMPT]"
```

Capture the output. Score against the pass/fail criteria below.

---

## Test 1 — Exact instruction following

**Prompt:**

```text
Reply with exactly this sentence and nothing else: Local model instruction following is working.
```

**Pass criteria:** Output is exactly `Local model instruction following is working.` with no leading text, trailing text, or quotation marks.

**Fail criteria:** Any addition, preamble, or reformatting.

---

## Test 2 — Voice transcript cleanup

**Prompt:**

```text
Clean up the following voice transcript. Preserve the original meaning exactly. Correct only grammar, punctuation, and filler words. Do not add, remove, or reframe any ideas. Output only the cleaned text with no preamble or explanation.

Transcript: "So um I wanna talk about like the way that uh we're using these AI tools and how like it doesn't have to be complicated you know you just you pick the right tool for the right job and and you make sure that the expensive ones are doing the expensive thinking and the cheap ones are doing the cheap thinking and that's basically it"
```

**Pass criteria:** Clean, grammatically correct prose preserving the exact meaning. No added framing, commentary, explanation, or invented content.

**Fail criteria:** Added preamble, added analysis, changed meaning, or invented content.

---

## Test 3 — YAML front matter generation

**Prompt:**

```text
Generate YAML front matter for a Markdown document. Output only the YAML block including the opening and closing --- delimiters. Do not add any text before or after the YAML block. Do not invent any field values — use exactly the values specified.

Fields:
- title: "Mac Studio Local AI Workbench"
- artifact_type: "project_overview"
- created_date: "2026-05-13"
- status: "draft"
- keywords: ["local AI", "Mac Studio", "Ollama", "Apple Silicon"]
```

**Pass criteria:** Valid YAML, exactly the specified fields, exactly the specified values, nothing added, nothing changed.

**Fail criteria:** Added fields, invented dates, modified values, added prose before or after the YAML block, invalid YAML syntax.

---

## Test 4 — Architecture summary

**Prompt:**

```text
Summarize the following architecture in exactly five bullet points. Each bullet must be one sentence. Output only the five bullets with no preamble, no heading, no explanation.

Architecture: A Mac Studio M4 Max runs Ollama as a local inference server with six models stored on an external NVMe volume. LM Studio provides a GUI model workspace and runs its own inference server on port 1234. Open WebUI runs in Docker on localhost:3000 as a browser-based chat interface connected to Ollama. mlx-lm enables direct Apple Silicon inference bypassing Ollama's abstraction layer for maximum throughput. Claude Desktop connects to 11 MCP servers including Notion, GitHub, and PageSpace via a local configuration file.
```

**Pass criteria:** Exactly five bullets. Each bullet is one sentence. Semantically accurate. No preamble.

**Fail criteria:** More or fewer than five bullets, multi-sentence bullets, semantic errors, or added preamble/explanation.

---

## Test 5 — Mermaid diagram generation

**Prompt:**

```text
Generate a valid Mermaid flowchart diagram showing the following flow. Output only the Mermaid code block with no explanation, no preamble, and no text after the code block.

Flow: Jamie provides a prompt → Claude and ChatGPT both read and write to Notion in parallel → Notion polishes and generates specs → Specs go to Replit → Replit commits to GitHub → Claude, ChatGPT, and Notion validate against GitHub → Validation produces revision directives → Revision directives loop back to Replit
```

**Pass criteria:** Valid Mermaid syntax that renders without errors. All nodes and connections present. Code block only, no prose.

**Fail criteria:** Invalid Mermaid syntax, missing nodes, added explanation or preamble, or text after the code block.

---

## Scoring

| Result | Description |
|---|---|
| ✅ Pass | Output exactly meets criteria |
| ⚠️ Functional | Output is usable but violates at least one criterion |
| ❌ Fail | Output is not usable without significant correction |

Record results in `docs/05-benchmark-results.md` after each test run.
