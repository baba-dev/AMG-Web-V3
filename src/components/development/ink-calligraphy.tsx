"use client";
import { useLayoutEffect, useRef } from "react";
import { calligraphy } from "@/lib/calligraphy-data";
import "./ink.css";

/**
 * Decorative Thuluth word. Server-rendered fully drawn (no-JS and reduced motion see the finished word); on the client it is
 * "armed" (hidden) and then written by a pen-stroke mask the first time it scrolls into view. Renders nothing if the word is not supplied yet.
 */
export function InkCalligraphy({ word, variant, className = "" }: { word: string; variant: "background" | "header"; className?: string }) {
  const data = calligraphy[word];
  const ref = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const svg = ref.current;
    if (!svg || !data || !data.pen.length) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    const pens = Array.from(svg.querySelectorAll<SVGPathElement>("[data-pen]"));
    const dots = Array.from(svg.querySelectorAll<SVGPathElement>("[data-dot]"));
    const lengths = pens.map(p => p.getTotalLength());
    pens.forEach((p, i) => p.style.setProperty("--len", String(Math.ceil(lengths[i]) + 2)));
    svg.dataset.state = "armed";
    const total = lengths.reduce((a, b) => a + b, 0) || 1;
    const duration = Math.min(2400, Math.max(1600, total * 1.4));
    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      let at = 0;
      pens.forEach((p, i) => {
        const part = (lengths[i] / total) * duration;
        p.animate([{ strokeDashoffset: Math.ceil(lengths[i]) + 2 }, { strokeDashoffset: 0 }], { duration: part * 1.15, delay: at, easing: "cubic-bezier(.65,0,.35,1)", fill: "forwards" });
        at += part * 0.9;
      });
      dots.forEach((d, i) => d.animate([{ opacity: 0, transform: "scale(.4)" }, { opacity: 1, transform: "scale(1)" }], { duration: 280, delay: at + i * 90, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "forwards" }));
      window.setTimeout(() => { svg.dataset.state = "done"; }, at + 900);
    };
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { play(); observer.disconnect(); } }, { threshold: 0.25 });
    observer.observe(svg);
    return () => { observer.disconnect(); svg.dataset.state = "done"; svg.getAnimations({ subtree: true }).forEach(a => a.cancel()); };
  }, [data]);

  if (!data) return null;
  const maskId = `ink-${word}-${variant}`;
  const masked = data.pen.length > 0;
  return <svg ref={ref} className={`tech-ink tech-ink--${variant} ${className}`.trim()} viewBox={data.viewBox} aria-hidden="true" focusable="false" data-ink={word}>
    {masked && <defs><mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="400">
      {data.pen.map((p, i) => <path key={i} data-pen d={p.d} fill="none" stroke="#fff" strokeWidth={p.width} strokeLinecap="round" strokeLinejoin="round"/>)}
    </mask></defs>}
    <g mask={masked ? `url(#${maskId})` : undefined}><path d={data.outline} fill="currentColor"/></g>
    <g>{data.dots.map((d, i) => <path key={i} data-dot d={d} fill="currentColor" style={{ transformBox: "fill-box", transformOrigin: "center" }}/>)}</g>
  </svg>;
}
