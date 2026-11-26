"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { technologyProjects } from "@/lib/work/technology";
import { developmentServices } from "@/lib/development";
import { buildWall, stationAt, stations, type ServiceId } from "@/lib/development-wall";
import { useFlightContext } from "./flight-runtime";
import { WallTile } from "./wall-tile";
import { ProjectModal, type ModalRequest } from "./project-modal";
import "./flight-wall.css";

const COLUMNS = 6;
/** Camera depth that frames the whole wall (about 3100px wide) inside the viewport, never closer than the design scale. */
const overviewZ = () => 1200 - 1200 / Math.min(0.46, (window.innerWidth * 0.94) / 3100);
/** Free-flight waypoints (wall coordinates) for stations without a client tile. */
const FREE_POINTS = { cloud: { x: -320, y: 10, z: -380 }, email: { x: 330, y: -60, z: -620 }, iot: { x: 0, y: 0, z: -1150 } } as const;

export function FlightWall() {
  const { mode, lenis } = useFlightContext();
  const wall = useMemo(() => buildWall(technologyProjects.map(p => p.slug), COLUMNS), []);
  const [station, setStation] = useState<ServiceId>("web");
  const [started, setStarted] = useState(false);
  const [request, setRequest] = useState<ModalRequest | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const hashSettled = useRef(false); // settle on a URL hash once per page visit, never again when effects re-run
  const worldRef = useRef<HTMLDivElement>(null);
  const current = developmentServices.find(s => s.id === station)!;
  const index = stations.findIndex(s => s.id === station);

  useEffect(() => {
    if (mode !== "fly" || !lenis) return;
    let disposed = false;
    let revert = () => {};
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (disposed || !sectionRef.current || !worldRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const section = sectionRef.current;
      const world = worldRef.current;
      const tiles = Array.from(section.querySelectorAll<HTMLElement>(".tech-wall__tile"));
      const headerH = () => document.querySelector("[data-inner-header]")?.getBoundingClientRect().height ?? 84;
      const focusZ = () => Math.min(600, window.innerWidth * 0.4);
      const pointFor = (id: ServiceId) => {
        const featured = stations.find(s => s.id === id)!.featured[0];
        return featured ? wall.find(t => t.slug === featured)! : FREE_POINTS[id as keyof typeof FREE_POINTS];
      };
      const sway = { web: -5, software: 4, cloud: -3, email: 5, ai: -4, iot: 0 } as const;
      const ctx = gsap.context(() => {
        let last: ServiceId | null = null;
        let lastStarted = false;
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: section, refreshPriority: 2, start: () => "top top+=" + headerH(), end: "+=600%", pin: true, scrub: 1, invalidateOnRefresh: true,
            onUpdate: self => {
              const nowStarted = self.progress > 0.012;
              if (nowStarted !== lastStarted) { lastStarted = nowStarted; setStarted(nowStarted); }
              const id = stationAt(self.progress);
              if (id === last) return;
              last = id;
              setStation(id);
              const featured = stations.find(s => s.id === id)!.featured;
              tiles.forEach(t => t.toggleAttribute("data-focus", featured.includes(t.dataset.slug ?? "")));
            },
          },
        });
        let previous = 0;
        stations.forEach((s, i) => {
          const p = pointFor(s.id);
          const vars = { x: -p.x, y: -p.y, z: () => -p.z + focusZ(), rotationY: sway[s.id], duration: s.at - previous };
          if (i === 0) tl.fromTo(world, { x: 0, y: 0, z: overviewZ, rotationY: 0 }, vars, 0);
          else tl.to(world, vars, previous);
          previous = s.at;
        });
        tl.to(world, { z: () => focusZ() + 1400, rotationY: 0, duration: 1 - previous }, previous);
        tl.to(tiles, { opacity: 0, duration: 0.05, ease: "none" }, 0.95);
        gsap.set(section.querySelector(".tech-flight__hint"), { autoAlpha: 1 });
        tl.to(section.querySelector(".tech-flight__hint"), { autoAlpha: 0, duration: 0.03 }, 0);

        const st = tl.scrollTrigger!;
        // Pinning changes page height after the browser resolved the URL hash: settle on the target again.
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          if (hashSettled.current) return;
          hashSettled.current = true;
          const id = decodeURIComponent(location.hash.slice(1));
          if (id) document.getElementById(id)?.scrollIntoView();
        });
        const onFocusIn = (event: FocusEvent) => {
          const tile = (event.target as HTMLElement).closest<HTMLElement>(".tech-wall__tile");
          if (!tile) return;
          const vw = window.innerWidth, vh = window.innerHeight;
          const top = headerH();
          const inside = (r: DOMRect) => r.left >= 0 && r.right <= vw && r.top >= top && r.bottom <= vh;
          const fits = () => inside(tile.getBoundingClientRect());
          const saved = tl.progress();
          if (fits()) return;
          let best = saved, bestScore = Infinity;
          for (let i = 0; i <= 50; i++) {
            tl.progress(i / 50, true);
            const r = tile.getBoundingClientRect();
            const score = (inside(r) ? 0 : 5000) + Math.hypot((r.left + r.right) / 2 - vw / 2, (r.top + r.bottom) / 2 - vh / 2) - Math.min(r.width, vw * 0.5) * 0.6;
            if (score < bestScore) { bestScore = score; best = i / 50; }
          }
          tl.progress(saved, true);
          lenis.scrollTo(st.start + best * (st.end - st.start), { immediate: true });
        };
        section.addEventListener("focusin", onFocusIn);
        return () => section.removeEventListener("focusin", onFocusIn);
      }, section);
      revert = () => ctx.revert();
    })();
    return () => { disposed = true; revert(); setStation("web"); setStarted(false); };
  }, [mode, lenis, wall]);

  return <section ref={sectionRef} id="dev-flight" className="tech-flight-section" data-tech-section="flight" aria-labelledby="dev-flight-title">
    <div className="tech-flight__intro spec-pad">
      <h2 id="dev-flight-title">EIGHTEEN SCREENS.<br/><em>ONE TEAM.</em></h2>
      <p>Websites, products and platforms we have built and launched. Fly through them, or open any screen.</p>
    </div>
    <div className="tech-wall">
      <div ref={worldRef} className="tech-wall__world">
        {technologyProjects.map((project, i) => <WallTile key={project.slug} project={project} tile={wall[i]} index={i} onOpen={(p, opener) => setRequest({ project: p, opener, rect: opener.getBoundingClientRect() })}/>)}
      </div>
    </div>
    <div className="tech-flight__hud" data-station data-visible={started} aria-live="polite">
      <span className="tech-flight__count">{String(index + 1).padStart(2, "0")} / 06</span>
      <h3>{current.name}</h3>
      <p>{current.lead}</p>
      <a href={"#dev-" + current.id}>SEE THE SERVICE</a>
    </div>
    <p className="tech-flight__hint" aria-hidden="true">SCROLL TO FLY</p>
    <ProjectModal request={request} onClose={() => setRequest(null)}/>
  </section>;
}
