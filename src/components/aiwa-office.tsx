"use client";

import { useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin, Phone } from "lucide-react";
import "./aiwa-office.css";

const scenes = [
  {
    id: "muscat",
    label: "01 / OUR CITY",
    title: "WHERE IT STARTS.",
    text: "Muscat is our home. The ideas we create are made to travel further.",
    src: "/media/finale/muscat-editorial.svg",
    alt: "Original illustrated panorama inspired by Muscat's shoreline and mountains at golden hour",
  },
  {
    id: "studio",
    label: "02 / THE MAKING",
    title: "IDEAS TAKE SHAPE.",
    text: "Strategy, design, production and technology move together.",
    src: "/media/finale/creative-process.svg",
    alt: "Original conceptual editorial illustration of lights, camera and a creative studio setup",
  },
  {
    id: "motion",
    label: "03 / THE ENERGY",
    title: "MADE TO MOVE.",
    text: "From the first sketch to the final frame, the energy stays in the work.",
    src: "/media/finale/creative-motion.svg",
    alt: "Original abstract creative-motion artwork with cinematic frames and vivid directional streaks",
  },
] as const;

const count = scenes.length;

export function AiwaOffice() {
  const [active, setActive] = useState(0);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const next = () => setActive((index) => (index + 1) % count);
  const previous = () => setActive((index) => (index - 1 + count) % count);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") { event.preventDefault(); next(); }
    if (event.key === "ArrowLeft") { event.preventDefault(); previous(); }
  };
  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (touch) pointerStart.current = { x: touch.clientX, y: touch.clientY };
  };
  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    const touch = event.changedTouches[0];
    if (!start || !touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < 58 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
    if (dx < 0) next(); else previous();
  };
  const current = scenes[active];

  return (
    <section className="aiwa-office" id="office" aria-labelledby="aiwa-office-title">
      <div className="aiwa-office__top">
        <span className="aiwa-office__eyebrow"><span aria-hidden="true">+</span> THE WORLD OF AIWA</span>
        <span className="aiwa-office__index">07 / OUR HOME</span>
      </div>

      <div className="aiwa-office__layout">
        <div
          className="aiwa-office__gallery"
          role="region"
          aria-roledescription="carousel"
          aria-label="Three original editorial images about Aiwa and Muscat"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="aiwa-office__pictures">
            {scenes.map((scene, index) => (
              <figure key={scene.id}
                className={"aiwa-office__picture" + (index === active ? " is-active" : "")}
                aria-hidden={index !== active}
                data-scene={scene.id}
                data-active={index === active}
              >
                <Image src={scene.src} width={1600} height={950} alt={scene.alt}
                  unoptimized loading="lazy" draggable={false}/>
                <figcaption aria-hidden="true">{scene.label}</figcaption>
              </figure>
            ))}
          </div>
          <div className="aiwa-office__visual-controls">
            <span>AIWA / ORIGINAL EDITORIAL ART</span>
            <div className="aiwa-office__arrows">
              <button type="button" aria-label="Previous image" onClick={previous}>
                <ArrowLeft size={25} strokeWidth={1.8} aria-hidden="true"/>
              </button>
              <button type="button" aria-label="Next image" onClick={next}>
                <ArrowRight size={25} strokeWidth={1.8} aria-hidden="true"/>
              </button>
            </div>
          </div>
        </div>

        <div className="aiwa-office__details">
          <div>
            <span className="aiwa-office__small-label">OUR HOME / MUSCAT, OMAN</span>
            <h2 id="aiwa-office-title">MADE IN <em>MUSCAT.</em></h2>
            <div aria-live="polite" aria-atomic="true" className="aiwa-office__current-story">
              <span>{current.label}</span>
              <h3>{current.title}</h3>
              <p>{current.text}</p>
            </div>
            <div className="aiwa-office__selectors" aria-label="Select editorial image">
              {scenes.map((scene, index) => (
                <button key={scene.id} type="button"
                  onClick={() => setActive(index)}
                  aria-label={"Show image " + (index + 1) + ": " + scene.label}
                  aria-pressed={index === active}
                  className={index === active ? "is-active" : ""}>
                  {String(index + 1).padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>

          <div className="aiwa-office__contact">
            <div className="aiwa-office__contact-heading"><MapPin size={20} aria-hidden="true"/> FIND US</div>
            <address>HGRW+VMV, 3711 Way<br/>Muscat, Sultanate of Oman</address>
            <a href="tel:+96896138461"><Phone size={17} aria-hidden="true"/> +968 9613 8461</a>
            <a href="https://www.google.com/maps/search/?api=1&query=HGRW%2BVMV%203711%20Way%20Muscat%20Oman"
              target="_blank" rel="noopener noreferrer"
              className="aiwa-office__map-link">
              GET DIRECTIONS <ArrowUpRight size={21} aria-hidden="true"/>
            </a>
          </div>
        </div>
      </div>

      <p className="aiwa-office__media-disclaimer">
        Original conceptual illustrations — not photographs of Aiwa&apos;s office or team.
      </p>
    </section>
  );
}
