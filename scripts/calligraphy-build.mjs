/**
 * Traces the supplied Thuluth PNGs into animatable SVG.
 *   node scripts/calligraphy-build.mjs
 * Reads public/media/calligraphy/source/*.png (black ink on white) and writes
 *   public/media/calligraphy/svg/<word>.svg   (outline + pen mask + dots, theme-colourable)
 *   src/lib/calligraphy-data.ts                (same geometry for server-rendered components)
 * Pure Node (pngjs only): marching-squares outline, connected components for dots and marks,
 * Zhang-Suen thinning for the pen centre-line, chunked pen strokes sized from a distance transform.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { PNG } from "pngjs";

const SOURCE_DIR = "public/media/calligraphy/source";
const SVG_DIR = "public/media/calligraphy/svg";
const VIEW_W = 1200, VIEW_H = 400, MARGIN = 28;
const WORDS = {
  tech: "technology-arabic.png",
  innovation: "innovation-arabic.png",
  oman: "Oman-arabic.png",
  engineering: "engineering-arabic.png",
  programming: "programming-arabic.png",
  design: "design-arabic.png",
};
const DOT_AREA = 0.12; // components smaller than this share of the largest are dots/marks
const PEN_CHUNK = 64;  // pen stroke chunk length (skeleton px at half resolution)

/* ---------- bitmap ---------- */
function loadMask(file) {
  const png = PNG.sync.read(readFileSync(file));
  const { width: w, height: h, data } = png;
  const mask = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) mask[i] = (data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 3 < 128 && data[i * 4 + 3] > 8 ? 1 : 0;
  return { w, h, mask };
}

function components(mask, w, h) {
  const label = new Int32Array(w * h);
  const comps = [];
  const stack = [];
  for (let start = 0; start < w * h; start++) {
    if (!mask[start] || label[start]) continue;
    const id = comps.length + 1;
    let area = 0, x0 = w, y0 = h, x1 = 0, y1 = 0;
    stack.push(start); label[start] = id;
    while (stack.length) {
      const p = stack.pop(); area++;
      const x = p % w, y = (p / w) | 0;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const q = ny * w + nx;
        if (mask[q] && !label[q]) { label[q] = id; stack.push(q); }
      }
    }
    comps.push({ id, area, x0, y0, x1, y1 });
  }
  return { label, comps };
}

/* ---------- outline (marching squares -> closed loops) ---------- */
function contours(mask, w, h) {
  const W = w + 2, H = h + 2;
  const m = new Uint8Array(W * H);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) m[(y + 1) * W + x + 1] = mask[y * w + x];
  const adj = new Map();
  const key = (x, y) => x * 100000 + y;
  const link = (ax, ay, bx, by) => {
    const a = key(ax, ay), b = key(bx, by);
    (adj.get(a) ?? adj.set(a, []).get(a)).push(b);
    (adj.get(b) ?? adj.set(b, []).get(b)).push(a);
  };
  for (let y = 0; y < H - 1; y++) for (let x = 0; x < W - 1; x++) {
    const a = m[y * W + x], b = m[y * W + x + 1], c = m[(y + 1) * W + x + 1], d = m[(y + 1) * W + x];
    const idx = a * 8 + b * 4 + c * 2 + d;
    if (idx === 0 || idx === 15) continue;
    const T = [2 * x + 1, 2 * y], R = [2 * x + 2, 2 * y + 1], B = [2 * x + 1, 2 * y + 2], L = [2 * x, 2 * y + 1];
    const seg = (p, q) => link(p[0], p[1], q[0], q[1]);
    switch (idx) {
      case 1: case 14: seg(L, B); break;
      case 2: case 13: seg(B, R); break;
      case 3: case 12: seg(L, R); break;
      case 4: case 11: seg(T, R); break;
      case 5: seg(T, L); seg(B, R); break;
      case 6: case 9: seg(T, B); break;
      case 7: case 8: seg(T, L); break;
      case 10: seg(T, R); seg(L, B); break;
    }
  }
  const seen = new Set();
  const loops = [];
  for (const start of adj.keys()) {
    if (seen.has(start)) continue;
    const loop = [];
    let prev = -1, cur = start;
    while (!seen.has(cur)) {
      seen.add(cur);
      loop.push([((cur / 100000) | 0) / 2 - 1.5, (cur % 100000) / 2 - 1.5]);
      const next = adj.get(cur).find(n => n !== prev && !seen.has(n)) ?? adj.get(cur).find(n => n !== prev);
      prev = cur; cur = next;
      if (cur === undefined) break;
    }
    if (loop.length > 8) loops.push(loop);
  }
  return loops;
}

