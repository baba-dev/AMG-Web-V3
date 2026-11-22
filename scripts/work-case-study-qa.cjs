/* Aiwa P2-B: case-study source, interaction and responsive browser regression. */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {chromium}=require("playwright");
const origin=(process.env.AIWA_TEST_URL||"http://127.0.0.1:4173").replace(/\/+$/,"");
const out="test-artifacts/work-case-studies";
const viewports=[[1440,900],[1280,800],[950,800],[768,850],[430,932],[390,844],[360,800],[320,700]];
const projects=[
 {slug:"mymo-express",client:"MYMO EXPRESS",deliverables:4,status:"documented"},
 {slug:"casabella-oman",client:"CASABELLA OMAN",deliverables:4,status:"documented"},
 {slug:"best-genetco",client:"BEST BY GENETCO",deliverables:2,status:"limited"},
 {slug:"aqua-petro",client:"AQUA PETRO CHEMICALS",deliverables:4,status:"documented"},
 {slug:"razmazaan",client:"RAZMAZAAN",deliverables:4,status:"documented"},
 {slug:"vitamin-phones",client:"VITAMIN PHONES",deliverables:4,status:"documented"},
];
fs.mkdirSync(out,{recursive:true});
const fail=(message)=>{throw new Error(message)};
const check=(p,message)=>{if(!p)fail(message)};
const wait=async page=>{await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(80);};
const measure=async page=>page.evaluate(()=>{
  const rect=selector=>{
    const el=document.querySelector(selector);if(!el)return null;
    const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};
  };
  const headings=[".case-hero__display",".case-context__content h2",".case-idea h2",
     ".case-deliverables__heading h2",".case-visual-study__header h2",".case-conclusion h2"]
     .map(selector=>({selector,box:rect(selector)}));
  return {
    viewport:innerWidth,overflow:document.documentElement.scrollWidth-innerWidth,
    headings,hero:rect(".case-hero"),art:rect(".case-media__stage"),
    bodyFont:getComputedStyle(document.querySelector(".work-project-page")).fontFamily,
    topBackground:getComputedStyle(document.querySelector(".case-hero")).backgroundColor,
    paper:getComputedStyle(document.querySelector(".case-context")).backgroundColor,
    caseStudy:document.querySelector("[data-case-study]")?.dataset.caseStudy,
  };
});
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--disable-dev-shm-usage"]});
 const summary=[];
 try{
  for(const [width,height] of viewports){
   const ctx=await browser.newContext({
     viewport:{width,height},reducedMotion:"reduce",deviceScaleFactor:1,
   });
   const page=await ctx.newPage();
   const errors=[];
   page.on("pageerror",err=>errors.push(err.message));
   try{
    for(const [index,project] of projects.entries()){
      const response=await page.goto(origin+"/work/"+project.slug,{waitUntil:"domcontentloaded",timeout:45000});
      assert.equal(response?.status(),200,project.slug+" missing exported route");
      await wait(page);
      const head=(await page.locator("#project-heading").innerText()).trim();
      assert.equal(head,project.client,"Incorrect project title");
      assert.equal(await page.locator(".case-deliverables__list li").count(),
        project.deliverables,project.slug+": documented item count");
      assert.equal(await page.locator(".case-sources__links a").count()>=1,true,project.slug+": sources missing");
      assert.equal(await page.locator(".work-project__source").count(),1,
        project.slug+": primary evidence link missing");
      assert.equal(await page.locator(".work-project__next a").count(),2,
        project.slug+": previous/next navigation required");
      const links=await page.locator(".case-sources__links a").evaluateAll(xs=>xs.map(x=>({
        protocol:new URL(x.href).protocol,hostname:new URL(x.href).hostname,
        target:x.target,rel:x.rel,
      })));
      check(links.every(x=>x.protocol==="https:" &&
        ["aiwamediagroup.com","aquapetrochemicals.com"].includes(x.hostname) &&
        x.target==="_blank" && x.rel.includes("noopener")),
        project.slug+": invalid source link");
      const note=await page.locator("#case-media-description").innerText();
      check(/conceptual|editorial|original/i.test(note),project.slug+": art disclosure missing");
      const values=await measure(page);
      check(values.overflow<=2,project.slug+" at "+width+": page overflow "+values.overflow);
      check(values.headings.every(h=>h.box && h.box.width>0 &&
        h.box.left>=-10 && h.box.right<=width+10),
        project.slug+" "+width+": headline clipping "+JSON.stringify(values.headings));
      check(values.art?.height>280,project.slug+" "+width+": visual artwork collapsed");
      assert.equal(values.paper,"rgb(17, 18, 16)",project.slug+" dark narrative token mismatch");
      const headerBg=await page.locator(".aiwa-inner-header")
        .evaluate(el=>getComputedStyle(el).backgroundColor);
      assert.equal(headerBg,"rgb(10, 10, 10)",project.slug+" "+width+": translucent header obscures reading");
      check(/space[_ ]?grotesk|aiwa roc grotesk/i.test(values.bodyFont),
        project.slug+" "+width+": wrong body font "+values.bodyFont);
      const touch=await page.evaluate(()=>[...document.querySelectorAll(
        '.case-hero__navigation a,.case-hero__bottom a,.case-sources__links a,.work-project__next a,.aiwa-theme-toggle'
        )].map(x=>({text:(x.textContent||"").trim().slice(0,30),height:x.getBoundingClientRect().height})));
      check(touch.every(t=>t.height>=43.5),project.slug+" "+width+": undersized touch target "+JSON.stringify(touch));
      await page.evaluate(()=>document.getElementById("case-brief").scrollIntoView({behavior:"instant",block:"start"}));
      check((await measure(page)).overflow<=2,project.slug+" "+width+": scroll overflow");
      const anchor=await page.evaluate(()=>({
        headerBottom:document.querySelector(".aiwa-inner-header").getBoundingClientRect().bottom,
        briefTop:document.querySelector("#case-brief").getBoundingClientRect().top,
        labelTop:document.querySelector(".case-context__rail").getBoundingClientRect().top,
      }));
      check(anchor.labelTop>=anchor.headerBottom-2,
        project.slug+" "+width+": sticky header covers brief label "+JSON.stringify(anchor));
      const animation=await page.locator(".case-hero__display>span").first().evaluate(x=>getComputedStyle(x).animationName);
      assert.equal(animation,"none",project.slug+": reduced motion not respected");
      assert.equal(await page.locator("meta[property='og:title']").count(),1);
      check((await page.title()).includes(project.client),project.slug+": SEO title missing client");
      const schema=JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent());
      assert.equal(schema["@type"],"WebPage");
      check(schema.name.includes(project.client),project.slug+": schema lacks client");
      if(project.status==="limited"){
        const robots=await page.locator('meta[name="robots"]').getAttribute("content");
        check(robots?.includes("noindex"),"BEST incomplete story must not be indexed");
      }
      if(index===0 || width===1440 || width===390){
        await page.evaluate(()=>window.scrollTo(0,0));
        await page.screenshot({path:out+"/"+width+"x"+height+"-"+project.slug+"-hero.png"});
      }
      if(width===390||width===1440){
        await page.evaluate(()=>document.getElementById("case-brief").scrollIntoView({behavior:"instant",block:"start"}));
        await page.screenshot({path:out+"/"+width+"x"+height+"-"+project.slug+"-brief.png"});
        await page.evaluate(()=>document.querySelector(".case-visual-study__grid").scrollIntoView({behavior:"instant",block:"start"}));
        await page.screenshot({path:out+"/"+width+"x"+height+"-"+project.slug+"-visual.png"});
      }
      summary.push({width,height,slug:project.slug,...values});
    }
    check(errors.length===0,width+": browser JavaScript errors "+errors.join("; "));
   }finally{await ctx.close();}
  }
  // Light theme must style the entire cover rather than just switching an icon.
  const themeCtx=await browser.newContext({viewport:{width:390,height:844}});
  const theme=await themeCtx.newPage();
  await theme.goto(origin+"/work/mymo-express",{waitUntil:"domcontentloaded"});
  await wait(theme);
  let before=await measure(theme);
  await theme.locator(".aiwa-theme-toggle").click();
  await theme.waitForTimeout(600);
  const after=await measure(theme);
  check(after.topBackground!==before.topBackground,"Light mode did not change the case-study hero");
  assert.equal(after.topBackground,"rgb(245, 245, 243)");
  assert.equal(after.paper,"rgb(245, 245, 243)");
  const lightHeaderBg=await theme.locator(".aiwa-inner-header")
    .evaluate(el=>getComputedStyle(el).backgroundColor);
  assert.equal(lightHeaderBg,"rgb(245, 245, 243)","Light header should also be opaque");
  await theme.screenshot({path:out+"/390x844-mymo-light.png"});
  await themeCtx.close();
  // Pages remain fully readable with no hydration.
  const noJs=await browser.newContext({javascriptEnabled:false,viewport:{width:360,height:800}});
  const noJsPage=await noJs.newPage();
  await noJsPage.goto(origin+"/work/razmazaan",{waitUntil:"domcontentloaded"});
  assert.equal(await noJsPage.locator(".case-deliverables__list li").count(),4);
  check(await noJsPage.locator(".case-conclusion").isVisible(),"No-JS story is hidden");
  await noJs.close();
  fs.writeFileSync(out+"/measurements.json",JSON.stringify(summary,null,2));
  console.log("AIWA_CASE_STUDY_QA_PASS",JSON.stringify({routes:projects.length,viewports:viewports.length,measurements:summary.length}));
 }finally{await browser.close();}
})().catch(err=>{console.error("AIWA_CASE_STUDY_QA_FAIL",err);process.exitCode=1;});
