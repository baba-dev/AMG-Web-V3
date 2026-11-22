"use client";

import { ArrowUp, ArrowUpRight, Camera, Briefcase, MapPin } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { resolveSiteHref } from "@/lib/site-navigation";
import "./aiwa-footer.css";

const navigation = [
  { label: "WORK", href: "/work" },
  { label: "ABOUT", href: "#about" },
  { label: "SPECIALISMS", href: "/specialisms" },
  { label: "JOIN US", href: "https://aiwamediagroup.com/career/" },
  { label: "CONTACT", href: "/contact" },
  { label: "LATEST", href: "https://www.linkedin.com/company/aiwamediagroup/" },
] as const;

export function AiwaGlobalFooter() {
  const pathname = usePathname();
  const echoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wordmark = echoRef.current;
    if (!wordmark || !window.IntersectionObserver) return;

    const observer = new IntersectionObserver(([entry]) => {
      wordmark.dataset.inView = entry.isIntersecting ? "true" : "false";
    }, { threshold: 0.1 });

    observer.observe(wordmark);
    return () => observer.disconnect();
  }, []);

  const backToTop = () => {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant" : "smooth",
    });
  };

  return (
    <footer className="aiwa-footer" id="site-footer" aria-label="Aiwa Media Group global footer">
      <div className="aiwa-footer__upper">
        <div className="aiwa-footer__intro">
          <span className="aiwa-footer__eyebrow">READY TO MAKE SOME NOISE?</span>
          <p>Good ideas don&apos;t need to whisper.</p>
          <a className="aiwa-footer__start" href="/contact">
            WORK WITH AIWA <ArrowUpRight size={23} strokeWidth={1.6} aria-hidden="true"/>
          </a>
        </div>
        <div className="aiwa-footer__contact">
          <span className="aiwa-footer__eyebrow">OUR HOME</span>
          <address>HGRW+VMV, 3711 Way<br/>Muscat, Oman</address>
          <a href="tel:+96896138461">+968 9613 8461</a>
          <a className="aiwa-footer__directions"
            href="https://www.google.com/maps/search/?api=1&query=HGRW%2BVMV%203711%20Way%20Muscat%20Oman"
            target="_blank" rel="noopener noreferrer">
            DIRECTIONS <ArrowUpRight size={16} aria-hidden="true"/>
          </a>
        </div>
        <nav className="aiwa-footer__navigation" aria-label="Footer navigation">
          <span className="aiwa-footer__eyebrow">EXPLORE</span>
          {navigation.map((item) => {
            const local = item.href.startsWith("#") || item.href.startsWith("/");
            return (
              <a href={resolveSiteHref(item.href, pathname)} key={item.label}
                target={local ? undefined : "_blank"}
                rel={local ? undefined : "noopener noreferrer"}>
                {item.label} {!local && <ArrowUpRight size={14} aria-hidden="true" />}
              </a>
            );
          })}
        </nav>
        <div className="aiwa-footer__social">
          <span className="aiwa-footer__eyebrow">FOLLOW THE ENERGY</span>
          <a href="https://www.instagram.com/aiwamediagroup.om/"
            target="_blank" rel="noopener noreferrer"
            aria-label="Aiwa Media Group on Instagram">
            <Camera size={19} aria-hidden="true"/> INSTAGRAM <ArrowUpRight size={14} aria-hidden="true"/>
          </a>
          <a href="https://www.linkedin.com/company/aiwamediagroup/"
            target="_blank" rel="noopener noreferrer"
            aria-label="Aiwa Media Group on LinkedIn">
            <Briefcase size={19} aria-hidden="true"/> LINKEDIN <ArrowUpRight size={14} aria-hidden="true"/>
          </a>
          <span className="aiwa-footer__city"><MapPin size={15} aria-hidden="true"/> MUSCAT, OMAN</span>
        </div>
      </div>

      <div className="aiwa-footer__echo" ref={echoRef} lang="ar" dir="ltr" data-in-view="false">
        <span className="aiwa-footer__echo-layer aiwa-footer__echo-layer--coral" dir="rtl" aria-hidden="true">
          مجموعة أيوا الإعلامية
        </span>
        <span className="aiwa-footer__echo-layer aiwa-footer__echo-layer--cyan" dir="rtl" aria-hidden="true">
          مجموعة أيوا الإعلامية
        </span>
        <span className="aiwa-footer__echo-layer aiwa-footer__echo-layer--ink" dir="rtl">
          مجموعة أيوا الإعلامية
        </span>
      </div>

      <div className="aiwa-footer__bottom">
        <span>© 2026 AIWA MEDIA GROUP · BY AHMED AL AJMI TRADING</span>
        <div>
          <Link href="/privacy">PRIVACY NOTES</Link>
          <Link href="/terms">SITE TERMS</Link>
        </div>
        <button type="button" onClick={backToTop} aria-label="Back to top">
          BACK TO TOP <ArrowUp size={19} strokeWidth={1.8} aria-hidden="true"/>
        </button>
      </div>
    </footer>
  );
}
