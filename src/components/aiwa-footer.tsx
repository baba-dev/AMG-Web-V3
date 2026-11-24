"use client";

import { ArrowUp, ArrowUpRight, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { footerGroups, footerPhone, footerPlaceholder, footerSocials } from "@/lib/footer-navigation";
import "./aiwa-footer.css";

function SocialIcon({ name }: { name: typeof footerSocials[number] }) {
  const paths = {
    Facebook: "M14 21v-8h3l.5-4H14V7c0-1 .4-2 2-2h2V2h-3c-3 0-5 2-5 5v2H7v4h3v8",
    X: "M4 3h4l12 18h-4L4 3ZM20 3 4 21",
    YouTube: "M21 8a3 3 0 0 0-2-3 65 65 0 0 0-14 0 3 3 0 0 0-2 3v8a3 3 0 0 0 2 3 65 65 0 0 0 14 0 3 3 0 0 0 2-3V8ZM10 9l5 3-5 3V9Z",
    Instagram: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17.5 6.5h.01",
    WhatsApp: "M3 21l1.5-5A9 9 0 1 1 8 20L3 21ZM9 8c-2 1 0 5 3 7s5 0 4-1l-3-2-1 1-2-2 1-1-2-2Z",
  };
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}

export function AiwaGlobalFooter() {
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.revealed = "true";
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.01, rootMargin: "0px 0px -24px 0px" });
    footer.querySelectorAll("[data-footer-beat]").forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const activateAccordion = (title: string) => {
    setCollapsed(previous => previous.includes(title) ? previous.filter(item => item !== title) : [...previous, title]);
  };

  const backToTop = () => {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant" : "smooth",
    });
  };

  return (
    <footer ref={footerRef} className="aiwa-footer" id="site-footer" aria-label="Aiwa Media Group global footer">
      <div className="aiwa-footer__upper">
        <div className="aiwa-footer__intro" data-footer-beat>
          <span className="aiwa-footer__eyebrow">READY TO MAKE SOME NOISE?</span>
          <p><span>Good ideas don&apos;t</span><span>need to whisper.</span></p>
          <a className="aiwa-footer__start" href={footerPlaceholder}>
            WORK WITH AIWA <ArrowUpRight size={23} strokeWidth={1.6} aria-hidden="true"/>
          </a>
        </div>
        <div className="aiwa-footer__legacy-grid">
          {footerGroups.map((group, index) => {
            const open = !collapsed.includes(group.title);
            const panelId = `footer-group-${index}`;
            return (
              <nav className="aiwa-footer__group" data-footer-beat key={group.title} aria-label={group.title}>
                <h2 className="aiwa-footer__eyebrow aiwa-footer__desktop-heading">{group.title}</h2>
                <button type="button" className="aiwa-footer__accordion" aria-expanded={open} aria-controls={panelId}
                  onClick={() => activateAccordion(group.title)}>
                  {group.title}<ChevronDown size={20} aria-hidden="true" />
                </button>
                <ul id={panelId} className="aiwa-footer__links" data-expanded={open}>
                  {group.links.map(label => <li key={label}><a href={footerPlaceholder}>{label}<ArrowUpRight size={15} aria-hidden="true" /></a></li>)}
                </ul>
              </nav>
            );
          })}
          <section className="aiwa-footer__contact" data-footer-beat aria-label="Contact Us">
            <h2 className="aiwa-footer__eyebrow">Contact Us</h2>
            <a href={footerPhone.href}>Tele: {footerPhone.label}</a>
            <address><span>Our Address:</span><br />HGRW+VMV, 3711 Way,<br />Muscat, Oman</address>
            <span className="aiwa-footer__social-label" id="footer-social-label">Follow Aiwa</span>
            <div className="aiwa-footer__social-icons" role="group" aria-labelledby="footer-social-label">
              {footerSocials.map(name => <a key={name} href={footerPlaceholder} aria-label={name}><SocialIcon name={name} /></a>)}
            </div>
          </section>
        </div>
      </div>

      <div className="aiwa-footer__echo" data-footer-beat lang="ar" dir="ltr">
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

      <div className="aiwa-footer__bottom" data-footer-beat>
        <div className="aiwa-footer__signature"><strong aria-label="Aiwa Media Group">AIWA<span>.</span></strong><span>© 2026 AIWA MEDIA GROUP · BY AHMED AL AJMI TRADING</span></div>
        <div>
          <a href={footerPlaceholder}>PRIVACY NOTES</a>
          <a href={footerPlaceholder}>SITE TERMS</a>
        </div>
        <button type="button" onClick={backToTop} aria-label="Back to top">
          BACK TO TOP <ArrowUp size={19} strokeWidth={1.8} aria-hidden="true"/>
        </button>
      </div>
    </footer>
  );
}
