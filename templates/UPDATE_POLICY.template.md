---
title: "Update Policy Template"
artifact_type: "template"
created_date: "2026-05-13"
project: "Mac Studio Local AI Workbench"
status: "template"
---

# Update Policy

## Purpose

Prevent the local AI workbench from drifting, breaking, or accumulating unmanaged changes.

## Update rule

Do not update core runtime components until the current known-good baseline has been verified and backed up.

## Update classes

| Component | Policy | Verification required after update |
|---|---|---|
| macOS | Manual only | Full baseline verification |
| Homebrew formulae | Weekly or biweekly | `verify_mac_studio_baseline.sh` |
| Ollama | Manual only | `ollama list` and model smoke test |
| LM Studio | Manual only | Confirm model path and server behavior |
| Open WebUI | Manual only | Docker container status and browser login |
| Docker Desktop | Manual with caution | Open WebUI container check |
| Hugging Face packages | Manual per virtualenv | HF auth and cache path check |
| Models | Intentional one-at-a-time | Model role and smoke test |

## Pre-update checklist

- [ ] Run baseline verification
- [ ] Save verification report
- [ ] Confirm backup exists off `/Volumes/OKH-Local`
- [ ] Identify update command
- [ ] Identify rollback path

## Post-update checklist

- [ ] Re-run verification
- [ ] Confirm relevant services are running
- [ ] Confirm model visibility
- [ ] Update Notion task/status page
- [ ] Commit updated documentation if needed
