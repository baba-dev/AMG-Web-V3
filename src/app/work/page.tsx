import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { AiwaInnerHeader } from "@/components/aiwa-inner-header";
import { AiwaGlobalFooter } from "@/components/aiwa-footer";
import { WorkGallery } from "@/components/work-gallery";
import { WorkHero } from "@/components/work-hero";
import "@/components/aiwa-polish.css";
import "./work-directory.css";

export const metadata: Metadata = {
  title: "Selected Work | Aiwa Media Group",
  description: "Explore selected Aiwa Media Group identity, digital marketing, content production and commerce projects.",
  alternates: { canonical: "/work/" },
  openGraph: {
    title: "Selected Work — Aiwa Media Group",
    description: "Ideas that make noise. Explore the people, brands and creative projects behind Aiwa's work.",
    type: "website",
  },
};

export default function WorkDirectory() {
  return (
    <div className="aiwa-site work-page">
      <AiwaInnerHeader />
      <main id="main-content">
        <WorkHero />
        <section className="work-page__paper" aria-labelledby="work-index-title" id="work-index">
          <div className="work-page__index-header work-page__gutter">
            <div>
              <span className="work-page__eyebrow">01 / THE PORTFOLIO</span>
              <h2 id="work-index-title">THE WORK<span>.</span></h2>
            </div>
            <p>Brand worlds, digital experiences and campaigns built around the ambitions of the people behind them.</p>
          </div>
          <WorkGallery />
          <p className="work-page__disclosure work-page__gutter">Illustrations shown are original conceptual editorial artwork, not documentary campaign photography.</p>
        </section>
        <section className="work-page__outro work-page__gutter" aria-labelledby="work-outro-title">
          <span className="work-page__eyebrow">HAVE SOMETHING IN MIND?</span>
          <h2 id="work-outro-title">LET’S MAKE<br/><em>SOME NOISE.</em></h2>
          <a href="/#contact" className="work-page__contact-link">START A CONVERSATION <ArrowUpRight size={25} aria-hidden="true"/></a>
        </section>
      </main>
      <AiwaGlobalFooter />
    </div>
  );
}
