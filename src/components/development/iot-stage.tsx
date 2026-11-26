"use client";
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { useFlightContext } from "./flight-runtime";

/**
 * The IoT strip. Small screens and reduced motion get a native swipeable, snap-scrolling row. In fly mode the section pins briefly:
 * the cards slide sideways with the scroll while the backdrop words move the opposite way.
 */
const TALL = "(min-height:800px)";
const subscribeTall = (onChange: () => void) => { const q = window.matchMedia(TALL); q.addEventListener("change", onChange); return () => q.removeEventListener("change", onChange); };

export function IotStage({ children, ghost }: { children: ReactNode; ghost: string }) {
  const { mode: flightMode, lenis } = useFlightContext();
  const tall = useSyncExternalStore(subscribeTall, () => window.matchMedia(TALL).matches, () => false);
  const mode = flightMode === "fly" && tall ? "fly" : "static";
  const track = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (mode !== "fly" || !lenis) return;
    let disposed = false;
    let revert = () => {};
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      const section = track.current?.closest<HTMLElement>("section");
      if (disposed || !section || !track.current || !ghostRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const cards = Array.from(track.current.querySelectorAll<HTMLElement>(".dev-iot-card"));
      const headerH = () => document.querySelector("[data-inner-header]")?.getBoundingClientRect().height ?? 84;
      const distance = () => Math.max(0, track.current!.scrollWidth - track.current!.parentElement!.clientWidth);
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section, refreshPriority: 1, start: () => "top top+=" + headerH(), end: () => "+=" + Math.round(distance() * 0.85 + window.innerHeight * 0.25),
            pin: true, scrub: 0.6, invalidateOnRefresh: true,
            onUpdate: self => {
              const active = Math.min(cards.length - 1, Math.round(self.progress * (cards.length - 1)));
              cards.forEach((c, i) => c.toggleAttribute("data-active", i === active));
            },
          },
        });
        tl.to(track.current, { x: () => -distance() }, 0);
        // Reverse scroll: the backdrop travels against the cards.
        tl.fromTo(ghostRef.current, { x: () => -ghostRef.current!.scrollWidth * 0.18 }, { x: () => ghostRef.current!.scrollWidth * 0.1 }, 0);
        tl.fromTo(bar.current, { scaleX: 0 }, { scaleX: 1 }, 0);
        cards[0]?.setAttribute("data-active", "");
      }, section);
      revert = () => ctx.revert();
    })();
    return () => { disposed = true; revert(); };
  }, [mode, lenis]);

  return <div className="tech-iot__stage">
    <div ref={ghostRef} className="tech-iot__ghost" aria-hidden="true">{ghost}</div>
    <div ref={track} className="tech-iot__track" role="region" aria-label="Industrial IoT solutions" tabIndex={mode === "fly" ? undefined : 0}>{children}</div>
    <div className="tech-iot__rail" aria-hidden="true"><span ref={bar}/></div>
  </div>;
}
