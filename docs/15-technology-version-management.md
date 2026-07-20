---
title: "Technology Version Management"
artifact_type: "maintenance_plan"
created_date: "2026-07-20"
project: "Mac Studio Local AI Workbench"
status: "active"
---

# Technology Version Management

The repository is a documentation and configuration artifact layer. It does not contain a TypeScript, Vite, Tailwind, React, Java, or Python application. JavaScript is present as the language behind the documented Node.js/OpenClaw tooling, not as repository source code.

The complete tracked inventory is [config/technology-inventory.json](../config/technology-inventory.json). The July 20, 2026 review found these notable upgrade gaps:

| Technology | Recorded | Latest stable found | Action |
|---|---:|---:|---|
| Homebrew | 5.1.8 | 6.0.0 | Review host upgrade |
| Python | 3.14.4 | 3.14.6 | Review host upgrade |
| Node.js | 26.0.0 | 26.5.0 | Review host upgrade |
| Ollama | 0.23.1 | 0.32.0 | Review model/runtime compatibility |
| Docker Desktop | 4.72.0 | 4.82.0 | Review container/runtime compatibility |
| mlx-lm | 0.31.3 | 0.31.3 | Current |

Latest stable means the latest release presented by the project’s official release source on the review date. It does not mean the host should be upgraded automatically. The workbench has model, memory, storage, and service-compatibility constraints, so upgrades require a checkpoint and smoke test.

## Ongoing control

`.github/workflows/technology-updates.yml` runs weekly and on demand. It invokes `scripts/check_technology_updates.py`, which reads the inventory, queries official release APIs where supported, refreshes `reports/technology-update-report.md`, and opens a GitHub issue when a newer version is observed.

The workflow deliberately reports and requests review. It does not run Homebrew, replace Docker images, upgrade Ollama, or alter the Mac Studio. A maintainer should review the report, update the inventory and relevant dated documentation, create a checkpoint, then perform host changes manually.

Technologies marked `manual`, `not confirmed`, or `not captured` need a source-specific verification step before they can be safely automated. Future application dependencies should be added to a real lockfile such as `package-lock.json`, `pnpm-lock.yaml`, or `requirements.txt`/`pyproject.toml`; the current repository has none of these.
