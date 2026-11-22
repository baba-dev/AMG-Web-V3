import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { teamEditorialFrames } from "@/lib/team-media";

/** Editorial imagery is explicitly classified to avoid misrepresenting client work as staff photography. */
export function AiwaTeamGallery() {
  return (
    <section className="team-gallery team-pad" id="team-gallery" aria-labelledby="team-gallery-title">
      <div className="team-section-heading">
        <div><span className="team-micro">02 / OUR WORLD</span>
          <h2 id="team-gallery-title">LIFE IN<br /><em>THE MAKING.</em></h2></div>
        <p>Our days connect design, shoots, campaigns, technology and the unexpected things that happen in between.</p>
      </div>
      <div className="team-gallery__grid">
        {teamEditorialFrames.map((frame, index) => (
          <figure className={"team-gallery__frame team-gallery__frame--" + (index + 1)}
            key={frame.src} data-team-media-type={frame.category}>
            <div className="team-gallery__image">
              <Image src={frame.src} fill alt={frame.alt} loading="lazy"
                sizes="(max-width: 620px) 94vw, (max-width: 1000px) 50vw, 62vw" />
              <span className="team-gallery__frame-number" aria-hidden="true">0{index + 1}</span>
            </div>
            <figcaption><span>{frame.label}</span><span>{frame.category === "documentary" ? "ARCHIVAL IMAGE" : "PUBLISHED CAMPAIGN WORK"}</span></figcaption>
          </figure>
        ))}
      </div>
      <div className="team-gallery__disclosure">
        <span>DOCUMENTARY MOMENTS + PUBLISHED CLIENT CREATIVE</span>
        <p>Campaign images showcase Aiwa&apos;s work. They are not portraits of team members.</p>
        <a href="/work">EXPLORE THE WORK <ArrowUpRight size={18} aria-hidden="true" /></a>
      </div>
    </section>
  );
}
