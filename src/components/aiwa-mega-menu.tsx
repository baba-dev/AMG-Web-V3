"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { megaMenuGroups, type MegaMenuGroup } from "@/lib/site-navigation";
import "./aiwa-mega-menu.css";

type AiwaMegaMenuProps = {
  variant: "hero" | "inner";
  mobileOpen: boolean;
  onMobileClose: () => void;
};

function isGroupCurrent(group: MegaMenuGroup, pathname: string) {
  return group.items.some((item) => item.href.startsWith("/") &&
    (pathname === item.href.split("#")[0] ||
      (item.href !== "/" && pathname.startsWith(item.href.split("#")[0] + "/"))));
}

function MenuSketch({ kind }: { kind: MegaMenuGroup["id"] }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg className="aiwa-mega-sketch" viewBox="0 0 520 310" aria-hidden="true">
      <path className="aiwa-mega-sketch__orbit" d="M35 245C122 78 350 22 488 116" {...common}/>
      {kind === "work" && <>
        <path d="M109 224l78-117 90 34 91-82 54 135-111 47-96-41z" {...common}/>
        <path className="aiwa-mega-sketch__accent" d="M123 218l88-19 67-54 86-80M187 107l28 92 96 42" {...common}/>
        <circle cx="366" cy="64" r="9" {...common}/><path d="M78 250h367" {...common}/>
      </>}
      {kind === "about" && <>
        <path d="M79 238c55-49 84-117 129-120 38-3 52 45 85 42 38-3 55-75 110-69 25 2 42 18 55 39" {...common}/>
        <path className="aiwa-mega-sketch__accent" d="M65 246h396M242 159l28 87M330 142l43 104" {...common}/>
        <path d="M145 180v66m-22-42h43M392 174v72m-25-37h49" {...common}/>
        <circle cx="270" cy="88" r="22" {...common}/>
      </>}
      {kind === "creatives" && <>
        <rect x="83" y="71" width="326" height="178" rx="5" {...common}/>
        <circle cx="246" cy="160" r="65" {...common}/><circle className="aiwa-mega-sketch__accent" cx="246" cy="160" r="31" {...common}/>
        <path d="M91 91l-45-30m355 30l62-35M89 230l-48 27m363-28l61 31" {...common}/>
        <path className="aiwa-mega-sketch__accent" d="M328 112c27 12 27 84 0 97M352 95c48 29 48 111 0 136" {...common}/>
      </>}
      {kind === "campaigns" && <>
        <path d="M76 198l247-101v126L76 148zM323 121l94-33v144l-94-33" {...common}/>
        <path className="aiwa-mega-sketch__accent" d="M107 191v52m37-65v65m239-100h81m-81-35l68-43m-68 114l68 43" {...common}/>
        <path d="M184 173c12 42 30 71 61 83" {...common}/>
      </>}
      {kind === "development" && <>
        <rect x="67" y="55" width="385" height="201" rx="8" {...common}/>
        <path d="M67 91h385M104 73h1m21 0h1m21 0h1" {...common}/>
        <path className="aiwa-mega-sketch__accent" d="M130 139l-43 28 43 28m257-56l43 28-43 28M291 116l-61 103" {...common}/>
        <path d="M166 116v103m187-103v103" {...common}/>
      </>}
      {kind === "start" && <>
        <path d="M102 225c54-94 112-141 199-125 45 8 83 40 121 112" {...common}/>
        <path className="aiwa-mega-sketch__accent" d="M86 226h357M259 95V39m-27 63l-28-48m82 49l30-48" {...common}/>
        <path d="M183 226c5-55 36-83 76-83 42 0 70 29 77 83M225 185l34-20 34 20" {...common}/>
        <circle cx="259" cy="118" r="8" {...common}/>
      </>}
    </svg>
  );
}

