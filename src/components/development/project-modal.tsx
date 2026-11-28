"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import { TechPair } from "@/components/technology/tech-media";
import type { TechnologyProject } from "@/lib/work/technology";
import { useFlightContext } from "./flight-runtime";
import "./project-modal.css";

export type ModalRequest = { project: TechnologyProject; opener: HTMLElement; rect: DOMRect };

/** Native <dialog>: focus trap, Esc and inert background come from the platform. Expand animation is transform-only. */
export function ProjectModal({ request, onClose }: { request: ModalRequest | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const { lenis } = useFlightContext();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !request) return;
    dialog.showModal();
    document.documentElement.classList.add("tech-modal-open");
    lenis?.stop();
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    const node = panel.current;
    if (motion && node) {
      const to = node.getBoundingClientRect();
      const dx = request.rect.left + request.rect.width / 2 - (to.left + to.width / 2);
      const dy = request.rect.top + request.rect.height / 2 - (to.top + to.height / 2);
      const s = Math.max(0.2, Math.min(1, request.rect.width / to.width));
      node.animate([{ transform: `translate(${dx}px,${dy}px) scale(${s})`, opacity: 0.2 }, { transform: "none", opacity: 1 }], { duration: 520, easing: "cubic-bezier(.22,1,.36,1)" });
      dialog.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260 });
    }
    return () => {
      if (dialog.open) dialog.close();
      document.documentElement.classList.remove("tech-modal-open");
      lenis?.start();
      request.opener.focus({ preventScroll: true });
    };
  }, [request, lenis]);

  const project = request?.project;
  return <dialog ref={ref} className="tech-modal" data-tech-modal aria-labelledby="tech-modal-title" onCancel={event => { event.preventDefault(); onClose(); }}
    onKeyDown={event => {
      if (event.key !== "Tab") return;
      const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("a[href],button:not([disabled])"));
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    {project && <div ref={panel} className="tech-modal__panel">
      <button type="button" className="tech-modal__close" data-close aria-label="Close project preview" onClick={onClose}><X size={22} aria-hidden="true"/></button>
      <div className="tech-modal__visual"><TechPair project={project} compact/></div>
      <div className="tech-modal__body">
        <p className="tech-modal__meta">{project.sector.toUpperCase()} / {project.category.toUpperCase()}</p>
        <h2 id="tech-modal-title">{project.name}</h2>
        <p className="tech-modal__headline">{project.headline}</p>
        <p>{project.description}</p>
        <p className="tech-modal__detail">{project.detail}</p>
        <div className="tech-modal__links">
          <Link href={"/work/technology/" + project.slug}>VIEW PROJECT <ArrowUpRight size={20} aria-hidden="true"/></Link>
          {project.website && <a href={project.website} target="_blank" rel="noopener noreferrer">VISIT SITE <ArrowUpRight size={20} aria-hidden="true"/></a>}
        </div>
      </div>
    </div>}
  </dialog>;
}
