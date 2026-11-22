/* Aiwa Global Ending — one SAY HELLO gallery and footer on every route.
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
  "/", "/work", "/work/mymo-express", "/specialisms",
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
    const office = document.querySelector("#office");
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
      hello:office?.querySelector(".aiwa-office__hello-track")?.textContent?.trim()||"",
      officeOwned:office?.parentElement===ending,
      footerOwned:footer?.parentElement===ending,
      wrapperAfterRoute:bottom===opening,
      seam:bottom&&office?rect(office).top-rect(bottom).bottom:null,
      officeFooterSeam:office&&footer?rect(footer).top-rect(office).bottom:null,
      officeBeforeFooter:office&&footer?office.compareDocumentPosition(footer)&Node.DOCUMENT_POSITION_FOLLOWING:0,
      overflow:document.documentElement.scrollWidth-innerWidth,
      panels:[...document.querySelectorAll(".aiwa-office__picture")].map(el=>el.dataset.scene),
      selected:document.querySelectorAll(".aiwa-office__selectors [aria-pressed='true']").length,
      phone:document.querySelector('.aiwa-office__contact a[href="tel:+96896138461"]')!==null,
      footerLinks:document.querySelectorAll(".aiwa-footer__navigation a").length,
      contrast:{
        office:getComputedStyle(office).backgroundColor,
        footer:getComputedStyle(footer).backgroundColor,
      },
    };
  });
  assert.equal(data.count,1,pathname+": global ending must render once");
  assert.equal(data.officeCount,1,pathname+": duplicate #office anchor");
  assert.equal(data.footerCount,1,pathname+": duplicate footer");
  assert.equal(data.contactCount,0,pathname+": removed giant homepage contact panel returned");
  assert.equal(data.officeOwned,true,pathname+": office must live inside global ending");
  assert.equal(data.footerOwned,true,pathname+": footer must live inside global ending");
  assert.equal(data.wrapperAfterRoute,true,pathname+": ending must follow the route content");
  assert.ok(near(data.seam,0,5),pathname+": space before global ending "+data.seam);
  assert.ok(near(data.officeFooterSeam,0,5),pathname+": gap between office and footer");
  assert.ok(data.officeBeforeFooter,pathname+": wrong ending order");
  assert.ok(data.hello.includes("SAY HELLO"),pathname+": missing marquee");
  assert.deepEqual(data.panels,["muscat","futurecraft","production"],pathname+": changed office gallery");
  assert.equal(data.selected,1,pathname+": exactly one selected gallery chapter");
  assert.equal(data.footerLinks,6,pathname+": global footer navigation unavailable");
  assert.ok(data.phone,pathname+": office phone must remain linked");
  assert.ok(data.overflow<=2,pathname+": horizontal overflow "+data.overflow);
  return data;
}
async function gallery(page, w, h) {
  await page.locator(".aiwa-office__gallery").scrollIntoViewIfNeeded();
  const active = () => page.locator(".aiwa-office__picture.is-active").getAttribute("data-scene");
  assert.equal(await active(),"muscat");
  await page.screenshot({path:OUT+"/"+w+"x"+h+"-hello.png"});
  await page.getByRole("button",{name:"Next image"}).click();
  assert.equal(await active(),"futurecraft");
  await page.getByRole("button",{name:"Show image 3: 03 / THE FRAME"}).click();
  assert.equal(await active(),"production");
  await page.locator(".aiwa-office__gallery").focus();
  await page.keyboard.press("ArrowLeft");
  assert.equal(await active(),"futurecraft");
  await page.getByRole("button",{name:"Previous image"}).click();
  assert.equal(await active(),"muscat");
}
async function checkViewport(browser,w,h) {
  const context=await browser.newContext({viewport:{width:w,height:h},reducedMotion:"reduce",deviceScaleFactor:1});
  const page=await context.newPage();
  const errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  await navigate(page,"/");
  const data=await assertGlobalStructure(page,"/");
  const workToOffice=await page.evaluate(()=>{
    const work=document.querySelector("#work").getBoundingClientRect();
    const office=document.querySelector("#office").getBoundingClientRect();
    return office.top-work.bottom;
  });
  assert.ok(near(workToOffice,0,5),"Homepage Work must flow directly into SAY HELLO: "+workToOffice);
  await gallery(page,w,h);
  await page.locator("#site-footer").scrollIntoViewIfNeeded();
  await page.screenshot({path:OUT+"/"+w+"x"+h+"-footer.png"});
  await page.getByRole("button",{name:"Back to top"}).click();
  await page.waitForFunction(()=>scrollY<8,{timeout:11000});
  assert.ok(await page.evaluate(()=>scrollY<8),"Back to top must return to homepage hero");

  // The shared footer is rendered exactly once on secondary static pages.
  for(const pathname of routes.slice(1)) {
    await navigate(page,pathname);
    await assertGlobalStructure(page,pathname);
    if(pathname==="/contact") {
      assert.equal(await page.locator("#contact-office").count(),1,"Contact's own office needs its own anchor");
      assert.equal(await page.locator('.contact-wall__row[href="#contact-office"]').count(),1,
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
async function fallback(browser) {
  const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:"reduce"});
  const page=await reduced.newPage();
  await navigate(page,"/work");
  const animation=await page.locator(".aiwa-office__hello-track")
    .evaluate(el=>getComputedStyle(el).animationName);
  assert.equal(animation,"none","Reduced motion must disable SAY HELLO marquee");
  await reduced.close();

  const plain=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false});
  const noJs=await plain.newPage();
  for(const pathname of ["/","/contact","/privacy","/terms","/work"]) {
    await navigate(noJs,pathname);
    assert.equal(await noJs.locator("#office").count(),1,pathname+": no-JS office missing");
    assert.equal(await noJs.locator("#site-footer").count(),1,pathname+": no-JS footer missing");
    assert.equal(await noJs.locator(".aiwa-office__picture.is-active").count(),1);
    assert.equal(await noJs.locator(".aiwa-footer__navigation a").count(),6);
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
    fs.writeFileSync(OUT+"/global-ending-report.json",JSON.stringify(results,null,2));
    console.log("AIWA_GLOBAL_ENDING_QA_PASS",JSON.stringify(results));
  } finally { await browser.close(); }
})().catch(e=>{console.error("AIWA_GLOBAL_ENDING_QA_FAIL",e);process.exitCode=1;});
