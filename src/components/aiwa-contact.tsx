"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, MoveDownRight } from "lucide-react";
import "./aiwa-contact.css";

const CONTACT_URL = "https://aiwamediagroup.com/contact-us/";

export function AiwaContact() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const echoRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const scene = sceneRef.current;
    const heading = headingRef.current;
    const echo = echoRef.current;
    const eyebrow = eyebrowRef.current;
    const description = descriptionRef.current;
    const action = ctaRef.current;
    if (!section || !stage || !scene || !heading || !echo || !eyebrow ||
      !description || !action) return;

    const wide = window.matchMedia("(min-width: 768px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lines = Array.from(heading.querySelectorAll<HTMLElement>(".aiwa-contact__line > span"));
    const clamp = (n: number) => Math.min(1, Math.max(0, n));
    const ease = (n: number) => {
      const t = clamp(n);
      return t * t * (3 - 2 * t);
    };
    let frame = 0;

    const restore = () => {
      section.style.removeProperty("--contact-progress");
      [heading, echo, eyebrow, description, action, ...lines].forEach((node) => {
        node.style.removeProperty("transform");
        node.style.removeProperty("opacity");
        node.style.removeProperty("clip-path");
      });
    };

    const paint = () => {
      frame = 0;
      if (reduced.matches || !wide.matches) return;

      const travel = Math.max(1, stage.offsetHeight - scene.clientHeight);
      const p = clamp(-stage.getBoundingClientRect().top / travel);
      section.style.setProperty("--contact-progress", p.toFixed(4));

      const first = ease((p - .025) / .32);
      const second = ease((p - .12) / .37);
      lines.forEach((line, index) => {
        const reveal = index === 0 ? first : second;
        line.style.opacity = (.18 + .82 * reveal).toFixed(3);
        line.style.transform = "translate3d(0," +
          ((1 - reveal) * 112).toFixed(2) + "%,0) skewY(" +
          ((1 - reveal) * (index ? -3.9 : 4.2)).toFixed(2) + "deg)";
      });
      const echoReveal = ease((p - .13) / .38);
      const exit = ease((p - .85) / .15);
      echo.style.opacity = (.07 + .23 * echoReveal * (1 - exit)).toFixed(3);
      echo.style.transform = "translate3d(" +
        (25 - echoReveal * 50 + exit * 65).toFixed(2) +
        "px," + (52 - echoReveal * 66).toFixed(2) +
        "px,0) scale(" + (1.07 - echoReveal * .055).toFixed(3) + ")";
      echo.style.clipPath = "inset(" +
        ((1 - echoReveal) * 100).toFixed(2) + "% 0 0 0)";
      heading.style.transform = "translate3d(0," +
        ((1 - first) * 26 - exit * 36).toFixed(2) +
        "px,0) scale(" + (1 + .035 * ease((p - .42) / .4)).toFixed(4) + ")";
      eyebrow.style.opacity = (.55 + .45 * ease(p / .19)).toFixed(3);
      eyebrow.style.transform = "translate3d(0," + ((1 - first) * 20).toFixed(2) + "px,0)";
      const details = ease((p - .42) / .33);
      description.style.opacity = (.25 + .75 * details).toFixed(3);
      description.style.transform = "translate3d(0," + (26 * (1 - details)).toFixed(2) + "px,0)";
      const button = ease((p - .48) / .26);
      action.style.opacity = (.38 + .62 * button).toFixed(3);
      action.style.transform = "translate3d(0," + (37 * (1 - button)).toFixed(2) + "px,0)";
    };

    const schedule = () => {
      // Direct anchor navigation can jump multiple viewports in one frame.
      // Always schedule one scroll-scrub tick so the target never gets stuck
      // behind a delayed proximity observer (the animation is only 7 nodes).
      if (frame || !wide.matches || reduced.matches) return;
      frame = window.requestAnimationFrame(paint);
    };

    const mobileVisibility = new IntersectionObserver(([entry]) => {
      if (wide.matches || reduced.matches) return;
      section.dataset.entered = String(entry?.isIntersecting ?? false);
    }, { threshold: .10, rootMargin: "0px 0px -6% 0px" });
    mobileVisibility.observe(section);

    const configure = () => {
      restore();
      if (reduced.matches) {
        delete section.dataset.motion;
        delete section.dataset.entered;
      } else if (wide.matches) {
        section.dataset.motion = "desktop";
        delete section.dataset.entered;
        schedule();
      } else {
        section.dataset.motion = "mobile";
        // Observer sets this on entry; keep copy readable during hydration.
        if (!section.dataset.entered) section.dataset.entered = "true";
      }
    };

    const proximity = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) schedule();
    }, { rootMargin: "120% 0px 120% 0px" });
    proximity.observe(section);

    configure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", configure);
    wide.addEventListener("change", configure);
    reduced.addEventListener("change", configure);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", configure);
      wide.removeEventListener("change", configure);
      reduced.removeEventListener("change", configure);
      proximity.disconnect();
      mobileVisibility.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      restore();
    };
  }, []);

  return (
    <section ref={sectionRef} className="aiwa-contact" id="contact" aria-labelledby="aiwa-contact-title">
      <div ref={stageRef} className="aiwa-contact__stage">
        <div ref={sceneRef} className="aiwa-contact__scene">
          <div ref={eyebrowRef} className="aiwa-contact__topline">
            <span className="aiwa-contact__eyebrow">
              <span className="aiwa-contact__dot" aria-hidden="true" />
              GET IN TOUCH
            </span>
            <span className="aiwa-contact__index">06 / AIWA MEDIA GROUP</span>
          </div>

          <div className="aiwa-contact__main">
            <div className="aiwa-contact__lockup">
              <div ref={echoRef} className="aiwa-contact__echo" aria-hidden="true">
                <span>LET&apos;S MAKE</span>
                <span>SOME NOISE.</span>
              </div>
              <h2 ref={headingRef} className="aiwa-contact__headline" id="aiwa-contact-title">
                <span className="aiwa-contact__line"><span>LET&apos;S MAKE</span></span>
                <span className="aiwa-contact__line"><span><em>SOME NOISE.</em></span></span>
              </h2>
            </div>
            <div className="aiwa-contact__message">
              <p ref={descriptionRef}>
                Great ideas deserve attention. Let&apos;s make something impossible to ignore.
              </p>
              <a ref={ctaRef} className="aiwa-contact__action"
                href={CONTACT_URL} aria-label="Start a project with Aiwa Media Group">
                <span>START A PROJECT</span>
                <span className="aiwa-contact__action-arrow" aria-hidden="true">
                  <ArrowUpRight size={25} strokeWidth={1.75} />
                </span>
              </a>
            </div>
          </div>

          <div className="aiwa-contact__baseline" aria-hidden="true">
            <span>CREATIVE THAT MOVES / MUSCAT, OMAN</span>
            <MoveDownRight size={22} strokeWidth={1.4}/>
            <span>06 — 07</span>
          </div>
        </div>
      </div>
    </section>
  );
}
