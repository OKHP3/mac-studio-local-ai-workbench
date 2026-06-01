---
title: "Mac Studio Setup README"
artifact_type: "setup_readme"
created_date: "2026-05-12"
status: "baseline_verified"
---

# Mac Studio Setup

This folder documents the known-good baseline for the Mac Studio local AI workbench.

## Purpose

This setup supports the OKHP3 local AI workflow:

- Externalized model storage
- Ollama runtime
- LM Studio model storage
- Hugging Face authenticated cache
- GitHub mirror workspace
- Local benchmark artifacts
- Reproducible Homebrew restore and verification scripts

## Key files

- `KNOWN_GOOD_BASELINE_2026-05-12.md`  
  Authoritative known-good baseline.

- `FINAL_STORAGE_CHECKPOINT_2026-05-12.md`  
  Storage normalization checkpoint.

- `LOCAL_WORKBENCH_STATUS.md`  
  Detailed workbench status and path history.

- `PRE_NORMALIZATION_SNAPSHOT_2026-05-12.md`  
  Snapshot before model/cache normalization.

- `VERIFY_BASELINE_REPORT_2026-05-12.txt`  
  Baseline verification output.

- `restore_mac_studio_baseline.sh`  
  Restore script for manual Homebrew formulae/casks and Ollama service startup.

- `verify_mac_studio_baseline.sh`  
  Non-destructive verification script for the known-good baseline.

- `brew-formulae.manual.txt`  
  Curated manual formula restore list.

- `brew-casks.manual.txt`  
  Curated manual cask restore list.

## Verification command

From this folder, run:

    ./verify_mac_studio_baseline.sh

## Restore command

From this folder, run:

    ./restore_mac_studio_baseline.sh

## Current status

The Mac Studio local AI workbench is functional, normalized, documented, benchmarked, and verified against the known-good baseline.

## Next safe step

Create a backup/checkpoint before installing more tools or expanding RAG workflows.
