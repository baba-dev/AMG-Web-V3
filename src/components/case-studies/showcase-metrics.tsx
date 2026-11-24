import type { ShowcaseChapter } from "@/lib/work/case-study-showcase";
export function ShowcaseMetrics({chapter}: {chapter: ShowcaseChapter}) {
  if (!chapter.metrics.length) return null;
  const reach = chapter.slug === "casabella-oman";
  const total = chapter.metrics[0].value;
  const organic = reach ? chapter.metrics[1].value : 0;
  return <section className="cs-metrics" aria-label={chapter.name+" historical campaign results"}>
    <div className="cs-metrics-top cs-label"><span>THE IMPACT / HISTORICAL RESULTS</span><span>AIWA ARCHIVE</span></div>
    <div className="cs-metrics-main">
      <div><strong className="cs-metric-number">{chapter.metrics[0].display}</strong><p>{chapter.metrics[0].label} · {chapter.metrics[0].period}</p></div>
      {reach ? <svg viewBox="0 0 320 150" className="cs-data-graphic" role="img" aria-label="35,000 organic reach out of 105,000 total, approximately one third">
        <circle cx="80" cy="75" r="57" stroke="currentColor" strokeOpacity=".22" strokeWidth="16" fill="none"/>
        <circle cx="80" cy="75" r="57" stroke="currentColor" strokeWidth="16" fill="none" pathLength="100" strokeDasharray={organic/total*100+" 100"} transform="rotate(-90 80 75)"/>
        <text x="80" y="82" fill="currentColor" fontSize="24" textAnchor="middle" fontWeight="bold">33%</text>
        <text x="157" y="66" fill="currentColor" fontSize="24" fontWeight="bold">35K</text><text x="157" y="90" fill="currentColor" fontSize="14">organic reach</text>
      </svg> : <svg viewBox="0 0 320 150" className="cs-data-graphic" role="img" aria-label="60 device icons, each representing 50 reported app downloads">
        {Array.from({length:60},(_,i)=><g key={i} transform={"translate("+((i%15)*21+4)+" "+(Math.floor(i/15)*35+6)+")"}><rect width="14" height="25" rx="2" fill="currentColor"/><rect x="2" y="3" width="10" height="17" fill="var(--cs-accent)"/><circle cx="7" cy="22" r="1" fill="var(--cs-accent)"/></g>)}
      </svg>}
    </div>
    <p className="cs-metric-note">{reach ? "Organic reach as a share of reported total; the remaining reach is not classified as paid." : "Each device represents 50 reported downloads."} Figures are historical, reported by Aiwa’s legacy case study; not independently audited.</p>
  </section>;
}
