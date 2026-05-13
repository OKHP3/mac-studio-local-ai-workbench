---
title: "Local AI Health Check Template"
artifact_type: "template"
created_date: "2026-05-13"
project: "Mac Studio Local AI Workbench"
status: "template"
---

# Local AI Health Check

## Date

YYYY-MM-DD

## Operator

Jamie / ChatGPT / Claude

## Baseline verification

- [ ] `scripts/verify_mac_studio_baseline.sh` executed
- [ ] Report saved
- [ ] Missing formulae: none / listed below
- [ ] Missing casks: none / listed below

## Runtime checks

- [ ] Ollama service running
- [ ] `ollama list` returns expected models
- [ ] Open WebUI container running
- [ ] Open WebUI browser login works
- [ ] LM Studio model path still clean
- [ ] Hugging Face cache remains external

## Storage checks

- [ ] Ollama models path exists
- [ ] LM Studio models path exists
- [ ] Hugging Face cache path exists
- [ ] OKH-Local free space acceptable

## Notes

Add anomalies, remediation, or update decisions here.
