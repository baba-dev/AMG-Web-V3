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
  if (scheme === "light") {
    await page.locator(".aiwa-theme-toggle").click();
    await page.waitForFunction(() => document.documentElement.classList.contains("light"));
  }
  return { context, page, errors };
}
async function toOverview(page) {
  if (await page.locator(".pin-spacer").count()) { await page.evaluate(() => { const sp = document.querySelector(".pin-spacer"); scrollTo(0, sp.getBoundingClientRect().top + scrollY - 84); }); await page.waitForTimeout(1500); }
  else await page.locator("#dev-flight").scrollIntoViewIfNeeded();
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
    // --- Task 4: flight wall and static gallery
    const inventory = require("../docs/technology-portfolio/media-inventory.json");
    const expectedSlugs = inventory.projects.map(p => p.slug).sort();
    for (const [width, height] of [[1440, 900], [390, 844]]) for (const scheme of ["light", "dark"]) {
      const { context, page, errors } = await open(browser, { width, height, scheme });
      const expected = width >= 900 ? "fly" : "static";
      await page.waitForFunction(m => document.querySelector("[data-flight-mode]").dataset.flightMode === m, expected);
      const order = await page.locator("[data-tech-section]").evaluateAll(n => n.map(x => x.dataset.techSection));
      assert.deepEqual(order.slice(0, 2), ["hero", "flight"], "flight follows hero");
      const tiles = page.locator(".tech-wall__tile");
      assert.equal(await tiles.count(), 18, "18 wall tiles");
      assert.deepEqual((await tiles.evaluateAll(n => n.map(x => x.dataset.slug))).sort(), expectedSlugs, "tile slugs");
      for (const label of await tiles.evaluateAll(n => n.map(x => x.getAttribute("aria-label")))) assert.ok(label && label.length > 3, "tile accessible name");
      assert.equal(await tiles.first().getAttribute("href"), "/work/technology/aiwa-creators");
      await page.locator("#dev-flight").scrollIntoViewIfNeeded();
      await page.waitForFunction(() => [...document.querySelectorAll(".tech-wall__tile img")].every(i => i.complete && i.naturalWidth > 0), null, { timeout: 15000 }).catch(async () => {
        // lazy images outside the viewport in static mode: walk the gallery
        for (const t of await tiles.all()) await t.scrollIntoViewIfNeeded();
        await page.waitForFunction(() => [...document.querySelectorAll(".tech-wall__tile img")].every(i => i.complete && i.naturalWidth > 0), null, { timeout: 15000 });
      });
      if (expected === "static") {
        assert.equal(await page.locator(".pin-spacer").count(), 0, "static: no pin spacer");
        assert.equal(await page.locator(".tech-wall__world").evaluate(n => getComputedStyle(n).transform), "none", "static: no 3D transform");
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 0, true, "static overflow");
      } else {
        await page.waitForSelector(".pin-spacer");
        const geometry = await page.evaluate(() => { const sp = document.querySelector(".pin-spacer"); return { top: sp.getBoundingClientRect().top + scrollY, len: sp.offsetHeight - innerHeight }; });
        const first = (await page.locator("[data-station]").innerText()).trim();
        await page.evaluate(g => window.scrollTo(0, g.top + g.len * 0.3), geometry);
        await page.waitForFunction(t => document.querySelector("[data-station]").innerText.trim() !== t, first);
        const mid = (await page.locator("[data-station]").innerText()).trim();
        assert.notEqual(mid, first, "station label changes along the flight");
        await page.screenshot({ path: `${output}/flight-30-${scheme}.png` });
        await page.evaluate(g => window.scrollTo(0, g.top + g.len * 0.75), geometry);
        await page.waitForTimeout(1400);
        await page.screenshot({ path: `${output}/flight-75-${scheme}.png` });
        await page.evaluate(g => window.scrollTo(0, g.top), geometry);
        await page.waitForTimeout(1400);
        await page.screenshot({ path: `${output}/flight-00-${scheme}.png` });
        // keyboard: focusing an off-screen tile brings it into view
        await page.locator(".tech-wall__tile").last().focus();
        await page.waitForTimeout(1500);
        const box = await page.locator(".tech-wall__tile").last().boundingBox();
        assert.ok(box && box.x >= -2 && box.y >= -2 && box.x + box.width <= width + 2 && box.y + box.height <= height + 2, "focused tile is inside the viewport");
      }
      assert.deepEqual(errors, [], "page errors");
      await context.close();
    }
    // --- Task 5: project popup
    for (const [width, height, reduced] of [[1440, 900, false], [390, 844, false], [1440, 900, true]]) {
      const { context, page, errors } = await open(browser, { width, height, reduced });
      const dialog = page.locator("dialog[data-tech-modal]");
      assert.equal(await dialog.count(), 1, "single popup element");
      assert.equal(await dialog.evaluate(d => d.open), false, "closed by default");
      await toOverview(page);
      const tile = page.locator('.tech-wall__tile[data-slug="gwi"]');
      if (width < 900 || reduced) await tile.scrollIntoViewIfNeeded();
      await tile.click();
      await page.waitForFunction(() => document.querySelector("dialog[data-tech-modal]").open);
      assert.match(await dialog.locator("h2").innerText(), /Global Wealth Investments/i);
      assert.equal(await dialog.evaluate(d => d.contains(document.activeElement)), true, "focus moves into popup");
      for (let i = 0; i < 10; i++) { await page.keyboard.press("Tab"); assert.equal(await dialog.evaluate(d => d.contains(document.activeElement)), true, "focus stays in popup"); }
      assert.equal(await dialog.locator('a[href="/work/technology/gwi"]').count(), 1, "view project link");
      assert.equal(await dialog.locator('a[href="https://gwi-me.com/"]').count(), 1, "visit site link when website exists");
      if (reduced) assert.equal(await dialog.evaluate(d => d.getAnimations({ subtree: true }).length), 0, "no animation under reduced motion");
      if (!reduced) await page.screenshot({ path: `${output}/popup-${width}.png` });
      await page.keyboard.press("Escape");
      await page.waitForFunction(() => !document.querySelector("dialog[data-tech-modal]").open);
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("data-slug")), "gwi", "focus returns to the opener");
      // a project without a public website offers no Visit site link
      await toOverview(page);
      if (width < 900 || reduced) await page.locator('.tech-wall__tile[data-slug="bababuilds-erp"]').scrollIntoViewIfNeeded();
      await page.locator('.tech-wall__tile[data-slug="bababuilds-erp"]').click();
      await page.waitForFunction(() => document.querySelector("dialog[data-tech-modal]").open);
      assert.equal(await dialog.locator('a[target="_blank"]').count(), 0, "no Visit site link without website");
      await page.locator("dialog[data-tech-modal] button[data-close]").click();
      await page.waitForFunction(() => !document.querySelector("dialog[data-tech-modal]").open);
      assert.deepEqual(errors, [], "page errors");
      await context.close();
    }
    // --- Task 6: service scenes and deep links
    const serviceNames = ["Web & app development", "SaaS & business software", "Cloud & DevOps", "Professional & dedicated email hosting", "AI & business automation", "IoT & connected hardware"];
    for (const [width, height] of [[1440, 900], [390, 844]]) {
      const { context, page } = await open(browser, { width, height });
      assert.equal(await page.locator('#dev-services[data-tech-section="services"]').count(), 1, "services section");
      assert.deepEqual(await page.locator("#dev-services > .tech-scene, #dev-services .tech-scenes > .tech-scene").evaluateAll(n => n.map(x => x.id)), ["dev-web", "dev-software", "dev-cloud", "dev-email", "dev-ai", "dev-iot"], "scene order");
      const names = (await page.locator("#dev-services .tech-scene h3").allInnerTexts()).map(t => t.trim().toLowerCase());
      serviceNames.forEach((n, i) => assert.equal(names[i], n.toLowerCase(), "scene name " + n));
      assert.equal(await page.locator("#dev-services details").count(), 0, "no accordion in scenes");
      assert.equal(await page.locator('#dev-iot a[href="#dev-connected"]').count(), 1, "IoT scene links to the IoT section");
      assert.equal(await page.locator('#dev-web a[href="/contact#enquiries"]').count(), 1, "contact CTA");
      await context.close();
      for (const hash of ["#dev-email", "#dev-ai", "#dev-connected"]) {
        const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: "no-preference" });
        const p = await ctx.newPage();
        await p.goto(origin + route + hash, { waitUntil: "networkidle" });
        await p.waitForTimeout(2200);
        const top = await p.evaluate(h => document.querySelector(h).getBoundingClientRect().top, hash);
        assert.ok(top >= 0 && top < 260, `${width} ${hash}: target at top of viewport (got ${Math.round(top)})`);
        await ctx.close();
      }
    }
    // --- Task 7: IoT, trust and finale
    for (const [width, height, reduced] of [[1440, 900, false], [320, 700, false], [1440, 900, true]]) for (const scheme of ["light", "dark"]) {
      const { context, page, errors } = await open(browser, { width, height, scheme, reduced });
      assert.deepEqual(await page.locator("[data-tech-section]").evaluateAll(n => n.map(x => x.dataset.techSection)), ["hero", "flight", "services", "iot", "trust", "finale"], "section order");
      assert.equal(await page.locator("#dev-connected .dev-iot-card").count(), 4);
      assert.equal(await page.locator(".dev-managed__rows article").count(), 3);
      assert.equal(await page.locator(".dev-vendors article").count(), 4);
      assert.equal(await page.locator(".dev-certifications__marks > div").count(), 3);
      assert.equal(await page.locator(".dev-faq details").count(), 6);
      assert.ok(/centralised, ai-enabled video monitoring/i.test(await page.locator("#dev-connected").innerText()), "central surveillance positioning");
      assert.ok(/dedicated email hosting/i.test(await page.locator("#dev-email").innerText()), "dedicated email hosting");
      const marquee = page.locator(".tech-marquee__track");
      assert.equal(await marquee.count(), 1, "marquee");
      if (!reduced) assert.equal(await marquee.evaluate(n => getComputedStyle(n).animationPlayState), "paused", "marquee paused offscreen");
      await page.locator(".dev-faq details").first().locator("summary").click();
      assert.equal(await page.locator(".dev-faq details").first().evaluate(el => el.open), true);
      assert.equal(await page.locator(".tech-marquee__track li").count() >= 36, true, "marquee lists the project names");
      await marquee.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      if (reduced) assert.equal(await marquee.evaluate(n => getComputedStyle(n).animationName), "none", "reduced motion: marquee static");
      else assert.equal(await marquee.evaluate(n => getComputedStyle(n).animationPlayState), "running", "marquee runs when visible");
      const cta = page.locator('[data-tech-section="finale"] a[href="/contact#enquiries"]');
      assert.equal(await cta.count(), 1, "finale CTA");
      assert.equal(await page.locator('[data-tech-section="finale"] a[href="/work/technology"]').count(), 1, "all technology work link");
      assert.equal(await page.locator(".tech-finale__ink").count(), 1, "finale ink slot");
      const [ctaColor, ctaBg] = await cta.evaluate(n => [getComputedStyle(n).color, getComputedStyle(n).backgroundColor]);
      assert.notEqual(ctaColor, ctaBg, `${scheme}: finale CTA text must differ from its pill`);
      await page.locator('[data-tech-section="finale"]').scrollIntoViewIfNeeded();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 0, true, `${width} ${scheme}: overflow`);
      if (!reduced) { await page.locator("#dev-connected").scrollIntoViewIfNeeded(); await page.waitForTimeout(500); await page.screenshot({ path: `${output}/iot-${width}-${scheme}.png` }); await page.locator(".tech-marquee").scrollIntoViewIfNeeded(); await page.screenshot({ path: `${output}/trust-${width}-${scheme}.png` }); await page.locator('[data-tech-section="finale"]').scrollIntoViewIfNeeded(); await page.screenshot({ path: `${output}/finale-${width}-${scheme}.png` }); }
      assert.deepEqual(errors, [], "page errors");
      await context.close();
    }
    console.log("AIWA_TECH_FLIGHT_QA_PASS");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
