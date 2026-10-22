import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  checkExternalUrl,
  extractCatalogDocumentFiles,
  extractExternalLinkOccurrences,
  extractMarkdownExternalLinks,
  findProjectLinkLabelMismatch,
  formatProjectLabelWarningAnnotation,
  formatReport,
  auditExitCode,
  summarizeResults,
} from "./lib/external-links.mjs";

export async function runExternalLinkAudit({
  root = new URL("../", import.meta.url),
  env = process.env,
  fetchImpl = fetch,
  log = console.log,
  warn = console.warn,
} = {}) {
  const reportDirectory = new URL("reports/external-link-checks/", root);
  try {
    const sources = new Map();
    const addSource = (url, location) => {
      const normalizedUrl = new URL(url).href;
      const entry = sources.get(normalizedUrl) ?? { url: normalizedUrl, locations: [] };
      if (!entry.locations.some((item) => item.file === location.file
        && item.line === location.line && item.label === location.label)) {
        entry.locations.push(location);
      }
      sources.set(normalizedUrl, entry);
    };

    const homepage = await readFile(new URL("src/App.jsx", root), "utf8");
    for (const { url, location } of extractExternalLinkOccurrences(homepage, "src/App.jsx")) {
      addSource(url, location);
    }
    // Keep this audit scoped to the documents actually published by the app.
    const catalog = await readFile(new URL("src/docsCatalog.js", root), "utf8");
    const documentFiles = extractCatalogDocumentFiles(catalog);
    for (const file of documentFiles) {
      if (file.includes("/") || file.includes("\\") || !file.endsWith(".md")) {
        throw new Error(`Invalid public document catalog path: ${file}`);
      }
      const content = await readFile(new URL(`docs/${file}`, root), "utf8");
      for (const { url, locations } of extractMarkdownExternalLinks(content, `docs/${file}`)) {
        for (const location of locations) addSource(url, location);
      }
    }
    if (!sources.size) throw new Error("No public external links found in the homepage or published documents.");

    const entries = [...sources.values()].sort((a, b) => a.url.localeCompare(b.url));
    const results = new Array(entries.length);
    let nextIndex = 0;
    const worker = async () => {
      while (nextIndex < entries.length) {
        const index = nextIndex++;
        const entry = entries[index];
        const result = await checkExternalUrl(entry.url, { fetchImpl });
        result.locations = entry.locations;
        result.labelWarnings = entry.locations.flatMap((location) => {
          const mismatch = findProjectLinkLabelMismatch(entry.url, location.label);
          return mismatch ? [{ url: entry.url, ...location, ...mismatch }] : [];
        });
        results[index] = result;
        log(`${result.outcome.toUpperCase()} ${entry.url} -> ${result.finalUrl} (${result.status ?? "network error"}, ${result.attempts} attempt(s); ${entry.locations.map(({ file, line }) => `${file}:${line}`).join(", ")})`);
        for (const warning of result.labelWarnings) {
          const message = `${warning.file}:${warning.line}: label "${warning.label}" identifies ${warning.labeledProject}, but destination identifies ${warning.destinationProject} (${entry.url})`;
          warn(`WARNING ${message}`);
          if (env.GITHUB_ACTIONS === "true") {
            log(formatProjectLabelWarningAnnotation(warning));
          }
        }
        if (env.GITHUB_ACTIONS === "true" && result.outcome !== "ok") {
          const message = `${entry.url}: ${result.detail} [${entry.locations.map(({ file, line }) => `${file}:${line}`).join(", ")}]`
            .replaceAll("%", "%25").replaceAll("\r", "%0D").replaceAll("\n", "%0A");
          log(`::${["broken", "insecure"].includes(result.outcome) ? "error" : "warning"}::${message}`);
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(4, entries.length) }, worker));

    const checkedAt = new Date().toISOString();
    const summary = summarizeResults(results);
    const markdown = formatReport(results, checkedAt);
    await mkdir(reportDirectory, { recursive: true });
    await writeFile(new URL("report.json", reportDirectory), `${JSON.stringify({
      checkedAt, summary, documentFiles, results,
    }, null, 2)}\n`);
    await writeFile(new URL("report.md", reportDirectory), markdown);
    if (env.GITHUB_STEP_SUMMARY) await appendFile(env.GITHUB_STEP_SUMMARY, markdown);
    log(`Audited ${documentFiles.length} published documents.`);
    log(`Reports: ${fileURLToPath(reportDirectory)}`);
    return auditExitCode(summary);
  } catch (error) {
    warn(`Link audit could not run: ${error.message}`);
    return 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await runExternalLinkAudit();
}
