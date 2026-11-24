import "./muscat-signal.css";
const routes=[
 ["M 717 407 Q 531 95 274 100",274,100],
 ["M 717 407 Q 744 90 908 152",908,152],
 ["M 717 407 Q 880 218 970 275",970,275],
 ["M 717 407 Q 446 216 335 290",335,290],
 ["M 717 407 Q 402 370 198 520",198,520],
] as const;
export function MuscatSignal(){
 return <svg className="muscat-signal" viewBox="0 0 1000 700" aria-hidden="true" focusable="false">
  <defs>
   <radialGradient id="muscat-glow"><stop offset="0" stopColor="currentColor" stopOpacity=".75"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></radialGradient>
   <linearGradient id="muscat-route"><stop offset="0" stopColor="currentColor"/><stop offset="1" stopColor="currentColor" stopOpacity=".5"/></linearGradient>
  </defs>
  <image href="/media/contact/muscat-geography.svg" width="1000" height="700" className="muscat-signal__geography"/>
  <g className="muscat-signal__routes">{routes.map(([d,x,y],i)=><g key={d} style={{"--route-index":i} as React.CSSProperties}><path d={d} pathLength="1" className="muscat-signal__halo"/><path d={d} pathLength="1" className="muscat-signal__route"/><path d={d} pathLength="1" className="muscat-signal__particle"/><circle cx={x} cy={y} r="3" className="muscat-signal__endpoint"/></g>)}</g>
  <g className="muscat-signal__hub">
   <circle cx="717" cy="407" r="95" fill="url(#muscat-glow)"/>
   {[24,46,70].map(r=><circle key={r} cx="717" cy="407" r={r} fill="none" stroke="currentColor" strokeOpacity=".25"/>)}
   {[0,1].map(i=><circle key={i} cx="717" cy="407" r="32" className="muscat-signal__pulse" style={{"--pulse-index":i} as React.CSSProperties}/>)}
   <path d="M685 387v-12h12m40 0h12v12m0 40v12h-12m-40 0h-12v-12" stroke="currentColor" fill="none"/>
   <circle cx="717" cy="407" r="8" fill="currentColor" opacity=".24"/><circle cx="717" cy="407" r="4.5" fill="currentColor"/><circle cx="717" cy="407" r="2" fill="var(--signal-hotspot)"/>
  </g>
  <g className="muscat-signal__label"><text x="752" y="402">MUSCAT</text><text x="752" y="421" className="muscat-signal__coordinates">23.588° N / 58.383° E</text></g>
  <g className="muscat-signal__instrument" textAnchor="end"><path d="M938 590h22m-11-11v22" stroke="currentColor"/><text x="930" y="587">AIWA</text><text x="930" y="605">OMAN — GLOBAL</text></g>
 </svg>;
}
