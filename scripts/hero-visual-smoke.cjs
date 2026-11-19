/* Real-browser smoke + layout test for Aiwa's exported Cloudflare Pages hero.
 * Run after a production static build using a local static server.
 * This intentionally doesn't test external YouTube video playback, which can
 * require human authentication and will be replaced by approved native media.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require("playwright");

const URL = process.env.AIWA_TEST_URL || "http://127.0.0.1:4173/";
fs.mkdirSync("test-artifacts", { recursive: true });

async function runCase(browser, label, width, height) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await page.waitForSelector("#aiwa-hero-heading");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(450);

  const before = await page.evaluate(() => {
    const h = document.getElementById("aiwa-hero-heading");
    const stage = document.querySelector(".aiwa-hero-stage");
    const tile = document.querySelector(".aiwa-hero__film-tile");
    return {
      title: h?.textContent?.replace(/\s+/g, " ").trim(),
      viewport: window.innerWidth,
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      heading: h?.getBoundingClientRect().toJSON(),
      tile: tile?.getBoundingClientRect().toJSON(),
      stageHeight: stage?.getBoundingClientRect().height,
      scrollY: window.scrollY,
    };
  });

  assert(before.title?.includes("YOUR BRAND’S"), "Updated first line is missing");
  assert(before.title?.includes("TOO QUIET."), "First-line ending is missing");
  assert(before.title?.includes("DOMINATE"), "Updated second line is missing");
  assert(before.title?.includes("WITH AIWA."), "Second-line ending is missing");
  assert(before.tile.width > 40 && before.tile.height > 20, "Inline film is not visible");
  assert(before.overflow <= 2, "Page horizontally overflows viewport by " + before.overflow);

  await page.screenshot({ path: "test-artifacts/" + label + "-hero.png", fullPage: false });

  if (width <= 950) {
    const menu = page.getByRole("button", { name: "Open navigation" });
    assert(await menu.isVisible(), "Mobile menu is not visible");
    await menu.click();
    const navVisibility = await page.locator("#aiwa-mobile-menu").evaluate((el) => getComputedStyle(el).visibility);
    assert.equal(navVisibility, "visible", "Mobile navigation does not open");
    await page.getByRole("button", { name: "Close navigation" }).click();
  }

  // Scroll the sticky stage to its expanded film viewport; use instant
  // positioning to make the test deterministic on slow GitHub runners.
  await page.evaluate(() => {
    const stage = document.querySelector(".aiwa-hero-stage");
    const absoluteTop = stage.getBoundingClientRect().top + window.scrollY;
    const available = stage.offsetHeight - window.innerHeight;
    window.scrollTo({ top: absoluteTop + available * .88, behavior: "instant" });
  });
  await page.waitForTimeout(650);

  const after = await page.evaluate(() => ({
    y: window.scrollY,
    revealClip: getComputedStyle(document.querySelector(".aiwa-reel")).clipPath,
    revealOpacity: getComputedStyle(document.querySelector(".aiwa-reel")).opacity,
    headingOpacity: getComputedStyle(document.querySelector(".aiwa-hero__center")).opacity,
    filmControlOpacity: getComputedStyle(document.querySelector(".aiwa-reel__caption")).opacity,
    overflow: document.documentElement.scrollWidth - window.innerWidth,
  }));

  assert(after.y > 50, "Programmatic scroll did not advance the page");
  assert(Number(after.revealOpacity) >= .9, "Reveal is not visible after scroll");
  assert(Number(after.headingOpacity) < .1, "Heading has not faded beneath expanding film");
  assert(Number(after.filmControlOpacity) > .85, "Full-screen reel control not shown");
  assert(after.overflow <= 2, "Scrolling introduced horizontal overflow");

  await page.screenshot({ path: "test-artifacts/" + label + "-reel.png", fullPage: false });

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(250);
  const reversed = await page.evaluate(() => Number(getComputedStyle(document.querySelector(".aiwa-hero__center")).opacity));
  assert(reversed > .9, "Scroll reversal did not restore the hero title");
  assert.equal(pageErrors.length, 0, "Browser page errors: " + pageErrors.join("\n"));

  await context.close();
  return { label, before, after, reversed };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const results = [];
    results.push(await runCase(browser, "desktop-1440", 1440, 900));
    results.push(await runCase(browser, "mobile-390", 390, 844));
    fs.writeFileSync("test-artifacts/measurements.json", JSON.stringify(results, null, 2));
    console.log("AIWA_HERO_VISUAL_SMOKE_PASS");
    console.log(JSON.stringify(results.map(x => ({ viewport: x.label, before: { overflow: x.before.overflow, tile: x.before.tile }, after: x.after, reversed: x.reversed })), null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error("AIWA_HERO_VISUAL_SMOKE_FAIL", error);
  process.exitCode = 1;
});
