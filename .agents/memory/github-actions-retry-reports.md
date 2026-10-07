---
name: GitHub Actions retry reports
description: Preserve failure diagnostics without causing artifact-name conflicts when failed jobs are rerun.
---

Use attempt-specific artifact names for reports uploaded by retryable jobs, and show the exact name in the job summary.

**Why:** GitHub Actions upload artifacts are immutable within a workflow run. Rerunning failed jobs retains the run; reusing a report artifact name can fail the upload even when the retried checks pass.

**How to apply:** Include the workflow run attempt in report artifact names whenever reports are uploaded on failure. Preserve earlier attempts rather than overwriting their evidence.
