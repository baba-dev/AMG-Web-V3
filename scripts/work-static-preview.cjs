/** CI-only static-export preview with clean URL fallback (no Next.js server). */
const http=require("node:http");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..","out");
const port=Number(process.env.PORT||4173);
const types={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",
 ".css":"text/css; charset=utf-8",".svg":"image/svg+xml",".json":"application/json",
 ".png":"image/png",".webp":"image/webp",".jpg":"image/jpeg",".jpeg":"image/jpeg",
 ".woff2":"font/woff2",".ico":"image/x-icon",".mp4":"video/mp4"};
http.createServer((req,res)=>{
 let decoded;
 try{decoded=decodeURIComponent(new URL(req.url||"/","http://localhost").pathname);}
 catch{res.writeHead(400);return res.end("Bad URL");}
 if(decoded.includes("\\")||decoded.includes("\0")||decoded.split("/").includes("..")){
  res.writeHead(400);return res.end("Bad path");
 }
 const candidate=path.resolve(root,"."+decoded);
 if(candidate!==root&&!candidate.startsWith(root+path.sep)){
  res.writeHead(403);return res.end("Forbidden");
 }
 let resolved;
 for(const file of [candidate,path.join(candidate,"index.html"),candidate+".html"]){
  try{if(fs.statSync(file).isFile()){resolved=file;break;}}catch{}
 }
 if(!resolved){res.writeHead(404);return res.end("Not found");}
 res.setHeader("Content-Type",types[path.extname(resolved)]||"application/octet-stream");
 res.setHeader("Cache-Control","no-store");
 fs.createReadStream(resolved).on("error",()=>res.destroy()).pipe(res);
}).listen(port,"127.0.0.1",()=>console.log("AIWA_WORK_STATIC_PREVIEW_READY",port));
