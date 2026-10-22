import assert from "node:assert/strict";
import { test } from "node:test";
import { resolvePagesURL } from "../scripts/resolve-pages-url.mjs";

const options = {
  repository: "owner/repo",
  token: "test-only",
  wait: async () => {},
};
const response = (html_url) => ({ ok: true, status: 200, json: async () => ({ html_url }) });

test("uses GitHub's actual Pages URL, including custom domain and subpath", async () => {
  const url = await resolvePagesURL({
    ...options,
    request: async (endpoint, config) => {
      assert.equal(endpoint, "https://api.github.com/repos/owner/repo/pages");
      assert.equal(config.headers.Authorization, "Bearer test-only");
      assert.ok(config.signal instanceof AbortSignal);
      return response("https://custom.example/workbench/");
    },
  });
  assert.equal(url, "https://custom.example/workbench/");
});

test("transient API failures retry with bounded delay and preserve status", async () => {
  const diagnostics = [];
  let calls = 0;
  const url = await resolvePagesURL({
    ...options,
    diagnostics,
    wait: async (delay) => assert.equal(delay, 5000),
    request: async () => ++calls < 3
      ? { ok: false, status: 503 }
      : response("https://owner.github.io/repo/"),
  });
  assert.equal(calls, 3);
  assert.equal(url, "https://owner.github.io/repo/");
  assert.deepEqual(diagnostics.filter(({ status }) => status), [
    { attempt: 1, status: 503 }, { attempt: 2, status: 503 }, { attempt: 3, status: 200 },
  ]);
});

test("missing, malformed, credential-bearing URLs and outages fail closed", async () => {
  for (const htmlURL of [undefined, "", "not a URL", "file:///tmp/site", "https://user:password@example.com/"]) {
    let calls = 0;
    await assert.rejects(resolvePagesURL({
      ...options,
      request: async () => { calls++; return response(htmlURL); },
    }), /after three attempts/);
    assert.equal(calls, 3);
  }
  const diagnostics = [];
  await assert.rejects(resolvePagesURL({
    ...options,
    diagnostics,
    request: async () => { throw new Error("request with confidential headers"); },
  }), /after three attempts/);
  assert.equal(diagnostics.length, 3);
  assert.doesNotMatch(JSON.stringify(diagnostics), /confidential|test-only/);
});

test("missing repository or token stops before any network request", async () => {
  for (const invalid of [{ repository: undefined }, { repository: "not/a/repo" }, { token: "" }]) {
    await assert.rejects(resolvePagesURL({
      ...options, ...invalid,
      request: async () => assert.fail("must not make a request"),
    }), /required/);
  }
});
