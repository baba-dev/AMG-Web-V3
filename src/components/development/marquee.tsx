"use client";
import { useEffect, useRef } from "react";

/** Project-name ticker. Paused until visible; static under reduced motion (CSS). The second copy is hidden from assistive tech. */
export function Marquee({ items }: { items: readonly string[] }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => node.setAttribute("data-running", String(entry.isIntersecting && !document.hidden)), { threshold: 0 });
    const onVisibility = () => { if (document.hidden) node.setAttribute("data-running", "false"); };
    observer.observe(node);
    document.addEventListener("visibilitychange", onVisibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);
  return <div ref={root} className="tech-marquee" data-running="false" role="group" aria-label="Projects we have built">
    <ul className="tech-marquee__track">
      {[0, 1].map(copy => items.map(name => <li key={copy + name} aria-hidden={copy === 1 ? "true" : undefined}>{name}<i aria-hidden="true">✦</i></li>))}
    </ul>
  </div>;
}