function rdp(points, eps) {
  if (points.length < 3) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [s, e] = stack.pop();
    const [ax, ay] = points[s], [bx, by] = points[e];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
    let best = -1, bi = -1;
    for (let i = s + 1; i < e; i++) {
      const d = Math.abs((points[i][0] - ax) * dy - (points[i][1] - ay) * dx) / len;
      if (d > best) { best = d; bi = i; }
    }
    if (best > eps) { keep[bi] = 1; stack.push([s, bi], [bi, e]); }
  }
  return points.filter((_, i) => keep[i]);
}

/** RDP for open polylines, including loops whose first and last point coincide. */
function rdpLine(pts, eps) {
  const a = pts[0], b = pts[pts.length - 1];
  if (pts.length < 4 || Math.hypot(a[0] - b[0], a[1] - b[1]) > 1.5) return rdp(pts, eps);
  let far = 1, fd = -1;
  for (let i = 1; i < pts.length - 1; i++) { const d = Math.hypot(pts[i][0] - a[0], pts[i][1] - a[1]); if (d > fd) { fd = d; far = i; } }
  return [...rdp(pts.slice(0, far + 1), eps).slice(0, -1), ...rdp(pts.slice(far), eps)];
}

function simplifyClosed(loop, eps) {
  let far = 0, fd = -1;
  for (let i = 1; i < loop.length; i++) { const d = Math.hypot(loop[i][0] - loop[0][0], loop[i][1] - loop[0][1]); if (d > fd) { fd = d; far = i; } }
  const a = rdp(loop.slice(0, far + 1), eps), b = rdp([...loop.slice(far), loop[0]], eps);
  return [...a.slice(0, -1), ...b.slice(0, -1)];
}

/** Smooth closed path: quadratic curves through edge midpoints, hard corners where the outline turns sharply. */
function smoothPath(loop, t) {
  const n = loop.length;
  const P = loop.map(([x, y]) => t(x, y));
  const f = v => (Math.round(v * 10) / 10).toString();
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const corner = i => {
    const p = P[(i - 1 + n) % n], c = P[i], q = P[(i + 1) % n];
    const a1 = Math.atan2(c[1] - p[1], c[0] - p[0]), a2 = Math.atan2(q[1] - c[1], q[0] - c[0]);
    let d = Math.abs(a2 - a1); if (d > Math.PI) d = 2 * Math.PI - d;
    return d > 0.95;
  };
  const start = mid(P[n - 1], P[0]);
  let d = `M${f(start[0])} ${f(start[1])}`;
  for (let i = 0; i < n; i++) {
    const o = mid(P[i], P[(i + 1) % n]);
    d += corner(i) ? `L${f(P[i][0])} ${f(P[i][1])}L${f(o[0])} ${f(o[1])}` : `Q${f(P[i][0])} ${f(P[i][1])} ${f(o[0])} ${f(o[1])}`;
  }
  return d + "Z";
}

/* ---------- skeleton (half resolution) ---------- */
function halve(mask, w, h) {
  const hw = (w / 2) | 0, hh = (h / 2) | 0, out = new Uint8Array(hw * hh);
  for (let y = 0; y < hh; y++) for (let x = 0; x < hw; x++) {
    const s = mask[2 * y * w + 2 * x] + mask[2 * y * w + 2 * x + 1] + mask[(2 * y + 1) * w + 2 * x] + mask[(2 * y + 1) * w + 2 * x + 1];
    out[y * hw + x] = s >= 2 ? 1 : 0;
  }
  return { hw, hh, out };
}

function thin(src, w, h) {
  const img = Uint8Array.from(src);
  const nb = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
  let changed = true;
  while (changed) {
    changed = false;
    for (let step = 0; step < 2; step++) {
      const del = [];
      for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        if (!img[i]) continue;
        const p = nb.map(([dx, dy]) => img[(y + dy) * w + x + dx]);
        const B = p.reduce((a, b) => a + b, 0);
        if (B < 2 || B > 6) continue;
        let A = 0; for (let k = 0; k < 8; k++) if (!p[k] && p[(k + 1) % 8]) A++;
        if (A !== 1) continue;
        if (step === 0 ? (p[0] * p[2] * p[4] || p[2] * p[4] * p[6]) : (p[0] * p[2] * p[6] || p[0] * p[4] * p[6])) continue;
        del.push(i);
      }
      if (del.length) changed = true;
      for (const i of del) img[i] = 0;
    }
  }
  return img;
}

