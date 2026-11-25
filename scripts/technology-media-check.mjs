import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const base = 'public/media/technology';
const manifest = 'docs/technology-portfolio/media-inventory.json';
const expected = ["aiwa-creators","aqua-petro-chemicals","bababuilds","bababuilds-erp","best-appliances","ezvesto","falcon-logistics","flydestini","fxrco","gwi","healthzone-oman","menu-minute","rcs-oman","sohar-ods","strategic-catering","the-gulf-post","tribe-oman","xspiceo"];
const names = ['desktop-1600.webp','desktop-800.webp','mobile-560.webp','mobile-320.webp'];
const required = process.argv.includes('--require-media');
function fail(message) { throw new Error(message); }
function walk(dir) {
  return existsSync(dir) ? readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(dir,e.name)) : [join(dir,e.name).replaceAll('\\','/')]) : [];
}
const allowed = new Set(expected.flatMap(slug => names.map(name => `${base}/${slug}/${name}`)));
for (const path of walk(base)) if (path !== base + '/.gitkeep' && !allowed.has(path)) fail('Unexpected public asset: ' + path);
if (!existsSync(manifest)) {
  if (required || walk(base).some(p => p.endsWith('.webp'))) fail('Missing media inventory');
  console.log('Empty upload scaffold OK. Use --require-media after upload.');
} else {
  const { projects } = JSON.parse(readFileSync(manifest,'utf8'));
  if (!Array.isArray(projects) || projects.length !== expected.length || new Set(projects.map(p => p.slug)).size !== expected.length) fail('Project count or duplicates');
  const seen = new Set();
  for (const project of projects) {
    if (!expected.includes(project.slug) || project.publicationStatus !== 'pending-rights-review') fail('Unapproved intake entry: ' + project.slug);
    for (const device of ['desktop','mobile']) {
      const variants = project.captures?.[device]?.variants;
      const widths = device === 'desktop' ? [1600,800] : [560,320];
      if (!Array.isArray(variants) || variants.length !== 2) fail('Missing variants: ' + project.slug);
      for (const width of widths) {
        const path = `${base}/${project.slug}/${device}-${width}.webp`;
        const entry = variants.find(v => v.path === path);
        if (!entry || entry.width !== width || !Number.isInteger(entry.height) || entry.height <= 0) fail('Invalid metadata: ' + path);
        const bytes = readFileSync(path);
        if (bytes.toString('ascii',0,4) !== 'RIFF' || bytes.toString('ascii',8,12) !== 'WEBP') fail('Not WebP: ' + path);
        if (bytes.length !== entry.bytes || createHash('sha256').update(bytes).digest('hex') !== entry.sha256) fail('Inventory mismatch: ' + path);
        seen.add(path);
      }
    }
  }
  if (seen.size !== allowed.size) fail('Incomplete inventory');
  console.log(`Verified ${seen.size} intake files against inventory. Publication rights and visual QA remain separate gates.`);
}
