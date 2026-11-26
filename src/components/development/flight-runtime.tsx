"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type Lenis from "lenis";
import { useFlightMode, type FlightMode } from "./use-flight-mode";

type FlightContextValue = { mode: FlightMode; lenis: Lenis | null };
const FlightContext = createContext<FlightContextValue>({ mode: "static", lenis: null });
export function useFlightContext() { return useContext(FlightContext); }

type ScrollTriggerModule = typeof import("gsap/ScrollTrigger").ScrollTrigger;
let activeTrigger: ScrollTriggerModule | null = null;
let activeLenis: Lenis | null = null;

/** Owns the Lenis + ScrollTrigger lifecycle for this route. Flight code is imported only in "fly" mode. */
export function FlightRuntime({ children }: { children: ReactNode }) {
  const mode = useFlightMode();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (new URLSearchParams(location.search).has("flightdebug")) {
      (window as unknown as { __techFlightDebug: unknown }).__techFlightDebug = {
        triggers: () => activeTrigger?.getAll().length ?? 0,
        lenis: () => activeLenis !== null,
      };
    }
  }, []);

  useEffect(() => {
    if (mode !== "fly") return;
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      const [{ gsap }, { ScrollTrigger }, { default: LenisCtor }] = await Promise.all([
        import("gsap"), import("gsap/ScrollTrigger"), import("lenis"),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const instance = new LenisCtor({ autoRaf: false });
      const onTick = (time: number) => instance.raf(time * 1000);
      instance.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);
      activeTrigger = ScrollTrigger;
      activeLenis = instance;
      setLenis(instance);
      cleanup = () => {
        gsap.ticker.remove(onTick);
        instance.destroy();
        ScrollTrigger.getAll().forEach(t => t.kill());
        activeLenis = null;
        setLenis(null);
      };
    })();
    return () => { disposed = true; cleanup(); };
  }, [mode]);

  return <FlightContext.Provider value={{ mode, lenis }}><div className="tech-flight" data-flight-mode={mode}>{children}</div></FlightContext.Provider>;
}
