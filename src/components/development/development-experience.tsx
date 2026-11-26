import { FlightWall } from "./flight-wall";
import { Finale } from "./finale";
import { IotSection } from "./iot-section";
import { ServiceScenes } from "./service-scenes";
import { TechHero } from "./tech-hero";
import { TrustSection } from "./trust-section";
import "./development-experience.css";

/** Server-rendered composition of the Development page. Interactive islands live in their own client components. */
export function DevelopmentExperience() {
  return <>
    <TechHero/>
    <FlightWall/>
    <ServiceScenes/>
    <IotSection/>
    <TrustSection/>
    <Finale/>
  </>;
}
