---
title: "Technology Version Management"
artifact_type: "maintenance_plan"
created_date: "2026-07-20"
updated_date: "2026-09-19"
project: "Mac Studio Local AI Workbench"
status: "implemented-in-repository"
---

# Technology version management

The workbench has a source-backed inventory, a stable-release checker, a Mac
version collector, weekly release monitoring, and Dependabot updates for its
GitHub Actions. These controls propose and track upgrades. They do not establish
that an upgrade has been installed on the Mac Studio.

## Inventory and scope

- [Complete inventory and comparison](../reports/technology-update-report.md)
- [Machine-readable inventory](../config/technology-inventory.json)
- [Release checker](../scripts/check_technology_updates.py)
- [Mac version collector](../scripts/capture_technology_versions.py)
- [Weekly workflow](../.github/workflows/technology-updates.yml)
- [Validation workflow](../.github/workflows/validate-technology-tracking.yml)
- [Dependabot configuration](../.github/dependabot.yml)

The September 19 UTC review covers 111 entries: documented host tools, every
entry in the current Homebrew install manifests and historical full formula
list, repository tooling, formats, cloud services, model identities, planned
technology and absent frameworks. This is a repository-evidence inventory, not
a complete software bill of materials of a running Mac or every container.

TypeScript, Vite, Tailwind and React are not application dependencies here.
Their upstream versions are reference-only entries. Python and Bash are used
by maintenance scripts. JavaScript modules also exist in vendored skill
support. Mermaid source is used throughout the documentation, but this
repository does not pin a renderer.

The public website belongs to OKHP3/OverKill-Hill. Its vendored Mermaid VERSION
was independently read through GitHub as 11.17.2 on this review. Updating that
renderer requires that repository's rendering, accessibility and publication
checks. Its HTML, CSS and browser JavaScript are a separate maintenance surface.

Vendored agent skills remain unchanged. Their private package manifests and
examples are support assets, not an application dependency graph. Unnamed VS
Code extensions, private MCP servers, LM Studio engine packages, other Python
environments and the unidentified helper container cannot be fully versioned
from public records. The collector captures installed extension identifiers;
private connector configuration stays private.

## Evidence and freshness

| Claim | Tier | Evidence | Consequence if wrong | Next check |
|---|---|---|---|---|
| Repository owns docs, scripts and maintenance automation | Confirmed | Tracked files and workflows | Wrong updater ecosystem | Repeat source scan when architecture changes |
| macOS 26.6 and OpenClaw 2026.7.1-2 recorded in August | Confirmed as dated record | [August audit](../reports/openclaw-related-runtime-readiness-audit-2026-08-02.md) | Wrong baseline | Run collector on Mac |
| Open WebUI v0.11.0 used in September | Confirmed as dated record | [September record](18-lan-exposure-fix-2026-09-12.md) | Wrong target | Capture image ID and digest |
| Qdrant running; integrated RAG unverified | Dated service evidence; integration unknown | August and September records | False readiness | Version plus ingestion/retrieval/citation test |
| Latest versions available from linked sources | Confirmed at report time | Per-row release sources | Wrong candidate | Rerun checker |
| Candidates installed now or mutually compatible | Unknown | No fresh Mac session | Failed inference or recovery | Host capture and smoke tests |
| Replit matches this checkout | Unknown | Connector required reauthentication | Wrong cross-host claim | Reauthenticate and inspect separately |

Read-only calls to three documented Mac service version endpoints could not
connect from the Windows audit session. Windows Python 3.14.0rc1 was used for
local checks and is not the Mac's installed version. The initial checkout was
clean and matched origin/main at dbaf517.

The old checker reused static latest values, looked up Homebrew as a formula,
used Git's nonexistent latest GitHub Release endpoint, compared strings for
inequality, counted unknown/planned items as upgrades and could suppress issue
failures. Those behaviors are replaced. Dated historical records are preserved.

## Automatic monitoring and updates

1. Every Monday at 14:17 UTC, or through Run workflow, query project release
   sources and published package metadata. No Mac access or private config.
2. Order numeric versions numerically. Exclude draft/prerelease GitHub releases,
   prerelease version strings and yanked PyPI versions. Check Continue's stable
   extension publication instead of trusting its latest alias. Show Node
   Current and LTS separately.
3. Homebrew rows mean stable versions in the named distribution channel, which
   may lag upstream. Versioned formulae remain on their named major line.
   Cask build suffixes are separate from application versions. Availability
   does not establish Apple Silicon compatibility.
4. SearXNG is a rolling image. Record the remote manifest digest for review.
   Never pull it or assume the installed latest tag is current.
5. Save Markdown/JSON reports as 90-day workflow artifacts and a job summary.
   Reuse one issue, including an old bot-created issue. Unchanged findings
   produce no edit. Leave old duplicate issues untouched.
6. Preserve failed lookups as unknown and fail the run after saving the report.
   Never display a cached release as a fresh success. Issue API failures also
   fail the run.
7. Dependabot opens weekly PRs updating the immutable GitHub Action pins.
   Validation checks inventory coverage and behavioral tests on those PRs.
   Maintainers merge passing updates; major upgrades are not auto-merged.

