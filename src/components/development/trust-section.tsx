/* eslint-disable @next/next/no-img-element -- static export: vendor SVGs are served as-is, there is no image optimizer. */
import { Plus, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { developmentFaqs } from "@/lib/development";
import { technologyEcosystem, technologyExpertise, technologyProjects } from "@/lib/work/technology";
import { InkCalligraphy } from "./ink-calligraphy";
import { Marquee } from "./marquee";
import "./lower-sections.css";

const logos: Record<string, { src: string; label: string }> = {
  Cloudflare: { src: "/media/development/logos/cloudflare.svg", label: "Cloudflare" },
  Oracle: { src: "/media/development/logos/oracle.svg", label: "Oracle" },
  BytePlus: { src: "/media/development/logos/byteplus.svg", label: "BytePlus" },
  Gallabox: { src: "/media/development/logos/gallabox.svg", label: "Gallabox" },
  AWS: { src: "/media/development/logos/aws.svg", label: "Amazon Web Services" },
  GCP: { src: "/media/development/logos/google-cloud.svg", label: "Google Cloud" },
  OCI: { src: "/media/development/logos/oracle.svg", label: "Oracle" },
};

const managed = [["Cloud & hosting", "Infrastructure and deployment support tailored to your workload."], ["Business email", "Professional mailboxes or dedicated email environments, under your own domain."], ["Application maintenance", "Ongoing updates, troubleshooting and improvements, with scope agreed upfront."]] as const;

export function TrustSection() {
  return <section className="tech-trust spec-pad" data-tech-section="trust" aria-label="Managed technology, ecosystem and questions">
    <div className="dev-managed">
      <div className="tech-chapter"><div><p className="tech-chapter__kicker">04 / MANAGED TECHNOLOGY</p><h2>BUILT TO LAST.<br/><em>SUPPORTED TO GROW.</em></h2></div><InkCalligraphy word="programming" variant="header" className="tech-chapter__ink"/></div>
      <div className="dev-managed__rows">{managed.map(([name, copy], i) => <article key={name}><span>0{i + 1}</span><h3>{name}</h3><p>{copy}</p><ArrowUpRight aria-hidden="true" size={20}/></article>)}</div>
      <Link href="/contact#enquiries" className="tech-link">Discuss managed services <ArrowUpRight size={20} aria-hidden="true"/></Link>
    </div>
    <Marquee items={technologyProjects.map(p => p.name)}/>
    <div className="dev-ecosystem">
      <div className="tech-chapter"><div><p className="tech-chapter__kicker">05 / TECHNOLOGY ECOSYSTEM</p><h2>GOOD COMPANY.<br/><em>GREAT TECHNOLOGY.</em></h2></div><p>Our technology relationships span Cloudflare, Oracle, BytePlus and Gallabox. We select the tools that fit your business rather than forcing a single platform.</p></div>
      <div className="dev-vendors">{technologyEcosystem.map(([name, copy]) => <article key={name}><div className="dev-logo-tile"><img className="dev-logo" src={logos[name].src} alt={logos[name].label + " logo"} height={44} loading="lazy" decoding="async"/></div><h3>{name}</h3><p>{copy}</p></article>)}</div>
      <div className="dev-certifications">
        <div><p className="tech-chapter__kicker">CLOUD EXPERTISE</p><h3>Certified across leading cloud platforms.</h3><p>Our team includes professionals certified across AWS, Google Cloud and Oracle Cloud.</p><p className="dev-logo-note">Logos are trademarks of their respective owners, shown to identify the platforms we work with. Their use does not imply endorsement.</p></div>
        <div className="dev-certifications__marks">{technologyExpertise.map(([short, name]) => <div key={short}><div className="dev-logo-tile dev-logo-tile--small"><img className="dev-logo" src={logos[short].src} alt={logos[short].label + " logo"} height={30} loading="lazy" decoding="async"/></div><span>{name}</span></div>)}</div>
      </div>
    </div>
    <div className="dev-faq">
      <div className="tech-chapter"><div><p className="tech-chapter__kicker">06 / FREQUENTLY ASKED QUESTIONS</p><h2>GOOD QUESTIONS.<br/><em>CLEAR ANSWERS.</em></h2></div><p>Practical answers about working with our technology team.</p></div>
      {developmentFaqs.map(([question, answer]) => <details key={question}><summary>{question}<Plus aria-hidden="true" size={22}/></summary><p>{answer}</p></details>)}
    </div>
  </section>;
}
