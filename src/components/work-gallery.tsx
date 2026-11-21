import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { workProjects } from "@/lib/work/projects";
import { directoryCategory, workVisuals } from "@/lib/work/directory";
import "./work-gallery.css";

export function WorkGallery() {
 return (
 <section className="work-gallery" aria-label="Selected Aiwa projects" data-work-gallery>
  <div className="work-gallery__tools work-page__gutter">
   <span>PROJECTS / {String(workProjects.length).padStart(2,"0")}</span>
   <span>AN EDITORIAL SELECTION</span>
  </div>
  <ol className="work-gallery__list work-page__gutter" id="work-projects">
   {workProjects.map((project,index)=>(
    <li key={project.slug} className={"work-gallery__item work-gallery__item--"+project.slug}
      data-work-project={project.slug} data-category={directoryCategory(project)}>
      <a className="work-gallery__link" href={project.href} target="_blank" rel="noopener noreferrer"
        aria-label={"Explore "+project.client+" on Aiwa's published portfolio (opens a new tab)"}>
       <div className="work-gallery__art" style={{backgroundColor:workVisuals[project.slug].accent}}>
        <Image src={project.artwork} alt={project.alt} width={960} height={740} unoptimized loading="lazy"
          sizes="(max-width: 767px) 100vw, (max-width: 1100px) 48vw, 90vw"/>
        <span className="work-gallery__art-index">0{index+1} / 0{workProjects.length}</span>
        <span className="work-gallery__art-open" aria-hidden="true"><ArrowUpRight size={25}/></span>
        <span className="work-gallery__art-mark" aria-hidden="true">{project.visualLabel}</span>
       </div>
       <div className="work-gallery__caption">
        <strong className="work-gallery__client">{project.client}</strong>
        <span className="work-gallery__title">{project.title}</span>
        <span className="work-gallery__discipline">{project.discipline}</span>
       </div>
      </a>
    </li>
   ))}
  </ol>
  <div className="work-gallery__closing work-page__gutter"><span>END OF THE EDIT / MORE TO COME</span><span>AIWA / MUSCAT</span></div>
 </section>
 );
}
