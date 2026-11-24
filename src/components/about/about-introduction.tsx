import Image from "next/image";
import { achievements } from "@/lib/about/content";
export function AboutIntroduction(){
 return <>
 <section id="ab-intro" className="ab-section" aria-labelledby="ab-intro-title"><div className="ab-kicker"><span>02 / THE GROUP</span><span>CREATIVE / DIGITAL / TECHNOLOGY</span></div><h2 id="ab-intro-title" className="ab-heading">NOT JUST <em>ONE THING.</em></h2>
 <div className="ab-split"><figure className="ab-archive"><Image src="/media/archive/mymo-coffee.webp" alt="MYMO campaign artwork published on the former Aiwa site" width={900} height={900} unoptimized/><figcaption>PUBLISHED AIWA ARCHIVE / MYMO</figcaption></figure><div className="ab-story"><p className="ab-copy">We are a Muscat-based media group bringing software, websites, marketing, events and production under one roof.</p><p>For businesses building their online presence, we connect the right expertise around a shared brief. From the first idea to the technical details, the work is designed around the people it needs to reach.</p></div></div></section>
 <section className="ab-section ab-achievements" aria-labelledby="ab-proof"><div className="ab-kicker"><span>03 / THE RECORD</span><span>LEGACY COMPANY FIGURES</span></div><h2 id="ab-proof" className="ab-heading">PROOF, <em>NOT PROMISES.</em></h2><dl className="ab-stats">{achievements.map(item=><div key={item.label}><dt>{item.label}</dt><dd>{item.number}</dd></div>)}</dl><p className="ab-note">Figures reported on Aiwa’s legacy website (2024 edition); not a current audited count.</p></section>
 </>;
}
