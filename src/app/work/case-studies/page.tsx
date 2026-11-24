import type { Metadata } from "next";
import { AiwaInnerHeader } from "@/components/aiwa-inner-header";
import { ShowcaseHero } from "@/components/case-studies/showcase-hero";
import { ShowcaseIndex } from "@/components/case-studies/showcase-index";
import { ShowcaseChapter } from "@/components/case-studies/showcase-chapter";
import { ShowcaseOutro } from "@/components/case-studies/showcase-outro";
import { showcaseChapters } from "@/lib/work/case-study-showcase";
import "@/components/aiwa-polish.css";
import "./case-studies.css";

export const metadata: Metadata = {
  title: "Case Studies — Proof in Motion | Aiwa Media Group",
  description: "Explore Aiwa’s selected client stories, documented marketing work and historical campaign results.",
  alternates: {canonical: "/work/case-studies/"},
  openGraph: {title: "Less Talk. More Impact. | Aiwa Media Group", description: "Real brands, real challenges and meaningful results.", type: "website"}
};
export default function CaseStudyShowcasePage() {
  return <div className="aiwa-site cs-page"><AiwaInnerHeader/><main id="main-content">
    <ShowcaseHero/>
    <ShowcaseIndex/>
    {showcaseChapters.map((chapter, index) => <ShowcaseChapter key={chapter.slug} chapter={chapter} index={index}/>)}
    <ShowcaseOutro/>
  </main></div>;
}
