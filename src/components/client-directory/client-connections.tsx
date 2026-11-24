import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { clients, clientProject } from "@/lib/client-directory";
import { ClientLogo } from "./client-logo";

const featured = ["razmazaan", "aquapetro-chemicals", "best-appliances"];

export function ClientConnections(){
  const stories = featured.flatMap(id => {
    const client=clients.find(c=>c.id===id);
    if(!client)return [];
    const project=clientProject(client);
    return project?[{client,project}]:[];
  });
  return <section className="cd-connections cd-gutter" aria-labelledby="cd-connections-title">
    <div className="cd-section-head cd-stories-head">
      <div><p className="cd-label">03 / SELECTED WORK</p><h2 id="cd-connections-title">GOOD WORK<span className="cd-dot">.</span></h2></div>
      <Link className="cd-text-link" href="/work">EXPLORE ALL WORK <ArrowUpRight size={22} aria-hidden="true"/></Link>
    </div>
    <div className="cd-stories-intro"><p>A closer look at the ideas behind the identities.</p><span className="cd-label">A SELECTION FROM OUR PORTFOLIO / 0{stories.length}</span></div>
    <ol className="cd-stories">
      {stories.map(({client,project},index)=><li key={client.id} className="cd-story">
        <Link href={"/work/"+project.slug} className="cd-story-link" aria-label={"Explore "+client.name+": "+project.title}>
          <div className="cd-story-art">
            <Image src={project.artwork} alt={project.alt} width={960} height={740} sizes="(max-width: 767px) 100vw, 33vw" loading="lazy" unoptimized/>
            <span className="cd-story-number">0{index+1} / SELECTED WORK</span>
            <span className="cd-story-logo"><ClientLogo client={client} decorative sizes="(max-width: 767px) 78px, 100px"/></span>
          </div>
          <div className="cd-story-caption"><div><p className="cd-label">{project.discipline}</p><h3>{client.name}</h3><p className="cd-story-title">{project.title}</p></div><span className="cd-story-action"><ArrowUpRight size={24} aria-hidden="true"/></span></div>
        </Link>
      </li>)}
    </ol>
    <p className="cd-stories-disclosure">Conceptual editorial artwork from our selected work collection.</p>
  </section>;
}

export function ClientOutro(){
  return <section className="cd-outro cd-gutter" aria-labelledby="cd-outro-title">
    <p className="cd-label">04 / THE NEXT GOOD RELATIONSHIP?</p>
    <div className="cd-outro-stage"><h2 id="cd-outro-title"><span>BETTER</span><span>TOGETHER<span className="cd-dot">.</span></span></h2><div className="cd-empty-brand" aria-hidden="true"><svg className="cd-outro-arrow" viewBox="0 0 110 60"><path d="M3 10 Q50 66 103 18 M82 16 L104 18 L98 40" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" pathLength="1"/></svg><span>THE NEXT / 001</span><strong>YOUR<br/>LOGO<br/>HERE<span>.</span></strong><span>GOOD THINGS AHEAD ✳</span></div></div>
    <div className="cd-outro-end"><p>There’s always room for another good story.</p><Link href="/contact" className="cd-text-link">LET’S MAKE SOME NOISE <ArrowUpRight size={24} aria-hidden="true"/></Link></div>
  </section>;
}
