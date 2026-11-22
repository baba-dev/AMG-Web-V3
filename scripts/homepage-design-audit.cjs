/* Source-backed Aiwa design system smoke test.
 * Quantifies fonts, paper/ink, section gutters, and mobile tap targets.
 * Intentionally does not claim pixel-perfect equivalence with licensed
 * The Romans typography or media. Generates inspectable screenshots/JSON.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require("playwright");
const URL = process.env.AIWA_TEST_URL || "http://127.0.0.1:4173/";
const output = "test-artifacts/design-audit";
fs.mkdirSync(output, { recursive: true });
const breakpoints = [
  [1440, 900], [1280, 800], [950, 800],
  [768, 850], [430, 932], [390, 844], [360, 800], [320, 700]
];
const testSelectors = [
  [".aiwa-header__identity", "brand"],
  [".aiwa-hero__headline", "hero"],
  [".aiwa-specialisms__row", "specialisms"],
  [".aiwa-about__heading", "about"],
  [".aiwa-about__description", "about-body"],
  [".aiwa-work__headline", "work"],
  [".aiwa-contact__headline", "contact"],
  [".aiwa-office__details h2", "office"],
  [".aiwa-footer__intro p", "footer"],
];
(async () => {
  const browser = await chromium.launch({headless:true,args:["--disable-dev-shm-usage"]});
  const results = [];
  try {
    for (const [width, height] of breakpoints) {
      const context = await browser.newContext({
        viewport: {width,height}, deviceScaleFactor: 1,
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      try {
        const errors = [];
        page.on("pageerror", e => errors.push(e.message));
        await page.goto(URL, {waitUntil:"domcontentloaded",timeout:30000});
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(180);
        const initial = await page.evaluate(selectors => {
          const rect = el => {
            const r = el.getBoundingClientRect();
            return {x:r.x,y:r.y,right:r.right,width:r.width,height:r.height};
          };
          const describe = ([sel,key]) => {
            const el = document.querySelector(sel);
            if (!el) return {key,missing:true};
            const css = getComputedStyle(el);
            return {key,...rect(el),font:css.fontFamily,size:css.fontSize,
              weight:css.fontWeight,lineHeight:css.lineHeight,
              tracking:css.letterSpacing,color:css.color};
          };
          return {
            bodyFont:getComputedStyle(document.querySelector(".aiwa-site")).fontFamily,
            gutter:getComputedStyle(document.querySelector(".aiwa-site")).getPropertyValue("--aiwa-gutter").trim(),
            headerHeight:rect(document.querySelector(".aiwa-header")).height,
            heroHeight:rect(document.querySelector(".aiwa-hero")).height,
            fonts:selectors.map(describe),
            paper:[".aiwa-specialisms",".aiwa-about",".aiwa-office",".aiwa-footer"].map(s =>
              ({name:s,color:getComputedStyle(document.querySelector(s)).backgroundColor})),
            overflow:document.documentElement.scrollWidth-innerWidth,
            heroWords:[...document.querySelectorAll(".aiwa-hero__mask")].map(rect),
          };
        }, testSelectors);
        assert(initial.overflow <= 2, width+"px: horizontal overflow "+initial.overflow);
        assert(initial.fonts.every(x=>!x.missing),width+"px: missing editorial section");
        assert(initial.paper.every(x=>x.color==="rgb(15, 15, 15)"),
          width+"px: dark editorial surfaces diverge: "+JSON.stringify(initial.paper));
        assert(initial.heroWords.every(r=>r.x>=-12 && r.right<=width+12),
          width+"px: clipped hero words: "+JSON.stringify(initial.heroWords));
        const usesPrivateRoc = await page.evaluate(() =>
          document.documentElement.dataset.aiwaRoc === "true");
        const bodyExpected = usesPrivateRoc ? /aiwa roc grotesk web/i : /space[_ ]?grotesk/i;
        assert(bodyExpected.test(initial.bodyFont),
          width+"px: unexpected body family: "+initial.bodyFont);
        if (usesPrivateRoc) {
          assert(await page.evaluate(() =>
            document.fonts.check('16px "Aiwa Roc Grotesk Web"')),
            width+"px: private Roc font failed to load");
        }
        const poster = initial.fonts.filter(x=>["hero","specialisms","work","contact"].includes(x.key));
        assert(poster.every(x=>x.font.toLowerCase().includes("anton")),
          width+"px: poster headings should share an Anton stack: "+JSON.stringify(poster));
        const tap = await page.evaluate(() => {
          const selectors = [
            ".aiwa-header__identity",".aiwa-hero__film-tile",
            ".aiwa-footer__navigation a",".aiwa-footer__social a",
            ".aiwa-footer__contact > a",".aiwa-office__selectors button",
            ".aiwa-office__arrows button"
          ];
          return selectors.flatMap(s=>[...document.querySelectorAll(s)].map(el=>{
            const r=el.getBoundingClientRect();
            return {selector:s,text:(el.textContent||el.getAttribute("aria-label")||"").trim().slice(0,25),
              height:r.height,width:r.width};
          }));
        });
        assert(tap.every(x=>x.height>=43.5&&x.width>=24),
          width+"px: undersized essential touch target: "+JSON.stringify(tap.filter(x=>x.height<43.5||x.width<24)));
        // Screenshot regression: mobile must not show desktop-only Offices.
        // Footer phone and Directions must never collide on the same line.
        const mobileDetails = await page.evaluate(() => ({
          offices: getComputedStyle(document.querySelector(".aiwa-header__offices")).display,
          footerContacts: [...document.querySelectorAll(".aiwa-footer__contact > a")].map(el => {
            const r = el.getBoundingClientRect();
            return {text:el.textContent.trim(),top:r.top,bottom:r.bottom};
          }),
        }));
        if (width <= 950) {
          assert.equal(mobileDetails.offices,"none",
            width+"px: desktop Offices control leaked into mobile header");
        }
        assert(mobileDetails.footerContacts.every((item,i,list) =>
          i===0 || item.top >= list[i-1].bottom - 1),
          width+"px: footer phone/directions overlap: "+JSON.stringify(mobileDetails.footerContacts));
        assert(mobileDetails.footerContacts.every((item,i,list) =>
          i===0 || item.top - list[i-1].bottom <= 28),
          width+"px: footer contact spacing too loose: "+JSON.stringify(mobileDetails.footerContacts));

        // Walk the page; some overflows only appear while sticky sections animate.
        const sections=["#specialisms","#about","#work","#contact","#office","#site-footer"];
        const sectionResults=[];
        for(const section of sections){
          await page.evaluate(s=>document.querySelector(s).scrollIntoView({behavior:"instant"}),section);
          await page.waitForTimeout(70);
          const sample=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth}));
          assert(sample.overflow<=2,width+"px "+section+": overflow "+sample.overflow);
          sectionResults.push({section,...sample});
        }
        await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));
        await page.waitForTimeout(75);
        await page.screenshot({path:output+"/"+width+"x"+height+"-hero.png"});
        await page.evaluate(()=>document.querySelector("#about").scrollIntoView({behavior:"instant"}));
        await page.waitForTimeout(75);
        await page.screenshot({path:output+"/"+width+"x"+height+"-about.png"});
        await page.evaluate(()=>document.querySelector("#site-footer").scrollIntoView({behavior:"instant"}));
        await page.waitForTimeout(75);
        await page.screenshot({path:output+"/"+width+"x"+height+"-footer.png"});
        assert.equal(errors.length,0,width+"px: browser errors "+errors.join("; "));
        const result={viewport:width+"x"+height,...initial,tap,sectionResults};
        console.log("AIWA_DESIGN_AUDIT_VIEWPORT",JSON.stringify({
          viewport:result.viewport,gutter:result.gutter,headerHeight:result.headerHeight,
          paper:result.paper,fontSummary:result.fonts.map(x=>({key:x.key,
            font:x.font,size:x.size,weight:x.weight})),
          overflow:result.overflow,
        }));
        results.push(result);
      } finally { await context.close(); }
    }
    fs.writeFileSync(output+"/measurements.json",JSON.stringify(results,null,2));
    console.log("AIWA_DESIGN_AUDIT_PASS");
  } finally { await browser.close(); }
})().catch(e=>{console.error("AIWA_DESIGN_AUDIT_FAIL",e);process.exitCode=1;});
