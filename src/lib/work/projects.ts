/**
 * Source-backed, conservative copy for Aiwa's publicly documented work.
 *
 * Public sources:
 * https://aiwamediagroup.com/case-study/
 * https://aiwamediagroup.com/branding/
 *
 * Artwork in /public/media/work/ is original *conceptual editorial art*,
 * not a claimed photograph or reproduction of any client campaign.
 */

export type WorkDiscipline =
  | "BRAND IDENTITY"
  | "DIGITAL MARKETING"
  | "CONTENT & PRODUCTION"
  | "DIGITAL EXPERIENCE";

export type WorkProject = Readonly<{
  slug: string;
  client: string;
  title: string;
  discipline: WorkDiscipline;
  shortDescription: string;
  alt: string;
  artwork: `/media/work/${string}.svg`;
  href: `https://aiwamediagroup.com/${string}`;
  visualLabel: string;
  /** Set true only for the original editorial art shipped with this site. */
  conceptualArt: true;
  video?: Readonly<{
    /** An optional locally hosted, explicitly approved MP4. Never required. */
    src: `/media/work/${string}.mp4`;
    poster: `/media/work/${string}.svg`;
  }>;
}>;

export const workProjects = [
  {
    slug: "mymo-express",
    client: "MYMO EXPRESS",
    title: "Identity in motion",
    discipline: "BRAND IDENTITY",
    shortDescription: "Brand guidelines and a consistent visual identity for MYMO.",
    alt: "Original editorial artwork suggesting express delivery, with orange routes and a moving parcel",
    artwork: "/media/work/mymo-express.svg",
    href: "https://aiwamediagroup.com/branding/",
    visualLabel: "MOVEMENT / IDENTITY",
    conceptualArt: true,
  },
  {
    slug: "casabella-oman",
    client: "CASABELLA OMAN",
    title: "A new retail language",
    discipline: "BRAND IDENTITY",
    shortDescription: "Retail brand identity and design systems for Casabella Oman.",
    alt: "Original editorial art showing a sculptural chair-like object against vermilion and pink forms",
    artwork: "/media/work/casabella-oman.svg",
    href: "https://aiwamediagroup.com/branding/",
    visualLabel: "DESIGN / RETAIL",
    conceptualArt: true,
  },
  {
    slug: "best-genetco",
    client: "BEST BY GENETCO",
    title: "Making the everyday visible",
    discipline: "DIGITAL MARKETING",
    shortDescription: "Digital marketing and creator-focused content for the home-appliance brand.",
    alt: "Original blue editorial composition with a simplified home-appliance silhouette and light",
    artwork: "/media/work/best-genetco.svg",
    href: "https://aiwamediagroup.com/case-study/",
    visualLabel: "CULTURE / HOME",
    conceptualArt: true,
  },
  {
    slug: "aqua-petro",
    client: "AQUA PETRO CHEMICALS",
    title: "Science with a human face",
    discipline: "CONTENT & PRODUCTION",
    shortDescription: "Website, search content, photography and event coverage for an industrial specialist.",
    alt: "Original cyan laboratory-inspired editorial composition with sculptural glass forms",
    artwork: "/media/work/aqua-petro.svg",
    href: "https://aiwamediagroup.com/case-study/",
    visualLabel: "IDEAS / INDUSTRY",
    conceptualArt: true,
  },
  {
    slug: "razmazaan",
    client: "RAZMAZAAN",
    title: "An identity worth gathering around",
    discipline: "BRAND IDENTITY",
    shortDescription: "Restaurant brand guidelines, colour and visual identity for RazMazaan.",
    alt: "Original saffron, maroon and green editorial artwork referencing a dining table and spice forms",
    artwork: "/media/work/razmazaan.svg",
    href: "https://aiwamediagroup.com/branding/",
    visualLabel: "CULTURE / FLAVOUR",
    conceptualArt: true,
  },
  {
    slug: "vitamin-phones",
    client: "VITAMIN PHONES",
    title: "Commerce connected",
    discipline: "DIGITAL EXPERIENCE",
    shortDescription: "Unified point-of-sale, inventory and e-commerce workflows for a phone retailer.",
    alt: "Original violet editorial visual showing illuminated phone-shaped rectangles and transaction lines",
    artwork: "/media/work/vitamin-phones.svg",
    href: "https://aiwamediagroup.com/case-study/",
    visualLabel: "COMMERCE / SYSTEMS",
    conceptualArt: true,
  },
] as const satisfies readonly WorkProject[];

export type FeaturedWorkProject = (typeof workProjects)[number];
export function getWorkProject(slug: string): FeaturedWorkProject | undefined {
  return workProjects.find((project) => project.slug === slug);
}

export function isApprovedPortfolioDestination(href: string): boolean {
  try {
    const url = new URL(href);
    return (
      url.protocol === "https:" &&
      url.hostname === "aiwamediagroup.com" &&
      (url.pathname === "/case-study/" || url.pathname === "/branding/")
    );
  } catch {
    return false;
  }
}
