/* Focused browser regression for the Muscat Futurecraft homepage direction. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require("playwright");

const ORIGIN = process.env.AIWA_TEST_ORIGIN || "http://127.0.0.1:4173";
const URL = ORIGIN + "/home-2.html";
const OUTPUT = "test-artifacts/home-2";
fs.mkdirSync(OUTPUT, { recursive: true });

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

async function inspect(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") errors.push(message.text());
  });

  const response = await page.goto(URL, { waitUntil: "networkidle", timeout: 30_000 });
  assert(response?.ok(), viewport.name + ": /home-2 did not load");
  await page.locator(".aiwa-home2").waitFor({ state: "visible" });
  await page.locator(".aiwa-home2__landscape img").waitFor({ state: "visible" });

  const initial = await page.evaluate(() => {
    const rect = selector => document.querySelector(selector)?.getBoundingClientRect().toJSON();
    const imageState = selector => {
      const image = document.querySelector(selector);
      return { complete: image?.complete, width: image?.naturalWidth };
    };
    return {
      title: document.title,
      heading: document.querySelector("h1")?.innerText,
      hero: rect(".aiwa-home2"),
      film: rect(".aiwa-home2__film"),
      landscape: imageState(".aiwa-home2__landscape img"),
      portrait: imageState(".aiwa-home2__film img"),
      overflow: document.documentElement.scrollWidth - innerWidth,
    };
  });

  assert.match(initial.title, /Muscat Futurecraft/);
  assert.match(initial.heading, /MADE IN MUSCAT/);
  assert.match(initial.heading, /BUILT TO MOVE CULTURE/);
  assert(initial.hero.height >= viewport.height - 2, viewport.name + ": hero must own the first fold");
  assert(initial.film.width > 120 && initial.film.height > 160, viewport.name + ": film portrait collapsed");
  assert(initial.landscape.complete && initial.landscape.width > 1000, viewport.name + ": landscape asset failed");
  assert(initial.portrait.complete && initial.portrait.width > 700, viewport.name + ": portrait asset failed");
  assert(initial.overflow <= 1, viewport.name + ": horizontal overflow detected");

  await page.screenshot({ path: OUTPUT + "/" + viewport.name + "-hero.png", fullPage: false });

  if (viewport.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    assert(await page.getByRole("navigation", { name: "Mobile navigation" }).isVisible(),
      "Mobile navigation did not open");
    await page.screenshot({ path: OUTPUT + "/mobile-navigation.png", fullPage: false });
    await page.getByRole("button", { name: "Close navigation" }).click();
  }

  await page.getByRole("button", { name: "Play the Aiwa Media Group film" }).click();
  await page.waitForTimeout(700);
  assert(await page.getByRole("dialog").isVisible(), viewport.name + ": film dialog did not open");
  await page.screenshot({ path: OUTPUT + "/" + viewport.name + "-film.png", fullPage: false });
  await page.keyboard.press("Escape");

  const browserErrors = errors.filter(message =>
    !message.includes("youtube.com") &&
    !message.includes("googlevideo.com") &&
    !message.includes("ERR_BLOCKED_BY_CLIENT") &&
    !message.includes("compute-pressure is not allowed")
  );
  assert.deepEqual(browserErrors, [], viewport.name + ": browser errors: " + browserErrors.join(" | "));
  await context.close();
  return initial;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    for (const viewport of viewports) results.push({ viewport: viewport.name, ...(await inspect(browser, viewport)) });
    fs.writeFileSync(OUTPUT + "/measurements.json", JSON.stringify({ results }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
