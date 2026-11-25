import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Plus, ArrowDownRight } from "lucide-react";
import { AiwaInnerHeader } from "@/components/aiwa-inner-header";
import { TechPair } from "@/components/technology/tech-media";
import { TechnologyGallery, TechnologyReel, TechnologyCapabilityAnchors } from "@/components/technology/tech-interactions";
import { EngineeringArt, CapabilityArt } from "@/components/technology/tech-art";
import { technologyProjects, technologyFeatured, technologyFlagship, technologyCapabilities, technologyEcosystem, technologyExpertise, getTechnologyProject } from "@/lib/work/technology";
import "@/components/aiwa-polish.css";
import "./technology.css";

const title="Technology Portfolio | Web & SaaS Development Oman | Aiwa";
const description="Explore Aiwa Media Group’s technology portfolio in Oman: responsive websites, AI products, business software, cloud infrastructure and professional email hosting.";
const url="https://next.aiwamediagroup.com/work/technology";
export const metadata:Metadata={
  title,description,alternates:{canonical:url},
  openGraph:{title,description,url,type:"website",images:[{url:"https://next.aiwamediagroup.com/media/technology/aiwa-creators/desktop-1600.webp",width:1600,height:883,alt:"Creators by Aiwa public website"}]},
  twitter:{card:"summary_large_image",title,description,images:["https://next.aiwamediagroup.com/media/technology/aiwa-creators/desktop-1600.webp"]},
};

