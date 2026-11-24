import { getWorkProject } from "./projects";

export type ShowcaseSlug = "mymo-express" | "casabella-oman" | "best-genetco";
export type ShowcaseMetric = Readonly<{
  value: number; display: string; label: string; period: string;
  source: "legacy-case-study"; verificationStatus: "historical-reported";
}>;
export type ShowcaseChapter = Readonly<{
  slug: ShowcaseSlug; name: string; shortName: string; category: string;
  headline: readonly [string, string]; intro: string; response: string;
  disciplines: readonly string[]; metrics: readonly ShowcaseMetric[];
  art: string; archive?: { src: string; alt: string };
  status: "historical-case-study" | "featured-brand";
}>;
export const legacyCaseSource = "https://aiwamediagroup.com/case-study/";
export const showcaseChapters: readonly ShowcaseChapter[] = [
  {
    slug: "mymo-express", name: "MYMO Express", shortName: "MYMO", category: "FINTECH / DIGITAL MARKETING",
    headline: ["CONNECTION", "WITHOUT LIMITS."],
    intro: "MYMO describes a mobile communication network that connects banks and their customers, making banking services more readily accessible.",
    response: "Aiwa supported MYMO Express across digital promotion, brand management, advertising and physical promotional materials, bringing multiple communication channels together.",
    disciplines: ["Digital marketing", "Brand management", "Google Ads management", "Signage & print"],
    metrics: [{ value: 3000, display: "3,000", label: "App downloads", period: "In 30 days", source: "legacy-case-study", verificationStatus: "historical-reported" }],
    art: "/media/case-studies/mymo-signal.svg",
    archive: {src: "/media/archive/mymo-coffee.webp", alt: "MYMO promotional artwork from Aiwa’s published archive"},
    status: "historical-case-study"
  },
  {
    slug: "casabella-oman", name: "Casabella Oman", shortName: "CASABELLA", category: "RETAIL / BRAND / CAMPAIGNS",
    headline: ["RETAIL,", "REIMAGINED."],
    intro: "Casabella Oman brings internationally sourced products to the Omani market through retail, production and distribution.",
    response: "Aiwa’s published work combines digital marketing, advertising and client servicing with a wider brand identity programme, from logo and theme design to printed materials.",
    disciplines: ["Digital marketing", "Advertising campaigns", "Client servicing", "Brand identity", "Print design"],
    metrics: [
      {value: 105000, display: "105K", label: "Total reach", period: "In seven days", source: "legacy-case-study", verificationStatus: "historical-reported"},
      {value: 35000, display: "35K", label: "Organic reach", period: "In the same reported campaign", source: "legacy-case-study", verificationStatus: "historical-reported"}
    ],
    art: "/media/case-studies/casabella-form.svg",
    archive: {src: "/media/archive/casabella-discount.webp", alt: "Casabella promotional artwork from Aiwa’s published archive"},
    status: "historical-case-study"
  },
  {
    slug: "best-genetco", name: "BEST by Genetco", shortName: "BEST", category: "HOME APPLIANCES / FEATURED BRAND",
    headline: ["LIFE AT", "ITS BEST."],
    intro: "BEST by Genetco is a home-appliance brand featured in Aiwa’s public portfolio, including cooling and refrigeration products.",
    response: "An editorial look at everyday technology. Specific campaign scope and performance have not been confirmed, so this feature introduces the brand rather than attributing campaign results.",
    disciplines: [], metrics: [], art: "/media/case-studies/best-precision.svg",
    status: "featured-brand"
  }
];
export function getShowcaseChapter(slug: string) {
  return showcaseChapters.find(chapter => chapter.slug === slug && getWorkProject(slug));
}
