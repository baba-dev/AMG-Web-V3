/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {chromium}=require("playwright");
const origin=process.env.AIWA_ORIGIN||"http://127.0.0.1:4173";
const out="test-artifacts/about";fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true});
try{
for(const theme of ["light","dark"]) for(const width of [320,390,768,1440,1920]){
 const ctx=await browser.newContext({viewport:{width,height:900},colorScheme:theme,reducedMotion:"reduce"});
 const page=await ctx.newPage();const errors=[];page.on("pageerror",e=>errors.push(e.message));
 await page.addInitScript(t=>localStorage.setItem("theme",t),theme);
 const response=await page.goto(origin+"/about.html");assert.equal(response.status(),200);
 await page.waitForFunction(t=>document.documentElement.classList.contains(t),theme);
 await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator("main h1").count(),1);
 assert.match(await page.locator("main h1").innerText(),/BEYOND\s*THE NOISE/);
 assert.equal(await page.locator("main .ab-section").count(),9);
 assert.equal(await page.locator(".ab-capabilities a").count(),12);
 assert.equal(await page.locator(".ab-work a").count(),3);
 assert.equal(await page.locator(".ab-capability-name svg").count(),12);
 const headline=await page.locator("#ab-title").evaluate(el=>[...el.querySelectorAll(":scope > span > b, :scope > span > em")].map(n=>({w:n.scrollWidth,c:n.clientWidth})));assert(headline.every(n=>n.w<=n.c+2),JSON.stringify(headline));
 assert.equal(await page.locator(".aiwa-office").count(),0);
 assert.equal(await page.locator("#site-footer").count(),1);
 assert.equal(await page.locator('.aiwa-footer__navigation a[href="/about"]').count(),1);
 for(const name of ["Passionate","Collaborative","Results-Oriented"]){
  const button=page.getByRole("button",{name:new RegExp(name)});await button.click();
  assert.equal(await button.getAttribute("aria-pressed"),"true");
  assert.equal(await page.locator(".ab-value-panel h3").innerText(),name);
 }
 const metrics=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,broken:[...document.querySelectorAll(".about-page img")].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)}));
 assert(metrics.overflow<=2,JSON.stringify(metrics));assert.deepEqual(metrics.broken,[]);
 assert.deepEqual(errors,[]);
 if(width===390||width===1440){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:out+"/"+theme+"-"+width+".png",fullPage:true});}
 await ctx.close();
}
const ctx=await browser.newContext({javaScriptEnabled:false});const page=await ctx.newPage();await page.goto(origin+"/about.html");assert.equal(await page.locator(".ab-section").count(),9);assert.equal(await page.locator(".ab-capabilities a").count(),12);assert.equal(await page.locator("noscript dt").count(),3);await ctx.close();
console.log("AIWA_ABOUT_QA_PASS");
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
