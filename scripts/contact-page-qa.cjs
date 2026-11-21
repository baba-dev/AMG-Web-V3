/** Aiwa Contact V3 — responsive, functional and source-accurate static-export QA. */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const { chromium }=require("playwright");
const base=process.env.AIWA_TEST_URL||"http://127.0.0.1:4173";
const dir="test-artifacts/contact-page";
const widths=[[1440,900],[1280,800],[950,800],[768,850],[430,932],[390,844],[360,800],[320,700]];
const requireIt=(value,msg)=>assert.ok(value,msg);
fs.mkdirSync(dir,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const [width,height] of widths){
   const page=await browser.newPage({viewport:{width,height},reducedMotion:"reduce"});
   const errors=[];
   page.on("pageerror",e=>errors.push(e.message));
   const response=await page.goto(base+"/contact",{waitUntil:"domcontentloaded",timeout:45000});
   requireIt(response?.ok(),width+": contact route should load");
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForTimeout(120);
   const structure=await page.evaluate(()=>{
    const wall=document.querySelector(".contact-wall");
    const root=document.querySelector(".contact-page");
    const links=[...document.querySelectorAll(".contact-wall__sequence:first-child .contact-wall__row")];
    const panel=document.querySelector("[data-contact-enquiries]");
    return {
     overflow:document.documentElement.scrollWidth-window.innerWidth,
     title:document.title,
     wallHeight:wall?.getBoundingClientRect().height,
     wallBackground:wall?getComputedStyle(wall).backgroundColor:"",
     intro:!!document.querySelector("#enquiries"),
     office:!!document.querySelector("#office"),
     panel:!!panel,
     realOfficeCount:document.querySelectorAll(".contact-office__details").length,
     wallCount:links.length,
     imageCount:document.querySelectorAll(".contact-wall__picture img").length,
     phone:!!document.querySelector('a[href="tel:+96896138461"]'),
     mail:!!document.querySelector('a[href="mailto:info@aiwamediagroup.com"]'),
     directions:!!document.querySelector('a[href^="https://www.google.com/maps/search/"]'),
     body:root?getComputedStyle(root).backgroundColor:"",
     hiddenDecorative:[...document.querySelectorAll('.contact-wall__sequence[aria-hidden="true"]')].every(e=>[...e.querySelectorAll("a")].every(a=>a.tabIndex===-1)),
    };
   });
   requireIt(structure.overflow<=2,width+": unwanted horizontal scroll "+structure.overflow);
   requireIt(structure.wallHeight>=Math.min(height-83,450),width+": marquee hero too short");
   requireIt(structure.wallBackground==="rgb(8, 8, 8)",width+": should match reference black hero");
   requireIt(structure.wallCount===5,width+": 5 meaningful typographic rows");
   requireIt(structure.imageCount===20,width+": all image intercuts should render");
   requireIt(structure.intro&&structure.office&&structure.panel,width+": expected contact sections");
   requireIt(structure.realOfficeCount===1,width+": do not imply unverified offices");
   requireIt(structure.phone&&structure.mail&&structure.directions,width+": official live contact links");
   requireIt(structure.hiddenDecorative,width+": duplicate marquees must be removed from tab order");
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
   await page.evaluate(()=>window.scrollTo(0,0));
   await page.screenshot({path:dir+"/"+width+"x"+height+"-hero.png"});
   await page.locator("#enquiries").scrollIntoViewIfNeeded();
   await page.screenshot({path:dir+"/"+width+"x"+height+"-enquiries.png"});
   await page.locator("#office").scrollIntoViewIfNeeded();
   await page.screenshot({path:dir+"/"+width+"x"+height+"-office.png"});
   const vertical=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
   requireIt(vertical<=2,width+": scrolled horizontal overflow "+vertical);
   requireIt(errors.length===0,width+": browser errors "+errors.join(" | "));
   console.log("CONTACT_RESPONSIVE_PASS",width,height,JSON.stringify(structure));
   await page.close();
  }
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  await page.goto(base+"/contact");
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(180);
  const moving=await page.locator(".contact-wall__track").evaluate(el=>getComputedStyle(el).animationName);
  requireIt(moving==="contact-wall-scroll","full-motion marquee must animate on desktop");
  await page.locator(".contact-wall__row").first().hover();
  const paused=await page.locator(".contact-wall__track").evaluate(el=>getComputedStyle(el).animationPlayState);
  requireIt(paused==="paused","hover should pause the moving typography");
  await page.screenshot({path:dir+"/1440-motion-hover.png"});
  await page.evaluate(()=>{document.documentElement.classList.remove("dark");document.documentElement.classList.add("light");});
  await page.locator("#enquiries").scrollIntoViewIfNeeded();
  await page.screenshot({path:dir+"/1440-light-enquiries.png"});
  const color=await page.locator(".contact-intro").evaluate(el=>getComputedStyle(el).color);
  requireIt(color==="rgb(10, 10, 11)","light theme text remains readable");
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:dir+"/390-light-enquiries.png"});
  requireIt(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)<=2,
    "light mobile overflow");
  console.log("CONTACT_THEME_MOTION_QA_PASS");
  await page.close();
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
