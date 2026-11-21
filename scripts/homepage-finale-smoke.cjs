/* Aiwa V3 finale — desktop/mobile native scroll, carousel and static fallback QA.
 * Run against a built, locally served /out folder. Captures transient CI frames.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require("playwright");
const BASE = (process.env.AIWA_TEST_URL || "http://127.0.0.1:4173").replace(/\/+$/, "");
const OUT = "test-artifacts/finale";
fs.mkdirSync(OUT,{recursive:true});
const close = (a,b,t=4) => Math.abs(a-b) <= t;

async function visit(browser,w,h,reduce=false) {
  const context=await browser.newContext({
    viewport:{width:w,height:h},reducedMotion:reduce?"reduce":"no-preference",
    deviceScaleFactor:1,
  });
  const page=await context.newPage();
  const errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  await page.goto(BASE+"/",{waitUntil:"domcontentloaded",timeout:30000});
  await page.evaluate(()=>document.fonts.ready);
  const values=await page.evaluate(()=>{
    const $=s=>document.querySelector(s);
    const bottom=el=>el.getBoundingClientRect().bottom+scrollY;
    const top=el=>el.getBoundingClientRect().top+scrollY;
    const work=$("#work"),contact=$("#contact"),office=$("#office"),footer=$("#site-footer");
    return {
      workBottom:bottom(work),contactTop:top(contact),
      contactBottom:bottom(contact),officeTop:top(office),
      officeBottom:bottom(office),footerTop:top(footer),
      contactTitle:$("#aiwa-contact-title")?.textContent?.replace(/\s+/g," ").trim(),
      action:$("#contact .aiwa-contact__action")?.href,
      panels:[...document.querySelectorAll(".aiwa-office__picture")].map(x=>x.dataset.scene),
      numberButtons:document.querySelectorAll(".aiwa-office__selectors button").length,
      address:$(".aiwa-office__contact address")?.textContent?.trim(),
      tel:$(".aiwa-office__contact a[href^='tel:']")?.getAttribute("href"),
      overflow:document.documentElement.scrollWidth-innerWidth,
      height:document.documentElement.scrollHeight,
    };
  });
  assert(close(values.workBottom,values.contactTop,4),"Contact must immediately follow Work");
  assert(close(values.contactBottom,values.officeTop,4),"Office must immediately follow Contact");
  assert(close(values.officeBottom,values.footerTop,4),"Footer must immediately follow Office");
  assert.equal(values.action,"https://aiwamediagroup.com/contact-us/","Contact CTA must work");
  assert(values.contactTitle.includes("LET'S MAKE") && values.contactTitle.includes("SOME NOISE."),"Contact heading missing");
  assert.deepEqual(values.panels,["muscat","futurecraft","production"],"Expected three Aiwa editorial chapters");
  assert.equal(values.numberButtons,3);
  assert(values.address.includes("HGRW+VMV") && values.address.includes("Muscat"),"Location facts missing");
  assert.equal(values.tel,"tel:+96896138461");
  assert(values.overflow<=2,"Horizontal overflow in viewport "+w);

  return {context,page,errors,values};
}

async function desktop(browser,w,h) {
  const state=await visit(browser,w,h);
  const {context,page,errors,values}=state;
  await page.waitForFunction(()=>document.querySelector("#contact")?.dataset.motion==="desktop");
  const stages=[];
  for(const progress of [0,.25,.5,.75,1]){
    await page.evaluate(p=>{
      const stage=document.querySelector(".aiwa-contact__stage");
      const top=stage.getBoundingClientRect().top+scrollY;
      window.scrollTo({top:top+(stage.offsetHeight-innerHeight)*p,behavior:"instant"});
    },progress);
    await page.waitForTimeout(140);
    const frame=await page.evaluate(()=>{
      const section=document.querySelector("#contact");
      const lines=[...document.querySelectorAll(".aiwa-contact__line>span")];
      const scene=section.querySelector(".aiwa-contact__scene").getBoundingClientRect();
      const alpha=el=>Number(getComputedStyle(el).opacity);
      return {
        progress:Number(section.style.getPropertyValue("--contact-progress")),
        lineOpacity:lines.map(alpha),
        echoOpacity:alpha(section.querySelector(".aiwa-contact__echo")),
        ctaOpacity:alpha(section.querySelector(".aiwa-contact__action")),
        sceneTop:scene.top,
        overflow:document.documentElement.scrollWidth-innerWidth,
      };
    });
    assert(close(frame.progress,progress,.025),"Contact scroll progress drift: "+progress+" => "+frame.progress);
    assert(frame.overflow<=2,"Overflow at contact frame "+progress);
    if(progress>=.25 && progress<=.75)assert(close(frame.sceneTop,0,4),"Contact stage must pin at "+progress);
    stages.push({progress,...frame});
    await page.screenshot({path:OUT+"/"+w+"x"+h+"-contact-"+Math.round(progress*100)+".png"});
  }
  assert(stages[0].lineOpacity[0] < .25,"Headline should begin masked");
  assert(stages[2].lineOpacity[0] > .95 && stages[2].lineOpacity[1] > .95,
    "Both title lines must unfold by mid-scroll");
  assert(stages[3].ctaOpacity > .95,"Project CTA must become fully visible");
  await page.evaluate(()=>scrollTo({top:0,behavior:"instant"}));
  await page.waitForTimeout(180);
  const reset=await page.evaluate(()=>({
    p:Number(document.querySelector("#contact").style.getPropertyValue("--contact-progress")),
    first:Number(getComputedStyle(document.querySelector(".aiwa-contact__line>span")).opacity),
  }));
  assert(reset.p<.01 && reset.first<.25,"Reverse scroll must rewind contact typography");

  const carousel=await verifyGallery(page,w,h);
  await page.locator("#site-footer").scrollIntoViewIfNeeded();
  await page.waitForTimeout(140);
  await page.screenshot({path:OUT+"/"+w+"x"+h+"-footer.png"});
  await testBackTop(page);
  assert.equal(errors.length,0,"Browser errors: "+errors.join("; "));
  await context.close();
  return {viewport:w+"x"+h,base:values,stages:stages.map(x=>({p:x.progress,lines:x.lineOpacity,cta:x.ctaOpacity})),carousel,reset};
}

async function verifyGallery(page,w,h) {
  const gallery=page.locator(".aiwa-office__gallery");
  await gallery.scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  const active=()=>page.locator(".aiwa-office__picture.is-active").getAttribute("data-scene");
  assert.equal(await active(),"muscat");
  await page.screenshot({path:OUT+"/"+w+"x"+h+"-office-01.png"});
  await page.getByRole("button",{name:"Next image"}).click();
  assert.equal(await active(),"futurecraft");
  await page.screenshot({path:OUT+"/"+w+"x"+h+"-office-02.png"});
  await page.getByRole("button",{name:"Show image 3: 03 / THE FRAME"}).click();
  assert.equal(await active(),"production");
  await page.screenshot({path:OUT+"/"+w+"x"+h+"-office-03.png"});
  await gallery.focus();
  await page.keyboard.press("ArrowLeft");
  assert.equal(await active(),"futurecraft","ArrowLeft should reverse gallery selection");
  await page.getByRole("button",{name:"Previous image"}).click();
  assert.equal(await active(),"muscat");
  const selected=await page.locator(".aiwa-office__selectors [aria-pressed='true']").count();
  assert.equal(selected,1,"Exactly one selected scene button");
  const link=await page.locator(".aiwa-office__contact a[href^='https://www.google.com/maps/search/']").count();
  assert.equal(link,1,"Verified address must have a directions action");
  return {initial:"muscat",next:"futurecraft",selected:"production",keyboard:"futurecraft",reset:"muscat"};
}

async function testBackTop(page) {
  await page.getByRole("button",{name:"Back to top"}).click();
  await page.waitForFunction(()=>scrollY<8,{timeout:10000});
  assert((await page.evaluate(()=>scrollY))<8,"Back-to-top must return to hero");
}

async function mobile(browser,w,h) {
  const state=await visit(browser,w,h);const {page,context,errors,values}=state;
  await page.waitForFunction(()=>document.querySelector("#contact")?.dataset.motion==="mobile");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.waitForTimeout(140);
  const position=await page.evaluate(()=>{
    const section=document.querySelector("#contact");
    return {
      mode:section.dataset.motion,
      sticky:getComputedStyle(section.querySelector(".aiwa-contact__scene")).position,
      sectionHeight:section.getBoundingClientRect().height,
      scrollWidth:document.documentElement.scrollWidth-innerWidth,
      titleWidth:section.querySelector("h2").getBoundingClientRect().width,
    };
  });
  assert.equal(position.mode,"mobile");
  assert(position.sticky!=="sticky","Mobile should not be pinned");
  assert(position.scrollWidth<=2);
  await page.screenshot({path:OUT+"/"+w+"x"+h+"-mobile-contact.png"});
  const gallery=await verifyGallery(page,w,h);
  await page.locator("#site-footer").scrollIntoViewIfNeeded();
  await page.screenshot({path:OUT+"/"+w+"x"+h+"-mobile-footer.png"});
  await testBackTop(page);
  assert.equal(errors.length,0,"Mobile browser errors: "+errors.join("; "));
  await context.close();
  return {viewport:w+"x"+h,values,position,gallery};
}

async function fallback(browser) {
  const ctx=await browser.newContext({viewport:{width:1280,height:800},reducedMotion:"reduce"});
  const page=await ctx.newPage();
  await page.goto(BASE+"/",{waitUntil:"domcontentloaded"});
  await page.waitForTimeout(160);
  const reduced=await page.evaluate(()=>({
    mode:document.querySelector("#contact").dataset.motion||"static",
    number:document.querySelectorAll(".aiwa-office__picture").length,
    contactAction:document.querySelector(".aiwa-contact__action").href,
    overflow:document.documentElement.scrollWidth-innerWidth,
  }));
  assert.equal(reduced.mode,"static");
  assert.equal(reduced.number,3);
  assert(reduced.overflow<=2);
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.screenshot({path:OUT+"/reduced-contact.png"});
  await ctx.close();

  const nojs=await browser.newContext({viewport:{width:1280,height:800},javaScriptEnabled:false});
  const browserPage=await nojs.newPage();
  await browserPage.goto(BASE+"/",{waitUntil:"domcontentloaded"});
  assert.equal(await browserPage.locator(".aiwa-contact__action").count(),1);
  assert.equal(await browserPage.locator(".aiwa-office__picture.is-active").count(),1);
  assert.equal(await browserPage.locator(".aiwa-footer__navigation a").count(),6);
  await nojs.close();

  const legalContext=await browser.newContext({viewport:{width:1280,height:800}});
  const legalPage=await legalContext.newPage();
  for(const route of ["/privacy.html","/terms.html"]){
    const response=await legalPage.goto(BASE+route,{waitUntil:"domcontentloaded"});
    assert(response && response.ok(),"Missing static site information route: "+route);
    assert.equal(await legalPage.locator(".aiwa-legal__main h1").count(),1);
  }
  await legalContext.close();
  return {reduced,noJS:true,staticPages:true};
}

(async()=>{
  const browser=await chromium.launch({headless:true});
  try{
    const results={
      desktop:[await desktop(browser,1440,900),await desktop(browser,1280,800)],
      mobile:[await mobile(browser,390,844),await mobile(browser,360,800)],
      fallback:await fallback(browser),
    };
    fs.writeFileSync(OUT+"/measurements.json",JSON.stringify(results,null,2));
    console.log("AIWA_HOMEPAGE_FINALE_PASS");
    console.log(JSON.stringify({desktop:results.desktop.map(x=>x.viewport),mobile:results.mobile.map(x=>x.viewport),privacy:true,terms:true}));
  }finally{await browser.close();}
})().catch(e=>{console.error("AIWA_HOMEPAGE_FINALE_FAIL",e);process.exitCode=1;});
