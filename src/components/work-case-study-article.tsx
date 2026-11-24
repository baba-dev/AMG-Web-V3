import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { FeaturedWorkProject } from "@/lib/work/projects";
import { workProjects } from "@/lib/work/projects";
import { getShowcaseChapter } from "@/lib/work/case-study-showcase";
import type { EditorialStory } from "@/lib/work/case-studies";

type Props={project:FeaturedWorkProject;story:EditorialStory;index:number};

export function WorkCaseStudyArticle({project,story,index}:Props){
 const previous=workProjects[(index-1+workProjects.length)%workProjects.length];
 const next=workProjects[(index+1)%workProjects.length];
 const showcase=getShowcaseChapter(project.slug);
 const isLimited=story.confidence==="limited";
 return <>
  <section className="work-project__hero case-hero work-page__gutter" aria-labelledby="project-heading">
    <div className="work-project__top case-hero__navigation">
      <Link href="/work"><ArrowLeft size={19} aria-hidden="true"/> ALL WORK</Link>
      <span>AIWA / PROJECT {String(index+1).padStart(2,"0")} OF {String(workProjects.length).padStart(2,"0")}</span>
    </div>
    <div className="case-hero__eyebrow">
      <span>{story.hero.overline}</span><span>{project.discipline}</span>
    </div>
    <h1 id="project-heading">{project.client}</h1>
    <p className="case-hero__display">
      <span>{story.hero.line1}</span><span><em>{story.hero.line2}</em></span>
    </p>
    <div className="case-hero__bottom">
      <p>{story.hero.descriptor}</p>
      <a href="#case-brief" aria-label="Skip to the project brief">EXPLORE THE STORY <ArrowDown size={22} aria-hidden="true"/></a>
    </div>
  </section>
  <figure className="work-project__visual case-media" aria-labelledby="case-media-description">
    <div className="work-project__art case-media__stage">
      <Image src={project.artwork} alt={project.alt} width={960} height={740}
        unoptimized priority sizes="100vw"/>
      <span className="work-project__art-index">AIWA / ORIGINAL EDITORIAL STUDY / {story.visual.motif}</span>
      <span className="case-media__frame-index" aria-hidden="true">0{index+1} / 0{workProjects.length}</span>
    </div>
    <figcaption id="case-media-description" className="case-media__caption work-page__gutter">
      <span>VISUAL STUDY / 01</span>
      <span>{story.visual.caption}</span>
    </figcaption>
  </figure>
  <section id="case-brief" className="work-project__story case-context work-page__gutter"
    aria-labelledby="case-context-heading">
    <div className="case-context__rail">
      <span className="work-page__eyebrow">{story.brief.eyebrow}</span>
      <p>AIWA MEDIA GROUP / MUSCAT</p>
    </div>
    <div className="case-context__content">
      <h2 id="case-context-heading">{story.brief.title}</h2>
      <p className="case-context__lead">{story.context}</p>
      <p>{story.brief.body}</p>
      <dl>
        <div><dt>CLIENT</dt><dd>{project.client}</dd></div>
        <div><dt>DISCIPLINE</dt><dd>{project.discipline}</dd></div>
        <div><dt>EDITORIAL STATUS</dt><dd>{isLimited?"PUBLIC CLIENT PROFILE":"PUBLISHED PROJECT SCOPE"}</dd></div>
      </dl>
    </div>
  </section>
  <section className="case-idea work-page__gutter" aria-labelledby="case-idea-heading">
    <div className="case-idea__top">
      <span>{story.idea.eyebrow}</span>
      <span>{story.visual.motif}</span>
    </div>
    <h2 id="case-idea-heading">{story.idea.title}</h2>
    <div className="case-idea__bottom">
      <p>{story.idea.body}</p>
      <span aria-hidden="true">✳</span>
    </div>
  </section>
  {showcase && showcase.metrics.length>0 && <section className="case-historical-results work-page__gutter" aria-labelledby="case-results-title">
    <span className="work-page__eyebrow">HISTORICAL / REPORTED RESULTS</span><h2 id="case-results-title">THE IMPACT.</h2>
    <p>{showcase.response}</p><dl>{showcase.metrics.map(metric=><div key={metric.label}><dt>{metric.label} · {metric.period}</dt><dd>{metric.display}</dd></div>)}</dl>
    <p>Historical figures reported in Aiwa’s legacy case study; not independently audited.</p>
    <Link href="/work/case-studies" className="case-showcase-link">EXPLORE THE IMPACT SHOWCASE <ArrowUpRight size={20} aria-hidden="true"/></Link>
  </section>}
  <section className="case-deliverables work-page__gutter" aria-labelledby="case-work-heading">
    <div className="case-deliverables__heading">
      <span className="work-page__eyebrow">03 / {isLimited?"THE PUBLIC RECORD":"THE WORK"}</span>
      <h2 id="case-work-heading">{isLimited?"WHAT WE":"WHAT WE"}<br/><em>{isLimited?"KNOW.":"MADE."}</em></h2>
      <p>{isLimited
        ?"Only information explicitly supported by Aiwa's published portfolio is shown here. Specific campaign deliverables are not yet verified."
        :"These are the areas of work that Aiwa identifies in its published project and service records."}</p>
    </div>
    <ol className="case-deliverables__list">
      {story.deliverables.map((deliverable,number)=><li key={deliverable.name}>
        <span>{String(number+1).padStart(2,"0")} / {String(story.deliverables.length).padStart(2,"0")}</span>
        <h3>{deliverable.name}</h3>
        <p>{deliverable.description}</p>
        <ArrowUpRight size={23} aria-hidden="true"/>
      </li>)}
    </ol>
  </section>
  <section className="case-visual-study" aria-labelledby="case-visual-heading">
    <div className="case-visual-study__header work-page__gutter">
      <span>04 / AN EDITORIAL EXPLORATION</span>
      <h2 id="case-visual-heading">{story.visual.panelTitle}</h2>
    </div>
    <div className="case-visual-study__grid">
      <figure className="case-visual-study__image">
        <Image src={project.artwork} alt={"Alternate crop of "+project.client+" conceptual illustration"}
          width={960} height={740} unoptimized loading="lazy" sizes="(max-width:767px) 100vw, 65vw"/>
        <figcaption>THE EDIT / ORIGINAL CONCEPT ART</figcaption>
      </figure>
      <div className="case-visual-study__type" aria-label="Typographic editorial board">
        <span>AIWA / STUDIO / {String(index+1).padStart(2,"0")}</span>
        <strong>{story.visual.panelTitle}</strong>
        <p>{story.visual.caption}</p>
        <span>CREATIVE EXPLORATION / NOT CLIENT OUTPUT</span>
      </div>
    </div>
  </section>
  <section className="case-conclusion work-page__gutter" aria-labelledby="case-closing-heading">
    <span className="work-page__eyebrow">05 / THE TAKEAWAY</span>
    <h2 id="case-closing-heading">{story.closing.headline}</h2>
    <p>{story.closing.body}</p>
  </section>
  <aside className="case-sources work-page__gutter" aria-label="Project sources and editorial disclosure">
    <div>
      <span className="work-page__eyebrow">DOCUMENTATION / SOURCES</span>
      <p>Project descriptions are based on Aiwa's publicly documented work. Editorial illustrations are original conceptual designs and are not photographs, approved campaign deliverables or performance evidence. Any historical results shown are attributed to Aiwa’s legacy case study, not independent audit evidence.</p>
    </div>
    <div className="case-sources__links">
      {story.sources.map((source,number)=><a key={source.href} href={source.href}
        className={number===0?"work-project__source":"case-sources__link"}
        target="_blank" rel="noopener noreferrer">
        <span>{source.label}</span><ArrowUpRight size={20} aria-hidden="true"/>
      </a>)}
    </div>
  </aside>
  <nav className="work-project__next case-next work-page__gutter" aria-label="Browse projects">
    <Link href={"/work/"+previous.slug}><ArrowLeft size={22} aria-hidden="true"/> PREVIOUS PROJECT<span>{previous.client}</span></Link>
    <Link href={"/work/"+next.slug}>NEXT PROJECT <ArrowRight size={22} aria-hidden="true"/><span>{next.client}</span></Link>
  </nav>
  <section className="work-page__outro case-cta work-page__gutter" aria-labelledby="case-cta-heading">
    <span className="work-page__eyebrow">GOT SOMETHING OF YOUR OWN IN MIND?</span>
    <h2 id="case-cta-heading">YOUR MOVE.<br/><em>OUR ENERGY.</em></h2>
    <a href="/contact" className="work-page__contact-link">START A CONVERSATION <ArrowUpRight size={25} aria-hidden="true"/></a>
  </section>
 </>;
}
