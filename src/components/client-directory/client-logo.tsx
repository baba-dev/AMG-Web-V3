import { ArrowUpRight } from "lucide-react";
import { clientLogo, clientNumber, type Client } from "@/lib/client-directory";

export function ClientLogo({client, decorative=false, eager=false, sizes="(max-width: 767px) 46vw, (max-width: 1100px) 30vw, 22vw"}: {client:Client; decorative?:boolean; eager?:boolean; sizes?:string}) {
  // Pre-generated, lossless responsive assets; Next static export has no image optimizer.
  /* eslint-disable @next/next/no-img-element */
  return <img className="cd-logo" src={clientLogo(client,300)} srcSet={clientLogo(client,300)+" 300w, "+clientLogo(client,600)+" 600w"} sizes={sizes} width={300} height={300} alt={decorative?"":client.name+" logo"} loading={eager?"eager":"lazy"} decoding="async"/>;
  /* eslint-enable @next/next/no-img-element */
}

export function ClientCard({client, open, index, list=false}: {client:Client; open:(c:Client)=>void; index:number; list?:boolean}) {
  return <li className="cd-item" data-client-id={client.id} style={{animationDelay: Math.min(index,8)*35+"ms"}}>
    <button className="cd-card" type="button" onClick={()=>open(client)} aria-label={"Explore "+client.name} aria-haspopup="dialog">
      <div className="cd-card-art"><span className="cd-card-index">{clientNumber(client)} / ARCHIVE</span><ClientLogo client={client} decorative sizes={list?"(max-width: 767px) 76px, 124px":undefined}/><span className="cd-card-arrow"><ArrowUpRight size={19} aria-hidden="true"/></span></div>
      <div className="cd-card-caption"><span><strong>{client.name}</strong>{client.industry && <small>{client.industry}</small>}</span><ArrowUpRight size={21} aria-hidden="true"/></div>
    </button>
  </li>;
}
