import { DevelopmentConnected, DevelopmentFeatured, DevelopmentServices, DevelopmentTrust } from "./development-division";
import { TechHero } from "./tech-hero";
import "./development-experience.css";

/** Server-rendered composition of the Development page. Interactive islands live in their own client components. */
export function DevelopmentExperience() {
  return <>
    <TechHero/>
    <div data-tech-section="services"><DevelopmentServices/></div>
    <div data-tech-section="iot"><DevelopmentConnected/></div>
    <div data-tech-section="portfolio"><DevelopmentFeatured/></div>
    <div data-tech-section="trust"><DevelopmentTrust/></div>
  </>;
}
