import { isIP } from "node:net";

const redirectStatuses = new Set([301, 302, 303, 307, 308]);
const temporaryStatuses = new Set([408, 425, 429]);
const maxInspectedBodyBytes = 256 * 1024;

// These narrow rules protect only the four homepage destinations whose 200
// responses should still identify the intended project or brand.
export const EXPECTED_CONTENT_RULES = Object.freeze([
  {
    url: "https://github.com/OKHP3/mac-studio-local-ai-workbench",
    allowedFinalDestinations: [
      { hostname: "github.com", pathname: "/OKHP3/mac-studio-local-ai-workbench" },
    ],
    expectedText: ["OKHP3/mac-studio-local-ai-workbench"],
  },
  {
    url: "https://github.com/OKHP3/mac-studio-local-ai-workbench/tree/main/benchmarks",
    allowedFinalDestinations: [
      { hostname: "github.com", pathname: "/OKHP3/mac-studio-local-ai-workbench/tree/main/benchmarks" },
    ],
    expectedText: ["OKHP3/mac-studio-local-ai-workbench", "benchmarks"],
  },
  {
    url: "https://overkillhill.com",
    allowedFinalDestinations: [
      { hostname: "overkillhill.com", pathname: "/" },
      { hostname: "www.overkillhill.com", pathname: "/" },
    ],
    expectedText: ["OverKill Hill"],
  },
  {
    url: "https://overkillhill.com/projects/mac-studio-local-ai-workbench/",
    allowedFinalDestinations: [
      { hostname: "overkillhill.com", pathname: "/projects/mac-studio-local-ai-workbench" },
      { hostname: "www.overkillhill.com", pathname: "/projects/mac-studio-local-ai-workbench" },
    ],
    expectedText: ["Mac Studio Local AI Workbench"],
  },
]);

// Compare labels only for these known project destinations. A warning requires
// the visible label to explicitly name another project in this same list.
const PROJECT_LINK_IDENTITIES = Object.freeze([
  {
    id: "mac-studio-local-ai-workbench",
    aliases: ["mac-studio-local-ai-workbench"],
    destinations: [
      { hostname: "github.com", pathname: "/OKHP3/mac-studio-local-ai-workbench" },
      { hostname: "overkillhill.com", pathname: "/projects/mac-studio-local-ai-workbench" },
    ],
  },
  {
    id: "infusing-a-soul",
    aliases: ["infusing-a-soul"],
    destinations: [
      { hostname: "github.com", pathname: "/OKHP3/infusing-a-soul" },
    ],
  },
  {
    id: "shoal-ai-server",
    aliases: ["shoal-ai-server"],
    destinations: [
      { hostname: "github.com", pathname: "/OKHP3/shoal-ai-server" },
    ],
  },
]);

const normalizeProjectLabel = (value) => value
  .toLocaleLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

function projectIdentityForUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  const pathname = url.pathname.replace(/\/+$/, "") || "/";
  return PROJECT_LINK_IDENTITIES.find((identity) =>
    identity.destinations.some((destination) =>
      url.hostname.toLowerCase() === destination.hostname
        && (destination.hostname === "github.com"
          ? pathname.toLowerCase().startsWith(`${destination.pathname.toLowerCase()}/`)
            || pathname.toLowerCase() === destination.pathname.toLowerCase()
          : pathname.toLowerCase() === destination.pathname.toLowerCase()),
    ),
  ) ?? null;
}

