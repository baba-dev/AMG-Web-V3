"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import "./aiwa-specialisms.css";

type Specialism = {
  name: string;
  side: "left" | "right";
  tint: string;
  image?: string;
};

const categories: Specialism[] = [
  { name: "Creatives", side: "right", tint: "studio", image: "/media/specialisms/studio.svg" },
  { name: "Marketing", side: "left", tint: "social", image: "/media/specialisms/social.svg" },
  { name: "Development", side: "right", tint: "tech", image: "/media/specialisms/tech.svg" },
  { name: "IT Support", side: "left", tint: "global", image: "/media/specialisms/global.svg" },
  { name: "Branding", side: "right", tint: "consumer", image: "/media/specialisms/consumer.svg" },
  { name: "Events", side: "left", tint: "sports", image: "/media/specialisms/sports.svg" },
];

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const smoother = (x: number) => {
  const t = clamp(x);
  return t * t * (3 - 2 * t);
};

function VisualTile({ category, index }: {category: Specialism; index: number}) {
  return (
    <span
      className={"aiwa-specialisms__visual aiwa-specialisms__visual--" + category.tint}
      aria-hidden="true"
    >
      {category.image ? (
        <img src={category.image} alt="" loading="lazy" decoding="async" />
      ) : (
        <>
          <span className="aiwa-specialisms__visual-shape" />
          <span className="aiwa-specialisms__visual-caption">AIWA / 0{index + 1}</span>
        </>
      )}
    </span>
  );
}

export function AiwaSpecialisms() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollToAbout = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const about = document.getElementById("about");
    if (!about) return;
    event.preventDefault();
    window.history.pushState(null, "", "#about");
    about.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const rows = Array.from(section.querySelectorAll<HTMLAnchorElement>(".aiwa-specialisms__row"));
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let nearViewport = true;

    const render = () => {
      frame = 0;
      if (mediaQuery.matches) {
        rows.forEach((row) => {
          row.style.removeProperty("transform");
          row.style.removeProperty("opacity");
          row.style.removeProperty("filter");
          row.dataset.visible = "true";
        });
        return;
      }

      const viewport = window.innerHeight;
      // Read all row geometry before writing transforms, keeping one layout pass.
      // The row itself rotates. Measure its untransformed LI parent to
      // prevent feedback jitter between scroll position and transformed rect.
      const rects = rows.map(row =>
        (row.parentElement ?? row).getBoundingClientRect());
      rows.forEach((row, index) => {
        const b = rects[index];
        // A category unfolds as its top crosses 88% -> 48% viewport height.
        // The same measured scroll state drives the reverse when scrolling up.
        const p = smoother((viewport * .88 - b.top) / (viewport * .40));
        const closed = 1 - p;
        row.style.transform =
          "perspective(1250px) rotateX(" + (-64 * closed).toFixed(2) +
          "deg) translate3d(0," + (68 * closed).toFixed(2) +
          "px,0) skewX(" + (5 * closed).toFixed(2) + "deg)";
        row.style.opacity = Math.max(.04, p).toFixed(3);
        // Do not animate CSS blur: it forces a heavy paint on every tick.
        row.style.filter = "none";
        row.dataset.visible = String(p > .87);
        row.style.setProperty("--row-reveal", p.toFixed(4));
      });
    };
    const schedule = () => {
      if (!nearViewport || frame) return;
      frame = window.requestAnimationFrame(render);
    };
    const proximity = new IntersectionObserver(([entry]) => {
      nearViewport = entry?.isIntersecting ?? true;
      if (nearViewport) schedule();
    }, { rootMargin: "90% 0px 90% 0px" });
    proximity.observe(section);
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    mediaQuery.addEventListener("change", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      mediaQuery.removeEventListener("change", schedule);
      proximity.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="aiwa-specialisms"
      id="specialisms"
      aria-labelledby="aiwa-specialisms-title"
    >
      <div className="aiwa-specialisms__top">
        <h2 id="aiwa-specialisms-title">SPECIALISMS</h2>
      </div>
      <ol className="aiwa-specialisms__list">
        {categories.map((category, index) => (
          <li className="aiwa-specialisms__item" key={category.name}>
            <a
              className={"aiwa-specialisms__row aiwa-specialisms__row--" + category.tint}
              href="#"
              aria-label={"Explore " + category.name + " specialism"}
              data-visible="false"
            >
              {category.side === "left" && <VisualTile category={category} index={index} />}
              <span className="aiwa-specialisms__name">{category.name}</span>
              {category.side === "right" && <VisualTile category={category} index={index} />}
            </a>
          </li>
        ))}
      </ol>
      <div className="aiwa-specialisms__footer">
        <p>
          No ordinary ideas. No ordinary results. Everything we make is built
          to move culture, shape conversation and make brands impossible to ignore.
        </p>
        <a href="#about" className="aiwa-specialisms__why" onClick={scrollToAbout}>
          THIS IS WHY <ArrowUpRight size={19} strokeWidth={2} aria-hidden="true" />
        </a>
        <a href="#" className="aiwa-specialisms__all">
          EXPLORE ALL SPECIALISMS <ArrowUpRight size={19} strokeWidth={2} aria-hidden="true"/>
        </a>
      </div>
    </section>
  );
}
