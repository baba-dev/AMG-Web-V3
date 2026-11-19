"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import "./aiwa-about.css";

const headline = [
  { text: "CREATIVE MEDIA", italic: false },
  { text: "FOR BRANDS", italic: true },
  { text: "THAT REFUSE", italic: false },
  { text: "TO BLEND IN.", italic: true },
] as const;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => {
  const t = clamp01(n);
  return t * t * (3 - 2 * t);
};

export function AiwaAbout() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const indexRef = useRef<HTMLSpanElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const asteriskRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;

    const reveal = (
      element: HTMLElement | null,
      amount: number,
      offset = 32,
    ) => {
      if (!element) return;
      const opacity = Math.max(0, Math.min(1, amount));
      element.style.opacity = opacity.toFixed(3);
      element.style.transform =
        "translate3d(0," + ((1 - opacity) * offset).toFixed(2) + "px,0)";
    };

    const paint = () => {
      animationFrame = 0;

      // Progressive scroll reveal begins when About first enters the viewport,
      // and finishes when the section reaches the top. This makes motion
      // visible during natural scrolling instead of firing too early.
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const progress = clamp01((viewport - rect.top) / Math.max(1, viewport * 0.93));

      section.style.setProperty("--aiwa-about-progress", progress.toFixed(4));

      reveal(eyebrowRef.current, smooth((progress - 0.015) / 0.20), 16);
      reveal(indexRef.current, smooth((progress - 0.055) / 0.24), 16);

      wordsRef.current.forEach((word, index) => {
        if (!word) return;
        const amount = smooth((progress - (0.055 + index * 0.12)) / 0.46);
        word.style.opacity = amount.toFixed(3);
        word.style.transform =
          "translate3d(0," + ((1 - amount) * 113).toFixed(2) +
          "%,0) skewY(" + ((1 - amount) * 3.25).toFixed(2) + "deg)";
      });

      const locationProgress = smooth((progress - 0.41) / 0.37);
      const bodyProgress = smooth((progress - 0.49) / 0.36);
      const ctaProgress = smooth((progress - 0.62) / 0.37);

      reveal(locationRef.current, locationProgress, 28);
      reveal(copyRef.current, bodyProgress, 37);
      reveal(ctaRef.current, ctaProgress, 25);

      if (asteriskRef.current) {
        asteriskRef.current.style.transform =
          "rotate(" + ((1 - locationProgress) * -76).toFixed(1) + "deg)";
      }
      if (ruleRef.current) {
        ruleRef.current.style.transform =
          "scaleX(" + smooth((progress - 0.37) / 0.43).toFixed(4) + ")";
      }
    };

    const refresh = () => {
      if (motion.matches) {
        section.dataset.motion = "reduced";
        section.style.removeProperty("--aiwa-about-progress");
        // Remove inline scrub styles when motion preference changes.
        const elements: (HTMLElement | null)[] = [
          eyebrowRef.current, indexRef.current, locationRef.current,
          copyRef.current, ctaRef.current, ruleRef.current,
          asteriskRef.current, ...wordsRef.current,
        ];
        elements.forEach((element) => {
          element?.style.removeProperty("opacity");
          element?.style.removeProperty("transform");
        });
        return;
      }
      // Set motion mode only after initial styles are available, to ensure
      // graceful no-JS rendering and no permanently hidden content.
      section.dataset.motion = "scrub";
      paint();
    };

    const onScroll = () => {
      if (motion.matches || animationFrame) return;
      animationFrame = window.requestAnimationFrame(paint);
    };

    refresh();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    motion.addEventListener("change", refresh);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      motion.removeEventListener("change", refresh);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="aiwa-about"
      id="about"
      aria-labelledby="aiwa-about-heading"
    >
      <div className="aiwa-about__topline">
        <span ref={eyebrowRef} className="aiwa-about__eyebrow">
          <span className="aiwa-about__indicator" aria-hidden="true" />
          ABOUT US
        </span>
        <span ref={indexRef} className="aiwa-about__index">04 / AIWA MEDIA GROUP</span>
      </div>

      <div className="aiwa-about__content">
        <h2 className="aiwa-about__heading" id="aiwa-about-heading">
          {headline.map(({ text, italic }, index) => (
            <span className="aiwa-about__line" key={text}>
              <span
                ref={(element) => { wordsRef.current[index] = element; }}
                className="aiwa-about__line-text"
              >
                {italic ? <em>{text}</em> : text}
              </span>
            </span>
          ))}
        </h2>

        <div className="aiwa-about__lower">
          <div ref={ruleRef} className="aiwa-about__rule" aria-hidden="true" />
          <div
            ref={locationRef}
            className="aiwa-about__location"
            aria-label="Aiwa Media Group location"
          >
            <span ref={asteriskRef} className="aiwa-about__plus" aria-hidden="true">+</span>
            <span>FROM MUSCAT, OMAN<br />TO EVERYWHERE.</span>
          </div>

          <div className="aiwa-about__aside">
            <p ref={copyRef} className="aiwa-about__description">
              Aiwa Media Group brings strategy, branding, digital marketing,
              production, events and technology together. We create work that
              cuts through the noise and builds a presence worth remembering.
            </p>
            <a
              ref={ctaRef}
              className="aiwa-about__cta"
              href="https://aiwamediagroup.com/about-us/"
              aria-label="Learn more about Aiwa Media Group"
            >
              <span>LEARN MORE</span>
              <span className="aiwa-about__cta-icon" aria-hidden="true">
                <ArrowUpRight size={21} strokeWidth={1.8} />
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="aiwa-about__footer" aria-hidden="true">
        <span>AIWA / CREATIVE THAT MOVES</span>
        <span>04 — 05</span>
      </div>
    </section>
  );
}
