import { statSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const assets = [
  "public/media/archive/casabella-discount.webp",
  "public/media/archive/mymo-coffee.webp",
  "public/media/archive/ridhwan-showcase.webp",
  "public/media/archive/production-team.webp",
  "public/media/home-2/muscat-futurecraft-film-still.webp",
  "public/media/home-2/muscat-futurecraft-landscape.webp",
];

for (const asset of assets) {
  const size = statSync(resolve(root, asset)).size;
  if (size < 12_000) throw new Error(`${asset} is unexpectedly small (${size} bytes)`);
}

const about = readFileSync(resolve(root, "src/components/aiwa-about.tsx"), "utf8");
const work = readFileSync(resolve(root, "src/lib/work/projects.ts"), "utf8");
const office = readFileSync(resolve(root, "src/components/aiwa-office.tsx"), "utf8");
const output = readFileSync(resolve(root, "out/index.html"), "utf8");

for (const expected of [
  "/media/archive/ridhwan-showcase.webp",
  "/media/archive/casabella-discount.webp",
  "/media/archive/mymo-coffee.webp",
  "/media/archive/production-team.webp",
]) {
  if (!about.includes(expected) && !work.includes(expected)) {
    throw new Error(`Homepage source does not use ${expected}`);
  }
  if (!output.includes(expected)) {
    throw new Error(`Static homepage does not render ${expected}`);
  }
}

for (const expected of [
  "/media/home-2/muscat-futurecraft-film-still.webp",
  "/media/home-2/muscat-futurecraft-landscape.webp",
]) {
  if (!office.includes(expected) || !output.includes(expected)) {
    throw new Error(`Futurecraft scene is missing: ${expected}`);
  }
}

console.log(`AIWA_HOME_AUTHENTIC_MEDIA_PASS assets=${assets.length}`);
