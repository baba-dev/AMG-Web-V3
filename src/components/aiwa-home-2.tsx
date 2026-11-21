"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Menu, Play, Plus, X } from "lucide-react";
import { AiwaSpecialisms } from "@/components/aiwa-specialisms";
import { AiwaAbout } from "@/components/aiwa-about";
import { AiwaWorkShowcase } from "@/components/aiwa-work";
import { AiwaContact } from "@/components/aiwa-contact";
import { AiwaOffice } from "@/components/aiwa-office";
import { AiwaGlobalFooter } from "@/components/aiwa-footer";
import { AiwaFilmPlayer, type FilmOrigin } from "@/components/aiwa-film-player";
import "./aiwa-home-2.css";

const youtubeId = "d4wBqEmgFKA";
// Preserve the selected artwork throughout the film shared-element transition.
const poster = "/media/home-2/muscat-futurecraft-film-still.webp";

const navigation = [
  { label: "WORK", href: "#work" },
  { label: "ABOUT", href: "#about" },
  { label: "SPECIALISMS", href: "#specialisms" },
  { label: "JOIN US", href: "https://aiwamediagroup.com/career/" },
  { label: "CONTACT", href: "#contact" },
] as const;

export function AiwaHome2() {
  const heroRef = useRef<HTMLElement>(null);
  const filmButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filmOpen, setFilmOpen] = useState(false);
  const [filmOrigin, setFilmOrigin] = useState<FilmOrigin | null>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let pointerFrame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const paint = () => {
      frame = 0;
      if (reduced.matches) {
        hero.style.setProperty("--h2-scroll", "0");
        return;
      }
      const box = hero.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -box.top / Math.max(1, box.height * .72)));
      hero.style.setProperty("--h2-scroll", progress.toFixed(4));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };
    const paintPointer = () => {
      pointerFrame = 0;
      hero.style.setProperty("--h2-pointer-x", pointerX.toFixed(4));
      hero.style.setProperty("--h2-pointer-y", pointerY.toFixed(4));
    };
    const schedulePointer = () => {
      if (!pointerFrame) pointerFrame = window.requestAnimationFrame(paintPointer);
    };
    const point = (event: PointerEvent) => {
      if (reduced.matches || event.pointerType === "touch") return;
      pointerX = event.clientX / Math.max(1, window.innerWidth) - .5;
      pointerY = event.clientY / Math.max(1, window.innerHeight) - .5;
      schedulePointer();
    };
    const resetPointer = () => {
      pointerX = 0;
      pointerY = 0;
      schedulePointer();
    };
    const motionPreferenceChanged = () => {
      if (reduced.matches) resetPointer();
      schedule();
    };

    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    hero.addEventListener("pointermove", point, { passive: true });
    hero.addEventListener("pointerleave", resetPointer);
    reduced.addEventListener("change", motionPreferenceChanged);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      hero.removeEventListener("pointermove", point);
      hero.removeEventListener("pointerleave", resetPointer);
      reduced.removeEventListener("change", motionPreferenceChanged);
      if (frame) window.cancelAnimationFrame(frame);
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
    };
  }, []);

  // Full-screen navigation behaves as a modal on touch and keyboard.
  // It must not let focus or document scrolling escape behind the overlay.
  useEffect(() => {
    if (!menuOpen) return;
    const nav = mobileNavRef.current;
    const trigger = menuButtonRef.current;
    if (!nav || !trigger) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>("a"));
    const focusables: HTMLElement[] = [trigger, ...links];
    const focusFrame = window.requestAnimationFrame(() => links[0]?.focus({ preventScroll: true }));
    const breakpoint = window.matchMedia("(min-width: 901px)");
    const closeOnDesktop = () => { if (breakpoint.matches) setMenuOpen(false); };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
      } else if (event.key === "Tab") {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    breakpoint.addEventListener("change", closeOnDesktop);
    closeOnDesktop();
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      breakpoint.removeEventListener("change", closeOnDesktop);
      if (nav.contains(document.activeElement)) trigger.focus({ preventScroll: true });
    };
  }, [menuOpen]);

  const followAnchor = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const id = event.currentTarget.hash.slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    if (menuOpen) {
      if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
      target.focus({ preventScroll: true });
    }
    setMenuOpen(false);
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "start",
    });
    window.history.replaceState(null, "", "#" + id);
  };

  const openFilm = () => {
    const box = filmButtonRef.current?.getBoundingClientRect();
    if (box) {
      setFilmOrigin({ left: box.left, top: box.top, width: box.width, height: box.height });
    }
    setFilmOpen(true);
  };

  return (
    <main className="aiwa-home2-shell">
      <section ref={heroRef} className="aiwa-home2" aria-labelledby="home2-heading">
        <header className="aiwa-home2__header">
          <Link className="aiwa-home2__logo" href="/home-2" aria-label="Aiwa Home V2">AIWA.</Link>
          <nav className="aiwa-home2__nav" aria-label="Home 2 navigation">
            {navigation.map((item) => (
              <a key={item.label} href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                onClick={item.href.startsWith("#") ? followAnchor : undefined}>
                {item.label}
              </a>
            ))}
          </nav>
          <button ref={menuButtonRef} className="aiwa-home2__menu" type="button"
            aria-expanded={menuOpen} aria-controls="home2-mobile-nav"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMenuOpen(value => !value)}>
            {menuOpen ? <X aria-hidden="true" /> : <><Plus className="aiwa-home2__plus" aria-hidden="true"/><Menu className="aiwa-home2__hamburger" aria-hidden="true"/></>}
          </button>
          <nav ref={mobileNavRef} id="home2-mobile-nav" className="aiwa-home2__mobile-nav"
            data-open={menuOpen} inert={!menuOpen} aria-hidden={!menuOpen} aria-label="Mobile navigation">
            {navigation.map((item, index) => (
              <a key={item.label} href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                onClick={item.href.startsWith("#") ? followAnchor : () => setMenuOpen(false)}>
                <span>0{index + 1}</span>{item.label}<ArrowRight aria-hidden="true" />
              </a>
            ))}
          </nav>
        </header>

        <div className="aiwa-home2__stage">
          <h1 className="aiwa-home2__headline" id="home2-heading">
            <span className="aiwa-home2__line aiwa-home2__line--one">MADE IN <em>MUSCAT.</em></span>
            <span className="aiwa-home2__line aiwa-home2__line--two">BUILT TO MOVE CULTURE.</span>
          </h1>

          <div className="aiwa-home2__landscape" aria-hidden="true">
            <Image src="/media/home-2/muscat-futurecraft-landscape.webp" alt=""
              fill priority sizes="100vw" />
          </div>

          <button ref={filmButtonRef} className="aiwa-home2__film" type="button"
            onClick={openFilm} aria-label="Play the Aiwa Media Group film">
            <Image src="/media/home-2/muscat-futurecraft-film-still.webp" alt=""
              fill priority sizes="(max-width: 720px) 42vw, 18vw" />
            <span className="aiwa-home2__film-frame" aria-hidden="true" />
            <span className="aiwa-home2__film-action"><Play fill="currentColor" aria-hidden="true"/> PLAY THE REEL</span>
          </button>
        </div>

        <div className="aiwa-home2__footer">
          <p><span />23.5880° N / 58.3829° E</p>
          <a href="#work" onClick={followAnchor}>ENTER THE WORK <ArrowRight aria-hidden="true" /></a>
          <button type="button" aria-label="Scroll to specialisms"
            onClick={() => document.getElementById("specialisms")?.scrollIntoView({
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
            })}>
            <ArrowDown aria-hidden="true" />
          </button>
        </div>
      </section>

      <AiwaSpecialisms />
      <AiwaAbout />
      <AiwaWorkShowcase />
      <AiwaContact />
      <AiwaOffice />
      <AiwaGlobalFooter />

      <AiwaFilmPlayer open={filmOpen} origin={filmOrigin} poster={poster}
        youtubeId={youtubeId} nativeVideo={null} onRequestClose={() => setFilmOpen(false)} />
    </main>
  );
}
