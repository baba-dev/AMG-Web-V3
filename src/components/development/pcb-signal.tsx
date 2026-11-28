import { buildPcb, type Pcb } from "./pcb-traces";
import { PcbRunner } from "./pcb-runner";
import "./pcb-signal.css";

const wide = buildPcb(1600, 900, 1180, 450, 240);
const tall = buildPcb(800, 1500, 400, 1080, 280);

function Board({ pcb, layout }: { pcb: Pcb; layout: "wide" | "tall" }) {
  const { chip } = pcb;
  return <svg className="tech-pcb" data-layout={layout} viewBox={`0 0 ${pcb.w} ${pcb.h}`} preserveAspectRatio={layout === "wide" ? "xMaxYMid slice" : "xMidYMax slice"} focusable="false">
    <g className="tech-pcb__board" fill="none">
      {pcb.traces.map((d, i) => <path key={i} className="tech-pcb__trace" d={d}/>)}
      {pcb.vias.map(([x, y], i) => <g key={i} className="tech-pcb__via"><circle cx={x} cy={y} r="5.5"/><circle cx={x} cy={y} r="1.8" className="tech-pcb__via-dot"/></g>)}
      <g className="tech-pcb__chip">
        <rect x={chip.x} y={chip.y} width={chip.size} height={chip.size} rx="10"/>
        <rect x={chip.x + chip.size * 0.18} y={chip.y + chip.size * 0.18} width={chip.size * 0.64} height={chip.size * 0.64} rx="5"/>
        <circle cx={chip.x + 20} cy={chip.y + 20} r="4"/>
        {chip.pins.map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}/>)}
      </g>
    </g>
    <g className="tech-pcb__signals" fill="none">
      {pcb.pulses.map((p, i) => {
        const style = { "--dur": p.dur + "s", "--delay": p.delay + "s" } as React.CSSProperties;
        return <g key={i} className={"tech-pcb__signal tech-pcb__signal--" + p.tone} style={style}>
          <path className="tech-pcb__tail" d={p.d} pathLength={100}/>
          <path className="tech-pcb__pulse" d={p.d} pathLength={100}/>
        </g>;
      })}
    </g>
  </svg>;
}

/** Faint circuit board behind the hero with signals travelling endlessly along the traces. Decorative. */
export function PcbSignal() {
  return <div className="tech-hero__pcb" aria-hidden="true" data-running="true">
    <Board pcb={wide} layout="wide"/>
    <Board pcb={tall} layout="tall"/>
    <PcbRunner/>
  </div>;
}
