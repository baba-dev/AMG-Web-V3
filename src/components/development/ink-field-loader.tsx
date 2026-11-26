"use client";
import { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useFlightContext } from "./flight-runtime";

const InkField = dynamic(() => import("./ink-field"), { ssr: false });
const FINE = "(pointer:fine)";
const subscribe = (onChange: () => void) => { const q = window.matchMedia(FINE); q.addEventListener("change", onChange); return () => q.removeEventListener("change", onChange); };

/** Mounts the WebGL ink only in fly mode on devices with a fine pointer; everything else keeps the static SVG calligraphy. */
export function InkFieldLoader() {
  const { mode } = useFlightContext();
  const fine = useSyncExternalStore(subscribe, () => window.matchMedia(FINE).matches, () => false);
  return mode === "fly" && fine ? <InkField/> : null;
}
