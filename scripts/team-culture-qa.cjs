/* eslint-disable @typescript-eslint/no-require-imports */
/** Node-only source, provenance and routing regression guard. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const read = (p) => fs.readFileSync(path.join(__dirname, "..", p), "utf8");
const team = read("src/lib/team-data.ts");
const media = read("src/lib/team-media.ts");
const page = read("src/app/team/page.tsx");
const careers = read("src/app/join-us/page.tsx");
const nav = read("src/lib/site-navigation.ts");
const directory = read("src/components/aiwa-team-directory.tsx");
const gallery = read("src/components/aiwa-team-gallery.tsx");
const hero = read("src/components/aiwa-team-hero.tsx");
const css = read("src/app/team/team.css");
const joinCss = read("src/app/join-us/join.css");
const header = read("src/components/aiwa-inner-header.tsx");
const about = read("src/components/aiwa-about.tsx");
const routes = read("src/lib/aiwa-route-motion.ts");
const themeQa = read("scripts/all-pages-theme-qa.cjs");

for (const name of ["Imaad Khan", "Abeer Sayed", "Sameer Siddiqui", "Mahmoud", "Talha"]) {
  assert.ok(team.includes('name: "' + name + '"'), "missing current employee " + name);
}
assert.equal((team.match(/\bicon: "(?:founder|operations|engineering|sales|design)"/g) || []).length, 5,
  "five distinct role-specific icon assignments expected");
assert.match(team, /over 20 years/);
assert.match(team, /Events Orchestration/);
assert.match(team, /ESP32-based IoT hardware/);
assert.doesNotMatch(team, /name: "Bilawal Ali"/, "do not show unconfirmed legacy employees");
assert.doesNotMatch(team, /portrait\s*:/, "no portrait assets should be part of team profiles");
assert.match(directory, /showModal\(\)/, "dialog should use native accessibility");
assert.match(directory, /aria-pressed=/, "filter state should be announced");
assert.match(directory, /onClose=/, "dialog close must restore opener focus");
assert.match(directory, /roleIcons/);
assert.match(directory, /data-team-profile-icon/);
assert.match(directory, /"MEMBERS"/, "team count should describe members, not archived profiles");
assert.doesNotMatch(directory, /<Image\b/, "team profiles must use icons, not images");
assert.doesNotMatch(directory, /ARCHIVE PROFILE/, "current roster must not be labeled archived");
assert.match(hero, /production-team\.webp/);
assert.match(gallery, /PUBLISHED CAMPAIGN WORK/);
assert.match(media, /category:"published-work"/);
assert.match(page, /id="main-content"/);
assert.match(page, /AiwaInnerHeader/);
assert.match(page, /AiwaTeamGallery/);
assert.match(page, /AiwaTeamDirectory/);
assert.match(page, /teamDivisions/);
assert.match(page, /teamCulture/);
assert.match(page, /href="\/join-us"/);
assert.match(careers, /Roles previously listed.*have not been confirmed as open/);
assert.match(careers, /href="\/team"/);
assert.match(nav, /href: "\/team"/);
assert.match(nav, /href: "\/join-us"/);
assert.match(about, /https:\/\/aiwamediagroup\.com\/about-us\//, "keep the original About CTA destination");
assert.match(routes, /pathname === "\/team"/);
assert.match(routes, /pathname === "\/join-us"/);
assert.match(header, /item\.label === "TEAM"/);
assert.match(header, /item\.label === "JOIN US"/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /\.light \.team-site/);
assert.match(css, /@media\(max-width:620px\)/);
assert.match(joinCss, /@media\(max-width:540px\)/);
assert.match(themeQa, /path: "\/team\.html"/);
assert.match(themeQa, /path: "\/join-us\.html"/);
for (const asset of [
  "public/media/archive/production-team.webp",
  "public/media/archive/ridhwan-showcase.webp",
  "public/media/archive/mymo-coffee.webp",
  "public/media/archive/casabella-discount.webp",
  "public/media/finale/muscat-editorial.svg",
  "public/media/team/aiwa-signal.svg",
]) assert(fs.existsSync(path.join(__dirname, "..", asset)), "missing real/editorial media: " + asset);
console.log("AIWA_TEAM_SOURCE_AND_ROUTE_PASS profiles=5 routes=2 icon-profiles=5");
