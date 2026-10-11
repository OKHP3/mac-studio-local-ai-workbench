import { isIP } from "node:net";

const redirectStatuses = new Set([301, 302, 303, 307, 308]);
const temporaryStatuses = new Set([408, 425, 429]);

function isPublicHttpsUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" || url.username || url.password) return false;

  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "").replace(/\.$/, "");
  if (!hostname || hostname === "localhost" || hostname.endsWith(".localhost")
    || hostname.endsWith(".local") || hostname.endsWith(".internal")) return false;
  const ipVersion = isIP(hostname);
  if (ipVersion === 4) {
    const octets = hostname.split(".").map(Number);
    const [a, b, c] = octets;
    if (a === 0 || a === 10 || a === 127 || a >= 224
      || (a === 100 && b >= 64 && b <= 127)
      || (a === 169 && b === 254)
      || (a === 172 && b >= 16 && b <= 31)
      || (a === 192 && (b === 168 || (b === 0 && c === 0) || (b === 0 && c === 2)))
      || (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100)))
      || (a === 203 && b === 0 && c === 113)) return false;
  } else if (ipVersion === 6) {
    if (hostname === "::" || hostname === "::1" || hostname.startsWith("fc")
      || hostname.startsWith("fd") || hostname.startsWith("fe8")
      || hostname.startsWith("fe9") || hostname.startsWith("fea")
      || hostname.startsWith("feb") || hostname.startsWith("ff")
      || hostname.startsWith("::ffff:")) return false;
  } else if (!hostname.includes(".")) {
    return false;
  }
  return true;
}

function isSharedProjectPage(value) {
  const url = new URL(value);
  const projectPath = "/projects/mac-studio-local-ai-workbench";
  return url.hostname === "overkillhill.com"
    && (url.pathname === projectPath || url.pathname.startsWith(`${projectPath}/`));
}

function isPublicMarkdownCitation(value) {
  return isPublicHttpsUrl(value) && !isSharedProjectPage(value);
}

function locationsForHrefSource(source, file) {
  return [...source.matchAll(/\bhref\s*=\s*["'](https?:\/\/[^"']+)["']/g)]
    .filter((match) => isPublicHttpsUrl(match[1]))
    .map((match) => ({
      url: match[1],
      location: { file, line: source.slice(0, match.index).split("\n").length },
    }));
}

export function extractExternalLinkOccurrences(source, file) {
  return locationsForHrefSource(source, file);
}

export function extractExternalLinks(source) {
  const links = locationsForHrefSource(source, "src/App.jsx").map(({ url }) => url);
  if (!links.length) throw new Error("No external href literals found in src/App.jsx.");
  return [...new Set(links)].sort();
}

function findOpeningBracket(line, closeIndex) {
  let depth = 0;
  for (let index = closeIndex; index >= 0; index--) {
    if (line[index] === "\\") {
      index--;
    } else if (line[index] === "]") {
      depth++;
    } else if (line[index] === "[" && --depth === 0) {
      return index;
    }
  }
  return -1;
}

function parseInlineDestination(line, openingParen) {
  let start = openingParen + 1;
  while (/\s/.test(line[start] ?? "")) start++;
  if (line[start] === "<") {
    const end = line.indexOf(">", start + 1);
    if (end < 0 || !hasClosingParenthesis(line, openingParen)) return null;
    return line.slice(start + 1, end);
  }

  let depth = 0;
  let end = start;
  for (; end < line.length; end++) {
    const character = line[end];
    if (character === "\\") {
      end++;
    } else if (character === "(") {
      depth++;
    } else if (character === ")") {
      if (depth === 0) break;
      depth--;
    } else if (/\s/.test(character)) {
      break;
    }
  }
  if (end === start || depth !== 0) return null;
  if (!hasClosingParenthesis(line, openingParen)) return null;
  return line.slice(start, end).replace(/\\([()\\])/g, "$1");
}

function hasClosingParenthesis(line, openingParen) {
  let depth = 0;
  for (let index = openingParen + 1; index < line.length; index++) {
    if (line[index] === "\\") {
      index++;
    } else if (line[index] === "(") {
      depth++;
    } else if (line[index] === ")") {
      if (depth === 0) return true;
      depth--;
    }
  }
  return false;
}

