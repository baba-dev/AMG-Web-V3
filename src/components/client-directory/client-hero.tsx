import { ArrowDown } from "lucide-react";
import { clients, clientNumber } from "@/lib/client-directory";
import { ClientLogo } from "./client-logo";

const picks = ["fundoo-toys", "coy", "razmazaan", "aquapetro-chemicals"];

export function ClientHero() {
  return <section className="cd-hero cd-gutter" aria-labelledby="cd-title">
    <div className="cd-hero-stage">
      <div className="cd-hero-copy">
        <p className="cd-label cd-hero-kicker"><span aria-hidden="true"/> GOOD PEOPLE. GREAT THINGS.</p>
        <h1 id="cd-title"><span><b>GOOD</b></span><span><b>COMPANY<span className="cd-dot">.</span></b></span></h1>
        <svg className="cd-scribble" viewBox="0 0 380 24" aria-hidden="true"><path d="M3 17 Q177 -5 377 12 M57 23 Q235 4 347 16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" pathLength="1"/></svg>
        <div className="cd-hero-editorial"><span aria-hidden="true" className="cd-hero-star">✳</span><p className="cd-intro">Different ambitions. Different industries. One shared appetite for doing things differently.</p></div>
      </div>
      <div className="cd-hero-collage" aria-hidden="true">
        <div className="cd-collage-field"><span>FIG. 01 — THE RELATIONSHIPS</span><span>+<br/>+</span></div>
        {picks.map((id,i) => { const client = clients.find(c => c.id === id); return client ? <div key={id} className={"cd-hero-card cd-hero-card-"+i}><span>AIWA / {clientNumber(client)} <i>✳</i></span><ClientLogo client={client} decorative eager sizes="(max-width: 767px) 36vw, 18vw"/><span>{client.name}<i>↗</i></span></div> : null; })}
        <span className="cd-collage-stamp">GOOD<br/>PEOPLE<span>.</span></span>
        <span className="cd-collage-caption">01 / AN EDIT OF THE ARCHIVE</span>
      </div>
    </div>
    <div className="cd-hero-bottom"><span className="cd-label"><strong>{String(clients.length).padStart(2,"0")}</strong> BRANDS / MUSCAT & BEYOND</span><a href="#client-index">EXPLORE THE INDEX <span className="cd-hero-down"><ArrowDown size={22} aria-hidden="true"/></span></a></div>
  </section>;
}
