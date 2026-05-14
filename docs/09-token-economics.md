---
title: "Token Economics"
artifact_type: "governance_doc"
created_date: "2026-05-13"
project: "Mac Studio Local AI Workbench"
status: "canonical"
---

# Token Economics

## The governing constraint

This setup is optimized for a fixed dual-subscription budget: Claude Pro plus ChatGPT Plus.

The author is time-rich and token-constrained. This is a hobby and portfolio-grade infrastructure build, not a billable engagement. Hours are flexible. Tokens are not.

Every architectural decision in this workflow flows from that constraint.

---

## What it means in practice

Copy-paste across tools is cheap. Running the same prompt through Claude and ChatGPT sequentially costs far less than routing every task through an autonomous extended-reasoning pass.

This is the methodology validating itself. The Council of AIs workflow was developed through cheap parallel ideation, consolidation, and validation before expensive execution tools were invoked.

---

## Token routing decision tree

```text
Incoming task
│
├── Ideation / divergence → Claude + ChatGPT base chat
│
├── Polish / formatting → Working document AI
│
├── External research / citations → Perplexity Pro or Copilot Researcher
│
├── Code review / pre-filter → GitHub Copilot
│
└── Build execution
    ├── Spec ambiguity-free? → Replit
    └── Spec has open questions? → Back to working document
```

---

## When autonomous models make sense

Autonomous or extended-reasoning models make sense at validation gates where ambiguity creates real downstream cost.

If Replit is about to spend expensive build tokens and the spec is uncertain, one frontier extended-reasoning pass on the requirements can prevent a bad build that costs more to repair.

Routine ideation should stay synchronous. When time is available, spend time before spending expensive tokens.

---

## The local workbench as token optimizer

Every task a local Ollama model handles is a task Claude Pro or ChatGPT Plus does not need to touch.

Intern-tier tasks for local models:

- Document summarization
- First-pass Markdown cleanup
- Template population
- Repetitive validation checks
- RAG corpus queries
- Voice transcript cleanup

Keep for frontier models:

- Strategic synthesis
- Complex reasoning chains
- Validation of high-stakes specs
- Novel framework generation
- Public-facing content that represents the author

---

## Token expiration awareness

Some subscriptions have included capacity that expires or resets. Treat that capacity as a use-it-or-lose-it resource for research and intern-tier work.

Examples:

- GitHub Copilot for code review, boilerplate, and pre-filtering Replit inputs
- Perplexity Pro Researcher for grounded research briefs and source discovery
- Microsoft Copilot Researcher for Microsoft ecosystem and business-context research

Do not spend scarce frontier chat capacity on work that a purpose-built research or coding tool handles better.

---

## When the math flips

The inflection point where AI token cost exceeds human cognitive cost depends on:

1. Token price trajectory
2. The value of the user's time
3. Parallelism gains
4. Validation failure cost
5. Whether the output is public-facing or disposable

For a hobby budget where time is flexible, the math favors using time and local inference before spending expensive build or reasoning tokens.

The local stack is a hedge against future pricing changes: inference at effectively zero marginal cost, regardless of what frontier model vendors do with pricing.
