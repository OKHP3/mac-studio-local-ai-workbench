import { defineConfig } from "@playwright/test";

const pagesBase = "/mac-studio-local-ai-workbench/";
const smokePort = 4173;

export default defineConfig({
  testDir: "./tests",
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://127.0.0.1:${smokePort}${pagesBase}`,
    trace: "retain-on-failure",
  },
  webServer: {
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