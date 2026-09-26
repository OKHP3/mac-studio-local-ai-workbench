import { expect, test } from "@playwright/test";

const pagesBase = "/mac-studio-local-ai-workbench/";
const localOrigin = "http://127.0.0.1:4173";

test("loads the production subpath without broken generated assets", async ({ page }) => {
  const failedResponses = [];
  page.on("response", (response) => {
    if (response.status() >= 400 && new URL(response.url()).origin === localOrigin) {
      failedResponses.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto("./");

  await expect(page).toHaveURL(new RegExp(`${pagesBase.replaceAll("/", "\\/")}$`));
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Local AI");
  await expect(page.locator("main")).toBeVisible();
  expect(failedResponses).toEqual([]);
});

test("every internal anchor points to a rendered section", async ({ page }) => {
  await page.goto("./");

  const anchors = await page.locator('a[href^="#"]:not([href^="#/"])').evaluateAll((links) =>
    links.map((link) => link.getAttribute("href")),
  );

  expect(anchors.length).toBeGreaterThan(0);
  for (const href of new Set(anchors)) {
    await expect(page.locator(href)).toHaveCount(1);
  }
});

test("primary navigation reaches its target at desktop and mobile widths", async ({ page }, testInfo) => {
  await page.goto("./");

  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Toggle navigation" }).click();
  }

  await page.getByRole("link", { name: "Architecture", exact: true }).click();
  await expect(page).toHaveURL(/#architecture$/);
  await expect(page.locator("#architecture")).toBeVisible();
});

test("external links use valid secure URLs", async ({ page }) => {
  await page.goto("./");

  const hrefs = await page.locator('a[href^="http"]').evaluateAll((links) =>
    links.map((link) => link.href),
  );

  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) {
    expect(() => new URL(href)).not.toThrow();
    expect(href).toMatch(/^https:\/\//);
  }
});

test("documentation index and direct document links work under the Pages subpath", async ({ page }) => {
  await page.goto("./#/docs");

  await expect(page).toHaveURL(new RegExp(`${pagesBase.replaceAll("/", "\\/")}#\\/docs$`));
  await expect(page.getByRole("heading", { level: 1, name: "The full field manual." })).toBeVisible();
  await expect(page.locator(".docs-index-grid > a")).toHaveCount(23);
  await page.getByRole("link", { name: /Project overview/ }).first().click();
  await expect(page).toHaveURL(/#\/docs\/project-overview$/);
  await expect(page.getByRole("heading", { level: 1, name: "Project overview", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.locator("main")).not.toContainText("artifact_type");
});

test("updates browser title and description for documentation routes", async ({ page }) => {
  await page.goto("./");
  await expect(page).toHaveTitle("Mac Studio Local AI Workbench | OverKill Hill P³");

  await page.goto("./#/docs/project-overview");
  await expect(page).toHaveTitle("Project overview | Local AI Workbench");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "Purpose, scope, and the workbench at a glance.",
  );
});

test("ships Pages-safe install and share assets", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://overkillhill.com/projects/mac-studio-local-ai-workbench/",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://raw.githubusercontent.com/OKHP3/mac-studio-local-ai-workbench/main/public/workbench-social-preview.jpg",
  );
  const assetPaths = await page.locator(
    'link[rel="icon"], link[rel="apple-touch-icon"], link[rel="mask-icon"], link[rel="manifest"]',
  ).evaluateAll((links) => links.map((link) => new URL(link.href).pathname));

  expect(assetPaths).toEqual(expect.arrayContaining([
    `${pagesBase}brand-mark.svg`,
    `${pagesBase}favicon-32.png`,
    `${pagesBase}apple-touch-icon.png`,
    `${pagesBase}safari-pinned-tab.svg`,
    `${pagesBase}site.webmanifest`,
  ]));

  const manifestResponse = await page.request.get(`${localOrigin}${pagesBase}site.webmanifest`);
  expect(manifestResponse.ok()).toBeTruthy();
  const manifest = await manifestResponse.json();
  expect(manifest.icons.map(({ sizes }) => sizes)).toEqual(["192x192", "512x512"]);
});

test("sends one GA4 pageview for each SPA route", async ({ page }) => {
  test.skip(!process.env.EXPECT_GA4, "set EXPECT_GA4=1 to exercise the GA4 integration");
  await page.addInitScript(() => {
    window.dataLayer = [];
    window.gtag = (...args) => window.dataLayer.push(args);
  });
  await page.route("https://www.googletagmanager.com/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/javascript", body: "/* GA test stub */" }),
  );
  await page.goto("./");
  await page.evaluate(() => {
    window.location.hash = "#architecture";
  });
  await expect.poll(() => page.evaluate(() =>
    window.dataLayer.filter((entry) => entry[0] === "event" && entry[1] === "page_view").length,
  )).toBe(1);
  await page.evaluate(() => {
    window.location.hash = "#/docs";
  });
  await expect.poll(() => page.evaluate(() =>
    window.dataLayer.filter((entry) => entry[0] === "event" && entry[1] === "page_view").length,
  )).toBe(2);
  await page.evaluate(() => {
    window.location.hash = "#/docs/project-overview";
  });
  await expect.poll(() => page.evaluate(() =>
    window.dataLayer.filter((entry) => entry[0] === "event" && entry[1] === "page_view").length,
  )).toBe(3);

  const analyticsState = await page.evaluate(() => ({
    configuredId: window.dataLayer.find((entry) => entry[0] === "config")?.[1],
    scriptId: document.querySelector("script[data-ga4]")?.dataset.ga4,
    pageViews: window.dataLayer
      .filter((entry) => entry[0] === "event" && entry[1] === "page_view")
      .map((entry) => entry[2].page_path),
  }));
  expect(analyticsState.configuredId).toMatch(/^G-[A-Z0-9]+$/);
  expect(analyticsState.scriptId).toBe(analyticsState.configuredId);
  expect(analyticsState.pageViews).toEqual([
    `${pagesBase}`,
    `${pagesBase}#/docs`,
    `${pagesBase}#/docs/project-overview`,
  ]);
});

test("dated records are presented as historical snapshots", async ({ page }) => {
  await page.goto("./#/docs/lan-exposure-fix-2026-09-12");

  const notice = page.getByRole("note");
  await expect(notice).toContainText("Historical snapshot");
  await expect(notice).toContainText("September 12, 2026");
  await expect(notice).toContainText("not live system telemetry");
});

test("documentation navigation remains keyboard accessible", async ({ page }) => {
  await page.goto("./#/docs/project-overview");

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Return to workbench home" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: /Workbench overview/ })).toBeFocused();
});