/* Chromium regression for the Aiwa Section 5 campaign montage.
   Runs against a built Next.js static export served by a local HTTP server.
   All captures are transient CI artifacts, never bundled in production.
*/
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require("playwright");

const ORIGIN = (process.env.AIWA_TEST_URL || "http://127.0.0.1:4173/").replace(/\/+$/, "");
const OUT = "test-artifacts/work";
fs.mkdirSync(OUT, { recursive: true });
const almost = (a,b,t=4)=>Math.abs(a-b)<=t;

async function checkDesktop(browser, width, height) {
  const context = await browser.newContext({ viewport:{width,height}, reducedMotion:"no-preference" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", e=>errors.push(e.message));
  await page.goto(ORIGIN + "/", {waitUntil:"domcontentloaded",timeout:30_000});
  await page.waitForFunction(()=>document.querySelector("#work")?.dataset.motion === "desktop",{timeout:10_000});
  await page.evaluate(()=>document.fonts.ready);

  const base = await page.evaluate(()=>{
    const work=document.querySelector("#work");
    const about=document.querySelector("#about");
    const stage=work.querySelector(".aiwa-work__stage");
    const links=[...work.querySelectorAll(".aiwa-work__card")];
    const assets=[...work.querySelectorAll("img")];
    return {
      aboutBottom:about.getBoundingClientRect().bottom + scrollY,
      workTop:work.getBoundingClientRect().top + scrollY,
      stageHeight:stage.offsetHeight,
      count:links.length,
      heading:work.querySelector("h2").textContent.replace(/\s+/g," ").trim(),
      cta:work.querySelector(".aiwa-work__cta").getAttribute("href"),
      assets:assets.map(i=>i.getAttribute("src")),
      links:links.map(a=>({href:a.href,target:a.target,rel:a.rel})),
      noOverflow:document.documentElement.scrollWidth - innerWidth <= 2,
    };
  });
  assert(almost(base.aboutBottom,base.workTop),"Work must follow About immediately");
  assert.equal(base.count,6,"Expected six documented projects");
  assert(base.heading.includes("SELECTED") && base.heading.includes("CAMPAIGNS"),"Heading missing");
  assert.equal(base.cta,"/work","View All Work must point to real /work route");
  assert(base.assets.every(src=>src.startsWith("/media/work/")),"All art must use owned local media");
  assert(base.links.every(a=>{const url=new URL(a.href);return url.origin===new URL(ORIGIN).origin && /^\/work\/[a-z0-9-]+$/.test(url.pathname) && a.target==="";}),"Project links must stay on Aiwa V3 and use local static project routes");
  assert(base.noOverflow,"Section 5 caused horizontal overflow");
  assert(base.stageHeight>height*3.2,"Desktop montage needs a multi-viewport scroll stage");

  const positions=[];
  for(const progress of [0,.15,.35,.55,.75,1]){
    await page.evaluate(p=>{
      const stage=document.querySelector(".aiwa-work__stage");
      const targetY=stage.getBoundingClientRect().top+scrollY+(stage.offsetHeight-innerHeight)*p;
      window.scrollTo({top:targetY,behavior:"instant"});
    },progress);
    await page.waitForTimeout(380);
    const state=await page.evaluate(()=>{
      const heading=document.querySelector(".aiwa-work__headline").getBoundingClientRect();
      const scene=document.querySelector(".aiwa-work__scene").getBoundingClientRect();
      const slots=[...document.querySelectorAll(".aiwa-work__slot")].map(el=>({
        opacity:Number(getComputedStyle(el).opacity),
        active:el.dataset.active,
        inert:el.inert,
        transform:getComputedStyle(el).transform,
      }));
      return {
        progress:Number(document.querySelector("#work").style.getPropertyValue("--work-progress")),
        headingTop:heading.top,
        sceneTop:scene.top,
        active:slots.filter(s=>s.active==="true").length,
        slots,
        overflow:document.documentElement.scrollWidth-innerWidth
      };
    });
    assert(almost(state.progress,progress,.025),"Scroll progress not tracked: "+progress+" => "+state.progress);
    assert(state.overflow<=2,"Overflow at montage progress "+progress);
    if(progress>=.35 && progress<=.75) {
      assert(state.active>=1,"At least one visible interactive card required at "+progress);
      assert(state.headingTop>-40 && state.headingTop<height,"Heading must stay pinned");
      assert(almost(state.sceneTop,0,4),"Desktop scene must stay pinned at "+progress);
    }
    positions.push({progress,...state});
    await page.screenshot({path:OUT+"/"+width+"x"+height+"-work-"+Math.round(progress*100)+".png",fullPage:false});
  }
  await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));
  await page.waitForTimeout(320);
  const replay=await page.evaluate(()=>({
    progress:Number(document.querySelector("#work").style.getPropertyValue("--work-progress")),
    reset:[...document.querySelectorAll(".aiwa-work__slot")].every(x=>x.inert)
  }));
  assert(replay.progress<.01,"Scroll reversal should rewind Section 5");
  assert(replay.reset,"Offscreen cards should not be keyboard-interactive while pinned");
  assert.equal(errors.length,0,"Browser page errors: "+errors.join("; "));
  await context.close();
  return {viewport:width+"x"+height,base,positions:positions.map(p=>({progress:p.progress,active:p.active,headingTop:p.headingTop})),replay};
}

