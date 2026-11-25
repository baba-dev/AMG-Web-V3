"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft, ArrowRight, Pause, Play, LayoutGrid, List, Search, X, Maximize2 } from "lucide-react";
import { technologyCategories, technologyProjects, technologyFlagship, getTechnologyProject, technologyMedia, type TechnologyProject } from "@/lib/work/technology";
import { TechImage, TechPair } from "./tech-media";

const reel = [technologyFlagship,getTechnologyProject("gwi")!,getTechnologyProject("fxrco")!,getTechnologyProject("menu-minute")!];
export function TechnologyReel() {
  const [index,setIndex]=useState(0);
  const [playing,setPlaying]=useState(false);
  const [visible,setVisible]=useState(false);
  const root=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const node=root.current;
    if(!node) return;
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:0});
    observer.observe(node);
    return ()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    if(!playing||!visible)return; // Playback is explicit; reduced-motion users may opt in.
    const timer=window.setInterval(()=>{if(!document.hidden)setIndex(i=>(i+1)%reel.length);},4000);
    return ()=>window.clearInterval(timer);
  },[playing,visible]);
  const move=(direction:number)=>{setPlaying(false);setIndex(i=>(i+direction+reel.length)%reel.length);};
  const project=reel[index];
  return <div className="tech-reel" ref={root} role="region" aria-label="Selected project showcase">
    <div key={project.slug} className="tech-reel__frame"><TechPair project={project}/></div>
    <div className="tech-reel__bar">
      <div aria-live={playing?"off":"polite"}><span className="tech-meta">0{index+1} / 0{reel.length}</span><strong>{project.name}</strong></div>
      <div className="tech-reel__progress" role="group" aria-label="Choose showcase project">{reel.map((p,i)=><button type="button" key={p.slug} aria-label={"Show "+p.name} aria-pressed={index===i} onClick={()=>{setIndex(i);setPlaying(false);}}><span>{String(i+1).padStart(2,"0")}</span></button>)}</div>
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
function currentLayout():"grid"|"list"{try{return localStorage.getItem(preferenceKey)==="grid"?"grid":"list";}catch{return "list";}}
function currentFilter():Filter{const value=new URLSearchParams(location.search).get("type");return technologyCategories.find(c=>c===value)??"All";}
export function TechnologyGallery(){
  const storedLayout=useSyncExternalStore(subscribe,currentLayout,()=>"list");
  const filter=useSyncExternalStore(subscribe,currentFilter,()=>"All");
  const [localLayout,setLocalLayout]=useState<"list"|"grid"|null>(null);
  const layout=localLayout??storedLayout;
  const [query,setQuery]=useState("");
  const [hovered,setHovered]=useState<string|null>(null);
  const terms=query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const matching=technologyProjects.filter(p=>(filter==="All"||p.category===filter)&&terms.every(term=>[p.name,p.category,p.sector,p.description,p.slug].join(" ").toLowerCase().includes(term)));
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
        <ol className="tech-index__rows">{matching.map(p=><li key={p.slug}><Link href={`/work/technology/${p.slug}`} prefetch={false} data-previewed={preview?.slug===p.slug||undefined} onMouseEnter={()=>setHovered(p.slug)} onFocus={()=>setHovered(p.slug)}>
          <span className="tech-meta">{String(technologyProjects.indexOf(p)+1).padStart(2,"0")}</span><span className="tech-index__thumb" aria-hidden="true"><TechImage project={p} device="desktop" sizes="76px" decorative/></span><span><strong>{p.name}</strong><small>{p.sector} / {p.category}</small></span><ArrowUpRight aria-hidden="true" size={23}/>
        </Link></li>)}</ol>
        {preview&&<aside className="tech-index__preview" aria-label="Selected project preview"><TechPair project={preview} compact/><h3>{preview.name}</h3><p>{preview.description}</p><Link href={`/work/technology/${preview.slug}`} className="tech-link">View project <ArrowUpRight size={18}/></Link></aside>}
      </div>:<div className="tech-grid">{matching.map(p=><article key={p.slug} className="tech-card"><Link href={`/work/technology/${p.slug}`} prefetch={false}><TechPair project={p} compact/><div className="tech-card__label"><div><span className="tech-meta">{p.sector} / {p.category}</span><h3>{p.name}</h3></div><ArrowUpRight size={24} aria-hidden="true"/></div><p>{p.description}</p></Link></article>)}</div>}
  </div>;
}
type View="paired"|"desktop"|"mobile";
export function TechnologyViewer({project}:{project:TechnologyProject}){
  const [view,setView]=useState<View>("paired");
  const dialog=useRef<HTMLDialogElement>(null);
  const expand=useRef<HTMLButtonElement>(null);
  const close=useRef<HTMLButtonElement>(null);
  const [expanded,setExpanded]=useState(false);
  useEffect(()=>{if(!expanded)return;const old=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.body.style.overflow=old;};},[expanded]);
  useEffect(()=>{if(expanded&&dialog.current&&!dialog.current.open){dialog.current.showModal();close.current?.focus();}},[expanded]);
  function dismiss(){setExpanded(false);expand.current?.focus();}
  const controls=(label:string)=><div className="tech-filter" role="group" aria-label={label}>{(["paired","desktop","mobile"] as const).map(v=><button key={v} type="button" aria-pressed={view===v} onClick={()=>setView(v)}>{v==="paired"?"Both":v==="desktop"?"Desktop":"Mobile"}</button>)}</div>;
  const visual=(priority=false)=>view==="paired"?<TechPair project={project} priority={priority}/>:<div className={`tech-single tech-single--${view}`}><TechImage project={project} device={view} sizes={view==="desktop"?"92vw":"(max-width: 600px) 85vw, 420px"}/></div>;
  return <div className="tech-viewer">
    <div className="tech-viewer__tools">{controls("Screenshot view")}<button ref={expand} type="button" className="tech-link" aria-haspopup="dialog" onClick={()=>setExpanded(true)}>Expand <Maximize2 size={18}/></button></div>
    {visual(true)}
    <dialog ref={dialog} className="tech-dialog" aria-labelledby="tech-dialog-title" onClose={dismiss} onClick={event=>{if(event.target===event.currentTarget){const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)event.currentTarget.close();}}}>
      <div className="tech-dialog__top"><h2 id="tech-dialog-title">{project.name}</h2><button ref={close} type="button" className="tech-icon-link" aria-label="Close screenshot viewer" onClick={()=>dialog.current?.close()}><X size={24}/></button></div>
      {expanded&&<>{controls("Expanded screenshot view")}{visual()}<a className="tech-link tech-full-image" href={technologyMedia(project,view==="mobile"?"mobile":"desktop")} target="_blank" rel="noopener noreferrer">Open full-resolution {view==="mobile"?"mobile":"desktop"} capture <ArrowUpRight size={18}/></a></>}
    </dialog>
  </div>;
}

/** Open an anchored native capability disclosure when reached from the shared navigation. */
export function TechnologyCapabilityAnchors(){
  useEffect(()=>{
    const reveal=(hash:string)=>{
      if(!hash.startsWith("#tech-"))return;
      const el=document.getElementById(hash.slice(1));
      if(el instanceof HTMLDetailsElement && el.classList.contains("tech-capability"))el.open=true;
    };
    const sync=()=>reveal(location.hash);
    const onClick=(event:MouseEvent)=>{
      if(!(event.target instanceof Element))return;
      const anchor=event.target.closest("a[href]");
      if(!(anchor instanceof HTMLAnchorElement))return;
      const url=new URL(anchor.href);
      if(url.origin===location.origin&&url.pathname.replace(/\/+$/,"")===location.pathname.replace(/\/+$/,""))reveal(url.hash);
    };
    sync();
    window.addEventListener("hashchange",sync);
    window.addEventListener("popstate",sync);
    document.addEventListener("click",onClick);
    return()=>{window.removeEventListener("hashchange",sync);window.removeEventListener("popstate",sync);document.removeEventListener("click",onClick);};
  },[]);
  return null;
}
