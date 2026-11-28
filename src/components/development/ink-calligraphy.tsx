import { calligraphy } from "@/lib/calligraphy-data";
import { InkWriter } from "./ink-writer";
import "./ink.css";

/**
 * Decorative Thuluth word, rendered on the server so the path data never ships in the client bundle.
 * Fully drawn by default (no-JS and reduced motion see the finished word); `InkWriter` arms and plays the pen
 * write-on on the client. Renders nothing if the word has not been generated.
 */
export function InkCalligraphy({ word, variant, className = "" }: { word: string; variant: "background" | "header"; className?: string }) {
  const data = calligraphy[word];
  if (!data) return null;
  const id = `ink-${word}-${variant}`;
  const maskId = `${id}-mask`;
  return <>
    <svg id={id} className={`tech-ink tech-ink--${variant} ${className}`.trim()} viewBox={data.viewBox} aria-hidden="true" focusable="false" data-ink={word}>
      <defs><mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="400">
        <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
          {data.pen.map((p, i) => <path key={i} data-pen d={p.d} strokeWidth={p.width}/>)}
        </g>
      </mask></defs>
      <g mask={`url(#${maskId})`}><path d={data.outline} fill="currentColor" fillRule="evenodd"/></g>
      <g fill="currentColor" fillRule="evenodd">{data.dots.map((d, i) => <path key={i} data-dot d={d} style={{ transformBox: "fill-box", transformOrigin: "center" }}/>)}</g>
    </svg>
    <InkWriter targetId={id}/>
  </>;
}
