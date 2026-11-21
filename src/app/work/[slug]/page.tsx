import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { AiwaInnerHeader } from "@/components/aiwa-inner-header";
import { AiwaGlobalFooter } from "@/components/aiwa-footer";
import { workProjects, getWorkProject } from "@/lib/work/projects";
import { workVisuals } from "@/lib/work/directory";
import "@/components/aiwa-polish.css";
import "../work-directory.css";
import "./project-page.css";

type ProjectProps={params:Promise<{slug:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return workProjects.map(project=>({slug:project.slug}));}
export async function generateMetadata({params}:ProjectProps):Promise<Metadata>{
 const {slug}=await params;
 const project=getWorkProject(slug);
 if(!project)return {title:"Project not found | Aiwa Media Group",robots:{index:false}};
 return {
  title:project.client+" — "+project.title+" | Aiwa Media Group",
  description:project.shortDescription,
  alternates:{canonical:"/work/"+project.slug},
  openGraph:{title:project.client+" | Aiwa Media Group",description:project.shortDescription,type:"article"},
 };
}
export default async function WorkProjectOverview({params}:ProjectProps){
 const {slug}=await params;
 const project=getWorkProject(slug);
 if(!project)notFound();
 const index=workProjects.findIndex(p=>p.slug===slug);
 const previous=workProjects[(index-1+workProjects.length)%workProjects.length];
 const next=workProjects[(index+1)%workProjects.length];
 return <div className="aiwa-site work-page work-project-page">
  <AiwaInnerHeader/>
  <main id="main-content">
   <section className="work-project__hero work-page__gutter" aria-labelledby="project-heading">
    <div className="work-project__top"><Link href="/work"><ArrowLeft size={18}/> ALL WORK</Link><span>SELECTED WORK / 0{index+1}—0{workProjects.length}</span></div>
    <span className="work-project__eyebrow">{project.discipline} / AIWA MEDIA GROUP</span>
    <h1 id="project-heading">{project.client}</h1>
    <div className="work-project__meta"><span>{project.title}</span><span>PROJECT OVERVIEW / MUSCAT</span></div>
   </section>
   <section className="work-project__visual" aria-label="Original conceptual project illustration">
    <div className="work-project__art" style={{backgroundColor:workVisuals[project.slug].accent}}>
     <Image src={project.artwork} width={960} height={740} alt={project.alt} unoptimized priority sizes="100vw"/>
     <span className="work-project__art-index">AIWA / {workVisuals[project.slug].chapter}</span>
    </div>
   </section>
   <section className="work-project__story work-page__gutter" aria-labelledby="work-project-story">
    <div><span className="work-page__eyebrow">01 / OVERVIEW</span><h2 id="work-project-story">THE IDEA<br/><em>IN FOCUS.</em></h2></div>
    <div className="work-project__copy"><p>{project.shortDescription}</p>
     <dl><div><dt>CLIENT</dt><dd>{project.client}</dd></div><div><dt>DISCIPLINE</dt><dd>{project.discipline}</dd></div></dl>
     <p className="work-project__note">This editorial overview uses original conceptual artwork, not documentary campaign photography. Aiwa's published information is linked below; additional approved media and detailed project stories may be added later.</p>
     <a className="work-project__source" href={project.href} target="_blank" rel="noopener noreferrer">ORIGINAL AIWA PROJECT SOURCE <ArrowUpRight size={18}/></a>
    </div>
   </section>
   <nav className="work-project__next work-page__gutter" aria-label="Browse projects">
    <Link href={"/work/"+previous.slug}><ArrowLeft size={22}/> PREVIOUS PROJECT<span>{previous.client}</span></Link>
    <Link href={"/work/"+next.slug}>NEXT PROJECT <ArrowRight size={22}/><span>{next.client}</span></Link>
   </nav>
   <section className="work-page__outro work-page__gutter" aria-labelledby="project-cta">
    <span className="work-page__eyebrow">LET'S PUT YOUR IDEA TO WORK</span>
    <h2 id="project-cta">YOUR MOVE.<br/><em>OUR ENERGY.</em></h2>
    <a href="/#contact" className="work-page__contact-link">START A CONVERSATION <ArrowUpRight size={25}/></a>
   </section>
  </main><AiwaGlobalFooter/>
 </div>;
}