async function checkMobile(browser,width,height){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:"no-preference"});
  const page=await context.newPage();
  const errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  await page.goto(ORIGIN+"/",{waitUntil:"domcontentloaded",timeout:30_000});
  await page.waitForFunction(()=>document.querySelector("#work")?.dataset.motion === "mobile",{timeout:10_000});
  await page.locator("#work").scrollIntoViewIfNeeded();
  await page.waitForTimeout(260);
  const grid=await page.evaluate(()=>({
    rows:[...document.querySelectorAll(".aiwa-work__slot")].map(el=>{
      const r=el.getBoundingClientRect();
      return {x:r.x,w:r.width,top:r.top,entered:el.dataset.entered,href:el.querySelector("a")?.getAttribute("href")};
    }),
    scrollHeight:document.querySelector("#work").getBoundingClientRect().height,
    overflow:document.documentElement.scrollWidth-innerWidth,
  }));
  assert.equal(grid.rows.length,6);
  assert(grid.scrollHeight>height,"Mobile must use natural vertical flow");
  assert(grid.overflow<=2,"Mobile horizontal overflow detected");
  assert(grid.rows.every(x=>x.w>width*.5 && x.w<width),"Mobile cards must be visibly sized");
  assert(grid.rows[0].x<grid.rows[1].x,"Mobile card gutters should alternate");

  const first=page.locator(".aiwa-work__slot").first();
  // The card is intentionally in a long eased entrance. Playwright's
  // stability-based scrollIntoViewIfNeeded can wait forever on transformed
  // geometry; use a direct native-scroll target and inspect its final state.
  await page.evaluate(() => {
    const card=document.querySelector(".aiwa-work__slot");
    const top=card.getBoundingClientRect().top+scrollY;
    window.scrollTo({top:top-innerHeight*.31,behavior:"instant"});
  });
  await page.waitForTimeout(1200);
  const entered=await first.getAttribute("data-entered");
  assert.equal(entered,"true","First card reveal must activate on viewport entry");
  await page.screenshot({path:OUT+"/"+width+"x"+height+"-mobile-work.png",fullPage:false});

  await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));
  await page.waitForTimeout(300);
  const reversed=await first.getAttribute("data-entered");
  assert.equal(reversed,"false","Mobile reverse scroll should reset the reveal");
  assert.equal(errors.length,0,"Mobile errors: "+errors.join("; "));
  await context.close();
  return {viewport:width+"x"+height,grid,entered,reversed};
}

async function checkA11yAndArchive(browser){
  const context=await browser.newContext({viewport:{width:1280,height:800},reducedMotion:"reduce"});
  const page=await context.newPage();
  await page.goto(ORIGIN+"/",{waitUntil:"domcontentloaded",timeout:30_000});
  await page.waitForTimeout(250);
  const state=await page.evaluate(()=>{
    const work=document.querySelector("#work");
    const cards=[...work.querySelectorAll(".aiwa-work__slot")];
    return {
      mode:work.dataset.motion||"static",
      links:cards.length,
      inert:cards.some(x=>x.inert),
      width:work.getBoundingClientRect().width,
      overflow:document.documentElement.scrollWidth-innerWidth,
    };
  });
  assert.equal(state.mode,"static","Reduced-motion must show the non-pinned layout");
  assert.equal(state.links,6);
  assert(!state.inert,"Reduced-motion cards must all be keyboard accessible");
  assert(state.overflow<=2);
  await page.locator("#work").scrollIntoViewIfNeeded();
  await page.screenshot({path:OUT+"/reduced-motion-work.png"});

  const archivePath=fs.existsSync("out/work/index.html")?"/work/":"/work.html";
  await page.goto(ORIGIN+archivePath,{waitUntil:"domcontentloaded",timeout:30_000});
  await page.waitForSelector("[data-work-gallery]");
  const n=await page.locator("[data-work-project]").count();
  assert.equal(n,6,"Static selected work directory missing projects");
  assert.equal(await page.locator(".aiwa-inner-header__skip").getAttribute("href"),"#main-content");
  await page.screenshot({path:OUT+"/archive.png",fullPage:false});
  await context.close();

  const jsOff=await browser.newContext({viewport:{width:1280,height:800},javaScriptEnabled:false});
  const noJS=await jsOff.newPage();
  await noJS.goto(ORIGIN+"/",{waitUntil:"domcontentloaded",timeout:30_000});
  assert.equal(await noJS.locator(".aiwa-work__card").count(),6,"No-JS source must contain all projects");
  const displayed=await noJS.locator(".aiwa-work__cards").evaluate(x=>getComputedStyle(x).display);
  assert.equal(displayed,"grid","No-JS mode should show ordinary grid");
  await jsOff.close();
  return {state,archive:n,noJS:true};
}

(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const results={
    desktop:[await checkDesktop(browser,1440,900),await checkDesktop(browser,1280,800)],
    mobile:[await checkMobile(browser,390,844),await checkMobile(browser,360,800)],
    fallback:await checkA11yAndArchive(browser)
  };
  fs.writeFileSync(OUT+"/measurements.json",JSON.stringify(results,null,2));
  console.log("AIWA_WORK_SECTION5_VISUAL_PASS");
  console.log(JSON.stringify({desktop:results.desktop.map(r=>r.viewport),mobile:results.mobile.map(r=>r.viewport),archive:results.fallback.archive,noJS:results.fallback.noJS}));
 }finally{await browser.close();}
})().catch(err=>{console.error("AIWA_WORK_SECTION5_VISUAL_FAIL",err);process.exitCode=1;});