export function AiwaMegaMenu({ variant, mobileOpen, onMobileClose }: AiwaMegaMenuProps) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState<MegaMenuGroup["id"] | null>(null);
  const [mobileGroup, setMobileGroup] = useState<MegaMenuGroup["id"]>("work");

  const open = (id: MegaMenuGroup["id"]) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActive(id);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActive(null), 120);
  };
  const focusFirstLink = (id: MegaMenuGroup["id"]) => {
    open(id);
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLAnchorElement>(`#aiwa-mega-panel-${id} a`)?.focus();
    });
  };

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setActive(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (active) setActive(null);
      else if (mobileOpen) onMobileClose();
    };
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, [active, mobileOpen, onMobileClose]);

  useEffect(() => {
    if (!mobileOpen) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = oldOverflow; };
  }, [mobileOpen]);

  return (
    <div ref={rootRef} className={`aiwa-mega aiwa-mega--${variant}`} onMouseLeave={scheduleClose}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActive(null);
      }}>
      <nav className="aiwa-mega__triggers" aria-label="Primary navigation">
        {megaMenuGroups.map((group) => {
          const current = isGroupCurrent(group, pathname);
          const openNow = active === group.id;
          return <button key={group.id} type="button" className="aiwa-mega__trigger"
            aria-expanded={openNow} aria-controls={`aiwa-mega-panel-${group.id}`}
            data-current={current || undefined} onMouseEnter={() => open(group.id)}
            onFocus={() => open(group.id)} onClick={() => open(group.id)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") { event.preventDefault(); focusFirstLink(group.id); }
            }}>
            {group.label}<ChevronDown size={13} strokeWidth={1.8} aria-hidden="true"/>
          </button>;
        })}
      </nav>

      <div className="aiwa-mega__panels" data-open={active ? "true" : "false"}>
        {megaMenuGroups.map((group) => {
          const openNow = active === group.id;
          return <section key={group.id} id={`aiwa-mega-panel-${group.id}`}
            className={`aiwa-mega__panel${openNow ? " is-open" : ""}`}
            style={{ "--mega-accent": group.accent } as CSSProperties}
            aria-label={`${group.label} menu`} aria-hidden={!openNow} inert={!openNow}
            onMouseEnter={() => open(group.id)}>
            <div className="aiwa-mega__links">
              <div className="aiwa-mega__link-list">
                {group.items.map((item, index) => <a key={item.label} href={item.href}
                  target={"external" in item && item.external ? "_blank" : undefined}
                  rel={"external" in item && item.external ? "noreferrer" : undefined} onClick={() => setActive(null)}>
                  <span className="aiwa-mega__number">0{index + 1}</span>
                  <span className="aiwa-mega__link-copy"><strong>{item.label}</strong><small>{item.description}</small></span>
                  <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true"/>
                </a>)}
              </div>
            </div>
            <div className="aiwa-mega__art">
              <span className="aiwa-mega__art-label">AIWA / {group.label}</span>
              <MenuSketch kind={group.id}/>
              <h2>{group.title}</h2>
              <span className="aiwa-mega__art-index">{String(megaMenuGroups.indexOf(group) + 1).padStart(2, "0")} / 06</span>
            </div>
          </section>;
        })}
      </div>

      <nav id={`aiwa-mega-mobile-${variant}`} className={`aiwa-mega-mobile${mobileOpen ? " is-open" : ""}`}
        aria-label="Mobile primary navigation" aria-hidden={!mobileOpen} inert={!mobileOpen}>
        <span className="aiwa-mega-mobile__eyebrow">EXPLORE AIWA / MUSCAT</span>
        <div className="aiwa-mega-mobile__groups">
          {megaMenuGroups.map((group, groupIndex) => {
            const expanded = mobileGroup === group.id;
            return <section key={group.id} style={{ "--mega-accent": group.accent } as CSSProperties}>
              <button type="button" aria-expanded={expanded} aria-controls={`aiwa-mobile-group-${group.id}`}
                onClick={() => setMobileGroup(group.id)}>
                <span>0{groupIndex + 1}</span><strong>{group.label}</strong><ChevronDown size={20} aria-hidden="true"/>
              </button>
              <div id={`aiwa-mobile-group-${group.id}`} className="aiwa-mega-mobile__items" hidden={!expanded}>
                <div className="aiwa-mega-mobile__sketch"><MenuSketch kind={group.id}/></div>
                {group.items.map((item) => <a key={item.label} href={item.href}
                  target={"external" in item && item.external ? "_blank" : undefined} rel={"external" in item && item.external ? "noreferrer" : undefined}
                  onClick={onMobileClose}><span>{item.label}</span><ArrowUpRight size={18} aria-hidden="true"/></a>)}
              </div>
            </section>;
          })}
        </div>
        <p>BASED IN MUSCAT. MAKING NOISE EVERYWHERE.</p>
      </nav>
    </div>
  );
}
