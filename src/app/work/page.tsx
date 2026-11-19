import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { workProjects } from "@/lib/work/projects";
import "./work-directory.css";

export const metadata: Metadata = {
  title: "Selected Work | Aiwa Media Group",
  description:
    "A selection of Aiwa Media Group's documented branding, marketing, production and digital experience projects.",
};

export default function WorkDirectory() {
  return (
    <main className="aiwa-directory">
      <header className="aiwa-directory__nav">
        <Link className="aiwa-directory__brand" href="/">AIWA</Link>
        <Link className="aiwa-directory__back" href="/#work">
          <ArrowLeft size={18} aria-hidden="true"/> BACK TO CAMPAIGNS
        </Link>
      </header>
      <div className="aiwa-directory__intro">
        <span className="aiwa-directory__eyebrow">AIWA / SELECTED WORK</span>
        <h1>THE WORK<span> SPEAKS.</span></h1>
        <p>
          A selection of the brands, businesses and ideas Aiwa has worked with.
          Explore the documented projects and services behind each story.
        </p>
      </div>
      <ol className="aiwa-directory__grid">
        {workProjects.map((project, index) => (
          <li key={project.slug} className="aiwa-directory__project">
            <a href={project.href} target="_blank" rel="noopener noreferrer"
              aria-label={"View Aiwa's " + project.client + " project in a new tab"}>
              <div className="aiwa-directory__visual">
                <Image src={project.artwork} width={960} height={740} alt={project.alt}
                  unoptimized loading="lazy"/>
                <span>0{index+1} / 0{workProjects.length}</span>
                <ArrowUpRight size={30} aria-hidden="true"/>
              </div>
              <div className="aiwa-directory__meta">
                <div><strong>{project.client}</strong><small>{project.discipline}</small></div>
                <p>{project.shortDescription}</p>
              </div>
            </a>
          </li>
        ))}
      </ol>
      <footer className="aiwa-directory__footer">
        <p>GOOD WORK BEGINS WITH A CONVERSATION.</p>
        <a href="https://aiwamediagroup.com/contact-us/">
          GET IN TOUCH <ArrowUpRight size={19} aria-hidden="true"/>
        </a>
      </footer>
    </main>
  );
}