/** Remove redundant pixels: a skeleton pixel whose neighbours already touch each other (8-connected) adds nothing. */
function tidy(sk, w, h) {
  let changed = true;
  while (changed) {
    changed = false;
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      if (!sk[i]) continue;
      const near = [];
      for (const [dx, dy] of N8) if (sk[(y + dy) * w + x + dx]) near.push([dx, dy]);
      if (near.length < 2) continue;
      const parent = near.map((_, k) => k);
      const find = k => (parent[k] === k ? k : (parent[k] = find(parent[k])));
      for (let a = 0; a < near.length; a++) for (let b = a + 1; b < near.length; b++) if (Math.max(Math.abs(near[a][0] - near[b][0]), Math.abs(near[a][1] - near[b][1])) <= 1) parent[find(a)] = find(b);
      if (new Set(near.map((_, k) => find(k))).size === 1) { sk[i] = 0; changed = true; }
    }
  }
}

function distance(mask, w, h) {
  const d = new Float32Array(w * h);
  const BIG = 1e6;
  for (let i = 0; i < w * h; i++) d[i] = mask[i] ? BIG : 0;
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = y * w + x; if (!d[i]) continue;
    d[i] = Math.min(d[i], d[i - 1] + 1, d[i - w] + 1, d[i - w - 1] + 1.414, d[i - w + 1] + 1.414);
  }
  for (let y = h - 2; y > 0; y--) for (let x = w - 2; x > 0; x--) {
    const i = y * w + x; if (!d[i]) continue;
    d[i] = Math.min(d[i], d[i + 1] + 1, d[i + w] + 1, d[i + w + 1] + 1.414, d[i + w - 1] + 1.414);
  }
  return d;
}

const N8 = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
function neighbours(sk, w, h, i) {
  const x = i % w, y = (i / w) | 0, out = [];
  for (const [dx, dy] of N8) { const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < w && ny < h && sk[ny * w + nx]) out.push(ny * w + nx); }
  return out;
}

function prune(sk, w, h, spur) {
  for (let round = 0; round < 3; round++) {
    for (let i = 0; i < w * h; i++) {
      if (!sk[i] || neighbours(sk, w, h, i).length !== 1) continue;
      const trail = [i]; let prev = -1, cur = i, hitJunction = false;
      while (trail.length <= spur) {
        const nxt = neighbours(sk, w, h, cur).filter(n => n !== prev && !trail.includes(n));
        if (nxt.length === 0) break;
        if (nxt.length > 1) { hitJunction = true; break; }
        prev = cur; cur = nxt[0]; trail.push(cur);
        if (neighbours(sk, w, h, cur).length >= 3) { hitJunction = true; trail.pop(); break; }
      }
      if (hitJunction && trail.length < spur) for (const p of trail) sk[p] = 0;
    }
  }
}

