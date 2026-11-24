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
  <div className="creative-lab__stage" style={{"--lab-accent":mode.color} as React.CSSProperties}>
   <div className="creative-lab__scene" key={mode.name} aria-hidden="true">
    <svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet">
     <g className="creative-lab__orbit" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="400" cy="225" r="155"/><ellipse cx="400" cy="225" rx="235" ry="95" transform="rotate(-28 400 225)"/><ellipse cx="400" cy="225" rx="235" ry="95" transform="rotate(28 400 225)"/><path d="M400 30V420M80 225H720" strokeDasharray="5 12"/></g>
     <g className="creative-lab__frames" fill="none" stroke="currentColor" strokeWidth="2"><rect x="245" y="100" width="310" height="250" rx="4" transform="rotate(-12 400 225)"/><rect x="245" y="100" width="310" height="250" rx="4" transform="rotate(12 400 225)"/></g>
     <circle cx="400" cy="70" r="7" fill="currentColor"/><circle cx="635" cy="225" r="5" fill="currentColor"/>
    </svg>
    <strong>{mode.word}<span>.</span></strong>
   </div>
   <div className="creative-lab__caption"><span>0{active+1} / 06</span><p aria-live="polite">{mode.copy}</p><ArrowUpRight aria-hidden="true"/></div>
  </div>
  <div className="creative-lab__controls" aria-label="Creative disciplines">
   {modes.map((item,i)=><button type="button" key={item.name} aria-pressed={active===i} onClick={()=>setActive(i)}><item.icon size={20} aria-hidden="true"/><span>{item.name}</span><small>0{i+1}</small></button>)}
  </div>
  <p className="creative-lab__note">Original motion study / conceptual creative artwork.</p>
 </section>;
}
