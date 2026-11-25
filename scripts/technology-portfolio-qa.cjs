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
// Inspect rendered section surfaces, meaningful text and actual touch control boxes.
async function checkThemeSections(page,label){
  const issues=await page.locator(".tech-page main").evaluate(main=>{
    const failures=[],root=main.closest(".tech-page");
    const probe=document.createElement("span");
    root.append(probe);
    const colors={};
    for(const key of ["paper","paper-raised","paper-ink","paper-muted"]){
      probe.style.color="var(--aiwa-"+key+")";colors[key]=getComputedStyle(probe).color;
    }
    probe.remove();
    const isVisible=el=>el.getClientRects().length>0&&getComputedStyle(el).visibility==="visible"&&(!el.closest("details:not([open])")||!!el.closest("summary"));
    const rgba=value=>{const match=value.match(/^rgba?\(([^)]+)\)$/);return match?match[1].split(/[, /]+/).map(Number):null;};
    const luminance=rgb=>rgb.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
    function background(el){
      for(let node=el;node&&node!==document.documentElement;node=node.parentElement){
        const raw=getComputedStyle(node).backgroundColor;
        const c=rgba(raw);if(c&&(c.length<4||c[3]===1))return c;
        if(c&&c[3]>0)return null; // translucent surfaces need compositing; not used by the section chrome
      }
      return null;
    }
    for(const section of main.querySelectorAll(":scope > section,:scope > .tech-contact-note")){
      const s=getComputedStyle(section);
      if(![colors.paper,colors["paper-raised"]].includes(s.backgroundColor))failures.push(section.className+" has noncanonical surface "+s.backgroundColor);
      if(s.color!==colors["paper-ink"])failures.push(section.className+" has noncanonical ink "+s.color);
    }
    for(const el of main.querySelectorAll("h1,h2,h3,p,.tech-meta,.tech-pair__tag,.tech-index__rows strong,.tech-index__rows small,.tech-link,.tech-filter button,.tech-reel__progress button,.tech-search input")){
      if(!isVisible(el)||el.closest("svg"))continue;
      const fg=rgba(getComputedStyle(el).color),bg=background(el);
      if(!fg||!bg)continue;
      const l=[luminance(fg),luminance(bg)].sort((a,b)=>b-a);
      if((l[0]+.05)/(l[1]+.05)<4.49)failures.push((el.textContent||el.getAttribute("placeholder")||el.className).trim().slice(0,70)+" fails text contrast");
    }
    for(const el of main.querySelectorAll(".tech-controls button,.tech-icon-link,.tech-filter button,.tech-reel__progress button,.tech-link")){
      if(!isVisible(el))continue;
      const r=el.getBoundingClientRect();
      if(r.width<43.5||r.height<43.5)failures.push((el.getAttribute("aria-label")||el.textContent||el.className).trim().slice(0,70)+" has undersized touch target");
    }
    return failures;
  });
  assert.deepEqual(issues,[],label+" theme and touch controls");
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
        await checkThemeSections(page,width+" "+theme+" index");
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
        await checkThemeSections(page,width+" "+theme+" disclosure");
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
        await checkThemeSections(page,width+" "+theme+" dialog");
        await page.screenshot({path:output+"/"+width+"-"+theme+"-dialog.png"});
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
    // Exercise layout boundaries at both themes on one rendered page per theme.
    for(const theme of ["light","dark"]){
      const context=await browser.newContext({viewport:{width:390,height:844},colorScheme:theme,reducedMotion:"reduce",hasTouch:true});
      await context.addInitScript(t=>localStorage.setItem("theme",t),theme);
      const page=await context.newPage();
      await page.goto(origin+route,{waitUntil:"domcontentloaded"});
      await page.waitForFunction(t=>document.documentElement.classList.contains(t),theme);
      await page.evaluate(()=>document.fonts.ready);
      await page.locator(".tech-capability").evaluateAll(nodes=>nodes.forEach(node=>node.open=true));
      for(const width of [320,360,375,390,414,480,481,600,601,640,767,768,820,1000,1001,1024]){
        await page.setViewportSize({width,height:844});
        await checkOverflow(page,width+" "+theme+" all capabilities open");
        await checkThemeSections(page,width+" "+theme);
        assert.equal(await page.locator(".tech-engineering-art--compact").isVisible(),width<=600,"Responsive system diagram");
      }
      await page.setViewportSize({width:844,height:390});
      await checkOverflow(page,"landscape "+theme);
      await checkThemeSections(page,"landscape "+theme);
      await page.setViewportSize({width:390,height:844});
      const opposite=theme==="dark"?"light":"dark";
      await page.getByRole("button",{name:"Toggle colour theme",exact:true}).click();
      await page.waitForFunction(t=>document.documentElement.classList.contains(t),opposite);
      await checkThemeSections(page,"live toggle "+opposite);
      await checkOverflow(page,"live toggle "+opposite);
      await page.locator(".tech-engineering").scrollIntoViewIfNeeded();
      await page.screenshot({path:output+"/390-"+opposite+"-live-toggle.png"});
      await context.close();
    }
    const context=await browser.newContext({javaScriptEnabled:false});
    const page=await context.newPage();
    await page.goto(origin+route);
    assert.equal(await page.locator(".tech-index__rows li a").count(),18,"All projects available without JS");
    await context.close();
    // Every project detail in both themes at the smallest and desktop viewport.
    for(const theme of ["light","dark"]){
      const detailContext=await browser.newContext({viewport:{width:320,height:844},colorScheme:theme,reducedMotion:"reduce"});
      await detailContext.addInitScript(t=>localStorage.setItem("theme",t),theme);
      const detailPage=await detailContext.newPage();
      for(const slug of slugs){
        await detailPage.setViewportSize({width:320,height:844});
        const response=await detailPage.goto(origin+route+"/"+slug,{waitUntil:"domcontentloaded"});
        assert.equal(response.status(),200,slug+" static route");
        await detailPage.waitForFunction(t=>document.documentElement.classList.contains(t),theme);
        await detailPage.evaluate(()=>document.fonts.ready);
        const images=detailPage.locator(".tech-detail__hero img");
        assert.equal(await images.count(),2);
        await decoded(images.nth(0));await decoded(images.nth(1));
        for(const width of [320,1440]){
          await detailPage.setViewportSize({width,height:width===320?844:900});
          await checkOverflow(detailPage,slug+" "+theme+" "+width);
          await checkThemeSections(detailPage,slug+" "+theme+" "+width);
        }
        assert(await detailPage.locator('link[rel="canonical"]').getAttribute("href").then(v=>v.endsWith("/"+slug)),slug+" canonical");
      }
      await detailContext.close();
    }
    console.log("AIWA_TECHNOLOGY_PORTFOLIO_PASS projects="+slugs.length+" themes=2 responsive=320..1440");
  }finally{await browser.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
