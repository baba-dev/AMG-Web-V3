"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { workProjects } from "@/lib/work/projects";
import { directoryCategory, workVisuals, directoryCategories, isDirectoryCategory, type DirectoryCategory } from "@/lib/work/directory";
import "./work-gallery.css";

export function WorkGallery() {
 const [category,setCategory]=useState<DirectoryCategory>("all");
 useEffect(()=>{
   const restore=()=>{
     const next=new URL(window.location.href).searchParams.get("category");
     setCategory(isDirectoryCategory(next)?next:"all");
   };
   restore();
   window.addEventListener("popstate",restore);
   return ()=>window.removeEventListener("popstate",restore);
 },[]);
 const filtered=category==="all"?workProjects:workProjects.filter(p=>directoryCategory(p)===category);
 const selectCategory=(next:DirectoryCategory)=>{
   const url=new URL(window.location.href);
   if(next==="all")url.searchParams.delete("category"); else url.searchParams.set("category",next);
   window.history.pushState(null,"",url.pathname+url.search+url.hash);
   setCategory(next);
 };
 useEffect(()=>{
   const list=document.querySelector<HTMLElement>(".work-gallery__list");
   if(!list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
   const nodes=Array.from(list.querySelectorAll<HTMLElement>(".work-gallery__item"));
   const observer=new IntersectionObserver(entries=>{
     for(const entry of entries)if(entry.isIntersecting)(entry.target as HTMLElement).dataset.entered="true";
   },{threshold:.08,rootMargin:"0px 0px -5% 0px"});
   nodes.forEach(node=>observer.observe(node));
   list.dataset.enhanced="true";
   return ()=>observer.disconnect();
 },[category]);
 return (
 <section className="work-gallery" aria-label="Selected Aiwa projects" data-work-gallery data-filter={category}>
  <div className="work-gallery__tools work-page__gutter">
   <span>PROJECTS / {String(workProjects.length).padStart(2,"0")}</span>
   <span>AN EDITORIAL SELECTION</span>
  </div>
  <div className="work-gallery__filterbar work-page__gutter">
   <div className="work-gallery__filters" role="group" aria-label="Filter projects by discipline">
    {directoryCategories.map(option=>{
      const count=option.id==="all"?workProjects.length:workProjects.filter(p=>directoryCategory(p)===option.id).length;
      return <button key={option.id} type="button" onClick={()=>selectCategory(option.id)}
        aria-pressed={category===option.id} className={category===option.id?"is-active":""}
        data-filter-button={option.id}>
        {option.label} <span>{String(count).padStart(2,"0")}</span>
      </button>;
    })}
   </div>
   <p aria-live="polite" aria-atomic="true" className="work-gallery__count">{filtered.length} {filtered.length===1?"PROJECT":"PROJECTS"} SHOWN</p>
  </div>
  <ol className="work-gallery__list work-page__gutter" id="work-projects">
   {filtered.map((project,index)=>(
    <li key={project.slug} className={"work-gallery__item work-gallery__item--"+project.slug}
      data-work-project={project.slug} data-category={directoryCategory(project)}>
      <a className="work-gallery__link" href={project.href} target="_blank" rel="noopener noreferrer"
        aria-label={"Explore "+project.client+" on Aiwa's published portfolio (opens a new tab)"}>
       <div className="work-gallery__art" style={{backgroundColor:workVisuals[project.slug].accent}}>
        <Image src={project.artwork} alt={project.alt} width={960} height={740} unoptimized loading="lazy"
          sizes="(max-width: 767px) 100vw, (max-width: 1100px) 48vw, 90vw"/>
        <span className="work-gallery__art-index">0{workProjects.findIndex((item)=>item.slug===project.slug)+1} / 0{workProjects.length}</span>
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
