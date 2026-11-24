"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { clients, clientProject } from "@/lib/client-directory";
import { ClientLogo } from "./client-logo";

const disciplines = ["BRAND IDENTITY","DIGITAL MARKETING","CONTENT & PRODUCTION","DIGITAL EXPERIENCE"] as const;
const labels=["Identity","Marketing","Production","Digital"];
export function ClientConnections(){
  const [active,setActive]=useState(0);
  const related=clients.filter(c=>clientProject(c)?.discipline===disciplines[active]);
  return <section className="cd-connections cd-gutter" aria-labelledby="cd-connections-title">
    <div className="cd-section-head"><div><p className="cd-label">03 / THE CONNECTIONS</p><h2 id="cd-connections-title">IDEAS<br/>IN GOOD COMPANY<span className="cd-dot">.</span></h2></div><p>See where our client archive meets our published portfolio. Different disciplines, one creative conversation.</p></div>
    <div className="cd-connections-layout">
      <div className="cd-orbit">
        <svg viewBox="0 0 400 400" aria-hidden="true"><circle cx="200" cy="200" r="142" fill="none" stroke="currentColor" strokeDasharray="3 8" opacity=".35"/><circle cx="200" cy="200" r="86" fill="none" stroke="currentColor" opacity=".24"/>{disciplines.map((d,i)=>{const angle=i*Math.PI/2-Math.PI/2;return <path key={d} d={"M200 200 L"+(200+142*Math.cos(angle))+" "+(200+142*Math.sin(angle))} className={i===active?"cd-orbit-active":""} stroke="currentColor" strokeWidth={i===active?3:1} opacity={i===active?1:.2} pathLength="1"/>;})}</svg>
        <div className="cd-orbit-core">AIWA<span>.</span></div>
        <div role="group" aria-label="Portfolio discipline">{labels.map((label,i)=><button key={label} className={"cd-orbit-button cd-orbit-button-"+i} type="button" aria-pressed={active===i} onClick={()=>setActive(i)}>{label}</button>)}</div>
      </div>
      <div className="cd-related"><p className="cd-label">{disciplines[active]} / PUBLISHED WORK</p><div aria-live="polite">{related.length?related.map(c=>{const project=clientProject(c);return project?<Link key={c.id} href={"/work/"+project.slug} className="cd-related-card"><div><ClientLogo client={c} decorative sizes="90px"/></div><span><strong>{c.name}</strong><small>{project.title}</small></span><ArrowUpRight size={22} aria-hidden="true"/></Link>:null;}):<p>No matching published client project in this selection yet.</p>}</div><Link className="cd-text-link" href="/work">Explore selected work <ArrowUpRight size={20}/></Link></div>
    </div>
  </section>;
}

export function ClientOutro(){
  return <section className="cd-outro cd-gutter" aria-labelledby="cd-outro-title">
    <p className="cd-label">04 / THE NEXT GOOD RELATIONSHIP?</p>
    <div className="cd-outro-stage"><h2 id="cd-outro-title">BETTER<br/><em>TOGETHER<span>.</span></em></h2><div className="cd-empty-brand" aria-hidden="true"><span>THE NEXT / 001</span><strong>YOUR<br/>LOGO<br/>HERE<span>.</span></strong><span>GOOD THINGS AHEAD ✳</span></div></div>
    <div className="cd-outro-end"><p>There’s always room for another good story.</p><Link href="/contact" className="cd-text-link">LET’S MAKE SOME NOISE <ArrowUpRight size={24}/></Link></div>
  </section>;
}