function markdownLinesWithoutCode(source) {
  const lines = source.split(/\r?\n/);
  let fence;
  return lines.map((line, index) => {
    const fenceMatch = line.match(/^[ \t]{0,3}(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!fence) fence = { character: marker[0], length: marker.length };
      else if (marker[0] === fence.character && marker.length >= fence.length) fence = undefined;
      return { line: "", number: index + 1 };
    }
    if (fence) return { line: "", number: index + 1 };
    if (/^(?: {4,}|\t)/.test(line)) return { line: "", number: index + 1 };
    // Inline code is literal text, not a citation.
    const withoutInlineCode = line.replace(/(`+).*?\1+/g, "");
    return { line: withoutInlineCode, number: index + 1 };
  });
}

export function extractMarkdownExternalLinks(source, file) {
  if (!file || typeof file !== "string") throw new Error("A source document path is required.");
  const lines = markdownLinesWithoutCode(source);
  const definitions = new Map();
  const definitionLineNumbers = new Set();
  const definitionPattern = /^[ \t]{0,3}\[((?:\\.|[^\]])+)\]:[ \t]*(?:<([^>\n]*)>|(\S+))(?:[ \t]+.*)?$/;
  for (const entry of lines) {
    const match = entry.line.match(definitionPattern);
    if (!match) continue;
    const url = (match[2] ?? match[3]).replace(/\\([()\\])/g, "$1");
    const normalizedLabel = match[1].replace(/\\(.)/g, "$1").trim().toLowerCase().replace(/\s+/g, " ");
    if (!definitions.has(normalizedLabel)) {
      definitions.set(normalizedLabel, url);
      definitionLineNumbers.add(entry.number);
    }
  }

  const occurrences = [];
  for (const entry of lines) {
    if (definitionLineNumbers.has(entry.number)) {
      const definition = entry.line.match(definitionPattern);
      const url = definition && (definition[2] ?? definition[3]).replace(/\\([()\\])/g, "$1");
      if (url && isPublicMarkdownCitation(url)) occurrences.push({ url, line: entry.number });
      continue;
    }
    let cursor = 0;
    while ((cursor = entry.line.indexOf("](", cursor)) !== -1) {
      const openingBracket = findOpeningBracket(entry.line, cursor);
      if (openingBracket < 0) {
        cursor += 2;
        continue;
      }
      const destination = parseInlineDestination(entry.line, cursor + 1);
      if (destination && isPublicMarkdownCitation(destination)) {
        occurrences.push({ url: new URL(destination).href, line: entry.number });
      }
      cursor += 2;
    }

    const referencePattern = /!?\[((?:\\.|[^\]])+)\](?:\[([^\]]*)\])?/g;
    for (const match of entry.line.matchAll(referencePattern)) {
      if (entry.line[match.index + match[0].length] === "(") continue;
      const label = (match[2] === undefined || match[2] === "" ? match[1] : match[2])
        .replace(/\\(.)/g, "$1").trim().toLowerCase().replace(/\s+/g, " ");
      const destination = definitions.get(label);
      if (destination && isPublicHttpsUrl(destination)) {
        occurrences.push({ url: new URL(destination).href, line: entry.number });
      }
    }
  }

  const byUrl = new Map();
  for (const { url, line } of occurrences) {
    const normalizedUrl = new URL(url).href;
    const existing = byUrl.get(normalizedUrl) ?? { url: normalizedUrl, locations: [] };
    const location = { file, line };
    if (!existing.locations.some((item) => item.file === file && item.line === line)) {
      existing.locations.push(location);
    }
    byUrl.set(normalizedUrl, existing);
  }
  return [...byUrl.values()].sort((a, b) => a.url.localeCompare(b.url));
}

export function extractCatalogDocumentFiles(source) {
  const declaration = source.match(/const publicDocuments\s*=\s*\[([\s\S]*?)\s*\];/);
  if (!declaration) throw new Error("Could not find the publicDocuments catalog in src/docsCatalog.js.");
  const objects = [...declaration[1].matchAll(/\{[^{}]*\}/g)];
  const files = objects.map((object) => object[0].match(/\bfile:\s*"([^"]+)"/)?.[1]);
  if (!objects.length || files.some((file) => !file)) {
    throw new Error("Every public document catalog entry must declare a literal file name.");
  }
  if (new Set(files).size !== files.length) throw new Error("Duplicate file names found in the public document catalog.");
  return files;
}

function validateUrl(value) {
  const url = new URL(value);
  if (!isPublicHttpsUrl(url.href)) {
    throw new Error("Only credential-free, public HTTPS destinations are permitted.");
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
  const rows = results.map((result) => {
    const locations = (result.locations ?? [])
      .map(({ file, line }) => `${file}:${line}`)
      .join(", ") || "—";
    return `| ${cell(result.url)} | ${cell(locations)} | ${result.outcome.toUpperCase()} | ${result.status ?? "network error"} | ${result.attempts} | ${cell(result.finalUrl)} | ${cell(result.detail)} |`;
  },
  );
  const redirects = results.flatMap((result) => result.redirects.map((redirect) =>
    `- ${cell(redirect.from)} → ${cell(redirect.to)} (${redirect.status}, ${redirect.permanent ? "permanent move" : "temporary redirect"})`,
  ));
  return [
    "# External project link audit", "", `Checked at: ${checkedAt}`, "",
    `Checked ${summary.checked}; reachable ${summary.reachable}; broken ${summary.broken}; transient ${summary.transient}; restricted ${summary.restricted}; redirected ${summary.redirected}.`,
    "", "Only confirmed broken links fail this audit. Transient and restricted results are warnings, not successful availability checks.",
    "", "| Source URL | Document locations | Result | HTTP | Attempts | Final destination | Detail |",
    "| --- | --- | --- | --- | --- | --- | --- |", ...rows,
    "", "## Redirects", "", ...(redirects.length ? redirects : ["None."]), "",
  ].join("\n");
}
