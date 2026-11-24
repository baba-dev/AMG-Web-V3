import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { AiwaCreativesMotion } from "@/components/aiwa-creatives-motion";
import { AiwaInnerHeader } from "@/components/aiwa-inner-header";
import {
 specialisms, getSpecialism, getRelatedProjects, nextSpecialism, previousSpecialism,
} from "@/lib/specialisms";
import "@/components/aiwa-polish.css";
import "../specialisms-directory.css";
import "./specialism-detail.css";

type Props={params:Promise<{slug:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return specialisms.map(service=>({slug:service.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;
 const service=getSpecialism(slug);
 if(!service)return {title:"Specialism not found | Aiwa Media Group",robots:{index:false}};
 const description=service.lead;
 return {
  title:service.name+" — "+service.title+" | Aiwa Media Group",
  description,
  alternates:{canonical:"/specialisms/"+service.slug},
  openGraph:{title:service.name+" | Aiwa Media Group Specialisms",description,type:"website"},
  twitter:{card:"summary_large_image",title:service.name+" | Aiwa Media Group",description},
 };
}
export default async function SpecialismDetail({params}:Props){
 const {slug}=await params;
 const service=getSpecialism(slug);
 if(!service)notFound();
 const related=getRelatedProjects(service);
 const before=previousSpecialism(service),after=nextSpecialism(service);
 const vars={"--spec-accent":service.accent,"--spec-ink":service.ink} as CSSProperties;
 const structured={
  "@context":"https://schema.org","@type":"Service",
  name:service.name+" — Aiwa Media Group",
  description:service.lead,
  provider:{"@type":"Organization",name:"Aiwa Media Group",url:"https://aiwamediagroup.com/"},
  areaServed:{"@type":"Place",name:"Oman"},
 };
 return <div className={"aiwa-site spec-site spec-detail spec-detail--"+service.slug}
    style={vars} data-specialism={service.slug}>
   <script type="application/ld+json" dangerouslySetInnerHTML={{
    __html:JSON.stringify(structured).replace(/</g,"\\u003c"),
   }}/>
   <AiwaInnerHeader/>
   <main id="main-content">
    <section className="spec-detail__hero spec-pad" aria-labelledby="specialism-heading">
     <div className="spec-detail__hero-nav">
      <Link href="/specialisms"><ArrowLeft size={19} aria-hidden="true"/> ALL SPECIALISMS</Link>
      <span>AIWA / {String(service.index).padStart(2,"0")} OF 07</span>
     </div>
     <div className="spec-detail__hero-main">
      <span className="spec-kicker">{service.kicker}</span>
      <h1 id="specialism-heading">{service.name}</h1>
      <p className="spec-detail__hero-headline"><span>{service.headline[0]}</span><span><em>{service.headline[1]}</em></span></p>
      <div className="spec-detail__hero-bottom">
       <p>{service.lead}</p>
       <a href="#service-thinking">GET INTO IT <ArrowDown size={22} aria-hidden="true"/></a>
      </div>
     </div>
     <div className="spec-detail__hero-foot"><span>{service.position}</span><span>CREATIVE / MUSCAT</span></div>
    </section>

    <figure className="spec-detail__art" aria-labelledby="specialism-art-caption">
     <Image src={service.art} width={1200} height={900} unoptimized priority sizes="100vw"
       alt={service.alt}/>
     <figcaption id="specialism-art-caption"><span>AIWA / {service.name.toUpperCase()} / ORIGINAL ART</span><span>CONCEPTUAL SERVICE ILLUSTRATION / NOT CLIENT CAMPAIGN MEDIA</span></figcaption>
    </figure>

    {service.slug==="creatives" && <AiwaCreativesMotion/>}

    <section id="service-thinking" className="spec-detail__thinking spec-pad" aria-labelledby="service-thinking-heading">
     <div className="spec-detail__thinking-rail">
      <span className="spec-kicker">01 / THE POINT OF VIEW</span>
      <span>WHAT MAKES THIS SPECIALISM MATTER</span>
     </div>
     <div>
      <h2 id="service-thinking-heading">{service.question}</h2>
      <p className="spec-detail__thinking-lead">{service.title}</p>
      <p className="spec-detail__thinking-text">{service.answer}</p>
     </div>
    </section>

    <section className="spec-detail__approach spec-pad" aria-labelledby="service-approach-heading">
     <div className="spec-detail__approach-top">
      <span className="spec-kicker">02 / THE APPROACH</span>
      <span>THINK / MAKE / MOVE</span>
     </div>
     <h2 id="service-approach-heading">HOW WE<br/><em>MAKE IT MATTER.</em></h2>
     <ol>
      {service.approach.map((phase,i)=><li key={phase.name}>
       <span>0{i+1} / 03</span><h3>{phase.name}</h3><p>{phase.copy}</p><ArrowUpRight size={22} aria-hidden="true"/>
      </li>)}
     </ol>
    </section>

    <section className="spec-detail__capabilities spec-pad" aria-labelledby="service-capabilities-heading">
     <header>
      <span className="spec-kicker">03 / CAPABILITIES</span>
      <h2 id="service-capabilities-heading">THE RIGHT<br/><em>TOOLS FOR IT.</em></h2>
      <p>Capabilities are drawn from Aiwa's publicly described services; specific scope is agreed per project.</p>
     </header>
     <ol>
      {service.capabilities.map((item,i)=><li key={item.name}>
       <span>{String(i+1).padStart(2,"0")}</span>
       <h3>{item.name}</h3>
       <p>{item.copy}</p>
      </li>)}
     </ol>
    </section>

    <section className="spec-detail__related spec-pad" aria-labelledby="service-related-heading">
     <header>
      <span className="spec-kicker">04 / RELATED WORK</span>
      <h2 id="service-related-heading">SEE IT<br/><em>IN PRACTICE.</em></h2>
      <p>{service.evidenceNote}</p>
     </header>
     {related.length>0?
       <div className="spec-detail__work-list">
        {related.map((project,i)=><Link href={"/work/"+project.slug} key={project.slug} className="spec-detail__work-card" data-related-work={project.slug}>
         <div className="spec-detail__work-art">
          <Image src={project.artwork} alt={project.alt} width={960} height={740}
           unoptimized loading="lazy" sizes="(max-width:767px) 100vw, 50vw"/>
          <span>ORIGINAL CONCEPTUAL ART</span>
          <span className="spec-detail__work-arrow" aria-hidden="true"><ArrowUpRight size={24}/></span>
         </div>
         <div className="spec-detail__work-info"><span>0{i+1} / 0{related.length}</span><strong>{project.client}</strong><p>{project.title}</p><span>{project.discipline}</span></div>
        </Link>)}
       </div>:
       <div className="spec-detail__no-proof" data-no-verified-case-study>
        <span>NO VERIFIED SPORTS-SPECIFIC PROJECT ON THIS SITE</span>
        <p>We are not passing off an unrelated brand campaign as sports work. Explore the broader portfolio for documented identity, media and technology experience.</p>
        <Link href="/work">EXPLORE ALL WORK <ArrowUpRight size={20} aria-hidden="true"/></Link>
       </div>}
    </section>

    <aside className="spec-detail__sources spec-pad" aria-label="Service source references">
      <div><span className="spec-kicker">SOURCE NOTES / SERVICE SCOPE</span><p>Capabilities reflect Aiwa's published service information; adjacent case studies are selectively associated with the relevant documented work. Original illustrations are conceptual, not photographs of completed campaigns.</p></div>
      <div>{service.sources.map(source=><a key={source.href} href={source.href} target="_blank" rel="noopener noreferrer">{source.label}<ArrowUpRight size={18} aria-hidden="true"/></a>)}</div>
    </aside>

    <nav className="spec-detail__pager spec-pad" aria-label="Browse specialisms">
     <Link href={"/specialisms/"+before.slug}><ArrowLeft size={21} aria-hidden="true"/> PREVIOUS SPECIALISM <strong>{before.name}</strong></Link>
     <Link href={"/specialisms/"+after.slug}>NEXT SPECIALISM <ArrowRight size={21} aria-hidden="true"/><strong>{after.name}</strong></Link>
    </nav>

    <section className="spec-detail__contact spec-pad" aria-labelledby="specialism-contact-heading">
     <span className="spec-kicker">LET'S TALK ABOUT YOUR IDEA.</span>
     <h2 id="specialism-contact-heading">READY FOR<br/><em>THE NEXT MOVE?</em></h2>
     <a href="/contact">START A CONVERSATION <ArrowUpRight size={24} aria-hidden="true"/></a>
    </section>
   </main>
  </div>;
}
