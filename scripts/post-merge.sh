#!/usr/bin/env bash
set -euo pipefail

# Restore the exact dependency tree after isolated task changes are merged.
npm ci --no-audit --no-fund

# Confirm merged frontend work still produces a deployable static artifact.
npm run build