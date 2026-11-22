import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { teamSignalArtwork } from "@/lib/team-media";

/** Server-rendered hero: artwork and text remain available without JS. */
export function AiwaTeamHero() {
  return (
    <section className="team-hero team-pad" aria-labelledby="team-hero-title" id="team-top">
      <div className="team-hero__topline team-micro">
        <span>AIWA / THE HUMAN SIDE</span>
        <span>MUSCAT, OMAN / WORLDWIDE THINKING</span>
      </div>
      <div className="team-hero__stage">
        <div className="team-hero__wording">
          <p className="team-hero__kicker">THE PEOPLE BEHIND THE PROJECTS</p>
          <h1 id="team-hero-title">
            <span>THE MINDS.</span>
            <span><em>THE MAKERS.</em></span>
            <span>THE MAGIC.</span>
          </h1>
          <div className="team-hero__lead">
            <p>Many perspectives. One creative pulse. Meet the people, disciplines and energy behind Aiwa Media Group.</p>
            <a href="#people" className="team-round-link" aria-label="Explore the people in Aiwa's published team archive">
              <span>MEET THE PEOPLE</span><ArrowDown aria-hidden="true" size={20} />
            </a>
          </div>
        </div>
        <div className="team-hero__composition" aria-label="Aiwa archive imagery and original editorial artwork">
          <figure className="team-hero__hero-photo">
            <Image src="/media/archive/production-team.webp" fill priority
              sizes="(max-width: 850px) 85vw, 44vw"
              alt="Production image published in the original Aiwa Media Group gallery" />
            <figcaption>AIWA ARCHIVE / PRODUCTION</figcaption>
          </figure>
          <figure className="team-hero__signal">
            <Image src={teamSignalArtwork} alt="Original abstract Aiwa signal artwork" fill
              sizes="(max-width: 850px) 44vw, 26vw" />
          </figure>
          <div className="team-hero__stamp" aria-hidden="true">IDEAS<br />HAVE<br />PEOPLE<span>✳</span></div>
        </div>
      </div>
      <div className="team-hero__bottom team-micro">
        <span>01 / PEOPLE, CULTURE & CREATIVE ENERGY</span>
        <a href="#team-gallery">DISCOVER OUR WORLD <ArrowUpRight aria-hidden="true" size={16} /></a>
      </div>
    </section>
  );
}
