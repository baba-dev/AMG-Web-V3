/** Capture design references through a public browser in CI (never ships reference media). */
const fs=require("node:fs");
const { chromium }=require("playwright");
const dir="test-artifacts/contact-reference";
fs.mkdirSync(dir,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 for(const [width,height] of [[1440,900],[390,844]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  try{
   await page.goto("https://www.wearetheromans.com/contact-us",{waitUntil:"domcontentloaded",timeout:45000});
   await page.waitForTimeout(1800);
   await page.screenshot({path:dir+"/romans-"+width+".png",fullPage:true,animations:"disabled",timeout:25000});
   const meta=await page.evaluate(()=>({
    title:document.title,
    text:document.body.innerText.slice(0,12000),
    sections:[...document.querySelectorAll("main section, main h1, main h2, main article")].slice(0,40).map(e=>({
      tag:e.tagName,cls:e.className?.toString()?.slice(0,150),text:e.innerText?.slice(0,130),
      rect:(()=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}})()
    })),
    background:getComputedStyle(document.body).backgroundColor,
    headingStyle:(()=>{const h=document.querySelector("h1");return h?{font:getComputedStyle(h).font,fontFamily:getComputedStyle(h).fontFamily,color:getComputedStyle(h).color}:null})(),
   }));
   fs.writeFileSync(dir+"/romans-"+width+".json",JSON.stringify(meta,null,2));
  }catch(e){fs.writeFileSync(dir+"/romans-"+width+"-error.txt",String(e));}
  await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
