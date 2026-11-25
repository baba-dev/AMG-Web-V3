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
        const response=await page.goto(origin+route,{waitUntil:"networkidle"});
        assert.equal(response.status(),200);
        await page.waitForFunction(t=>document.documentElement.classList.contains(t),theme);
        assert.equal(await page.locator("main h1").count(),1);
        assert.equal(await page.locator(".tech-index__rows li").count(),18);
        assert.equal(await page.locator(".aiwa-footer").count(),1);
        assert.equal(await page.locator(".tech-flagship a[href='/work/technology/aiwa-creators']").count(),2);
        await decoded(page.locator(".tech-flagship__visual img").first());
        await checkOverflow(page,width+" "+theme);
        await page.screenshot({path:output+"/"+width+"-"+theme+"-hero.png"});
        await page.locator(".tech-flagship").scrollIntoViewIfNeeded();
        await page.screenshot({path:output+"/"+width+"-"+theme+"-flagship.png"});
        await page.getByRole("button",{name:"Next project",exact:true}).click();
        await page.waitForFunction(()=>document.querySelector(".tech-reel__bar strong")?.textContent==="Global Wealth Investments");
        await page.locator("#tech-email summary").click();
        assert(await page.locator("#tech-email").evaluate(el=>el.open),"Email service disclosure opens");
        await page.getByRole("button",{name:"Digital products",exact:true}).click();
        await page.waitForFunction(()=>document.querySelectorAll(".tech-index__rows li").length===3);
        assert(new URL(page.url()).searchParams.get("type")==="Digital products","Shareable filter");
        await page.getByRole("button",{name:"Grid view",exact:true}).click();
        await page.waitForFunction(()=>document.querySelectorAll(".tech-grid .tech-card").length===3);
        await page.getByRole("searchbox",{name:"Search projects"}).fill("Creators");
        await page.waitForFunction(()=>document.querySelectorAll(".tech-grid .tech-card").length===1);
        await checkOverflow(page,width+" "+theme+" filtered");
        await page.goto(origin+route+"/aiwa-creators",{waitUntil:"networkidle"});
        assert.equal(await page.locator(".tech-detail__header h1").textContent(),"Creators by Aiwa.");
        await decoded(page.locator(".tech-detail__hero img").first());
        await page.getByRole("group",{name:"Screenshot view",exact:true}).getByRole("button",{name:"Mobile",exact:true}).click();
        await decoded(page.locator(".tech-viewer > .tech-single img"));
        await page.getByRole("button",{name:"Expand",exact:true}).click();
        assert(await page.locator(".tech-dialog").isVisible(),"Native fullscreen viewer");
        await page.keyboard.press("Escape");
        assert(!(await page.locator(".tech-dialog").isVisible()),"Escape closes dialog");
        await checkOverflow(page,width+" "+theme+" detail");
        assert.deepEqual(errors,[],width+" "+theme+" uncaught page errors");
        await context.close();
      }
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
      assert(await detailPage.locator('link[rel="canonical"]').getAttribute("href").then(v=>v.endsWith("/"+slug)),slug+" canonical");
    }
    await detailContext.close();
    console.log("AIWA_TECHNOLOGY_PORTFOLIO_PASS projects="+slugs.length+" themes=2 widths=3");
  }finally{await browser.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
