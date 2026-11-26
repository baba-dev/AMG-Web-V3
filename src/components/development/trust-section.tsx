import { Plus, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { developmentFaqs } from "@/lib/development";
import { technologyEcosystem, technologyExpertise, technologyProjects } from "@/lib/work/technology";
import { Marquee } from "./marquee";
import "./lower-sections.css";

const managed = [["Cloud & hosting", "Infrastructure and deployment support tailored to your workload."], ["Business email", "Professional mailboxes or dedicated email environments, under your own domain."], ["Application maintenance", "Ongoing updates, troubleshooting and improvements, with scope agreed upfront."]] as const;

export function TrustSection() {
  return <section className="tech-trust spec-pad" data-tech-section="trust" aria-label="Managed technology, ecosystem and questions">
    <div className="dev-managed">
      <div className="tech-chapter"><div><p className="tech-chapter__kicker">04 / MANAGED TECHNOLOGY</p><h2>BUILT TO LAST.<br/><em>SUPPORTED TO GROW.</em></h2></div><p>Launching a product is only the beginning. Keep your systems working as your business changes.</p></div>
      <div className="dev-managed__rows">{managed.map(([name, copy], i) => <article key={name}><span>0{i + 1}</span><h3>{name}</h3><p>{copy}</p><ArrowUpRight aria-hidden="true" size={20}/></article>)}</div>
      <Link href="/contact#enquiries" className="tech-link">Discuss managed services <ArrowUpRight size={20} aria-hidden="true"/></Link>
    </div>
    <Marquee items={technologyProjects.map(p => p.name)}/>
    <div className="dev-ecosystem">
      <div className="tech-chapter"><div><p className="tech-chapter__kicker">05 / TECHNOLOGY ECOSYSTEM</p><h2>GOOD COMPANY.<br/><em>GREAT TECHNOLOGY.</em></h2></div><p>Our technology relationships span Cloudflare, Oracle, BytePlus and Gallabox. We select the tools that fit your business rather than forcing a single platform.</p></div>
      <div className="dev-vendors">{technologyEcosystem.map(([name, copy]) => <article key={name}><h3>{name}</h3><p>{copy}</p></article>)}</div>
      <div className="dev-certifications">
        <div><p className="tech-chapter__kicker">CLOUD EXPERTISE</p><h3>Certified across leading cloud platforms.</h3><p>Our team includes professionals certified across AWS, Google Cloud and Oracle Cloud.</p></div>
        <div className="dev-certifications__marks">{technologyExpertise.map(([short, name]) => <div key={short}><strong>{short}</strong><span>{name}</span></div>)}</div>
      </div>
    </div>
    <div className="dev-faq">
      <div className="tech-chapter"><div><p className="tech-chapter__kicker">06 / FREQUENTLY ASKED QUESTIONS</p><h2>GOOD QUESTIONS.<br/><em>CLEAR ANSWERS.</em></h2></div><p>Practical answers about working with our technology team.</p></div>
      {developmentFaqs.map(([question, answer]) => <details key={question}><summary>{question}<Plus aria-hidden="true" size={22}/></summary><p>{answer}</p></details>)}
    </div>
  </section>;
}
