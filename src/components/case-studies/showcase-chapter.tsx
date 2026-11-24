import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { legacyCaseSource, type ShowcaseChapter as Chapter } from "@/lib/work/case-study-showcase";
import { ShowcaseMetrics } from "./showcase-metrics";
import { ShowcaseGallery } from "./showcase-gallery";
export function ShowcaseChapter({chapter,index}: {chapter:Chapter;index:number}) {
  const isBrand=chapter.status==="featured-brand";
  return <article id={chapter.slug} data-showcase-chapter={chapter.slug} className={"cs-chapter cs-"+chapter.slug} aria-labelledby={chapter.slug+"-heading"}>
    <div className="cs-chapter-top cs-gutter"><span className="cs-label">0{index+1} / {isBrand?"FEATURED BRAND":"CASE STUDY"}</span><span className="cs-label">{chapter.category}</span></div>
    <div className="cs-chapter-cover cs-gutter">
      <div className="cs-chapter-copy"><p className="cs-client">{chapter.name}</p><h2 id={chapter.slug+"-heading"}><span>{chapter.headline[0]}</span><em>{chapter.headline[1]}</em></h2><p>{chapter.intro}</p></div>
      <figure className="cs-chapter-art"><Image src={chapter.art} alt="" width={1000} height={670} sizes="(max-width: 767px) 100vw, 55vw" unoptimized/><figcaption className="cs-label">ORIGINAL EDITORIAL ILLUSTRATION / NOT CLIENT OUTPUT</figcaption></figure>
    </div>
    <div className="cs-chapter-body cs-gutter">
      <div className="cs-response"><span className="cs-label">{isBrand?"THE BRAND":"THE RESPONSE"}</span><h3>{isBrand?"Everyday technology.":"Ideas across touchpoints."}</h3><p>{chapter.response}</p>
      {chapter.disciplines.length>0 && <ul className="cs-deliverables">{chapter.disciplines.map((discipline,i)=><li key={discipline}><span className="cs-label">0{i+1}</span>{discipline}<span aria-hidden="true">↗</span></li>)}</ul>}
      <Link className="cs-text-link" href={"/work/"+chapter.slug}>EXPLORE THE FULL STORY <ArrowUpRight size={22} aria-hidden="true"/></Link></div>
      <div className="cs-evidence"><ShowcaseMetrics chapter={chapter}/><ShowcaseGallery chapter={chapter}/>{isBrand && <p className="cs-brand-note">Featured in Aiwa’s portfolio. Specific campaign deliverables and results are not attributed to this brand.</p>}</div>
    </div>
    <div className="cs-chapter-foot cs-gutter"><span className="cs-label">AIWA / MUSCAT, OMAN</span><a href={isBrand?"https://aiwamediagroup.com/":legacyCaseSource} target="_blank" rel="noopener noreferrer" className="cs-text-link">PUBLISHED SOURCE <ArrowUpRight size={16} aria-hidden="true"/></a></div>
  </article>;
}
