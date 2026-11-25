"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft, ArrowRight, Pause, Play, LayoutGrid, List, Search, X, Maximize2 } from "lucide-react";
import { technologyCategories, technologyProjects, technologyFlagship, getTechnologyProject, type TechnologyProject } from "@/lib/work/technology";
import { TechImage, TechPair } from "./tech-media";

const reel = [technologyFlagship,getTechnologyProject("gwi")!,getTechnologyProject("fxrco")!,getTechnologyProject("menu-minute")!];
export function TechnologyReel() {
  const [index,setIndex]=useState(0);
  const [playing,setPlaying]=useState(false);
  const [visible,setVisible]=useState(false);
  const root=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const node=root.current;
    if(!node || !("IntersectionObserver" in window)) return;
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.25});
    observer.observe(node);
    return ()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    if(!playing||!visible||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    const timer=window.setInterval(()=>setIndex(i=>(i+1)%reel.length),3000);
    return ()=>window.clearInterval(timer);
  },[playing,visible]);
  const move=(direction:number)=>{setPlaying(false);setIndex(i=>(i+direction+reel.length)%reel.length);};
  const project=reel[index];
  return <div className="tech-reel" ref={root}>
    <div key={project.slug} className="tech-reel__frame"><TechPair project={project}/></div>
    <div className="tech-reel__bar">
      <div aria-live={playing?"off":"polite"}><span className="tech-meta">0{index+1} / 0{reel.length}</span><strong>{project.name}</strong></div>
      <div className="tech-controls">
        <button type="button" aria-label="Previous project" onClick={()=>move(-1)}><ArrowLeft size={20}/></button>
        <button type="button" aria-label={playing?"Pause showcase":"Play showcase"} onClick={()=>setPlaying(p=>!p)}>{playing?<Pause size={20}/>:<Play size={20}/>}</button>
        <button type="button" aria-label="Next project" onClick={()=>move(1)}><ArrowRight size={20}/></button>
        <Link href={`/work/technology/${project.slug}`} className="tech-icon-link" aria-label={`View ${project.name} project`}><ArrowUpRight size={20}/></Link>
      </div>
    </div>
  </div>;
}
type Filter=(typeof technologyCategories)[number];
const preferenceKey="aiwa-technology-layout";
const changeEvent="aiwa-technology-preference";
function subscribe(fn:()=>void){window.addEventListener("storage",fn);window.addEventListener(changeEvent,fn);window.addEventListener("popstate",fn);return()=>{window.removeEventListener("storage",fn);window.removeEventListener(changeEvent,fn);window.removeEventListener("popstate",fn);};}
function currentLayout(){try{return localStorage.getItem(preferenceKey)==="grid"?"grid":"list";}catch{return "list";}}
function currentFilter():Filter{const value=new URLSearchParams(location.search).get("type");return technologyCategories.find(c=>c===value)??"All";}
export function TechnologyGallery(){
  const storedLayout=useSyncExternalStore(subscribe,currentLayout,()=>"list");
  const filter=useSyncExternalStore(subscribe,currentFilter,()=>"All");
  const [localLayout,setLocalLayout]=useState<"list"|"grid"|null>(null);
  const layout=localLayout??storedLayout;
  const [query,setQuery]=useState("");
  const [hovered,setHovered]=useState<string|null>(null);
  const matching=technologyProjects.filter(p=>(filter==="All"||p.category===filter)&&[p.name,p.category,p.sector,p.description].join(" ").toLowerCase().includes(query.trim().toLowerCase()));
  const preview=matching.find(p=>p.slug===hovered)??matching[0];
  function changeFilter(value:Filter){const url=new URL(location.href);if(value==="All")url.searchParams.delete("type");else url.searchParams.set("type",value);history.replaceState(history.state,"",url);window.dispatchEvent(new Event(changeEvent));}
  function changeLayout(value:"list"|"grid"){setLocalLayout(value);try{localStorage.setItem(preferenceKey,value);}catch{}window.dispatchEvent(new Event(changeEvent));}
  return <div className="tech-gallery">
    <div className="tech-gallery__tools">
      <div role="group" aria-label="Filter technology projects" className="tech-filter">{technologyCategories.map(c=><button key={c} type="button" aria-pressed={filter===c} onClick={()=>changeFilter(c)}>{c}</button>)}</div>
      <div className="tech-gallery__secondary">
        <label className="tech-search"><Search size={18} aria-hidden="true"/><span className="sr-only">Search projects</span><input type="search" placeholder="Search projects" value={query} onChange={e=>setQuery(e.target.value)}/></label>
        <div className="tech-controls" role="group" aria-label="Portfolio layout">
          <button type="button" aria-label="List view" aria-pressed={layout==="list"} onClick={()=>changeLayout("list")}><List size={20}/></button>
          <button type="button" aria-label="Grid view" aria-pressed={layout==="grid"} onClick={()=>changeLayout("grid")}><LayoutGrid size={20}/></button>
        </div>
      </div>
    </div>
    <p className="tech-meta tech-results" role="status">{matching.length} {matching.length===1?"project":"projects"}</p>
    {matching.length===0?<div className="tech-empty"><h3>No matching projects.</h3><p>Try another name, sector or category.</p><button type="button" className="tech-link" onClick={()=>{setQuery("");changeFilter("All");}}>Clear filters <X size={18}/></button></div>:
      layout==="list"?<div className="tech-index">
        <ol className="tech-index__rows">{matching.map((p,i)=><li key={p.slug}><Link href={`/work/technology/${p.slug}`} onMouseEnter={()=>setHovered(p.slug)} onFocus={()=>setHovered(p.slug)}>
          <span className="tech-meta">{String(i+1).padStart(2,"0")}</span><span><strong>{p.name}</strong><small>{p.sector} / {p.category}</small></span><ArrowUpRight aria-hidden="true" size={23}/>
        </Link></li>)}</ol>
        {preview&&<aside className="tech-index__preview" aria-label="Selected project preview"><TechPair project={preview} compact/><h3>{preview.name}</h3><p>{preview.description}</p><Link href={`/work/technology/${preview.slug}`} className="tech-link">View project <ArrowUpRight size={18}/></Link></aside>}
      </div>:<div className="tech-grid">{matching.map(p=><article key={p.slug} className="tech-card"><Link href={`/work/technology/${p.slug}`}><TechPair project={p} compact/><div className="tech-card__label"><div><span className="tech-meta">{p.sector} / {p.category}</span><h3>{p.name}</h3></div><ArrowUpRight size={24} aria-hidden="true"/></div><p>{p.description}</p></Link></article>)}</div>}
  </div>;
}
type View="paired"|"desktop"|"mobile";
export function TechnologyViewer({project}:{project:TechnologyProject}){
  const [view,setView]=useState<View>("paired");
  const dialog=useRef<HTMLDialogElement>(null);
  const controls=(label:string)=><div className="tech-filter" role="group" aria-label={label}>{(["paired","desktop","mobile"] as const).map(v=><button key={v} type="button" aria-pressed={view===v} onClick={()=>setView(v)}>{v==="paired"?"Both":v==="desktop"?"Desktop":"Mobile"}</button>)}</div>;
  const visual=()=>view==="paired"?<TechPair project={project}/>:<div className={`tech-single tech-single--${view}`}><TechImage project={project} device={view} sizes={view==="desktop"?"92vw":"(max-width: 600px) 85vw, 420px"}/></div>;
  return <div className="tech-viewer">
    <div className="tech-viewer__tools">{controls("Screenshot view")}<button type="button" className="tech-link" onClick={()=>dialog.current?.showModal()}>Expand <Maximize2 size={18}/></button></div>
    {visual()}
    <dialog ref={dialog} className="tech-dialog" aria-labelledby="tech-dialog-title">
      <div className="tech-dialog__top"><h2 id="tech-dialog-title">{project.name}</h2><button type="button" className="tech-icon-link" aria-label="Close screenshot viewer" onClick={()=>dialog.current?.close()}><X size={24}/></button></div>
      {controls("Expanded screenshot view")}{visual()}
    </dialog>
  </div>;
}
