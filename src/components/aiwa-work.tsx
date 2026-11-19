"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MoveRight } from "lucide-react";
import { workProjects, type WorkProject } from "@/lib/work/projects";
import "./aiwa-work.css";

function WorkCard({ project, index }: { project: WorkProject; index: number }) {
  const previewRef = useRef<HTMLVideoElement>(null);
  const playPreview = () => {
    if (typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    void previewRef.current?.play().catch(() => {
      // Muted video previews are optional; the static poster always remains.
    });
  };
  const stopPreview = () => {
    const video = previewRef.current;
    if (video) { video.pause(); video.currentTime = 0; }
  };

  return (
    <article className={"aiwa-work__slot aiwa-work__slot--" + project.slug}
      data-work-card={project.slug} data-work-index={index}>
      <a href={project.href} className="aiwa-work__card"
        target="_blank" rel="noopener noreferrer"
        onMouseEnter={playPreview} onMouseLeave={stopPreview}
        onFocus={playPreview} onBlur={stopPreview}
        aria-label={project.client + " — " + project.title + "; open documented Aiwa work in a new tab"}>
        <span className="aiwa-work__media">
          <Image src={project.artwork} width={960} height={740} alt={project.alt}
            unoptimized loading="lazy" draggable={false}/>
          {project.video && (
            <video ref={previewRef} className="aiwa-work__video" src={project.video.src}
              poster={project.video.poster} muted playsInline loop preload="none"
              aria-hidden="true" tabIndex={-1}/>
          )}
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

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const smoothStep = (n: number) => {
  const t = clamp01(n);
  return t * t * (3 - 2 * t);
};

/** Individually tuned traverse windows and horizontal depth drift. */
const desktopTracks = [
  { start: .055, end: .44, drift: -8, rotation: -6 },
  { start: .15, end: .53, drift: 9, rotation: 5 },
  { start: .24, end: .64, drift: -7, rotation: 4 },
  { start: .35, end: .74, drift: 10, rotation: -4 },
  { start: .46, end: .87, drift: -10, rotation: 6 },
  { start: .59, end: .99, drift: 8, rotation: -5 },
] as const;

export function AiwaWorkShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const scene = sceneRef.current;
    if (!section || !stage || !scene) return;

    const desktop = window.matchMedia("(min-width: 768px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const slots = Array.from(scene.querySelectorAll<HTMLElement>(".aiwa-work__slot"));
    let frame = 0;

    const revealObserver = new IntersectionObserver((entries) => {
      if (desktop.matches || reduced.matches) return;
      for (const entry of entries) {
        (entry.target as HTMLElement).dataset.entered = String(entry.isIntersecting);
      }
    }, { threshold: .10, rootMargin: "0px 0px -6% 0px" });
    slots.forEach((slot) => revealObserver.observe(slot));

    const reset = () => {
      delete section.dataset.motion;
      section.style.removeProperty("--work-progress");
      slots.forEach((slot) => {
        slot.inert = false;
        slot.removeAttribute("data-active");
        slot.removeAttribute("data-entered");
        slot.style.removeProperty("transform");
        slot.style.removeProperty("opacity");
      });
    };

    const paint = () => {
      frame = 0;
      if (reduced.matches) {
        reset();
        return;
      }
      if (!desktop.matches) return;

      section.dataset.motion = "desktop";
      const sceneHeight = scene.clientHeight;
      const distance = Math.max(1, stage.offsetHeight - sceneHeight);
      const progress = clamp01(-stage.getBoundingClientRect().top / distance);
      section.style.setProperty("--work-progress", progress.toFixed(4));

      const viewportW = scene.clientWidth;
      slots.forEach((slot, index) => {
        const track = desktopTracks[index];
        if (!track) return;

        const phase = clamp01((progress - track.start) / (track.end - track.start));
        const entrance = smoothStep((progress - track.start) / .075);
        const departure = smoothStep((track.end - progress) / .082);
        const alpha = entrance * departure;
        const travel = smoothStep(phase);
        const offsetY = (0.96 - 2.26 * travel) * sceneHeight;
        const offsetX = Math.sin(phase * Math.PI) * track.drift * .01 * viewportW;
        const scale = .92 + .11 * Math.sin(phase * Math.PI);
        const rotation = track.rotation * (1 - 2 * phase);

        slot.style.transform =
          "translate(-50%,-50%) translate3d(" + offsetX.toFixed(2) + "px," +
          offsetY.toFixed(2) + "px,0) rotate(" + rotation.toFixed(2) +
          "deg) scale(" + scale.toFixed(3) + ")";
        slot.style.opacity = alpha.toFixed(3);

        const active = alpha > .35;
        slot.inert = !active;
        slot.dataset.active = String(active);
      });
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };
    const configure = () => {
      if (reduced.matches) {
        reset();
      } else if (desktop.matches) {
        section.dataset.motion = "desktop";
        slots.forEach(slot => slot.removeAttribute("data-entered"));
      } else {
        section.dataset.motion = "mobile";
        section.style.removeProperty("--work-progress");
        slots.forEach((slot) => {
          slot.inert = false;
          slot.style.removeProperty("transform");
          slot.style.removeProperty("opacity");
          slot.removeAttribute("data-active");
          // Do not erase data-entered here: the observer controls it.
        });
      }
      schedule();
    };

    configure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", configure);
    desktop.addEventListener("change", configure);
    reduced.addEventListener("change", configure);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", configure);
      desktop.removeEventListener("change", configure);
      reduced.removeEventListener("change", configure);
      if (frame) window.cancelAnimationFrame(frame);
      revealObserver.disconnect();
      reset();
    };
  }, []);

  return (
    <section ref={sectionRef} className="aiwa-work" id="work" aria-labelledby="aiwa-work-heading">
      <div ref={stageRef} className="aiwa-work__stage">
        <div ref={sceneRef} className="aiwa-work__scene">
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
