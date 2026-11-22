import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { AiwaInnerHeader } from "@/components/aiwa-inner-header";
import { teamCulture } from "@/lib/team-data";
import "@/components/aiwa-polish.css";
import "../team/team.css";
import "./join.css";

export const metadata: Metadata = {
  title: "Join Us | Life & Careers at Aiwa Media Group",
  description: "Get to know Aiwa's creative culture in Muscat and find official channels for verified career opportunities.",
  alternates:{ canonical:"/join-us" },
  openGraph:{title:"Join the Signal | Aiwa Media Group",description:"Creative people. Different perspectives. Explore life at Aiwa.",type:"website"},
};

export default function JoinUsPage(){
  return (
    <div className="aiwa-site team-site join-site" data-join-page>
      <AiwaInnerHeader />
      <main id="main-content">
        <section className="join-hero team-pad" aria-labelledby="join-title">
          <div className="join-hero__top team-micro"><span>AIWA / COME MAKE SOMETHING</span><span>MUSCAT, OMAN</span></div>
          <div className="join-hero__body">
            <div>
              <p className="team-micro">LIFE IS BETTER WITH BOLD IDEAS.</p>
              <h1 id="join-title">JOIN<br /><em>THE SIGNAL.</em></h1>
              <p>Brave ideas need curious minds. Explore what makes Aiwa tick and find out where to follow our opportunities.</p>
              <a href="#join-positions" className="join-hero__action">EXPLORE OPPORTUNITIES <ArrowUpRight aria-hidden="true" size={22} /></a>
            </div>
            <figure>
              <Image src="/media/archive/production-team.webp" fill priority sizes="(max-width:850px) 90vw, 45vw"
                alt="Production image published by Aiwa Media Group in its original gallery"/>
              <figcaption>AIWA / PUBLISHED PRODUCTION ARCHIVE</figcaption>
            </figure>
          </div>
        </section>
        <section className="join-values team-pad" aria-labelledby="join-values-title">
          <span className="team-micro">01 / WHY WE MAKE THINGS TOGETHER</span>
          <h2 id="join-values-title">MAKE WORK<br /><em>WORTH MAKING.</em></h2>
          <div className="join-values__list">
            {teamCulture.map((value)=>(
              <article key={value.number}><span className="team-micro">{value.number}</span><h3>{value.title}</h3><p>{value.copy}</p></article>
            ))}
          </div>
        </section>
        <section className="join-opportunities team-pad" id="join-positions" aria-labelledby="join-open-title">
          <span className="team-micro">02 / YOUR NEXT CHAPTER</span>
          <h2 id="join-open-title">SOMETHING<br /><em>IN COMMON?</em></h2>
          <div className="join-opportunities__bottom">
            <p>Interested in creating with us? Follow our official company updates for verified opportunities, or introduce yourself through our contact page. Roles previously listed on our old careers site have not been confirmed as open.</p>
            <div className="join-opportunities__actions">
              <a href="https://www.linkedin.com/company/aiwamediagroup/" target="_blank" rel="noopener noreferrer">AIWA ON LINKEDIN <ArrowUpRight size={21} aria-hidden="true" /></a>
              <a href="/contact">GET IN TOUCH <ArrowUpRight size={21} aria-hidden="true" /></a>
              <a href="/team">MEET THE PEOPLE <ArrowUpRight size={21} aria-hidden="true" /></a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
