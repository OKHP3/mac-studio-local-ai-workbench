import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  checkExternalUrl,
  EXPECTED_CONTENT_RULES,
  extractCatalogDocumentFiles,
  extractExternalLinkOccurrences,
  extractExternalLinks,
  extractMarkdownExternalLinks,
  formatReport,
  summarizeResults,
} from "../scripts/lib/external-links.mjs";

const url = "https://example.com/project";
const response = (status, headers = {}) => new Response(null, { status, headers });
const htmlResponse = (body, headers = {}) => new Response(body, {
  status: 200,
  headers: { "content-type": "text/html; charset=utf-8", ...headers },
});
const noWait = async () => {};
const readFixture = (name) => readFile(
  new URL(`./fixtures/external-links/${name}.html`, import.meta.url),
  "utf8",
);

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

test("extracts public HTTP homepage anchors for insecure reporting but ignores local HTTP links", () => {
  const source = [
    '<a href="http://example.org/source">Insecure citation</a>',
    '<a href="http://localhost/private">Local</a>',
    '<a href="https://example.org/secure">Secure citation</a>',
  ].join("\n");
  assert.deepEqual(extractExternalLinkOccurrences(source, "src/App.jsx"), [
    { url: "http://example.org/source", location: { file: "src/App.jsx", line: 1 } },
    { url: "https://example.org/secure", location: { file: "src/App.jsx", line: 3 } },
  ]);
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
    "[Insecure inline](http://example.org/old-source)",
    "See [Guide][official] and [official] again.",
    '[official]: <https://docs.example.org/reference> "Official guide"',
    "See [Old source][old].",
    "[old]: http://archive.example.org/old-source",
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
      url: "http://archive.example.org/old-source",
      locations: [
        { file: "docs/example.md", line: 5 },
        { file: "docs/example.md", line: 6 },
      ],
    },
    {
      url: "http://example.org/old-source",
      locations: [{ file: "docs/example.md", line: 2 }],
    },
    {
      url: "https://docs.example.org/reference",
      locations: [
        { file: "docs/example.md", line: 3 },
        { file: "docs/example.md", line: 4 },
      ],
    },
    {
      url: "https://example.org/a_(b)",
      locations: [{ file: "docs/example.md", line: 1 }],
    },
  ]);
});

test("extracts plain-text and HTML HTTPS citations and excludes code, private URLs, and shared routes", () => {
  const source = [
    "Source: https://example.org/research/report.",
    "[Linked too](https://example.org/research/report)",
    "Another source: (https://docs.example.net/guide_(part-1)).",
    "`https://ignored.example.org/inline-code`",
    "```text",
    "https://ignored.example.org/fenced-code",
    "```",
    "    https://ignored.example.org/indented-code",
    "https://localhost/private and https://192.168.1.4/private",
    "https://overkillhill.com/projects/mac-studio-local-ai-workbench/#/docs/project-overview",
    "HTTP is not part of bare HTTPS detection: http://example.org/old-source",
    '<a href="https://html.example.org/source">HTML attribute</a>',
  ].join("\n");

  assert.deepEqual(extractMarkdownExternalLinks(source, "docs/example.md"), [
    {
      url: "https://docs.example.net/guide_(part-1)",
      locations: [{ file: "docs/example.md", line: 3 }],
    },
    {
      url: "https://example.org/research/report",
      locations: [
        { file: "docs/example.md", line: 1 },
        { file: "docs/example.md", line: 2 },
      ],
    },
    {
      url: "https://html.example.org/source",
      locations: [{ file: "docs/example.md", line: 12 }],
    },
  ]);
});

