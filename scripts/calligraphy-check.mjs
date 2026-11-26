import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import assert from "node:assert/strict";
import { calligraphy } from "../src/lib/calligraphy-data.ts";

const dir = "public/media/calligraphy";
const expected = ["design", "engineering", "innovation", "oman", "programming", "tech"];
assert.deepEqual(Object.keys(calligraphy).sort(), expected, "all six Thuluth words are generated");

const sources = readFileSync(`${dir}/SOURCES.md`, "utf8");
const svgs = readdirSync(`${dir}/svg`).filter(f => f.endsWith(".svg")).sort();
assert.deepEqual(svgs, expected.map(w => w + ".svg"), "one SVG per word");

for (const file of svgs) {
  const word = file.replace(".svg", "");
  const svg = readFileSync(`${dir}/svg/${file}`, "utf8");
  assert.match(svg, /viewBox="0 0 1200 400"/, word + ": fixed viewBox");
  assert.ok(!/<image|<script|<text|<style|font-family|href=/i.test(svg), word + ": no raster, script, text or fonts");
  assert.ok(statSync(`${dir}/svg/${file}`).size < 40 * 1024, word + ": under 40 KB");
  const mask = svg.match(/<mask[\s\S]*?<\/mask>/)?.[0] ?? "";
  assert.match(mask, /<g id="pen"/, word + ": pen group inside the mask");
  assert.ok((mask.match(/<path /g) ?? []).length >= 1, word + ": at least one pen stroke");
  const outsideMask = svg.replace(mask, "");
  for (const [, value] of outsideMask.matchAll(/(?:fill|stroke)="([^"]+)"/g)) assert.ok(["currentColor", "none"].includes(value), `${word}: literal colour ${value} outside the mask`);
  assert.ok(/fill-rule="evenodd"/.test(svg), word + ": evenodd so counters stay open");
  const data = calligraphy[word];
  assert.equal(data.viewBox, "0 0 1200 400");
  assert.ok(data.outline.startsWith("M") && data.pen.length >= 1 && data.pen.every(p => p.d.startsWith("M") && p.width > 4), word + ": data shape");
  assert.ok(sources.includes(word), word + ": listed in SOURCES.md");
}
for (const f of readdirSync(`${dir}/source`).filter(f => /\.(png|webp)$/i.test(f))) assert.ok(sources.includes(f), f + ": source file has a rights row");
console.log("CALLIGRAPHY_CONTRACT_PASS");
