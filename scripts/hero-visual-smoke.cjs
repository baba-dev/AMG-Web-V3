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
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await page.waitForFunction(() => document.getElementById("about")?.dataset.motion === "scrub");

  async function captureState(label, viewportTopRatio) {
    await page.evaluate((ratio) => {
      const about = document.getElementById("about");
      const documentTop = about.getBoundingClientRect().top + scrollY;
      window.scrollTo({ top: documentTop - innerHeight * ratio, behavior: "instant" });
    }, viewportTopRatio);
    await page.waitForTimeout(150);
    const snapshot = await page.evaluate(() => ({
      progress: Number(getComputedStyle(document.getElementById("about")).getPropertyValue("--aiwa-about-progress")),
      lines: [...document.querySelectorAll(".aiwa-about__line-text")].map(el => ({
        opacity: Number(getComputedStyle(el).opacity),
        transform: getComputedStyle(el).transform,
      })),
      bodyOpacity: Number(getComputedStyle(document.querySelector(".aiwa-about__description")).opacity),
      ctaOpacity: Number(getComputedStyle(document.querySelector(".aiwa-about__cta")).opacity),
      ruleTransform: getComputedStyle(document.querySelector(".aiwa-about__rule")).transform,
    }));
    await page.screenshot({ path: "test-artifacts/1440x900-about-" + label + ".png", fullPage: false });
    return snapshot;
  }

  const initial = await page.evaluate(() => ({
    progress: Number(getComputedStyle(document.getElementById("about")).getPropertyValue("--aiwa-about-progress")),
    first: Number(getComputedStyle(document.querySelector(".aiwa-about__line-text")).opacity),
  }));
  assert(initial.progress <= .01, "About reveal should not start far below viewport");
  assert(initial.first < .03, "First line should start masked below the fold");

  const entering = await captureState("entering", .62);
  assert(entering.progress > .35 && entering.progress < .45, "Early scroll progress not linked to section entrance");
  assert(entering.lines[0].opacity > .5, "First line should reveal before last line");
  assert.equal(entering.lines.length,2,"About should have the reference-style two-line title");
  assert(entering.lines[1].opacity < entering.lines[0].opacity,
    "Second About line should trail the first during the scroll reveal");
  assert(entering.bodyOpacity < .1, "Supporting copy should enter after the typography");

  const midway = await captureState("midway", .27);
  assert(midway.lines[1].opacity > entering.lines[1].opacity,
    "Second About line should continue unfolding with scroll");
  assert(midway.ctaOpacity > entering.ctaOpacity, "CTA should advance with scroll");

  const settled = await captureState("settled", 0);
  assert(settled.progress > .99, "About entrance must complete at section top");
  assert(settled.lines.every(line => line.opacity > .98), "All headline lines must be visible once settled");
  assert(settled.bodyOpacity > .98 && settled.ctaOpacity > .98, "About copy and CTA must become visible");

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(200);
  const reversed = await page.evaluate(() => ({
    progress: Number(getComputedStyle(document.getElementById("about")).getPropertyValue("--aiwa-about-progress")),
    lastOpacity: Number(getComputedStyle([...document.querySelectorAll(".aiwa-about__line-text")].at(-1)).opacity),
  }));
  assert(reversed.progress <= .01 && reversed.lastOpacity < .02, "Reverse scroll must rewind the headline reveal");
  assert.equal(errors.length, 0, "Browser errors during About motion: " + errors.join("; "));

  await ctx.close();
  return { initial, entering, midway, settled, reversed };
}

