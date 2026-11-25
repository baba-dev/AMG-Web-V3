import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { developmentServices,iotSolutions,developmentFaqs } from "@/lib/development";
import { getTechnologyProject,technologyEcosystem,technologyExpertise } from "@/lib/work/technology";
import { TechPair } from "@/components/technology/tech-media";
import { DevelopmentAnchorSync } from "./development-anchor-sync";
import { DevelopmentDiagram } from "./development-art";
import "./development.css";

export function DevelopmentServices(){
 return <section className="spec-detail__capabilities spec-pad dev-services" id="dev-services" aria-labelledby="service-capabilities-heading">
  <header><span className="spec-kicker">03 / OUR SPECIALISMS</span><h2 id="service-capabilities-heading">SIX WAYS TO<br/><em>MOVE FORWARD.</em></h2><p>One technology team. Six ways to make business work better.</p></header>
  <DevelopmentAnchorSync/><ol>{developmentServices.map((service,i)=>{const project=service.project?getTechnologyProject(service.project):undefined;return <li key={service.id} id={"dev-"+service.id} className="dev-service" style={{"--dev-service-accent":service.accent} as CSSProperties}>
   <details name="dev-service" open={i===0?true:undefined}><summary><span className="dev-index">0{i+1}</span><h3>{service.name}</h3><Plus aria-hidden="true" size={24}/></summary>
    <div className="dev-service__body"><div><strong>{service.lead}</strong><p>{service.copy}</p><ul>{service.deliverables.map(d=><li key={d}>{d}</li>)}</ul><Link href={service.id==="iot"?"#dev-connected":"/contact#enquiries"} className="dev-link">{service.id==="iot"?"Explore connected hardware":"Discuss your project"} <ArrowUpRight size={19}/></Link></div>
    {project?<Link href={"/work/technology/"+project.slug} aria-label={"Explore "+project.name}><TechPair project={project} compact/></Link>:<div className="dev-service__art"><DevelopmentDiagram kind={service.id}/></div>}</div>
   </details></li>;})}</ol>
 </section>;
}
export function DevelopmentConnected(){
 return <section id="dev-connected" className="dev-section dev-iot spec-pad" aria-labelledby="dev-iot-heading">
  <div className="dev-chapter"><div><p className="spec-kicker">04 / INDUSTRIAL IoT</p><h2 id="dev-iot-heading">THE PHYSICAL.<br/>THE DIGITAL.<br/><em>CONNECTED.</em></h2></div><p>We create web-powered hardware and connected monitoring systems for industrial and commercial environments. From sensing to control, bring physical operations into one digital picture.</p></div>
  <div className="dev-iot-grid">{iotSolutions.map((item,i)=><article key={item.id} className="dev-iot-card"><div className="dev-iot-card__art"><span>0{i+1} / {item.metric}</span><DevelopmentDiagram kind={item.id}/></div><h3>{item.name}</h3><p>{item.copy}</p></article>)}</div>
  <p className="dev-art-note">Illustrated system concepts, not photographs or screenshots of installations.</p><Link href="/contact#enquiries" className="dev-link">Discuss an industrial IoT solution <ArrowUpRight size={22}/></Link>
 </section>;
}
export function DevelopmentFeatured(){
 const projects=["aiwa-creators","gwi","menu-minute"].map(getTechnologyProject).filter(p=>p!==undefined);
 return <div className="dev-projects">{projects.map((project)=><article key={project.slug}><Link href={"/work/technology/"+project.slug}><TechPair project={project} compact/><div className="dev-project-caption"><div><span className="spec-kicker">{project.sector}</span><h3>{project.name}</h3></div><ArrowUpRight aria-hidden="true" size={24}/></div><p>{project.description}</p></Link></article>)}<Link href="/work/technology" className="dev-link dev-all-work">Explore all technology work <ArrowUpRight size={22}/></Link></div>;
}
export function DevelopmentTrust(){
 return <>
 <section className="dev-section spec-pad dev-managed" aria-labelledby="dev-managed-title"><div className="dev-chapter"><div><p className="spec-kicker">06 / MANAGED TECHNOLOGY</p><h2 id="dev-managed-title">BUILT TO LAST.<br/><em>SUPPORTED TO GROW.</em></h2></div><p>Launching a product is only the beginning. Keep your systems working as your business changes.</p></div><div className="dev-managed__rows">{[["Cloud & hosting","Infrastructure and deployment support tailored to your workload."],["Business email","Professional mailboxes or dedicated email environments, under your own domain."],["Application maintenance","Ongoing updates, troubleshooting and improvements, with scope agreed upfront."]].map(([name,copy],i)=><article key={name}><span>0{i+1}</span><h3>{name}</h3><p>{copy}</p><ArrowUpRight aria-hidden="true" size={20}/></article>)}</div><Link href="/contact#enquiries" className="dev-link">Discuss managed services <ArrowUpRight size={20}/></Link></section>
 <section className="dev-section dev-ecosystem spec-pad" aria-labelledby="dev-ecosystem-title"><div className="dev-chapter"><div><p className="spec-kicker">07 / TECHNOLOGY ECOSYSTEM</p><h2 id="dev-ecosystem-title">GOOD COMPANY.<br/><em>GREAT TECHNOLOGY.</em></h2></div><p>Our technology relationships span Cloudflare, Oracle, BytePlus and Gallabox. We select the tools that fit your business rather than forcing a single platform.</p></div><div className="dev-vendors">{technologyEcosystem.map(([name,copy])=><article key={name}><h3>{name}</h3><p>{copy}</p></article>)}</div><div className="dev-certifications"><div><p className="spec-kicker">CLOUD EXPERTISE</p><h3>Certified across leading cloud platforms.</h3><p>Our team includes professionals certified across AWS, Google Cloud and Oracle Cloud.</p></div><div className="dev-certifications__marks">{technologyExpertise.map(([short,name])=><div key={short}><strong>{short}</strong><span>{name}</span></div>)}</div></div></section>
 <section className="dev-section spec-pad dev-faq" aria-labelledby="dev-faq-title"><div className="dev-chapter"><div><p className="spec-kicker">08 / FREQUENTLY ASKED QUESTIONS</p><h2 id="dev-faq-title">GOOD QUESTIONS.<br/><em>CLEAR ANSWERS.</em></h2></div><p>Practical answers about working with our technology team.</p></div>{developmentFaqs.map(([question,answer])=><details key={question}><summary>{question}<Plus aria-hidden="true" size={22}/></summary><p>{answer}</p></details>)}</section>
 </>;
}
