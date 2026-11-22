/* Homepage fidelity and cinematic-player tests: desktop/mobile, WAAPI
   intermediate frames, accessibility, scroll return, theme and no overflow. */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {chromium}=require("playwright");
const BASE=(process.env.AIWA_TEST_URL||"http://127.0.0.1:4173").replace(/\/+$/,"");
const OUT="test-artifacts/homepage-fidelity";
fs.mkdirSync(OUT,{recursive:true});
const near=(a,b,t=5)=>Math.abs(a-b)<=t;

async function run(browser,width,height){
 const ctx=await browser.newContext({
   viewport:{width,height},deviceScaleFactor:1,
   reducedMotion:"no-preference",
 });
 const page=await ctx.newPage();
 const errors=[];
 page.on("pageerror",e=>errors.push(e.message));
 // Network failures to YouTube must not hang the transition.
 await page.route("https://www.youtube-nocookie.com/**",route=>route.abort());
 await page.goto(BASE+"/",{waitUntil:"domcontentloaded",timeout:30000});
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForTimeout(1350);

 const geometry=await page.evaluate(()=>{
   const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}};
   const headline=document.querySelector(".aiwa-hero__headline");
   const words=[...headline.querySelectorAll(".aiwa-hero__mask")];
   const spec=document.querySelector(".aiwa-specialisms");
   const about=document.querySelector(".aiwa-about");
   const aboutImage=about.querySelector(".aiwa-about__media");
   const rgb=getComputedStyle(spec).backgroundColor;
   return {
     headline:rect(headline),words:words.map(rect),
     hero:rect(document.querySelector(".aiwa-hero")),
     tile:rect(document.querySelector(".aiwa-hero__film-tile")),
     specRGB:rgb,
     aboutRGB:getComputedStyle(about).backgroundColor,
     aboutImage:rect(aboutImage),
     overflow:document.documentElement.scrollWidth-innerWidth,
     rects:[...[".aiwa-hero",".aiwa-film-section",".aiwa-specialisms",".aiwa-about","#work","#office","#site-footer"]].map(s=>{
       const e=document.querySelector(s),r=e.getBoundingClientRect();
       return {name:s,top:r.top+scrollY,bottom:r.bottom+scrollY};
     }),
   };
 });
 assert(geometry.overflow<=2,"Document has horizontal overflow: "+geometry.overflow);
 assert(geometry.words.every(w=>w.x>=-10 && w.right<=width+10),
   "Hero text clips at "+width+": "+JSON.stringify(geometry.words));
 assert(geometry.rects.every((r,i,arr)=>i===0||near(arr[i-1].bottom,r.top,4)),
   "Homepage has a section seam gap/overlap");
 const specParts=geometry.specRGB.match(/\d+/g)?.map(Number)||[];
 const aboutParts=geometry.aboutRGB.match(/\d+/g)?.map(Number)||[];
 assert(specParts.slice(0,3).every(x=>x<=30),"Dark Specialisms must use the ink surface");
 assert(aboutParts.slice(0,3).every(x=>x<=30),"Dark About must use the ink surface");
 assert(geometry.aboutImage.w>width*.28,"About must be media-led");
 if(width>700) {
   const split=await page.evaluate(()=>({
     imageLeft:document.querySelector(".aiwa-about__media").getBoundingClientRect().left,
     statementRight:document.querySelector(".aiwa-about__heading").getBoundingClientRect().right,
     statement:document.querySelector("#aiwa-about-heading").textContent.replace(/\s+/g," ").trim(),
   }));
   assert(split.statementRight < split.imageLeft + 8,
     "Reference composition requires About type LEFT of its image");
   assert(split.statement.includes("BRAVE BRANDS."),
     "Two-line Aiwa headline should fit reference-like About composition");
 }


 await page.screenshot({path:OUT+"/"+width+"x"+height+"-hero.png"});
 const source=page.getByRole("button",{name:"Play Aiwa Media Group film"});
 await source.click();
 await page.waitForFunction(()=>document.querySelector("dialog.aiwa-cinema")?.open);
 const early=await page.evaluate(()=>({
   iframe:document.querySelectorAll("dialog.aiwa-cinema iframe").length,
   phase:document.querySelector("dialog.aiwa-cinema").dataset.phase,
   bodyScrollLock:document.body.style.overflow,
   panel:document.querySelector(".aiwa-cinema__panel").getBoundingClientRect().width,
 }));
 assert.equal(early.iframe,0,"Iframe must never mount before poster movement");
 assert.equal(early.bodyScrollLock,"hidden","Modal must lock background scroll");
 await page.waitForTimeout(220);
 await page.screenshot({path:OUT+"/"+width+"x"+height+"-film-expanding.png"});
 await page.waitForFunction(()=>document.querySelector("dialog.aiwa-cinema")?.dataset.phase==="open",{timeout:5000});
 await page.waitForTimeout(90);
 const full=await page.evaluate(()=>({
   player:document.querySelectorAll("dialog.aiwa-cinema iframe, dialog.aiwa-cinema video").length,
   loadingPoster:!!document.querySelector(".aiwa-cinema__poster"),
   focus:document.activeElement?.getAttribute("aria-label"),
 }));
 assert.equal(full.player,1,"Full player must mount after FLIP ends");
 assert(full.loadingPoster,"Poster should stay underneath media until loaded");
 assert.equal(full.focus,"Close film","Close button should take focus once ready");
 await page.screenshot({path:OUT+"/"+width+"x"+height+"-film-open.png"});
 await page.keyboard.press("Escape");
 await page.waitForFunction(()=>!document.querySelector("dialog.aiwa-cinema")?.open,{timeout:5000});
 const after=await page.evaluate(()=>({
   player:document.querySelectorAll("dialog.aiwa-cinema iframe, dialog.aiwa-cinema video").length,
   bodyScrollLock:document.body.style.overflow,
   focus:document.activeElement?.getAttribute("aria-label"),
 }));
 assert.equal(after.player,0,"Player must unmount during modal close");
 assert.notEqual(after.bodyScrollLock,"hidden","Body scroll lock must restore after close");
 assert.equal(after.focus,"Play Aiwa Media Group film","Source focus must be restored");
 await page.screenshot({path:OUT+"/"+width+"x"+height+"-film-return.png"});

 // Repeat using on-screen full-film stage as the source, not the small tile.
 await page.getByRole("button",{name:"Scroll to Aiwa showreel"}).click();
 await page.waitForTimeout(600);
 await page.waitForFunction(()=>
   document.querySelector(".aiwa-reel__caption")?.getAttribute("inert")===null,{timeout:5000});
 const start=await page.evaluate(()=>{
   const r=document.querySelector(".aiwa-reel").getBoundingClientRect();
   return {x:r.x,y:r.y,w:r.width,h:r.height,scrollY};
 });
 assert(near(start.w,width,5),"Reel failed to fill viewport before second modal open");
 await page.getByRole("button",{name:/PLAY FULL FILM/}).click();
 await page.waitForFunction(()=>document.querySelector("dialog.aiwa-cinema")?.dataset.phase==="open",{timeout:5000});
 await page.getByRole("button",{name:"Close film"}).click();
 await page.waitForFunction(()=>!document.querySelector("dialog.aiwa-cinema")?.open,{timeout:5000});
 assert.equal(await page.locator("dialog.aiwa-cinema iframe").count(),0);
 await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));
 await page.waitForTimeout(170);
 const returned=await page.evaluate(()=>{
   const a=document.querySelector(".aiwa-reel").getBoundingClientRect();
   const t=document.querySelector(".aiwa-hero__film-tile").getBoundingClientRect();
   return {reelWidth:a.width,tileWidth:t.width,reelX:a.x,tileX:t.x,overflow:document.documentElement.scrollWidth-innerWidth};
 });
 assert(near(returned.reelWidth,returned.tileWidth,5),"Reel must return to tiny tile after reverse scroll");
 assert(returned.overflow<=2);

 await page.evaluate(()=>document.querySelector("#specialisms").scrollIntoView({behavior:"instant"}));
 await page.waitForTimeout(300);
 await page.screenshot({path:OUT+"/"+width+"x"+height+"-specialisms.png"});
 await page.evaluate(()=>document.querySelector("#about").scrollIntoView({behavior:"instant"}));
 await page.waitForTimeout(260);
 await page.screenshot({path:OUT+"/"+width+"x"+height+"-about.png"});
 await page.evaluate(()=>document.querySelector("#work").scrollIntoView({behavior:"instant"}));
 await page.waitForTimeout(260);
 await page.screenshot({path:OUT+"/"+width+"x"+height+"-work.png"});
 await page.evaluate(()=>document.querySelector("#office").scrollIntoView({behavior:"instant"}));
 await page.waitForTimeout(260);
 await page.screenshot({path:OUT+"/"+width+"x"+height+"-say-hello.png"});
 await page.evaluate(()=>document.querySelector("#site-footer").scrollIntoView({behavior:"instant"}));
 await page.waitForTimeout(260);
 await page.screenshot({path:OUT+"/"+width+"x"+height+"-footer.png"});
 assert.equal(errors.length,0,"Uncaught browser errors: "+errors.join("; "));
 await ctx.close();
 return {size:width+"x"+height,early,full,after,returned,geometry};
}

