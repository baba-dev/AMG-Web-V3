/**
 * Current Aiwa Media Group team roster, provided by the company for publication.
 * Roles and descriptions are intentionally limited to the approved details.
 * Use role-specific iconography, not portraits or invented likenesses.
 */
export const teamFilters = [
  { id: "all", label: "ALL PEOPLE" },
  { id: "leadership", label: "LEADERSHIP" },
  { id: "sales", label: "SALES" },
  { id: "creative", label: "CREATIVE" },
  { id: "technology", label: "TECH & DIGITAL" },
] as const;

export type TeamFilter = (typeof teamFilters)[number]["id"];

export type TeamIcon = "founder" | "operations" | "engineering" | "sales" | "design";

export type TeamPerson = Readonly<{
  id: string;
  name: string;
  role: string;
  department: Exclude<TeamFilter, "all">;
  introduction: string;
  icon: TeamIcon;
}>;

export const teamPeople: readonly TeamPerson[] = [
  {
    id: "imaad-khan",
    name: "Imaad Khan",
    role: "Founder & CEO",
    department: "leadership",
    icon: "founder",
    introduction: "Founder of Aiwa Media Group, with over 20 years of experience nurturing small businesses and helping them launch their online presence.",
  },
  {
    id: "abeer-sayed",
    name: "Abeer Sayed",
    role: "Director of Operations",
    department: "leadership",
    icon: "operations",
    introduction: "Abeer specializes in client management and project management. She also leads the Events Orchestration division of Aiwa Media Group.",
  },
  {
    id: "sameer-siddiqui",
    name: "Sameer Siddiqui",
    role: "SDE-II, DevOps Engineer",
    department: "technology",
    icon: "engineering",
    introduction: "Works across leading web technologies and cloud providers, with expertise in IT development, server management and ESP32-based IoT hardware.",
  },
  {
    id: "mahmoud",
    name: "Mahmoud",
    role: "Sales",
    department: "sales",
    icon: "sales",
    introduction: "Omani sales professional at Aiwa Media Group.",
  },
  {
    id: "talha",
    name: "Talha",
    role: "Media & Artwork",
    department: "creative",
    icon: "design",
    introduction: "Designer working on media and artwork for Aiwa Media Group.",
  },
];

export const teamCulture = [
  { number:"01", title:"MAKE ROOM FOR IDEAS.", intro:"Creative freedom",
    copy:"Bring new thinking to every brief. The best answers come from people who feel able to challenge the expected." },
  { number:"02", title:"GROW AS YOU GO.", intro:"Learning & development",
    copy:"Different disciplines create opportunities to learn from each other and work beyond one familiar format." },
  { number:"03", title:"BUILD IT TOGETHER.", intro:"Collaboration",
    copy:"Strategy, design, production, technology and events come together around the same client challenge." },
] as const;

export const teamDivisions = [
  { number:"01", title:"Strategy & Digital", description:"The thinking, audience insight and channel expertise behind the brief.", href:"/specialisms/social" },
  { number:"02", title:"Brand & Design", description:"Distinctive identities and visual worlds that make brands recognizable.", href:"/specialisms/consumer" },
  { number:"03", title:"Film & Production", description:"Crafting imagery, films and production-led storytelling.", href:"/specialisms/studio" },
  { number:"04", title:"Events & Experience", description:"Bringing ideas into physical spaces and shared cultural moments.", href:"/specialisms/sports" },
  { number:"05", title:"Technology", description:"Building websites, digital products and reliable connected experiences.", href:"/specialisms/tech" },
] as const;
