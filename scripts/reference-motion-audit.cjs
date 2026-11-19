/* Transient public motion audit: rendered frames and computed layout only. */
const fs=require("node:fs"), path=require("node:path");
const {chromium}=require("playwright");
const OUT="reference-motion"; fs.mkdirSync(OUT,{recursive:true});
function snapshot(){
 const get=q=>document.querySelector(q), r=e=>{if(!e)return null;
 const b=e.getBoundingClientRect(),s=getComputedStyle(e);
 return {text:(e.textContent||"").trim().slice(0,75),cls:String(e.className||"").slice(0,100),tag:e.tagName,
 x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.width),h:Math.round(b.height),
 size:s.fontSize,font:s.fontFamily,weight:s.fontWeight,letter:s.letterSpacing,line:s.lineHeight,
 opacity:s.opacity,position:s.position,transform:s.transform,clip:s.clipPath,filter:s.filter,
 overflow:s.overflow,duration:s.transitionDuration,animation:s.animationName};};
 const hero=get("h1");
 const spec=[...document.querySelectorAll("h2,h3")].find(e=>/^specialisms$/i.test((e.textContent||"").trim()));
 const root=spec?.closest("section")||spec?.parentElement?.parentElement;
 const names=[...(root?.querySelectorAll("a,li")||[])].filter(e=>/^(global|consumer|corporate|sports|social|studio|tech)$/i.test((e.textContent||"").trim())).slice(0,9);
 return {url:location.href,scroll:Math.round(scrollY),height:document.documentElement.scrollHeight,
 hero:r(hero),heroWords:hero?[...hero.querySelectorAll("span,em")].filter(e=>e.children.length===0).slice(0,15).map(r):[],
 specialisms:r(spec),specialismsParent:r(root),rows:names.map(r),
 video:[...document.querySelectorAll("video")].slice(0,8).map(r),
 header:r(get("header")),
 img:[...document.querySelectorAll("img")].filter(x=>x.getBoundingClientRect().height>30&&x.getBoundingClientRect().top<innerHeight*2).slice(0,8).map(r)};
}
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--disable-dev-shm-usage"]});
 const frames=[];
 for(const width of [1440,390]){
  const height=width===1440?900:844;
  const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:"no-preference"});
  const page=await ctx.newPage();page.on("pageerror",e=>console.log("PAGEERROR",e.message.slice(0,150)));
  try{
   await page.goto("https://www.wearetheromans.com/",{waitUntil:"domcontentloaded",timeout:60000});
   await page.waitForTimeout(2200);await page.evaluate(()=>document.fonts.ready);
   const info=await page.evaluate(()=>({height:document.documentElement.scrollHeight,
     specY:[...document.querySelectorAll("h2,h3")].find(e=>/^specialisms$/i.test((e.textContent||"").trim()))?.getBoundingClientRect().top+scrollY}));
   console.log("DIMENSIONS",width,JSON.stringify(info));
   const hero=width===1440?[0,.12,.25,.42,.58,.75,.92,1.08,1.35]:[0,.25,.52,.82,1.05];
   const spec=width===1440?[-.85,-.60,-.40,-.20,0,.15,.35,.55,.75,1,1.25,1.60,2,2.7]:[-.5,-.22,0,.3,.7,1.1,1.8];
   const positions=[...hero.map((v,i)=>({group:"hero",n:i,y:Math.round(v*height)})),
     ...spec.map((v,i)=>({group:"specialisms",n:i,y:Math.max(0,Math.round((info.specY||height*2)+v*height))}))];
   for(const p of positions){
    await page.evaluate(y=>window.scrollTo({top:y,behavior:"instant"}),p.y);
    await page.waitForTimeout(250);
    const first=await page.evaluate(snapshot);
    const file=path.join(OUT,width+"-"+p.group+"-"+String(p.n).padStart(2,"0")+".jpg");
    await page.screenshot({path:file,type:"jpeg",quality:66,timeout:20000});
    if((p.group==="specialisms"&&[3,5,7,9].includes(p.n))||(p.group==="hero"&&[2,5].includes(p.n)))await page.waitForTimeout(700);
    const settled=await page.evaluate(snapshot);
    frames.push({width,group:p.group,n:p.n,scroll:p.y,immediate:first,settled});
   }
  }catch(e){console.log("CAPTURE_ERROR",width,String(e.stack||e).slice(0,1300));}
  await ctx.close();
 }
 fs.writeFileSync(path.join(OUT,"geometry.json"),JSON.stringify(frames,null,2));
 await browser.close(); console.log("REFERENCE_FRAME_CAPTURE_COMPLETE",frames.length);
})().catch(e=>{console.error(e);process.exitCode=1;});
