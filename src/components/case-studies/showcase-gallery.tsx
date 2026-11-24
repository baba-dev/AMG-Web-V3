"use client";
import { useRef } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import type { ShowcaseChapter } from "@/lib/work/case-study-showcase";
export function ShowcaseGallery({chapter}: {chapter:ShowcaseChapter}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  if (!chapter.archive) return null;
  const image = chapter.archive;
  return <figure className="cs-gallery">
    <button type="button" ref={trigger} className="cs-gallery-open" onClick={()=>dialog.current?.showModal()} aria-label={"Enlarge "+chapter.name+" archive artwork"}>
      <Image src={image.src} alt={image.alt} width={900} height={900} sizes="(max-width: 767px) 90vw, 40vw" unoptimized loading="lazy"/><span className="cs-expand"><Maximize2 size={20} aria-hidden="true"/></span>
    </button>
    <figcaption className="cs-label">PUBLISHED AIWA ARCHIVE / CAMPAIGN ARTWORK</figcaption>
    <dialog ref={dialog} className="cs-lightbox" aria-label={chapter.name+" archive artwork"} onClose={()=>trigger.current?.focus()} onClick={event=>{if(event.target===event.currentTarget)dialog.current?.close();}}>
      <button type="button" className="cs-close" onClick={()=>dialog.current?.close()} aria-label="Close artwork"><X size={24}/></button>
      <Image src={image.src} alt={image.alt} width={900} height={900} unoptimized loading="lazy"/>
    </dialog>
  </figure>;
}
