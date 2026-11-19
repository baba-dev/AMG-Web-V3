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

export function AiwaAbout() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) {
      section.dataset.visible = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === section) {
            section.dataset.visible = String(entry.isIntersecting);
          }
        }
      },
      {
        rootMargin: "0px 0px -17% 0px",
        threshold: 0.10,
      },
    );

    section.dataset.motion = "ready";
    observer.observe(section);

    return () => {
      observer.disconnect();
      delete section.dataset.motion;
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
        <span className="aiwa-about__eyebrow">
          <span className="aiwa-about__indicator" aria-hidden="true" />
          ABOUT US
        </span>
        <span className="aiwa-about__index">04 / AIWA MEDIA GROUP</span>
      </div>

      <div className="aiwa-about__content">
        <h2 className="aiwa-about__heading" id="aiwa-about-heading">
          {headline.map(({ text, italic }, i) => (
            <span className="aiwa-about__line" key={text}>
              <span
                className="aiwa-about__line-text"
                style={{ animationDelay: `${i * 100}ms`, transitionDelay: `${i * 95}ms` }}
              >
                {italic ? <em>{text}</em> : text}
              </span>
            </span>
          ))}
        </h2>

        <div className="aiwa-about__lower">
          <div className="aiwa-about__location" aria-label="Aiwa Media Group location">
            <span className="aiwa-about__plus" aria-hidden="true">+</span>
            <span>FROM MUSCAT, OMAN<br />TO EVERYWHERE.</span>
          </div>

          <div className="aiwa-about__aside">
            <p>
              Aiwa Media Group brings strategy, branding, digital marketing,
              production, events and technology together. We create work that
              cuts through the noise and builds a presence worth remembering.
            </p>
            <a
              className="aiwa-about__cta"
              href="https://aiwamediagroup.com/about-us/"
              aria-label="Learn more about Aiwa Media Group"
            >
              <span>LEARN MORE</span>
              <span className="aiwa-about__cta-icon" aria-hidden="true">
                <ArrowUpRight size={20} strokeWidth={1.7} />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
