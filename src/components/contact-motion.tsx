"use client";

import { useEffect } from "react";

/**
 * Contact page motion director.
 * CSS owns each animation's easing/timing; this component only synchronizes
 * entrance, section visibility and hero depth. No scroll hijacking, timers,
 * third-party animation runtime or constantly running React state.
 */
export function ContactMotion() {
  useEffect(() => {
    const page = document.querySelector<HTMLElement>("[data-contact-page]");
    const wall = page?.querySelector<HTMLElement>("[data-contact-hero]");
    if (!page || !wall) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const chapters = Array.from(page.querySelectorAll<HTMLElement>("[data-contact-reveal]"));
    const observers: IntersectionObserver[] = [];
    let frame = 0;
    let wallVisible = true;
    let introSettled = false;
    const settleIntro = () => { introSettled = true; wall.dataset.intro = "settled"; };

    const updateWall = () => {
      if (!wallVisible || reduced.matches) settleIntro();
      wall.dataset.sceneActive = String(
        !reduced.matches && wallVisible && document.visibilityState === "visible"
      );
    };

    const paintDepth = () => {
      frame = 0;
      if (reduced.matches || document.visibilityState !== "visible") return;
      if (Math.abs(window.scrollY) > 2 && !introSettled) settleIntro();
      const heroRect = wall.getBoundingClientRect();
      const heroProgress = Math.max(0,Math.min(1,-heroRect.top/Math.max(1,heroRect.height)));
      wall.style.setProperty("--signal-scroll",heroProgress.toFixed(4));
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
        wall.style.removeProperty("--signal-scroll");
      } else {
        onScroll();
      }
      updateWall();
    };

    configure();
    if (!reduced.matches && !introSettled && !location.hash && scrollY < 2) wall.dataset.intro = "playing";
    else settleIntro();
    const introTimer = window.setTimeout(settleIntro, 3200);
    const interrupt = () => settleIntro();
    const keyInterrupt = (event: KeyboardEvent) => { if (["Tab","Escape","ArrowDown","ArrowUp","PageDown","PageUp","Home","End"," "].includes(event.key)) settleIntro(); };
    window.addEventListener("keydown",keyInterrupt);
    wall.addEventListener("focusin", interrupt);
    wall.addEventListener("pointerdown", interrupt);
    window.addEventListener("wheel", interrupt, {passive:true});
    window.addEventListener("touchstart", interrupt, {passive:true});
    document.addEventListener("visibilitychange", updateWall);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reduced.addEventListener("change", configure);

    return () => {
      window.clearTimeout(introTimer);
      window.removeEventListener("keydown",keyInterrupt);
      wall.style.removeProperty("--signal-scroll");
      wall.removeEventListener("focusin", interrupt);
      wall.removeEventListener("pointerdown", interrupt);
      window.removeEventListener("wheel", interrupt);
      window.removeEventListener("touchstart", interrupt);
      observers.forEach(observer => observer.disconnect());
      document.removeEventListener("visibilitychange", updateWall);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduced.removeEventListener("change", configure);
      if (frame) window.cancelAnimationFrame(frame);
      delete page.dataset.contactMotion;
      delete wall.dataset.sceneActive;
      delete wall.dataset.intro;
    };
  }, []);

  return null;
}
