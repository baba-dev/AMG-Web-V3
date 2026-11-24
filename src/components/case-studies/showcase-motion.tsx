"use client";
import { useEffect } from "react";
export function ShowcaseMotion() {
  useEffect(()=>{
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(entries=>{
      for (const entry of entries) if(entry.isIntersecting) {
        (entry.target as HTMLElement).dataset.entered="true";
        observer.unobserve(entry.target);
      }
    },{threshold:.12});
    document.querySelectorAll("[data-showcase-chapter]").forEach(chapter=>observer.observe(chapter));
    return ()=>observer.disconnect();
  },[]);
  return null;
}
