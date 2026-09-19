# Technology update report

Checked (UTC): 2026-09-19T03:08:14+00:00

Recorded versions are dated repository evidence, not a fresh Mac Studio inspection.
Latest values are source observations, not installed or compatibility-tested versions.
Homebrew rows track the stable version available in the named formula/cask channel.
See [maintenance plan](../docs/15-technology-version-management.md) for boundaries and adoption steps.

Inventory entries: 111. Newer than recorded: 16. Source failures: 4.

## Host

| Technology | Recorded version (date) | Latest stable / channel | Result | Evidence and release source |
|---|---|---|---|---|
| macOS | 26.6 (2026-08-02) | 27 | update-available | [evidence 1](../reports/openclaw-related-runtime-readiness-audit-2026-08-02.md); [release source](https://support.apple.com/en-us/100100) |
| Homebrew | 5.1.8 (2026-05-28) | 7.0.4 | update-available | [evidence 1](../docs/03-toolchain.md); [release source](https://github.com/Homebrew/brew/releases/tag/7.0.4) |
| Git | 2.54.0 (2026-05-28) | 2.55.0 | update-available | [evidence 1](../docs/03-toolchain.md); [release source](https://formulae.brew.sh/api/formula/git.json) |
| Python | 3.14.4 (2026-05-28) | 3.14.7 | update-available | [evidence 1](../docs/03-toolchain.md); [release source](https://www.python.org/downloads/macos/) |
| Node.js | 26.0.0 (2026-05-28) | 26.9.0 | update-available | [evidence 1](../docs/03-toolchain.md); [release source](https://nodejs.org/dist/index.json) |
| npm | 11.12.1 (2026-05-28) | 12.0.2 | update-available | [evidence 1](../docs/03-toolchain.md); [release source](https://registry.npmjs.org/npm/latest) |
| GitHub CLI | 2.92.0 (2026-05-28) | 2.101.0 | update-available | [evidence 1](../docs/03-toolchain.md); [release source](https://github.com/cli/cli/releases/tag/v2.101.0) |
| Git LFS | Unknown | 3.8.0 | installed-unknown | [evidence 1](../docs/03-toolchain.md); [release source](https://github.com/git-lfs/git-lfs/releases/tag/v3.8.0) |
| Ollama | 0.23.1 (2026-08-02) | 0.34.2 | update-available | [evidence 1](../docs/16-local-ai-stack-readiness-research-2026-08-02.md); [release source](https://github.com/ollama/ollama/releases/tag/v0.34.2) |
| LM Studio | 0.4.12 (2026-05-28) | 0.4.24 | update-available | [evidence 1](../docs/03-toolchain.md); [release source](https://formulae.brew.sh/api/cask/lm-studio.json) |
| mlx-lm | 0.31.3 (2026-05-28) | 0.31.3 | matches-record | [evidence 1](../docs/03-toolchain.md); [release source](https://pypi.org/project/mlx-lm/0.31.3/) |
| MLX | Unknown | 0.32.1 | installed-unknown | [evidence 1](../manifests/brew-formulae.manual.txt); [release source](https://formulae.brew.sh/api/formula/mlx.json) |
| Open WebUI | 0.11.0 (2026-09-12) | 0.11.3 | update-available | [evidence 1](../docs/18-lan-exposure-fix-2026-09-12.md); [release source](https://github.com/open-webui/open-webui/releases/tag/v0.11.3) |
| Docker Desktop | 4.72.0 (2026-05-28) | 4.91.0 | update-available | [evidence 1](../docs/03-toolchain.md); [release source](https://formulae.brew.sh/api/cask/docker-desktop.json) |
| Docker Engine | 29.6.2 (2026-08-02) | 29.8.1 | update-available | [evidence 1](../reports/openclaw-related-runtime-readiness-audit-2026-08-02.md); [release source](https://github.com/moby/moby/releases/tag/docker-v29.8.1) |
| OpenClaw | 2026.7.1-2 (2026-08-02) | 2026.9.5 | update-available | [evidence 1](../reports/openclaw-related-runtime-readiness-audit-2026-08-02.md); [release source](https://registry.npmjs.org/openclaw/latest) |
| SearXNG | Unknown | rolling digest sha256:e0027a772aeeea55bf642256aae6fb3344ffa5f25ca665898c2ea821101334c4 | rolling-review | [evidence 1](../docs/18-lan-exposure-fix-2026-09-12.md); [release source](https://hub.docker.com/v2/repositories/searxng/searxng/tags/latest) |
| Qdrant | Unknown | 1.19.1 | installed-unknown | [evidence 1](../reports/openclaw-related-runtime-readiness-audit-2026-08-02.md); [evidence 2](../docs/18-lan-exposure-fix-2026-09-12.md); [evidence 3](../docs/diagram-architecture.md); [release source](https://github.com/qdrant/qdrant/releases/tag/v1.19.1) |
| Visual Studio Code | 1.119.0 (2026-05-28) | 1.138.0 | update-available | [evidence 1](../docs/03-toolchain.md); [release source](https://formulae.brew.sh/api/cask/visual-studio-code.json) |
| Continue VS Code extension | 1.2.22 (2026-05-28) | 2.0.0 | update-available | [evidence 1](../docs/03-toolchain.md); [release source](https://open-vsx.org/api/Continue/continue/2.0.0) |
| pnpm | Unknown | 12.4.2 | installed-unknown | [evidence 1](../manifests/brew-formulae.manual.txt); [release source](https://registry.npmjs.org/pnpm/latest) |
| Bash | Unknown | 5.3.20 | installed-unknown | [evidence 1](../scripts/verify_mac_studio_baseline.sh); [release source](https://formulae.brew.sh/api/formula/bash.json) |
| Zsh | Unknown | 5.9.2 | installed-unknown | [evidence 1](../context/threads/mac-studio-toolchain-install-onedrive-git-sync-corruption-incident.md); [release source](https://formulae.brew.sh/api/formula/zsh.json) |
| pip | Unknown | 26.2.1 | installed-unknown | [evidence 1](../context/threads/mac-studio-toolchain-install-onedrive-git-sync-corruption-incident.md); [release source](https://pypi.org/project/pip/26.2.1/) |
| Hugging Face Hub client | Unknown | 1.32.0 | installed-unknown | [evidence 1](../mac-studio-setup/LOCAL_WORKBENCH_STATUS.md); [release source](https://pypi.org/project/huggingface-hub/1.32.0/) |
| ClawHub | Unknown | 0.23.3 | installed-unknown | [evidence 1](../docs/10-openclaw-larry-agent.md); [release source](https://registry.npmjs.org/clawhub/latest) |
| MCPorter | Unknown | 0.13.13 | installed-unknown | [evidence 1](../docs/10-openclaw-larry-agent.md); [release source](https://registry.npmjs.org/mcporter/latest) |
| tmux | Unknown | 3.7c | installed-unknown | [evidence 1](../context/threads/openclaw-larry-onboarding-channel-configuration-issues.md); [release source](https://formulae.brew.sh/api/formula/tmux.json) |
| Microsoft Edge | Unknown | 153.0.4234.48 | installed-unknown | [evidence 1](../docs/03-toolchain.md); [release source](https://formulae.brew.sh/api/cask/microsoft-edge.json) |
| OneDrive | Unknown | 26.153.0809.0004 | installed-unknown | [evidence 1](../docs/03-toolchain.md); [release source](https://formulae.brew.sh/api/cask/onedrive.json) |
| GitHub Desktop | Unknown | 3.6.6-8b85519e | installed-unknown | [evidence 1](../docs/03-toolchain.md); [release source](https://formulae.brew.sh/api/cask/github.json) |
| Claude Desktop | Unknown | 2.2553.1 | installed-unknown | [evidence 1](../docs/03-toolchain.md); [release source](https://formulae.brew.sh/api/cask/claude.json) |
| ChatGPT Desktop | Unknown | 26.915.31945 | installed-unknown | [evidence 1](../docs/03-toolchain.md); [release source](https://formulae.brew.sh/api/cask/chatgpt.json) |
| Codex Desktop | Unknown | 26.623.141536 | installed-unknown | [evidence 1](../docs/03-toolchain.md); [release source](https://formulae.brew.sh/api/cask/codex-app.json) |
| Notion Desktop | Unknown | 7.34.0 | installed-unknown | [evidence 1](../docs/03-toolchain.md); [release source](https://formulae.brew.sh/api/cask/notion.json) |
| Perplexity | Unknown | 26.37.1 | installed-unknown | [evidence 1](../docs/03-toolchain.md); [release source](https://formulae.brew.sh/api/cask/perplexity.json) |
| Microsoft Office | Unknown | 16.113.26091740 | installed-unknown | [evidence 1](../docs/03-toolchain.md); [release source](https://formulae.brew.sh/api/cask/microsoft-office.json) |
| bat | Unknown | 0.26.1 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/bat.json) |
| fd | Unknown | 10.5.0 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/fd.json) |
| fzf | Unknown | 0.74.4 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/fzf.json) |
| ripgrep | Unknown | 15.2.0 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/ripgrep.json) |
| tree | Unknown | 2.3.2 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/tree.json) |
| wget | Unknown | 1.25.0 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/wget.json) |
| yq | Unknown | 4.53.6 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/yq.json) |

## Repository

| Technology | Recorded version (date) | Latest stable / channel | Result | Evidence and release source |
|---|---|---|---|---|
| Mermaid | Unknown | 12.0.0 | installed-unknown | [evidence 1](../docs/12-architecture-diagrams.md); [release source](https://registry.npmjs.org/mermaid/latest) |
| actions/checkout | 7.0.1 (2026-09-19) | Unknown (lookup failed) | source-error | [evidence 1](../.github/workflows/technology-updates.yml); [release source](https://api.github.com/repos/actions/checkout/releases/latest) |
| actions/setup-python | 7.0.0 (2026-09-19) | Unknown (lookup failed) | source-error | [evidence 1](../.github/workflows/technology-updates.yml); [release source](https://api.github.com/repos/actions/setup-python/releases/latest) |
| actions/upload-artifact | 7.0.1 (2026-09-19) | Unknown (lookup failed) | source-error | [evidence 1](../.github/workflows/technology-updates.yml); [release source](https://api.github.com/repos/actions/upload-artifact/releases/latest) |
| GitHub-hosted Ubuntu runner | 24.04 (2026-09-19) | Not versioned / manual | manual-review | [evidence 1](../.github/workflows/technology-updates.yml); [release source](https://github.com/actions/runner-images) |

## External Site

| Technology | Recorded version (date) | Latest stable / channel | Result | Evidence and release source |
|---|---|---|---|---|
| Mermaid public website renderer | 11.17.2 (2026-09-19) | 12.0.0 | update-available | [evidence 1](https://github.com/OKHP3/OverKill-Hill/blob/main/assets/vendor/mermaid/VERSION); [release source](https://registry.npmjs.org/mermaid/latest) |

## Support

| Technology | Recorded version (date) | Latest stable / channel | Result | Evidence and release source |
|---|---|---|---|---|
| ada-url | Unknown | 4.0.0 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/ada-url.json) |
| brotli | Unknown | 1.2.0 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/brotli.json) |
| c-ares | Unknown | 1.34.8 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/c-ares.json) |
| ca-certificates | Unknown | 2026-08-13 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/ca-certificates.json) |
| fmt | Unknown | 12.2.0 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/fmt.json) |
| gettext | Unknown | 1.0 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/gettext.json) |
| hdrhistogram_c | Unknown | 0.11.10 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/hdrhistogram_c.json) |
| icu4c@78 | Unknown | 78.3 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/icu4c@78.json) |
| libgit2 | Unknown | 1.9.7 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/libgit2.json) |
| libidn2 | Unknown | 2.3.8 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/libidn2.json) |
| libnghttp2 | Unknown | 1.70.0 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/libnghttp2.json) |
| libnghttp3 | Unknown | 1.18.0 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/libnghttp3.json) |
| libngtcp2 | Unknown | 1.25.0 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/libngtcp2.json) |
| libssh2 | Unknown | 1.11.1 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/libssh2.json) |
| libunistring | Unknown | 1.4.2 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/libunistring.json) |
| libuv | Unknown | 1.52.1 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/libuv.json) |
| llhttp | Unknown | 9.4.3 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/llhttp.json) |
| lz4 | Unknown | 1.10.0 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/lz4.json) |
| merve | Unknown | 1.2.2 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/merve.json) |
| mlx-c | Unknown | 0.6.0 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/mlx-c.json) |
| mpdecimal | Unknown | 4.0.1 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/mpdecimal.json) |
| nbytes | Unknown | 0.1.4 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/nbytes.json) |
| oniguruma | Unknown | 6.9.10 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/oniguruma.json) |
| openssl@3 | Unknown | 3.6.4 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/openssl@3.json) |
| pcre2 | Unknown | 10.48 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/pcre2.json) |
| readline | Unknown | 8.3.6 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/readline.json) |
| simdjson | Unknown | 4.6.11 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/simdjson.json) |
| simdutf | Unknown | 9.2.0 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/simdutf.json) |
| sqlite | Unknown | 3.53.4 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/sqlite.json) |
| uvwasi | Unknown | 0.0.23 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/uvwasi.json) |
| xz | Unknown | 5.8.4 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/xz.json) |
| zstd | Unknown | 1.5.7 | installed-unknown | [evidence 1](../mac-studio-setup/brew-formulae.txt); [release source](https://formulae.brew.sh/api/formula/zstd.json) |

## Planned

| Technology | Recorded version (date) | Latest stable / channel | Result | Evidence and release source |
|---|---|---|---|---|
| Caddy | Unknown | Unknown (lookup failed) | source-error | [evidence 1](../docs/local-web-portal-https.md); [release source](https://api.github.com/repos/caddyserver/caddy/releases/latest) |

## Format

| Technology | Recorded version (date) | Latest stable / channel | Result | Evidence and release source |
|---|---|---|---|---|
| JavaScript / ECMAScript | Unknown | Not versioned / manual | format | [evidence 1](../README.md); [release source](https://tc39.es/ecma262/) |
| Markdown / GFM | Unknown | Not versioned / manual | format | [evidence 1](../README.md); [release source](https://github.github.com/gfm/) |
| YAML | Unknown | Not versioned / manual | format | [evidence 1](../README.md); [release source](https://yaml.org/spec/1.2.2/) |
| JSON | Unknown | Not versioned / manual | format | [evidence 1](../README.md); [release source](https://www.rfc-editor.org/rfc/rfc8259) |
| Mermaid SVG output | Unknown | Not versioned / manual | format | [evidence 1](../README.md); [release source](https://www.w3.org/TR/SVG2/) |
| MCP | Unknown | Not versioned / manual | format | [evidence 1](../README.md); [release source](https://modelcontextprotocol.io/specification/versioning) |
| GGUF / Safetensors / MLX weights | Unknown | Not versioned / manual | format | [evidence 1](../README.md); [release source](https://huggingface.co/docs/safetensors/) |
| launchd / Keychain / Rosetta / APFS | Unknown | Not versioned / manual | format | [evidence 1](../README.md); [release source](https://support.apple.com/en-us/100100) |

## Service

| Technology | Recorded version (date) | Latest stable / channel | Result | Evidence and release source |
|---|---|---|---|---|
| GitHub / GitHub Pages / Actions | Unknown | Not versioned / manual | service | [evidence 1](../docs/08-council-of-ais-methodology.md); [release source](https://www.githubstatus.com/) |
| Replit | Unknown | Not versioned / manual | service | [evidence 1](../docs/08-council-of-ais-methodology.md); [release source](https://status.replit.com/) |
| Notion / cloud AI services | Unknown | Not versioned / manual | service | [evidence 1](../docs/08-council-of-ais-methodology.md); [release source](https://www.notion-status.com/) |

## Vendored

| Technology | Recorded version (date) | Latest stable / channel | Result | Evidence and release source |
|---|---|---|---|---|
| Vendored Agent Skills | Unknown | Not versioned / manual | vendored | [evidence 1](../.agents/skills/okhp3-as-is-process-capture/package.json); [evidence 2](../skills/okhp3-skill-promotion/SKILL.md) |

## Model

| Technology | Recorded version (date) | Latest stable / channel | Result | Evidence and release source |
|---|---|---|---|---|
| llama3.1:8b | 46e0c10c039e (2026-05-12) | Not versioned / manual | model | [evidence 1](../manifests/OLLAMA_MODEL_INVENTORY_2026-05-12.txt); [release source](https://ollama.com/library/llama3.1) |
| mistral-small3.1:24b | b9aaf0c2586a (2026-05-12) | Not versioned / manual | model | [evidence 1](../manifests/OLLAMA_MODEL_INVENTORY_2026-05-12.txt); [release source](https://ollama.com/library/mistral-small3.1) |
| codestral:22b | 0898a8b286d5 (2026-05-12) | Not versioned / manual | model | [evidence 1](../manifests/OLLAMA_MODEL_INVENTORY_2026-05-12.txt); [release source](https://ollama.com/library/codestral) |
| gemma3:27b | a418f5838eaf (2026-05-12) | Not versioned / manual | model | [evidence 1](../manifests/OLLAMA_MODEL_INVENTORY_2026-05-12.txt); [release source](https://ollama.com/library/gemma3) |
| gemma3:12b | f4031aab637d (2026-05-12) | Not versioned / manual | model | [evidence 1](../manifests/OLLAMA_MODEL_INVENTORY_2026-05-12.txt); [release source](https://ollama.com/library/gemma3) |
| phi4:14b | ac896e5b8b34 (2026-05-12) | Not versioned / manual | model | [evidence 1](../manifests/OLLAMA_MODEL_INVENTORY_2026-05-12.txt); [release source](https://ollama.com/library/phi4) |
| ministral-3:8b | Unknown | Not versioned / manual | model | [evidence 1](../mac-studio-setup/LOCAL_WORKBENCH_STATUS.md); [release source](https://ollama.com/library/ministral-3) |
| command-r7b:latest | Unknown | Not versioned / manual | model | [evidence 1](../mac-studio-setup/LOCAL_WORKBENCH_STATUS.md); [release source](https://ollama.com/library/command-r7b) |
| llama3.2:3b | Unknown | Not versioned / manual | model | [evidence 1](../mac-studio-setup/LOCAL_WORKBENCH_STATUS.md); [release source](https://ollama.com/library/llama3.2) |
| nomic-embed-text:latest | Unknown | Not versioned / manual | model | [evidence 1](../mac-studio-setup/LOCAL_WORKBENCH_STATUS.md); [release source](https://ollama.com/library/nomic-embed-text) |
| LM Studio / direct MLX model collection | Unknown | Not versioned / manual | model | [evidence 1](../manifests/LM_STUDIO_MODEL_INVENTORY_2026-05-12.txt); [evidence 2](../docs/04-model-inventory.md); [evidence 3](../reports/openclaw-related-runtime-readiness-audit-2026-08-02.md); [release source](https://huggingface.co/models) |

## Absent

| Technology | Recorded version (date) | Latest stable / channel | Result | Evidence and release source |
|---|---|---|---|---|
| TypeScript | Unknown | 7.0.2 | absent | [evidence 1](../AGENTS.md); [release source](https://registry.npmjs.org/typescript/latest) |
| Vite | Unknown | 8.3.0 | absent | [evidence 1](../AGENTS.md); [release source](https://registry.npmjs.org/vite/latest) |
| Tailwind CSS | Unknown | 4.3.3 | absent | [evidence 1](../AGENTS.md); [release source](https://registry.npmjs.org/tailwindcss/latest) |
| React | Unknown | 19.3.0 | absent | [evidence 1](../AGENTS.md); [release source](https://registry.npmjs.org/react/latest) |
| Java | Unknown | Not versioned / manual | absent | [evidence 1](../AGENTS.md) |

## Qualifications

- **macOS**: May record was 26.4.1. OS compatibility and the supported 26.x patch channel require a separate host check.
- **Git**: Stable Homebrew distribution channel; can lag upstream.
- **Python**: Host baseline. CI runtime is selected separately. Recheck versioned Homebrew formula before a major Python upgrade.
- **Node.js**: Latest LTS: 24.21.0
- **LM Studio**: LM Studio runtime extension versions are separate from the application version. Stable Homebrew distribution channel; can lag upstream.
- **MLX**: LM Studio's MLX engine label is not this framework's version. Stable Homebrew distribution channel; can lag upstream.
- **Open WebUI**: Pinned image recorded in September; supersedes May's floating latest.
- **Docker Desktop**: Stable Homebrew distribution channel; can lag upstream.
- **Docker Engine**: Docker Desktop controls its bundled engine. Do not independently replace it from a Linux engine release.
- **OpenClaw**: Stable npm distribution; numeric -2 is a packaging revision, not a beta.
- **SearXNG**: Installed tag is latest; exact installed digest unknown. The remote digest is a candidate, not a stable version. Rolling image; no numbered stable release. Tag last updated: 2026-09-18T15:29:40.754676Z
- **Qdrant**: Service presence confirmed in dated August/September reports. May diagram says 1.18.1 but no recent runtime version was captured; RAG remains unverified.
- **Visual Studio Code**: Stable Homebrew distribution channel; can lag upstream.
- **Continue VS Code extension**: Published Open VSX stable extension channel. Check VS Code Marketplace parity when installing.
- **Bash**: macOS system Bash is OS-managed; upstream/Homebrew Bash is a different install path. Stable Homebrew distribution channel; can lag upstream.
- **Zsh**: System shell updates follow macOS. Stable Homebrew distribution channel; can lag upstream.
- **Hugging Face Hub client**: Cache/authentication use is recorded; the installed distribution version was not captured.
- **tmux**: Stable Homebrew distribution channel; can lag upstream.
- **Microsoft Edge**: Stable Homebrew distribution channel; can lag upstream.
- **OneDrive**: Stable Homebrew distribution channel; can lag upstream.
- **GitHub Desktop**: Stable Homebrew distribution channel; can lag upstream.
- **Claude Desktop**: Stable Homebrew distribution channel; can lag upstream.
- **ChatGPT Desktop**: Stable Homebrew distribution channel; can lag upstream.
- **Codex Desktop**: Stable Homebrew distribution channel; can lag upstream.
- **Notion Desktop**: Stable Homebrew distribution channel; can lag upstream.
- **Perplexity**: Stable Homebrew distribution channel; can lag upstream.
- **Microsoft Office**: Stable Homebrew distribution channel; can lag upstream.
- **ada-url**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **bat**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **brotli**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **c-ares**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **ca-certificates**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **fd**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **fmt**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **fzf**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **gettext**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **hdrhistogram_c**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **icu4c@78**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **libgit2**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **libidn2**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **libnghttp2**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **libnghttp3**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **libngtcp2**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **libssh2**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **libunistring**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **libuv**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **llhttp**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **lz4**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **merve**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **mlx-c**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **mpdecimal**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **nbytes**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **oniguruma**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **openssl@3**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **pcre2**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **readline**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **ripgrep**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **simdjson**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **simdutf**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **sqlite**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **tree**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **uvwasi**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **wget**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **xz**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **yq**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **zstd**: Name recorded in May; installed version not captured. Stable Homebrew distribution channel; can lag upstream.
- **Mermaid**: No renderer is pinned in this repository. GitHub Markdown and editor previews choose their own renderer versions.
- **Mermaid public website renderer**: Read from the separate website repository. Updates and rendering tests belong there.
- **actions/checkout**: Workflow pin observed: 3d3c42e5aac5ba805825da76410c181273ba90b1. Dependabot maintains this reference. HTTPError: HTTP Error 403: rate limit exceeded
- **actions/setup-python**: Workflow pin observed: 5fda3b95a4ea91299a34e894583c3862153e4b97. Dependabot maintains this reference. HTTPError: HTTP Error 403: rate limit exceeded
- **actions/upload-artifact**: Workflow pin observed: 043fb46d1a93c77aae656e7c1c64a875d1fc6a0a. Dependabot maintains this reference. HTTPError: HTTP Error 403: rate limit exceeded
- **GitHub-hosted Ubuntu runner**: Runner image receives provider updates; OS line is explicit in the workflow.
- **Caddy**: HTTPError: HTTP Error 403: rate limit exceeded
- **JavaScript / ECMAScript**: Language support follows Node/browser. Vendored skill support includes .mjs files; no application JS in this repository.
- **Markdown / GFM**: Document format; GitHub owns the renderer. No parser dependency pinned here.
- **YAML**: Front matter and workflow format. No standalone YAML package pinned for this tracker.
- **JSON**: Data format, parsed with Python standard library.
- **Mermaid SVG output**: Diagram output format, renderer managed elsewhere.
- **MCP**: Protocol negotiation and each connector's version must be captured on the host; no connector SBOM is published.
- **GGUF / Safetensors / MLX weights**: Model artifact formats; capture file hash and quantization, not a generic latest package version.
- **launchd / Keychain / Rosetta / APFS**: OS-managed capabilities; update through macOS.
- **GitHub / GitHub Pages / Actions**: No user-controlled stable release number. Review provider changes and connector compatibility.
- **Replit**: No user-controlled stable release number. Review provider changes and connector compatibility.
- **Notion / cloud AI services**: No user-controlled stable release number. Review provider changes and connector compatibility.
- **TypeScript**: Mentions in vendored skills are guidance, not adoption by the workbench.
- **Vite**: Mentions in vendored skills are guidance, not adoption by the workbench.
- **Tailwind CSS**: Mentions in vendored skills are guidance, not adoption by the workbench.
- **React**: Mentions in vendored skills are guidance, not adoption by the workbench.
- **Java**: No source, runtime manifest or use found in project artifacts.
- **llama3.1:8b**: Intentional model selection. Pin digest and test memory/quality before replacing weights.
- **mistral-small3.1:24b**: Intentional model selection. Pin digest and test memory/quality before replacing weights.
- **codestral:22b**: Intentional model selection. Pin digest and test memory/quality before replacing weights.
- **gemma3:27b**: Intentional model selection. Pin digest and test memory/quality before replacing weights.
- **gemma3:12b**: Intentional model selection. Pin digest and test memory/quality before replacing weights.
- **phi4:14b**: Intentional model selection. Pin digest and test memory/quality before replacing weights.
- **ministral-3:8b**: Model present in September record; digest not captured. No automatic model-family upgrade.
- **command-r7b:latest**: Model present in September record; digest not captured. No automatic model-family upgrade.
- **llama3.2:3b**: Model present in September record; digest not captured. No automatic model-family upgrade.
- **nomic-embed-text:latest**: Model present in September record; digest not captured. No automatic model-family upgrade.
- **LM Studio / direct MLX model collection**: Includes Gemma 3/4 variants, Phi-4-mini, gpt-oss-20b and nomic embeddings. August endpoint reported 26 models but no complete immutable inventory. Model identities and quantizations require per-model capture, not semantic-version ordering.
- **Vendored Agent Skills**: Private @bp-skill packages record 0.1.0 and Node's built-in tests. Python support uses the standard library; package examples in SKILL.md are not application dependencies. Review promotion provenance and source diffs. No automatic edits to vendored skills.
