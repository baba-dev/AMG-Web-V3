"use client";
import { useEffect } from "react";
// Animate only newly visible editorial elements. Nothing is hidden before JS.
export function AboutMotion(){
 useEffect(()=>{
  const root=document.querySelector(".about-page main");
  if(!root || !("IntersectionObserver" in window)) return;
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  const nodes=Array.from(root.querySelectorAll<HTMLElement>(".ab-section:not(.ab-hero) .ab-heading, .ab-archive, .ab-stats>div, .ab-principles>article, .ab-work>a"));
  let observer:IntersectionObserver|undefined;
  const setup=()=>{
   observer?.disconnect();
   if(reduce.matches) return;
   observer=new IntersectionObserver(entries=>{
    for(const entry of entries){
     if(!entry.isIntersecting)continue;
     (entry.target as HTMLElement).animate([{transform:"translateY(18px)",opacity:.45},{transform:"translateY(0)",opacity:1}],{duration:620,easing:"cubic-bezier(.16,1,.3,1)"});
     observer?.unobserve(entry.target);
    }
   },{threshold:.12});
   nodes.forEach(node=>observer?.observe(node));
  };
  setup();reduce.addEventListener("change",setup);
  return ()=>{observer?.disconnect();reduce.removeEventListener("change",setup);nodes.forEach(n=>n.getAnimations().forEach(a=>a.cancel()));};
 },[]);
 return null;
}
