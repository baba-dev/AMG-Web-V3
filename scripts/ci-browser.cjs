/* One preview, one execution per unique suite. Full QA on manual runs or CI changes. */
const { execFileSync, spawnSync } = require("node:child_process");
const base=process.env.CI_BASE_SHA, head=process.env.CI_HEAD_SHA;
let changed=[];
let full=process.env.CI_EVENT!=="pull_request"||!base||!head;
if(!full){
  try{changed=execFileSync("git",["diff","--name-only",base+"..."+head],{encoding:"utf8"}).trim().split("\n").filter(Boolean);}
  catch(error){console.warn("Cannot determine diff; running full QA",error.message);full=true;}
}
const matches=patterns=>changed.some(path=>patterns.some(p=>p.test(path)));
full ||= matches([/^\.github\/workflows\//,/^scripts\/ci-browser\.cjs$/,/^scripts\/work-static-preview\.cjs$/,/^(package(-lock)?\.json|next\.config\..*|\.node-version|tsconfig\.json)$/]);
const shared=[/^src\/app\/(layout\.tsx|globals\.css)$/, /^src\/styles\//, /^src\/components\/aiwa-(polish|mega-menu|inner-header|footer|global-ending|theme|route-transition)/, /^src\/lib\/(site-navigation|aiwa-route-motion)\.ts$/];
const home=[/^src\/app\/page\.tsx$/, /^src\/components\/aiwa-(hero|about|specialisms|work|film-player)/, /^public\/media\/(hero|specialisms|work|about)\//];
const work=[/^src\/app\/work\//, /^src\/components\/work-/, /^src\/lib\/work\//, /^public\/media\/work\//];
const specialisms=[/^src\/app\/specialisms\//, /^src\/lib\/specialisms/, /^src\/components\/aiwa-(specialisms|creatives-motion)/, /^public\/media\/specialisms\//];
const contact=[/^src\/app\/contact\//, /^src\/components\/(contact|aiwa-contact|aiwa-office)/, /^public\/media\/contact\//];
const finale=[/^src\/components\/aiwa-(contact|office|footer|global-ending)/, /^src\/app\/(privacy|terms|legal\.css)/, /^public\/media\/finale\//];
const suites=[
 ["hero-visual-smoke.cjs",true,[]],
 ["all-pages-theme-qa.cjs",true,[]],
 ["homepage-fidelity-player.cjs",false,[...home,...shared]],
 ["homepage-design-audit.cjs",false,[...home,...shared]],
 ["homepage-finale-smoke.cjs",false,[...finale,...shared]],
 ["work-section-smoke.cjs",false,[...work,...home]],
 ["work-directory-qa.cjs",false,[...work,...shared]],
 ["work-case-study-qa.cjs",false,[...work,...shared]],
 ["specialisms-p2c-qa.cjs",false,[...specialisms,...shared]],
 ["about-page-qa.cjs",false,[/^src\/app\/about\//,/^src\/components\/about\//,...shared]],
 ["contact-page-qa.cjs",false,[...contact,...shared]],
 ["aiwa-route-transition-qa.cjs",false,[...shared,...work,...contact,...specialisms]]
];
const failures=[];
for(const [file,always,patterns] of suites){
  if(!full&&!always&&!matches(patterns)&&!changed.includes("scripts/"+file)){console.log("SKIP (unchanged): "+file);continue;}
  console.log("::group::"+file);
  const result=spawnSync(process.execPath,["scripts/"+file],{stdio:"inherit",timeout:300000});
  console.log("::endgroup::");
  if(result.status!==0){failures.push(file);if(result.error)console.error(result.error);}
}
if(failures.length){console.error("Failed suites: "+failures.join(", "));process.exitCode=1;}
