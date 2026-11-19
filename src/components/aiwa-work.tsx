"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MoveRight } from "lucide-react";
import { workProjects, type FeaturedWorkProject } from "@/lib/work/projects";
import "./aiwa-work.css";

function WorkCard({ project, index }: { project: FeaturedWorkProject; index: number }) {
  return (
    <article className={"aiwa-work__slot aiwa-work__slot--" + project.slug}
      data-work-card={project.slug} data-work-index={index}>
      <a href={project.href} className="aiwa-work__card"
        aria-label={project.client + " — " + project.title + "; view documented Aiwa work"}>
        <span className="aiwa-work__media">
          <Image src={project.artwork} width={960} height={740} alt={project.alt}
            unoptimized loading="lazy" draggable={false}/>
          <span className="aiwa-work__media-marker" aria-hidden="true">
            {String(index + 1).padStart(2, "0")} / AIWA
          </span>
          <span className="aiwa-work__media-open" aria-hidden="true"><ArrowUpRight size={27}/></span>
        </span>
        <span className="aiwa-work__caption">
          <strong>{project.client}</strong>
          <span>{project.title}</span>
        </span>
      </a>
    </article>
  );
}

export function AiwaWorkShowcase() {
  return (
    <section className="aiwa-work" id="work" aria-labelledby="aiwa-work-heading">
      <div className="aiwa-work__stage">
        <div className="aiwa-work__scene">
          <div className="aiwa-work__header">
            <span className="aiwa-work__eyebrow">WORK</span>
            <h2 className="aiwa-work__headline" id="aiwa-work-heading">
              <span>SELECTED</span><span>CAMPAIGNS</span>
            </h2>
          </div>
          <div className="aiwa-work__cards">
            {workProjects.map((project, index) =>
              <WorkCard key={project.slug} project={project} index={index} />)}
          </div>
          <Link className="aiwa-work__cta" href="/work">
            <span>VIEW ALL WORK</span><MoveRight size={23} strokeWidth={2} aria-hidden="true"/>
          </Link>
        </div>
      </div>
    </section>
  );
}
