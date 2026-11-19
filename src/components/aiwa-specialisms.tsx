"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import "./aiwa-specialisms.css";

const categories = [
  "Global",
  "Consumer",
  "Corporate",
  "Sports",
  "Social",
  "Studio",
  "TECH",
] as const;

export function AiwaSpecialisms() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rows = Array.from(section.querySelectorAll<HTMLElement>(".aiwa-specialisms__row"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Each row folds out from its upper edge as it enters the viewport.
    // Unlike a timed one-shot animation, re-entering while scrolling
    // upward unfolds the list again in reverse travel order.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          const row = target as HTMLElement;
          row.dataset.visible = String(isIntersecting || reducedMotion.matches);
        });
      },
      { rootMargin: "0px 0px -7% 0px", threshold: 0.08 },
    );

    rows.forEach((row) => {
      if (reducedMotion.matches) row.dataset.visible = "true";
      observer.observe(row);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="aiwa-specialisms" id="specialisms"
      aria-labelledby="aiwa-specialisms-title">
      <div className="aiwa-specialisms__top">
        <h2 id="aiwa-specialisms-title">SPECIALISMS</h2>
        <span>WHAT WE DO <span aria-hidden="true">↘</span></span>
      </div>

      <ol className="aiwa-specialisms__list">
        {categories.map((name, index) => (
          <li className="aiwa-specialisms__item" key={name}>
            <a className="aiwa-specialisms__row" href="#" data-visible="false"
              aria-label={name + " – coming soon"}>
              <span className="aiwa-specialisms__number">0{index + 1}</span>
              <span className="aiwa-specialisms__name">{name}</span>
              <ArrowUpRight className="aiwa-specialisms__arrow" strokeWidth={1.6}
                aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>

      <div className="aiwa-specialisms__footer">
        <p>
          No ordinary ideas. No ordinary results. Everything we make is built
          to move culture, shape conversation and make brands impossible to ignore.
        </p>
        <a href="#about" className="aiwa-specialisms__why">
          THIS IS WHY <ArrowUpRight size={20} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
