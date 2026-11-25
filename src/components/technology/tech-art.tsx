import { ArrowUpRight } from "lucide-react";

export function EngineeringArt(){
 return <svg className="tech-engineering-art" viewBox="0 0 800 460" role="img" aria-labelledby="engineering-title engineering-desc">
  <title id="engineering-title">Connected digital systems</title><desc id="engineering-desc">An original conceptual diagram connecting interface, application, data and cloud infrastructure.</desc>
  <defs><pattern id="tech-grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="currentColor" strokeOpacity=".12"/></pattern></defs>
  <rect width="800" height="460" fill="url(#tech-grid-pattern)"/><g fill="none" stroke="currentColor" strokeOpacity=".16"><circle cx="400" cy="230" r="210"/><circle cx="400" cy="230" r="174" strokeDasharray="3 9"/><path d="M18 230H782M400 12V448" strokeDasharray="2 8"/></g>
  <g fill="none" stroke="currentColor" strokeWidth="1.5">
   <path d="M400 103V151H153V190M400 151V190M400 151H647V190M153 268V320H400V356M400 268V356M647 268V320H400" />
   <path className="tech-signal-path" d="M400 103V151H153V190M400 151V190M400 151H647V190M153 268V320H400V356M400 268V356M647 268V320H400" stroke="currentColor" strokeWidth="3" strokeDasharray="9 420" strokeLinecap="round"/>
   <rect x="288" y="25" width="224" height="78" fill="var(--tech-paper)"/><rect x="43" y="190" width="220" height="78" fill="var(--tech-paper)"/><rect x="290" y="190" width="220" height="78" fill="var(--tech-paper)"/><rect x="537" y="190" width="220" height="78" fill="var(--tech-paper)"/><rect x="264" y="356" width="272" height="78" fill="currentColor"/>
   {[153,400,647].map(x=><circle key={x} cx={x} cy="151" r="5" fill="currentColor"/>)}
  </g>
  <g fontFamily="var(--type-body)" fontWeight="700" fontSize="20" textAnchor="middle" fill="currentColor"><text x="400" y="70">DIGITAL EXPERIENCE</text><text x="153" y="236">INTERFACE</text><text x="400" y="236">APPLICATION</text><text x="647" y="236">DATA &amp; SERVICES</text><text x="400" y="402" fill="var(--tech-paper)">CLOUD INFRASTRUCTURE</text></g>
  <g fill="currentColor" fontSize="12" fontFamily="var(--type-mono)" opacity=".7"><text x="44" y="32">01 / SYSTEM MAP</text><text x="757" y="445" textAnchor="end">AIWA / SYSTEMS</text></g>
 </svg>;
}
export function CapabilityArt({kind}:{kind:"cloud"|"email"}){
 return <svg viewBox="0 0 440 200" className="tech-capability-art" role="img" aria-label={kind==="cloud"?"Conceptual cloud infrastructure illustration":"Conceptual business email illustration"}>
  <g fill="none" stroke="currentColor" strokeWidth="1.5">
  {kind==="cloud"?<><path d="M148 73L220 31 292 73 220 115Z M148 73v39l72 42 72-42V73M220 115v39M220 154v18M91 172h258M91 172v-24M349 172v-24"/><rect x="57" y="115" width="68" height="33"/><rect x="315" y="115" width="68" height="33"/><path d="M67 125h31M67 136h44M325 125h31M325 136h44"/></>:<><rect x="115" y="38" width="210" height="124"/><path d="M115 38l105 82 105-82M115 162l76-65m134 65-76-65"/><circle cx="325" cy="145" r="39" fill="var(--tech-paper)"/><path d="m307 145 13 13 24-28" strokeWidth="4"/><path d="M40 100h54M346 60h54M40 115h35M365 75h35" strokeDasharray="5 5"/></>}
  </g>
 </svg>;
}
export function TechArrow(){return <ArrowUpRight size={24} aria-hidden="true"/>;}