/** Skeleton pixels -> ordered polylines (right to left, straightest continuation first). */
function strokes(sk, w, h) {
  const deg = new Map();
  const idxs = [];
  for (let i = 0; i < w * h; i++) if (sk[i]) { idxs.push(i); deg.set(i, neighbours(sk, w, h, i).length); }
  const isNode = i => deg.get(i) !== 2;
  const used = new Set();
  const edges = [];
  const trace = (a, first) => {
    const pts = [a, first]; let prev = a, cur = first;
    while (!isNode(cur)) {
      const nxt = neighbours(sk, w, h, cur).find(n => n !== prev && !(pts.length > 2 && n === pts[pts.length - 3]));
      if (nxt === undefined) break;
      prev = cur; cur = nxt; pts.push(cur);
      if (pts.length > 100000) break;
    }
    return pts;
  };
  const edgeKey = pts => Math.min(pts[0], pts[pts.length - 1]) + ":" + Math.max(pts[0], pts[pts.length - 1]) + ":" + pts.length;
  const seenEdges = new Set();
  for (const i of idxs) {
    if (!isNode(i)) continue;
    for (const n of neighbours(sk, w, h, i)) {
      const pts = trace(i, n);
      const k = edgeKey(pts);
      if (seenEdges.has(k) || pts.length < 2) continue;
      seenEdges.add(k); edges.push(pts);
    }
  }
  // pure loops (no nodes)
  const covered = new Set(edges.flat());
  for (const i of idxs) if (!covered.has(i) && deg.get(i) === 2) {
    const pts = trace(i, neighbours(sk, w, h, i)[0]); pts.forEach(p => covered.add(p)); edges.push(pts);
  }
  // cluster adjacent junction pixels into one node id
  const nodeOf = new Map();
  let nid = 0;
  for (const e of edges) for (const end of [e[0], e[e.length - 1]]) if (!nodeOf.has(end)) {
    const q = [end]; nodeOf.set(end, nid);
    while (q.length) { const p = q.pop(); for (const n of neighbours(sk, w, h, p)) if (isNode(n) && !nodeOf.has(n)) { nodeOf.set(n, nid); q.push(n); } }
    nid++;
  }
  const incident = new Map();
  edges.forEach((e, ei) => { for (const end of [e[0], e[e.length - 1]]) { const k = nodeOf.get(end); (incident.get(k) ?? incident.set(k, []).get(k)).push(ei); } });
  const px = i => [i % w, (i / w) | 0];
  const dirAt = (pts, atStart) => { const a = px(atStart ? pts[0] : pts[pts.length - 1]), b = px(atStart ? pts[Math.min(8, pts.length - 1)] : pts[Math.max(pts.length - 9, 0)]); return Math.atan2(b[1] - a[1], b[0] - a[0]); };
  const visited = new Set();
  const out = [];
  const walk = (node, inAngle) => {
    const cand = (incident.get(node) ?? []).filter(ei => !visited.has(ei)).map(ei => {
      const e = edges[ei]; const fromStart = nodeOf.get(e[0]) === node;
      const pts = fromStart ? e : [...e].reverse();
      const a = dirAt(pts, true); let turn = inAngle == null ? 0 : Math.abs(a - (inAngle + Math.PI)); if (turn > Math.PI) turn = 2 * Math.PI - turn;
      return { ei, pts, turn };
    }).sort((p, q) => p.turn - q.turn);
    for (const c of cand) {
      if (visited.has(c.ei)) continue;
      visited.add(c.ei);
      out.push(c.pts);
      const last = c.pts[c.pts.length - 1];
      walk(nodeOf.get(last), dirAt(c.pts, false) + Math.PI - Math.PI);
    }
  };
  // components ordered right to left, each started at its rightmost endpoint
  const nodes = [...incident.keys()];
  const rep = new Map(); for (const [p, k] of nodeOf) if (!rep.has(k)) rep.set(k, px(p));
  const compOf = new Map(); let cc = 0;
  for (const k of nodes) if (!compOf.has(k)) { const q = [k]; compOf.set(k, cc); while (q.length) { const c = q.pop(); for (const ei of incident.get(c)) for (const end of [edges[ei][0], edges[ei][edges[ei].length - 1]]) { const m = nodeOf.get(end); if (!compOf.has(m)) { compOf.set(m, cc); q.push(m); } } } cc++; }
  const groups = Array.from({ length: cc }, () => []);
  for (const k of nodes) groups[compOf.get(k)].push(k);
  const rightmost = g => g.reduce((best, k) => (rep.get(k)[0] > rep.get(best)[0] ? k : best), g[0]);
  const endpoints = g => g.filter(k => incident.get(k).length === 1);
  const order = groups.map(g => { const e = endpoints(g); return rightmost(e.length ? e : g); }).sort((a, b) => rep.get(b)[0] - rep.get(a)[0]);
  for (const start of order) walk(start, null);
  return out;
}

