"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { AiwaMegaMenu } from "@/components/aiwa-mega-menu";
import "./aiwa-inner-header.css";

/** A restrained inner-page header. Never touches the homepage film's scroll logic. */
export function AiwaInnerHeader() {
  const [expanded, setExpanded] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  return (
    <header className="aiwa-inner-header" data-inner-header>
      <a className="aiwa-inner-header__skip" href="#main-content">SKIP TO CONTENT</a>
      <Link className="aiwa-inner-header__brand" href="/" aria-label="Aiwa Media Group home">AIWA<span>.</span></Link>
      <AiwaMegaMenu variant="inner" mobileOpen={expanded} onMobileClose={() => setExpanded(false)} />
      <div className="aiwa-inner-header__tools">
        <span className="aiwa-inner-header__place">MUSCAT, OMAN</span>
        <ModeToggle />
        <button className="aiwa-inner-header__menu" type="button"
          ref={toggleRef} onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded} aria-controls="aiwa-mega-mobile-inner"
          aria-label={expanded ? "Close navigation" : "Open navigation"}>
          {expanded ? <X size={25} aria-hidden="true" /> : <Menu size={25} aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}
