import { defineConfig } from "@playwright/test";

const pagesBase = "/mac-studio-local-ai-workbench/";
const smokePort = 4173;

const publishedURL = process.env.PAGES_URL;
const baseURL = publishedURL
  ? `${publishedURL.replace(/\/+$/, "")}/`
  : `http://127.0.0.1:${smokePort}${pagesBase}`;

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.js",
  retries: process.env.CI ? (publishedURL ? 2 : 1) : 0,
  reporter: publishedURL
    ? [["github"], ["html", { open: "never" }]]
    : process.env.CI ? "github" : "list",
  // Only the small, read-only deployment probe runs against a public site.
  grep: publishedURL ? /@live/ : undefined,
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: publishedURL ? undefined : {
    command: `npm run preview -- --port ${smokePort}`,
    url: `http://127.0.0.1:${smokePort}${pagesBase}`,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "desktop",
      use: { viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile",
      use: { viewport: { width: 390, height: 844 } },
    },
  ],
});
