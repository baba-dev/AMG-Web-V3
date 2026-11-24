/* Focused client directory checks, using the existing exported preview and Chromium. */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {execFileSync}=require("node:child_process");
const {chromium}=require("playwright");
const base=process.env.AIWA_TEST_URL||"http://127.0.0.1:4173";
const folder="test-artifacts/client-directory";
fs.mkdirSync(folder,{recursive:true});
execFileSync(process.execPath,["scripts/client-directory-assets.mjs"],{stdio:"inherit"});
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--disable-dev-shm-usage"]});
 try{
  for(const [width,height] of [[1440,900],[390,844],[320,700]]){
   const context=await browser.newContext({viewport:{width,height},reducedMotion:"reduce",deviceScaleFactor:1});
   const page=await context.newPage();const errors=[];page.on("pageerror",e=>errors.push(e.message));
   try{
    const response=await page.goto(base+"/work/clients",{waitUntil:"domcontentloaded"});
    assert.equal(response.status(),200);
    await page.evaluate(()=>document.fonts.ready);
    const gallery=page.locator(".cd-gallery");
    const cards=page.locator(".cd-gallery [data-client-id]");
    await cards.first().waitFor();
    assert.equal(await cards.count(),27);
    assert.equal(await page.locator('[data-client-id="rcs-oman"],[data-client-id="vitamin-phones"]').count(),0);
    assert.equal(await page.locator(".cd-card-art").first().evaluate(e=>getComputedStyle(e).backgroundColor),"rgb(255, 255, 255)");
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),width+": overflow");
    assert.equal(await page.locator(".cd-hero-top").count(),0,"archive header strip removed");
    assert.equal(await page.locator(".cd-orbit").count(),0,"old orbital widget removed");
    assert.equal(await page.locator(".cd-story-link").count(),3,"three related portfolio stories");
    const home=await context.newPage();
    await home.goto(base+"/",{waitUntil:"domcontentloaded"});
    await home.evaluate(()=>document.fonts.ready);
    const homeType=await home.evaluate(()=>{
      const hero=getComputedStyle(document.querySelector(".aiwa-hero__headline"));
      const label=getComputedStyle(document.querySelector(".aiwa-specialisms__top h2"));
      return {display:hero.fontFamily,tracking:hero.letterSpacing,body:label.fontFamily,labelWeight:label.fontWeight};
    });
    await home.close();
    const type=await page.evaluate(()=>{
      const hero=getComputedStyle(document.querySelector(".cd-hero h1"));
      const label=getComputedStyle(document.querySelector(".cd-hero-kicker"));
      const outro=getComputedStyle(document.querySelector(".cd-outro h2"));
      const together=getComputedStyle(document.querySelector(".cd-outro h2>span:last-child"));
      const fits=Array.from(document.querySelectorAll(".cd-hero h1>span>b,.cd-outro h2>span")).every(el=>{
        const range=document.createRange();range.selectNodeContents(el);
        const text=range.getBoundingClientRect(), box=el.getBoundingClientRect();
        return text.width<=box.width+2;
      });
      return {display:hero.fontFamily,body:label.fontFamily,labelWeight:label.fontWeight,outro:outro.fontFamily,style:together.fontStyle,weight:together.fontWeight,fits};
    });
    assert.equal(type.display,homeType.display,"homepage display family");
    assert.equal(type.body,homeType.body,"homepage eyebrow family");
    assert.equal(type.labelWeight,homeType.labelWeight,"homepage eyebrow weight");
    assert.equal(type.outro,homeType.display,"outro poster family");
    assert.equal(type.style,"normal","upright TOGETHER");
    assert.equal(type.weight,"400","normal poster weight");
    assert.ok(type.fits,width+": poster lettering exceeds text column");
    await page.screenshot({path:folder+"/"+width+"-hero.png"});
    await page.locator(".cd-connections").scrollIntoViewIfNeeded();
    await page.screenshot({path:folder+"/"+width+"-stories.png"});
    await page.locator(".cd-outro h2").scrollIntoViewIfNeeded();
    await page.screenshot({path:folder+"/"+width+"-outro.png"});
    const search=page.getByRole("searchbox",{name:"Search client names"});
    await search.fill("fundoo");await page.waitForFunction(()=>document.querySelectorAll(".cd-gallery [data-client-id]").length===1);
    assert.equal(await cards.first().getAttribute("data-client-id"),"fundoo-toys");
    const card=page.getByRole("button",{name:"Explore Fundoo Toys",exact:true});
    await card.click();
    const dialog=page.getByRole("dialog");await dialog.waitFor({state:"visible"});
    assert.match(await dialog.getByRole("heading",{level:2}).innerText(),/Fundoo Toys/);
    await page.keyboard.press("Escape");await dialog.waitFor({state:"hidden"});
    assert.ok(await card.evaluate(e=>document.activeElement===e),"focus returns to card");
    await page.getByRole("button",{name:"Clear search",exact:true}).click();
    await page.waitForFunction(()=>document.querySelectorAll(".cd-gallery [data-client-id]").length===27);
    await page.getByRole("button",{name:"Food & beverage"}).click();
    await page.waitForFunction(()=>document.querySelectorAll(".cd-gallery [data-client-id]").length<27);
    assert.ok(await cards.count()>0);
    await page.getByRole("button",{name:"Index",exact:true}).click();
    await page.locator(".cd-gallery-index").waitFor();
    await page.reload({waitUntil:"domcontentloaded"});await page.locator(".cd-gallery-index").waitFor();
    await page.getByRole("button",{name:"All brands"}).click();
    await page.getByRole("button",{name:"Play",exact:true}).click();
    await page.locator(".cd-play-grid").waitFor();
    assert.equal(await page.locator(".cd-play-tile").count(),27);
    if(width>767){const handle=page.getByRole("button",{name:"Move AquaPetro Chemicals card"});await handle.focus();await page.keyboard.press("ArrowRight");assert.match(await page.locator(".cd-play-tile").first().getAttribute("style"),/5px/);await page.getByRole("button",{name:"Reset layout"}).click();}
    await page.getByRole("button",{name:"Gallery",exact:true}).click();await gallery.waitFor();
    await page.locator(".cd-card").first().scrollIntoViewIfNeeded();
    await page.screenshot({path:folder+"/"+width+"-gallery.png"});
    await page.evaluate(()=>{document.documentElement.classList.remove("dark");document.documentElement.classList.add("light");});
    assert.equal(await page.locator(".cd-card-art").first().evaluate(e=>getComputedStyle(e).backgroundColor),"rgb(255, 255, 255)");
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),width+": light overflow");
    await page.screenshot({path:folder+"/"+width+"-light.png"});
    assert.deepEqual(errors,[]);
   }finally{await context.close();}
  }
 }finally{await browser.close();}
 console.log("Client directory smoke passed.");
})().catch(e=>{console.error(e);process.exitCode=1;});
