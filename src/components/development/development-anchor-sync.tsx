"use client";
import { useEffect } from "react";
/** Keep service deep links working for direct loads, same-page navigation and browser history. */
export function DevelopmentAnchorSync(){
 useEffect(()=>{
  const reveal=(hash:string)=>{if(!/^#dev-(web|software|cloud|email|ai|iot)$/.test(hash))return;const details=document.getElementById(hash.slice(1))?.querySelector("details");if(details instanceof HTMLDetailsElement)details.open=true;};
  const sync=()=>reveal(location.hash);
  const click=(event:MouseEvent)=>{if(!(event.target instanceof Element))return;const link=event.target.closest("a[href]");if(!(link instanceof HTMLAnchorElement))return;const url=new URL(link.href);if(url.origin===location.origin&&url.pathname.replace(/\/+$/,"")===location.pathname.replace(/\/+$/,""))reveal(url.hash);};
  sync();window.addEventListener("hashchange",sync);window.addEventListener("popstate",sync);document.addEventListener("click",click);
  return()=>{window.removeEventListener("hashchange",sync);window.removeEventListener("popstate",sync);document.removeEventListener("click",click);};
 },[]);
 return null;
}
