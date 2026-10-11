import { appendFile, mkdir, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

// Read only the repository's Pages metadata; never infer a hostname.
export async function resolvePagesURL({
  repository,
  token,
  apiURL = "https://api.github.com",
  request = fetch,
  wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  diagnostics = [],
}) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository ?? "") || !token) {
    throw new Error("GitHub repository and read-only token are required");
  }
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await request(`${apiURL}/repos/${repository}/pages`, {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
        signal: AbortSignal.timeout(15_000),
      });
      diagnostics.push({ attempt, status: response.status });
      if (!response.ok) {
        throw new Error(`GitHub Pages API returned HTTP ${response.status}`);
      }
      const { html_url: htmlURL } = await response.json();
      const url = new URL(htmlURL);
      if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) {
        throw new Error("GitHub Pages API returned an invalid public URL");
      }
      return url.href;
    } catch {
      // Do not preserve raw responses/errors: they may contain request credentials.
      diagnostics.push({ attempt, error: "Pages URL lookup failed or returned invalid metadata" });
      if (attempt === 3) {
        throw new Error("Could not resolve the Pages URL after three attempts; see URL diagnostics");
      }
      await wait(5_000);
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const diagnostics = [];
  let url;
  let error;
  try {
    url = await resolvePagesURL({
      repository: process.env.GITHUB_REPOSITORY,
      token: process.env.GH_TOKEN,
      apiURL: process.env.GITHUB_API_URL,
      diagnostics,
    });
    if (!process.env.GITHUB_OUTPUT) throw new Error("GITHUB_OUTPUT is required");
    await appendFile(process.env.GITHUB_OUTPUT, `url=${url}\n`);
    console.log(`Resolved Pages URL: ${url}`);
  } catch (failure) {
    error = failure.message;
    console.error(error);
    process.exitCode = 1;
  } finally {
    await mkdir("reports/pages-health", { recursive: true });
    await writeFile("reports/pages-health/url-resolution.json", `${JSON.stringify({
      url: url ?? null, error: error ?? null, attempts: diagnostics,
    }, null, 2)}\n`);
  }
}