test("extracts public HTML anchor citations, handles multiline attributes, deduplicates, and ignores code", () => {
  const source = [
    "[Markdown citation](https://example.org/source)",
    '<a class="source" href="https://example.org/source">HTML duplicate</a>',
    "<a",
    "  rel='external' href='https://docs.example.net/reference'>Reference</a>",
    '<a title="the text href=\'https://fake.example.org/\'" href=https://archive.example.org/item>Archive</a>',
    '<img href="https://ignored.example.org/not-an-anchor">',
    '<a href="https://localhost/private">Local</a>',
    '<a href="https://192.168.1.4/private">Private IP</a>',
    '<a href="https://overkillhill.com/projects/mac-studio-local-ai-workbench/#/docs/project-overview">Internal route</a>',
    '<!-- <a href="https://ignored.example.org/comment">commented out</a> [also ignored](https://ignored.example.org/markdown-comment) -->',
    "<!--",
    '<a href="https://ignored.example.org/multiline-comment">commented out</a>',
    "-->",
    'Inline sample: `<a href="https://ignored.example.org/inline">not a citation</a>`',
    "```html",
    '<a href="https://ignored.example.org/fenced">not a citation</a>',
    "```",
    "    <a href=\"https://ignored.example.org/indented\">not a citation</a>",
  ].join("\n");

  assert.deepEqual(extractMarkdownExternalLinks(source, "docs/example.md"), [
    {
      url: "https://archive.example.org/item",
      locations: [{ file: "docs/example.md", line: 5 }],
    },
    {
      url: "https://docs.example.net/reference",
      locations: [{ file: "docs/example.md", line: 4 }],
    },
    {
      url: "https://example.org/source",
      locations: [
        { file: "docs/example.md", line: 1 },
        { file: "docs/example.md", line: 2 },
      ],
    },
  ]);
});

test("HTML HTTP citations are reported as insecure and are not requested", async () => {
  const [citation] = extractMarkdownExternalLinks(
    '<a href="http://example.org/old-source">Old source</a>',
    "docs/example.md",
  );
  let requested = false;
  const result = await checkExternalUrl(citation.url, {
    fetchImpl: async () => { requested = true; return response(200); },
  });
  assert.equal(citation.url, "http://example.org/old-source");
  assert.deepEqual(citation.locations, [{ file: "docs/example.md", line: 1 }]);
  assert.equal(result.outcome, "insecure");
  assert.equal(requested, false);
});

