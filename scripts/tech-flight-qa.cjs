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

const only = process.env.TECH_QA_ONLY;
const skip = n => only && only !== String(n);
(async () => {
  const browser = await chromium.launch({ headless: true, args: ["--disable-dev-shm-usage"] });
  try {
    // --- Task 2: mode detection and runtime lifecycle
    s2: {
    if (skip(2)) break s2;
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
    }
    // --- Task 3: shell and hero
    s3: {
    if (skip(3)) break s3;
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
    }
    // --- Task 4: flight wall and static gallery
    s4: {
    if (skip(4)) break s4;
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
        assert.equal(await page.locator(".tech-flight__kicker").count(), 0, "no 01 / SELECTED SCREENS kicker");
        const hud = page.locator("[data-station]");
        assert.equal(await hud.evaluate(n => getComputedStyle(n).visibility), "hidden", "service card is hidden before the flight starts");
        // the heading never sits on top of a screen at the overview
        const clash = await page.evaluate(() => { const h = document.querySelector(".tech-flight__intro h2").getBoundingClientRect(); return [...document.querySelectorAll(".tech-wall__tile")].filter(t => { const r = t.getBoundingClientRect(); return r.left < h.right && r.right > h.left && r.top < h.bottom && r.bottom > h.top; }).map(t => t.dataset.slug); });
        assert.deepEqual(clash, [], "heading overlaps wall tiles: " + clash.join(","));
        const first = (await hud.textContent()).trim();
        await page.evaluate(g => window.scrollTo(0, g.top + g.len * 0.3), geometry);
        await page.waitForFunction(t => { const n = document.querySelector("[data-station]"); return getComputedStyle(n).visibility === "visible" && n.textContent.trim() !== t; }, first);
        const mid = (await hud.innerText()).trim();
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
    }
    // --- Task 16: wall tiles are clickable at every desktop size, and scrolling cannot get stuck
    s16: {
    if (skip(16)) break s16;
    for (const [width, height] of [[1440, 900], [1600, 900], [1910, 1047], [1979, 862]]) {
      const { context, page, errors } = await open(browser, { width, height });
      await page.waitForFunction(() => document.querySelector("[data-flight-mode]").dataset.flightMode === "fly");
      await toOverview(page);
      const misses = await page.evaluate(() => [...document.querySelectorAll(".tech-wall__tile")].filter(t => {
        const b = t.getBoundingClientRect();
        const pts = [[.5, .5], [.2, .25], [.8, .25], [.2, .75], [.8, .75]].map(([fx, fy]) => [b.left + b.width * fx, b.top + b.height * fy]);
        return !pts.some(([x, y]) => { const e = document.elementFromPoint(x, y); return e && e.closest(".tech-wall__tile") === t; });
      }).map(t => t.dataset.slug));
      assert.deepEqual(misses, [], `${width}x${height}: wall tiles that cannot be hit: ${misses.join(", ")}`);
      await page.locator('.tech-wall__tile[data-slug="gwi"]').click();
      await page.waitForFunction(() => document.querySelector("dialog[data-tech-modal]").open, null, { timeout: 5000 });
      await page.keyboard.press("Escape");
      await page.waitForFunction(() => !document.querySelector("dialog[data-tech-modal]").open);
      // after the popup closes the page must scroll again (the popup pauses smooth scrolling while open)
      await page.mouse.move(width / 2, height / 2);
      const y0 = await page.evaluate(() => Math.round(scrollY));
      for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 200); await page.waitForTimeout(80); }
      await page.waitForTimeout(500);
      assert.ok((await page.evaluate(() => Math.round(scrollY))) - y0 > 400, `${width}x${height}: page scrolls after closing the popup`);
      // if smooth scrolling is ever left paused without a popup, the first wheel event revives it
      await page.evaluate(() => window.__techFlightDebug.stopLenis());
      const y1 = await page.evaluate(() => Math.round(scrollY));
      for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 200); await page.waitForTimeout(80); }
      await page.waitForTimeout(500);
      assert.ok((await page.evaluate(() => Math.round(scrollY))) - y1 > 400, `${width}x${height}: a stalled smooth scroller recovers on the next wheel`);
      assert.deepEqual(errors, [], "page errors");
      await context.close();
    }
    }
    // --- Task 5: project popup
    s5: {
    if (skip(5)) break s5;
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
    }
    // --- Task 6: service scenes and deep links
    s6: {
    if (skip(6)) break s6;
    const serviceNames = ["Web & app development", "SaaS & business software", "Cloud & DevOps", "Professional & dedicated email hosting", "AI & business automation", "IoT & connected hardware"];
    for (const [width, height] of [[1440, 900], [390, 844]]) {
      const { context, page } = await open(browser, { width, height });
      assert.equal(await page.locator('#dev-services[data-tech-section="services"]').count(), 1, "services section");
      assert.deepEqual(await page.locator("#dev-services > .tech-scene, #dev-services .tech-scenes > .tech-scene").evaluateAll(n => n.map(x => x.id)), ["dev-web", "dev-software", "dev-cloud", "dev-email", "dev-ai", "dev-iot"], "scene order");
      const names = (await page.locator("#dev-services .tech-scene h3").allInnerTexts()).map(t => t.trim().toLowerCase());
      serviceNames.forEach((n, i) => assert.equal(names[i], n.toLowerCase(), "scene name " + n));
      assert.equal(await page.locator("#dev-services details").count(), 0, "no accordion in scenes");
      const art = page.locator("#dev-iot img.tech-scene__art-img");
      assert.equal(await art.count(), 2, "IoT scene carries the light and dark motion illustration");
      assert.deepEqual((await art.evaluateAll(n => n.map(x => new URL(x.src).pathname))).sort(), ["/media/development/aiwa-fluid-intelligence-dark.svg", "/media/development/aiwa-fluid-intelligence.svg"], "IoT scene art sources");
      assert.ok((await art.first().getAttribute("alt"))?.length > 40, "IoT art has a real description");
      assert.equal(await page.locator("#dev-iot .dev-diagram").count(), 0, "diagram replaced by the illustration");
      await page.locator("#dev-iot").scrollIntoViewIfNeeded();
      await page.waitForFunction(() => [...document.querySelectorAll("#dev-iot img.tech-scene__art-img")].filter(i => getComputedStyle(i).display !== "none").every(i => i.complete && i.naturalWidth > 0), null, { timeout: 15000 });
      const shown = () => page.locator("#dev-iot img.tech-scene__art-img").evaluateAll(n => n.filter(x => getComputedStyle(x).display !== "none").map(x => x.dataset.theme));
      assert.deepEqual(await shown(), ["dark"], "dark theme shows the dark illustration");
      await page.locator(".aiwa-theme-toggle").click();
      await page.waitForFunction(() => document.documentElement.classList.contains("light"));
      assert.deepEqual(await shown(), ["light"], "light theme shows the light illustration");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 0, true, "IoT art does not overflow");
      assert.equal(await page.locator('#dev-iot a[href="#dev-connected"]').count(), 1, "IoT scene links to the IoT section");
      assert.equal(await page.locator('#dev-web a[href="/contact#enquiries"]').count(), 1, "contact CTA");
      await context.close();
      for (const hash of ["#dev-email", "#dev-ai", "#dev-connected"]) {
        const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: "no-preference" });
        const p = await ctx.newPage();
        await p.goto(origin + route + hash, { waitUntil: "networkidle" });
        await p.waitForTimeout(2200);
        const top = await p.evaluate(h => document.querySelector(h).getBoundingClientRect().top, hash);
        assert.ok(top >= -2 && top < 260, `${width} ${hash}: target at top of viewport (got ${Math.round(top)})`);
        await ctx.close();
      }
    }
    }
    // --- Task 7: IoT, trust and finale
    s7: {
    if (skip(7)) break s7;
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
    }
    // --- Task 9: calligraphy and ink layer
    s9: {
    if (skip(9)) break s9;
    {
      const fly = await open(browser, { width: 1440, height: 900 });
      await fly.page.waitForFunction(() => document.querySelector("[data-flight-mode]").dataset.flightMode === "fly");
      await fly.page.waitForSelector(".tech-ink-field canvas", { timeout: 8000 });
      assert.equal(await fly.page.locator(".tech-ink-field canvas").count(), 1, "fly mode mounts the WebGL ink layer");
      assert.deepEqual(fly.errors, [], "ink layer page errors");
      await fly.context.close();
      for (const [width, height, reduced] of [[390, 844, false], [1440, 900, true]]) {
        const { context, page } = await open(browser, { width, height, reduced });
        await page.waitForTimeout(600);
        assert.equal(await page.locator(".tech-ink-field canvas").count(), 0, "static mode never mounts WebGL");
        await context.close();
      }
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      await ctx.addInitScript(() => { HTMLCanvasElement.prototype.getContext = () => null; });
      const page = await ctx.newPage();
      const errors = []; page.on("pageerror", e => errors.push(e.message));
      await page.goto(origin + route, { waitUntil: "networkidle" });
      await page.waitForTimeout(1200);
      assert.equal(await page.locator('[data-tech-section="finale"]').count(), 1, "page renders without WebGL");
      assert.deepEqual(errors, [], "no errors when WebGL is unavailable");
      await ctx.close();
    }
    const inkWords = await (async () => { const { context, page } = await open(browser, { width: 1440, height: 900 }); const n = await page.locator("svg.tech-ink").count(); await context.close(); return n; })();
    if (!inkWords) throw new Error("calligraphy artwork is supplied, so the Development page must render it");
    for (const reduced of [true, false]) {
      const { context, page, errors } = await open(browser, { width: 1440, height: 900, reduced });
      for (const ink of await page.locator("svg.tech-ink").all()) {
        assert.equal(await ink.getAttribute("aria-hidden"), "true", "calligraphy is decorative");
        assert.equal(await ink.locator("a,button,[tabindex]").count(), 0, "calligraphy has no focusable children");
      }
      assert.deepEqual(await page.locator("svg.tech-ink").evaluateAll(n => n.map(x => x.dataset.ink).sort()), ["engineering", "innovation", "oman", "programming", "tech"], "calligraphy placements");
      const tone = await page.locator("svg.tech-ink--header").first().evaluate(n => getComputedStyle(n).color);
      const [r, g, b] = tone.match(/\d+/g).map(Number);
      assert.ok(Math.abs(r - g) < 6 && Math.abs(g - b) < 6 && r > 100 && r < 180, "dark theme: black artwork is greyed (got " + tone + ")");
      const hero = page.locator(".tech-hero svg.tech-ink").first();
      if (reduced) {
        assert.notEqual(await hero.getAttribute("data-state"), "armed", "reduced motion: finished word shows");
      } else {
        // The hero word writes itself on load: sample the pen stroke while it draws.
        const fresh = await context.newPage();
        await fresh.goto(origin + route, { waitUntil: "commit" });
        await fresh.waitForSelector(".tech-hero svg.tech-ink [data-pen]", { state: "attached" });
        const samples = [];
        for (let i = 0; i < 16; i++) { samples.push(await fresh.evaluate(() => parseFloat(getComputedStyle(document.querySelector(".tech-hero svg.tech-ink [data-pen]")).strokeDashoffset) || 0)); await fresh.waitForTimeout(300); }
        assert.ok(Math.max(...samples) > 0, "pen stroke starts hidden");
        assert.equal(samples[samples.length - 1], 0, "pen stroke finishes fully drawn");
        assert.ok(samples.some((v, i) => i && v < samples[i - 1]), "pen stroke progresses over time");
        await fresh.close();
        const [ink, paper] = await page.evaluate(() => { const c = getComputedStyle(document.querySelector(".spec-detail--tech")); return [c.getPropertyValue("--t-ink"), c.getPropertyValue("--t-bg")]; });
        assert.ok(ink && paper, "tokens resolve");
      }
      assert.deepEqual(errors, [], "calligraphy page errors");
      await context.close();
    }
    }
    // --- Task 13: Industrial IoT strip (side-by-side cards, horizontal on scroll, counter-moving backdrop)
    s13: {
    if (skip(13)) break s13;
    for (const [width, height, reduced] of [[1440, 900, false], [390, 844, false], [1440, 900, true]]) {
      const { context, page, errors } = await open(browser, { width, height, reduced });
      const fly = width >= 900 && !reduced;
      await page.waitForFunction(m => document.querySelector("[data-flight-mode]").dataset.flightMode === m, fly ? "fly" : "static");
      const cards = page.locator("#dev-connected .dev-iot-card");
      assert.equal(await cards.count(), 4, "four IoT cards");
      assert.equal(await page.locator("#dev-connected .tech-iot-card__hook").count(), 4, "each card has a selling hook");
      for (const hook of await page.locator("#dev-connected .tech-iot-card__hook").allInnerTexts()) assert.ok(hook.trim().length > 6, "hook has copy");
      const rowTops = await cards.evaluateAll(n => n.map(x => x.offsetTop));
      assert.ok(Math.max(...rowTops) - Math.min(...rowTops) <= 2, "cards sit side by side in one row");
      const track = page.locator("#dev-connected .tech-iot__track");
      assert.equal(await track.count(), 1, "IoT track");
      if (fly) {
        await page.waitForFunction(() => document.querySelector("#dev-connected")?.parentElement?.classList.contains("pin-spacer"), null, { timeout: 8000 });
        const geo = await page.evaluate(() => { const sp = document.querySelector("#dev-connected").parentElement; const sec = document.querySelector("#dev-connected"); return { top: sp.getBoundingClientRect().top + scrollY, len: sp.offsetHeight - sec.offsetHeight, secH: sec.offsetHeight, vh: innerHeight }; });
        assert.ok(geo.len <= geo.vh * 2.4, `pinned scroll length stays short (${geo.len}px)`);
        assert.ok(geo.secH <= geo.vh, "the pinned strip fits the viewport");
        const reading = () => page.evaluate(() => ({ card: document.querySelector("#dev-connected .dev-iot-card").getBoundingClientRect().left, ghost: new DOMMatrix(getComputedStyle(document.querySelector("#dev-connected .tech-iot__ghost")).transform).m41 }));
        await page.evaluate(g => scrollTo(0, g.top - 84), geo);
        await page.waitForTimeout(1600);
        const start = await reading();
        await page.evaluate(g => scrollTo(0, g.top - 84 + g.len * 0.7), geo);
        await page.waitForTimeout(1800);
        const later = await reading();
        assert.ok(later.card < start.card - 120, `cards move left as you scroll (${start.card} -> ${later.card})`);
        assert.ok(later.ghost > start.ghost + 40, `backdrop moves the opposite way (${start.ghost} -> ${later.ghost})`);
        await page.screenshot({ path: `${output}/iot-strip-${width}.png` });
      } else {
        assert.equal(await page.locator(".pin-spacer").evaluateAll(n => n.some(x => x.querySelector("#dev-connected"))), false, "no pin for the IoT strip");
        const t = await track.evaluate(n => { const cs = getComputedStyle(n); return { ox: cs.overflowX, snap: cs.scrollSnapType, scroll: n.scrollWidth > n.clientWidth, tab: n.getAttribute("tabindex"), card: n.querySelector(".dev-iot-card").getBoundingClientRect().width }; });
        assert.equal(t.ox, "auto", "swipeable row"); assert.match(t.snap, /x/, "snaps horizontally"); assert.ok(t.scroll, "row is wider than the screen");
        assert.equal(t.tab, "0", "keyboard users can scroll the row");
        assert.ok(t.card >= Math.min(300, width * 0.7), "card is large enough to read");
        await page.locator("#dev-connected").scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${output}/iot-strip-${width}${reduced ? "-reduced" : ""}.png` });
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 0, true, "IoT strip causes no page overflow");
      assert.deepEqual(errors, [], "page errors");
      await context.close();
    }
    }
    // --- Task 14: decluttered hero and PCB signal graphic
    s14: {
    if (skip(14)) break s14;
    for (const [width, height, reduced] of [[1440, 900, false], [390, 844, false], [1440, 900, true]]) for (const scheme of ["dark", "light"]) {
      const { context, page, errors } = await open(browser, { width, height, scheme, reduced });
      const hero = page.locator('[data-tech-section="hero"]');
      const text = (await hero.innerText()).replace(/\s+/g, " ").toUpperCase();
      for (const gone of ["ALL SPECIALISMS", "AIWA / DEVELOPMENT", "ENGINEERED FOR PEOPLE", "ENGINEERING / MUSCAT"]) assert.ok(!text.includes(gone), "removed from the hero: " + gone);
      assert.ok(text.includes("AIWA DEVELOPMENT / MUSCAT, OMAN"), "kicker kept");
      assert.equal(await hero.locator(".tech-hero__nav, .tech-hero__foot").count(), 0, "no nav or footer rows in the hero");
      const h1 = await hero.locator("h1").evaluate(n => { const r = n.getBoundingClientRect(); return { w: r.width, h: r.height, text: n.textContent.trim() }; });
      assert.equal(h1.text, "Development", "h1 stays for structure");
      assert.ok(h1.w <= 2 && h1.h <= 2, "h1 is visually hidden");
      const pcb = hero.locator(".tech-hero__pcb");
      assert.equal(await pcb.getAttribute("aria-hidden"), "true", "PCB art is decorative");
      const visible = await pcb.locator("svg.tech-pcb").evaluateAll(n => n.filter(x => getComputedStyle(x).display !== "none").map(x => x.dataset.layout));
      assert.deepEqual(visible, [width >= 700 ? "wide" : "tall"], "one PCB composition per screen shape");
      const art = pcb.locator(`svg.tech-pcb[data-layout="${visible[0]}"]`);
      assert.ok(await art.locator(".tech-pcb__trace").count() >= 24, "enough traces to read as a board");
      assert.ok(await art.locator(".tech-pcb__pulse").count() >= 8, "several signals travel the traces");
      const baseOpacity = await art.locator(".tech-pcb__trace").first().evaluate(n => parseFloat(getComputedStyle(n).strokeOpacity));
      assert.ok(baseOpacity <= 0.2, "traces are blended into the background (opacity " + baseOpacity + ")");
      const pulse = art.locator(".tech-pcb__pulse").first();
      if (reduced) {
        assert.equal(await pulse.evaluate(n => getComputedStyle(n).animationName), "none", "reduced motion: signals do not travel");
      } else {
        const offset = () => pulse.evaluate(n => parseFloat(getComputedStyle(n).strokeDashoffset));
        const a = await offset(); await page.waitForTimeout(700); const b = await offset();
        assert.notEqual(a, b, "the signal is travelling along the trace");
        await page.evaluate(() => document.querySelector("#dev-services").scrollIntoView());
        await page.waitForTimeout(500);
        assert.equal(await pulse.evaluate(n => getComputedStyle(n).animationPlayState), "paused", "animation pauses when the hero is offscreen");
        await page.evaluate(() => scrollTo(0, 0));
        await page.waitForTimeout(500);
        assert.equal(await pulse.evaluate(n => getComputedStyle(n).animationPlayState), "running", "animation resumes when the hero returns");
      }
      const clipped = await hero.locator(".tech-hero__headline").evaluate(n => n.scrollWidth > n.clientWidth + 1);
      assert.equal(clipped, false, "headline not clipped");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 0, true, "hero overflow");
      if (!reduced) { await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(1200); await page.screenshot({ path: `${output}/hero2-${width}-${scheme}.png` }); }
      assert.deepEqual(errors, [], "page errors");
      await context.close();
    }
    }
    // --- Task 15: Arabic placements, balanced IoT cards, ecosystem logos
    s15: {
    if (skip(15)) break s15;
    const box = (page, sel) => page.locator(sel).first().evaluate(n => { const r = n.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top + scrollY, b: r.bottom + scrollY, w: r.width, h: r.height }; });
    const hit = (a, b) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;
    for (const [width, height] of [[1440, 900], [390, 844]]) for (const scheme of ["dark", "light"]) {
      const { context, page, errors } = await open(browser, { width, height, scheme });
      const vw = width;
      // hero: the Arabic word sits below the paragraph, clear of every other element
      const ink = await box(page, ".tech-hero svg.tech-ink");
      for (const sel of [".tech-hero__kicker", ".tech-hero__headline", ".tech-hero__bottom>p", ".tech-hero__bottom>a"]) assert.ok(!hit(ink, await box(page, sel)), `hero Arabic collides with ${sel}`);
      assert.ok(ink.t >= (await box(page, ".tech-hero__bottom")).b - 2, "hero Arabic sits below the paragraph row");
      assert.ok(ink.l < vw * 0.5, "hero Arabic is at the left");
      assert.equal(await page.locator(".tech-hero .tech-hero__ink svg.tech-ink").count(), 0, "hero Arabic no longer floats in the background layer");
      // our specialisms: Arabic replaces the English line on the right
      assert.equal(await page.getByText("One technology team", { exact: false }).count(), 0, "English line removed from the specialisms header");
      const sInk = await box(page, ".tech-services__head svg.tech-ink");
      if (width >= 900) assert.ok((sInk.l + sInk.r) / 2 > vw * 0.62, "specialisms Arabic sits on the right");
      // managed technology
      assert.equal(await page.getByText("Launching a product", { exact: false }).count(), 0, "English line removed from managed technology");
      const mInk = await box(page, ".dev-managed .tech-chapter svg.tech-ink");
      if (width >= 900) assert.ok((mInk.l + mInk.r) / 2 > vw * 0.62, "managed technology Arabic sits on the right");
      // finale: top right, clear of the heading and the CTA
      const fin = await box(page, '[data-tech-section="finale"]'), fInk = await box(page, ".tech-finale__ink svg.tech-ink");
      assert.ok(fInk.t - fin.t < fin.h * 0.4 && (fInk.l + fInk.r) / 2 > vw * 0.5, "finale Arabic is at the top right");
      for (const sel of ["#dev-finale-title", ".tech-finale__cta"]) assert.ok(!hit(fInk, await box(page, sel)), `finale Arabic collides with ${sel}`);
      // IoT scene 06 shares the 50/50 style split with the other scenes
      if (width >= 900) {
        for (const id of ["dev-web", "dev-software", "dev-cloud", "dev-email", "dev-ai", "dev-iot"]) {
          const v = await box(page, `#${id} .tech-scene__visual`), t = await box(page, `#${id} .tech-scene__text`);
          assert.ok(Math.abs(v.w - t.w) <= Math.max(v.w, t.w) * 0.04, `${id}: image and text columns split 50/50 (${Math.round(v.w)} vs ${Math.round(t.w)})`);
        }
        assert.equal(await page.locator("#dev-iot.tech-scene--feature").count(), 0, "IoT scene is no longer a full-width feature");
      }
      // IoT cards carry a balanced amount of copy
      const copy = await page.locator("#dev-connected .tech-iot-card__copy").allInnerTexts();
      const lens = copy.map(t => t.trim().length);
      assert.ok(Math.max(...lens) - Math.min(...lens) <= 24, "IoT card copy is balanced: " + lens.join("/"));
      const hooks = await page.locator("#dev-connected .tech-iot-card__hook").allInnerTexts();
      assert.ok(Math.max(...hooks.map(t => t.length)) - Math.min(...hooks.map(t => t.length)) <= 10, "IoT hooks are balanced");
      // ecosystem: real logos
      const vendors = page.locator(".dev-vendors article");
      assert.equal(await vendors.count(), 4);
      for (const slug of ["cloudflare", "oracle", "byteplus", "gallabox"]) assert.equal(await page.locator(`.dev-vendors img[src$="/${slug}.svg"]`).count(), 1, slug + " logo");
      for (const slug of ["aws", "google-cloud", "oracle"]) assert.ok(await page.locator(`.dev-certifications img[src$="/${slug}.svg"]`).count() >= 1, slug + " certification logo");
      await page.locator(".dev-vendors").scrollIntoViewIfNeeded();
      await page.waitForFunction(() => [...document.querySelectorAll(".dev-vendors img, .dev-certifications img")].every(i => i.complete && i.naturalWidth > 0), null, { timeout: 15000 });
      // owner request: these disclaimer and source-note texts are not shown on the page
      const body = (await page.locator("body").innerText()).replace(/\s+/g, " ").toLowerCase();
      for (const gone of ["illustrated system concepts, not photographs or screenshots of installations", "trademarks of their respective owners", "source notes / service scope", "capabilities reflect aiwa's published service information", "illustrated system concept / sample data"]) assert.ok(!body.includes(gone), "removed from the page: " + gone);
      assert.equal(await page.locator(".spec-detail__sources").count(), 0, "no source-notes block on the Development page");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 0, true, "overflow");
      if (scheme === "dark" || width < 900) { await page.locator(".dev-vendors").scrollIntoViewIfNeeded(); await page.screenshot({ path: `${output}/ecosystem-${width}-${scheme}.png` }); }
      assert.deepEqual(errors, [], "page errors");
      await context.close();
    }
    }
    console.log("AIWA_TECH_FLIGHT_QA_PASS");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
