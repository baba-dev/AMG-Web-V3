/* End-to-end motion contract against the exported site (not a Next dev server). */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require("playwright");

const origin = (process.env.AIWA_TEST_URL || "http://127.0.0.1:4173").replace(/\/$/, "");
const out = "test-artifacts/aiwa-signal";
fs.mkdirSync(out, { recursive: true });
const pathIs = (path) => (url) => new URL(url).pathname.replace(/\/$/, "") === path;

async function load(page, pathname) {
  const response = await page.goto(origin + pathname, { waitUntil:"domcontentloaded", timeout:45000 });
  assert.equal(response.status(), 200, "Route " + pathname + " must be exported");
  await page.locator("main").first().waitFor({ state:"visible" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(180);
}
async function settle(page) {
  await page.waitForFunction(() => !document.querySelector(".aiwa-route-stage"), { timeout:7000 });
  await page.waitForFunction(() => !document.documentElement.hasAttribute("data-aiwa-route-phase"));
  assert.equal(await page.evaluate(() => document.documentElement.hasAttribute("data-aiwa-route-phase")), false,
    "Transition phase must clean up");
}
async function overflow(page, context) {
  const delta = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  assert.ok(delta <= 2, context + ": horizontal overflow " + delta);
}
async function assertEditorialType(page, context) {
  const type = await page.locator(".aiwa-route-stage").evaluate((stage) => {
    const word = stage.querySelector(".aiwa-route-stage__wordmark");
    const masthead = stage.querySelector(".aiwa-route-stage__masthead");
    const title = stage.querySelector(".aiwa-route-stage__destination");
    const bottom = stage.querySelector(".aiwa-route-stage__bottom");
    const top = stage.querySelector(".aiwa-route-stage__top");
    const stack = stage.querySelector(".aiwa-route-stage__headline");
    const box = (el) => {
      const r = el.getBoundingClientRect();
      return { top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height };
    };
    return {
      vw:innerWidth,vh:innerHeight,
      word:box(word), masthead:box(masthead), title:box(title),
      stack:box(stack), top:box(top), bottom:box(bottom),
      fontWord:parseFloat(getComputedStyle(word).fontSize),
      fontTitle:parseFloat(getComputedStyle(title).fontSize),
      destination:title.textContent?.trim(),
    };
  });
  assert.ok(type.fontWord <= Math.min(90, type.vw * .18), context + ": wordmark still oversized " + type.fontWord);
  assert.ok(type.fontTitle > type.fontWord, context + ": title should lead the hierarchy");
  assert.ok(type.masthead.bottom + 8 <= type.title.top,
    context + ": masthead/title collision " + JSON.stringify(type));
  assert.ok(type.stack.left >= 0 && type.stack.right <= type.vw + 2,
    context + ": horizontal title crop " + JSON.stringify(type));
  assert.ok(type.stack.top >= type.top.bottom - 2 && type.stack.bottom <= type.bottom.top + 2,
    context + ": typography collides with stage metadata " + JSON.stringify(type));
  assert.ok(type.title.height > 24, context + ": destination title is missing");
}


(async function run() {
  const browser = await chromium.launch({ headless:true, args:["--disable-dev-shm-usage"] });
  const errors = [];
  try {
    for (const [width,height] of [[1440,900],[390,844]]) {
      const context = await browser.newContext({ viewport:{width,height}, reducedMotion:"no-preference" });
      const page = await context.newPage();
      page.on("pageerror", (err) => errors.push(width + ": " + err.message));
      await load(page, "/work");
      await overflow(page, width + " initial work");
      const mode = page.locator('[data-view-button="list"]');
      await mode.click();
      assert.equal(await page.locator("[data-work-gallery]").getAttribute("data-view"), "list");
      const card = page.locator(".work-gallery__link").first();
      await card.scrollIntoViewIfNeeded();
      if (width > 767) await card.hover();
      await page.waitForTimeout(550);
      const expectPortal = await card.evaluate((anchor) => {
        const frame = anchor.querySelector(".work-gallery__art");
        const image = frame?.querySelector("img");
        const style = frame && getComputedStyle(frame);
        return !!image?.complete && !!image.naturalWidth &&
          style?.visibility !== "hidden" && Number(style?.opacity || 1) > .1;
      });
      await card.click();
      const stage = page.locator(".aiwa-route-stage");
      await stage.waitFor({ state:"visible", timeout:2500 });
      assert.equal(await stage.getAttribute("data-phase"), "covering", "Expected exit phase");
      if (expectPortal) assert.equal(await stage.getAttribute("data-kind"), "portal",
        "Project art should expand into its own portal");
      await assertEditorialType(page, width + " portal type");
      await page.waitForTimeout(375); // frame after typography has arrived, before 510ms route swap
      await page.screenshot({ path:out+"/portal-"+width+".png" });
      await page.waitForURL(pathIs("/work/mymo-express"), { timeout:12000 });
      await page.locator(".case-hero h1").waitFor({ state:"visible" });
      await settle(page);
      await page.waitForTimeout(480); // allow destination-native typography to reach its final frame
      const lineOpacity = Number(await page.locator(".case-hero__display > span").first().evaluate((el) => getComputedStyle(el).opacity));
      assert.ok(lineOpacity >= .92, width + ": project display headline faded after transition " + lineOpacity);
      await overflow(page, width + " project");
      const projectName = await page.locator(".case-hero h1").innerText();
      assert.match(projectName, /MYMO/i);
      await page.screenshot({ path:out+"/case-"+width+".png" });

      // Native in-page hash navigation must never be covered.
      await page.locator('a[href="#case-brief"]').click();
      assert.equal(new URL(page.url()).hash, "#case-brief");
      assert.equal(await stage.count(), 0);

      // Browser history: no stuck overlay, no route reload required.
      await page.goBack({ waitUntil:"domcontentloaded" }); // remove #case-brief
      await page.goBack({ waitUntil:"domcontentloaded" }); // return to Work
      await page.waitForURL(pathIs("/work"), { timeout:12000 });
      await settle(page);
      assert.equal(await page.locator("[data-work-gallery]").getAttribute("data-view"), "list");
      await overflow(page, width + " browser back");

      // A normal nav link gets the branded signal rather than a project portal.
      if (width <= 1080) await page.locator(".aiwa-inner-header__menu").click();
      const nav = width <= 1080
        ? page.locator(".aiwa-inner-header__drawer a").filter({ hasText:"SPECIALISMS" }).first()
        : page.locator(".aiwa-inner-header__links a").filter({ hasText:"SPECIALISMS" }).first();
      await nav.click();
      await stage.waitFor({ state:"visible", timeout:2500 });
      assert.equal(await stage.getAttribute("data-kind"), "signal");
      await assertEditorialType(page, width + " signal type");
      await page.waitForTimeout(375);
      await page.screenshot({ path:out+"/signal-"+width+".png" });
      await page.waitForURL(pathIs("/specialisms"), { timeout:12000 });
      await settle(page);
      await overflow(page, width + " specialisms");
      await context.close();
    }

    // The homepage WORK nav should open the actual portfolio and play Signal Cut.
    const home = await browser.newContext({viewport:{width:1440,height:900},reducedMotion:"no-preference"});
    const homePage = await home.newPage();
    homePage.on("pageerror",(err)=>errors.push("home: "+err.message));
    await load(homePage,"/");
    const workNav = homePage.locator(".aiwa-header__navigation a").filter({hasText:"WORK"}).first();
    assert.equal(await workNav.getAttribute("href"),"/work");
    await workNav.click();
    await homePage.locator(".aiwa-route-stage").waitFor({state:"visible",timeout:2500});
    assert.equal(await homePage.locator(".aiwa-route-stage").getAttribute("data-kind"),"signal");
    await homePage.waitForURL(pathIs("/work"),{timeout:12000});
    await settle(homePage);
    await home.close();

    // Native behavior is mandatory for reduced-motion visitors.
    const reduced = await browser.newContext({viewport:{width:390,height:844},reducedMotion:"reduce"});
    const reducedPage = await reduced.newPage();
    reducedPage.on("pageerror", (err) => errors.push("reduced: " + err.message));
    await load(reducedPage, "/work");
    await reducedPage.locator(".work-gallery__link").first().click();
    await reducedPage.waitForURL(pathIs("/work/mymo-express"), {timeout:12000});
    assert.equal(await reducedPage.locator(".aiwa-route-stage").count(),0,"Reduced motion must not show an overlay");
    await reduced.close();

    // Without JS, the portfolio remains usable through its normal anchors.
    const noJs = await browser.newContext({javaScriptEnabled:false});
    const noJsPage = await noJs.newPage();
    await load(noJsPage,"/work");
    assert.equal(await noJsPage.locator(".work-gallery__link").count(),6);
    await noJs.close();

    // Modified activations are never intercepted.
    const keyboard = await browser.newContext({reducedMotion:"no-preference"});
    const keyboardPage = await keyboard.newPage();
    await load(keyboardPage,"/work");
    const modified = await keyboardPage.locator(".work-gallery__link").first().evaluate((link) => {
      const event = new MouseEvent("click", {bubbles:true,cancelable:true,button:0,ctrlKey:true});
      link.dispatchEvent(event);
      return event.defaultPrevented;
    });
    assert.equal(modified,false,"Ctrl+click must not be intercepted by the motion system");
    assert.equal(await keyboardPage.locator(".aiwa-route-stage").count(),0);
    await keyboard.close();

    assert.deepEqual(errors, [], "Client errors: " + errors.join("; "));
    console.log("AIWA_SIGNAL_PORTAL_QA_PASS: desktop, mobile, project, history, anchors, reduced motion, no-JS");
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
