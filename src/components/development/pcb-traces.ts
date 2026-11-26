/** Procedural PCB layout for the hero: one chip, fan-out traces on 45-degree routes, long buses and vias. Pure and deterministic. */
export type Pt = readonly [number, number];
export type Pcb = {
  w: number; h: number;
  chip: { x: number; y: number; size: number; pins: readonly (readonly [number, number, number, number])[] };
  traces: string[];
  pulses: { d: string; dur: number; delay: number; tone: "blue" | "violet" | "lime" }[];
  vias: Pt[];
};

const f = (n: number) => Math.round(n * 10) / 10;

/** Polyline with chamfered (45-degree cut) corners, the way a PCB router draws bends. */
function route(points: readonly Pt[], cut = 16): string {
  let d = `M${f(points[0][0])} ${f(points[0][1])}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i - 1], [x, y] = points[i], [nx, ny] = points[i + 1];
    const a = Math.hypot(x - px, y - py), b = Math.hypot(nx - x, ny - y);
    const c = Math.min(cut, a / 2, b / 2);
    d += `L${f(x - ((x - px) / a) * c)} ${f(y - ((y - py) / a) * c)}L${f(x + ((nx - x) / b) * c)} ${f(y + ((ny - y) / b) * c)}`;
  }
  const last = points[points.length - 1];
  return d + `L${f(last[0])} ${f(last[1])}`;
}

export function buildPcb(w: number, h: number, cx: number, cy: number, size: number): Pcb {
  const n = 8;
  const pitch = size / (n + 1);
  const half = size / 2;
  const pinLen = 12;
  const routes: { pts: Pt[]; via: Pt; side: "r" | "l" | "t" | "b" }[] = [];
  const pins: [number, number, number, number][] = [];
  for (let i = 0; i < n; i++) {
    const k = i - (n - 1) / 2;
    const o = -half + pitch * (i + 1);
    const spread = k * (size / 8);
    const lead = 34 + Math.abs(k) * 11;
    // right
    let sx = cx + half + pinLen, y = cy + o;
    pins.push([cx + half, y, sx, y]);
    routes.push({ pts: [[sx, y], [sx + lead, y], [sx + lead + Math.abs(spread), y + spread], [w + 60, y + spread]], via: [sx + lead + Math.abs(spread), y + spread], side: "r" });
    // left
    sx = cx - half - pinLen; y = cy + o;
    pins.push([cx - half, y, sx, y]);
    routes.push({ pts: [[sx, y], [sx - lead, y], [sx - lead - Math.abs(spread), y + spread], [-60, y + spread]], via: [sx - lead - Math.abs(spread), y + spread], side: "l" });
    // top
    let x = cx + o, sy = cy - half - pinLen;
    pins.push([x, cy - half, x, sy]);
    routes.push({ pts: [[x, sy], [x, sy - lead], [x + spread, sy - lead - Math.abs(spread)], [x + spread, -60]], via: [x + spread, sy - lead - Math.abs(spread)], side: "t" });
    // bottom
    x = cx + o; sy = cy + half + pinLen;
    pins.push([x, cy + half, x, sy]);
    routes.push({ pts: [[x, sy], [x, sy + lead], [x + spread, sy + lead + Math.abs(spread)], [x + spread, h + 60]], via: [x + spread, sy + lead + Math.abs(spread)], side: "b" });
  }
  const traces = routes.map(r => route(r.pts));
  const vias: Pt[] = routes.map(r => r.via);

  // Long buses crossing the whole board with a single jog each.
  const buses: Pt[][] = [
    [[-60, h * 0.15], [w * 0.34, h * 0.15], [w * 0.34 + 34, h * 0.15 + 34], [w * 0.7, h * 0.15 + 34], [w * 0.7 + 34, h * 0.15], [w + 60, h * 0.15]],
    [[-60, h * 0.86], [w * 0.28, h * 0.86], [w * 0.28 - 30, h * 0.86 - 30], [w * 0.55, h * 0.86 - 30], [w * 0.55 + 30, h * 0.86], [w + 60, h * 0.86]],
    [[-60, h * 0.5 - 150], [w * 0.4, h * 0.5 - 150], [w * 0.4 + 40, h * 0.5 - 190], [w + 60, h * 0.5 - 190]],
  ];
  const busPaths = buses.map(b => route(b));
  for (const b of buses) vias.push(b[1], b[b.length - 2]);

  // Signals: mostly leaving the chip, a few entering it.
  const reversed = (r: typeof routes[number]) => route([...r.pts].reverse());
  const tones = ["blue", "violet", "lime", "blue"] as const;
  const pulses: Pcb["pulses"] = [];
  const pick = (side: "r" | "l" | "t" | "b", idx: number[], inbound: boolean) => {
    const set = routes.filter(r => r.side === side);
    idx.forEach(i => { const r = set[i]; pulses.push({ d: inbound ? reversed(r) : route(r.pts), dur: 0, delay: 0, tone: "blue" }); });
  };
  pick("r", [1, 3, 5, 6], false);
  pick("t", [2, 5], false);
  pick("b", [1, 4], true);
  pick("l", [2, 6], true);
  for (const p of busPaths) pulses.push({ d: p, dur: 0, delay: 0, tone: "blue" });
  pulses.push({ d: route([...buses[1]].reverse()), dur: 0, delay: 0, tone: "blue" });
  pulses.forEach((p, i) => { p.dur = 5.2 + ((i * 7) % 9) * 0.55; p.delay = -((i * 3.1) % p.dur); p.tone = tones[i % tones.length]; });

  return { w, h, chip: { x: cx - half, y: cy - half, size, pins }, traces: [...traces, ...busPaths], pulses, vias };
}
