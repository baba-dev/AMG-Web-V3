const fs=require("node:fs"); const {chromium}=require("playwright");
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--disable-dev-shm-usage"]});const out=[];
 for(const url of ["https://aiwamediagroup.com/video-production/","https://aiwamediagroup.com/case-study/","https://aiwamediagroup.com/"]){
  const p=await browser.newPage({viewport:{width:1366,height:900}});
  try{
   await p.goto(url,{waitUntil:"domcontentloaded",timeout:40000});
   await p.waitForTimeout(900);
   const images=await p.evaluate(()=>[...document.querySelectorAll("img")].map(el=>({
    alt:el.alt||"",src:el.currentSrc||el.src,width:el.naturalWidth,height:el.naturalHeight,
    displayWidth:el.getBoundingClientRect().width,displayHeight:el.getBoundingClientRect().height
   })).filter(x=>x.width>240&&x.height>150&&/aiwamediagroup.com/.test(x.src)).slice(0,140));
   out.push({url,images});
   console.log("MEDIA",url,images.length,JSON.stringify(images.slice(0,15)).slice(0,2500));
  }catch(e){console.log("MEDIA_ERR",url,String(e).slice(0,200));}
  await p.close();
 }
 fs.mkdirSync("reference-motion",{recursive:true});
 fs.writeFileSync("reference-motion/aiwa-media.json",JSON.stringify(out,null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
