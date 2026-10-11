import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  checkExternalUrl,
  extractCatalogDocumentFiles,
  extractExternalLinkOccurrences,
  extractExternalLinks,
  extractMarkdownExternalLinks,
  formatReport,
  summarizeResults,
} from "../scripts/lib/external-links.mjs";

const url = "https://example.com/project";
const response = (status, headers = {}) => new Response(null, { status, headers });
const noWait = async () => {};

function checker(sequence, options = {}) {
  const requests = [];
  return {
    requests,
    run: () => checkExternalUrl(url, {
      sleep: noWait,
      fetchImpl: async (destination, init) => {
        requests.push({ destination, ...init });
        const next = sequence.shift();
        assert.ok(next, "Unexpected request");
        if (next instanceof Error) throw next;
        return next;
      },
      ...options,
    }),
  };
}

test("extracts actual homepage links and deduplicates repeated repository anchors", async () => {
  const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  assert.deepEqual(extractExternalLinks(source), [
    "https://github.com/OKHP3/mac-studio-local-ai-workbench",
    "https://github.com/OKHP3/mac-studio-local-ai-workbench/tree/main/benchmarks",
    "https://overkillhill.com",
    "https://overkillhill.com/projects/mac-studio-local-ai-workbench/",
  ]);
  assert.throws(() => extractExternalLinks('<a href="#top">Home</a>'), /No external/);
});

test("discovers only the documents selected by the public catalog", async () => {
  const catalogSource = await readFile(new URL("../src/docsCatalog.js", import.meta.url), "utf8");
  const files = extractCatalogDocumentFiles(catalogSource);
  assert.ok(files.length > 0);
  for (const file of files) {
    assert.match(file, /^[^/\\]+\.md$/);
    await readFile(new URL(`../docs/${file}`, import.meta.url), "utf8");
  }
  assert.throws(() => extractCatalogDocumentFiles("const publicDocuments = [];"), /Every public document/);
});

test("extracts inline and reference Markdown links, deduplicates them, and reports citation lines", () => {
  const source = [
    '[Inline](https://example.org/a_(b) "title")',
    "See [Guide][official] and [official] again.",
    '[official]: <https://docs.example.org/reference> "Official guide"',
    "Code: `[not a link](https://ignored.example.org)`",
    "    [also ignored](https://ignored.example.org)",
    "```md",
    "[fenced](https://ignored.example.org)",
    "```",
    "[local](https://localhost/private) and [private IP](https://192.168.1.4/)",
    "[internal](../docs/project-overview)",
    "[published app route](https://overkillhill.com/projects/mac-studio-local-ai-workbench/#/docs/project-overview)",
  ].join("\n");
  assert.deepEqual(extractMarkdownExternalLinks(source, "docs/example.md"), [
    {
      url: "https://docs.example.org/reference",
      locations: [
        { file: "docs/example.md", line: 2 },
        { file: "docs/example.md", line: 3 },
      ],
    },
    {
      url: "https://example.org/a_(b)",
      locations: [{ file: "docs/example.md", line: 1 }],
    },
  ]);
});

test("ignores non-public HTTPS destinations in homepage links and direct checks", async () => {
  const source = '<a href="https://example.org">public</a><a href="https://127.0.0.1">local</a>';
  assert.deepEqual(extractExternalLinkOccurrences(source, "src/App.jsx"), [
    { url: "https://example.org", location: { file: "src/App.jsx", line: 1 } },
  ]);
  let requested = false;
  const result = await checkExternalUrl("https://10.0.0.1/private", {
    fetchImpl: async () => { requested = true; return response(200); },
  });
  assert.equal(result.outcome, "broken");
  assert.equal(requested, false);
});

test("successful links use bounded GET requests without automatic redirects", async () => {
  const fixture = checker([response(200)]);
  const result = await fixture.run();
  assert.equal(result.outcome, "ok");
  assert.equal(result.attempts, 1);
  assert.equal(fixture.requests[0].method, "GET");
  assert.equal(fixture.requests[0].redirect, "manual");
  assert.ok(fixture.requests[0].signal instanceof AbortSignal);
});

test("follows relative and cross-host HTTPS redirects with permanent/temporary provenance", async () => {
  const fixture = checker([
    response(301, { location: "/moved" }),
    response(302, { location: "https://archive.example.org/final" }),
    response(200),
  ]);
  const result = await fixture.run();
  assert.equal(result.outcome, "ok");
  assert.equal(result.finalUrl, "https://archive.example.org/final");
  assert.deepEqual(result.redirects.map((entry) => entry.permanent), [true, false]);
  assert.equal(fixture.requests[1].destination, "https://example.com/moved");
});

