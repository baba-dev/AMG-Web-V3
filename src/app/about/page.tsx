import type { Metadata } from "next";
import { AiwaInnerHeader } from "@/components/aiwa-inner-header";
import { AboutHero } from "@/components/about/about-hero";
import { AboutIntroduction } from "@/components/about/about-introduction";
import { AboutManifesto } from "@/components/about/about-manifesto";
import { AboutValues } from "@/components/about/about-values";
import { AboutCapabilities } from "@/components/about/about-capabilities";
import { AboutCulture } from "@/components/about/about-culture";
import { AboutClosing } from "@/components/about/about-closing";
import "@/components/aiwa-polish.css";
import "./about-page.css";
import "@/components/about/about-story.css";
import "./about-editorial.css";
export const metadata: Metadata = {
 title:"About Aiwa Media Group | Beyond the Noise",
 description:"Meet the Muscat-based media group connecting creative production, marketing, events and digital technology.",
 alternates:{canonical:"/about/"},
 openGraph:{title:"Beyond the Noise — Aiwa Media Group",description:"Creative, digital and technology from Muscat, Oman."},
};
export default function AboutPage(){return <div className="aiwa-site about-page"><AiwaInnerHeader/><main id="main-content"><AboutHero/><AboutIntroduction/><AboutManifesto/><AboutValues/><AboutCapabilities/><AboutCulture/><AboutClosing/></main></div>}
