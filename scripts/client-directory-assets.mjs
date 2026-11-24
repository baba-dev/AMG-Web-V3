import { readFileSync, readdirSync } from "node:fs";
import assert from "node:assert/strict";
const manifest=JSON.parse(readFileSync("docs/client-logos/manifest.json","utf8"));
assert.equal(manifest.logos.length,29);
const expected=manifest.logos.map(x=>x.slug+".webp").sort();
assert.equal(new Set(expected).size,29);
for(const size of [300,600]){
 const dir="public/media/client-logos/web/"+size;
 assert.deepEqual(readdirSync(dir).filter(f=>f.endsWith(".webp")).sort(),expected);
 for(const logo of manifest.logos){
  const bytes=readFileSync(dir+"/"+logo.slug+".webp");
  assert.equal(bytes.length,logo["web_"+size+"_bytes"],logo.slug+" byte length");
  assert.equal(bytes.toString("ascii",0,4),"RIFF");
  assert.equal(bytes.toString("ascii",8,12),"WEBP");
  let offset=12, dims;
  while(offset+8<=bytes.length){
   const tag=bytes.toString("ascii",offset,offset+4),length=bytes.readUInt32LE(offset+4),p=offset+8;
   assert(p+length<=bytes.length,"Invalid WebP chunk");
   if(tag==="VP8L"){
    assert.equal(bytes[p],0x2f);
    const bits=bytes.readUInt32LE(p+1);
    dims=[(bits&0x3fff)+1,((bits>>>14)&0x3fff)+1];
   }
   offset=p+length+(length%2);
  }
  assert.deepEqual(dims,[size,size],logo.slug+" lossless dimensions");
 }
}
const registry=readFileSync("src/lib/client-directory.ts","utf8");
for(const logo of manifest.logos)assert(registry.includes('"id": "'+logo.slug+'"'),"Missing registry id "+logo.slug);
console.log("29 client identities, 58 lossless WebP files and manifest byte counts verified.");
