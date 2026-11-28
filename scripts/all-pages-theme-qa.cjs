/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const origin = process.env.AIWA_ORIGIN || "http://127.0.0.1:4173";
const output = process.env.AIWA_THEME_QA_OUTPUT || "test-artifacts/all-pages-theme";

const pages = [
  {id:"about",path:"/about.html",surfaces:[".about-page",".ab-manifesto",".ab-close",".aiwa-footer"],shots:[".ab-hero",".ab-achievements",".ab-values-grid",".ab-close"]},
  {
    id: "home",
    path: "/",
    surfaces: [".aiwa-hero", ".aiwa-specialisms", ".aiwa-about", ".aiwa-work", ".aiwa-footer"],
    shots: [".aiwa-hero", ".aiwa-specialisms", ".aiwa-about", ".aiwa-work", ".aiwa-footer"],
  },
  {
    id: "work",
    path: "/work.html",
    surfaces: [".work-hero", ".work-page__paper", ".work-process", ".work-page__outro", ".aiwa-footer"],
    shots: [".work-hero", ".work-page__paper", ".work-page__outro"],
  },
  {
    id: "work-detail",
    path: "/work/mymo-express.html",
    surfaces: [".case-hero", ".case-context", ".case-idea", ".case-deliverables", ".case-visual-study", ".case-conclusion", ".case-sources", ".case-next", ".case-cta", ".aiwa-footer"],
    shots: [".case-hero", ".case-context", ".case-deliverables", ".case-conclusion"],
  },
  {
    id: "specialisms",
    path: "/specialisms.html",
    surfaces: [".spec-directory__hero", ".spec-directory__gallery", ".spec-directory__promise", ".spec-directory__contact", ".aiwa-footer"],
    shots: [".spec-directory__hero", ".spec-directory__gallery", ".spec-directory__promise"],
  },
  {
    id: "specialism-detail",
    path: "/specialisms/tech.html",
    surfaces: [".tech-hero", ".tech-services", ".tech-iot", ".tech-trust", ".tech-finale", ".spec-detail__pager", ".aiwa-footer"],
    shots: [".tech-hero", ".tech-services", ".tech-iot", ".tech-trust", ".tech-finale"],
  },
  {
    id: "contact",
    path: "/contact.html",
    surfaces: [".aiwa-inner-header", ".contact-intro", ".contact-office", ".contact-outro", ".aiwa-footer"],
    shots: [".contact-intro", ".contact-office", ".contact-outro"],
  },
  {
    id: "privacy",
    path: "/privacy.html",
    surfaces: [".aiwa-inner-header", ".aiwa-legal", ".aiwa-footer"],
    shots: [".aiwa-legal"],
  },
  {
    id: "terms",
    path: "/terms.html",
    surfaces: [".aiwa-inner-header", ".aiwa-legal", ".aiwa-footer"],
    shots: [".aiwa-legal"],
  },
  {
    id: "not-found",
    path: "/_not-found.html",
    surfaces: [".aiwa-inner-header", ".aiwa-not-found", ".aiwa-footer"],
    shots: [".aiwa-not-found"],
  },
];

function rgb(value) {
  const match = value.match(/[\d.]+/g);
  return match ? match.slice(0, 3).map(Number) : null;
}

function luminance([r, g, b]) {
  const parts = [r, g, b].map((value) => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * parts[0] + 0.7152 * parts[1] + 0.0722 * parts[2];
}

function contrast(foreground, background) {
  const fg = luminance(foreground);
  const bg = luminance(background);
  return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
}

async function inspect(browser, config, theme, viewport, capture) {
  const context = await browser.newContext({ viewport, reducedMotion: "reduce", colorScheme: theme });
  const page = await context.newPage();
  await page.addInitScript((selectedTheme) => localStorage.setItem("theme", selectedTheme), theme);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(origin + config.path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction((selectedTheme) => document.documentElement.classList.contains(selectedTheme), theme);
  assert.equal(await page.locator(".aiwa-theme-toggle").count(), 1, `${config.id}: theme toggle missing`);

  const values = {};
  for (const selector of config.surfaces) {
    const locator = page.locator(selector).first();
    assert.equal(await locator.count(), 1, `${config.id}: missing ${selector}`);
    values[selector] = await locator.evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, color: style.color };
    });
    const foreground = rgb(values[selector].color);
    const background = rgb(values[selector].background);
    assert(foreground && background, `${config.id} ${selector}: unresolved colours`);
    assert(contrast(foreground, background) >= 4.2,
      `${config.id} ${theme} ${selector}: contrast ${contrast(foreground, background).toFixed(2)}`);
  }
  // Check descendants too: a themed section can still contain fixed-color links.
  if (config.id === "home") {
    const surface = rgb(values[".aiwa-specialisms"].background);
    const rows = page.locator(".aiwa-specialisms__row");
    assert.equal(await rows.count(), 6, "home: missing Specialisms rows");
    for (const selector of [".aiwa-specialisms__row", ".aiwa-specialisms__name", ".aiwa-specialisms__all"]) {
      const colors = await page.locator(selector).evaluateAll(elements =>
        elements.map(element => getComputedStyle(element).color));
      assert(colors.length > 0, `home: missing ${selector}`);
      for (const color of colors) {
        assert(rgb(color) && contrast(rgb(color), surface) >= 4.5,
          `home ${theme} ${selector}: insufficient text contrast (${color})`);
      }
    }
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  assert(overflow <= 2, `${config.id} ${theme}: horizontal overflow ${overflow}px`);
  assert.equal(errors.length, 0, `${config.id} ${theme}: ${errors.join("; ")}`);

  if (capture) {
    for (let index = 0; index < config.shots.length; index += 1) {
      const selector = config.shots[index];
      await page.locator(selector).first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(80);
      await page.screenshot({
        path: path.join(output, `${viewport.width}x${viewport.height}-${config.id}-${theme}-${index + 1}.png`),
        fullPage: false,
      });
    }
  }
  await context.close();
  return values;
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const systemChromium = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  const browser = await chromium.launch({
    headless: true,
    ...(systemChromium ? { executablePath: systemChromium } : {}),
  });
  const report = {};
  try {
    for (const config of pages) {
      const dark = await inspect(browser, config, "dark", { width: 1440, height: 900 }, true);
      const light = await inspect(browser, config, "light", { width: 1440, height: 900 }, true);
      for (const selector of config.surfaces) {
        assert.notEqual(dark[selector].background, light[selector].background,
          `${config.id} ${selector}: surface did not change between themes`);
        assert.notEqual(dark[selector].color, light[selector].color,
          `${config.id} ${selector}: text did not change between themes`);
      }
      const darkMobile = await inspect(browser, config, "dark", { width: 390, height: 844 }, false);
      const lightMobile = await inspect(browser, config, "light", { width: 390, height: 844 }, false);
      report[config.id] = { dark, light, darkMobile, lightMobile };
    }
    fs.writeFileSync(path.join(output, "report.json"), JSON.stringify(report, null, 2));
    console.log(`AIWA_ALL_PAGES_THEME_PASS pages=${pages.length} modes=2 viewports=2 surfaces=${pages.reduce((sum, page) => sum + page.surfaces.length, 0)}`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
