/* eslint-disable @next/next/no-img-element -- static export: owner-supplied SVGs are served as-is, there is no image optimizer. */
import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { developmentServices } from "@/lib/development";
import { getTechnologyProject } from "@/lib/work/technology";
import { TechPair } from "@/components/technology/tech-media";
import { InkCalligraphy } from "./ink-calligraphy";
import { DevelopmentDiagram } from "./development-art";
import "@/app/work/technology/technology.css";
import "./service-scenes.css";

/** Owner-supplied motion illustrations that replace a scene's diagram. Light and dark variants swap with the theme. */
const sceneArt: Partial<Record<string, { light: string; dark: string; alt: string }>> = {
  iot: {
    light: "/media/development/aiwa-fluid-intelligence.svg",
    dark: "/media/development/aiwa-fluid-intelligence-dark.svg",
    alt: "Animated conceptual illustration of fluid flowing through an industrial sensor, becoming electronic pulses and a web monitoring dashboard. All readings are illustrative.",
  },
};

/** Six full-width scenes, one per Development service. Plain sections (no accordion) so every service is readable and linkable. */
export function ServiceScenes() {
  return <section id="dev-services" className="tech-services spec-pad" data-tech-section="services" aria-labelledby="dev-services-title">
    <header className="tech-services__head">
      <InkCalligraphy word="innovation" variant="header"/>
      <p className="tech-services__kicker">02 / OUR SPECIALISMS</p>
      <h2 id="dev-services-title">SIX WAYS TO<br/><em>MOVE FORWARD.</em></h2>
      <p>One technology team. Six ways to make business work better.</p>
    </header>
    <div className="tech-scenes">
      {developmentServices.map((service, i) => {
        const project = service.project ? getTechnologyProject(service.project) : undefined;
        const toIot = service.id === "iot";
        const art = sceneArt[service.id];
        return <section key={service.id} id={"dev-" + service.id} className={"tech-scene" + (art ? " tech-scene--feature" : "")} data-scene={service.id}
          style={{ "--scene-accent": service.accent } as CSSProperties} aria-labelledby={"dev-" + service.id + "-title"}>
          <span className="tech-scene__num" aria-hidden="true">0{i + 1}</span>
          <div className="tech-scene__text">
            <p className="tech-scene__index">0{i + 1} / 06</p>
            <h3 id={"dev-" + service.id + "-title"}>{service.name}</h3>
            <p className="tech-scene__lead">{service.lead}</p>
            <p>{service.copy}</p>
            <ul className="tech-scene__chips">{service.deliverables.map(d => <li key={d}>{d}</li>)}</ul>
            <Link className="tech-scene__cta" href={toIot ? "#dev-connected" : "/contact#enquiries"}>
              {toIot ? "Explore connected hardware" : "Discuss your project"} <ArrowUpRight size={20} aria-hidden="true"/>
            </Link>
          </div>
          <div className="tech-scene__visual">
            <span className="tech-scene__glow" aria-hidden="true"/>
            {art
              ? <figure className="tech-scene__art">
                  <img className="tech-scene__art-img tech-scene__art-dark" data-theme="dark" src={art.dark} alt={art.alt} width={1600} height={900} loading="lazy" decoding="async"/>
                  <img className="tech-scene__art-img tech-scene__art-light" data-theme="light" src={art.light} alt={art.alt} width={1600} height={900} loading="lazy" decoding="async"/>
                  <figcaption>ILLUSTRATED SYSTEM CONCEPT / SAMPLE DATA, NOT A CLIENT INSTALLATION</figcaption>
                </figure>
              : project
              ? <Link href={"/work/technology/" + project.slug} aria-label={"Explore " + project.name} className="tech-scene__project"><TechPair project={project} compact/></Link>
              : <div className="tech-scene__diagram"><DevelopmentDiagram kind={service.id}/></div>}
          </div>
        </section>;
      })}
    </div>
  </section>;
}
