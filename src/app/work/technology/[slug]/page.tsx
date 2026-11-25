import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { AiwaInnerHeader } from "@/components/aiwa-inner-header";
import { TechPair } from "@/components/technology/tech-media";
import { TechnologyViewer } from "@/components/technology/tech-interactions";
import { technologyProjects, getTechnologyProject, technologyMedia } from "@/lib/work/technology";
import "@/components/aiwa-polish.css";
import "../technology.css";

type Props={params:Promise<{slug:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return technologyProjects.map(p=>({slug:p.slug}));}
const origin="https://next.aiwamediagroup.com";
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug}=await params;const project=getTechnologyProject(slug);
  if(!project)return {title:"Project not found",robots:{index:false}};
  const title=`${project.name} | Technology Portfolio | Aiwa Media Group`,description=project.description,url=origin+"/work/technology/"+slug,image=origin+technologyMedia(project,"desktop");
  return {title,description,alternates:{canonical:url},openGraph:{title,description,url,type:"website",images:[{url:image,width:1600,height:project.desktopHeight,alt:project.name+" desktop capture"}]},twitter:{card:"summary_large_image",title,description,images:[image]}};
}
export default async function TechnologyProjectPage({params}:Props){
  const {slug}=await params;const project=getTechnologyProject(slug);if(!project)notFound();
  const i=technologyProjects.findIndex(p=>p.slug===slug);const next=technologyProjects[(i+1)%technologyProjects.length];
  const schema={"@context":"https://schema.org","@graph":[{"@type":"WebPage",name:project.name+" | Aiwa Technology Portfolio",description:project.description,url:origin+"/work/technology/"+slug,isPartOf:{"@type":"CollectionPage",name:"Aiwa Technology Portfolio",url:origin+"/work/technology"},primaryImageOfPage:{"@type":"ImageObject",url:origin+technologyMedia(project,"desktop")}},{"@type":"BreadcrumbList",itemListElement:[["Home","/"],["Work","/work"],["Technology","/work/technology"],[project.name,"/work/technology/"+slug]].map(([name,path],index)=>({"@type":"ListItem",position:index+1,name,item:origin+path}))}]};
  return <div className="aiwa-site tech-page tech-detail">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/>
    <AiwaInnerHeader/>
    <main id="main-content">
      <section className="tech-gutter tech-detail__hero">
        <Link href="/work/technology#tech-projects" className="tech-link"><ArrowLeft size={19}/> Back to technology work</Link>
        <div className="tech-detail__header"><div><p className="tech-meta">PROJECT / {String(i+1).padStart(2,"0")} / {project.category.toUpperCase()}</p><h1>{project.name}<span className="tech-dot">.</span></h1></div><div><p className="tech-meta">{project.sector}</p><p>{project.description}</p></div></div>
        <div className="tech-detail__media-head"><p className="tech-meta">RESPONSIVE EXPERIENCE / DESKTOP & MOBILE</p><p>Explore the website on both screen sizes.</p></div>
        <TechnologyViewer project={project}/>
      </section>
      <section className="tech-section tech-gutter tech-detail__context"><div><p className="tech-meta">01 / THE EXPERIENCE</p><h2>{project.headline}</h2></div><div><p>{project.detail}</p>{project.website&&<a className="tech-link" href={project.website}>Visit the website <ArrowUpRight size={21}/></a>}{project.relatedWork&&<Link className="tech-link" href={project.relatedWork}>Related Aiwa work <ArrowUpRight size={21}/></Link>}</div></section>

      <section className="tech-section tech-gutter tech-detail__next"><p className="tech-meta">UP NEXT / {next.sector}</p><Link href={`/work/technology/${next.slug}`}><div><h2>{next.name}.</h2><ArrowUpRight size={40}/></div><TechPair project={next} compact/></Link><Link href="/contact#enquiries" className="tech-link">Discuss your own project <ArrowUpRight size={22}/></Link></section>
    </main>
  </div>;
}
