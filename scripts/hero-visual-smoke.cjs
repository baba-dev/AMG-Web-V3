/* Browser smoke test: three independent sections and reversible film projection.
 * Uses a temporary static server and Chromium on GitHub Actions.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require("playwright");

const URL = process.env.AIWA_TEST_URL || "http://127.0.0.1:4173/";
fs.mkdirSync("test-artifacts", { recursive: true });

const rect = (el) => {
  const r = el.getBoundingClientRect();
  return { x:r.x,y:r.y,width:r.width,height:r.height,top:r.top,bottom:r.bottom };
};
const closeTo = (a,b,tolerance=3) => Math.abs(a-b) <= tolerance;

async function testAboutEntrance(browser) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await page.waitForFunction(() => document.getElementById("about")?.dataset.motion === "ready");

  const initial = await page.locator(".aiwa-about__line-text").first().evaluate((el) => ({
    opacity: Number(getComputedStyle(el).opacity),
    visible: el.closest("#about")?.dataset.visible,
  }));
  assert(initial.visible !== "true", "About should not reveal before scrolling into view");
  assert(initial.opacity < .8, "About intro should start visually concealed");

  await page.evaluate(() => document.getElementById("about").scrollIntoView({ behavior: "instant" }));
  await page.waitForFunction(() => document.getElementById("about")?.dataset.visible === "true");
  await page.waitForTimeout(1_700);

  const entered = await page.locator(".aiwa-about__line-text").last().evaluate((el) => ({
    opacity: Number(getComputedStyle(el).opacity),
    transform: getComputedStyle(el).transform,
  }));
  assert(entered.opacity > .98, "Final About text line must become fully visible");
  await page.screenshot({path:"test-artifacts/1440x900-about-motion.png",fullPage:false});

  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForFunction(() => document.getElementById("about")?.dataset.visible === "false");
  await ctx.close();
  return { initial, entered, reversed:true };
}

async function testViewport(browser, width, height) {
  const id = width + "x" + height;
  const ctx = await browser.newContext({
    viewport: { width, height },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", x => errors.push(x.message));
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await page.waitForSelector(".aiwa-reel");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(350);

  const initial = await page.evaluate(() => {
    const r = el => {
      const box = el.getBoundingClientRect();
      return {x:box.x,y:box.y,width:box.width,height:box.height,top:box.top,bottom:box.bottom};
    };
    const hero = document.querySelector(".aiwa-hero");
    const film = document.querySelector(".aiwa-film-section");
    const specials = document.querySelector(".aiwa-specialisms");
    const about = document.querySelector(".aiwa-about");
    const title = document.querySelector("#aiwa-hero-heading");
    return {
      brand: document.querySelector(".aiwa-header__identity")?.textContent?.trim(),
      headline: title.textContent.replace(/\s+/g," ").trim(),
      hero: r(hero), film: r(film), specialisms: r(specials), about: r(about),
      tile: r(document.querySelector(".aiwa-hero__film-tile")),
      projection: r(document.querySelector(".aiwa-reel")),
      categories: Array.from(document.querySelectorAll(".aiwa-specialisms__name")).map(x=>x.textContent),
      placeholderLinks: Array.from(document.querySelectorAll(".aiwa-specialisms__row")).every(x=>x.getAttribute("href")==="#"),
      aboutNavigation: document.querySelector(".aiwa-header__link[href='#about']") !== null,
      specialismsToAbout: document.querySelector(".aiwa-specialisms__why[href='#about']") !== null,
      overflow: document.documentElement.scrollWidth - innerWidth,
    };
  });

  assert.equal(initial.brand,"AIWA","Logo must be AIWA only");
  assert(initial.headline.includes("YOUR BRAND’S") && initial.headline.includes("TOO QUIET."),"First line missing");
  assert(initial.headline.includes("DOMINATE") && initial.headline.includes("WITH AIWA."),"Second line missing");
  assert.equal(initial.categories.join("|"),"Global|Consumer|Corporate|Sports|Social|Studio|TECH");
  assert(initial.placeholderLinks,"All category links must currently be #");
  assert(closeTo(initial.hero.height,height,3),"Hero must be a single viewport");
  assert(closeTo(initial.film.top,initial.hero.bottom,3),"Film must follow hero in document flow");
  assert(closeTo(initial.specialisms.top,initial.film.bottom,3),"Specialisms must follow film");
  assert(closeTo(initial.about.top, initial.specialisms.bottom, 3),"About must follow Specialisms with no gap or overlap");
  assert(initial.aboutNavigation && initial.specialismsToAbout,"Section navigation must target the new About section");
  assert(initial.overflow <= 2,"Horizontal overflow before scroll");
  assert(closeTo(initial.projection.x,initial.tile.x,4) && closeTo(initial.projection.y,initial.tile.y,4),"Initial projected media must originate at inline tile");
  assert(closeTo(initial.projection.width,initial.tile.width,4),"Projected media width must start inline");

  await page.screenshot({path:"test-artifacts/"+id+"-hero.png",fullPage:false});

  if (width <= 950) {
    const menu = page.getByRole("button",{name:"Open navigation"});
    assert(await menu.isVisible(),"Mobile nav trigger is hidden");
    await menu.click();
    await page.waitForFunction(() => getComputedStyle(document.querySelector("#aiwa-mobile-menu")).visibility === "visible");
    await page.getByRole("button",{name:"Close navigation"}).click();
  }

  await page.getByRole("button",{name:"Scroll to Aiwa showreel"}).click();
  await page.waitForTimeout(400);
  const inFilm = await page.evaluate(() => {
    const r = el => {
      const box=el.getBoundingClientRect();
      return {x:box.x,y:box.y,width:box.width,height:box.height,top:box.top,bottom:box.bottom};
    };
    return {
      scroll: scrollY,
      film:r(document.querySelector(".aiwa-film-section")),
      hero:r(document.querySelector(".aiwa-hero")),
      projection:r(document.querySelector(".aiwa-reel")),
      titleOpacity:Number(getComputedStyle(document.querySelector(".aiwa-hero__center")).opacity),
      controlsOpacity:Number(getComputedStyle(document.querySelector(".aiwa-reel__caption")).opacity),
      section3:r(document.querySelector(".aiwa-specialisms")),
    };
  });

  assert(inFilm.scroll > height * .90,"Scroll cue failed to reach film");
  assert(closeTo(inFilm.film.top,0,3),"Film section top must land on viewport top");
  assert(closeTo(inFilm.hero.bottom,0,3),"Hero bottom must end at viewport top");
  assert(closeTo(inFilm.projection.top,0,4),"Expanded media must start at viewport top");
  assert(closeTo(inFilm.projection.width,width,4),"Expanded media must span viewport width");
  assert(closeTo(inFilm.projection.height,height,4),"Expanded media must span viewport height");
  assert(inFilm.titleOpacity < .05 && inFilm.controlsOpacity > .95,"Film controls and hero fade failed");
  assert(closeTo(inFilm.section3.top,height,4),"Third section starts immediately after expanded film");
  await page.screenshot({path:"test-artifacts/"+id+"-film.png",fullPage:false});

  await page.evaluate(() => document.getElementById("specialisms").scrollIntoView({behavior:"instant"}));
  await page.waitForTimeout(350);
  const third = await page.evaluate(() => ({
    top:document.getElementById("specialisms").getBoundingClientRect().top,
    first:document.querySelector(".aiwa-specialisms__name").textContent,
    visibleRows:[...document.querySelectorAll(".aiwa-specialisms__row")].filter(x=>x.dataset.visible==="true").length,
    overflow:document.documentElement.scrollWidth - innerWidth,
  }));
  assert(closeTo(third.top,0,4),"Specialisms must enter as section three");
  assert(third.visibleRows > 0,"Specialisms fold entrance wasn't activated");
  assert(third.overflow <= 2,"Horizontal overflow in specialisms");
  await page.screenshot({path:"test-artifacts/"+id+"-specialisms.png",fullPage:false});

  await page.evaluate(() => document.getElementById("about").scrollIntoView({behavior:"instant"}));
  await page.waitForTimeout(350);
  const fourth = await page.evaluate(() => ({
    top: document.querySelector(".aiwa-about").getBoundingClientRect().top,
    heading: document.querySelector("#aiwa-about-heading").textContent.replace(/\s+/g, " ").trim(),
    body: document.querySelector(".aiwa-about__aside p").textContent,
    link: document.querySelector(".aiwa-about__cta").getAttribute("href"),
    label: document.querySelector(".aiwa-about__eyebrow").textContent,
    overflow: document.documentElement.scrollWidth - innerWidth,
    headlineBoxes: [...document.querySelectorAll(".aiwa-about__line-text")].map(el => {
      const b = el.getBoundingClientRect();
      return {left:b.left,right:b.right,width:b.width};
    }),
  }));
  assert(closeTo(fourth.top, 0, 4),"Section 4 must start at the top of the viewport");
  assert(fourth.label.includes("ABOUT US"),"Section 4 lacks About Us eyebrow");
  assert(fourth.heading.includes("CREATIVE MEDIA") && fourth.heading.includes("TO BLEND IN."),"About headline is missing");
  assert(fourth.body.includes("Aiwa Media Group") && fourth.body.includes("production"),"About description must mention Aiwa and its real work");
  assert(fourth.headlineBoxes.every(b => b.left >= -2 && b.right <= width + 2),"At least one About headline line is clipped horizontally");
  assert.equal(fourth.link,"https://aiwamediagroup.com/about-us/","About CTA must use the real About page");
  assert(fourth.overflow <= 2,"Section 4 has horizontal overflow");
  await page.screenshot({path:"test-artifacts/"+id+"-about.png",fullPage:false});

  await page.evaluate(() => scrollTo({top:0,behavior:"instant"}));
  await page.waitForTimeout(300);
  const reversed = await page.evaluate(() => ({
    tile:document.querySelector(".aiwa-hero__film-tile").getBoundingClientRect().toJSON(),
    projection:document.querySelector(".aiwa-reel").getBoundingClientRect().toJSON(),
    titleOpacity:Number(getComputedStyle(document.querySelector(".aiwa-hero__center")).opacity),
  }));
  assert(closeTo(reversed.tile.x,reversed.projection.x,4) && closeTo(reversed.tile.y,reversed.projection.y,4),"Reverse scroll didn't return the media to its inline tile");
  assert(closeTo(reversed.tile.width,reversed.projection.width,4),"Reverse scroll width mismatch");
  assert(reversed.titleOpacity > .95,"Hero headline wasn't restored");
  assert.equal(errors.length,0,"Uncaught page errors: "+errors.join("; "));

  await ctx.close();
  return {viewport:id,initial,inFilm,third,fourth,reversed:{titleOpacity:reversed.titleOpacity}};
}

(async () => {
  const browser=await chromium.launch({headless:true});
  try {
    const results=[];
    results.push(await testViewport(browser,1440,900));
    results.push(await testViewport(browser,390,844));
    const aboutMotion = await testAboutEntrance(browser);
    fs.writeFileSync("test-artifacts/measurements.json",JSON.stringify({results,aboutMotion},null,2));
    console.log("AIWA_FOUR_SECTION_VISUAL_PASS");
    console.log(JSON.stringify(results.map(r=>({viewport:r.viewport,hero:r.initial.hero,film:r.inFilm.film,projection:r.inFilm.projection,third:r.third,about:r.fourth})),null,2));
  } finally {
    await browser.close();
  }
})().catch(e=>{
  console.error("AIWA_THREE_SECTION_VISUAL_FAIL",e);
  process.exitCode=1;
});
