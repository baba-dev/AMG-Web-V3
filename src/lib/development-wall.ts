/** Pure layout and station data for the Development fly-through. No runtime imports so Node can load it directly. */
export type ServiceId = "web" | "software" | "cloud" | "email" | "ai" | "iot";
export type WallTile = { slug: string; x: number; y: number; z: number; rotY: number; rotX: number; scale: number };
export type Station = { id: ServiceId; at: number; featured: readonly string[] };

const CELL_W = 520;
const CELL_H = 320;

/** Deterministic pseudo-offset in [-1,1] from an index and salt (no Math.random). */
function wobble(i: number, salt: number): number {
  const v = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return (v - Math.floor(v)) * 2 - 1;
}

/** Place tiles on a gently curved grid; depth is staggered by row so a camera passes between them. */
export function buildWall(slugs: readonly string[], columns: number): WallTile[] {
  const cols = Math.max(1, Math.floor(columns));
  const rows = Math.ceil(slugs.length / cols);
  return slugs.map((slug, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = col - (cols - 1) / 2;
    const cy = row - (rows - 1) / 2;
    return {
      slug,
      x: Math.round(cx * CELL_W),
      y: Math.round(cy * CELL_H),
      z: Math.round(-row * 380 - Math.abs(cx) * 90 + wobble(i, 1) * 60),
      rotY: Math.round((-cx * 6 + wobble(i, 2) * 3) * 10) / 10,
      rotX: Math.round(wobble(i, 3) * 20) / 10,
      scale: 1,
    };
  });
}

/** Same order as `developmentServices`. Featured tiles use only existing project mappings; no other client relationship is implied. */
export const stations: readonly Station[] = [
  { id: "web", at: 0.1, featured: ["gwi"] },
  { id: "software", at: 0.26, featured: ["bababuilds-erp"] },
  { id: "cloud", at: 0.42, featured: [] },
  { id: "email", at: 0.58, featured: [] },
  { id: "ai", at: 0.74, featured: ["aiwa-creators"] },
  { id: "iot", at: 0.9, featured: [] },
];

/** Station whose window contains `progress` (clamped to 0..1). */
export function stationAt(progress: number): ServiceId {
  const p = Math.min(1, Math.max(0, progress));
  let current = stations[0].id;
  for (const s of stations) if (p + 1e-9 >= s.at - 0.08) current = s.id;
  return current;
}
