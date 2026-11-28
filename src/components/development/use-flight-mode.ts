"use client";
import { useSyncExternalStore } from "react";

export type FlightMode = "fly" | "static";
const WIDE = "(min-width:900px)";
const MOTION = "(prefers-reduced-motion: no-preference)";

function subscribe(onChange: () => void) {
  const queries = [window.matchMedia(WIDE), window.matchMedia(MOTION)];
  queries.forEach(q => q.addEventListener("change", onChange));
  return () => queries.forEach(q => q.removeEventListener("change", onChange));
}
function snapshot(): FlightMode {
  return window.matchMedia(WIDE).matches && window.matchMedia(MOTION).matches ? "fly" : "static";
}
/** SSR and the first client render are always "static"; upgrades after hydration and follows both media queries live. */
export function useFlightMode(): FlightMode {
  return useSyncExternalStore(subscribe, snapshot, () => "static");
}
