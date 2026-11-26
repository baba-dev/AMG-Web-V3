import Link from "next/link";
import { ArrowDown, ArrowLeft } from "lucide-react";
import { InkCalligraphy } from "./ink-calligraphy";
import { InkFieldLoader } from "./ink-field-loader";

/** Hero: headline copy stays real text; the ink slot is reserved for the Thuluth calligraphy layer (Task 9). */
export function TechHero() {
  return <section className="tech-hero spec-pad" data-tech-section="hero" aria-labelledby="specialism-heading">
    <div className="tech-hero__ink" aria-hidden="true"><InkFieldLoader/><InkCalligraphy word="tech" variant="background"/></div>
    <div className="tech-hero__rings" aria-hidden="true"><i/><i/><i/></div>
    <div className="tech-hero__nav">
      <Link href="/specialisms"><ArrowLeft size={19} aria-hidden="true"/> ALL SPECIALISMS</Link>
      <span>AIWA / DEVELOPMENT</span>
    </div>
    <div className="tech-hero__main">
      <p className="tech-hero__kicker">AIWA DEVELOPMENT / MUSCAT, OMAN</p>
      <h1 id="specialism-heading">Development</h1>
      <p className="tech-hero__headline"><span className="tech-hero__line"><span>GOOD IDEAS.</span></span><span className="tech-hero__line"><span><em>GREAT ENGINEERING.</em></span></span></p>
      <div className="tech-hero__bottom">
        <p>We design, develop and support websites, software, cloud infrastructure and connected hardware that make businesses work better.</p>
        <a href="#dev-services">EXPLORE OUR SERVICES <ArrowDown size={22} aria-hidden="true"/></a>
      </div>
    </div>
    <div className="tech-hero__foot"><span>ENGINEERED FOR PEOPLE.</span><span>ENGINEERING / MUSCAT</span></div>
  </section>;
}
