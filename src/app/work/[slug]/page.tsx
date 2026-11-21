import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { AiwaInnerHeader } from "@/components/aiwa-inner-header";
import { AiwaGlobalFooter } from "@/components/aiwa-footer";
import { WorkCaseStudyArticle } from "@/components/work-case-study-article";
import { workProjects, getWorkProject } from "@/lib/work/projects";
import { workVisuals } from "@/lib/work/directory";
import { getEditorialStory } from "@/lib/work/case-studies";
import "@/components/aiwa-polish.css";
import "../work-directory.css";
import "./project-page.css";

type ProjectProps={params:Promise<{slug:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return workProjects.map(project=>({slug:project.slug}));}

export async function generateMetadata({params}:ProjectProps):Promise<Metadata>{
 const {slug}=await params;
 const project=getWorkProject(slug);
 const story=getEditorialStory(slug);
 if(!project || !story)return {title:"Project not found | Aiwa Media Group",robots:{index:false}};
 return {
  title:project.client+" — "+story.hero.line1+" | Aiwa Media Group",
  description:story.context.slice(0,155),
  alternates:{canonical:"/work/"+project.slug},
  robots:story.confidence==="limited"?{index:false,follow:true}:undefined,
  twitter:{card:"summary_large_image",title:project.client+" | Aiwa Media Group",description:story.context.slice(0,155)},
  openGraph:{title:project.client+" — Aiwa Media Group",description:story.context.slice(0,155),type:"article"},
 };
}

export default async function WorkProjectCaseStudy({params}:ProjectProps){
 const {slug}=await params;
 const project=getWorkProject(slug);
 const story=getEditorialStory(slug);
 if(!project || !story)notFound();
 const index=workProjects.findIndex(p=>p.slug===slug);
 const palette=workVisuals[project.slug].accent;
 const vars={"--case-accent":palette} as CSSProperties;
 const schema={
  "@context":"https://schema.org",
  "@type":"WebPage",
  name:project.client+" — Aiwa Media Group",
  description:story.context,
  about:{"@type":"Thing",name:project.client},
  publisher:{"@type":"Organization",name:"Aiwa Media Group",url:"https://aiwamediagroup.com/"},
 };
 const schemaJson=JSON.stringify(schema).replace(/</g,"\\u003c");
 return <div className={"aiwa-site work-page work-project-page case-study--"+project.slug}
   data-case-study={project.slug} style={vars}>
    <span className="case-scroll-progress" aria-hidden="true"/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:schemaJson}}/>
    <AiwaInnerHeader/>
    <main id="main-content">
      <WorkCaseStudyArticle project={project} story={story} index={index}/>
    </main>
    <AiwaGlobalFooter/>
  </div>;
}
