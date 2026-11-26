"use client";
import { useRef, type ReactNode } from "react";

/** CTA that leans toward a fine pointer. No effect on touch or with reduced motion. */
export function MagneticLink({ href, children }: { href: string; children: ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = ref.current; if (!node) return;
    const r = node.getBoundingClientRect();
    node.style.setProperty("--mx", ((event.clientX - (r.left + r.width / 2)) * 0.18).toFixed(1) + "px");
    node.style.setProperty("--my", ((event.clientY - (r.top + r.height / 2)) * 0.28).toFixed(1) + "px");
  };
  const reset = () => { ref.current?.style.removeProperty("--mx"); ref.current?.style.removeProperty("--my"); };
  return <a ref={ref} href={href} className="tech-finale__cta" onPointerMove={move} onPointerLeave={reset}>{children}</a>;
}
