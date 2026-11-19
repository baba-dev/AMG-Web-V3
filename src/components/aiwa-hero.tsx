"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Globe2, Menu, Play, X } from "lucide-react";
import "./aiwa-hero.css";

const navigation = [
  { label: "Work", href: "#work-preview" },
  { label: "About", href: "https://aiwamediagroup.com/about-us/" },
  { label: "Specialisms", href: "https://aiwamediagroup.com/services/" },
  { label: "Join us", href: "https://aiwamediagroup.com/career/" },
  { label: "Contact us", href: "https://aiwamediagroup.com/contact-us/" },
] as const;

// Aiwa's publicly released creative-work compilation. Replace with an approved
// final showreel ID via NEXT_PUBLIC_AIWA_SHOWREEL_YOUTUBE_ID at build time.
const configuredVideoId = process.env.NEXT_PUBLIC_AIWA_SHOWREEL_YOUTUBE_ID;
const videoId =
  configuredVideoId && /^[a-zA-Z0-9_-]{11}$/.test(configuredVideoId)
    ? configuredVideoId
    : "d4wBqEmgFKA";

function MuscatTime() {
  const [time, setTime] = useState("—:—");

  useEffect(() => {
    const update = () => {
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Muscat",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    };
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return <span aria-label={`Muscat local time ${time}`}>MCT {time}</span>;
}

export function AiwaHero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filmOpen, setFilmOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openFilm = () => {
    setMenuOpen(false);
    setFilmOpen(true);
    dialogRef.current?.showModal();
  };

  const closeFilm = () => dialogRef.current?.close();

  const scrollDown = () =>
    document.getElementById("work-preview")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });

  return (
    <main className="aiwa-site">
      <section className="aiwa-hero" aria-labelledby="aiwa-hero-heading">
        <header className="aiwa-header">
          <Link className="aiwa-header__identity" href="/" aria-label="Aiwa Media Group, home">
            <span className="aiwa-header__wordmark">AIWA<span className="aiwa-header__dot">.</span></span>
            <span className="aiwa-header__signature">MEDIA GROUP</span>
          </Link>

          <nav className="aiwa-header__navigation" aria-label="Primary navigation">
            {navigation.map((item) => (
              <a key={item.label} href={item.href} className="aiwa-header__link">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="aiwa-header__utility">
            <span className="aiwa-header__clock">
              <Globe2 size={15} strokeWidth={1.9} aria-hidden="true" />
              <MuscatTime />
            </span>
            <button
              type="button"
              className="aiwa-header__menu-toggle"
              onClick={() => setMenuOpen((open) => !open)}
              aria-controls="aiwa-mobile-menu"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            >
              {menuOpen ? <X size={25} aria-hidden="true" /> : <Menu size={25} aria-hidden="true" />}
            </button>
          </div>

          <nav
            id="aiwa-mobile-menu"
            className={`aiwa-mobile-nav${menuOpen ? " aiwa-mobile-nav--open" : ""}`}
            aria-label="Mobile navigation"
            inert={!menuOpen}
          >
            {navigation.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className="aiwa-mobile-nav__link"
                onClick={() => setMenuOpen(false)}
              >
                <span>0{index + 1}</span>
                {item.label}
                <ArrowUpRight size={20} aria-hidden="true" />
              </a>
            ))}
            <span className="aiwa-mobile-nav__location">Muscat, Oman · Worldwide</span>
          </nav>
        </header>

        <div className="aiwa-hero__center">
          <h1 className="aiwa-hero__headline" id="aiwa-hero-heading">
            <span className="aiwa-hero__line aiwa-hero__line--first">
              <span className="aiwa-hero__word aiwa-hero__word--one">Bye bye</span>
              <em className="aiwa-hero__word aiwa-hero__word--two">ordinary...</em>
            </span>
            <span className="aiwa-hero__line aiwa-hero__line--second">
              <em className="aiwa-hero__word aiwa-hero__word--three">Hello</em>
              <button
                type="button"
                onClick={openFilm}
                className="aiwa-hero__film-tile"
                aria-label="Play Aiwa Media Group's creative work film"
                aria-haspopup="dialog"
                title="Play Aiwa's creative work film"
                style={{
                  backgroundImage: `linear-gradient(0deg, rgba(0,0,0,.28), transparent 58%), url(https://i.ytimg.com/vi/${videoId}/hqdefault.jpg)`,
                }}
              >
                <span className="aiwa-hero__film-icon" aria-hidden="true">
                  <Play size={18} fill="currentColor" strokeWidth={1.5} />
                </span>
                <span className="aiwa-hero__film-label">Play film</span>
              </button>
              <span className="aiwa-hero__word aiwa-hero__word--four">Aiwa Media</span>
            </span>
          </h1>
        </div>

        <div className="aiwa-hero__bottom">
          <p className="aiwa-hero__location">
            Based in Muscat, Oman.
            <span>Making an impact everywhere.</span>
          </p>
          <button type="button" className="aiwa-hero__scroll" onClick={scrollDown} aria-label="Scroll down to discover our work">
            <ArrowDown size={24} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>
      </section>

      <section id="work-preview" className="aiwa-work-intro" aria-labelledby="aiwa-work-intro-heading">
        <div className="aiwa-work-intro__eyebrow"><span>01 / </span> Aiwa Media Group</div>
        <div className="aiwa-work-intro__layout">
          <h2 id="aiwa-work-intro-heading">Ideas that<br /><em>move people.</em></h2>
          <div className="aiwa-work-intro__aside">
            <p>
              Branding, digital, production, events and technology—built with
              creativity and purpose in Muscat and beyond.
            </p>
            <a href="https://aiwamediagroup.com/case-study/" className="aiwa-work-intro__cta">
              Explore our work <ArrowUpRight size={20} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <dialog
        ref={dialogRef}
        className="aiwa-film-dialog"
        aria-label="Aiwa Media Group creative work film"
        onClose={() => setFilmOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeFilm();
        }}
      >
        <div className="aiwa-film-dialog__panel">
          <div className="aiwa-film-dialog__top">
            <span>AIWA MEDIA GROUP / OUR WORK</span>
            <button type="button" aria-label="Close video" onClick={closeFilm}>
              <X size={23} aria-hidden="true" />
            </button>
          </div>
          {filmOpen && (
            <iframe
              title="Aiwa Media Group creative work compilation"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          )}
        </div>
      </dialog>
    </main>
  );
}
