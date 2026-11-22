import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { AiwaInnerHeader } from "@/components/aiwa-inner-header";
import { specialisms, getRelatedProjects } from "@/lib/specialisms";
import "@/components/aiwa-polish.css";
import "./specialisms-directory.css";

export const metadata:Metadata={
  title:"Specialisms | Creative, Social, Studio & Tech | Aiwa Media Group",
  description:"Explore seven creative disciplines at Aiwa Media Group: global thinking, consumer branding, corporate content, sports and events, social, studio and technology.",
  alternates:{canonical:"/specialisms"},
  openGraph:{
    title:"What we do — Aiwa Media Group",
    description:"Seven ways to make a real difference. Creative, social, production and technology from Muscat.",
    type:"website",
  },
};

export default function SpecialismsDirectory(){
 return <div className="aiwa-site spec-site spec-directory" data-specialisms-directory>
  <AiwaInnerHeader/>
  <main id="main-content">
   <section className="spec-directory__hero spec-pad" aria-labelledby="spec-directory-title">
    <div className="spec-directory__top"><span>AIWA / WHAT WE DO</span><span>SEVEN WAYS TO MAKE NOISE / MUSCAT</span></div>
    <div className="spec-directory__hero-center">
     <p>CREATIVE MINDS. MANY DISCIPLINES.</p>
     <h1 id="spec-directory-title">EVERYTHING<br/><em>CONNECTS.</em></h1>
     <div className="spec-directory__hero-bottom">
      <p>A brand doesn’t live in one channel. Neither do we. Explore the thinking, craft and technical work behind our seven specialisms.</p>
      <a href="#all-services" aria-label="Explore seven specialisms">EXPLORE <ArrowDown size={22} aria-hidden="true"/></a>
     </div>
    </div>
    <div className="spec-directory__hero-footer"><span>01 — 07 / AN EDITORIAL DIRECTORY</span><span>SCROLL TO EXPLORE</span></div>
   </section>

   <section id="all-services" className="spec-directory__gallery spec-pad" aria-labelledby="all-services-heading">
    <header className="spec-directory__gallery-heading">
     <div><span className="spec-kicker">01 / THE DISCIPLINES</span><h2 id="all-services-heading">WHAT WE <em>DO.</em></h2></div>
     <p>Different disciplines. Shared curiosity. Choose a direction and see what Aiwa brings to it.</p>
    </header>
    <ol className="spec-directory__items">
     {specialisms.map(service=>{
      const related=getRelatedProjects(service);
      return <li key={service.slug} className="spec-directory__item" data-specialism-card={service.slug} style={{"--spec-accent":service.accent} as React.CSSProperties}>
       <Link href={"/specialisms/"+service.slug} className="spec-directory__card" aria-label={"Explore "+service.name+" specialism"}>
        <div className="spec-directory__card-media">
         <Image src={service.art} alt={service.alt} width={1200} height={900} unoptimized
          loading="lazy" sizes="(max-width:767px) 100vw, 60vw"/>
         <span className="spec-directory__art-note">ORIGINAL CONCEPTUAL ILLUSTRATION</span>
         <span className="spec-directory__arrow" aria-hidden="true"><ArrowUpRight size={29}/></span>
        </div>
        <div className="spec-directory__card-content">
         <div className="spec-directory__card-line"><span>{String(service.index).padStart(2,"0")} / 07</span><span>{service.position}</span></div>
         <h3>{service.name}</h3>
         <p>{service.title}</p>
         <span className="spec-directory__proof">{related.length?related.length+" RELEVANT WORK "+(related.length===1?"STORY":"STORIES"):"CAPABILITY / NO VERIFIED SPORT CASE STUDY"}</span>
        </div>
       </Link>
      </li>;
     })}
    </ol>
    <div className="spec-directory__gallery-foot"><span>ALL SEVEN / ONE CONNECTED CREATIVE GROUP</span><Link href="/work">EXPLORE SELECTED WORK <ArrowUpRight size={19}/></Link></div>
   </section>

   <section className="spec-directory__promise spec-pad" aria-labelledby="spec-directory-promise">
    <span className="spec-kicker">02 / HOW WE WORK TOGETHER</span>
    <h2 id="spec-directory-promise">THE RIGHT<br/>EXPERTISE.<br/><em>ONE IDEA.</em></h2>
    <div className="spec-directory__promise-bottom"><p>Whether you need a focused identity, a film, a digital experience or a connected campaign, the work should begin with the problem you want solved.</p><Link href="/work">SEE THE THINKING IN ACTION <ArrowUpRight size={21}/></Link></div>
   </section>
   <section className="spec-directory__contact spec-pad" aria-labelledby="spec-directory-contact">
    <span className="spec-kicker">HAVE AN IDEA THAT NEEDS A TEAM?</span>
    <h2 id="spec-directory-contact">LET'S MAKE<br/><em>IT HAPPEN.</em></h2>
    <a href="/contact">START A CONVERSATION <ArrowUpRight size={25}/></a>
   </section>
  </main>
 </div>;
}
