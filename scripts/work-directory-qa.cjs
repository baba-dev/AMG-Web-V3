/** Chromium editorial Work directory audit. Build must be exported and served first. */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {chromium}=require("playwright");
const base=process.env.AIWA_TEST_URL||"http://127.0.0.1:4173";
const folder="test-artifacts/work-directory";
const viewports=[[1440,900],[1280,800],[950,800],[768,850],[430,932],[390,844],[360,800],[320,700]];
const expected={all:6,brand:3,digital:2,production:1};
const slugs=["mymo-express","casabella-oman","best-genetco","aqua-petro","razmazaan","vitamin-phones"];
fs.mkdirSync(folder,{recursive:true});
function check(value,message){assert.ok(value,message);}
async function settle(page){await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(80);}
async function geometry(page){return page.evaluate(()=>{
 const box=sel=>{const el=document.querySelector(sel);if(!el)return null;const r=el.getBoundingClientRect();
  return {left:r.left,right:r.right,width:r.width,height:r.height};};
 return {viewport:innerWidth,overflow:document.documentElement.scrollWidth-innerWidth,hero:box(".work-hero"),
  heading:box(".work-hero h1"),nav:box(".aiwa-inner-header"),cards:document.querySelectorAll("[data-work-project]").length,
  font:getComputedStyle(document.querySelector(".work-page")).fontFamily,
  paper:(document.querySelector(".work-page__paper") ? getComputedStyle(document.querySelector(".work-page__paper")).backgroundColor : null)};
});}
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--disable-dev-shm-usage"]});
 const report=[];
 try{
  for(const [width,height] of viewports){
   const context=await browser.newContext({viewport:{width,height},reducedMotion:"reduce",deviceScaleFactor:1});
   const page=await context.newPage();
   const errors=[];page.on("pageerror",e=>errors.push(e.message));
   try{
    const response=await page.goto(base+"/work",{waitUntil:"domcontentloaded",timeout:45000});
    assert.equal(response.status(),200,"/work route should load");
    await settle(page);
    check(await page.locator("h1").innerText().then(t=>t.includes("NOISE")),
      width+": hero heading missing");
    const initial=await geometry(page);
    assert.equal(initial.cards,6,width+": six server-rendered cards required");
    check(initial.overflow<=2,width+": initial overflow "+initial.overflow);
    check(/space[_ ]?grotesk|aiwa roc grotesk/i.test(initial.font),
      width+": Work font stack differs "+initial.font);
    assert.equal(initial.paper,"rgb(18, 20, 23)",width+": dark Work surface mismatch");
    const surfaces=await page.evaluate(()=>Object.fromEntries(
      [".work-gallery",".work-process",".aiwa-footer"].map(selector=>[
        selector,getComputedStyle(document.querySelector(selector)).backgroundColor
      ])
    ));
    assert.equal(surfaces[".work-gallery"],"rgb(18, 20, 23)",width+": dark gallery");
    assert.equal(surfaces[".work-process"],"rgb(27, 29, 32)",width+": dark process");
    assert.equal(surfaces[".aiwa-footer"],"rgb(18, 20, 23)",width+": dark footer");
    const hrefs=await page.locator(".work-gallery__link").evaluateAll(nodes=>nodes.map(n=>new URL(n.href).pathname));
    assert.deepEqual(hrefs,slugs.map(slug=>"/work/"+slug),width+": local project routes missing");
    const listSwitch=page.locator('[data-view-button="list"]');
    const gridSwitch=page.locator('[data-view-button="grid"]');
    await listSwitch.click();
    assert.equal(await listSwitch.getAttribute("aria-pressed"),"true",width+": list toggle state");
    assert.equal(await page.locator("[data-work-gallery]").getAttribute("data-view"),"list",width+": list view");
    assert.equal(new URL(page.url()).searchParams.get("view"),"list",width+": list deep link");
    assert.equal(await page.locator(".work-gallery__link").count(),6,width+": list retains all routes");
    if(width<=767){
      const mobileType=await page.locator("[data-work-project]").first().evaluate(card=>{
        const title=card.querySelector(".work-gallery__title").getBoundingClientRect();
        const discipline=card.querySelector(".work-gallery__discipline").getBoundingClientRect();
        const client=card.querySelector(".work-gallery__client");
        return {subtitleBottom:title.bottom,disciplineTop:discipline.top,
          clientSize:parseFloat(getComputedStyle(client).fontSize)};
      });
      check(mobileType.disciplineTop>=mobileType.subtitleBottom-1,
        width+": mobile list metadata overlaps subtitle "+JSON.stringify(mobileType));
      check(mobileType.clientSize>=19,width+": mobile list client typography too small");
      const filters=await page.locator(".work-gallery__filters button").evaluateAll(nodes=>
        nodes.map(node=>{
          const r=node.getBoundingClientRect();
          return {left:r.left,right:r.right,top:r.top,height:r.height};
        })
      );
      check(filters.length===4 && filters.every(r=>r.left>=0 && r.right<=width+1),
        width+": filter category clipped "+JSON.stringify(filters));
      check(Math.abs(filters[0].top-filters[1].top)<=1 &&
            Math.abs(filters[2].top-filters[3].top)<=1 &&
            filters[2].top>filters[0].top,
        width+": expected a stable two-row filter layout");
    }
    await page.locator('[data-filter-button="brand"]').click();
    assert.equal(await page.locator("[data-work-project]").count(),3,width+": list filter works");
    assert.equal(new URL(page.url()).searchParams.get("view"),"list",width+": filter keeps view");
    await page.locator('[data-filter-button="all"]').click();
    check((await geometry(page)).overflow<=2,width+": list causes horizontal overflow");
    await page.locator("[data-work-project]").first().scrollIntoViewIfNeeded();
    await page.screenshot({path:folder+"/"+width+"x"+height+"-list.png"});
    await page.goto(base+"/work",{waitUntil:"domcontentloaded"});
    await settle(page);
    assert.equal(await page.locator("[data-work-gallery]").getAttribute("data-view"),"list",
      width+": list preference should restore from storage");
    await gridSwitch.click();
    assert.equal(await gridSwitch.getAttribute("aria-pressed"),"true",width+": grid state");
    assert.equal(new URL(page.url()).searchParams.get("view"),null,width+": grid canonical URL");
    for(const [name,count] of Object.entries(expected)){
     await page.locator('[data-filter-button="'+name+'"]').click();
     await page.waitForTimeout(80);
     assert.equal(await page.locator("[data-work-project]").count(),count,
       width+": filtered "+name+" count");
     assert.equal(await page.locator('[data-filter-button="'+name+'"]').getAttribute("aria-pressed"),"true",
       width+": filter not announced");
     const search=new URL(page.url()).searchParams.get("category");
     assert.equal(search,name==="all"?null:name,width+": filter URL mismatch");
    }
    await page.goBack({waitUntil:"domcontentloaded"}).catch(()=>{});
    await page.waitForTimeout(120);
    // Explicitly restore all, no matter which browser history path was used.
    await page.locator('[data-filter-button="all"]').click();
    assert.equal(await page.locator("[data-work-project]").count(),6);
    const menu=page.locator(".aiwa-inner-header__menu");
    if(width<=1080){
      check(await menu.isVisible(),width+": mobile menu is missing");
      await menu.click();
      assert.equal(await menu.getAttribute("aria-expanded"),"true");
      check(await page.locator("#aiwa-inner-menu a").first().isVisible(),
        width+": drawer links invisible");
      await page.keyboard.press("Escape");
      assert.equal(await menu.getAttribute("aria-expanded"),"false");
      const taps=await page.evaluate(()=>[...document.querySelectorAll(
        ".aiwa-inner-header__menu,.aiwa-theme-toggle,.work-gallery__filters button,.work-gallery__view-controls button"
       )].map(x=>({title:x.textContent.trim(),height:x.getBoundingClientRect().height})));
      check(taps.every(t=>t.height>=43.5),
        width+": essential touch targets too short "+JSON.stringify(taps));
    }else{
      check(await page.locator(".aiwa-inner-header__links").isVisible(),width+": desktop nav missing");
    }
    const footerWork=await page.locator(".aiwa-footer__navigation a").first().getAttribute("href");
    assert.equal(footerWork,"/#work",width+": cross-page footer anchor should return home");
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:folder+"/"+width+"x"+height+"-hero.png"});
    await page.evaluate(()=>document.getElementById("work-index").scrollIntoView({behavior:"instant",block:"start"}));
    await page.screenshot({path:folder+"/"+width+"x"+height+"-index.png"});
    const first=page.locator("[data-work-project]").first();
    await first.scrollIntoViewIfNeeded();
    await page.screenshot({path:folder+"/"+width+"x"+height+"-gallery.png"});
    check((await geometry(page)).overflow<=2,width+": scroll-induced horizontal overflow");
    assert.deepEqual(errors,[],width+": browser pageerrors");
    report.push({width,height,...initial});
    await page.goto(base+"/work/mymo-express",{waitUntil:"domcontentloaded"});
    await settle(page);
    check(await page.locator("#project-heading").innerText().then(t=>t.includes("MYMO")),
      width+": project page missing");
    assert.equal(await page.locator(".work-project__next a").count(),2);
    check((await geometry(page)).overflow<=2,width+": project overview overflow");
    await page.screenshot({path:folder+"/"+width+"x"+height+"-project.png"});
   } finally{await context.close();}
  }
  // Every static project exists, with source-backed description and internal navigation.
  const context=await browser.newContext();
  const page=await context.newPage();
  for(const slug of slugs){
   const response=await page.goto(base+"/work/"+slug,{waitUntil:"domcontentloaded"});
   assert.equal(response.status(),200,slug+": no generated static page");
   assert.equal(await page.locator(".work-project__source").count(),1);
  }
  await context.close();
  // No JavaScript still exposes the portfolio and real links to project pages.
  const plain=await browser.newContext({javascriptEnabled:false,viewport:{width:390,height:844}});
  const plainPage=await plain.newPage();
  await plainPage.goto(base+"/work",{waitUntil:"domcontentloaded"});
  assert.equal(await plainPage.locator("[data-work-project]").count(),6);
  await plain.close();
  // Saved theme control works on desktop and does not break paper contrast.
  const themeContext=await browser.newContext({viewport:{width:1440,height:900}});
  const themePage=await themeContext.newPage();
  await themePage.goto(base+"/work",{waitUntil:"domcontentloaded"});
  const initialThemeBg=await themePage.locator(".work-hero").evaluate(el=>getComputedStyle(el).backgroundColor);
  await themePage.locator(".aiwa-theme-toggle").click();
  await themePage.waitForTimeout(140);
  check(await themePage.evaluate(()=>document.documentElement.classList.contains("light")),
    "animated theme toggle failed to activate light mode");
  const afterThemeBg=await themePage.locator(".work-hero").evaluate(el=>getComputedStyle(el).backgroundColor);
  check(afterThemeBg!==initialThemeBg,"light theme must change the Work hero surface");
  check(await themePage.locator(".aiwa-inner-header").evaluate(el=>getComputedStyle(el).color)==="rgb(10, 10, 10)",
    "light theme header must have readable dark text");
  assert.equal(await themePage.locator(".work-page__paper").evaluate(el=>getComputedStyle(el).backgroundColor),"rgb(245, 243, 238)");
  assert.equal(await themePage.locator(".work-gallery").evaluate(el=>getComputedStyle(el).backgroundColor),"rgb(245, 243, 238)");
  assert.equal(await themePage.locator(".work-process").evaluate(el=>getComputedStyle(el).backgroundColor),"rgb(232, 229, 223)");
  assert.equal(await themePage.locator(".aiwa-footer").evaluate(el=>getComputedStyle(el).backgroundColor),"rgb(245, 243, 238)");
  await themePage.locator('[data-view-button="list"]').click();
  await themePage.locator("#work-index").scrollIntoViewIfNeeded();
  await themePage.screenshot({path:folder+"/1440x900-light-list.png"});
  await themePage.setViewportSize({width:390,height:844});
  await themePage.locator("#work-index").scrollIntoViewIfNeeded();
  await themePage.screenshot({path:folder+"/390x844-light-list.png"});
  const lightOverflow=await themePage.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  check(lightOverflow<=2,"light mobile list horizontal overflow "+lightOverflow);
  await themeContext.close();
  fs.writeFileSync(folder+"/measurements.json",JSON.stringify(report,null,2));
  console.log("AIWA_WORK_DIRECTORY_AUDIT_PASS",JSON.stringify({viewports:viewports.length,projects:slugs.length,filters:Object.keys(expected).length,views:["grid","list"],themes:["dark","light"]}));
 }finally{await browser.close();}
})().catch(error=>{console.error("AIWA_WORK_DIRECTORY_AUDIT_FAIL",error);process.exitCode=1;});
