const redirectStatuses = new Set([301, 302, 303, 307, 308]);
const temporaryStatuses = new Set([408, 425, 429]);

export function extractExternalLinks(source) {
  const links = [...source.matchAll(/\bhref\s*=\s*["'](https?:\/\/[^"']+)["']/g)]
    .map((match) => match[1]);
  if (!links.length) throw new Error("No external href literals found in src/App.jsx.");
  return [...new Set(links)].sort();
}

function validateUrl(value) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new Error("Only credential-free HTTPS destinations are permitted.");
  }
  return url.href;
}

function retryDelay(response, attempt) {
  const value = response?.headers.get("retry-after");
  if (value) {
    const seconds = Number(value);
    const milliseconds = Number.isFinite(seconds) ? seconds * 1000 : Date.parse(value) - Date.now();
    if (Number.isFinite(milliseconds)) return Math.min(10_000, Math.max(0, milliseconds));
  }
  return Math.min(10_000, 1000 * 2 ** (attempt - 1));
}

export async function checkExternalUrl(originalUrl, {
  fetchImpl = fetch,
  sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)),
  timeoutMs = 15_000,
  maxAttempts = 3,
  maxRedirects = 8,
} = {}) {
  if (maxAttempts < 1 || timeoutMs < 1 || maxRedirects < 0) {
    throw new Error("Invalid link-check limits.");
  }
  let lastResult;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let currentUrl = originalUrl;
    let response;
    const redirects = [];
    const visited = new Set();
    const result = (outcome, detail) => ({
      url: originalUrl, finalUrl: currentUrl, outcome, detail, attempts: attempt,
      status: response?.status ?? null, redirects,
    });
    try {
      currentUrl = validateUrl(currentUrl);
    } catch (error) {
      return result("broken", error.message);
    }
    try {
      while (true) {
        if (visited.has(currentUrl)) return result("broken", "Redirect loop detected.");
        visited.add(currentUrl);
        response = undefined;
        response = await fetchImpl(currentUrl, {
          method: "GET",
          redirect: "manual",
          signal: AbortSignal.timeout(timeoutMs),
          headers: {
            "User-Agent": "Workbench-Link-Audit/1.0",
            Accept: "text/html,application/xhtml+xml,*/*;q=0.8",
          },
        });
        // Availability is determined by response headers; don't download whole pages.
        await response.body?.cancel().catch(() => {});
        if (redirectStatuses.has(response.status)) {
          const location = response.headers.get("location");
          if (!location) return result("broken", "Redirect response is missing Location.");
          if (redirects.length >= maxRedirects) return result("broken", "Redirect limit exceeded.");
          let destination;
          try {
            destination = validateUrl(new URL(location, currentUrl).href);
          } catch (error) {
            return result("broken", `Invalid redirect destination: ${error.message}`);
          }
          redirects.push({
            from: currentUrl, to: destination, status: response.status,
            permanent: response.status === 301 || response.status === 308,
          });
          currentUrl = destination;
          continue;
        }
        if (response.status >= 200 && response.status < 300) {
          return result("ok", redirects.length
            ? "Reachable through redirects. Review permanent moves before updating source links."
            : "Reachable.");
        }
        if (response.status === 401 || response.status === 403) {
          return result("restricted", "Access denied. Verify manually; this is not proof of a dead page.");
        }
        if (temporaryStatuses.has(response.status) || response.status >= 500) {
          lastResult = result("transient", `Temporary HTTP ${response.status}; availability is unconfirmed.`);
          break;
        }
        return result("broken", `Permanent or unexpected HTTP ${response.status}.`);
      }
    } catch (error) {
      lastResult = result("transient", `${error.name}: ${error.message}; availability is unconfirmed.`);
    }
    if (attempt < maxAttempts) await sleep(retryDelay(response, attempt));
  }
  return lastResult;
}

export function summarizeResults(results) {
  return {
    checked: results.length,
    reachable: results.filter((result) => result.outcome === "ok").length,
    broken: results.filter((result) => result.outcome === "broken").length,
    transient: results.filter((result) => result.outcome === "transient").length,
    restricted: results.filter((result) => result.outcome === "restricted").length,
    redirected: results.filter((result) => result.redirects.length > 0).length,
  };
}

const cell = (value) => String(value).replaceAll("|", "\\|").replace(/[\r\n]+/g, " ");

export function formatReport(results, checkedAt) {
  const summary = summarizeResults(results);
  const rows = results.map((result) =>
    `| ${cell(result.url)} | ${result.outcome.toUpperCase()} | ${result.status ?? "network error"} | ${result.attempts} | ${cell(result.finalUrl)} | ${cell(result.detail)} |`,
  );
  const redirects = results.flatMap((result) => result.redirects.map((redirect) =>
    `- ${cell(redirect.from)} → ${cell(redirect.to)} (${redirect.status}, ${redirect.permanent ? "permanent move" : "temporary redirect"})`,
  ));
  return [
    "# External project link audit", "", `Checked at: ${checkedAt}`, "",
    `Checked ${summary.checked}; reachable ${summary.reachable}; broken ${summary.broken}; transient ${summary.transient}; restricted ${summary.restricted}; redirected ${summary.redirected}.`,
    "", "Only confirmed broken links fail this audit. Transient and restricted results are warnings, not successful availability checks.",
    "", "| Source URL | Result | HTTP | Attempts | Final destination | Detail |",
    "| --- | --- | --- | --- | --- | --- |", ...rows,
    "", "## Redirects", "", ...(redirects.length ? redirects : ["None."]), "",
  ].join("\n");
}
