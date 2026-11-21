"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Globe2, Menu, Play, VolumeX, X } from "lucide-react";
import { AiwaSpecialisms } from "@/components/aiwa-specialisms";
import { AiwaAbout } from "@/components/aiwa-about";
import { AiwaWorkShowcase } from "@/components/aiwa-work";
import { AiwaContact } from "@/components/aiwa-contact";
import { AiwaOffice } from "@/components/aiwa-office";
import { AiwaGlobalFooter } from "@/components/aiwa-footer";
import { ModeToggle } from "@/components/mode-toggle";
import { AiwaFilmPlayer, type FilmOrigin } from "@/components/aiwa-film-player";
import "./aiwa-hero.css";

const navigation = [
  { label: "WORK", href: "#work" },
  { label: "ABOUT", href: "#about" },
  { label: "SPECIALISMS", href: "#specialisms" },
  { label: "JOIN US", href: "https://aiwamediagroup.com/career/" },
  { label: "CONTACT US", href: "#contact" },
  { label: "LATEST", href: "https://www.linkedin.com/company/aiwamediagroup/" },
] as const;

const candidateId = process.env.NEXT_PUBLIC_AIWA_SHOWREEL_YOUTUBE_ID;
const youtubeId = candidateId && /^[a-zA-Z0-9_-]{11}$/.test(candidateId)
  ? candidateId : "d4wBqEmgFKA";
const poster = "https://i.ytimg.com/vi/" + youtubeId + "/hqdefault.jpg";
const candidateVideo = process.env.NEXT_PUBLIC_AIWA_REEL_MP4_PATH;
const nativeVideo = candidateVideo &&
  /^\/media\/[a-zA-Z0-9_./-]+\.mp4$/.test(candidateVideo) &&
  !candidateVideo.includes("..") ? candidateVideo : null;

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => {
  const t = clamp(x);
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

function MuscatTime() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const update = () => setTime(new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Muscat",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date()));
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);
  return <time aria-label={"Current time in Muscat: " + time}>MCT {time}</time>;
}

