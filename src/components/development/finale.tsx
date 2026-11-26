import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MagneticLink } from "./magnetic-link";
import "./lower-sections.css";

export function Finale() {
  return <section className="tech-finale spec-pad" data-tech-section="finale" aria-labelledby="dev-finale-title">
    <div className="tech-finale__ink" aria-hidden="true"/>
    <p className="tech-chapter__kicker">LET'S TALK ABOUT YOUR IDEA.</p>
    <h2 id="dev-finale-title">READY FOR<br/><em>THE NEXT MOVE?</em></h2>
    <div className="tech-finale__actions">
      <MagneticLink href="/contact#enquiries">START A CONVERSATION <ArrowUpRight size={24} aria-hidden="true"/></MagneticLink>
      <Link href="/work/technology" className="tech-link">Explore all technology work <ArrowUpRight size={22} aria-hidden="true"/></Link>
    </div>
  </section>;
}
