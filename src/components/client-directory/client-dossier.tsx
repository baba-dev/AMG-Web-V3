"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { clientNumber, clientProject, type Client } from "@/lib/client-directory";
import { ClientLogo } from "./client-logo";

export function ClientDossier({client,close,previous,next}:{client:Client|null;close:()=>void;previous?:()=>void;next?:()=>void}){
  const ref=useRef<HTMLDialogElement>(null);
  const open=client!==null;
  const restoreFocus=useRef<HTMLElement|null>(null);
  useLayoutEffect(()=>{
    const dialog=ref.current;
    if(!dialog)return;
    if(open&&!dialog.open){restoreFocus.current=document.activeElement instanceof HTMLElement?document.activeElement:null;dialog.showModal();}
    else if(!open&&dialog.open){dialog.close();restoreFocus.current?.focus({preventScroll:true});restoreFocus.current=null;}
    if(!open)return;
    const oldOverflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    return()=>{document.body.style.overflow=oldOverflow;};
  },[open]);
  const project=client?clientProject(client):undefined;
  return <dialog ref={ref} className="cd-dossier" aria-labelledby="cd-dossier-title" onCancel={e=>{e.preventDefault();close();}} onClick={e=>{if(e.target===e.currentTarget)close();}}>
    {client&&<article className="cd-dossier-inner">
      <header><span className="cd-label">AIWA / BRAND DOSSIER / {clientNumber(client)}</span><button type="button" aria-label="Close brand dossier" onClick={close}><X size={26}/></button></header>
      <div className="cd-dossier-content">
        <div className="cd-dossier-art"><span className="cd-dossier-art-label">NO. {clientNumber(client)} <span>AIWA / ARCHIVE</span></span><ClientLogo client={client} sizes="(max-width: 767px) 70vw, 340px"/><span className="cd-dossier-art-label">BRAND IDENTITY <span>✳</span></span></div>
        <div className="cd-dossier-copy" key={client.id}><p className="cd-label">FROM THE CLIENT ARCHIVE</p><h2 id="cd-dossier-title">{client.name}<span className="cd-dot">.</span></h2>
          {client.industry&&<p className="cd-dossier-industry">{client.industry}</p>}
          {project?<><div className="cd-dossier-project"><p className="cd-label">RELATED PORTFOLIO</p><h3>{project.title}</h3><p>{project.shortDescription}</p><Link href={"/work/"+project.slug} onClick={close}>Explore the project <ArrowUpRight size={17} aria-hidden="true"/></Link></div></>:<p className="cd-dossier-note">From Aiwa’s client archive. Explore our selected work for more of the stories behind the agency.</p>}
        </div>
      </div>
      <footer><button type="button" onClick={previous} disabled={!previous}><ArrowLeft size={20} aria-hidden="true"/> Previous</button><span className="cd-label">THE ARCHIVE / {clientNumber(client)}</span><button type="button" onClick={next} disabled={!next}>Next <ArrowRight size={20} aria-hidden="true"/></button></footer>
    </article>}
  </dialog>;
}
