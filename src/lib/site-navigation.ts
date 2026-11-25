export type MegaMenuItem = Readonly<{
  label: string;
  href: string;
  description: string;
  external?: boolean;
}>;

export type MegaMenuGroup = Readonly<{
  id: "work" | "about" | "creatives" | "campaigns" | "development" | "start";
  label: string;
  eyebrow: string;
  title: string;
  caption: string;
  accent: string;
  items: readonly MegaMenuItem[];
}>;

/** Canonical IA shared by both headers and the mobile navigation. */
export const megaMenuGroups = [
  {
    id: "work", label: "WORK", eyebrow: "SELECTED / ARCHIVE",
    title: "Proof, not promises.", accent: "#ef6559",
    caption: "Campaigns, platforms and identities made with ambitious teams.",
    items: [
      { label: "Selected Work", href: "/work", description: "Our current portfolio and project stories." },
      { label: "Technology Portfolio", href: "/work/technology", description: "Websites, products and connected digital systems." },
      { label: "Client Directory", href: "/work/clients", description: "Brands and organisations we have worked beside." },
      { label: "Case Studies", href: "/work/case-studies", description: "A closer look at the brief, thinking and outcome." },
    ],
  },
  {
    id: "about", label: "ABOUT", eyebrow: "PEOPLE / PLACE",
    title: "Muscat made. World facing.", accent: "#71b9d3",
    caption: "An independent creative and technology agency built in Oman.",
    items: [
      { label: "About Aiwa", href: "/about", description: "Our story, values and way of working." },
      { label: "Our Office", href: "/contact#contact-office", description: "Find our home in Muscat. A dedicated page follows." },
      { label: "Contact Us", href: "/contact", description: "Say hello, share a brief or start something new." },
    ],
  },
  {
    id: "creatives", label: "CREATIVES", eyebrow: "IMAGE / FILM / SOUND",
    title: "Make it impossible to ignore.", accent: "#f2ad67",
    caption: "Original production for every place a brand needs to be felt.",
    items: [
      { label: "Photography", href: "/specialisms/creatives", description: "Campaign, product, people and editorial imagery." },
      { label: "Film & Motion", href: "/specialisms/studio", description: "Vibrant films, animation and social-first motion." },
      { label: "Audio & Sonic", href: "/specialisms/creatives", description: "Immersive audio, voice and sonic storytelling." },
    ],
  },
  {
    id: "campaigns", label: "CAMPAIGNS", eyebrow: "ATTENTION / RECALL",
    title: "Ideas that travel.", accent: "#f59abb",
    caption: "Strategy, identity and content designed to move through culture.",
    items: [
      { label: "Advertising", href: "/specialisms/social", description: "Integrated campaigns across paid and organic channels." },
      { label: "Brand & Identity", href: "/specialisms/global", description: "Positioning and visual systems with staying power." },
      { label: "Search & Content", href: "/specialisms/corporate", description: "SEO, GEO, SERP strategy and useful publishing." },
    ],
  },
  {
    id: "development", label: "DEVELOPMENT", eyebrow: "PRODUCTS / SYSTEMS",
    title: "Beautifully engineered.", accent: "#8ea5ff",
    caption: "Useful digital products and resilient infrastructure, built as one.",
    items: [
      { label: "Technology Portfolio", href: "/work/technology", description: "Explore the things we have built." },
      { label: "Web & App Development", href: "/specialisms/tech", description: "Focused websites, applications and interfaces." },
      { label: "SaaS & Business Software", href: "/work/technology#tech-software", description: "Purpose-built software for business workflows." },
      { label: "Cloud & DevOps", href: "/work/technology#tech-cloud", description: "Cloud operations, automation and reliable delivery." },
      { label: "Professional Email Hosting", href: "/work/technology#tech-email", description: "Managed and dedicated business email." },
      { label: "AI & Business Automation", href: "/work/technology#tech-ai", description: "Intelligent products and connected workflows." },
    ],
  },
  {
    id: "start", label: "START HERE", eyebrow: "A GOOD BEGINNING",
    title: "Bring us the brave brief.", accent: "#c3eb6a",
    caption: "A quick question, a detailed brief or just the start of an idea.",
    items: [
      { label: "Quick Enquiry", href: "/contact#enquiries", description: "Tell us what you are making and where you are stuck." },
      { label: "Book a Meeting", href: "mailto:info@aiwamediagroup.com?subject=Meeting%20request%20for%20Aiwa", description: "Set up a focused conversation with the right team." },
      { label: "Resources", href: "https://aiwamediagroup.com/", description: "Brochures, service information and useful reading.", external: true },
    ],
  },
] as const satisfies readonly MegaMenuGroup[];

export const siteNavigation = megaMenuGroups.map((group) => ({
  label: group.label,
  href: group.items[0].href,
}));

export function resolveSiteHref(href: string, path: string): string {
  // Keep legacy in-page section links usable from inner pages, while
  // primary navigation points to dedicated routes for page transitions.
  if (href === "#specialisms" && path !== "/") return "/specialisms";
  if (href === "#contact" && path !== "/") return "/contact";
  return href.startsWith("#") && path !== "/" ? "/" + href : href;
}