async function testHeroSpecialismsMotion(browser, width, height) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", e=>errors.push(e.message));
  await page.goto(URL,{waitUntil:"domcontentloaded",timeout:30_000});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(1700); // Let intro masks settle.

  const checkpoints = [];
  for (const ratio of [0,.25,.5,.75,1]) {
    await page.evaluate(p => {
      const hero = document.querySelector(".aiwa-hero");
      window.scrollTo({top:hero.getBoundingClientRect().top+scrollY+hero.offsetHeight*p,behavior:"instant"});
    },ratio);
    await page.waitForTimeout(160);
    const values=await page.evaluate(()=>{
      const reveal=document.querySelector(".aiwa-reel").getBoundingClientRect();
      const title=document.querySelector(".aiwa-hero__center");
      const last=[...document.querySelectorAll(".aiwa-hero__line")].at(-1)?.getBoundingClientRect();
      return {
        width:reveal.width,height:reveal.height,x:reveal.x,y:reveal.y,
        titleOpacity:Number(getComputedStyle(title).opacity),
        lineRight:last?.right,
      };
    });
    const posterLayers=await page.evaluate(() => {
      const film=document.querySelector(".aiwa-film-section");
      const bg=getComputedStyle(film).backgroundImage;
      const teaser=getComputedStyle(film,"::before");
      return {background:bg,peek:Number(teaser.opacity),content:teaser.content,
        color:getComputedStyle(film).backgroundColor};
    });
    if (width>720) {
      assert.equal(posterLayers.background,"none",
        "Desktop film target must not duplicate the moving poster");
      assert.equal(posterLayers.content,"none",
        "Desktop must not render an underlying poster teaser");
    } else {
      assert.equal(posterLayers.background,"none",
        "Mobile poster belongs only in a fading pseudo-element");
      if (ratio===0) assert(posterLayers.peek>.98,
        "First-fold mobile teaser must be visible at hero start");
      if (ratio>=.25) assert(posterLayers.peek<.05,
        "Teaser must disappear before the expanding reel overlaps it");
      if (ratio>=.25) {
        const rgb=posterLayers.color.match(/\d+/g)?.map(Number) || [];
        assert(rgb.length>=3 && rgb.slice(0,3).every(channel=>channel<=16),
          "Behind the expanding reel the film landing canvas must remain black");
      }
    }
    checkpoints.push({...values,ratio,posterLayers});
    await page.screenshot({path:"test-artifacts/"+width+"x"+height+"-hero-motion-"+Math.round(ratio*100)+".png",fullPage:false});
  }
  assert(checkpoints[1].width>checkpoints[0].width*1.6,"Inline tile should grow substantially in first quarter");
  assert(checkpoints[2].width>checkpoints[1].width,"Film must keep expanding at halfway");
  assert(checkpoints[3].width>checkpoints[2].width,"Film must keep expanding at three-quarter progress");
  assert(closeTo(checkpoints[4].width,width,4),"Hero film should fill the next viewport");
  assert(checkpoints[2].titleOpacity>.85,"Headline must remain visible behind expanding film at halfway");
  assert(checkpoints[4].titleOpacity<.05,"Headline must disappear at full expansion");

  const spec = await page.evaluate(()=>{
    const section=document.querySelector(".aiwa-specialisms");
    const list=[...section.querySelectorAll(".aiwa-specialisms__row")];
    const bounds=list.map(row=>{
      const b=row.getBoundingClientRect(), t=row.querySelector(".aiwa-specialisms__visual")?.getBoundingClientRect();
      return {width:b.width,right:b.right,mediaWidth:t?.width,category:row.textContent?.trim()};
    });
    return {top:section.getBoundingClientRect().top+scrollY,rows:bounds,
      background:getComputedStyle(section).backgroundColor};
  });
  const rgb = spec.background.match(/\d+/g)?.map(Number) || [];
  assert(rgb.length>=3 && rgb.slice(0,3).every(channel=>channel<=30),
    "Dark-mode Specialisms needs an ink canvas, got "+spec.background);
  assert(spec.rows.length===6,"Six specialisms required");
  assert(spec.rows.every(r=>r.mediaWidth>20),"Each category needs an embedded media tile");

  const firstRowPosition=await page.locator(".aiwa-specialisms__row").first().evaluate(el=>el.getBoundingClientRect().top+scrollY);
  const states=[];
  for(const phase of [1.08,.70,.42]) {
    await page.evaluate(({position,phase})=>window.scrollTo({top:position-innerHeight*phase,behavior:"instant"}),{position:firstRowPosition,phase});
    await page.waitForTimeout(130);
    const row=await page.locator(".aiwa-specialisms__row").first().evaluate(el=>({
      reveal:Number(el.style.getPropertyValue("--row-reveal")),
      opacity:Number(getComputedStyle(el).opacity),
      transform:getComputedStyle(el).transform,
    }));
    states.push(row);
  }
  assert(states[0].reveal<.06,"Specialism row should be folded before entering");
  assert(states[1].reveal>states[0].reveal && states[1].reveal<.98,"Specialism should partially unfold while entering");
  assert(states[2].reveal>.98,"Specialism should be fully open inside viewport");

  await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));
  await page.waitForTimeout(180);
  const reset=await page.locator(".aiwa-specialisms__row").first().evaluate(el=>Number(el.style.getPropertyValue("--row-reveal")));
  assert(reset<.06,"Reverse scroll should refold specialisms");
  const restored=await page.evaluate(()=>{
    const r=document.querySelector(".aiwa-reel").getBoundingClientRect();
    const t=document.querySelector(".aiwa-hero__film-tile").getBoundingClientRect();
    return {width:r.width, tileWidth:t.width,scrollY,projectionX:r.x,projectionY:r.y,tileX:t.x,tileY:t.y};
  });
  await page.screenshot({path:"test-artifacts/"+width+"x"+height+"-hero-return.png",fullPage:false});
  console.log("HERO_REVERSE_DIAGNOSTIC",JSON.stringify({viewport:width,start:checkpoints[0],restored}));
  assert(closeTo(restored.width,restored.tileWidth,4),"Hero reel must align to inline tile on reverse scroll, measured "+JSON.stringify(restored));
  assert.equal(errors.length,0,"Uncaught motion errors: "+errors.join("; "));

  await context.close();
  return {viewport:width+"x"+height,checkpoints,states,reset};
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
      serviceHrefs: Array.from(document.querySelectorAll(".aiwa-specialisms__row")).map(x=>x.getAttribute("href")),
      aboutNavigation: document.querySelector(".aiwa-header__link[href='/about']") !== null,
      specialismsToAbout: document.querySelector(".aiwa-specialisms__why[href='#about']") !== null,
      overflow: document.documentElement.scrollWidth - innerWidth,
    };
  });

  assert.equal(initial.brand,"AIWA","Logo must be AIWA only");
  assert(initial.headline.includes("YOUR BRAND’S") && initial.headline.includes("TOO QUIET."),"First line missing");
  assert(initial.headline.includes("DOMINATE") && initial.headline.includes("WITH AIWA."),"Second line missing");
  assert.equal(initial.categories.join("|"),"Creatives|Marketing|Development|IT Support|Branding|Events");
  assert.deepEqual(initial.serviceHrefs,
    ["/specialisms/creatives", ...Array(5).fill("#")],
    "Homepage must link Creatives and keep five placeholders");
  const expectedHeroHeight = width <= 720 ? height*.75 : height;
  assert(closeTo(initial.hero.height,expectedHeroHeight,3),
    "Hero must match desktop full-screen or reference mobile film fold");
  assert(closeTo(initial.film.top,initial.hero.bottom,3),"Film must follow hero in document flow");
  assert(closeTo(initial.specialisms.top,initial.film.bottom,3),"Specialisms must follow film");
  assert(closeTo(initial.about.top, initial.specialisms.bottom, 3),"About must follow Specialisms with no gap or overlap");
  assert(initial.aboutNavigation && initial.specialismsToAbout,"Navigation must target the About route and preserve the Specialisms anchor");
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

  assert(inFilm.scroll > initial.hero.height * .90,
    "Scroll cue failed to reach film");
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
  assert(fourth.heading.includes("CREATIVE MEDIA FOR") && fourth.heading.includes("BRAVE BRANDS."),"About headline is missing");
  assert(fourth.body.includes("Aiwa Media Group") && fourth.body.includes("production"),"About description must mention Aiwa and its real work");
  assert(fourth.headlineBoxes.every(b => b.left >= -2 && b.right <= width + 2),"At least one About headline line is clipped horizontally");
  assert.equal(fourth.link,"/about","About CTA must use the real About page");
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

