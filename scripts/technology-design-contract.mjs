import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const css = readFileSync('src/app/work/technology/technology.css','utf8').replace(/\/\*[\s\S]*?\*\//g,'');
const aliases = {
  '--tech-paper':'--aiwa-paper','--tech-raised':'--aiwa-paper-raised',
  '--tech-ink':'--aiwa-paper-ink','--tech-muted':'--aiwa-paper-muted',
  '--tech-rule':'--aiwa-paper-rule','--tech-accent':'--aiwa-paper-ink',
  '--tech-accent-ink':'--aiwa-paper','--tech-night':'--aiwa-paper'
};
const seen = new Set();
for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const [, selector, declarations] = match;
  const media = selector.trim().split(',').every(s=>/^\.tech-pair(?:__desktop|__mobile)?$/.test(s.trim()));
  for (const entry of declarations.split(';')) {
    const split=entry.indexOf(':'); if(split<0)continue;
    const name=entry.slice(0,split).trim(), value=entry.slice(split+1).trim();
    if(name.startsWith('--tech-')){
      assert(Object.hasOwn(aliases,name) && value==='var('+aliases[name]+')','Unapproved route token: '+entry);
      assert(!seen.has(name),'Duplicate route theme token: '+name);
      seen.add(name);
    }
    if(!media) assert(!/#[a-f\d]{3,8}\b|\b(?:rgba?|hsla?|oklch|color-mix)\(/i.test(value),'Literal UI color: '+selector.trim()+' '+entry);
    if(/^font(?:-size|-family)?$/.test(name)){
      assert(!/\b(?:clamp|min|max)\(|\d(?:px|vw|rem)\b/.test(value),'Unapproved font scale: '+entry);
      if(name==='font-family'||name==='font') assert(/var\(--type-/.test(value),'Unapproved font family: '+entry);
    }
  }
}
assert.equal(seen.size,Object.keys(aliases).length,'Canonical theme aliases');
const work=readFileSync('src/app/work/work-directory.css','utf8');
const callout=work.match(/\.work-page__tech-callout\{([^}]+)\}/)?.[1]||'';
assert(callout.includes('background:var(--aiwa-paper-raised)')&&callout.includes('color:var(--aiwa-paper-ink)'),'Technology entry point must use canonical palette');
console.log('AIWA_TECHNOLOGY_DESIGN_CONTRACT_PASS');