test("public HTTP URLs are reported as insecure without making a request", async () => {
  let requested = false;
  const result = await checkExternalUrl("http://example.org/old-source", {
    fetchImpl: async () => { requested = true; return response(200); },
  });
  assert.equal(result.outcome, "insecure");
  assert.equal(result.attempts, 0);
  assert.equal(result.status, null);
  assert.match(result.detail, /was not requested/);
  assert.equal(requested, false);
  assert.deepEqual(summarizeResults([result]), {
    checked: 1, reachable: 0, suspicious: 0, insecure: 1, broken: 0,
    transient: 0, restricted: 0, redirected: 0,
  });
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

test("expected-content rules are explicit and limited to the four homepage destinations", () => {
  assert.deepEqual(EXPECTED_CONTENT_RULES.map((rule) => rule.url), [
    "https://github.com/OKHP3/mac-studio-local-ai-workbench",
    "https://github.com/OKHP3/mac-studio-local-ai-workbench/tree/main/benchmarks",
    "https://overkillhill.com",
    "https://overkillhill.com/projects/mac-studio-local-ai-workbench/",
  ]);
  assert.ok(EXPECTED_CONTENT_RULES.every((rule) =>
    rule.expectedText.length > 0 && rule.allowedFinalDestinations.length > 0,
  ));
});

test("configured destinations pass when the expected page content is present", async () => {
  const fixtures = ["repository", "benchmarks", "brand", "project-archive"];
  for (const [index, rule] of EXPECTED_CONTENT_RULES.entries()) {
    const destination = new URL(rule.url);
    const body = await readFixture(fixtures[index]);
    const result = await checkExternalUrl(rule.url, {
      fetchImpl: async () => htmlResponse(body),
      sleep: noWait,
    });
    assert.equal(result.outcome, "ok", rule.url);
    assert.match(result.detail, /expected page content found/);
    assert.equal(result.finalUrl, destination.href);
  }
});

test("a successful soft-error page is suspicious, not reachable or broken", async () => {
  const rule = {
    url,
    allowedFinalDestinations: [{ hostname: "example.com", pathname: "/project" }],
    expectedText: ["Expected Project"],
  };
  const result = await checkExternalUrl(url, {
    fetchImpl: async () => htmlResponse(await readFixture("soft-error")),
    expectedContentRules: [rule],
    sleep: noWait,
  });
  assert.equal(result.outcome, "suspicious");
  assert.match(result.detail, /Expected Project/);
  assert.deepEqual(summarizeResults([result]), {
    checked: 1, reachable: 0, suspicious: 1, insecure: 0, broken: 0,
    transient: 0, restricted: 0, redirected: 0,
  });
});

test("an unrelated redirect destination is suspicious even if the final page looks valid", async () => {
  const rule = {
    url,
    allowedFinalDestinations: [{ hostname: "example.com", pathname: "/project" }],
    expectedText: ["Expected Project"],
  };
  const result = await checkExternalUrl(url, {
    fetchImpl: async (destination) => destination === url
      ? response(302, { location: "https://other.example.org/" })
      : htmlResponse(await readFixture("project-archive")),
    expectedContentRules: [rule],
    sleep: noWait,
  });
  assert.equal(result.outcome, "suspicious");
  assert.equal(result.finalUrl, "https://other.example.org/");
  assert.match(result.detail, /unexpected destination/);
});

test("content rules require HTML but do not change unconfigured availability checks", async () => {
  const rule = {
    url,
    allowedFinalDestinations: [{ hostname: "example.com", pathname: "/project" }],
    expectedText: ["Expected Project"],
  };
  const configured = await checkExternalUrl(url, {
    fetchImpl: async () => new Response("Expected Project", { status: 200, headers: { "content-type": "text/plain" } }),
    expectedContentRules: [rule],
    sleep: noWait,
  });
  const unconfigured = await checkExternalUrl(url, {
    fetchImpl: async () => new Response("no HTML here", { status: 200, headers: { "content-type": "text/plain" } }),
    expectedContentRules: [],
    sleep: noWait,
  });
  assert.equal(configured.outcome, "suspicious");
  assert.match(configured.detail, /Expected HTML/);
  assert.equal(unconfigured.outcome, "ok");
});

test("content rules never turn temporary network outages into suspicious page results", async () => {
  const rule = {
    url,
    allowedFinalDestinations: [{ hostname: "example.com", pathname: "/project" }],
    expectedText: ["Expected Project"],
  };
  const result = await checkExternalUrl(url, {
    fetchImpl: async () => response(503),
    expectedContentRules: [rule],
    maxAttempts: 1,
    sleep: noWait,
  });
  assert.equal(result.outcome, "transient");
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

test("reports insecure citations, suspicious content, HTTP failures, and outages distinctly", () => {
  const suspicious = {
    url, finalUrl: url, outcome: "suspicious", detail: "Expected page content was not found.",
    attempts: 1, status: 200, redirects: [], locations: [],
  };
  const insecure = {
    url: "http://example.org/source", finalUrl: "http://example.org/source",
    outcome: "insecure", detail: "Unencrypted HTTP URL was not requested.",
    attempts: 0, status: null, redirects: [], locations: [],
  };
  const report = formatReport([suspicious, insecure], "2026-09-26T00:00:00.000Z");
  assert.match(report, /reachable 0; insecure 1; suspicious 1; broken 0; transient 0/);
  assert.match(report, /SUSPICIOUS/);
  assert.match(report, /INSECURE/);
  assert.match(report, /HTTP destinations are reported without being requested/);
  assert.match(report, /\| INSECURE \| not requested \| 0 \|/);
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
