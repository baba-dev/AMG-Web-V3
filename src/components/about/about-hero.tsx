import Image from "next/image";
import { ArrowDownRight } from "lucide-react";

export function AboutHero() {
  return <section className="ab-hero ab-section" aria-labelledby="ab-title">
    <div className="ab-kicker"><span>AIWA / WHO WE ARE</span><span>MUSCAT, OMAN / 01</span></div>
    <h1 id="ab-title" className="ab-poster"><span><b>BEYOND<span className="ab-signal" aria-hidden="true"></span></b></span><span><em>THE NOISE.</em></span></h1>
    <div className="ab-hero-foot"><p>Creative minds. Connected disciplines. A media group built around your ambitions.</p><a href="#ab-intro" className="ab-link">EXPLORE OUR STORY <ArrowDownRight aria-hidden="true"/></a></div>
    <figure className="ab-hero-media"><div className="ab-film-label" aria-hidden="true"><span>AIWA / FIELD NOTES</span><span>● &nbsp; MUSCAT</span></div>
      <Image src="/media/archive/production-team.webp" alt="Production imagery published on Aiwa’s former website" width={1200} height={800} unoptimized priority/>
      <Image src="/media/archive/ridhwan-showcase.webp" alt="Published optical retail campaign collage" width={900} height={900} unoptimized/>
      <Image src="/media/archive/casabella-discount.webp" alt="Published bilingual Casabella retail campaign" width={900} height={900} unoptimized/>
      <figcaption><span>AIWA / PUBLISHED MEDIA ARCHIVE / 2024</span><span>01 — 03 / SELECTED FRAMES</span></figcaption>
    </figure>
  </section>;
}
