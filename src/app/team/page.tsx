import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { AiwaInnerHeader } from "@/components/aiwa-inner-header";
import { AiwaTeamHero } from "@/components/aiwa-team-hero";
import { AiwaTeamGallery } from "@/components/aiwa-team-gallery";
import { AiwaTeamDirectory } from "@/components/aiwa-team-directory";
import { teamCulture, teamDivisions } from "@/lib/team-data";
import "@/components/aiwa-polish.css";
import "./team.css";

export const metadata: Metadata = {
  title: "Our People & Culture | Aiwa Media Group",
  description: "Meet the team behind Aiwa Media Group in Muscat: leadership, operations, web engineering, sales and creative artwork.",
  alternates: { canonical: "/team" },
  openGraph: { title:"The Minds. The Makers. The Magic. | Aiwa Media Group",
    description:"Discover the people, creative work and culture of Aiwa Media Group.", type:"website" },
};

export default function TeamPage() {
  return (
    <div className="aiwa-site team-site" data-team-page>
      <AiwaInnerHeader />
      <main id="main-content">
        <AiwaTeamHero />
        <AiwaTeamGallery />
        <AiwaTeamDirectory />

        <section className="team-divisions team-pad" id="team-divisions" aria-labelledby="team-divisions-heading">
          <div className="team-section-heading">
            <div><span className="team-micro">04 / ONE CREATIVE GROUP</span>
              <h2 id="team-divisions-heading">DIFFERENT TALENTS.<br /><em>ONE FREQUENCY.</em></h2></div>
            <p>The right combination changes with every brief. Our disciplines connect strategy, craft and technology.</p>
          </div>
          <ol className="team-divisions__list">
            {teamDivisions.map((division) => (
              <li key={division.number}>
                <a href={division.href} className="team-division">
                  <span className="team-division__number">{division.number}</span>
                  <span className="team-division__body"><strong>{division.title}</strong><span>{division.description}</span></span>
                  <span className="team-division__arrow" aria-hidden="true"><ArrowUpRight size={30} /></span>
                </a>
              </li>
            ))}
          </ol>
        </section>

        <section className="team-culture team-pad" id="team-culture" aria-labelledby="team-culture-heading">
          <div className="team-section-heading">
            <div><span className="team-micro">05 / THE AIWA WAY</span>
              <h2 id="team-culture-heading">SERIOUS ABOUT<br /><em>THE CREATIVE.</em></h2></div>
            <p>Good work happens when different minds have room to explore, challenge and build something together.</p>
          </div>
          <div className="team-culture__grid">
            {teamCulture.map((value) => (
              <article key={value.number} className="team-culture__item">
                <span className="team-micro">{value.number} / {value.intro}</span>
                <h3>{value.title}</h3>
                <p>{value.copy}</p>
                <span className="team-culture__asterisk" aria-hidden="true">✳</span>
              </article>
            ))}
          </div>
        </section>

        <section className="team-muscat team-pad" aria-labelledby="team-muscat-heading">
          <div className="team-muscat__wording">
            <span className="team-micro">06 / OUR CREATIVE HOME</span>
            <h2 id="team-muscat-heading">MADE IN<br /><em>MUSCAT.</em><br />MADE TO MOVE.</h2>
            <p>Rooted in Oman, connected across disciplines. Our point of view starts here and travels wherever the work needs to go.</p>
            <span className="team-muscat__arabic" lang="ar" dir="rtl">مجموعة أيوا الإعلامية</span>
          </div>
          <figure className="team-muscat__art">
            <Image src="/media/finale/muscat-editorial.svg" fill alt="Original conceptual editorial illustration inspired by Muscat and Oman's landscape"
              sizes="(max-width:800px) 90vw, 46vw" />
            <figcaption>ORIGINAL EDITORIAL ILLUSTRATION / NOT DOCUMENTARY PHOTOGRAPHY</figcaption>
          </figure>
        </section>

        <section className="team-careers team-pad" aria-labelledby="team-careers-heading">
          <div className="team-micro">07 / COME MAKE SOMETHING</div>
          <h2 id="team-careers-heading">YOUR NEXT<br /><em>BIG IDEA?</em></h2>
          <div className="team-careers__bottom">
            <p>We are always interested in people with curiosity, conviction and a different perspective. Learn about life at Aiwa and where to find verified opportunities.</p>
            <a href="/join-us" className="team-careers__link">EXPLORE JOIN US <ArrowUpRight size={27} aria-hidden="true" /></a>
          </div>
          <a href="#team-top" className="team-careers__back">BACK TO THE TOP <ArrowDown aria-hidden="true" size={16} /></a>
        </section>
      </main>
    </div>
  );
}