function Chapter({number,label,title,copy}:{number:string;label:string;title:string;copy?:string}){
  return <div className="tech-chapter"><div><p className="tech-meta">{number} / {label}</p><h2>{title}</h2></div>{copy&&<p className="tech-chapter__copy">{copy}</p>}</div>;
}
export default function TechnologyPortfolio(){
  const schema={"@context":"https://schema.org","@graph":[{"@type":"CollectionPage",name:"Aiwa Technology Portfolio",description,url,publisher:{"@type":"Organization",name:"Aiwa Media Group",url:"https://aiwamediagroup.com/"},mainEntity:{"@type":"ItemList",itemListElement:technologyProjects.map((p,i)=>({"@type":"ListItem",position:i+1,name:p.name,url:url+"/"+p.slug}))}},{"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:"https://next.aiwamediagroup.com/"},{"@type":"ListItem",position:2,name:"Work",item:"https://next.aiwamediagroup.com/work"},{"@type":"ListItem",position:3,name:"Technology",item:url}]}]};
  return <div className="aiwa-site tech-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/>
    <AiwaInnerHeader/>
    <main id="main-content">
      <section className="tech-hero tech-gutter" aria-labelledby="tech-title">
        <div className="tech-hero__top tech-meta"><span><Link href="/work">WORK</Link> / TECHNOLOGY PORTFOLIO</span><span>MUSCAT / OMAN</span></div>
        <div className="tech-hero__body">
          <h1 id="tech-title" className="tech-poster"><span>MADE FOR</span><span>THE REAL</span><em>WORLD<span className="tech-dot">.</span></em></h1>
          <div className="tech-hero__aside"><span className="tech-hero__mark" aria-hidden="true"><ArrowDownRight strokeWidth={1.1}/></span><div><p className="tech-meta">DEVELOPMENT / SYSTEMS / DIGITAL PRODUCTS</p><p>Technology should make life easier. We design, develop and support digital experiences that do more than look good.</p><Link href="#tech-projects" className="tech-link">Explore our work <ArrowDown size={20}/></Link></div></div>
        </div>
        <div className="tech-hero__bottom tech-meta"><span>BEYOND THE NOISE / BEAUTIFULLY ENGINEERED.</span><span>01 — 11</span></div>
      </section>
      <section className="tech-section tech-gutter tech-motion" aria-label="Technology in motion">
        <Chapter number="02" label="TECHNOLOGY IN MOTION" title="Good-looking is only the beginning." copy="From a first impression to a fully connected product. Explore a selection of real digital experiences."/>
        <TechnologyReel/>
      </section>
      <section className="tech-section tech-gutter tech-flagship" aria-label="Flagship product">
        <div className="tech-flagship__intro"><div><p className="tech-meta">03 / FLAGSHIP PRODUCT / CREATORS BY AIWA</p><h2>CREATIVITY.<br/>WITHOUT <em>LIMITS.</em></h2></div><div><p>From first thought to final media. Our AI-powered creative production workspace brings image, video, voice and spokesperson content together with reference workflows, projects and team controls.</p><Link href="/work/technology/aiwa-creators" className="tech-link">Discover Creators <ArrowUpRight size={21}/></Link></div></div>
        <Link href="/work/technology/aiwa-creators" aria-label="Explore the Creators by Aiwa project" className="tech-flagship__visual"><TechPair project={technologyFlagship}/></Link>
        <div className="tech-flagship__footer tech-meta"><span>GENERATIVE AI / MULTIMEDIA / SAAS</span><a href="https://creator.aiwamediagroup.com/">VISIT THE PLATFORM <ArrowUpRight size={17}/></a></div>
      </section>
      <section className="tech-section tech-gutter tech-capabilities" id="tech-capabilities" aria-label="Development capabilities">
        <Chapter number="04" label="WHAT WE DO" title="Beyond the interface." copy="From the experience your customers see to the systems your business relies on. We bring design and engineering together."/>
        <TechnologyCapabilityAnchors/>
        <div className="tech-capability-list">{technologyCapabilities.map((cap,i)=>{const project=cap.project?getTechnologyProject(cap.project):undefined;return <details key={cap.id} id={`tech-${cap.id}`} className="tech-capability" open={i===0?true:undefined}>
          <summary><span className="tech-meta">0{i+1}</span><h3>{cap.name}</h3><Plus aria-hidden="true" size={29}/></summary>
          <div className="tech-capability__body"><div><p>{cap.copy}</p><p className="tech-meta">{cap.examples}</p>{project?<Link href={`/work/technology/${project.slug}`} className="tech-link">Explore a project <ArrowUpRight size={18}/></Link>:<Link href="/contact#enquiries" className="tech-link">Discuss your requirements <ArrowUpRight size={18}/></Link>}</div>{project?<TechPair project={project} compact/>:<CapabilityArt kind={cap.id==="email"?"email":"cloud"}/>}</div>
        </details>;})}</div>
      </section>
      <section className="tech-section tech-gutter tech-featured" aria-label="Featured technology work">
        <Chapter number="05" label="SELECTED PROJECTS" title="In the wild." copy="Different industries. Different challenges. One commitment to useful, expressive digital experiences."/>
        <div className="tech-featured__grid">{technologyFeatured.map((p,i)=><article key={p.slug} className="tech-featured__card"><Link href={`/work/technology/${p.slug}`}><TechPair project={p} compact/><div className="tech-card__label"><div><p className="tech-meta">0{i+1} / {p.sector}</p><h3>{p.name}</h3></div><ArrowUpRight aria-hidden="true" size={30}/></div><p>{p.description}</p></Link></article>)}</div>
      </section>
      <section className="tech-section tech-gutter tech-projects" id="tech-projects" aria-label="Technology project index">
        <Chapter number="06" label="PROJECT INDEX" title="Explore the work." copy="Browse responsive websites, digital products and publishing experiences. Every project opens a closer look at the captured experience."/>
        <TechnologyGallery/>
      </section>
      <section className="tech-section tech-gutter tech-engineering" id="tech-infrastructure" aria-label="Technology infrastructure">
        <Chapter number="07" label="ENGINEERING / INFRASTRUCTURE" title="Under the hood." copy="A great interface is only one part of a digital product. The application, data and infrastructure need to work together."/>
        <div className="tech-engineering__grid"><EngineeringArt/><div><h3>Built as a system.</h3><p>We connect front-end experiences with business logic, integrations, cloud services and deployment workflows. From initial architecture to ongoing support, we approach reliability and security as part of the design.</p><Link href="/contact#enquiries" className="tech-link">Talk infrastructure <ArrowUpRight size={20}/></Link><p className="tech-meta tech-diagram-note">CONCEPTUAL SYSTEM MAP / NOT A CLIENT NETWORK</p></div></div>
      </section>
      <section className="tech-section tech-gutter tech-ecosystem" aria-label="Technology ecosystem">
        <Chapter number="08" label="OUR TECHNOLOGY ECOSYSTEM" title="Built on the world’s best." copy="Our technology relationships span Cloudflare, Oracle, BytePlus and Gallabox. We select the tools that make sense for each business."/>
        <div className="tech-ecosystem__grid">{technologyEcosystem.map(([name,copy],i)=><div key={name} className="tech-ecosystem__item"><span className="tech-meta">0{i+1} / PLATFORM</span><h3>{name}</h3><p>{copy}</p></div>)}</div>
      </section>
      <section className="tech-section tech-gutter tech-expertise" aria-label="Cloud expertise">
        <Chapter number="09" label="TECHNICAL EXPERTISE" title="Expertise that goes deeper." copy="Our team includes professionals certified across AWS, Google Cloud and Oracle Cloud. We bring cloud expertise to real business requirements."/>
        <div className="tech-expertise__grid">{technologyExpertise.map(([short,name])=><div key={short}><span className="tech-expertise__mark">{short}</span><p>{name}</p></div>)}</div>
        <p className="tech-expertise__note">We choose infrastructure around the project, not a single vendor.</p>
      </section>
      <section className="tech-section tech-gutter tech-process" aria-label="Our development process">
        <Chapter number="10" label="HOW WE WORK" title="From idea to impact." copy="A clear process, from understanding the problem to building, releasing and evolving the solution."/>
        <ol>{[["Discover","Understand the business, users and priorities."],["Design","Define the experience, content and technical direction."],["Develop","Build the product with performance and accessibility in mind."],["Deploy","Test, release and establish a reliable operating foundation."],["Evolve","Support, maintain and improve the experience as needs change."]].map(([name,copy],i)=><li key={name}><span className="tech-meta">0{i+1}</span><h3>{name}.</h3><p>{copy}</p><ArrowDownRight size={26} aria-hidden="true"/></li>)}</ol>
      </section>
      <section className="tech-section tech-gutter tech-outro" aria-labelledby="tech-outro"><p className="tech-meta">11 / START A CONVERSATION</p><h2 id="tech-outro">LET’S BUILD<br/><em>SOMETHING.</em></h2><p>Need a new website, a smarter business application, reliable cloud infrastructure or professional email hosting? Tell us what you want to achieve.</p><Link href="/contact#enquiries" className="tech-link">Start a conversation <ArrowUpRight size={26}/></Link></section>
    </main>
  </div>;
}
