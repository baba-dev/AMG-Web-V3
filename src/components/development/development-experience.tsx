import { DevelopmentConnected, DevelopmentFeatured, DevelopmentTrust } from "./development-division";
import { ServiceScenes } from "./service-scenes";
import { FlightWall } from "./flight-wall";
import { TechHero } from "./tech-hero";
import "./development-experience.css";

/** Server-rendered composition of the Development page. Interactive islands live in their own client components. */
export function DevelopmentExperience() {
  return <>
    <TechHero/>
    <FlightWall/>
    <ServiceScenes/>
    <div data-tech-section="iot"><DevelopmentConnected/></div>
    <div data-tech-section="portfolio"><DevelopmentFeatured/></div>
    <div data-tech-section="trust"><DevelopmentTrust/></div>
  </>;
}
