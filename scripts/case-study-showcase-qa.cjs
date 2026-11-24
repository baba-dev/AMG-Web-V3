/* Focused static-export regression; uses the existing CI preview. */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {chromium}=require("playwright");
const origin=process.env.AIWA_ORIGIN||"http://127.0.0.1:4173";
const folder="test-artifacts/case-study-showcase";
const slugs=["mymo-express","casabella-oman","best-genetco"];
(async()=>{
 fs.mkdirSync(folder,{recursive:true});
 const browser=await chromium.launch({headless:true,args:["--disable-dev-shm-usage"]});
 try {
  for(const width of [320,390,768,1440]) for(const theme of ["dark","light"]){
   const ctx=await browser.newContext({viewport:{width,height:900},colorScheme:theme,reducedMotion:"reduce"});
   const page=await ctx.newPage();const errors=[];page.on("pageerror",e=>errors.push(e.message));
   await page.addInitScript(t=>localStorage.setItem("theme",t),theme);
   const response=await page.goto(origin+"/work/case-studies",{waitUntil:"domcontentloaded"});
   assert.equal(response.status(),200);
   await page.waitForFunction(t=>document.documentElement.classList.contains(t),theme);
   await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator("[data-showcase-chapter]").count(),3);
   assert.equal(await page.locator(".cs-metrics").count(),2);
   assert.match(await page.locator("#mymo-express .cs-metrics").innerText(),/3,000/);
   assert.match(await page.locator("#casabella-oman .cs-metrics").innerText(),/105K/);
   assert.equal(await page.locator("#best-genetco .cs-metrics").count(),0);
   assert.doesNotMatch(await page.locator("main").innerText(),/170%|1\.5 million/);
   assert.equal(await page.locator(".aiwa-footer").count(),1);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),width+": horizontal overflow");
   const themeSurface=await page.locator(".cs-chapter").first().evaluate(el=>getComputedStyle(el).backgroundColor);
   assert.equal(themeSurface,theme==="light"?"rgb(245, 245, 243)":"rgb(15, 15, 15)");
   assert.equal(await page.locator(".cs-hero h1 b").evaluate(el=>getComputedStyle(el).animationName),"none");
   for(const slug of slugs){
    await page.locator(".cs-index a[href='#"+slug+"']").click();
    await page.waitForFunction(s=>location.hash==="#"+s,slug);
    await page.waitForFunction(s=>document.querySelector(".cs-index a[href='#"+s+"']")?.getAttribute("aria-current")==="location",slug);
    const chapter=page.locator("#"+slug);
    assert.equal(await chapter.locator("a[href='/work/"+slug+"']").count(),1);
    const image=chapter.locator(".cs-chapter-art img");
    await image.scrollIntoViewIfNeeded();await image.evaluate(el=>el.decode());
    assert.ok(await image.evaluate(el=>el.naturalWidth>0));
   }
   const trigger=page.locator("#mymo-express .cs-gallery-open");
   await trigger.click();const dialog=page.locator("#mymo-express dialog");
   assert.equal(await dialog.evaluate(el=>el.open),true);
   await page.keyboard.press("Escape");assert.equal(await dialog.evaluate(el=>el.open),false);
   assert.ok(await trigger.evaluate(el=>document.activeElement===el));
   if(width===390||width===1440){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:folder+"/"+width+"-"+theme+"-hero.png"});await page.locator("#casabella-oman .cs-metrics").scrollIntoViewIfNeeded();await page.screenshot({path:folder+"/"+width+"-"+theme+"-results.png"});}
   assert.deepEqual(errors,[]);
   await ctx.close();
  }
  const noJs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await noJs.newPage();await page.goto(origin+"/work/case-studies");
  assert.equal(await page.locator("[data-showcase-chapter]").count(),3);
  assert.ok(await page.locator("#best-genetco h2").isVisible());
  assert.ok(await page.locator(".cs-index a[href='#best-genetco']").isVisible());
  await noJs.close();
  console.log("AIWA_CASE_SHOWCASE_QA_PASS");
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
