import { ArrowDown } from "lucide-react";
import { InkCalligraphy } from "./ink-calligraphy";
import { InkFieldLoader } from "./ink-field-loader";
import { PcbSignal } from "./pcb-signal";

/** Hero: headline copy stays real text. The h1 is kept for structure but visually hidden; the headline is the visible title. */
export function TechHero() {
  return <section className="tech-hero spec-pad" data-tech-section="hero" aria-labelledby="specialism-heading">
    <PcbSignal/>
    <div className="tech-hero__ink" aria-hidden="true"><InkFieldLoader/><InkCalligraphy word="tech" variant="background"/></div>
    <div className="tech-hero__main">
      <p className="tech-hero__kicker">AIWA DEVELOPMENT / MUSCAT, OMAN</p>
      <h1 id="specialism-heading">Development</h1>
      <p className="tech-hero__headline"><span className="tech-hero__line"><span>GOOD IDEAS.</span></span><span className="tech-hero__line"><span><em>GREAT ENGINEERING<b className="tech-hero__led">.</b></em></span></span></p>
      <div className="tech-hero__bottom">
        <p>We design, develop and support websites, software, cloud infrastructure and connected hardware that make businesses work better.</p>
        <a href="#dev-services">EXPLORE OUR SERVICES <ArrowDown size={22} aria-hidden="true"/></a>
      </div>
    </div>
  </section>;
}
