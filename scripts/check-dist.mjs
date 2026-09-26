import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = path.join(projectRoot, "dist");
const pagesBase = "/mac-studio-local-ai-workbench/";
const indexPath = path.join(distRoot, "index.html");
const html = await readFile(indexPath, "utf8");
const failures = [];

const references = [
  ...html.matchAll(/\b(?:src|href)=["']([^"'#]+)["']/g),
].map((match) => match[1]);

const generatedReferences = references.filter(
  (reference) =>
    !reference.startsWith("data:") &&
    !reference.startsWith("http://") &&
    !reference.startsWith("https://") &&
    !reference.startsWith("//"),
);

for (const reference of generatedReferences) {
  if (!reference.startsWith(pagesBase)) {
    failures.push(`Generated reference does not use the Pages base: ${reference}`);
    continue;
  }

  const relativePath = decodeURIComponent(reference.slice(pagesBase.length).split(/[?#]/, 1)[0]);
  if (!relativePath) continue;

  try {
    await access(path.join(distRoot, relativePath));
  } catch {
    failures.push(`Generated reference does not exist in dist: ${reference}`);
  }
}

if (!generatedReferences.some((reference) => reference.startsWith(`${pagesBase}assets/`))) {
  failures.push(`No generated asset uses the expected Pages base ${pagesBase}`);
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Checked ${generatedReferences.length} generated references under ${pagesBase}`);