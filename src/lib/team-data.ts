/**
 * Editorial archive assembled from Aiwa's publicly published Our Team page.
 * IMPORTANT: legacy biographies are historical source material, NOT proof of
 * current employment. Confirm each person's title, consent and portrait before
 * publishing it as a live employee roster.
 *
 * Source: https://aiwamediagroup.com/our-team/
 * Careers background: https://aiwamediagroup.com/career/
 */
export const teamSource = "https://aiwamediagroup.com/our-team/" as const;

export const teamFilters = [
  { id: "all", label: "ALL PEOPLE" },
  { id: "leadership", label: "LEADERSHIP" },
  { id: "creative", label: "CREATIVE" },
  { id: "production", label: "PRODUCTION" },
  { id: "technology", label: "TECH & DIGITAL" },
] as const;

export type TeamFilter = (typeof teamFilters)[number]["id"];

export type TeamPerson = Readonly<{
  id: string;
  name: string;
  role: string;
  department: Exclude<TeamFilter, "all">;
  introduction: string;
  portrait: string | null;
  /** Source titles and membership must be reverified before using live-team language. */
  source: typeof teamSource;
}>;

export const teamPeople: readonly TeamPerson[] = [
  { id:"imaad-khan", name:"Imaad Khan", role:"Founder & CEO", department:"leadership",
    introduction:"Founder of Aiwa Media Group, with experience helping businesses establish a stronger presence online.", portrait:null, source:teamSource },
  { id:"abeer-sayed", name:"Abeer Sayed", role:"Director of Operations", department:"leadership",
    introduction:"Client and project management, with a focus on coordinating events and delivering complex work.", portrait:null, source:teamSource },
  { id:"bilawal-ali", name:"Bilawal Ali", role:"Head of Sales & Client Management", department:"leadership",
    introduction:"Sales, client relationships and partnerships across the agency's published service offering.", portrait:null, source:teamSource },
  { id:"monisha-dhansinghani", name:"Monisha Dhansinghani", role:"Digital Designs Division", department:"creative",
    introduction:"Digital marketing, social campaigns, content planning and connected brand experiences.", portrait:null, source:teamSource },
  { id:"sameer-siddiqui", name:"Sameer Siddiqui", role:"SDE-II & DevOps Engineer", department:"technology",
    introduction:"Web engineering, cloud operations, infrastructure and connected software systems.", portrait:null, source:teamSource },
  { id:"awais-faisal", name:"Awais Faisal", role:"Video Productions", department:"production",
    introduction:"Creative storytelling through campaign films, short-form video and visual production.", portrait:null, source:teamSource },
  { id:"irfan-khan", name:"Irfan Khan", role:"Digital Designs Division", department:"creative",
    introduction:"Graphic design, CGI, photography and creative production across media formats.", portrait:null, source:teamSource },
  { id:"joel-biju", name:"Joel Biju", role:"Media Generations Team", department:"creative",
    introduction:"Graphic design for digital media, web and large-format printed materials.", portrait:null, source:teamSource },
  { id:"md-adnan", name:"Md. Adnan", role:"Media Generations Team", department:"creative",
    introduction:"Visual effects, digital design and filmmaking-led creative exploration.", portrait:null, source:teamSource },
  { id:"neha-matlani", name:"Neha Matlani", role:"Content Production & Digital Marketing", department:"production",
    introduction:"Content development and visual stories shaped around client goals.", portrait:null, source:teamSource },
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
