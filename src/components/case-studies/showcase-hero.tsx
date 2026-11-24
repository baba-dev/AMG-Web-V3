import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
export function ShowcaseHero() {
  return <section className="cs-hero cs-gutter" aria-labelledby="cs-title">
    <div className="cs-hero-top"><span className="cs-label">SELECTED STORIES / 01—03</span><Link href="/work" className="cs-text-link">ALL WORK <ArrowUpRight size={18} aria-hidden="true"/></Link></div>
    <h1 id="cs-title"><span><b>LESS TALK.</b></span><span><em>MORE IMPACT.</em></span></h1>
    <div className="cs-hero-bottom"><p>Real brands. Real challenges. Meaningful results.</p><a href="#mymo-express" className="cs-text-link">EXPLORE OUR STORIES <ArrowDownRight size={24} aria-hidden="true"/></a></div>
    <svg className="cs-hero-signal" viewBox="0 0 260 180" aria-hidden="true" fill="none"><path d="M6 130 42 130 59 81 82 155 108 29 131 116 150 64 171 130 254 130" stroke="currentColor" strokeWidth="2"/><circle cx="108" cy="29" r="8" fill="currentColor"/><circle cx="254" cy="130" r="5" fill="currentColor"/></svg>
  </section>;
}
