"use client";

import { useRef, useState, type PointerEvent } from "react";
import { ArrowUpRight, Grip, RotateCcw } from "lucide-react";
import { clientNumber, type Client } from "@/lib/client-directory";
import { ClientLogo } from "./client-logo";

type Offset={x:number;y:number};
const zero={x:0,y:0};
const limit=(n:number)=>Math.max(-22,Math.min(22,n));

export function ClientPlayground({clients,open}:{clients:readonly Client[];open:(client:Client)=>void}){
  const [offsets,setOffsets]=useState<Record<string,Offset>>({});
  const drag=useRef<{id:string;pointer:number;x:number;y:number;start:Offset}|null>(null);
  const move=(id:string,offset:Offset)=>setOffsets(old=>({...old,[id]:{x:limit(offset.x),y:limit(offset.y)}}));
  const start=(e:PointerEvent<HTMLButtonElement>,id:string)=>{
    if(e.button!==0)return;
    drag.current={id,pointer:e.pointerId,x:e.clientX,y:e.clientY,start:offsets[id]??zero};
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const end=(e:PointerEvent<HTMLButtonElement>)=>{if(drag.current?.pointer===e.pointerId)drag.current=null;};
  return <div className="cd-playground">
    <div className="cd-playground-bar"><p>Make it yours. Drag the handles or use arrow keys on a focused handle.</p><button type="button" onClick={()=>{drag.current=null;setOffsets({});}}><RotateCcw size={17}/> Reset layout</button></div>
    <ul className="cd-play-grid">
      {clients.map((client,i)=>{const offset=offsets[client.id]??zero;return <li key={client.id} className="cd-play-tile" style={{transform:"translate("+offset.x+"px,"+offset.y+"px) rotate("+([-5,3,-2,5,0][i%5])+"deg)"}}>
        <div className="cd-play-top"><span>{clientNumber(client)}</span><button type="button" className="cd-grip" aria-label={"Move "+client.name+" card"} onPointerDown={e=>start(e,client.id)} onPointerMove={e=>{const d=drag.current;if(d?.id===client.id&&d.pointer===e.pointerId)move(client.id,{x:d.start.x+e.clientX-d.x,y:d.start.y+e.clientY-d.y});}} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end} onKeyDown={e=>{const delta:Record<string,Offset>={ArrowUp:{x:0,y:-5},ArrowDown:{x:0,y:5},ArrowLeft:{x:-5,y:0},ArrowRight:{x:5,y:0}};if(delta[e.key]){e.preventDefault();move(client.id,{x:offset.x+delta[e.key].x,y:offset.y+delta[e.key].y});}}}><Grip size={20} aria-hidden="true"/></button></div>
        <button type="button" className="cd-play-open" onClick={()=>open(client)} aria-haspopup="dialog"><ClientLogo client={client} decorative sizes="(max-width: 767px) 40vw, 16vw"/><span>{client.name}<ArrowUpRight size={16}/></span></button>
      </li>;})}
    </ul>
  </div>;
}
