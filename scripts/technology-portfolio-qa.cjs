/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {chromium}=require("playwright");
const inventory=require("../docs/technology-portfolio/media-inventory.json");
const origin=process.env.AIWA_ORIGIN||"http://127.0.0.1:4173";
const output="test-artifacts/technology-portfolio";
const route="/work/technology";
const slugs=inventory.projects.map(p=>p.slug);
async function checkOverflow(page,label){
  assert((await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth))<=2,label+" horizontal overflow");
}
async function designSnapshot(page,selector){
  return page.locator(selector).evaluate(node=>{
    const root=node.closest(".aiwa-site");
    const cs=getComputedStyle(root), head=getComputedStyle(node);
    const keys=["--aiwa-paper","--aiwa-paper-raised","--aiwa-paper-ink","--aiwa-paper-muted","--aiwa-paper-rule","--type-display","--type-emphasis","--type-body","--type-mono","--tracking-display","--aiwa-gutter"];
    return {tokens:Object.fromEntries(keys.map(key=>[key,cs.getPropertyValue(key).trim()])),font:head.fontFamily,tracking:head.letterSpacing,fontSize:head.fontSize,background:cs.backgroundColor,color:cs.color};
  });
}
async function verifyDesign(page,baseline){
  await page.evaluate(()=>document.fonts.ready);
  const actual=await designSnapshot(page,"main h1");
  assert.deepEqual(actual.tokens,baseline.tokens,"Canonical homepage tokens");
  assert.equal(actual.font,baseline.font,"Canonical homepage display family");
  const style=await page.locator(".tech-page").evaluate(node=>{
    const cs=getComputedStyle(node);
    const probe=document.createElement("span");node.append(probe);
    probe.style.backgroundColor="var(--aiwa-paper)";probe.style.color="var(--aiwa-paper-ink)";
    const pc=getComputedStyle(probe);const expected=[pc.backgroundColor,pc.color];probe.remove();
    return {actual:[cs.backgroundColor,cs.color],expected};
  });
  assert.deepEqual(style.actual,style.expected,"Technology chrome follows canonical surface and ink");
}
async function decoded(locator){
  await locator.evaluate(async img=>{img.loading="eager";await img.decode();});
  assert(await locator.evaluate(img=>img.complete&&img.naturalWidth>0),"Screenshot must decode");
}
async function run(){
  fs.mkdirSync(output,{recursive:true});
  const executablePath=process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  const browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
  try{
    for(const width of [1440,390,320]){
      for(const theme of ["light","dark"]){
        const context=await browser.newContext({viewport:{width,height:width===1440?900:844},colorScheme:theme,reducedMotion:"reduce"});
        await context.addInitScript(t=>localStorage.setItem("theme",t),theme);
        const page=await context.newPage();
        const errors=[];page.on("pageerror",e=>errors.push(e.message));
        await page.goto(origin+"/",{waitUntil:"networkidle"});
        await page.waitForFunction(t=>document.documentElement.classList.contains(t),theme);
        await page.evaluate(()=>document.fonts.ready);
        const baseline=await designSnapshot(page,".aiwa-hero__headline");
        await page.screenshot({path:output+"/"+width+"-"+theme+"-homepage-reference.png"});
        const response=await page.goto(origin+route,{waitUntil:"networkidle"});
        assert.equal(response.status(),200);
        await page.waitForFunction(t=>document.documentElement.classList.contains(t),theme);
        assert.equal(await page.locator("main h1").count(),1);
        assert.equal(await page.locator('.tech-connected-link a[href="/specialisms/tech#dev-connected"]').count(),1,"Industrial IoT cross-link preserved");
        assert.equal(await page.locator('.tech-contact-note a[href="/specialisms/tech"]').count(),1,"Development services cross-link preserved");
        await verifyDesign(page,baseline);
        assert.equal(await page.locator(".tech-index__rows li").count(),18);
        assert.equal(await page.locator(".aiwa-footer").count(),1);
        assert.equal(await page.locator(".tech-flagship a[href='/work/technology/aiwa-creators']").count(),2);
        await decoded(page.locator(".tech-flagship__visual img").first());
        assert.equal(await page.locator(".tech-index__thumb").first().isVisible(),width<768,"Mobile rows include real media");
        assert.equal(await page.locator(".tech-reel__progress button").count(),4);
        await page.getByRole("button",{name:"Show FXR",exact:true}).click();
        await page.waitForFunction(()=>document.querySelector(".tech-reel__bar strong")?.textContent==="FXR");
        await page.getByRole("button",{name:"Show Creators by Aiwa",exact:true}).click();
        await page.waitForFunction(()=>document.querySelector(".tech-reel__bar strong")?.textContent==="Creators by Aiwa");
        await page.evaluate(()=>window.scrollTo(0,0));
        await checkOverflow(page,width+" "+theme);
        await page.screenshot({path:output+"/"+width+"-"+theme+"-hero.png"});
        await page.locator(".tech-engineering").scrollIntoViewIfNeeded();
        await page.screenshot({path:output+"/"+width+"-"+theme+"-engineering.png"});
        await page.locator(".tech-flagship").scrollIntoViewIfNeeded();
        await page.screenshot({path:output+"/"+width+"-"+theme+"-flagship.png"});
        await page.getByRole("button",{name:"Next project",exact:true}).click();
        await page.waitForFunction(()=>document.querySelector(".tech-reel__bar strong")?.textContent==="Global Wealth Investments");
        await page.locator("#tech-email summary").click();
        assert(await page.locator("#tech-email").evaluate(el=>el.open),"Email service disclosure opens");
        await page.getByRole("button",{name:"Digital products",exact:true}).click();
        await page.waitForFunction(()=>document.querySelectorAll(".tech-index__rows li").length===3);
        assert(new URL(page.url()).searchParams.get("type")==="Digital products","Shareable filter");
        assert.deepEqual(await page.locator(".tech-index__rows li a > .tech-meta").allTextContents(),["01","04","05"],"Stable project numbering");
        await page.getByRole("button",{name:"Grid view",exact:true}).click();
        await page.waitForFunction(()=>document.querySelectorAll(".tech-grid .tech-card").length===3);
        await page.getByRole("searchbox",{name:"Search projects"}).fill("Aiwa Creators");
        await page.waitForFunction(()=>document.querySelectorAll(".tech-grid .tech-card").length===1);
        await checkOverflow(page,width+" "+theme+" filtered");
        await page.goto(origin+route+"?type=Digital%20products#tech-email",{waitUntil:"networkidle"});
        await page.waitForFunction(()=>document.querySelectorAll(".tech-grid .tech-card").length===3&&document.querySelector("#tech-email")?.open);
        await page.locator(".tech-projects").scrollIntoViewIfNeeded();
        await page.screenshot({path:output+"/"+width+"-"+theme+"-index.png"});
        await page.goto(origin+route+"/aiwa-creators",{waitUntil:"networkidle"});
        assert.equal(await page.locator(".tech-detail__header h1").textContent(),"Creators by Aiwa.");
        await verifyDesign(page,baseline);
        assert.equal(await page.locator(".tech-detail__hero img").count(),2,"One responsive media presentation, without duplicate hidden images");
        await decoded(page.locator(".tech-detail__hero img").first());
        await page.getByRole("group",{name:"Screenshot view",exact:true}).getByRole("button",{name:"Mobile",exact:true}).click();
        await decoded(page.locator(".tech-viewer > .tech-single img"));
        await page.getByRole("button",{name:"Expand",exact:true}).click();
        await page.locator(".tech-dialog").waitFor({state:"visible"});
        await page.waitForFunction(()=>document.activeElement?.getAttribute("aria-label")==="Close screenshot viewer");
        assert.equal(await page.locator(".tech-dialog .tech-full-image").getAttribute("href"),"/media/technology/aiwa-creators/mobile-560.webp");
        await page.keyboard.press("Escape");
        await page.locator(".tech-dialog").waitFor({state:"hidden"});
        await page.waitForFunction(()=>document.activeElement?.getAttribute("aria-haspopup")==="dialog"&&document.body.style.overflow!=="hidden");
        await page.screenshot({path:output+"/"+width+"-"+theme+"-detail.png"});
        await checkOverflow(page,width+" "+theme+" detail");
        assert.deepEqual(errors,[],width+" "+theme+" uncaught page errors");
        await context.close();
      }
    }
    // Check the two intermediate desktop/tablet breakpoints with normal motion.
    for(const width of [768,1024]){
      const context=await browser.newContext({viewport:{width,height:900},reducedMotion:"no-preference"});
      const page=await context.newPage();await page.goto(origin+route,{waitUntil:"networkidle"});
      await page.evaluate(()=>document.fonts.ready);
      await checkOverflow(page,width+" normal motion");
      await page.getByRole("button",{name:"Play showcase",exact:true}).click();
      await page.waitForFunction(()=>document.querySelector(".tech-reel__bar strong")?.textContent==="Global Wealth Investments",{},{timeout:9000});
      await page.getByRole("button",{name:"Pause showcase",exact:true}).click();
      await page.locator(".tech-reel").scrollIntoViewIfNeeded();
      await page.screenshot({path:output+"/"+width+"-motion-showcase.png"});
      await context.close();
    }
    const context=await browser.newContext({javaScriptEnabled:false});
    const page=await context.newPage();
    await page.goto(origin+route);
    assert.equal(await page.locator(".tech-index__rows li a").count(),18,"All projects available without JS");
    await context.close();
    const detailContext=await browser.newContext({reducedMotion:"reduce"});
    const detailPage=await detailContext.newPage();
    for(const slug of slugs){
      const response=await detailPage.goto(origin+route+"/"+slug,{waitUntil:"domcontentloaded"});
      assert.equal(response.status(),200,slug+" static route");
      const images=detailPage.locator(".tech-detail__hero img");
      assert.equal(await images.count(),2);
      await decoded(images.nth(0));await decoded(images.nth(1));
      await checkOverflow(detailPage,slug+" detail");
      assert(await detailPage.locator('link[rel="canonical"]').getAttribute("href").then(v=>v.endsWith("/"+slug)),slug+" canonical");
    }
    await detailContext.close();
    console.log("AIWA_TECHNOLOGY_PORTFOLIO_PASS projects="+slugs.length+" themes=2 widths=5");
  }finally{await browser.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