export function AiwaHero() {
  const sequenceRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const filmSectionRef = useRef<HTMLElement>(null);
  const tileRef = useRef<HTMLButtonElement>(null);
  const projectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const filmControlsRef = useRef<HTMLDivElement>(null);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [officesOpen, setOfficesOpen] = useState(false);
  const [filmOpen, setFilmOpen] = useState(false);
  const [filmOrigin, setFilmOrigin] = useState<FilmOrigin | null>(null);
  const [filmControlsActive, setFilmControlsActive] = useState(false);
  const [playNativeReel, setPlayNativeReel] = useState(false);

  useEffect(() => {
    const sequence = sequenceRef.current;
    const hero = heroRef.current;
    const target = filmSectionRef.current;
    const tile = tileRef.current;
    const projection = projectionRef.current;
    const title = titleRef.current;
    const footer = footerRef.current;
    const header = headerRef.current;
    const poster = posterRef.current;
    const controls = filmControlsRef.current;
    if (!sequence || !hero || !target || !tile || !projection || !title || !footer || !controls || !header || !poster) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let controlsActive = false;
    let nativePlaying = false;

    const paint = () => {
      frame = 0;
      // Both hero and film are real, adjacent 100svh sections in document
      // flow. The single projected media layer morphs between their boxes.
      const sequenceBox = sequence.getBoundingClientRect();
      const heroBox = hero.getBoundingClientRect();
      const tileBox = tile.getBoundingClientRect();
      const targetBox = target.getBoundingClientRect();
      const progress = clamp(-sequenceBox.top / Math.max(1, heroBox.height));
      // Reference measurements: substantial growth by ~0.43 viewport, almost
      // fullscreen near ~0.87. A gentle power-out maps those checkpoints.
      const expansion = motion.matches ? (progress >= 0.5 ? 1 : 0)
        : 1 - Math.pow(1 - progress, 1.45);

      const fromX = tileBox.left - sequenceBox.left;
      const fromY = tileBox.top - sequenceBox.top;
      const toX = targetBox.left - sequenceBox.left;
      const toY = targetBox.top - sequenceBox.top;
      const x = mix(fromX, toX, expansion);
      // Lift the film over the anchored hero during expansion, then let it
      // land in its real in-flow second section. Zero overshoot at both ends.
      const lift = motion.matches ? 0 :
        Math.sin(Math.PI * progress) * window.innerHeight * 0.51;
      const y = mix(fromY, toY, expansion) - lift;
      const w = mix(tileBox.width, targetBox.width, expansion);
      const h = mix(tileBox.height, targetBox.height, expansion);

      // Transform-only FLIP: width and height are set to the destination's
      // stable box. Per-frame expansion changes a GPU-friendly scale, not
      // layout width/height (the old implementation forced reflow on scroll).
      const destinationWidth = targetBox.width;
      const destinationHeight = targetBox.height;
      const width = destinationWidth.toFixed(2) + "px";
      const height = destinationHeight.toFixed(2) + "px";
      if (projection.style.width !== width) projection.style.width = width;
      if (projection.style.height !== height) projection.style.height = height;
      const sx = w / Math.max(1, destinationWidth);
      const sy = h / Math.max(1, destinationHeight);
      projection.style.transform = "translate3d(" + x.toFixed(2) +
        "px," + y.toFixed(2) + "px,0) scale(" +
        sx.toFixed(5) + "," + sy.toFixed(5) + ")";
      projection.style.opacity = "1";
      projection.style.borderRadius = "0";
      // Morph the slanted inline video aperture into the square-edged reel.
      const slant = (8 * (1 - expansion)).toFixed(3);
      projection.style.clipPath = "polygon(" + slant + "% 0,100% 0," + (100 - Number(slant)).toFixed(3) + "% 100%,0 100%)";

      tile.style.opacity = progress > 0.025 ? "0" : "1";
      // Keep typography visible behind the expanding film much longer,
      // instead of fading it away before the media has covered the hero.
      const textAlpha = 1 - ease((progress - 0.65) / 0.33);
      title.style.opacity = textAlpha.toFixed(3);
      footer.style.opacity = (1 - ease((progress - 0.67) / 0.27)).toFixed(3);
      header.style.opacity = (1 - ease((progress - 0.45) / 0.42)).toFixed(3);
      const hideHeroControls = progress > 0.94;
      header.style.pointerEvents = hideHeroControls ? "none" : "auto";
      title.style.pointerEvents = hideHeroControls ? "none" : "auto";
      footer.style.pointerEvents = hideHeroControls ? "none" : "auto";
      poster.style.transform = "scale(" + (1.34 + expansion * 0.08).toFixed(3) + ")";
      sequence.style.setProperty("--aiwa-hero-scroll", progress.toFixed(4));
      // Fade out only the mobile first-fold teaser as the actual reel arrives.
      sequence.style.setProperty("--aiwa-film-peek", (1 - ease(progress * 5)).toFixed(4));
      const controlAlpha = ease((progress - 0.82) / 0.17);
      controls.style.opacity = controlAlpha.toFixed(3);

      const enabled = progress >= 0.92;
      if (enabled !== controlsActive) {
        controlsActive = enabled;
        setFilmControlsActive(enabled);
      }

      // Native video is only mounted after the animation is almost complete.
      // Without an approved MP4, keep the Aiwa poster visible and offer the
      // independently opened full-film player; don't embed a bot-wall inline.
      const playVideo = Boolean(nativeVideo) && progress >= 0.94 && !motion.matches;
      if (playVideo !== nativePlaying) {
        nativePlaying = playVideo;
        setPlayNativeReel(playVideo);
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const openFilm = () => {
    // Match the actual on-screen source rectangle rather than a hardcoded
    // center. The cinema then expands smoothly from either the small inline
    // media tile or the full-viewport showreel.
    const tile = tileRef.current;
    const reel = projectionRef.current;
    const useTile = tile && Number(getComputedStyle(tile).opacity) > .08;
    const from = (useTile ? tile : reel)?.getBoundingClientRect();
    if (from) setFilmOrigin({
      left: from.left, top: from.top,
      width: from.width, height: from.height,
    });
    setFilmOpen(true);
    setMobileNavOpen(false);
  };
  const navigateAbout = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const about = document.getElementById("about");
    if (!about) return;
    event.preventDefault();
    window.history.pushState(null, "", "#about");
    about.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };
  const navigateContact = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
      event.button !== 0) return;
    const section = document.getElementById("contact");
    const stage = section?.querySelector<HTMLElement>(".aiwa-contact__stage");
    if (!section || !stage) return;
    event.preventDefault();
    window.history.pushState(null, "", "#contact");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const extra = wide && !reduced
      ? Math.max(0, stage.offsetHeight - window.innerHeight) * .58 : 0;
    window.scrollTo({
      top: section.getBoundingClientRect().top + window.scrollY + extra,
      behavior: reduced ? "instant" : "smooth",
    });
  };
  const scrollToFilm = () => filmSectionRef.current?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    block: "start",
  });

  return (
    <main className="aiwa-site">
      <div className="aiwa-sequence" ref={sequenceRef}>
        <section ref={heroRef} className="aiwa-hero" aria-labelledby="aiwa-hero-heading">
          <header ref={headerRef} className="aiwa-header">
            <Link className="aiwa-header__identity" href="/" aria-label="Aiwa home">
              AIWA
            </Link>

            <nav className="aiwa-header__navigation" aria-label="Primary navigation">
              {navigation.map((item) => (
                <a className="aiwa-header__link" href={item.href} key={item.label}
                  onClick={item.href === "#about" ? navigateAbout : item.href === "#contact" ? navigateContact : undefined}>{item.label}</a>
              ))}
            </nav>

            <div className="aiwa-header__utility">
              <button
                className="aiwa-header__offices"
                type="button"
                aria-expanded={officesOpen}
                aria-controls="aiwa-offices-panel"
                onClick={() => setOfficesOpen((x) => !x)}
              >
                OFFICES
              </button>
              <span className="aiwa-header__clock"><Globe2 size={14} strokeWidth={2} aria-hidden="true" /><MuscatTime /></span>
              <ModeToggle />
              <button
                className="aiwa-header__menu-toggle"
                type="button"
                aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
                aria-controls="aiwa-mobile-menu"
                aria-expanded={mobileNavOpen}
                onClick={() => setMobileNavOpen((x) => !x)}
              >
                {mobileNavOpen ? <X size={25} aria-hidden="true" /> : <Menu size={25} aria-hidden="true" />}
              </button>
            </div>

            <div id="aiwa-offices-panel" className={"aiwa-header__offices-panel" + (officesOpen ? " is-open" : "")} inert={!officesOpen}>
              <span>OUR OFFICE</span><strong>MUSCAT, OMAN</strong><MuscatTime />
            </div>

            <nav
              id="aiwa-mobile-menu"
              className={"aiwa-mobile-nav" + (mobileNavOpen ? " is-open" : "")}
              aria-label="Mobile navigation"
              inert={!mobileNavOpen}
            >
              {navigation.map((item, index) => (
                <a key={item.label} className="aiwa-mobile-nav__link" href={item.href}
                  onClick={(event) => { setMobileNavOpen(false); if (item.href === "#about") navigateAbout(event);
                    if (item.href === "#contact") navigateContact(event); }}>
                  <span>0{index + 1}</span>{item.label}<ArrowUpRight size={20} aria-hidden="true" />
                </a>
              ))}
              <span className="aiwa-mobile-nav__location">MUSCAT, OMAN / WORLDWIDE</span>
            </nav>
          </header>

          <div ref={titleRef} className="aiwa-hero__center">
            <h1 className="aiwa-hero__headline" id="aiwa-hero-heading">
              <span className="aiwa-hero__line">
                <span className="aiwa-hero__mask"><span className="aiwa-hero__word aiwa-hero__word--one">YOUR BRAND’S</span></span>
                <span className="aiwa-hero__mask"><em className="aiwa-hero__word aiwa-hero__word--two">TOO QUIET.</em></span>
              </span>
              <span className="aiwa-hero__line aiwa-hero__line--second">
                <span className="aiwa-hero__mask"><em className="aiwa-hero__word aiwa-hero__word--three">DOMINATE</em></span>
                <button
                  ref={tileRef}
                  className="aiwa-hero__film-tile"
                  type="button"
                  title="Play Aiwa's full film"
                  aria-label="Play Aiwa Media Group film"
                  aria-haspopup="dialog"
                  onClick={openFilm}
                  style={{ backgroundImage: "url(" + poster + ")" }}
                >
                  <span className="aiwa-hero__film-icon" aria-hidden="true"><Play size={17} fill="currentColor" /></span>
                </button>
                <span className="aiwa-hero__mask"><span className="aiwa-hero__word aiwa-hero__word--four">WITH AIWA.</span></span>
              </span>
            </h1>
          </div>

          <div ref={footerRef} className="aiwa-hero__bottom">
            <p className="aiwa-hero__location">Find us in Muscat, Oman.<span>Creating everywhere.</span></p>
            <button className="aiwa-hero__scroll" type="button" onClick={scrollToFilm} aria-label="Scroll to Aiwa showreel">
              <ArrowDown size={24} strokeWidth={1.8} aria-hidden="true" />
            </button>
          </div>
        </section>

        <section ref={filmSectionRef} className="aiwa-film-section" id="film"
          aria-label="Aiwa Media Group showreel"
          style={{ "--aiwa-film-poster": "url(" + poster + ")" } as CSSProperties} />

        <div className="aiwa-reel" ref={projectionRef} aria-hidden="true">
          <div ref={posterRef} className="aiwa-reel__poster" style={{ backgroundImage: "url(" + poster + ")" }} />
          {nativeVideo && playNativeReel && (
            <video className="aiwa-reel__video" src={nativeVideo} muted autoPlay loop playsInline
              preload="metadata" aria-label="Aiwa Media Group film" />
          )}
          <span className="aiwa-reel__shade" />
        </div>

        <div className="aiwa-reel__caption" ref={filmControlsRef} inert={!filmControlsActive}>
          <span>AIWA <small>/ OUR WORK</small></span>
          <div className="aiwa-reel__actions">
            <span className="aiwa-reel__muted"><VolumeX size={16} aria-hidden="true" /> MUTED</span>
            <button className="aiwa-reel__open-film" type="button" onClick={openFilm}>
              PLAY FULL FILM <Play size={15} fill="currentColor" aria-hidden="true" />
            </button>
            <button className="aiwa-reel__next" type="button"
              onClick={() => document.getElementById("specialisms")?.scrollIntoView({ behavior: "smooth" })}
              aria-label="Scroll to specialisms"><ArrowDown size={21} aria-hidden="true" /></button>
          </div>
        </div>
      </div>

      <AiwaSpecialisms />
      <AiwaAbout />
      <AiwaWorkShowcase />
      <AiwaContact />
      <AiwaOffice />
      <AiwaGlobalFooter />

      <AiwaFilmPlayer
        open={filmOpen}
        origin={filmOrigin}
        poster={poster}
        youtubeId={youtubeId}
        nativeVideo={nativeVideo}
        onRequestClose={() => setFilmOpen(false)}
      />

    </main>
  );
}
