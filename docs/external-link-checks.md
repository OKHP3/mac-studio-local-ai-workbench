# External project link checks

The **Check external project links** GitHub Actions workflow audits static
external homepage links in `src/App.jsx` and public citations in the
Markdown documents selected by `src/docsCatalog.js` every Monday at 14:00 UTC.
It can also be started from Actions using **Run workflow**. Scheduled runs
require this workflow to be present on the repository's default branch.

This is an independent audit, not a deployment dependency. It does not run on
normal pushes or pull requests and cannot block a Pages deployment.

## Run locally

```bash
npm run test:links
npm run check:links
```

The first command uses mocked responses and no external requests. It is also
part of `npm run check`. The second command performs the live network audit.
It requires Node 20 or later and no extra dependencies or credentials.

## Results and policy

- The script discovers public HTTP and HTTPS `href` values in `src/App.jsx`, plus
  Markdown inline links, reference links, HTML anchor `href` values, and
  plain-text HTTPS URLs in catalog-selected documents only. Repeated
  destinations are checked once and their source file and line locations are
  listed in the report.
- Public HTTP citations are reported as **INSECURE** and are never requested;
  insecure citations fail the audit. Relative links, internal documentation
  routes, this project's shared Pages routes, private or local destinations,
  and links in Markdown code examples (including HTML shown in inline, fenced,
  or indented code) are not requested.
- Historical and dated records are audited as written. The checker never edits
  source documents or silently replaces old citations with current URLs.
- GET requests use a 15-second timeout. Successful 2xx responses are reachable.
- HTTPS links are checked; HTTPS redirects are followed explicitly, up to eight hops. Every destination
  and status is recorded. Permanent 301/308 moves are marked for review, while
  302/303/307 redirects are recorded as temporary. Source links are not changed
  automatically. Redirect loops, absent Location headers, insecure destinations,
  and credential-bearing destinations fail the audit.
- Network errors, timeouts, HTTP 408/425/429, and 5xx responses get up to three
  attempts. Exponential delays and Retry-After delays are bounded to ten seconds.
  Persistent temporary errors remain **TRANSIENT** warnings, not passing checks.
- HTTP 401/403 responses are **RESTRICTED** warnings requiring manual review.
  A bot-protection response is not enough evidence to call a link dead.
- Four important third-party destinations also have narrowly scoped expected
  page checks configured in `scripts/lib/external-links.mjs`: the workbench
  repository, its benchmark directory, the OverKill Hill home page, and the
  workbench project archive. These rules require the expected final host/path
  and small identifying text fragments in the HTML response. The checker reads
  at most 256 KiB and does not compare whole-page snapshots. A 2xx response
  with an unexpected destination, non-HTML content, or missing identifying text
  is **SUSPICIOUS**, not a confirmed HTTP failure.
- Other unsuccessful responses, including 404 and 410, are **BROKEN** results.
  Broken links fail only this independent audit. Invalid source configuration
  or a script error also fails explicitly.

Reports appear in the Actions job summary and in a downloadable artifact
retained for 30 days, even when broken links fail the job. Local Markdown and
JSON reports are written under `reports/external-link-checks/`, which is ignored
by Git. Check the final destination before updating any redirected source URL.

## Boundaries

The expected-content rules apply only to the four named third-party destinations.
Other HTTPS citations are checked for availability only. **INSECURE** HTTP
citations fail the audit without a network request. Suspicious content is
reported separately from confirmed **BROKEN** HTTPS failures and **TRANSIENT**
network or temporary HTTPS outages; these results remain warnings.
Bare HTTPS URLs in visible prose and HTML anchor destinations in
catalog-selected documents are checked. Bare HTTP URLs, links in uncataloged
documents, and analytics or social-image resources are not included. The
published documentation viewer and its uptime are outside this check.

Offline fixtures for the expected pages and a soft-error response are under
`tests/fixtures/external-links/`; `npm run test:links` exercises the rules
without contacting third-party sites.
