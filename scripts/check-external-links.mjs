import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { checkExternalUrl, extractExternalLinks, formatReport, summarizeResults } from "./lib/external-links.mjs";

const root = new URL("../", import.meta.url);
const reportDirectory = new URL("reports/external-link-checks/", root);

try {
  const source = await readFile(new URL("src/App.jsx", root), "utf8");
  const urls = extractExternalLinks(source);
  const results = [];
  for (const url of urls) {
    const result = await checkExternalUrl(url);
    results.push(result);
    console.log(`${result.outcome.toUpperCase()} ${url} -> ${result.finalUrl} (${result.status ?? "network error"}, ${result.attempts} attempt(s))`);
    if (process.env.GITHUB_ACTIONS === "true" && result.outcome !== "ok") {
      const message = `${url}: ${result.detail}`.replaceAll("%", "%25")
        .replaceAll("\r", "%0D").replaceAll("\n", "%0A");
      console.log(`::${result.outcome === "broken" ? "error" : "warning"}::${message}`);
    }
  }
  const checkedAt = new Date().toISOString();
  const summary = summarizeResults(results);
  const markdown = formatReport(results, checkedAt);
  await mkdir(reportDirectory, { recursive: true });
  await writeFile(new URL("report.json", reportDirectory), `${JSON.stringify({ checkedAt, summary, results }, null, 2)}\n`);
  await writeFile(new URL("report.md", reportDirectory), markdown);
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, markdown);
  console.log(`Reports: ${fileURLToPath(reportDirectory)}`);
  process.exitCode = summary.broken ? 1 : 0;
} catch (error) {
  console.error(`Link audit could not run: ${error.message}`);
  process.exitCode = 1;
}
