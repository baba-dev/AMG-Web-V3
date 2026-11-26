"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useFlightContext } from "./flight-runtime";

const InkField = dynamic(() => import("./ink-field"), { ssr: false });

/** Mounts the WebGL ink only in fly mode on devices with a fine pointer; everything else keeps the static SVG calligraphy. */
export function InkFieldLoader() {
  const { mode } = useFlightContext();
  const [fine, setFine] = useState(false);
  useEffect(() => { setFine(window.matchMedia("(pointer:fine)").matches); }, []);
  return mode === "fly" && fine ? <InkField/> : null;
}
