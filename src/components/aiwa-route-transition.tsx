"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePathname, useRouter } from "next/navigation";
import { workProjects } from "@/lib/work/projects";
import { motionDestinationLabel, resolveMotionDestination } from "@/lib/aiwa-route-motion";
import "./aiwa-route-transition.css";

type MotionPhase = "covering" | "revealing" | "history";
type Portal = { src: string; x: number; y: number; width: number; height: number };
type MotionScene = {
  phase: MotionPhase;
  label: string;
  kind: "signal" | "portal";
  portal: Portal | null;
};
type PendingRoute = { href: string; pathname: string };

const reduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function captureProjectArtwork(anchor: HTMLAnchorElement): Portal | null {
  const card = anchor.closest<HTMLElement>("[data-work-project], [data-work-card]");
  const frame = card?.querySelector<HTMLElement>(".work-gallery__art, .aiwa-work__media");
  const image = frame?.querySelector<HTMLImageElement>("img");
  if (!frame || !image || !image.complete || !image.naturalWidth) return null;
  const rect = frame.getBoundingClientRect();
  if (rect.width < 24 || rect.height < 24 || rect.bottom < 0 || rect.top > window.innerHeight) return null;
  const src = image.currentSrc || image.src;
  if (!src || !/^https?:\/\/|^\//.test(src)) return null;
  return { src, x: rect.x, y: rect.y, width: rect.width, height: rect.height };
}

/**
 * Lives above App Router children in the persistent root layout. It intercepts
 * eligible real link activations, lets Next navigate once the screen is covered,
 * then reveals the new route. It never blocks same-page links, external links,
 * modified clicks, or reduced-motion navigation.
 */
export function AiwaRouteTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [scene, setScene] = useState<MotionScene | null>(null);
  const busy = useRef(false);
  const pending = useRef<PendingRoute | null>(null);
  const previousPath = useRef(pathname);
  const timers = useRef<Set<number>>(new Set());

  useEffect(() => {
    const root = document.documentElement;
    if (scene) root.dataset.aiwaRoutePhase = scene.phase;
    else delete root.dataset.aiwaRoutePhase;
    return () => { delete root.dataset.aiwaRoutePhase; };
  }, [scene]);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    const incoming = pending.current;
    const reduced = reduceMotion();
    const clear = (delay: number) => {
      const id = window.setTimeout(() => {
        timers.current.delete(id);
        busy.current = false;
        pending.current = null;
        setScene(null);
      }, delay);
      timers.current.add(id);
    };

    if (incoming) {
      // Route arrived: never reveal behind a potentially unrendered destination.
      pending.current = null;
      setScene((current) => current ? { ...current, phase: "revealing" } : null);
      clear(reduced ? 0 : 650);
    } else if (!reduced) {
      // Back/Forward navigation cannot be delayed; make arrival graceful.
      busy.current = false;
      setScene({ phase: "history", label: motionDestinationLabel(pathname, workProjects), kind: "signal", portal: null });
      clear(470);
    }
  }, [pathname]);

  useEffect(() => {
    const schedule = (callback: () => void, delay: number) => {
      const id = window.setTimeout(() => { timers.current.delete(id); callback(); }, delay);
      timers.current.add(id);
    };
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 ||
          event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const element = event.target;
      if (!(element instanceof Element)) return;
      const anchor = element.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.hasAttribute("download") ||
          anchor.closest("[data-aiwa-no-transition]") ||
          (anchor.target && anchor.target !== "_self") ||
          anchor.relList.contains("external")) return;
      const target = resolveMotionDestination(anchor.href, window.location.href);
      if (!target) return;
      // Keep the browser's normal anchor routing in reduced-motion mode.
      if (reduceMotion()) return;
      event.preventDefault();
      if (busy.current) return;
      busy.current = true;
      pending.current = target;
      const portal = captureProjectArtwork(anchor);
      const label = anchor.dataset.aiwaDestination || motionDestinationLabel(target.pathname, workProjects);
      setScene({ phase: "covering", label, kind: portal ? "portal" : "signal", portal });

      // Next's own prefetch keeps local pages responsive on static Cloudflare export.
      try { router.prefetch(target.href); } catch { /* navigation proceeds without prefetch */ }
      schedule(() => {
        if (pending.current !== target) return;
        try {
          router.push(target.href, { scroll: true });
        } catch {
          window.location.assign(target.href);
        }
        // A broken route must never strand a visitor under an opaque overlay.
        schedule(() => {
          if (pending.current === target) window.location.assign(target.href);
        }, 4300);
      }, portal ? 510 : 490);
    };
    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      for (const id of timers.current) window.clearTimeout(id);
      timers.current.clear();
      delete document.documentElement.dataset.aiwaRoutePhase;
    };
  }, [router]);

  if (!scene) return null;
  const vars: CSSProperties | undefined = scene.portal ? {
    "--portal-x": scene.portal.x + "px",
    "--portal-y": scene.portal.y + "px",
    "--portal-scale-x": String(scene.portal.width / Math.max(1, typeof window === "undefined" ? 1 : window.innerWidth)),
    "--portal-scale-y": String(scene.portal.height / Math.max(1, typeof window === "undefined" ? 1 : window.innerHeight)),
  } as CSSProperties : undefined;

  return (
    <>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {scene.phase === "covering" ? "Opening " + scene.label : ""}
      </span>
      <div className="aiwa-route-stage" data-phase={scene.phase} data-kind={scene.kind}
        style={vars} aria-hidden="true">
        {scene.portal && <div className="aiwa-route-stage__portal">
          {/* A clone ensures the clicked artwork stays continuous across route swaps. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={scene.portal.src} alt="" decoding="async" />
          <div className="aiwa-route-stage__portal-shade" />
        </div>}
        <div className="aiwa-route-stage__panel aiwa-route-stage__panel--first" />
        <div className="aiwa-route-stage__panel aiwa-route-stage__panel--second" />
        <div className="aiwa-route-stage__panel aiwa-route-stage__panel--third" />
        <div className="aiwa-route-stage__frame">
          <div className="aiwa-route-stage__top">
            <span>AIWA / THE SIGNAL</span><span>CREATIVE IN MOTION</span>
          </div>
          <div className="aiwa-route-stage__headline">
            <span className="aiwa-route-stage__wordmark">AIWA<span>.</span></span>
            <span className="aiwa-route-stage__line" />
            <strong className="aiwa-route-stage__destination">{scene.label}</strong>
          </div>
          <div className="aiwa-route-stage__bottom">
            <span>IDEAS THAT MAKE NOISE.</span><span>01 / 01</span>
          </div>
        </div>
      </div>
    </>
  );
}