for (const status of [404, 410, 400]) {
  test(`HTTP ${status} is a permanent failure and is not retried`, async () => {
    const result = await checker([response(status)]).run();
    assert.equal(result.outcome, "broken");
    assert.equal(result.attempts, 1);
    assert.equal(summarizeResults([result]).broken, 1);
  });
}

for (const status of [408, 425, 429, 500, 503]) {
  test(`HTTP ${status} retries but stays a warning if the outage persists`, async () => {
    const fixture = checker([response(status), response(status), response(status)]);
    const result = await fixture.run();
    assert.equal(result.outcome, "transient");
    assert.equal(result.attempts, 3);
    assert.equal(summarizeResults([result]).broken, 0);
  });
}

test("temporary failure can recover on retry", async () => {
  const result = await checker([response(503), response(200)]).run();
  assert.equal(result.outcome, "ok");
  assert.equal(result.attempts, 2);
});

test("network and timeout failures retry without inventing a successful availability result", async () => {
  const timeout = new Error("Timed out");
  timeout.name = "TimeoutError";
  const result = await checker([new TypeError("DNS failed"), timeout, timeout]).run();
  assert.equal(result.outcome, "transient");
  assert.equal(result.status, null);
  assert.match(result.detail, /TimeoutError/);
});

test("a network failure after a redirect does not retain a misleading HTTP status", async () => {
  const fixture = checker([response(301, { location: "/moved" }), new TypeError("DNS failed")], { maxAttempts: 1 });
  const result = await fixture.run();
  assert.equal(result.outcome, "transient");
  assert.equal(result.status, null);
  assert.equal(result.finalUrl, "https://example.com/moved");
  assert.equal(result.redirects.length, 1);
});

test("Retry-After is honored but bounded", async () => {
  const waits = [];
  const fixture = checker([
    response(429, { "retry-after": "999999" }), response(200),
  ], { sleep: async (milliseconds) => waits.push(milliseconds) });
  await fixture.run();
  assert.deepEqual(waits, [10_000]);
});

for (const status of [401, 403]) {
  test(`HTTP ${status} is reported as restricted, not silently passed or marked dead`, async () => {
    const result = await checker([response(status)]).run();
    assert.equal(result.outcome, "restricted");
    assert.equal(summarizeResults([result]).restricted, 1);
    assert.equal(summarizeResults([result]).reachable, 0);
  });
}

test("rejects missing redirect targets, loops, insecure destinations, credentials, and excess hops", async () => {
  const sequences = [
    [response(302)],
    [response(302, { location: url })],
    [response(302, { location: "http://example.com/insecure" })],
    [response(302, { location: "https://user:password@example.com/private" })],
  ];
  for (const sequence of sequences) assert.equal((await checker(sequence).run()).outcome, "broken");
  assert.equal((await checker([response(302, { location: "/too-far" })], { maxRedirects: 0 }).run()).outcome, "broken");
});

test("a redirect to a deleted page fails with the final destination intact", async () => {
  const result = await checker([response(308, { location: "/deleted" }), response(404)]).run();
  assert.equal(result.outcome, "broken");
  assert.equal(result.finalUrl, "https://example.com/deleted");
  assert.equal(result.redirects[0].permanent, true);
});

test("reports retain warnings, failed destinations, attempt counts, and redirect details", async () => {
  const result = await checker([response(301, { location: "/gone" }), response(410)]).run();
  result.locations = [{ file: "docs/source.md", line: 12 }];
  const report = formatReport([result], "2026-09-26T00:00:00.000Z");
  assert.match(report, /BROKEN/);
  assert.match(report, /permanent move/);
  assert.match(report, /https:\/\/example.com\/gone/);
  assert.match(report, /docs\/source\.md:12/);
  assert.match(report, /transient 0/);
});

test("the live audit is a scheduled/manual workflow, not a deployment or push dependency", async () => {
  const workflow = await readFile(new URL("../.github/workflows/check-external-links.yml", import.meta.url), "utf8");
  assert.match(workflow, /schedule:\s*\n\s*- cron: "0 14 \* \* 1"/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.doesNotMatch(workflow, /^\s*(push|pull_request|workflow_run|workflow_call|needs):/m);
  assert.match(workflow, /contents: read/);
  assert.match(workflow, /if: always\(\)/);
  assert.match(workflow, /npm run check:links/);
});
