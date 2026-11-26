"use client";
import { useEffect, useRef } from "react";

/** Pauses the signals while the hero is offscreen or the tab is hidden, so nothing animates unseen. */
export function PcbRunner() {
  const marker = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const wrap = marker.current?.closest<HTMLElement>(".tech-hero__pcb");
    const hero = marker.current?.closest<HTMLElement>("section");
    if (!wrap || !hero) return;
    let visible = true;
    const apply = () => wrap.setAttribute("data-running", String(visible && !document.hidden));
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; apply(); }, { threshold: 0 });
    io.observe(hero);
    document.addEventListener("visibilitychange", apply);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", apply); };
  }, []);
  return <span ref={marker} hidden/>;
}