async function reduced(browser) {
 const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:"reduce"});
 const page=await ctx.newPage();
 await page.route("https://www.youtube-nocookie.com/**",route=>route.abort());
 await page.goto(BASE+"/",{waitUntil:"domcontentloaded"});
 const trigger=page.getByRole("button",{name:"Play Aiwa Media Group film"});
 await trigger.click();
 await page.waitForFunction(()=>document.querySelector("dialog.aiwa-cinema")?.dataset.phase==="open",{timeout:5000});
 await page.getByRole("button",{name:"Close film"}).click();
 await page.waitForFunction(()=>!document.querySelector("dialog.aiwa-cinema")?.open,{timeout:5000});
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
 assert(overflow<=2);
 await ctx.close();
 return {reduced:true};
}

(async()=>{
 const browser=await chromium.launch({headless:true,args:["--disable-dev-shm-usage"]});
 try {
   const result={
     desktop:await run(browser,1440,900),
     desktopCompact:await run(browser,1280,800),
     mobile:await run(browser,390,844),
     mobileCompact:await run(browser,360,800),
     reduced:await reduced(browser),
   };
   fs.writeFileSync(OUT+"/measurements.json",JSON.stringify(result,null,2));
   console.log("AIWA_HOMEPAGE_FIDELITY_PLAYER_PASS");
 }finally{await browser.close();}
})().catch(e=>{console.error("AIWA_HOMEPAGE_FIDELITY_PLAYER_FAIL",e);process.exitCode=1;});