/* ---------- main ---------- */
function build(word, file) {
  const { w, h, mask } = loadMask(`${SOURCE_DIR}/${file}`);
  const { label, comps } = components(mask, w, h);
  const biggest = Math.max(...comps.map(c => c.area));
  const dots = comps.filter(c => c.area < biggest * DOT_AREA);
  const body = comps.filter(c => c.area >= biggest * DOT_AREA);
  const bx0 = Math.min(...comps.map(c => c.x0)), by0 = Math.min(...comps.map(c => c.y0));
  const bx1 = Math.max(...comps.map(c => c.x1)), by1 = Math.max(...comps.map(c => c.y1));
  const s = Math.min((VIEW_W - 2 * MARGIN) / (bx1 - bx0 + 1), (VIEW_H - 2 * MARGIN) / (by1 - by0 + 1));
  const ox = (VIEW_W - (bx1 - bx0 + 1) * s) / 2, oy = (VIEW_H - (by1 - by0 + 1) * s) / 2;
  const t = (x, y) => [(x - bx0) * s + ox, (y - by0) * s + oy];
  const only = ids => { const m = new Uint8Array(w * h); for (let i = 0; i < w * h; i++) if (ids.has(label[i])) m[i] = 1; return m; };
  const loopsPath = m => contours(m, w, h).map(l => smoothPath(simplifyClosed(l, 1.1), t)).join("");
  const bodyMask = only(new Set(body.map(c => c.id)));
  const outline = loopsPath(bodyMask);
  const dotPaths = dots.map(c => loopsPath(only(new Set([c.id]))));

  // pen centre-line
  const { hw, hh, out: half } = halve(bodyMask, w, h);
  const sk = thin(half, hw, hh);
  tidy(sk, hw, hh);
  prune(sk, hw, hh, 3);
  const dist = distance(half, hw, hh);
  const polylines = strokes(sk, hw, hh);
  const pen = [];
  for (const line of polylines) {
    const pts = rdpLine(line.map(i => [(i % hw) * 2 + 1, ((i / hw) | 0) * 2 + 1, dist[i]]), 1.6);
    let chunk = [pts[0]], len = 0;
    const flush = () => {
      if (chunk.length < 2) return;
      const wd = Math.max(...chunk.map(p => p[2])) * 2 * 2 * 1.3 * s + 6;
      const d = chunk.map((p, k) => { const [x, y] = t(p[0], p[1]); return `${k ? "L" : "M"}${Math.round(x * 10) / 10} ${Math.round(y * 10) / 10}`; }).join("");
      pen.push({ d, width: Math.round(Math.max(wd, 10)) });
    };
    for (let k = 1; k < pts.length; k++) {
      const seg = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]) / 2;
      chunk.push(pts[k]); len += seg;
      if (len >= PEN_CHUNK) { flush(); chunk = [pts[k]]; len = 0; }
    }
    flush();
  }
  console.log(`${word}: components ${comps.length} (dots ${dots.length}), outline ${outline.length}B, pen ${pen.length} strokes, dots ${dotPaths.length}`);
  return { id: word, viewBox: "0 0 1200 400", outline, pen, dots: dotPaths };
}

function svgFor(data) {
  const penPaths = data.pen.map(p => `<path d="${p.d}" stroke-width="${p.width}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${data.viewBox}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">` +
    `<defs><mask id="ink-pen-${data.id}" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="400"><g id="pen" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round">${penPaths}</g></mask></defs>` +
    `<g mask="url(#ink-pen-${data.id})"><path fill="currentColor" fill-rule="evenodd" d="${data.outline}"/></g>` +
    `<g id="dots" fill="currentColor" fill-rule="evenodd">${data.dots.map(d => `<path d="${d}"/>`).join("")}</g></svg>\n`;
}

mkdirSync(SVG_DIR, { recursive: true });
const result = {};
for (const [word, file] of Object.entries(WORDS)) {
  const data = build(word, file);
  result[word] = data;
  writeFileSync(`${SVG_DIR}/${word}.svg`, svgFor(data));
}
const header = `/** Traced Thuluth calligraphy. GENERATED by scripts/calligraphy-build.mjs from public/media/calligraphy/source/*. Do not edit by hand. */
export type CalligraphyWord = {
  id: string;
  viewBox: "0 0 1200 400";
  /** Filled outline of the word (the visible artwork), even-odd. */
  outline: string;
  /** Pen centre-lines in writing order (right to left); \`width\` is the mask stroke width that fully covers the letter. */
  pen: readonly { d: string; width: number }[];
  /** Dots and marks, revealed last. */
  dots: readonly string[];
};
`;
writeFileSync("src/lib/calligraphy-data.ts", header + `export const calligraphy: Readonly<Record<string, CalligraphyWord>> = ${JSON.stringify(result)};\n`);
console.log("wrote", Object.keys(result).length, "words");
