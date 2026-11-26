/* Development page fly-through QA. Run against the static preview (node scripts/work-static-preview.cjs). */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require("playwright");
const origin = (process.env.AIWA_TEST_URL || "http://127.0.0.1:4173").replace(/\/+$/, "");
const output = "test-artifacts/tech-flight";
const route = "/specialisms/tech";
const viewports = [[1440, 900], [1024, 768], [390, 844], [320, 700]];
fs.mkdirSync(output, { recursive: true });

async function open(browser, { width, height, scheme = "dark", reduced = false }) {
  const context = await browser.newContext({ viewport: { width, height }, colorScheme: scheme, reducedMotion: reduced ? "reduce" : "no-preference", deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto(origin + route + "?flightdebug", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  return { context, page, errors };
}
const mode = page => page.locator(".spec-detail--tech [data-flight-mode]").first().getAttribute("data-flight-mode");

(async () => {
  const browser = await chromium.launch({ headless: true, args: ["--disable-dev-shm-usage"] });
  try {
    // --- Task 2: mode detection and runtime lifecycle
    for (const [width, height] of viewports) for (const scheme of ["light", "dark"]) {
      const { context, page, errors } = await open(browser, { width, height, scheme });
      const expected = width >= 900 ? "fly" : "static";
      await page.waitForFunction(() => document.querySelector("[data-flight-mode]"));
      await page.waitForFunction(m => document.querySelector("[data-flight-mode]").dataset.flightMode === m, expected);
      assert.equal(await mode(page), expected, `${width} ${scheme}: flight mode`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 0, true, `${width} ${scheme}: horizontal overflow`);
      assert.deepEqual(errors, [], `${width} ${scheme}: page errors`);
      await context.close();
    }
    {
      const { context, page } = await open(browser, { width: 1440, height: 900, reduced: true });
      assert.equal(await mode(page), "static", "reduced motion forces static mode");
      await context.close();
    }
    {
      const { context, page } = await open(browser, { width: 1440, height: 900 });
      await page.waitForFunction(() => document.querySelector("[data-flight-mode]").dataset.flightMode === "fly");
      await page.setViewportSize({ width: 600, height: 900 });
      await page.waitForFunction(() => document.querySelector("[data-flight-mode]").dataset.flightMode === "static");
      assert.equal(await page.evaluate(() => window.__techFlightDebug?.triggers()), 0, "static mode keeps no ScrollTriggers");
      assert.equal(await page.evaluate(() => window.__techFlightDebug?.lenis()), false, "static mode has no Lenis");
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.waitForFunction(() => document.querySelector("[data-flight-mode]").dataset.flightMode === "fly");
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.waitForFunction(() => document.querySelector("[data-flight-mode]").dataset.flightMode === "static");
      assert.equal(await page.evaluate(() => window.__techFlightDebug?.lenis()), false, "reduced motion destroys Lenis");
      await context.close();
    }
    // --- Task 3: shell and hero
    for (const [width, height] of viewports) for (const scheme of ["light", "dark"]) {
      const { context, page } = await open(browser, { width, height, scheme });
      const hero = page.locator('[data-tech-section="hero"]');
      assert.equal(await hero.count(), 1, "one hero section");
      assert.equal((await hero.locator("h1").innerText()).trim().toLowerCase(), "development");
      const headline = (await hero.locator(".tech-hero__headline").innerText()).replace(/\s+/g, " ").toUpperCase();
      assert.ok(headline.includes("GOOD IDEAS.") && headline.includes("GREAT ENGINEERING."), "hero headline copy");
      assert.equal(await hero.locator('a[href="#dev-services"]').count(), 1, "hero services link");
      assert.equal(await hero.locator(".tech-hero__ink").count(), 1, "hero ink slot");
      const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').first().innerText());
      assert.equal(ld.serviceType.length, 6, "JSON-LD service types");
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), "https://next.aiwamediagroup.com/specialisms/tech");
      const clipped = await hero.locator(".tech-hero__headline").evaluate(n => n.scrollWidth > n.clientWidth + 1);
      assert.equal(clipped, false, `${width} ${scheme}: headline clipped`);
      if (scheme === "dark") await page.screenshot({ path: `${output}/hero-${width}-${scheme}.png` });
      await context.close();
    }
    console.log("AIWA_TECH_FLIGHT_QA_PASS");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
