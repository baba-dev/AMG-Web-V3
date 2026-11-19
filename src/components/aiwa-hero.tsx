"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Globe2, Menu, Play, VolumeX, X } from "lucide-react";
import "./aiwa-hero.css";

const navigation = [
  { label: "Work", href: "#work-preview" },
  { label: "About", href: "https://aiwamediagroup.com/about-us/" },
  { label: "Specialisms", href: "https://aiwamediagroup.com/services/" },
  { label: "Join us", href: "https://aiwamediagroup.com/career/" },
  { label: "Contact us", href: "https://aiwamediagroup.com/contact-us/" },
] as const;

// Aiwa's own publicly published production compilation. Use an approved
// showreel ID at build time to replace this interim choice.
const candidateId = process.env.NEXT_PUBLIC_AIWA_SHOWREEL_YOUTUBE_ID;
const videoId =
  candidateId && /^[a-zA-Z0-9_-]{11}$/.test(candidateId)
    ? candidateId
    : "d4wBqEmgFKA";
const poster = "https://i.ytimg.com/vi/" + videoId + "/hqdefault.jpg";
const videoEmbedBase = "https://www.youtube-nocookie.com/embed/" + videoId;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

function MuscatTime() {
  const [time, setTime] = useState("--:--");

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
    const interval = window.setInterval(update, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return <span aria-label={"Muscat local time " + time}>MCT {time}</span>;
}

export function AiwaHero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filmOpen, setFilmOpen] = useState(false);
  const [scrollPlayerReady, setScrollPlayerReady] = useState(false);

  const stageRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const tileRef = useRef<HTMLButtonElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const reelLabelRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const viewport = viewportRef.current;
    const anchor = tileRef.current;
    const reveal = revealRef.current;
    const headline = headlineRef.current;
    const header = headerRef.current;
    const footer = footerRef.current;
    const reelLabel = reelLabelRef.current;

    if (!stage || !viewport || !anchor || !reveal || !headline || !header || !footer || !reelLabel) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let request = 0;
    let playerReady = false;

    const render = () => {
      request = 0;
      const range = Math.max(1, stage.offsetHeight - window.innerHeight);
      const p = clamp(-stage.getBoundingClientRect().top / range);
      // Keep the inline film visible initially, then turn it into the full
      // next viewport. No layout-affecting changes: only clipping + opacity.
      const expansion = reducedMotion.matches ? (p > 0.32 ? 1 : 0) : smooth((p - 0.06) / 0.66);
      const anchorRect = anchor.getBoundingClientRect();
      const viewportRect = viewport.getBoundingClientRect();
      const x = Math.max(0, anchorRect.left - viewportRect.left);
      const y = Math.max(0, anchorRect.top - viewportRect.top);
      const width = viewportRect.width;
      const height = viewportRect.height;

      const right = Math.max(0, width - x - anchorRect.width);
      const bottom = Math.max(0, height - y - anchorRect.height);
      const remaining = 1 - expansion;

      reveal.style.clipPath =
        "inset(" +
        (y * remaining).toFixed(2) + "px " +
        (right * remaining).toFixed(2) + "px " +
        (bottom * remaining).toFixed(2) + "px " +
        (x * remaining).toFixed(2) + "px)";
      reveal.style.opacity = p > 0.018 ? "1" : "0";

      // A real, accessible video button is retained in the hero and in the
      // expanded reel. The moving visual is intentionally pointer-transparent.
      anchor.style.opacity = p > 0.018 ? "0" : "1";
      anchor.style.pointerEvents = p > 0.12 ? "none" : "auto";

      const textFade = 1 - smooth((p - 0.16) / 0.32);
      headline.style.opacity = textFade.toFixed(3);
      headline.style.pointerEvents = p > 0.34 ? "none" : "auto";
      footer.style.opacity = (1 - smooth((p - 0.1) / 0.24)).toFixed(3);
      footer.style.pointerEvents = p > 0.29 ? "none" : "auto";
      header.style.opacity = (1 - smooth((p - 0.43) / 0.2)).toFixed(3);
      header.style.pointerEvents = p > 0.62 ? "none" : "auto";

      const reelOpacity = smooth((p - 0.71) / 0.15);
      reelLabel.style.opacity = reelOpacity.toFixed(3);
      reelLabel.style.pointerEvents = p > 0.78 ? "auto" : "none";

      // Mount the YouTube embed only while the visitor has expanded the reel.
      // It uses muted autoplay; browsers that disallow autoplay retain the
      // independently visible, licensed Aiwa YouTube poster.
      const shouldPlay = p >= 0.42 && !reducedMotion.matches;
      if (shouldPlay !== playerReady) {
        playerReady = shouldPlay;
        setScrollPlayerReady(shouldPlay);
      }
    };

    const schedule = () => {
      if (!request) request = window.requestAnimationFrame(render);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
      if (request) window.cancelAnimationFrame(request);
    };
  }, []);

  const openFilm = () => {
    setMenuOpen(false);
    setFilmOpen(true);
    dialogRef.current?.showModal();
  };
  const closeFilm = () => dialogRef.current?.close();

  const scrollToReel = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const range = Math.max(0, stage.offsetHeight - window.innerHeight);
    window.scrollTo({
      top: window.scrollY + stage.getBoundingClientRect().top + range * 0.90,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  return (
    <main className="aiwa-site">
      <section ref={stageRef} className="aiwa-hero-stage" aria-labelledby="aiwa-hero-heading">
        <div ref={viewportRef} className="aiwa-hero">
          <header ref={headerRef} className="aiwa-header">
            <Link className="aiwa-header__identity" href="/" aria-label="Aiwa Media Group home">
              <span className="aiwa-header__wordmark">AIWA<span className="aiwa-header__dot">.</span></span>
              <span className="aiwa-header__signature">MEDIA GROUP</span>
            </Link>

            <nav className="aiwa-header__navigation" aria-label="Primary navigation">
              {navigation.map((item) => (
                <a key={item.label} href={item.href} className="aiwa-header__link">{item.label}</a>
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
              className={"aiwa-mobile-nav" + (menuOpen ? " aiwa-mobile-nav--open" : "")}
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
              <span className="aiwa-mobile-nav__location">Muscat, Oman / Worldwide</span>
            </nav>
          </header>

          <div ref={headlineRef} className="aiwa-hero__center">
            <h1 className="aiwa-hero__headline" id="aiwa-hero-heading">
              <span className="aiwa-hero__line aiwa-hero__line--first">
                <span className="aiwa-hero__mask">
                  <span className="aiwa-hero__word aiwa-hero__word--one">YOUR BRAND’S</span>
                </span>
                <span className="aiwa-hero__mask">
                  <em className="aiwa-hero__word aiwa-hero__word--two">TOO QUIET.</em>
                </span>
              </span>
              <span className="aiwa-hero__line aiwa-hero__line--second">
                <span className="aiwa-hero__mask">
                  <em className="aiwa-hero__word aiwa-hero__word--three">DOMINATE</em>
                </span>
                <button
                  ref={tileRef}
                  className="aiwa-hero__film-tile"
                  type="button"
                  onClick={openFilm}
                  aria-haspopup="dialog"
                  aria-label="Play Aiwa Media Group film"
                  title="Play the full Aiwa film"
                  style={{ backgroundImage: "url(" + poster + ")" }}
                >
                  <span className="aiwa-hero__film-icon" aria-hidden="true">
                    <Play size={18} fill="currentColor" strokeWidth={1.5} />
                  </span>
                </button>
                <span className="aiwa-hero__mask">
                  <span className="aiwa-hero__word aiwa-hero__word--four">WITH AIWA.</span>
                </span>
              </span>
            </h1>
          </div>

          <div ref={footerRef} className="aiwa-hero__bottom">
            <p className="aiwa-hero__location">Find us in Muscat, Oman.<span>Creating everywhere.</span></p>
            <button
              type="button"
              className="aiwa-hero__scroll"
              onClick={scrollToReel}
              aria-label="Scroll to Aiwa showreel"
            >
              <ArrowDown size={24} strokeWidth={1.8} aria-hidden="true" />
            </button>
          </div>

          <div ref={revealRef} className="aiwa-reel" aria-label="Aiwa creative film transition">
            <div className="aiwa-reel__poster" style={{ backgroundImage: "url(" + poster + ")" }} />
            {scrollPlayerReady && (
              <iframe
                className="aiwa-reel__video"
                title="Aiwa creative work film (muted background playback)"
                src={videoEmbedBase + "?autoplay=1&mute=1&controls=0&rel=0&loop=1&playlist=" + videoId + "&playsinline=1"}
                allow="autoplay; encrypted-media; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                loading="lazy"
                tabIndex={-1}
              />
            )}
            <span className="aiwa-reel__shade" aria-hidden="true" />
          </div>

          <div ref={reelLabelRef} className="aiwa-reel__caption">
            <span>AIWA MEDIA GROUP <small> / OUR WORK</small></span>
            <div className="aiwa-reel__actions">
              <span className="aiwa-reel__muted"><VolumeX size={18} aria-hidden="true" /> MUTED</span>
              <button type="button" onClick={openFilm} className="aiwa-reel__open-film">
                PLAY FULL FILM <Play size={17} fill="currentColor" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="work-preview" className="aiwa-work-intro" aria-labelledby="aiwa-work-intro-heading">
        <div className="aiwa-work-intro__eyebrow"><span>01 / </span> Aiwa Media Group</div>
        <div className="aiwa-work-intro__layout">
          <h2 id="aiwa-work-intro-heading">Ideas that<br /><em>move people.</em></h2>
          <div className="aiwa-work-intro__aside">
            <p>Branding, digital, production, events and technology—built with creativity and purpose in Muscat and beyond.</p>
            <a href="https://aiwamediagroup.com/case-study/" className="aiwa-work-intro__cta">
              Explore our work <ArrowUpRight size={20} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <dialog
        ref={dialogRef}
        className="aiwa-film-dialog"
        aria-label="Aiwa Media Group film"
        onClose={() => setFilmOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeFilm();
        }}
      >
        <div className="aiwa-film-dialog__panel">
          <div className="aiwa-film-dialog__top">
            <span>AIWA MEDIA GROUP / THE FULL FILM</span>
            <button type="button" aria-label="Close film" onClick={closeFilm}>
              <X size={23} aria-hidden="true" />
            </button>
          </div>
          {filmOpen && (
            <iframe
              title="Aiwa Media Group creative work compilation"
              src={videoEmbedBase + "?autoplay=1&rel=0"}
              loading="eager"
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
