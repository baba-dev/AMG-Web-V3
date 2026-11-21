import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { workProjects } from "@/lib/work/projects";
import "./work-hero.css";

/** Project-first cinematic opening, with real document flow and no scroll hijack. */
export function WorkHero() {
  const featured = workProjects[0];
  return (
    <section className="work-hero" aria-labelledby="work-opening-title" data-work-hero>
      <div className="work-hero__top work-page__gutter">
        <span>AIWA / WORK / 2026</span>
        <span>CREATIVE. DIGITAL. EVERYTHING IN BETWEEN.</span>
      </div>
      <div className="work-hero__main work-page__gutter">
        <div className="work-hero__type">
          <span className="work-hero__kicker">THE PORTFOLIO / 001</span>
          <h1 id="work-opening-title">
            <span><span>IDEAS</span></span>
            <span><span>THAT MAKE</span></span>
            <span><em>NOISE.</em></span>
          </h1>
          <p>Work with impact. Ideas with identity. Creative thinking made real for brands and businesses.</p>
        </div>
        <div className="work-hero__frame">
          <div className="work-hero__frame-inner">
            <Image src={featured.artwork} width={960} height={740}
              alt={featured.alt} unoptimized priority sizes="(max-width: 767px) 90vw, 49vw" />
            <span className="work-hero__frame-scan" aria-hidden="true"/>
            <span className="work-hero__frame-corner" aria-hidden="true"><ArrowUpRight size={24}/></span>
          </div>
          <div className="work-hero__frame-meta">
            <div><span>FEATURED / 01—06</span><strong>{featured.client}</strong></div>
            <span>BRAND + MOVEMENT</span>
          </div>
        </div>
      </div>
      <div className="work-hero__bottom work-page__gutter">
        <div><span>BASED IN MUSCAT, OMAN.</span><span>MADE TO BE SEEN EVERYWHERE.</span></div>
        <a href="#work-index" aria-label="Explore the selected projects">
          EXPLORE THE WORK <ArrowDown size={22} aria-hidden="true"/>
        </a>
      </div>
    </section>
  );
}
