import type { ReactNode } from "react";

export function DevelopmentDiagram({kind}:{kind:string}){
  const title=kind==="vision"?"Multi-site feeds connected to an AI command centre":kind==="flow"?"Flow measurement connected to a web interface":kind==="light"?"Environmental sensing and automated lighting":kind==="power"?"Energy measurement and reporting":"Connected service architecture";
  const content:Record<string,ReactNode>={
    flow:<><rect x="28" y="68" width="264" height="34" rx="17" fill="none"/><path d="M30 85h260" strokeDasharray="8 8" className="dev-signal"/><circle cx="160" cy="85" r="34" fill="var(--dev-art-bg)"/><path d="M147 85l13-16 13 16-13 16z"/><path d="M160 119v35h108"/><rect x="268" y="137" width="55" height="34" rx="2"/><path d="M276 160l10-8 8 5 12-12"/></>,
    vision:<><rect x="17" y="24" width="74" height="45" rx="3"/><rect x="17" y="79" width="74" height="45" rx="3"/><rect x="17" y="134" width="74" height="45" rx="3"/>{[24,79,134].map(y=><path key={y} d={`M27 ${y+32}l14-14 12 8 14-16 14 22`}/>)}<path d="M91 47h36v54h42M91 101h78M91 157h36v-56" strokeDasharray="5 5" className="dev-signal"/><rect x="169" y="28" width="171" height="144" rx="4" fill="var(--dev-art-bg)"/><path d="M181 45h147M252 54v105M181 107h62M261 116h66"/><rect x="185" y="60" width="54" height="36"/><rect x="261" y="60" width="62" height="42"/><path d="M193 89l11-17 14 12 12-9M271 94l12-21 14 12 16-10M185 150l12-9 12 4 13-19 15 5M269 151v-14m10 14v-24m10 24v-17m10 17v-32m10 32v-22"/><path d="M225 172v12h58v-12"/></>,
    light:<><circle cx="65" cy="84" r="27"/><circle cx="65" cy="84" r="9" fill="currentColor"/><path d="M65 47v-12M65 133v-12M28 84H16M114 84h-12M40 59l-10-10M90 109l10 10"/><path d="M92 84h92v-32h55" strokeDasharray="5 5" className="dev-signal"/><path d="M240 52h64l20 45h-104zM250 97q22 30 44 0M272 120v22M235 118l-18 27M309 118l18 27"/></>,
    power:<><rect x="28" y="40" width="108" height="122" rx="3"/><circle cx="82" cy="91" r="36"/><path d="M56 105l26-14 15-18M56 68h52M59 132h46"/><path d="M136 100h58" strokeDasharray="5 5" className="dev-signal"/><rect x="194" y="40" width="138" height="122" rx="3"/><path d="M208 139h110M214 131V111M232 131V91M250 131V100M268 131V75M286 131V86M304 131V60"/></>,
    cloud:<><path d="M110 79c-30 0-35-42 0-47 11-30 58-35 74-3 33-6 58 17 48 42-3 8-11 14-25 14H110Z"/><path d="M171 86v38H75v18M171 124h96v18M171 124v18" strokeDasharray="5 5" className="dev-signal"/>{[45,141,237].map(x=><g key={x}><rect x={x} y="142" width="60" height="31" rx="3"/><path d={`M${x+8} 152h20m-20 10h36`}/></g>)}</>,
    email:<><rect x="26" y="42" width="135" height="100" rx="4"/><path d="M26 42l67 56 68-56M26 142l48-58m87 58-49-58"/><path d="M161 92h52" strokeDasharray="5 5" className="dev-signal"/><rect x="213" y="35" width="115" height="114" rx="4"/>{[51,82,113].map(y=><g key={y}><rect x="226" y={y} width="88" height="22" rx="2"/><circle cx="302" cy={y+11} r="3" fill="currentColor"/><path d={`M234 ${y+11}h37`}/></g>)}</>,
    iot:<><rect x="142" y="61" width="76" height="76" rx="4"/><rect x="154" y="73" width="52" height="52"/><path d="M142 80H95V38H58M142 116H95v48H58M218 80h48V38h37M218 116h48v48h37" strokeDasharray="5 5" className="dev-signal"/>{[[58,38],[58,164],[303,38],[303,164]].map(([x,y])=><g key={x+":"+y}><circle cx={x} cy={y} r="17"/><circle cx={x} cy={y} r="4" fill="currentColor"/></g>)}</>,
  };
  return <svg className="dev-diagram" viewBox="0 0 360 200" role="img" aria-label={title}><defs/><g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{content[kind]??content.iot}</g></svg>;
}

