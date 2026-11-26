import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { iotSolutions } from "@/lib/development";
import { DevelopmentDiagram } from "./development-art";
import { SignalLines } from "./signal-lines";
import "./lower-sections.css";

export function IotSection() {
  return <section id="dev-connected" className="tech-iot dev-iot spec-pad" data-tech-section="iot" aria-labelledby="dev-iot-heading">
    <SignalLines/>
    <div className="tech-chapter">
      <div><p className="tech-chapter__kicker">03 / INDUSTRIAL IoT</p><h2 id="dev-iot-heading">THE PHYSICAL.<br/>THE DIGITAL.<br/><em>CONNECTED.</em></h2></div>
      <p>We create web-powered hardware and connected monitoring systems for industrial and commercial environments. From sensing to control, bring physical operations into one digital picture.</p>
    </div>
    <div className="tech-iot__grid">{iotSolutions.map((item, i) => <article key={item.id} className="dev-iot-card">
      <div className="dev-iot-card__art"><span>0{i + 1} / {item.metric}</span><DevelopmentDiagram kind={item.id}/></div>
      <h3>{item.name}</h3><p>{item.copy}</p>
    </article>)}</div>
    <p className="tech-note">Illustrated system concepts, not photographs or screenshots of installations.</p>
    <Link href="/contact#enquiries" className="tech-link">Discuss an industrial IoT solution <ArrowUpRight size={22} aria-hidden="true"/></Link>
  </section>;
}
