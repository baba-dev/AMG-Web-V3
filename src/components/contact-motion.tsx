"use client";

import { useEffect } from "react";

/**
 * Contact page motion director.
 * CSS owns each animation's easing/timing; this component only synchronizes
 * entrance, section visibility and photo depth. No scroll hijacking, timers,
 * third-party animation runtime or constantly running React state.
 */
export function ContactMotion() {
  useEffect(() => {
    const page = document.querySelector<HTMLElement>("[data-contact-page]");
    const wall = page?.querySelector<HTMLElement>(".contact-wall");
    const office = page?.querySelector<HTMLElement>(".contact-office__image");
    if (!page || !wall || !office) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 767px)");
    const chapters = Array.from(page.querySelectorAll<HTMLElement>("[data-contact-reveal]"));
    const observers: IntersectionObserver[] = [];
    let frame = 0;
    let wallVisible = true;

    const updateWall = () => {
      wall.dataset.sceneActive = String(
        !reduced.matches && wallVisible && document.visibilityState === "visible"
      );
    };

    const paintDepth = () => {
      frame = 0;
      if (reduced.matches || document.visibilityState !== "visible") return;
      const rect = office.getBoundingClientRect();
      const height = window.innerHeight;
      if (rect.bottom < 0 || rect.top > height) return;
      const progress = Math.min(1, Math.max(0, (height - rect.top) / (height + rect.height)));
      // Symmetric, reversible vertical drift; no hardcoded pixel scroll position.
      const drift = (progress - 0.5) * (narrow.matches ? 18 : 42);
      office.style.setProperty("--contact-photo-drift", drift.toFixed(2) + "px");
    };

    const onScroll = () => {
      if (frame || reduced.matches) return;
      frame = window.requestAnimationFrame(paintDepth);
    };

    const chapterObserver = "IntersectionObserver" in window
      ? new IntersectionObserver(entries => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            (entry.target as HTMLElement).dataset.entered = "true";
            chapterObserver?.unobserve(entry.target);
          }
        }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" })
      : null;
    if (chapterObserver) {
      chapters.forEach(node => chapterObserver.observe(node));
      observers.push(chapterObserver);
    }

    const wallObserver = "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => {
          wallVisible = Boolean(entry?.isIntersecting);
          updateWall();
        }, { threshold: 0.01 })
      : null;
    if (wallObserver) {
      wallObserver.observe(wall);
      observers.push(wallObserver);
    }

    const configure = () => {
      page.dataset.contactMotion = reduced.matches ? "reduced" : "ready";
      if (reduced.matches) {
        chapters.forEach(node => { node.dataset.entered = "true"; });
        office.style.removeProperty("--contact-photo-drift");
      } else {
        onScroll();
      }
      updateWall();
    };

    configure();
    document.addEventListener("visibilitychange", updateWall);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reduced.addEventListener("change", configure);
    narrow.addEventListener("change", onScroll);

    return () => {
      observers.forEach(observer => observer.disconnect());
      document.removeEventListener("visibilitychange", updateWall);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduced.removeEventListener("change", configure);
      narrow.removeEventListener("change", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      delete page.dataset.contactMotion;
      delete wall.dataset.sceneActive;
      office.style.removeProperty("--contact-photo-drift");
    };
  }, []);

  return null;
}
