"use client";
import { useLayoutEffect } from "react";

/** Arms the server-rendered word and writes it with a pen the first time it scrolls into view. Skipped under reduced motion. */
export function InkWriter({ targetId }: { targetId: string }) {
  useLayoutEffect(() => {
    const svg = document.getElementById(targetId);
    if (!svg) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    const pens = Array.from(svg.querySelectorAll<SVGPathElement>("[data-pen]"));
    const dots = Array.from(svg.querySelectorAll<SVGPathElement>("[data-dot]"));
    if (!pens.length) return;
    const lengths = pens.map(p => p.getTotalLength());
    pens.forEach((p, i) => p.style.setProperty("--len", String(Math.ceil(lengths[i]) + 2)));
    svg.dataset.state = "armed";
    const total = lengths.reduce((a, b) => a + b, 0) || 1;
    const duration = Math.min(2400, Math.max(1600, total * 1.4));
    let played = false;
    const timers: number[] = [];
    const play = () => {
      if (played) return;
      played = true;
      let at = 0;
      pens.forEach((p, i) => {
        const part = (lengths[i] / total) * duration;
        p.animate([{ strokeDashoffset: Math.ceil(lengths[i]) + 2 }, { strokeDashoffset: 0 }], { duration: part * 1.15, delay: at, easing: "linear", fill: "forwards" });
        at += part * 0.92;
      });
      dots.forEach((d, i) => d.animate([{ opacity: 0, transform: "scale(.4)" }, { opacity: 1, transform: "scale(1)" }], { duration: 280, delay: at + i * 90, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "forwards" }));
      timers.push(window.setTimeout(() => { svg.dataset.state = "done"; }, at + 900));
    };
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { play(); observer.disconnect(); } }, { threshold: 0.25 });
    observer.observe(svg);
    return () => { observer.disconnect(); timers.forEach(clearTimeout); svg.dataset.state = "done"; svg.getAnimations({ subtree: true }).forEach(a => a.cancel()); };
  }, [targetId]);
  return null;
}
