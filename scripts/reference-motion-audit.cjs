/* Observe public reference using REAL wheel events (custom scroller). */
const fs=require("node:fs"),path=require("node:path");
const {chromium}=require("playwright");
const OUT="reference-motion";fs.mkdirSync(OUT,{recursive:true});
function inspect(){
 const all=[...document.querySelectorAll("*")];
 const h=document.querySelector("h1");
 const spec=[...document.querySelectorAll("h2,h3")].find(e=>/^specialisms$/i.test((e.textContent||"").trim()));
 const r=e=>{if(!e)return null;const b=e.getBoundingClientRect(),s=getComputedStyle(e);
 return {text:(e.textContent||"").trim().slice(0,65),tag:e.tagName,cls:String(e.className||"").slice(0,85),
 x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.width),h:Math.round(b.height),
 font:s.fontFamily,size:s.fontSize,weight:s.fontWeight,spacing:s.letterSpacing,opacity:s.opacity,
 pos:s.position,transform:s.transform,clip:s.clipPath,filter:s.filter,animation:s.animationName,
 origin:s.transformOrigin};};
 const scrollables=all.filter(e=>{let s=getComputedStyle(e);return /auto|scroll|hidden/.test(s.overflowY)&&e.scrollHeight>e.clientHeight+50&&e.clientHeight>200}).slice(0,8)
 .map(e=>({...r(e),scrollTop:e.scrollTop,scrollHeight:e.scrollHeight,clientHeight:e.clientHeight}));
 const root=spec?.closest("section")||spec?.parentElement?.parentElement;
 const names=[...(root?.querySelectorAll("a,li,div")||[])].filter(e=>/^(global|consumer|corporate|sports|social|studio|tech)$/i.test((e.textContent||"").trim())).slice(0,14);
 return {scroll:Math.round(scrollY),htmlHeight:document.documentElement.scrollHeight,
 scrollables,body:r(document.body),app:r(document.querySelector("#__next")),
 hero:r(h),heroWords:h?[...h.querySelectorAll("span,em")].filter(e=>e.children.length===0).slice(0,15).map(r):[],
 specialisms:r(spec),root:r(root),names:names.map(r),
 videos:[...document.querySelectorAll("video")].slice(0,5).map(r)};
}
(async()=>{
const browser=await chromium.launch({headless:true,args:["--disable-dev-shm-usage"]});
const frames=[];
for(const w of [1440,390]){
 const h=w===1440?900:844;
 const ctx=await browser.newContext({viewport:{width:w,height:h},reducedMotion:"no-preference",deviceScaleFactor:1});
 const page=await ctx.newPage();
 try{
  await page.goto("https://www.wearetheromans.com/",{waitUntil:"domcontentloaded",timeout:60000});
  await page.waitForTimeout(2200);
  await page.mouse.move(w/2,h*.65);
  const N=w===1440?30:23;
  for(let i=0;i<N;i++){
   if(i){await page.mouse.wheel(0,w===1440?390:340);await page.waitForTimeout(420);}
   const cur=await page.evaluate(inspect);
   const file=path.join(OUT,w+"-wheel-"+String(i).padStart(2,"0")+".jpg");
   await page.screenshot({path:file,type:"jpeg",quality:67,timeout:25000});
   if(i===0||i%5===0)console.log("STEP",w,i,"specY",cur.specialisms?.y,"heroY",cur.hero?.y,
    "scrollables",JSON.stringify(cur.scrollables.map(x=>({cls:x.cls,y:x.y,scrollTop:x.scrollTop}))).slice(0,250));
   frames.push({width:w,index:i,wheelDistance:i*(w===1440?390:340),...cur});
  }
 }catch(e){console.error("AUDIT_ERROR",w,String(e.stack||e).slice(0,1200));}
 await ctx.close();
}
fs.writeFileSync(path.join(OUT,"wheel-geometry.json"),JSON.stringify(frames,null,2));
await browser.close();console.log("PUBLIC_WHEEL_AUDIT_COMPLETE",frames.length);
})().catch(e=>{console.error(e);process.exitCode=1;});
