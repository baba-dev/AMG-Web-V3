/* P2-C — seven service stories plus directory, source evidence and routing. */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {chromium}=require("playwright");
const origin=(process.env.AIWA_TEST_URL||"http://127.0.0.1:4173").replace(/\/+$/,"");
const output="test-artifacts/specialisms-p2c";
const viewports=[[1440,900],[1280,800],[950,800],[768,850],[430,932],[390,844],[360,800],[320,700]];
const records=[
 ["global","GLOBAL",2],
 ["creatives","CREATIVES",1],
 ["corporate","CORPORATE",1],
 ["sports","SPORTS",0],
 ["social","SOCIAL",2],
 ["studio","STUDIO",1],
 ["tech","TECH",2],
];
fs.mkdirSync(output,{recursive:true});
const check=(v,message)=>assert.ok(v,message);
const pause=async page=>{await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(120);};
const sample=async page=>page.evaluate(()=>{
 const rect=s=>{const x=document.querySelector(s);if(!x)return null;const r=x.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,width:r.width,height:r.height};};
 return {
  overflow:document.documentElement.scrollWidth-innerWidth,
  bg:getComputedStyle(document.querySelector(".spec-site")).backgroundColor,
  font:getComputedStyle(document.querySelector(".spec-site")).fontFamily,
  hero:rect(".spec-directory__hero,.spec-detail__hero"),
  headline:rect(".spec-directory__hero h1,.spec-detail__hero-headline"),
  header:rect(".aiwa-inner-header"),
 };
});
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--disable-dev-shm-usage"]});
 const measurements=[];
 try{
  for(const [width,height] of viewports){
   const context=await browser.newContext({viewport:{width,height},reducedMotion:"reduce",deviceScaleFactor:1,colorScheme:"dark"});
   const page=await context.newPage();
   const errors=[];page.on("pageerror",e=>errors.push(e.message));
   try{
    const dir=await page.goto(origin+"/specialisms",{waitUntil:"domcontentloaded",timeout:45000});
    assert.equal(dir?.status(),200,width+": directory failed to load");
    await pause(page);
    assert.equal(await page.locator("[data-specialisms-directory]").count(),1);
    assert.equal(await page.locator("[data-specialism-card]").count(),7,width+": cards");
    assert.deepEqual(await page.locator(".spec-directory__card").evaluateAll(x=>x.map(v=>new URL(v.href).pathname)),
      records.map(([slug])=>"/specialisms/"+slug),width+": wrong project href order");
    const state=await sample(page);
    check(state.overflow<=2,width+": directory overflow "+state.overflow);
    check(/space[_ ]?grotesk|aiwa roc grotesk/i.test(state.font),width+": directory body font "+state.font);
    const cards=await page.locator(".spec-directory__card").count();
    assert.equal(cards,7);
    if(width===1440 || width===390 || width===320){
      await page.screenshot({path:output+"/"+width+"x"+height+"-directory-hero.png"});
      await page.evaluate(()=>document.getElementById("all-services").scrollIntoView({behavior:"instant",block:"start"}));
      await page.screenshot({path:output+"/"+width+"x"+height+"-directory-cards.png"});
    }
    for(const [slug,name,relatedCount] of records){
      const response=await page.goto(origin+"/specialisms/"+slug,{waitUntil:"domcontentloaded",timeout:45000});
      assert.equal(response?.status(),200,width+"/"+slug+": missing static detail page");
      await pause(page);
      assert.equal(await page.locator("[data-specialism]").getAttribute("data-specialism"),slug);
      assert.equal((await page.locator("#specialism-heading").textContent()).trim().toUpperCase(),name);
      assert.equal(await page.locator(".spec-detail__approach li").count(),3,width+"/"+slug+": three approach phases");
      check(await page.locator(".spec-detail__capabilities li").count()>=3,width+"/"+slug+": capability evidence absent");
      assert.equal(await page.locator("[data-related-work]").count(),relatedCount,width+"/"+slug+": wrongly associated work");
      if(slug==="sports"){
       assert.equal(await page.locator("[data-no-verified-case-study]").count(),1);
       check(/no (published|verified).*sports/i.test((await page.locator("[data-no-verified-case-study]").innerText()).toLowerCase().replace(/\s+/g," ")),
          "Sports honesty disclosure missing");
      }else{
       assert.equal(await page.locator("[data-no-verified-case-study]").count(),0);
      }
      if(slug==="creatives") {
        const type=await page.evaluate(()=>{const s=q=>getComputedStyle(document.querySelector(q));return {display:[".spec-detail__hero-headline",".spec-detail__thinking h2",".spec-detail__capabilities li h3",".creative-lab h2",".creative-lab__scene strong"].map(q=>s(q).fontFamily),body:[".spec-detail__thinking-text",".spec-detail__hero-bottom>a",".creative-lab__controls button",".creative-lab__caption p"].map(q=>s(q).fontFamily),emphasis:[".spec-detail__hero-headline em",".creative-lab h2 em"].map(q=>({family:s(q).fontFamily,weight:s(q).fontWeight,style:s(q).fontStyle})),mono:s(".creative-lab__controls small").fontFamily};});
        check(type.display.every(f=>/anton/i.test(f)),JSON.stringify(type));
        check(type.body.every(f=>/space[_ ]?grotesk/i.test(f)),JSON.stringify(type));
        check(type.emphasis.every(f=>/barlow/i.test(f.family)&&f.weight==="900"&&f.style==="italic"),JSON.stringify(type));
        check(/geist.*mono/i.test(type.mono),JSON.stringify(type));
        assert.equal(await page.locator(".creative-lab__controls button").count(),6);
        await page.getByRole("button",{name:/Photography/}).click();
        assert.equal(await page.getByRole("button",{name:/Photography/}).getAttribute("aria-pressed"),"true");
        assert.equal(await page.locator(".creative-lab__scene strong").textContent(),"FOCUS.");
        const scenes=new Set();
        for(const control of await page.locator(".creative-lab__controls button").all()) {
          await control.click();
          assert.equal(await control.getAttribute("aria-pressed"),"true");
          assert.equal(await page.locator(".creative-lab__controls button[aria-pressed=true]").count(),1);
          scenes.add(await page.locator(".creative-lab__scene svg").innerHTML());
        }
        assert.equal(scenes.size,6,"Each discipline must have unique artwork");
        assert.equal(await page.locator(".creative-lab__scene strong").evaluate(el=>getComputedStyle(el).animationName),"none");
      }
      const hrefs=await page.locator("[data-related-work]").evaluateAll(list=>list.map(x=>new URL(x.href).pathname));
      check(hrefs.every(x=>x.startsWith("/work/")),slug+": related work must stay on Aiwa V3");
      const references=await page.locator(".spec-detail__sources a").evaluateAll(list=>list.map(x=>({
       href:x.href,protocol:new URL(x.href).protocol,domain:new URL(x.href).hostname,
       target:x.target,rel:x.rel
      })));
      check(references.length>=1 && references.every(x=>x.protocol==="https:"&&x.domain==="aiwamediagroup.com"&&x.target==="_blank"&&x.rel.includes("noopener")),
        slug+": unsupported source URL");
      check(/conceptual/i.test(await page.locator("#specialism-art-caption").innerText()),
        slug+": original conceptual media not disclosed");
      assert.equal(await page.locator(".spec-detail__pager a").count(),2);
      const schema=JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent());
      assert.equal(schema["@type"],"Service");
      check(schema.name.toLowerCase().includes(slug),slug+": schema incorrect");
      check((await page.title()).toLowerCase().includes(slug),slug+": page title missing");
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href")!==null,true);
      const state=await sample(page);
      check(state.overflow<=2,width+"/"+slug+": horizontal overflow "+state.overflow);
      check(state.hero.height>=200,width+"/"+slug+": hero collapsed");
      if(width>=1280){
        check(state.hero.height<=height-83+20,
          width+"/"+slug+": first hero extends below the viewport "+state.hero.height);
      }
      const heroImage=page.locator(".spec-detail__art img");
      const imageDecoded=await heroImage.evaluate(async img=>{
        try{await img.decode();return img.naturalWidth>0 && img.naturalHeight>0;}
        catch{return false;}
      });
      check(imageDecoded,width+"/"+slug+": original service SVG did not decode");
      check(state.headline.left>=-12 && state.headline.right<=width+12,
        width+"/"+slug+": headline content outside viewport "+JSON.stringify(state.headline));
      const minHeights=await page.evaluate(()=>[...document.querySelectorAll(
        ".spec-detail__hero-nav a,.spec-detail__hero-bottom a,.spec-detail__sources a,.spec-detail__pager a,.spec-detail__contact a"
       )].map(x=>({label:(x.textContent||"").trim().slice(0,25),height:x.getBoundingClientRect().height})));
      check(minHeights.every(x=>x.height>=43.5),width+"/"+slug+": undersized CTA "+JSON.stringify(minHeights));
      const motion=await page.locator(".spec-detail__hero-headline>span").first().evaluate(x=>getComputedStyle(x).animationName);
      assert.equal(motion,"none",slug+": reduced-motion should disable animations");
      await page.evaluate(()=>document.getElementById("service-thinking").scrollIntoView({behavior:"instant",block:"start"}));
      const anchors=await page.evaluate(()=>{
       const header=document.querySelector(".aiwa-inner-header").getBoundingClientRect();
       const heading=document.querySelector("#service-thinking").getBoundingClientRect();
       return {headerBottom:header.bottom,sectionTop:heading.top};
      });
      check(anchors.sectionTop>=anchors.headerBottom-2,
        width+"/"+slug+": sticky header obscures service section "+JSON.stringify(anchors));
      check((await sample(page)).overflow<=2,width+"/"+slug+": scroll overflow");
      if(width===390 || width===1440){
        await page.evaluate(()=>scrollTo(0,0));
        await page.screenshot({path:output+"/"+width+"x"+height+"-"+slug+"-hero.png"});
        await page.evaluate(()=>document.querySelector(".spec-detail__art").scrollIntoView({behavior:"instant",block:"start"}));
        await page.screenshot({path:output+"/"+width+"x"+height+"-"+slug+"-art.png"});
        await page.evaluate(()=>document.getElementById("service-thinking").scrollIntoView({behavior:"instant",block:"start"}));
        await page.screenshot({path:output+"/"+width+"x"+height+"-"+slug+"-thinking.png"});
        await page.evaluate(()=>document.querySelector(".spec-detail__related").scrollIntoView({behavior:"instant",block:"start"}));
        await page.screenshot({path:output+"/"+width+"x"+height+"-"+slug+"-related.png"});
      }
      measurements.push({width,height,slug,...state});
    }
    assert.deepEqual(errors,[],width+": browser page errors");
    // Inner header should navigate to the directory, while homepage retains #specialisms.
    const nav=page.locator(".aiwa-inner-header__links a").filter({hasText:"SPECIALISMS"}).first();
    assert.equal(await nav.getAttribute("href"),"/specialisms");
    if(width<=1080){
      const menu=page.locator(".aiwa-inner-header__menu");
      await menu.click();
      assert.equal(await menu.getAttribute("aria-expanded"),"true");
      await page.keyboard.press("Escape");
      assert.equal(await menu.getAttribute("aria-expanded"),"false");
    }
   }finally{await context.close();}
  }
  // The six approved homepage disciplines are placeholders until their pages are completed.
  const home=await browser.newContext({viewport:{width:390,height:844},reducedMotion:"reduce"});
  const homePage=await home.newPage();
  await homePage.goto(origin+"/",{waitUntil:"domcontentloaded"});
  assert.deepEqual(await homePage.locator(".aiwa-specialisms__row").evaluateAll(nodes=>nodes.map(x=>x.getAttribute("href"))),
    ["/specialisms/creatives", ...Array(5).fill("#")],"Homepage must link Creatives and keep five placeholders");
  assert.equal(await homePage.locator(".aiwa-specialisms__all").getAttribute("href"),"#");
  assert.equal(await homePage.locator(".aiwa-header__navigation a").filter({hasText:"SPECIALISMS"}).getAttribute("href"),"/specialisms");
  await home.close();
  // Both themes change actual surfaces; no opaque overlay or token regression.
  const themeCtx=await browser.newContext({viewport:{width:390,height:844},colorScheme:"dark"});
  const theme=await themeCtx.newPage();
  await theme.goto(origin+"/specialisms/tech",{waitUntil:"domcontentloaded"});
  await pause(theme);
  assert.equal(await theme.locator(".spec-detail__hero").evaluate(x=>getComputedStyle(x).backgroundColor),"rgb(10, 10, 10)");
  await theme.locator(".aiwa-theme-toggle").click();
  await theme.waitForTimeout(500);
  assert.equal(await theme.locator(".spec-detail__hero").evaluate(x=>getComputedStyle(x).backgroundColor),"rgb(245, 245, 243)");
  assert.equal(await theme.locator(".aiwa-inner-header").evaluate(x=>getComputedStyle(x).backgroundColor),"rgb(245, 245, 243)");
  await theme.screenshot({path:output+"/390x844-tech-light.png"});
  await theme.goto(origin+"/specialisms",{waitUntil:"domcontentloaded"});
  await pause(theme);
  assert.equal(await theme.locator(".spec-directory__hero").evaluate(x=>getComputedStyle(x).backgroundColor),"rgb(245, 245, 243)");
  await themeCtx.close();
  // No JavaScript still yields every service card and full narrative content.
  const noJs=await browser.newContext({viewport:{width:360,height:800},javascriptEnabled:false});
  const noJsPage=await noJs.newPage();
  await noJsPage.goto(origin+"/specialisms",{waitUntil:"domcontentloaded"});
  assert.equal(await noJsPage.locator(".spec-directory__card").count(),7);
  await noJsPage.goto(origin+"/specialisms/sports",{waitUntil:"domcontentloaded"});
  assert.equal(await noJsPage.locator(".spec-detail__capabilities li").count(),4);
  assert.equal(await noJsPage.locator("[data-no-verified-case-study]").count(),1);
  await noJs.close();
  fs.writeFileSync(output+"/measurements.json",JSON.stringify(measurements,null,2));
  console.log("AIWA_SPECIALISMS_P2C_PASS",JSON.stringify({routes:8,viewports:viewports.length,serviceChecks:measurements.length}));
 }finally{await browser.close();}
})().catch(err=>{console.error("AIWA_SPECIALISMS_P2C_FAIL",err);process.exitCode=1;});