Repository contents are read-only to the monitor; only issues are writable.
Reports are no longer pushed directly to main. The committed report is the
reviewed audit snapshot. The newest scheduled evidence lives in Actions.

These controls activate after merge to the default branch. Run the workflow
once after merging and verify its artifact and single review issue. GitHub
also permits a manual validation run on a branch: disable the update_issue
input to query releases and save artifacts without changing an issue. GitHub
schedules can be delayed and public schedules may be disabled after 60 days of
inactivity. Check the last successful run during monthly maintenance and
re-enable when necessary. This is monitoring, not an exact-time guarantee.

## Capture actual installed versions

On the target Mac Studio, from this repository:

~~~bash
python3 scripts/capture_technology_versions.py
~~~

The default ignored output is .tmp/mac-studio-versions.json. It contains
allowlisted versions, Homebrew packages, selected Python distribution metadata,
extension IDs and image digests. It excludes environment variables, tokens, raw
Docker configuration, logs, model content and personal host identity. Null
means unavailable, not absent.

Review before publication. Inspect dedicated Python environments separately.
Capture LM Studio runtime/engine versions in its runtime manager and exact MCP
server package IDs in private records. Keep model digests, quantizations,
memory and disk headroom in the private maintenance checkpoint.

After verifying a version, update its recorded value, recorded_date and dated
evidence file in the inventory. Never substitute a newly observed upstream
release for an installed version.

Run monitoring anywhere Python 3.10+ is available:

~~~bash
python3 scripts/check_technology_updates.py --validate-only
python3 -m unittest discover -s tests -v
python3 scripts/check_technology_updates.py --output-dir .tmp/technology-report
~~~

On Windows use py -3 instead of python3. No third-party Python dependencies.
The ordinary command has no GitHub write effects. The --issue option requires
GH_TOKEN and GITHUB_REPOSITORY and is used by the scheduled workflow. Lookup
failure exits 1 after reports are saved.

## Upgrade and adoption plan

| Component | Update path | Acceptance and rollback |
|---|---|---|
| GitHub Actions | Merge tested Dependabot PRs | Validation passes; revert workflow change if needed |
| Homebrew utilities | Review brew outdated --json=v2; upgrade named packages | Command and dependency checks; preserve baseline and reinstall path |
| macOS | Compatible release in Software Update, including supported patch-only options | Off-machine backup and recovery plan; verify services and storage |
| Ollama / MLX / mlx-lm | One runtime in its existing channel/environment | Preserve paths/models; strict benchmark and memory checks; restore prior environment |
| Node / npm / pnpm / OpenClaw | Review engine requirements and migrations as a group | Back up private config; verify Keychain, sandbox, health, doctor, security audit and agent smoke test |
| Docker Desktop / Engine | Supported Desktop update; engine follows its bundle | Verify daemon, mounts, restart policies, health; recoverable Desktop/data checkpoint |
| WebUI / Qdrant / SearXNG | Back up data/settings; record old and target image digests | Login, inference, search and RAG checks; restore compatible data plus old image if migration blocks downgrade |
| LM Studio / Continue / desktop tools | Stable application/extension update channel | Paths, API response and editor completion; known-good installer/settings |
| Models | Intentional one-model change with immutable digest | 36 GB memory ceiling, disk headroom, role benchmark |
| Caddy / future RAG | Planned until implemented | Deployment configuration and acceptance evidence required |

For each host maintenance session:

1. Capture installed state, compare releases and choose compatible targets.
   A new major is a migration decision.
2. Verify an off-machine backup and rollback path. Preserve storage locations,
   service bindings, restart policies and private configuration.
3. Apply one component or necessary compatibility group. Blanket Homebrew,
   global npm and unattended container upgrades are not the policy.
4. Run the checks above, including model visibility and cold/warm inference.
   RAG requires a disposable document through ingestion, retrieval and citation.
5. Record installed versions and results. Resolve a finding only after
   acceptance. On failure restore the checkpoint and record the deferral.

The root shell restore/verification scripts have a documented CRLF problem in
this checkout. Normalize and syntax-check them in a scoped maintenance change
before relying on them on the Mac. This audit did not run restore scripts or
upgrade host software.

If application dependencies are introduced, add real manifests and lockfiles,
tests and the corresponding Dependabot ecosystem. Inventory validation detects
new Homebrew entries missing from tracking. New runtime packages, containers
and frameworks still require explicit inventory review.

## Source ledger and next action

Each inventory entry has local evidence, source title, publisher, endpoint and
scope. Reports carry a UTC retrieval timestamp and per-row source links.
Authorities are project-owned releases, Apple Support, Python.org, Node.js,
published npm/PyPI/Open VSX metadata and Homebrew stable manifests.

Policy references checked 2026-09-19 UTC:

- [GitHub Dependabot action updates](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/auto-update-actions): automatic action-version PRs.
- [GitHub scheduled events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows): default-branch scheduling and delays.
- [GitHub workflow enablement](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/disable-and-enable-workflows): 60-day inactivity limitation.
- [SearXNG container installation](https://docs.searxng.org/admin/installation-docker.html): published image channels and configuration review.

Next operational action: run the read-only collector on the Mac Studio and
reconcile unknown installed versions before treating the report as a verified
current-host upgrade list.
