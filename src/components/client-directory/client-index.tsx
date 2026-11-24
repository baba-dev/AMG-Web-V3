"use client";

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { LayoutGrid, List, Search, Shuffle, X } from "lucide-react";
import { clients, industries, type Client } from "@/lib/client-directory";
import { ClientCard } from "./client-logo";
import { ClientDossier } from "./client-dossier";
import { ClientPlayground } from "./client-playground";

const stateEvent = "aiwa-client-index";
const subscribe = (fn:()=>void) => {
  window.addEventListener("popstate",fn); window.addEventListener(stateEvent,fn);
  return ()=>{window.removeEventListener("popstate",fn);window.removeEventListener(stateEvent,fn);};
};
const snapshot=()=>window.location.search;
const serverSnapshot=()=>"";
type View="gallery"|"index"|"playground";

export function ClientIndex(){
  const params = new URLSearchParams(useSyncExternalStore(subscribe,snapshot,serverSnapshot));
  const query=(params.get("q")??"").slice(0,100);
  const industry=industries.includes(params.get("industry")??"")?params.get("industry")!:"all";
  const hasFilters=Boolean(query||industry!=="all");
  const viewParam=params.get("view");
  const view:View=viewParam==="index"||viewParam==="playground"?viewParam:"gallery";
  const descending=params.get("sort")==="za";
  const [selected,setSelected]=useState<Client|null>(null);
  const listRef=useRef<HTMLOListElement>(null);
  const oldPositions=useRef(new Map<string,DOMRect>());
  const filtered=clients.filter(c=>(industry==="all"||c.industry===industry)&&c.name.toLowerCase().includes(query.trim().toLowerCase())).slice().sort((a,b)=>descending?b.name.localeCompare(a.name):a.name.localeCompare(b.name));
  const update=(values:Record<string,string>,replace=false)=>{
    const url=new URL(window.location.href);
    for(const [key,value] of Object.entries(values)){if(value)url.searchParams.set(key,value);else url.searchParams.delete(key);}
    if(url.href===window.location.href)return;
    oldPositions.current=new Map(Array.from(listRef.current?.querySelectorAll<HTMLElement>("[data-client-id]")??[]).map(el=>[el.dataset.clientId!,el.getBoundingClientRect()]));
    if(replace)window.history.replaceState(null,"",url.pathname+url.search+url.hash);
    else window.history.pushState(null,"",url.pathname+url.search+url.hash);
    window.dispatchEvent(new Event(stateEvent));
  };
  useLayoutEffect(()=>{
    const previous=oldPositions.current;
    oldPositions.current=new Map();
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    listRef.current?.querySelectorAll<HTMLElement>("[data-client-id]").forEach(el=>{
      const old=previous.get(el.dataset.clientId!); if(!old)return;
      const next=el.getBoundingClientRect();
      const x=old.left-next.left,y=old.top-next.top;
      if(Math.abs(x)+Math.abs(y)>1){el.getAnimations().filter(a=>a.id==="cd-flip").forEach(a=>a.cancel());const animation=el.animate([{transform:"translate("+x+"px,"+y+"px)"},{transform:"translate(0,0)"}],{duration:360,easing:"cubic-bezier(.22,1,.36,1)"});animation.id="cd-flip";}
    });
  },[query,industry,view,descending]);
  const selectedIndex=selected?filtered.findIndex(c=>c.id===selected.id):-1;
  return <section className="cd-index cd-gutter" id="client-index" aria-labelledby="cd-index-title">
    <div className="cd-section-head"><div><p className="cd-label">01 / THE BRAND INDEX</p><h2 id="cd-index-title">THE INDEX<span className="cd-dot">.</span></h2></div><p>Different names. Different worlds. Discover the brands in our client archive.</p></div>
    <div className="cd-tools">
      <div className="cd-tools-main">
        <div className="cd-search"><Search size={20} aria-hidden="true"/><input type="search" value={query} onChange={e=>update({q:e.target.value},true)} placeholder="Find a brand…" aria-label="Search client names" maxLength={100}/>{query&&<button type="button" onClick={()=>update({q:""},true)} aria-label="Clear search"><X size={18} aria-hidden="true"/></button>}</div>
        <label className="cd-sort"><span>Sort</span><select value={descending?"za":"az"} onChange={e=>update({sort:e.target.value==="az"?"":e.target.value})}><option value="az">A — Z</option><option value="za">Z — A</option></select></label>
        <div className="cd-views" role="group" aria-label="Directory view">
          {([{id:"gallery",label:"Gallery",Icon:LayoutGrid},{id:"index",label:"Index",Icon:List},{id:"playground",label:"Play",Icon:Shuffle}] as const).map(({id,label,Icon})=><button key={id} type="button" aria-pressed={view===id} onClick={()=>update({view:id==="gallery"?"":id})}><Icon size={17} aria-hidden="true"/><span>{label}</span></button>)}
        </div>
      </div>
      <div className="cd-filters" role="group" aria-label="Filter by industry">{["all",...industries].map(value=><button key={value} type="button" aria-pressed={industry===value} onClick={()=>update({industry:value==="all"?"":value})}>{value==="all"?"All brands":value}<span aria-hidden="true">{String(value==="all"?clients.length:clients.filter(c=>c.industry===value).length).padStart(2,"0")}</span></button>)}</div>
    </div>
    <div className="cd-result cd-label"><div className="cd-result-count"><p aria-live="polite" aria-atomic="true"><strong>{String(filtered.length).padStart(2,"0")}</strong> / {clients.length} BRANDS</p>{hasFilters&&<button type="button" className="cd-clear" onClick={()=>update({q:"",industry:""})}>Clear <X size={13} aria-hidden="true"/></button>}</div><span>{view==="playground"?"MAKE IT YOUR OWN":view==="index"?"A—Z / THE ARCHIVE":"02 / THE LIVING GALLERY"}</span></div>
    {filtered.length===0?<div className="cd-empty"><h3>No matching brands.</h3><p>Try another name or clear the filters.</p><button type="button" onClick={()=>update({q:"",industry:""})}>Clear filters</button></div>:
      view==="playground"?<ClientPlayground clients={filtered} open={setSelected}/>:
      <ol className={"cd-gallery cd-gallery-"+view} ref={listRef} aria-label="Client brands">{filtered.map((client,index)=><ClientCard key={client.id} client={client} index={index} open={setSelected} list={view==="index"}/>)}</ol>}
    <div className="cd-result cd-label"><span>END OF THE EDIT / MORE TO COME</span><span>AIWA / MUSCAT</span></div>
    <ClientDossier client={selected} close={()=>setSelected(null)} previous={selectedIndex>0?()=>setSelected(filtered[selectedIndex-1]):undefined} next={selectedIndex>=0&&selectedIndex<filtered.length-1?()=>setSelected(filtered[selectedIndex+1]):undefined}/>
  </section>;
}
