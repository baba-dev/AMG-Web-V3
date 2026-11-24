"use client";
import { useState } from "react";
import { values, principles } from "@/lib/about/content";
function ValueArt({index}:{index:number}){
 return <svg viewBox="0 0 400 260" className="ab-value-art" aria-hidden="true">
 <g className={"ab-value-motion ab-value-motion--"+index} fill="none" stroke="currentColor" strokeWidth="1.4">
 {index===0?Array.from({length:18},(_,i)=><ellipse key={i} cx="200" cy="130" rx="96" ry="24" transform={`rotate(${i*10} 200 130)`}/>):index===1?Array.from({length:9},(_,i)=><circle key={i} cx={200+55*Math.cos(i*Math.PI*2/9)} cy={130+55*Math.sin(i*Math.PI*2/9)} r="52"/>):Array.from({length:10},(_,i)=><rect key={i} x={70+i*18} y={192-i*16} width="95" height="28"/>)}
 </g><circle cx="200" cy="130" r="5" fill="#ff654f"/></svg>;
}
export function AboutValues(){
 const [active,setActive]=useState(0);
 return <section className="ab-section" aria-labelledby="ab-values"><div className="ab-kicker"><span>05 / THE INNER ENGINE</span><span>THREE VALUES / FOUR PRINCIPLES</span></div><h2 className="ab-heading" id="ab-values">WHAT <em>DRIVES US.</em></h2>
 <div className="ab-values-grid"><div className="ab-value-buttons" role="group" aria-label="Explore agency values">{values.map((value,i)=><button key={value.title} type="button" aria-pressed={i===active} onClick={()=>setActive(i)}><small>0{i+1}</small>{value.title}<span aria-hidden="true">{i===active?"−":"+"}</span></button>)}</div><div className="ab-value-panel"><div className="ab-art-frame" key={active}><span className="ab-art-index" aria-hidden="true">AIWA / VALUE 0{active+1}</span><ValueArt index={active}/></div><div aria-live="polite"><h3>{values[active].title}</h3><p>{values[active].copy}</p></div></div></div>
 <noscript><dl>{values.map(v=><div key={v.title}><dt>{v.title}</dt><dd>{v.copy}</dd></div>)}</dl></noscript><div className="ab-principles">{principles.map(([title,copy],i)=><article key={title}><small>0{i+1}</small><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
}