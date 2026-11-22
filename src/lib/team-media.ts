/**
 * All documentary media below already exists in Aiwa V3's public archive.
 * Never present campaign artwork as photography of employees.
 * Source provenance: src/components/aiwa-about.tsx and
 * public/media/archive/README.md.
 */
export type TeamEditorialFrame = Readonly<{
  src: string;
  alt: string;
  label: string;
  category: "documentary" | "published-work";
  shape: "portrait" | "landscape" | "square";
}>;

export const teamEditorialFrames: readonly TeamEditorialFrame[] = [
  { src:"/media/archive/production-team.webp",
    alt:"Aiwa's production image from the former company's published gallery",
    label:"BEHIND THE IDEAS / AIWA ARCHIVE", category:"documentary", shape:"landscape" },
  { src:"/media/archive/ridhwan-showcase.webp",
    alt:"Published product-campaign collage for an optical retailer",
    label:"THE WORK / OPTICAL CAMPAIGN", category:"published-work", shape:"portrait" },
  { src:"/media/archive/mymo-coffee.webp",
    alt:"Published MYMO Express coffee campaign artwork",
    label:"THE WORK / MYMO EXPRESS", category:"published-work", shape:"square" },
  { src:"/media/archive/casabella-discount.webp",
    alt:"Published bilingual Casabella retail campaign artwork",
    label:"THE WORK / CASABELLA", category:"published-work", shape:"portrait" },
];

export const teamSignalArtwork = "/media/team/aiwa-signal.svg";
