"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { resolveSiteHref, siteNavigation } from "@/lib/site-navigation";
import "./aiwa-inner-header.css";

/** A restrained inner-page header. Never touches the homepage film's scroll logic. */
export function AiwaInnerHeader() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstRef = useRef<HTMLAnchorElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!expanded) return;
    const oldOverflow = document.body.style.overflow;
    const small = window.matchMedia("(max-width: 1080px)");
    if (small.matches) document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false);
        toggleRef.current?.focus();
      }
      if (event.key !== "Tab" || !small.matches) return;
      const nodes = [...(drawerRef.current?.querySelectorAll<HTMLElement>('a[href]:not([tabindex="-1"])') ?? [])];
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    firstRef.current?.focus();
    return () => { document.body.style.overflow = oldOverflow; window.removeEventListener("keydown", onKey); };
  }, [expanded]);

  return (
    <header className="aiwa-inner-header" data-inner-header>
      <a className="aiwa-inner-header__skip" href="#main-content">SKIP TO CONTENT</a>
      <Link className="aiwa-inner-header__brand" href="/" aria-label="Aiwa Media Group home">AIWA<span>.</span></Link>
      <nav className="aiwa-inner-header__links" aria-label="Primary navigation">
        {siteNavigation.map((item) => (
          <a key={item.label} href={resolveSiteHref(item.href, pathname)}
             aria-current={item.label === "WORK" && pathname.startsWith("/work") ? "page" : undefined}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="aiwa-inner-header__tools">
        <span className="aiwa-inner-header__place">MUSCAT, OMAN</span>
        <ModeToggle />
        <button className="aiwa-inner-header__menu" type="button"
          ref={toggleRef} onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded} aria-controls="aiwa-inner-menu"
          aria-label={expanded ? "Close navigation" : "Open navigation"}>
          {expanded ? <X size={25} aria-hidden="true" /> : <Menu size={25} aria-hidden="true" />}
        </button>
      </div>
      <nav id="aiwa-inner-menu" ref={drawerRef} className={"aiwa-inner-header__drawer" + (expanded ? " is-open" : "")}
        aria-label="Mobile primary navigation" aria-hidden={!expanded} inert={!expanded}>
        <span className="aiwa-inner-header__drawer-label">EXPLORE AIWA</span>
        {siteNavigation.map((item, index) => (
          <a key={item.label} ref={index === 0 ? firstRef : undefined}
            href={resolveSiteHref(item.href, pathname)} onClick={() => setExpanded(false)}
            aria-current={item.label === "WORK" && pathname.startsWith("/work") ? "page" : undefined}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item.label}
            <ArrowUpRight size={23} aria-hidden="true" />
          </a>
        ))}
        <p>BASED IN MUSCAT. MAKING NOISE EVERYWHERE.</p>
      </nav>
    </header>
  );
}
