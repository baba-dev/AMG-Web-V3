"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Aperture, Clapperboard, Image as ImageIcon, Layers, Smartphone, Video } from "lucide-react";
import "./aiwa-creatives-motion.css";

const modes=[
 {name:"Design",icon:Layers,word:"FORM",copy:"Make the message visible.",color:"#ef6559"},
 {name:"Film",icon:Clapperboard,word:"FRAME",copy:"Make every frame count.",color:"#f2b65d"},
 {name:"Photography",icon:Aperture,word:"FOCUS",copy:"Find the story in the detail.",color:"#8fc9cc"},
 {name:"Motion",icon:Video,word:"MOVE",copy:"Give the idea a rhythm.",color:"#a7a3f3"},
 {name:"Social",icon:Smartphone,word:"CUT",copy:"Create for the way people watch.",color:"#ed8fb0"},
 {name:"Events",icon:ImageIcon,word:"LIVE",copy:"Capture the energy of the moment.",color:"#b8d67b"},
] as const;
export function AiwaCreativesMotion(){
 const [active,setActive]=useState(0);
 const ref=useRef<HTMLElement>(null);
 useEffect(()=>{
  const root=ref.current;
  if(!root||!window.IntersectionObserver)return;
  const observer=new IntersectionObserver(([entry])=>{root.dataset.visible=String(entry.isIntersecting);},{threshold:.12});
  observer.observe(root);return()=>observer.disconnect();
 },[]);
 const mode=modes[active];
 return <section ref={ref} className="creative-lab spec-pad" aria-labelledby="creative-lab-heading">
  <header><span>AIWA / THE CREATIVE LAB</span><span>01 — 06 / EXPERIMENT IN FORM</span></header>
  <h2 id="creative-lab-heading">THE IDEA.<br/><em>IN MOTION.</em></h2>
  <div id="creative-lab-stage" className="creative-lab__stage" style={{"--lab-accent":mode.color} as React.CSSProperties}>
   <div className="creative-lab__scene" data-mode={active} key={mode.name} aria-hidden="true">
    <svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet">
     <g className="creative-lab__guides" fill="none" stroke="currentColor" opacity=".35"><path d="M400 30V420M80 225H720" strokeDasharray="5 12"/><path d="M90 75V45h30m560 0h30v30M90 375v30h30m560 0h30v-30"/></g>
     {active===0 && <g className="creative-lab__frames" fill="none" stroke="currentColor" strokeWidth="2">{[0,1,2,3].map(i=><rect key={i} x={245-i*18} y={100-i*10} width={310+i*36} height={250+i*20} transform={`rotate(${i*9-14} 400 225)`}/>)}</g>}
     {active===1 && <g className="creative-lab__frames" fill="none" stroke="currentColor" strokeWidth="2"><rect x="108" y="95" width="584" height="260"/><rect x="165" y="130" width="470" height="190"/>{Array.from({length:12},(_,i)=><g key={i}><rect x={120+i*47} y="105" width="24" height="13"/><rect x={120+i*47} y="332" width="24" height="13"/></g>)}</g>}
     {active===2 && <g className="creative-lab__orbit" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="400" cy="225" r="170"/><circle cx="400" cy="225" r="125"/>{Array.from({length:6},(_,i)=><path key={i} d="M400 55 535 270 400 350" transform={`rotate(${i*60} 400 225)`}/>)}</g>}
     {active===3 && <g className="creative-lab__orbit" fill="none" stroke="currentColor" strokeWidth="2">{Array.from({length:5},(_,i)=><ellipse key={i} cx="400" cy="225" rx="245" ry="80" transform={`rotate(${i*36} 400 225)`}/>)}</g>}
     {active===4 && <g className="creative-lab__frames" fill="none" stroke="currentColor" strokeWidth="2">{[-1,0,1].map(i=><g key={i} transform={`translate(${i*150} 0) rotate(${i*9} 400 225)`}><rect x="335" y="75" width="130" height="300" rx="18"/><path d="M375 95h50M380 355h40"/><circle cx="400" cy="225" r="36"/></g>)}</g>}
     {active===5 && <g className="creative-lab__orbit" fill="none" stroke="currentColor" strokeWidth="2">{[60,95,130,165].map(radius=><ellipse key={radius} cx="400" cy="225" rx={radius*1.7} ry={radius*.8}/>)}{Array.from({length:12},(_,i)=><path key={i} d="M400 45v38" transform={`rotate(${i*30} 400 225)`}/>)}</g>}
     <circle cx="400" cy="70" r="7" fill="currentColor"/><circle cx="635" cy="225" r="5" fill="currentColor"/>
    </svg>
    <strong>{mode.word}<span>.</span></strong>
   </div>
   <div className="creative-lab__caption"><span>0{active+1} / 06</span><p aria-live="polite">{mode.copy}</p><ArrowUpRight aria-hidden="true"/></div>
  </div>
  <div className="creative-lab__controls" role="group" aria-label="Creative disciplines">
   {modes.map((item,i)=><button type="button" key={item.name} aria-pressed={active===i} aria-controls="creative-lab-stage" onClick={()=>setActive(i)}><item.icon size={20} aria-hidden="true"/><span>{item.name}</span><small>0{i+1}</small></button>)}
  </div>
  <p className="creative-lab__note">Original motion study / conceptual creative artwork.</p>
 </section>;
}
