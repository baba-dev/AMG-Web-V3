/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {chromium}=require("playwright");
const origin=process.env.AIWA_ORIGIN||"http://127.0.0.1:4173";
const out="test-artifacts/about";fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true});
try{
for(const theme of ["light","dark"]) for(const width of [320,360,390,430,768,950,1280,1440,1920]){
 const ctx=await browser.newContext({viewport:{width,height:900},colorScheme:theme,reducedMotion:"reduce"});
 const page=await ctx.newPage();const errors=[];page.on("pageerror",e=>errors.push(e.message));
 await page.addInitScript(t=>localStorage.setItem("theme",t),theme);
 const response=await page.goto(origin+"/about.html");assert.equal(response.status(),200);
 await page.waitForFunction(t=>document.documentElement.classList.contains(t),theme);
 await page.evaluate(()=>document.fonts.ready);
 const typography=await page.evaluate(()=>{
 const style=s=>getComputedStyle(document.querySelector(s));
 return {display:[".ab-poster",".ab-heading",".ab-stats dd"].map(s=>style(s).fontFamily),emphasis:[...document.querySelectorAll(".ab-poster em,.ab-heading em")].map(el=>({family:getComputedStyle(el).fontFamily,style:getComputedStyle(el).fontStyle,weight:getComputedStyle(el).fontWeight})),body:[".ab-copy",".ab-link",".ab-value-buttons button",".ab-capabilities a",".ab-work h3"].map(s=>style(s).fontFamily),mono:style(".ab-kicker").fontFamily,loaded:[...document.fonts].filter(f=>f.status==="loaded").map(f=>f.family)};
 });
 assert(typography.display.every(f=>/anton/i.test(f)),JSON.stringify(typography));
 assert(typography.emphasis.every(f=>/barlow/i.test(f.family)&&f.style==="italic"&&f.weight==="900"),JSON.stringify(typography));
 assert(typography.body.every(f=>/space[_ ]?grotesk/i.test(f)),JSON.stringify(typography));
 assert(/geist.*mono/i.test(typography.mono),JSON.stringify(typography));
 assert(typography.loaded.some(f=>/anton/i.test(f))&&typography.loaded.some(f=>/space[_ ]?grotesk/i.test(f)),JSON.stringify(typography));
 assert.equal(await page.locator("main h1").count(),1);
 assert.match(await page.locator("main h1").innerText(),/BEYOND\s*THE NOISE/);
 assert.equal(await page.locator("main .ab-section").count(),9);
 assert.equal(await page.locator(".ab-capabilities a").count(),12);
 assert.equal(await page.locator(".ab-work a").count(),3);
 assert.equal(await page.locator(".ab-capability-name svg").count(),12);
 const headline=await page.locator("#ab-title").evaluate(el=>[...el.querySelectorAll(":scope > span > b, :scope > span > em")].map(n=>({w:n.scrollWidth,c:n.clientWidth})));assert(headline.every(n=>n.w<=n.c+2),JSON.stringify(headline));
 assert.equal(await page.locator(".aiwa-office").count(),0);
 assert.equal(await page.locator("#site-footer").count(),1);
 assert.equal(await page.locator('.aiwa-footer__links a').filter({hasText:"About Us"}).count(),1);
 assert.equal(await page.locator('.aiwa-footer__links a').filter({hasText:"About Us"}).getAttribute("href"),"#");
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
