/**
 * Service descriptions are Aiwa V3 editorial presentation of publicly described
 * capabilities. They are not invented performance claims, project results,
 * offices or quotes. Client work associations are conservative and separately
 * documented at src/lib/work/case-studies.ts.
 *
 * Aiwa sources:
 * /about-us/, /branding/, /video-production/, /event-planning/,
 * /case-study/, /contact-us/ on https://aiwamediagroup.com
 */
import { workProjects, type FeaturedWorkProject } from "@/lib/work/projects";

export type SpecialismSlug =
  "global" | "consumer" | "corporate" | "sports" | "social" | "studio" | "tech";

export type Specialism = Readonly<{
  slug:SpecialismSlug;
  name:string;
  index:number;
  kicker:string;
  headline:[string,string];
  title:string;
  lead:string;
  position:string;
  question:string;
  answer:string;
  art:`/media/specialisms/${string}.svg`;
  alt:string;
  accent:string;
  ink:string;
  approach:readonly [
    Readonly<{name:string;copy:string}>,
    Readonly<{name:string;copy:string}>,
    Readonly<{name:string;copy:string}>
  ];
  capabilities:ReadonlyArray<Readonly<{name:string;copy:string}>>;
  workSlugs:readonly FeaturedWorkProject["slug"][];
  evidenceNote:string;
  sources:ReadonlyArray<Readonly<{label:string;href:`https://${string}`;}>>;
}>;