/** Responsive original engineering artwork. All ink and plate fills inherit the current theme. */
const engineeringLayers=["INTERFACE","APPLICATION","INFRASTRUCTURE","HARDWARE"] as const;
function EngineeringStack({compact=false}:{compact?:boolean}){
 const w=compact?360:1000,h=compact?320:420,cx=compact?235:565,half=compact?107:235,depth=compact?26:38,step=compact?65:86,start=compact?53:73;
 const labelX=compact?12:64;
 return <svg className={compact?"dev-hero-svg dev-hero-svg--compact":"dev-hero-svg dev-hero-svg--wide"} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Four connected engineering layers: interface, application, infrastructure and hardware">
  <g stroke="currentColor" fill="none" opacity=".13" strokeWidth="1">
   {Array.from({length:compact?12:26},(_,i)=><path key={"v"+i} d={`M${i*40} 0V${h}`}/>)}
   {Array.from({length:compact?9:12},(_,i)=><path key={"h"+i} d={`M0 ${i*40}H${w}`}/>)}
   <ellipse cx={cx} cy={h/2} rx={compact?115:290} ry={compact?145:188}/><ellipse cx={cx} cy={h/2} rx={compact?95:250} ry={compact?125:155} strokeDasharray="3 8"/>
  </g>
  <g stroke="currentColor" fill="none" strokeWidth="1.2" opacity=".55"><path d={`M${cx} 12V${h-12}M${cx-half} ${start}H${cx-half-12}V${start+step*3}H${cx-half}M${cx+half} ${start+step}H${cx+half+12}V${start+step*3}H${cx+half}`}/></g>
  {engineeringLayers.map((label,i)=>{const y=start+i*step;const plate=`M${cx-half} ${y}L${cx} ${y-depth} ${cx+half} ${y} ${cx} ${y+depth}Z`;return <g key={label} className="dev-hero-layer">
   <path d={plate} transform="translate(0 8)" fill="var(--dev-alt)" stroke="currentColor" strokeWidth="1.2"/>
   <path d={plate} fill="var(--dev-paper)" stroke="currentColor" strokeWidth="1.5"/>
   <path d={`M${cx-half} ${y}L${cx} ${y+depth} ${cx+half} ${y}`} fill="none" stroke="currentColor" opacity=".7"/>
   <path d={`M${cx-half*.7} ${y}H${cx-15}M${cx+15} ${y}H${cx+half*.7}`} fill="none" stroke="currentColor" strokeDasharray="3 5"/>
   <circle cx={cx} cy={y} r={compact?10:16} fill="currentColor"/><circle cx={cx} cy={y} r={compact?3:5} fill="var(--dev-paper)"/>
   <path d={`M${labelX} ${y+9}H${cx-half-13}L${cx-half} ${y}`} fill="none" stroke="currentColor" strokeWidth="1"/>
   <text x={labelX} y={y-3} fontFamily="var(--type-mono)" fontSize={compact?10:15} fontWeight="600" fill="currentColor">{String(i+1).padStart(2,"0")} / {label}</text>
  </g>;})}
  <path d={`M${cx} ${start+depth+9}V${start+step*3-depth}`} stroke="currentColor" strokeWidth="2" strokeDasharray="5 400" className="dev-hero-signal" fill="none"/>
 </svg>;
}
export function DevelopmentHeroArt(){
 return <div className="dev-hero-art__viewport"><div className="dev-hero-art__parallax"><EngineeringStack/><EngineeringStack compact/></div></div>;
}
