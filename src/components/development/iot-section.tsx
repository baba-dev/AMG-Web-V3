import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { iotSolutions } from "@/lib/development";
import { InkCalligraphy } from "./ink-calligraphy";
import { DevelopmentDiagram } from "./development-art";
import { IotStage } from "./iot-stage";
import { SignalLines } from "./signal-lines";
import "./iot-section.css";

const accents = ["var(--t-cyan)", "var(--t-violet)", "var(--t-amber)", "var(--t-lime)"] as const;

/** Industrial IoT: a short strip of four side-by-side cards that slide sideways as you scroll (swipeable row on small screens). */
export function IotSection() {
  return <section id="dev-connected" className="tech-iot dev-iot spec-pad" data-tech-section="iot" aria-labelledby="dev-iot-heading">
    <SignalLines/>
    <div className="tech-iot__head">
      <div>
        <InkCalligraphy word="engineering" variant="header"/>
        <p className="tech-chapter__kicker">03 / INDUSTRIAL IoT</p>
        <h2 id="dev-iot-heading">THE PHYSICAL. THE DIGITAL. <em>CONNECTED.</em></h2>
      </div>
      <p>We create web-powered hardware and connected monitoring systems for industrial and commercial environments. From sensing to control, bring physical operations into one digital picture.</p>
    </div>
    <IotStage ghost="MEASURE ✦ CONNECT ✦ DETECT ✦ RESPOND ✦ MEASURE ✦ CONNECT ✦ DETECT ✦ RESPOND ✦">
      {iotSolutions.map((item, i) => <article key={item.id} className="dev-iot-card" style={{ "--card-accent": accents[i] } as React.CSSProperties}>
        <div className="dev-iot-card__art"><span>0{i + 1} / {item.metric}</span><DevelopmentDiagram kind={item.id}/></div>
        <p className="tech-iot-card__hook">{item.hook}</p>
        <h3>{item.name}</h3>
        <p className="tech-iot-card__copy">{item.copy}</p>
      </article>)}
    </IotStage>
    <div className="tech-iot__foot">
      <Link href="/contact#enquiries" className="tech-link">Discuss an industrial IoT solution <ArrowUpRight size={22} aria-hidden="true"/></Link>
    </div>
  </section>;
}
