import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  checkExternalUrl,
  extractCatalogDocumentFiles,
  extractExternalLinkOccurrences,
  extractMarkdownExternalLinks,
  formatReport,
  summarizeResults,
} from "./lib/external-links.mjs";

const root = new URL("../", import.meta.url);
const reportDirectory = new URL("reports/external-link-checks/", root);

try {
  const sources = new Map();
  const addSource = (url, location) => {
    const normalizedUrl = new URL(url).href;
    const entry = sources.get(normalizedUrl) ?? { url: normalizedUrl, locations: [] };
    if (!entry.locations.some((item) => item.file === location.file && item.line === location.line)) {
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
      const result = await checkExternalUrl(entry.url);
      result.locations = entry.locations;
      results[index] = result;
      console.log(`${result.outcome.toUpperCase()} ${entry.url} -> ${result.finalUrl} (${result.status ?? "network error"}, ${result.attempts} attempt(s); ${entry.locations.map(({ file, line }) => `${file}:${line}`).join(", ")})`);
      if (process.env.GITHUB_ACTIONS === "true" && result.outcome !== "ok") {
        const message = `${entry.url}: ${result.detail} [${entry.locations.map(({ file, line }) => `${file}:${line}`).join(", ")}]`
          .replaceAll("%", "%25").replaceAll("\r", "%0D").replaceAll("\n", "%0A");
        console.log(`::${["broken", "insecure"].includes(result.outcome) ? "error" : "warning"}::${message}`);
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
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, markdown);
  console.log(`Audited ${documentFiles.length} published documents.`);
  console.log(`Reports: ${fileURLToPath(reportDirectory)}`);
  process.exitCode = summary.broken || summary.insecure ? 1 : 0;
} catch (error) {
  console.error(`Link audit could not run: ${error.message}`);
  process.exitCode = 1;
}
