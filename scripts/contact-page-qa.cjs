/** Aiwa Contact V3 — responsive, functional and source-accurate static-export QA. */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const { chromium }=require("playwright");
const base=process.env.AIWA_TEST_URL||"http://127.0.0.1:4173";
const dir="test-artifacts/contact-page";
const widths=[[1920,1080],[1440,900],[1280,800],[950,800],[768,850],[430,932],[390,844],[360,800],[320,700]];
const requireIt=(value,msg)=>assert.ok(value,msg);
fs.mkdirSync(dir,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const theme of ["dark","light"]) for(const [width,height] of widths){
   const page=await browser.newPage({viewport:{width,height},reducedMotion:"reduce",colorScheme:theme});
   const errors=[];
   page.on("pageerror",e=>errors.push(e.message));
   await page.addInitScript(t=>localStorage.setItem("theme",t),theme);
   const response=await page.goto(base+"/contact",{waitUntil:"domcontentloaded",timeout:45000});
   requireIt(response?.ok(),width+": contact route should load");
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForFunction(()=>document.querySelector("[data-contact-page]")?.dataset.contactMotion==="reduced");
   await page.waitForTimeout(120);
   await page.waitForFunction(t=>document.documentElement.classList.contains(t),theme);
   const typography=await page.evaluate(()=>{
     const style=s=>getComputedStyle(document.querySelector(s));
     return {display:[".contact-signal h1",".contact-intro h2",".contact-office h2",".contact-outro h2",".contact-enquiries__panel h3",".contact-office__details h3"].map(s=>style(s).fontFamily),body:[".contact-intro__aside p",".contact-enquiries__tabs strong",".contact-office__address address",".contact-office__links a"].map(s=>style(s).fontFamily),emphasis:[...document.querySelectorAll(".contact-intro h2 em,.contact-office h2 em,.contact-outro h2 em")].map(el=>({family:getComputedStyle(el).fontFamily,weight:getComputedStyle(el).fontWeight,style:getComputedStyle(el).fontStyle})),mono:style(".contact-office__count").fontFamily};
   });
   requireIt(typography.display.every(f=>/anton/i.test(f)),width+": display font drift "+JSON.stringify(typography));
   requireIt(typography.body.every(f=>/space[_ ]?grotesk/i.test(f)),width+": body font drift");
   requireIt(typography.emphasis.every(f=>/barlow/i.test(f.family)&&f.weight==="900"&&f.style==="italic"),width+": emphasis drift");
   requireIt(/geist.*mono/i.test(typography.mono),width+": metadata drift");
   const structure=await page.evaluate(()=>{
    const wall=document.querySelector(".contact-signal");
    const root=document.querySelector(".contact-page");
    const links=[...document.querySelectorAll(".contact-signal__cta")];
    const panel=document.querySelector("[data-contact-enquiries]");
    return {
     overflow:document.documentElement.scrollWidth-window.innerWidth,
     title:document.title,
     wallHeight:wall?.getBoundingClientRect().height,
     wallBackground:wall?getComputedStyle(wall).backgroundColor:"",
     intro:!!document.querySelector("#enquiries"),
     office:!!document.querySelector("#contact-office"),
     panel:!!panel,
     realOfficeCount:document.querySelectorAll(".contact-office__details").length,
     wallCount:links.length,
     imageCount:document.querySelectorAll(".muscat-signal image").length,
     phone:!!document.querySelector('a[href="tel:+96896138461"]'),
     mail:!!document.querySelector('a[href="mailto:info@aiwamediagroup.com"]'),
     directions:!!document.querySelector('a[href^="https://www.google.com/maps/search/"]'),
     body:root?getComputedStyle(root).backgroundColor:"",
     hiddenDecorative:document.querySelector('.muscat-signal')?.getAttribute('aria-hidden')==='true',
    };
   });
   requireIt(structure.overflow<=2,width+": unwanted horizontal scroll "+structure.overflow);
   requireIt(structure.wallHeight>=Math.min(height-83,450),width+": signal hero too short");
   requireIt(structure.wallBackground===(theme==="dark"?"rgb(10, 10, 10)":"rgb(245, 243, 237)"),width+": should match reference black hero");
   requireIt(structure.wallCount===1,width+": one primary contact CTA");
   requireIt(structure.imageCount===1,width+": one geographic artwork layer");
   requireIt(structure.intro&&structure.office&&structure.panel,width+": expected contact sections");
   requireIt(structure.realOfficeCount===1,width+": do not imply unverified offices");
   requireIt(structure.phone&&structure.mail&&structure.directions,width+": official live contact links");
   requireIt(structure.hiddenDecorative,width+": decorative map must be hidden from assistive technology");
   requireIt(await page.locator(".muscat-signal__pulse").first().evaluate(el=>getComputedStyle(el).animationName)==="none",
      width+": reduced motion must stop ambient signals");
   requireIt(await page.locator(".contact-intro").getAttribute("data-entered")==="true",
      width+": reduced motion must not hide any sections");
   const header=await page.locator(".aiwa-inner-header").evaluate(el=>el.getBoundingClientRect().height);
   requireIt(width>=1081?header>=75:header>=53,width+": readable sticky nav");
   const tabs=page.locator("[data-enquiry-tab]");
   requireIt(await tabs.count()===4,width+": four enquiry types");
   await tabs.nth(1).click();
   requireIt(await page.locator('[data-active-enquiry="collaboration"]').count()===1,
     width+": clicking collaboration tab updates the content");
   requireIt(await tabs.nth(1).getAttribute("aria-selected")==="true",
     width+": aria-selected updated");
   await tabs.nth(1).focus();
   await page.keyboard.press("ArrowRight");
   requireIt(await page.locator('[data-active-enquiry="careers"]').count()===1,
     width+": keyboard arrow moves between tabs");
   await page.keyboard.press("Home");
   requireIt(await page.locator('[data-active-enquiry="project"]').count()===1,
     width+": Home returns to first enquiry");
   const localNav=page.locator('.aiwa-inner-header a[href="/contact"]');
   requireIt(await localNav.count()>=1,width+": navigation should link to own contact page");
   if(width<=1080){
    const toggle=page.getByRole("button",{name:"Open navigation"});
    await toggle.click();
    requireIt(await page.locator(".aiwa-inner-header__drawer").getAttribute("aria-hidden")==="false",
      width+": mobile drawer should open");
    await page.keyboard.press("Escape");
    requireIt(await page.locator(".aiwa-inner-header__drawer").getAttribute("aria-hidden")==="true",
      width+": Escape closes drawer");
   }
   await page.evaluate(()=>{if(document.activeElement instanceof HTMLElement)document.activeElement.blur();window.scrollTo({top:0,behavior:"instant"});});
   await page.mouse.move(5,5);
   await page.screenshot({path:dir+"/"+theme+"-"+width+"x"+height+"-hero.png"});
   const frame=async(id)=>{
     await page.evaluate(id=>{
       const element=document.getElementById(id);
       const header=document.querySelector(".aiwa-inner-header");
       const offset=header?.getBoundingClientRect().height||0;
       if(element)window.scrollTo({top:window.scrollY+element.getBoundingClientRect().top-offset,
          behavior:"instant"});
     },id);
   };
   await frame("enquiries");
   await page.screenshot({path:dir+"/"+theme+"-"+width+"x"+height+"-enquiries.png"});
   await frame("contact-office");
   await page.screenshot({path:dir+"/"+theme+"-"+width+"x"+height+"-office.png"});
   const vertical=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
   requireIt(vertical<=2,width+": scrolled horizontal overflow "+vertical);
   requireIt(errors.length===0,width+": browser errors "+errors.join(" | "));
   console.log("CONTACT_RESPONSIVE_PASS",width,height,JSON.stringify(structure));
   await page.close();
  }
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  await page.goto(base+"/contact");
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>document.querySelector(".contact-signal")?.dataset.intro==="playing");
  const score=await page.evaluate(()=>{
    const el=s=>document.querySelector(s);
    const nodes=[".contact-signal h1>span:first-child",".contact-signal h1>span:last-child",".contact-signal__cta"].map(el);
    const animations=nodes.map(n=>n.getAnimations()[0]);
    const sample=t=>{animations.forEach(a=>{a.pause();a.currentTime=t});return nodes.map(n=>Number(getComputedStyle(n).opacity));};
    const early=sample(200),mid=sample(1450),late=sample(3000);animations.forEach(a=>a.play());return {early,mid,late};
  });
  requireIt(score.early.every(n=>n<.05),"opening content begins hidden");
  requireIt(score.mid[0]>.95&&score.mid[2]<.05,"headline precedes CTA");
  requireIt(score.late.every(n=>n>.95),"opening resolves to visible content");
  await page.waitForFunction(()=>document.querySelector(".contact-signal")?.dataset.intro==="settled");
  await page.screenshot({path:dir+"/1440-settled-motion-hero.png"});
  await page.locator(".contact-signal__cta").click();
  requireIt(new URL(page.url()).hash==="#enquiries","primary CTA opens enquiries");

  await page.locator("#enquiries").scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector(".contact-intro")?.dataset.entered==="true");
  await page.locator(".contact-enquiries").scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector(".contact-enquiries")?.dataset.entered==="true");
  await page.locator('[data-enquiry-tab="collaboration"]').click();
  const panelMotion=await page.locator('[data-active-enquiry="collaboration"] h3')
    .evaluate(el=>getComputedStyle(el).animationName);
  requireIt(panelMotion==="contact-panel-in","enquiry panel has a choreographed entrance");

  await page.locator(".contact-office__image").scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector(".contact-office")?.dataset.entered==="true");
  await page.waitForFunction(()=>document.querySelector(".contact-signal")?.dataset.sceneActive==="false");
  await page.waitForTimeout(150);
  const driftA=await page.locator(".contact-office__image").evaluate(el=>
    parseFloat(el.style.getPropertyValue("--contact-photo-drift")));
  await page.evaluate(()=>window.scrollBy({top:120,behavior:"instant"}));
  await page.waitForTimeout(150);
  const driftB=await page.locator(".contact-office__image").evaluate(el=>
    parseFloat(el.style.getPropertyValue("--contact-photo-drift")));
  requireIt(Number.isFinite(driftA)&&Number.isFinite(driftB)&&Math.abs(driftA-driftB)>1,
    "Muscat artwork must move subtly and reversibly with scroll");
  const parked=await page.locator(".muscat-signal__pulse").first().evaluate(el=>getComputedStyle(el).animationName);
  requireIt(parked==="none","offscreen signal must stop");
  await page.locator(".contact-outro").scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector(".contact-outro")?.dataset.entered==="true");
  await page.waitForTimeout(1050);
  const outroCTA=await page.locator(".contact-outro > a")
    .evaluate(el=>Number(getComputedStyle(el).opacity));
  requireIt(outroCTA>.95,"closing CTA should have appeared after the final beat");
  await page.screenshot({path:dir+"/1440-choreographed-outro.png"});
  console.log("CONTACT_CHOREOGRAPHY_PASS",JSON.stringify(score),driftA,driftB);

  await page.evaluate(()=>{document.documentElement.classList.remove("dark");document.documentElement.classList.add("light");});
  await page.evaluate(()=>{
    const target=document.getElementById("enquiries"),header=document.querySelector(".aiwa-inner-header");
    if(target)window.scrollTo({top:window.scrollY+target.getBoundingClientRect().top-
      (header?.getBoundingClientRect().height||0),behavior:"instant"});
  });
  await page.screenshot({path:dir+"/1440-light-enquiries.png"});
  const color=await page.locator(".contact-intro").evaluate(el=>getComputedStyle(el).color);
  requireIt(color==="rgb(10, 10, 11)","light theme text remains readable");
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:dir+"/390-light-enquiries.png"});
  requireIt(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)<=2,
    "light mobile overflow");
  console.log("CONTACT_THEME_MOTION_QA_PASS");
  await page.close();

  const mobile=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"no-preference"});
  await mobile.goto(base+"/contact",{waitUntil:"domcontentloaded"});
  await mobile.waitForFunction(()=>document.querySelector("[data-contact-page]")?.dataset.contactMotion==="ready");
  await mobile.waitForFunction(()=>document.querySelector(".contact-signal")?.dataset.intro==="playing");
  await mobile.keyboard.press("Tab");
  await mobile.waitForFunction(()=>document.querySelector(".contact-signal")?.dataset.intro==="settled");
  requireIt(await mobile.locator(".contact-signal__cta").evaluate(el=>Number(getComputedStyle(el).opacity))===1,"keyboard interruption makes CTA visible");
  await mobile.screenshot({path:dir+"/390-mobile-motion-hero.png"});
  requireIt(await mobile.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=2,
    "mobile motion must not introduce horizontal overflow");
  await mobile.close();

  const noJs=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false});
  const fallback=await noJs.newPage();
  await fallback.goto(base+"/contact",{waitUntil:"domcontentloaded"});
  requireIt(await fallback.locator(".contact-signal h1").innerText().then(t=>t.includes("FIND US.")),"server-rendered headline");
  const visible=await fallback.locator(".contact-intro__grid h2")
    .evaluate(el=>getComputedStyle(el).opacity);
  requireIt(Number(visible)===1,"no-JS typography must remain visible");
  await fallback.screenshot({path:dir+"/390-no-js.png"});
  await noJs.close();

 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
