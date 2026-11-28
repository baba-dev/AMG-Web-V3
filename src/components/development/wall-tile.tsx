"use client";
import { useRef, type CSSProperties } from "react";
import Link from "next/link";
import { TechImage } from "@/components/technology/tech-media";
import type { TechnologyProject } from "@/lib/work/technology";
import type { WallTile as WallTileData } from "@/lib/development-wall";

/** One screen on the wall. Position comes from CSS variables so the server-rendered markup is already correct in both modes. */
export function WallTile({ project, tile, index, onOpen }: { project: TechnologyProject; tile: WallTileData; index: number; onOpen: (project: TechnologyProject, opener: HTMLElement) => void }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const frame = useRef(0);
  const style = { "--x": tile.x + "px", "--y": tile.y + "px", "--z": tile.z + "px", "--ry": tile.rotY + "deg", "--rx": tile.rotX + "deg", "--accent": project.accent } as CSSProperties;

  function tilt(event: React.PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "mouse") return;
    const node = ref.current;
    if (!node || frame.current) return;
    const { clientX, clientY } = event;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const r = node.getBoundingClientRect();
      const px = (clientX - r.left) / r.width - 0.5;
      const py = (clientY - r.top) / r.height - 0.5;
      node.style.setProperty("--tiltx", (-py * 10).toFixed(2) + "deg");
      node.style.setProperty("--tilty", (px * 12).toFixed(2) + "deg");
    });
  }
  function reset() {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    ref.current?.style.removeProperty("--tiltx");
    ref.current?.style.removeProperty("--tilty");
  }
  return <Link ref={ref} href={"/work/technology/" + project.slug} className="tech-wall__tile" data-aiwa-no-transition data-slug={project.slug} style={style}
    aria-label={project.name + ", " + project.sector} onPointerMove={tilt} onPointerLeave={reset} onBlur={reset}
    onClick={event => { if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); onOpen(project, event.currentTarget); }}>
    <span className="tech-wall__chrome" aria-hidden="true"><i/><i/><i/><b>{String(index + 1).padStart(2, "0")}</b></span>
    <span className="tech-wall__shot"><TechImage project={project} device="desktop" sizes="(max-width: 899px) 46vw, 440px" decorative/></span>
    <span className="tech-wall__cap"><strong>{project.name}</strong><small>{project.sector}</small></span>
  </Link>;
}
