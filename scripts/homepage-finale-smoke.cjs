/* Aiwa Global Ending — one footer without the office gallery on every route.
 * Static Next.js export, browser/client links, themes, fallback and accessibility.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require("playwright");
const BASE = (process.env.AIWA_TEST_URL || "http://127.0.0.1:4173").replace(/\/+$/, "");
const OUT = "test-artifacts/finale";
fs.mkdirSync(OUT, {recursive:true});
const near = (a,b,t=4) => Math.abs(a-b) <= t;
const routes = [
  "/", "/about", "/work", "/work/mymo-express", "/specialisms",
  "/specialisms/tech", "/contact", "/privacy", "/terms", "/_not-found.html"
];
async function navigate(page, path) {
  const response = await page.goto(BASE + path, {waitUntil:"domcontentloaded",timeout:45000});
  assert.ok(response && response.ok(), path + ": route must render");
  await page.evaluate(() => document.fonts.ready);
}
async function assertGlobalStructure(page, pathname) {
  const data = await page.evaluate(() => {
    const ending = document.querySelector("[data-aiwa-global-ending]");
    const footer = document.querySelector("#site-footer");
    const opening = document.querySelector(".aiwa-site:not(.aiwa-global-ending)");
    const rect = element => {
      const r = element.getBoundingClientRect();
      return {top:r.top + scrollY,bottom:r.bottom + scrollY};
    };
    const bottom = ending?.previousElementSibling;
    return {
      count:document.querySelectorAll("[data-aiwa-global-ending]").length,
      officeCount:document.querySelectorAll("#office").length,
      footerCount:document.querySelectorAll("#site-footer").length,
      contactCount:document.querySelectorAll(".aiwa-contact").length,


      footerOwned:footer?.parentElement===ending,
      wrapperAfterRoute:bottom===opening,
      seam:bottom&&footer?rect(footer).top-rect(bottom).bottom:null,


      overflow:document.documentElement.scrollWidth-innerWidth,


      phone:document.querySelector('.aiwa-footer__contact a[href="tel:+96896138461"]')!==null,
      footerLinks:document.querySelectorAll(".aiwa-footer__links a").length,
      footerPlaceholders:[...document.querySelectorAll(".aiwa-footer__links a")].every(a=>a.getAttribute("href")==="#"),
      footerSocials:document.querySelectorAll(".aiwa-footer__social-icons a").length,
      contrast:{

        footer:getComputedStyle(footer).backgroundColor,
      },
    };
  });
  assert.equal(data.count,1,pathname+": global ending must render once");
  assert.equal(data.officeCount,0,pathname+": removed office returned");
  assert.equal(data.footerCount,1,pathname+": duplicate footer");
  assert.equal(data.contactCount,0,pathname+": removed giant homepage contact panel returned");
  assert.equal(data.footerOwned,true,pathname+": footer must live inside global ending");
  assert.equal(data.wrapperAfterRoute,true,pathname+": ending must follow the route content");
  assert.ok(near(data.seam,0,5),pathname+": space before global ending "+data.seam);
  assert.equal(data.footerLinks,15,pathname+": global footer navigation unavailable");
  const typeMatches=await page.evaluate(()=>{
    const reference=document.querySelector(".aiwa-footer__bottom a");
    const properties=["fontFamily","fontSize","fontWeight","lineHeight","letterSpacing","textTransform","fontStyle"];
    const style=getComputedStyle(reference);
    return [...document.querySelectorAll(".aiwa-footer__links a,.aiwa-footer__start,.aiwa-footer__contact > a,.aiwa-footer__contact address,.aiwa-footer__contact address span,.aiwa-footer__bottom a,.aiwa-footer__bottom button")].every(el=>{
      const computed=getComputedStyle(el);
      return properties.every(property=>computed[property]===style[property]);
    });
  });
  assert.equal(typeMatches,true,pathname+": footer links must match Privacy Notes typography");

  assert.equal(data.footerPlaceholders,true,pathname+": expected placeholder destinations");
  assert.equal(data.footerSocials,5,pathname+": missing legacy social platforms");
  assert.ok(data.phone,pathname+": footer phone must remain linked");
  assert.ok(data.overflow<=2,pathname+": horizontal overflow "+data.overflow);
  return data;
}
async function checkViewport(browser,w,h) {
  const context=await browser.newContext({viewport:{width:w,height:h},reducedMotion:"reduce",deviceScaleFactor:1});
  const page=await context.newPage();
  const errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  await navigate(page,"/");
  const data=await assertGlobalStructure(page,"/");
  const workToFooter=await page.evaluate(()=>{
    const work=document.querySelector("#work").getBoundingClientRect();
    const footer=document.querySelector("#site-footer").getBoundingClientRect();
    return footer.top-work.bottom;
  });
  assert.ok(near(workToFooter,0,5),"Homepage Work must flow directly into footer: "+workToFooter);
  await page.locator("#site-footer").scrollIntoViewIfNeeded();
  await page.screenshot({path:OUT+"/"+w+"x"+h+"-footer.png"});
  if(w<768) {
    const toggle=page.getByRole("button",{name:"Get Started",exact:true});
    await toggle.click();
    assert.equal(await toggle.getAttribute("aria-expanded"),"false");
    assert.equal(await page.locator("#footer-group-0").isVisible(),false);
    await toggle.click();
    assert.equal(await toggle.getAttribute("aria-expanded"),"true");
    assert.equal(await page.locator("#footer-group-0").isVisible(),true);
  }
  await page.getByRole("button",{name:"Back to top"}).click();
  await page.waitForFunction(()=>scrollY<8,{timeout:11000});
  assert.ok(await page.evaluate(()=>scrollY<8),"Back to top must return to homepage hero");

  // The shared footer is rendered exactly once on secondary static pages.
  for(const pathname of routes.slice(1)) {
    await navigate(page,pathname);
    await assertGlobalStructure(page,pathname);
    if(pathname==="/contact") {
      assert.equal(await page.locator("#contact-office").count(),1,"Contact's own office needs its own anchor");
      assert.equal(await page.locator('.contact-wall__sequence:first-child .contact-wall__row[href="#contact-office"]').count(),1,
        "Contact's office marquee link must keep working");
    }
  }
  await navigate(page,"/work");
  await page.locator("#site-footer").scrollIntoViewIfNeeded();
  await page.getByRole("button",{name:"Back to top"}).click();
  await page.waitForFunction(()=>scrollY<8,{timeout:11000});
  assert.deepEqual(errors,[],"Browser errors: "+errors.join("; "));
  await context.close();
  return {viewport:w+"x"+h,pages:routes.length,office:data.officeCount,footer:data.footerCount};
}
async function choreography(browser) {
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:"no-preference"});
  const page=await context.newPage();
  await navigate(page,"/work");
  const beats=page.locator("#site-footer [data-footer-beat]");
  assert.equal(await beats.count(),7);
  for(const beat of await beats.all()) {
    await beat.scrollIntoViewIfNeeded();
    await beat.evaluate(el=>new Promise((resolve,reject)=>{
      if(el.dataset.revealed==="true") return resolve();
      const observer=new MutationObserver(()=>{
        if(el.dataset.revealed==="true"){observer.disconnect();resolve();}
      });
      observer.observe(el,{attributes:true,attributeFilter:["data-revealed"]});
      setTimeout(()=>{observer.disconnect();reject(new Error("Footer beat did not reveal"));},5000);
    }));
  }
  await page.locator(".aiwa-footer__intro").scrollIntoViewIfNeeded();
  assert.equal(await page.locator("#site-footer [data-footer-beat][data-revealed=true]").count(),7);
  await context.close();
}
async function fallback(browser) {

  const plain=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false});
  const noJs=await plain.newPage();
  for(const pathname of ["/","/contact","/privacy","/terms","/work"]) {
    await navigate(noJs,pathname);
    assert.equal(await noJs.locator("#office").count(),0,pathname+": no-JS office returned");
    assert.equal(await noJs.locator("#site-footer").count(),1,pathname+": no-JS footer missing");
    assert.equal(await noJs.locator(".aiwa-office").count(),0);
    assert.equal(await noJs.locator(".aiwa-footer__links a").count(),15);
  }
  await plain.close();
}
(async()=>{
  const browser=await chromium.launch({headless:true,args:["--disable-dev-shm-usage"]});
  try {
    const results=[];
    for(const [w,h] of [[1440,900],[1280,800],[390,844],[360,800]])
      results.push(await checkViewport(browser,w,h));
    await fallback(browser);
    await choreography(browser);
    fs.writeFileSync(OUT+"/global-ending-report.json",JSON.stringify(results,null,2));
    console.log("AIWA_GLOBAL_ENDING_QA_PASS",JSON.stringify(results));
  } finally { await browser.close(); }
})().catch(e=>{console.error("AIWA_GLOBAL_ENDING_QA_FAIL",e);process.exitCode=1;});