export const specialisms = [
  {
    slug:"global",name:"Global",index:1,kicker:"01 / THINK BEYOND THE MAP",
    headline:["ROOTED HERE.","THINKING BEYOND."],
    title:"Creative thinking that travels.",
    lead:"From Muscat, ideas can speak to more than one market. We bring strategy, identity and communication into focus before the work moves across channels and borders.",
    position:"LOCAL UNDERSTANDING. WIDER PERSPECTIVE.",
    question:"What moves with a brand when the audience changes?",
    answer:"A consistent identity and a clear story. Our published work includes internationally connected Omani businesses; this page describes a way of thinking, not a claim of offices or completed campaigns in multiple countries.",
    art:"/media/specialisms/global.svg",
    alt:"Original conceptual editorial map: blue arcs and lines converge toward a copper compass point",
    accent:"#71b9d3",ink:"#10242d",
    approach:[
      {name:"UNDERSTAND THE CONTEXT",copy:"Learn the audience, the market and the meaning behind the message before creative execution."},
      {name:"FIND THE COMMON THREAD",copy:"Develop a recognizable voice and visual language with room for different channels."},
      {name:"ADAPT THE EXPRESSION",copy:"Shape the format for the places a brand actually needs to be seen."},
    ],
    capabilities:[
      {name:"Brand consistency",copy:"Keep identities and creative systems coherent across formats."},
      {name:"Multichannel content",copy:"Plan adaptable visual and written material for relevant channels."},
      {name:"Regional perspective",copy:"Create from Aiwa's Muscat base with an eye on wider audiences."},
    ],
    workSlugs:["casabella-oman","mymo-express"],
    evidenceNote:"Related identity work for businesses with broad audience ambitions. These case studies do not establish that Aiwa executed an international campaign.",
    sources:[{label:"Agency scope",href:"https://aiwamediagroup.com/about-us/"},{label:"Client and branding records",href:"https://aiwamediagroup.com/branding/"}],
  },
  {
    slug:"consumer",name:"Consumer",index:2,kicker:"02 / MADE TO BE REMEMBERED",
    headline:["NOT JUST SEEN.","FELT."],
    title:"Brands with a point of view.",
    lead:"Good consumer creative makes a business recognizable before the name appears. Identity, design and storytelling should belong to the same world.",
    position:"IDENTITY WITH PERSONALITY.",
    question:"What makes a brand worth choosing?",
    answer:"A distinct voice, familiar visuals and ideas people can actually connect with. From retail to restaurants, Aiwa's documented branding projects show how foundational systems support that consistency.",
    art:"/media/specialisms/consumer.svg",
    alt:"Original coral editorial illustration with layered product forms and a glowing retail display arch",
    accent:"#f28a75",ink:"#381a19",
    approach:[
      {name:"FIND THE SIGNATURE",copy:"Identify the character, audience and point of difference that should guide the brand."},
      {name:"CREATE THE SYSTEM",copy:"Build an adaptable visual and typographic language across touchpoints."},
      {name:"GIVE IT PRESENCE",copy:"Apply that language to the formats where customers meet the business."},
    ],
    capabilities:[
      {name:"Brand identity",copy:"Logos, palettes, typography and consistent guidelines."},
      {name:"Retail creative",copy:"A connected visual experience across customer touchpoints."},
      {name:"Restaurant branding",copy:"Distinctive identity systems for food and hospitality concepts."},
      {name:"Campaign design",copy:"Editorial content and graphics consistent with a brand's voice."},
    ],
    workSlugs:["casabella-oman","razmazaan"],
    evidenceNote:"Selected published Aiwa identity work for Casabella Oman and RazMazaan.",
    sources:[{label:"Branding services and projects",href:"https://aiwamediagroup.com/branding/"},{label:"Aiwa capabilities",href:"https://aiwamediagroup.com/about-us/"}],
  },
  {
    slug:"corporate",name:"Corporate",index:3,kicker:"03 / BUSINESS HAS A HUMAN SIDE",
    headline:["MAKE COMPLEX.","CLEAR."],
    title:"Serious work. Clearer stories.",
    lead:"Expertise matters most when people can understand it. We help technical and professional organizations communicate through content, websites and business experiences.",
    position:"SUBSTANCE, WITHOUT THE STATIC.",
    question:"How do you make technical expertise accessible?",
    answer:"Start with an accurate brief. Then use sharp writing, purposeful design and the right media to make intricate work easier to understand. Aiwa's AquaPetro record includes a website, technical content and visual documentation.",
    art:"/media/specialisms/corporate.svg",
    alt:"Original copper and charcoal editorial architectural illustration of industrial glass and precise data lines",
    accent:"#cb9e6c",ink:"#281e1b",
    approach:[
      {name:"GET TO THE POINT",copy:"Understand the service, the customer and the details that cannot be distorted."},
      {name:"BUILD THE EXPLANATION",copy:"Structure websites, copy and visuals around the questions audiences bring."},
      {name:"PRESENT WITH CONFIDENCE",copy:"Make complex work approachable across digital and real-world settings."},
    ],
    capabilities:[
      {name:"Corporate websites",copy:"Business-focused websites that explain services clearly."},
      {name:"Technical content",copy:"Organized, search-aware subject-matter writing."},
      {name:"Event communications",copy:"Photo, video and event coverage when relevant."},
      {name:"Identity systems",copy:"Consistent expression for professional organizations."},
    ],
    workSlugs:["aqua-petro"],
    evidenceNote:"AquaPetro demonstrates documented industrial website, content and visual production services.",
    sources:[{label:"Aiwa's published client work",href:"https://aiwamediagroup.com/case-study/"},{label:"Company services",href:"https://aiwamediagroup.com/about-us/"}],
  },
  {
    slug:"sports",name:"Sports",index:4,kicker:"04 / THE ENERGY OF LIVE CULTURE",
    headline:["FEEL THE.","MOMENT."],
    title:"Moments built for the crowd.",
    lead:"Sport, esports and live experiences demand energy and coordination. Our event-creative offering explores how identity, content and orchestration can bring people together.",
    position:"CULTURE. COMMUNITY. LIVE ENERGY.",
    question:"What turns an event into an experience?",
    answer:"An idea people care about, the right environment and thoughtful production. Aiwa publicly offers event planning, branded experiences and esports event orchestration. We do not yet have a verified sports-specific client case study on V3.",
    art:"/media/specialisms/sports.svg",
    alt:"Original lime and forest-green editorial study of stadium arcs, motion trails and an abstract arena",
    accent:"#c3eb6a",ink:"#1c321e",
    approach:[
      {name:"START WITH THE COMMUNITY",copy:"Understand the audience and the kind of experience they will value."},
      {name:"SHAPE THE EVENT",copy:"Plan a creative idea, visual system and format appropriate to the occasion."},
      {name:"MAKE IT HAPPEN",copy:"Coordinate the event, production and communication requirements."},
    ],
    capabilities:[
      {name:"Esports events",copy:"Aiwa lists esports-event orchestration in its public events offering."},
      {name:"Experiential planning",copy:"Creative formats for live brand and audience engagement."},
      {name:"Event production",copy:"Planning, coordination and event-day support."},
      {name:"Content design",copy:"Creative assets and communication formats surrounding events."},
    ],
    workSlugs:[],
    evidenceNote:"No published, independently verified sports-specific Aiwa client case study is available here yet. Browse other disciplines for demonstrated creative and technical work.",
    sources:[{label:"Aiwa event and esports offering",href:"https://aiwamediagroup.com/event-planning/"}],
  },
  {
    slug:"social",name:"Social",index:5,kicker:"05 / MADE FOR THE FEED",
    headline:["DON'T JUST.","POST."],
    title:"Stories designed to travel.",
    lead:"Social isn't a crop size. It's the conversation a brand chooses to join. Strategy, creative production and audience thinking should work as one.",
    position:"SOCIAL FIRST. HUMAN ALWAYS.",
    question:"What does a brand add to the conversation?",
    answer:"Useful stories, distinctive visuals and a consistent rhythm. Aiwa describes digital marketing, social media management, advertising and content planning among its services.",
    art:"/media/specialisms/social.svg",
    alt:"Original pink-magenta editorial composition showing stacked social-story frames and expressive circular graphics",
    accent:"#f59abb",ink:"#421b37",
    approach:[
      {name:"LISTEN FIRST",copy:"Understand the audience, the brand voice and where relevant conversations happen."},
      {name:"MAKE CONTENT MATTER",copy:"Design content around the message rather than the platform template."},
      {name:"KEEP LEARNING",copy:"Use response, context and evolving channels to inform creative direction."},
    ],
    capabilities:[
      {name:"Social media planning",copy:"Channel, format and content planning for brand communication."},
      {name:"Digital campaigns",copy:"Paid and organic advertising creative and management."},
      {name:"Influencer collaborations",copy:"Aiwa describes influencer marketing among its broader offerings."},
      {name:"Campaign content",copy:"Social graphics, writing, photography and video coordination."},
    ],
    workSlugs:["mymo-express","casabella-oman"],
    evidenceNote:"MYMO and Casabella are documented Aiwa client relationships with marketing or identity work; case pages clarify the specific verified scope.",
    sources:[{label:"Digital marketing and client scope",href:"https://aiwamediagroup.com/case-study/"},{label:"Agency social and marketing services",href:"https://aiwamediagroup.com/about-us/"}],
  },
  {
    slug:"studio",name:"Studio",index:6,kicker:"06 / WHERE STORIES TAKE SHAPE",
    headline:["MAKE IT.","UNMISSABLE."],
    title:"Concept to camera to culture.",
    lead:"Moving image, photography and designed content bring ideas to life. We approach each medium as part of a bigger story, not a decorative afterthought.",
    position:"THE IDEA LOOKS BETTER IN MOTION.",
    question:"How should a story be experienced?",
    answer:"Sometimes as a film. Sometimes in a photograph, motion graphic or event recap. Aiwa's public portfolio documents photography and video for AquaPetro, alongside broader production services.",
    art:"/media/specialisms/studio.svg",
    alt:"Original golden-amber editorial illustration featuring a photographic aperture, stage lights and a floating motion frame",
    accent:"#f2ad67",ink:"#40271b",
    approach:[
      {name:"FRAME THE IDEA",copy:"Establish a clear visual brief, audience and storytelling intention."},
      {name:"MAKE THE CONTENT",copy:"Produce the image, footage or designed assets suited to the message."},
      {name:"FINISH FOR THE FORMAT",copy:"Prepare finished assets to fit their approved channels and uses."},
    ],
    capabilities:[
      {name:"Photography",copy:"People, products, business spaces and event documentation."},
      {name:"Film and video",copy:"Creative videos and practical business storytelling."},
      {name:"Animation",copy:"Motion-led presentation and animated creative content."},
      {name:"Event coverage",copy:"Capture key moments in environments and live experiences."},
    ],
    workSlugs:["aqua-petro"],
    evidenceNote:"AquaPetro is linked for the photography, laboratory video and event coverage described in Aiwa's published case study.",
    sources:[{label:"Video production services",href:"https://aiwamediagroup.com/video-production/"},{label:"AquaPetro published work",href:"https://aiwamediagroup.com/case-study/"}],
  },
  {
    slug:"tech",name:"Tech",index:7,kicker:"07 / BUILT TO WORK BEAUTIFULLY",
    headline:["THINK BIG.","BUILD SMART."],
    title:"Digital experiences with purpose.",
    lead:"Good technology makes the complicated feel natural. Websites, apps and connected business systems should solve a real problem and still feel effortless to use.",
    position:"ENGINEERED FOR PEOPLE.",
    question:"What if technology simply worked harder for you?",
    answer:"Start with the workflow, not the framework. Aiwa's published Vitamin Phones case study describes POS and stock operations, while AquaPetro provides an example of an industrial web experience.",
    art:"/media/specialisms/tech.svg",
    alt:"Original violet-cyan editorial illustration of modular interface panels, circuits and an illuminated mobile viewport",
    accent:"#8ea5ff",ink:"#25264a",
    approach:[
      {name:"MAP THE PROBLEM",copy:"Learn which real-world workflows and users the product needs to serve."},
      {name:"DESIGN THE EXPERIENCE",copy:"Make interfaces clear, responsive and appropriately accessible."},
      {name:"BUILD THE SYSTEM",copy:"Connect the features, content and integrations that support the use case."},
    ],
    capabilities:[
      {name:"Website development",copy:"Responsive sites and business-facing digital experiences."},
      {name:"Software and apps",copy:"Custom applications shaped around specific operations."},
      {name:"Commerce and POS",copy:"Storefront and transaction workflows, where needed."},
      {name:"Inventory and integration",copy:"Connected stock, staff and business processes."},
    ],
    workSlugs:["vitamin-phones","aqua-petro"],
    evidenceNote:"Vitamin Phones and AquaPetro illustrate two different documented technology scopes: retail operations and a technical-business website.",
    sources:[{label:"Software and case-study work",href:"https://aiwamediagroup.com/case-study/"},{label:"Web and app services",href:"https://aiwamediagroup.com/about-us/"}],
  },
] as const satisfies readonly Specialism[];

export function getSpecialism(slug:string):Specialism|undefined {
  return specialisms.find(item=>item.slug===slug);
}
export function getRelatedProjects(service:Specialism):FeaturedWorkProject[] {
  return service.workSlugs.map(slug=>{
    const project=workProjects.find(p=>p.slug===slug);
    if(!project)throw new Error("Unknown specialism project association: "+slug);
    return project;
  });
}
export function nextSpecialism(service:Specialism):Specialism {
  return specialisms[service.index % specialisms.length];
}
export function previousSpecialism(service:Specialism):Specialism {
  return specialisms[(service.index+specialisms.length-2)%specialisms.length];
}