async function testDuotoneTheme(browser,width,height) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 30_000 });
  const toggle = page.getByRole("button", { name: "Toggle colour theme" });
  await toggle.waitFor();
  await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
  const initial = await page.evaluate(() => ({
    dark: document.documentElement.classList.contains("dark"),
    hero: getComputedStyle(document.querySelector(".aiwa-hero")).backgroundColor,
    toggle: document.querySelector(".aiwa-theme-toggle").getBoundingClientRect().toJSON(),
    header: document.querySelector(".aiwa-header").getBoundingClientRect().toJSON(),
  }));
  assert(initial.dark && initial.hero === "rgb(7, 7, 7)", "Original dark hero must stay the default");
  assert(initial.toggle.x >= initial.header.left && initial.toggle.right <= initial.header.right,
    "Theme control must fit inside header at " + width);

  await toggle.click();
  await page.waitForFunction(() =>
    document.documentElement.classList.contains("light") &&
    getComputedStyle(document.querySelector(".aiwa-hero")).backgroundColor === "rgb(245, 243, 237)"
  );
  const light = await page.evaluate(() => ({
    hero: getComputedStyle(document.querySelector(".aiwa-hero")).backgroundColor,
    token: getComputedStyle(document.querySelector(".aiwa-site")).getPropertyValue("--aiwa-bg").trim(),
    heading: getComputedStyle(document.querySelector(".aiwa-hero__headline")).color,
    specialisms: getComputedStyle(document.querySelector(".aiwa-specialisms")).backgroundColor,
    specialismsText: getComputedStyle(document.querySelector(".aiwa-specialisms__row")).color,
    about: getComputedStyle(document.querySelector(".aiwa-about")).backgroundColor,
    aboutCopy: getComputedStyle(document.querySelector(".aiwa-about__description")).color,
    themeStored: localStorage.getItem("theme"),
    togglePressed: document.querySelector(".aiwa-theme-toggle").getAttribute("aria-pressed"),
    overflow: document.documentElement.scrollWidth - innerWidth,
    toggleMotion: getComputedStyle(document.querySelector(".aiwa-theme-toggle__orb")).transitionDuration,
  }));
  assert.equal(light.hero, "rgb(245, 243, 237)", "Hero did not change to warm paper");
  assert.equal(light.heading, "rgb(21, 22, 19)", "Hero heading lacks ink contrast");
  assert(/^rgb\(/.test(light.specialisms) &&
    (light.specialisms.match(/\d+/g)?.slice(0,3).map(Number) || []).every(n => n >= 230),
    "Light-mode Specialisms must use the bright editorial canvas");
  assert((light.specialismsText.match(/\d+/g)?.slice(0,3).map(Number) || []).every(n => n < 80),
    "Specialisms labels must have dark ink contrast");
  assert((light.about.match(/\d+/g)?.slice(0,3).map(Number) || []).every(n => n >= 230),
    "Light-mode About should use the media-led paper surface");
  assert((light.aboutCopy.match(/\d+/g)?.slice(0,3).map(Number) || []).every(n => n < 100),
    "About copy lacks readable contrast");
  assert.equal(light.themeStored, "light", "Light choice not persisted");
  assert.equal(light.togglePressed, "true", "Toggle accessibility state incorrect");
  assert(light.overflow <= 2, "Theme switch created horizontal overflow");
  assert(light.toggleMotion.split(",").every(x => Number.parseFloat(x) <= .001),
    "Reduced-motion visitors should not receive a travelling toggle");
  await page.screenshot({ path: "test-artifacts/" + width + "x" + height + "-light-hero.png" });
  await page.evaluate(() => document.querySelector(".aiwa-specialisms").scrollIntoView({ behavior:"instant" }));
  await page.screenshot({ path: "test-artifacts/" + width + "x" + height + "-light-specialisms.png" });
  await page.evaluate(() => document.querySelector(".aiwa-about").scrollIntoView({ behavior:"instant" }));
  await page.screenshot({ path: "test-artifacts/" + width + "x" + height + "-light-about.png" });

  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() =>
    document.documentElement.classList.contains("light") &&
    getComputedStyle(document.querySelector(".aiwa-hero")).backgroundColor === "rgb(245, 243, 237)"
  );
  assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector(".aiwa-hero")).backgroundColor),
    "rgb(245, 243, 237)", "Saved theme failed after reload");
  // A reload preserves scroll position; return to the hero before interacting
  // with its scoped header rather than clicking a clipped offscreen control.
  await page.evaluate(() => window.scrollTo({top: 0, behavior: "instant"}));
  await page.waitForFunction(() => Math.abs(window.scrollY) < 2);
  await page.getByRole("button", { name: "Toggle colour theme" }).click();
  await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
  assert.equal(await page.evaluate(() => localStorage.getItem("theme")), "dark",
    "Switching back to dark did not persist");
  assert.equal(errors.length,0,"Uncaught errors in theme check: "+errors.join("; "));
  await ctx.close();
  return {viewport:width+"x"+height,initial,light};
}

(async () => {
  const browser=await chromium.launch({headless:true});
  try {
    const results=[];
    results.push(await testViewport(browser,1440,900));
    results.push(await testViewport(browser,390,844));
    const motionFrames = [];
    motionFrames.push(await testHeroSpecialismsMotion(browser,1440,900));
    motionFrames.push(await testHeroSpecialismsMotion(browser,390,844));
    const aboutMotion = await testAboutEntrance(browser);
    const themes = [await testDuotoneTheme(browser,1440,900), await testDuotoneTheme(browser,390,844)];
    fs.writeFileSync("test-artifacts/measurements.json",JSON.stringify({results,motionFrames,aboutMotion,themes},null,2));
    console.log("AIWA_EDITORIAL_DUOTONE_THEME_PASS");
    console.log("AIWA_HERO_SPECIALISMS_MOTION_PASS");
    console.log(JSON.stringify(results.map(r=>({viewport:r.viewport,hero:r.initial.hero,film:r.inFilm.film,projection:r.inFilm.projection,third:r.third,about:r.fourth})),null,2));
  } finally {
    await browser.close();
  }
})().catch(e=>{
  console.error("AIWA_SECTION4_SCROLL_POLISH_FAIL",e);
  process.exitCode=1;
});
