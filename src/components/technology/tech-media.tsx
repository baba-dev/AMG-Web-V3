/* eslint-disable @next/next/no-img-element -- static Cloudflare export: use prebuilt responsive WebP variants, not runtime optimization. */
import type { CSSProperties } from "react";
import { technologyMedia, type TechnologyProject } from "@/lib/work/technology";

export function TechImage({project,device,priority=false,sizes, className, decorative=false}:{
  project:TechnologyProject; device:"desktop"|"mobile"; priority?:boolean; sizes?:string; className?:string; decorative?:boolean;
}) {
  const desktop=device==="desktop";
  const width=desktop?1600:560;
  const small=desktop?800:320;
  return <img className={className} src={technologyMedia(project,device)} srcSet={`${technologyMedia(project,device,true)} ${small}w, ${technologyMedia(project,device)} ${width}w`}
    sizes={sizes??(desktop?"(max-width: 767px) 90vw, 65vw":"(max-width: 767px) 30vw, 18vw")}
    width={width} height={desktop?project.desktopHeight:project.mobileHeight}
    alt={decorative?"":`${project.name} ${desktop?"desktop":"mobile"} website capture`}
    loading={priority?"eager":"lazy"} fetchPriority={priority?"high":undefined} decoding="async" />;
}
export function TechPair({project,priority=false,compact=false}:{project:TechnologyProject;priority?:boolean;compact?:boolean}) {
  return <div className={`tech-pair${compact?" tech-pair--compact":""}`} style={{"--project-accent":project.accent} as CSSProperties}>
    <span className="tech-pair__tag" aria-hidden="true">{project.name.toUpperCase()} / DIGITAL EXPERIENCE</span>
    <div className="tech-pair__screens">
      <div className="tech-pair__desktop"><TechImage project={project} device="desktop" priority={priority} sizes={compact?"(max-width: 767px) 70vw, 37vw":"(max-width: 767px) 70vw, 65vw"}/></div>
      <div className="tech-pair__mobile"><TechImage project={project} device="mobile" sizes={compact?"(max-width: 767px) 26vw, 12vw":"(max-width: 767px) 26vw, 22vw"}/></div>
    </div>
    <span className="tech-pair__tag tech-pair__end" aria-hidden="true">DESKTOP / MOBILE</span>
  </div>;
}