export function findProjectLinkLabelMismatch(url, label) {
  if (typeof label !== "string" || !label.trim()) return null;
  const destination = projectIdentityForUrl(url);
  if (!destination) return null;
  const normalizedLabel = normalizeProjectLabel(
    label.replace(/<[^>]*>/g, " ").replace(/[*_~`]/g, " "),
  );
  const labeledProject = PROJECT_LINK_IDENTITIES.find((identity) =>
    identity.aliases.some((alias) => normalizedLabel.includes(normalizeProjectLabel(alias))),
  );
  if (!labeledProject || labeledProject.id === destination.id) return null;
  return { labeledProject: labeledProject.id, destinationProject: destination.id };
}

function isPublicExternalUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return false;

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

function isPublicHttpsUrl(value) {
  try {
    return new URL(value).protocol === "https:" && isPublicExternalUrl(value);
  } catch {
    return false;
  }
}

function isSharedProjectPage(value) {
  const url = new URL(value);
  const projectPath = "/projects/mac-studio-local-ai-workbench";
  return url.hostname === "overkillhill.com"
    && (url.pathname === projectPath || url.pathname.startsWith(`${projectPath}/`));
}

function isPublicMarkdownCitation(value) {
  return isPublicExternalUrl(value) && !isSharedProjectPage(value);
}

function locationsForHrefSource(source, file) {
  return [...source.matchAll(/\bhref\s*=\s*["'](https?:\/\/[^"']+)["']/g)]
    .filter((match) => isPublicExternalUrl(match[1]))
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

function visibleMarkdownLabel(value) {
  return value
    .replace(/\\(.)/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/[*_~`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
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
  const lines = source
    .replace(/<!--[\s\S]*?(?:-->|$)/g, (comment) => comment.replace(/[^\r\n]/g, " "))
    .split(/\r?\n/);
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

function plainTextHttpsUrls(line) {
  // HTML attributes are handled separately from visible Markdown prose.
  const text = line.replace(/<\/?[A-Za-z][A-Za-z0-9:-]*(?:\s+[^<>]*?)?\s*\/?>/g, " ");
  const urls = [];
  for (const match of text.matchAll(/https:\/\/[^\s<>"'`]+/gi)) {
    let value = match[0].replace(/[.,!?;:]+$/, "");
    const marker = value.match(/(\*{1,3}|_{1,3})$/)?.[0];
    if (marker) {
      const prefix = text.slice(0, match.index);
      const opening = marker.replaceAll("*", "\\*");
      const delimiterCount = [...prefix.matchAll(/(?<!\\)(\*+|_+)/g)]
        .filter(([delimiter]) => delimiter === marker).length;
      if (delimiterCount % 2 === 1 && new RegExp(`(?:^|[\\s(])${opening}(?=\\S|$)`).test(prefix)) {
        value = value.slice(0, -marker.length);
      }
    }
    for (const [closing, opening] of [[")", "("], ["]", "["], ["}", "{"]]) {
      while (value.endsWith(closing)
        && [...value].filter((character) => character === closing).length
          > [...value].filter((character) => character === opening).length) {
        value = value.slice(0, -1);
      }
    }
    urls.push(value);
  }
  return urls;
}

function parseAnchorHref(tag) {
  let index = 2;
  while (index < tag.length - 1) {
    while (/\s/.test(tag[index] ?? "")) index++;
    if (tag[index] === "/" || tag[index] === ">") break;

    const attributeStart = index;
    while (index < tag.length && !/[\s=/>]/.test(tag[index])) index++;
    if (index === attributeStart) {
      index++;
      continue;
    }
    const name = tag.slice(attributeStart, index).toLowerCase();
    while (/\s/.test(tag[index] ?? "")) index++;
    if (tag[index] !== "=") continue;

    index++;
    while (/\s/.test(tag[index] ?? "")) index++;
    const quote = tag[index] === '"' || tag[index] === "'" ? tag[index++] : null;
    const valueStart = index;
    if (quote) {
      while (index < tag.length && tag[index] !== quote) index++;
    } else {
      while (index < tag.length && !/[\s>]/.test(tag[index])) index++;
    }
    const value = tag.slice(valueStart, index);
    if (quote && tag[index] === quote) index++;
    if (name === "href") return { value, attributeStart };
  }
  return null;
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(x[0-9a-f]+|\d+);/gi, (entity, code) => {
      const point = code[0].toLowerCase() === "x"
        ? Number.parseInt(code.slice(1), 16)
        : Number.parseInt(code, 10);
      return point <= 0x10ffff && !(point >= 0xd800 && point <= 0xdfff)
        ? String.fromCodePoint(point)
        : entity;
    });
}

function visibleHtmlAnchorLabel(value) {
  return decodeHtmlEntities(value
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function htmlAnchorOccurrences(lines) {
  const source = lines.map(({ line }) => line).join("\n");
  const occurrences = [];
  const openingAnchorPattern = /<a\b(?:"[^"]*"|'[^']*'|[^"'<>])*?>/gi;
  for (const match of source.matchAll(openingAnchorPattern)) {
    const href = parseAnchorHref(match[0]);
    if (!href || !isPublicMarkdownCitation(href.value)) continue;
    const locationIndex = match.index + href.attributeStart;
    const closingAnchorPattern = /<\/a\s*>/gi;
    closingAnchorPattern.lastIndex = match.index + match[0].length;
    const closingAnchor = closingAnchorPattern.exec(source);
    const label = closingAnchor
      ? visibleHtmlAnchorLabel(source.slice(match.index + match[0].length, closingAnchor.index))
      : "";
    occurrences.push({
      url: new URL(href.value).href,
      line: source.slice(0, locationIndex).split("\n").length,
      ...(label ? { label } : {}),
    });
  }
  return occurrences;
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

  const occurrences = htmlAnchorOccurrences(lines);
  for (const entry of lines) {
    if (definitionLineNumbers.has(entry.number)) {
      const definition = entry.line.match(definitionPattern);
      const url = definition && (definition[2] ?? definition[3]).replace(/\\([()\\])/g, "$1");
      if (url && isPublicMarkdownCitation(url)) occurrences.push({ url, line: entry.number });
      for (const bareUrl of plainTextHttpsUrls(entry.line)) {
        if (isPublicHttpsUrl(bareUrl) && isPublicMarkdownCitation(bareUrl)) {
          occurrences.push({ url: bareUrl, line: entry.number });
        }
      }
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
        occurrences.push({
          url: new URL(destination).href,
          line: entry.number,
          label: visibleMarkdownLabel(entry.line.slice(openingBracket + 1, cursor)),
        });
      }
      cursor += 2;
    }

    const referencePattern = /!?\[((?:\\.|[^\]])+)\](?:\[([^\]]*)\])?/g;
    for (const match of entry.line.matchAll(referencePattern)) {
      if (entry.line[match.index + match[0].length] === "(") continue;
      const label = (match[2] === undefined || match[2] === "" ? match[1] : match[2])
        .replace(/\\(.)/g, "$1").trim().toLowerCase().replace(/\s+/g, " ");
      const destination = definitions.get(label);
      if (destination && isPublicMarkdownCitation(destination)) {
        occurrences.push({
          url: new URL(destination).href,
          line: entry.number,
          label: visibleMarkdownLabel(match[1]),
        });
      }
    }

    for (const bareUrl of plainTextHttpsUrls(entry.line)) {
      if (isPublicHttpsUrl(bareUrl) && isPublicMarkdownCitation(bareUrl)) {
        occurrences.push({ url: bareUrl, line: entry.number });
      }
    }
  }

  const byUrl = new Map();
  for (const { url, line, label } of occurrences) {
    const normalizedUrl = new URL(url).href;
    const existing = byUrl.get(normalizedUrl) ?? { url: normalizedUrl, locations: [] };
    const location = label === undefined ? { file, line } : { file, line, label };
    const sameLine = existing.locations.filter((item) => item.file === file && item.line === line);
    if (label === undefined && sameLine.some((item) => item.label !== undefined)) continue;
    if (label !== undefined) {
      existing.locations = existing.locations.filter((item) =>
        item.file !== file || item.line !== line || item.label !== undefined,
      );
    }
    if (!existing.locations.some((item) => item.file === file && item.line === line && item.label === label)) {
      existing.locations.push(location);
    }
    existing.locations.sort((a, b) => a.file.localeCompare(b.file)
      || a.line - b.line || (a.label ?? "").localeCompare(b.label ?? ""));
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

function expectedContentRuleFor(url, rules) {
  const normalizedUrl = new URL(url).href;
  return rules.find((rule) => new URL(rule.url).href === normalizedUrl);
}

function matchesExpectedDestination(finalUrl, allowedDestinations) {
  const destination = new URL(finalUrl);
  return allowedDestinations.some((allowed) =>
    destination.hostname.toLowerCase() === allowed.hostname.toLowerCase()
      && destination.pathname.replace(/\/+$/, "") === allowed.pathname.replace(/\/+$/, ""),
  );
}

async function readBodyPrefix(response, maxBytes = maxInspectedBodyBytes) {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const chunks = [];
  let bytesRead = 0;
  try {
    while (bytesRead < maxBytes) {
      const { done, value } = await reader.read();
      if (done) break;
      const remaining = maxBytes - bytesRead;
      const chunk = value.subarray(0, remaining);
      chunks.push(chunk);
      bytesRead += chunk.byteLength;
      if (chunk.byteLength < value.byteLength) break;
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

function visibleTextFromHtml(html) {
  return html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .toLocaleLowerCase();
}

export async function checkExternalUrl(originalUrl, {
  fetchImpl = fetch,
  sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)),
  timeoutMs = 15_000,
  maxAttempts = 3,
  maxRedirects = 8,
  expectedContentRules = EXPECTED_CONTENT_RULES,
} = {}) {
  if (maxAttempts < 1 || timeoutMs < 1 || maxRedirects < 0) {
    throw new Error("Invalid link-check limits.");
  }
  try {
    const destination = new URL(originalUrl);
    if (destination.protocol === "http:" && isPublicExternalUrl(destination.href)) {
      return {
        url: originalUrl,
        finalUrl: destination.href,
        outcome: "insecure",
        detail: "Unencrypted HTTP URL was not requested. Replace it with a verified HTTPS destination.",
        attempts: 0,
        status: null,
        redirects: [],
      };
    }
  } catch {
    // The normal HTTPS validation below returns an explicit broken result.
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
        if (redirectStatuses.has(response.status)) {
          await response.body?.cancel().catch(() => {});
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
          const rule = expectedContentRuleFor(originalUrl, expectedContentRules);
          if (!rule) {
            // Most citations remain availability-only checks; do not download their pages.
            await response.body?.cancel().catch(() => {});
            return result("ok", redirects.length
              ? "Reachable through redirects. Review permanent moves before updating source links."
              : "Reachable.");
          }
          if (!matchesExpectedDestination(currentUrl, rule.allowedFinalDestinations)) {
            await response.body?.cancel().catch(() => {});
            return result("suspicious", `Successful response landed at an unexpected destination for rule "${rule.url}".`);
          }
          const contentType = response.headers.get("content-type") ?? "";
          if (!/^text\/html(?:\s*;|$)|^application\/xhtml\+xml(?:\s*;|$)/i.test(contentType)) {
            await response.body?.cancel().catch(() => {});
            return result("suspicious", `Expected HTML content for rule "${rule.url}", received "${contentType || "no content type"}".`);
          }
          const body = visibleTextFromHtml(await readBodyPrefix(response));
          const missingText = rule.expectedText.filter((text) => !body.includes(text.toLocaleLowerCase()));
          if (missingText.length) {
            return result("suspicious", `Expected page content was not found for rule "${rule.url}": ${missingText.join(", ")}.`);
          }
          return result("ok", redirects.length
            ? "Reachable and expected page content found through redirects. Review permanent moves before updating source links."
            : "Reachable and expected page content found.");
        }
        await response.body?.cancel().catch(() => {});
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
    suspicious: results.filter((result) => result.outcome === "suspicious").length,
    insecure: results.filter((result) => result.outcome === "insecure").length,
    broken: results.filter((result) => result.outcome === "broken").length,
    transient: results.filter((result) => result.outcome === "transient").length,
    restricted: results.filter((result) => result.outcome === "restricted").length,
    redirected: results.filter((result) => result.redirects.length > 0).length,
  };
}

const cell = (value) => String(value).replaceAll("|", "\\|").replace(/[\r\n]+/g, " ");

export function formatReport(results, checkedAt) {
  const summary = summarizeResults(results);
  const labelWarnings = results.flatMap((result) => result.labelWarnings ?? []);
  const rows = results.map((result) => {
    const locations = (result.locations ?? [])
      .map(({ file, line, label }) => `${file}:${line}${label ? ` (“${label}”)` : ""}`)
      .join(", ") || "—";
    const status = result.outcome === "insecure" ? "not requested" : result.status ?? "network error";
    return `| ${cell(result.url)} | ${cell(locations)} | ${result.outcome.toUpperCase()} | ${status} | ${result.attempts} | ${cell(result.finalUrl)} | ${cell(result.detail)} |`;
  },
  );
  const redirects = results.flatMap((result) => result.redirects.map((redirect) =>
    `- ${cell(redirect.from)} → ${cell(redirect.to)} (${redirect.status}, ${redirect.permanent ? "permanent move" : "temporary redirect"})`,
  ));
  return [
    "# External project link audit", "", `Checked at: ${checkedAt}`, "",
    `Checked ${summary.checked}; reachable ${summary.reachable}; insecure ${summary.insecure}; suspicious ${summary.suspicious}; broken ${summary.broken}; transient ${summary.transient}; restricted ${summary.restricted}; redirected ${summary.redirected}.`,
    "", "Insecure HTTP citations and confirmed broken HTTPS links fail this audit. HTTP destinations are reported without being requested. Suspicious content, transient network/HTTP outages, and restricted results are separate warnings.",
    "", "| Source URL | Document locations | Result | HTTP | Attempts | Final destination | Detail |",
    "| --- | --- | --- | --- | --- | --- | --- |", ...rows,
    "", "## Project label warnings", "",
    ...(labelWarnings.length
      ? labelWarnings.map((warning) =>
        `- ${cell(warning.file)}:${warning.line}: label “${cell(warning.label)}” identifies ${cell(warning.labeledProject)}, but the destination identifies ${cell(warning.destinationProject)} (${cell(warning.url)}).`,
      )
      : ["None."]),
    "", "## Redirects", "", ...(redirects.length ? redirects : ["None."]), "",
  ].join("\n");
}
