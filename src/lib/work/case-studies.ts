import { workProjects, type FeaturedWorkProject } from "./projects";

/**
 * Aiwa source-grounded editorial interpretations.
 * Narrative descriptions are NOT direct client quotes, measured results or
 * claims that the original conceptual art was delivered as client work.
 *
 * Primary sources:
 *   https://aiwamediagroup.com/case-study/
 *   https://aiwamediagroup.com/branding/
 *   https://aiwamediagroup.com/
 *
 * Keep partial records transparent; especially BEST, whose published
 * "Case Study 3" contains text about Casabella, not independently verified
 * Genetco deliverables.
 */
export type WorkSlug=FeaturedWorkProject["slug"];
export type EditorialStory=Readonly<{
 slug:WorkSlug;
 confidence:"documented"|"limited";
 hero:Readonly<{overline:string;line1:string;line2:string;descriptor:string;}>;
 visual:Readonly<{theme:string;motif:string;panelTitle:string;caption:string;}>;
 context:string;
 brief:Readonly<{eyebrow:string;title:string;body:string;}>;
 idea:Readonly<{eyebrow:string;title:string;body:string;}>;
 deliverables:ReadonlyArray<Readonly<{name:string;description:string;}>>;
 closing:Readonly<{headline:string;body:string;}>;
 sources:ReadonlyArray<Readonly<{label:string;href:`https://${string}`;}>>;
}>;

const caseStudies = {
 "mymo-express":{
  slug:"mymo-express",confidence:"documented",
  hero:{overline:"THE CONNECTED IDENTITY",line1:"CONNECTION",line2:"WITHOUT LIMITS.",descriptor:"BRAND / DIGITAL / COMMUNICATION"},
  visual:{theme:"signal",motif:"01 — CONNECTION",panelTitle:"IDENTITY IN EVERY CHANNEL",caption:"Conceptual study of a connected mobile-services identity; not a photographed MYMO campaign."},
  context:"Aiwa describes MYMO as a communication network connecting financial institutions and their customers through mobile services. Its brand needed a consistent presence wherever those services were experienced.",
  brief:{eyebrow:"01 / THE CONTEXT",title:"MAKE THE BRAND FEEL CONNECTED.",body:"MYMO's public service description spans mobile connections and banking access. Aiwa's documented involvement covers brand guidelines and a wider communications mix rather than just a standalone logo."},
  idea:{eyebrow:"02 / THE RESPONSE",title:"ONE IDENTITY. MANY TOUCHPOINTS.",body:"A coherent brand presentation supported by communication planning: identity guidance for consistent use across channels, with digital promotion and physical print working together."},
  deliverables:[
   {name:"Brand guidelines",description:"Aiwa's published branding portfolio documents comprehensive identity guidelines for MYMO."},
   {name:"Digital marketing",description:"Aiwa's case-study portfolio lists digital promotion and online-presence work for MYMO Express."},
   {name:"Advertising management",description:"The published project scope includes advertising campaign management."},
   {name:"Signage and print",description:"The documented relationship also includes on-demand signage and print services."},
  ],
  closing:{headline:"CONSISTENCY IS THE CONNECTION.",body:"The documented work spans multiple communications channels. What ties them together is the need for a recognizable, reliable identity wherever MYMO appears."},
  sources:[{label:"Brand guidelines",href:"https://aiwamediagroup.com/branding/"},{label:"MYMO case study",href:"https://aiwamediagroup.com/case-study/"}],
 },
 "casabella-oman":{
  slug:"casabella-oman",confidence:"documented",
  hero:{overline:"A BRAND FOR THE EVERYDAY",line1:"RETAIL,",line2:"REIMAGINED.",descriptor:"BRAND / RETAIL / OMAN"},
  visual:{theme:"form",motif:"02 — RETAIL",panelTitle:"FORM MEETS FUNCTION",caption:"Original sculptural editorial illustration; not an approved photograph of Casabella's delivered brand materials."},
  context:"Casabella is presented in Aiwa's portfolio as a wholesale and retail business with an international product mix. Aiwa's branding work focused on giving that business a cohesive identity.",
  brief:{eyebrow:"01 / THE CONTEXT",title:"A RECOGNIZABLE RETAIL WORLD.",body:"A wide-ranging retail business needs its visual presence to feel connected across the touchpoints where customers encounter it. Aiwa documents an identity-focused scope for Casabella."},
  idea:{eyebrow:"02 / THE RESPONSE",title:"MAKE EVERY DETAIL BELONG.",body:"Aiwa's published scope includes logo design, brand identity development, thematic design and business cards, bringing related brand materials under a common visual language."},
  deliverables:[
   {name:"Logo design",description:"The Aiwa branding portfolio explicitly lists logo design within Casabella's scope."},
   {name:"Brand identity",description:"Identity development supports a consistent look and presentation across the business."},
   {name:"Theme design",description:"Aiwa's published account includes a coordinated visual theme."},
   {name:"Business cards",description:"Professional printed identity applications are part of the documented deliverables."},
  ],
  closing:{headline:"RETAIL IS A BRAND EXPERIENCE.",body:"The documented value of the work lies in making each public-facing element feel connected to the same business."},
  sources:[{label:"Casabella branding work",href:"https://aiwamediagroup.com/branding/"},{label:"Published case-study index",href:"https://aiwamediagroup.com/case-study/"}],
 },
 "best-genetco":{
  slug:"best-genetco",confidence:"limited",
  hero:{overline:"EVERYDAY TECHNOLOGY",line1:"LIFE AT",line2:"ITS BEST.",descriptor:"HOME APPLIANCES / FEATURED CLIENT"},
  visual:{theme:"product",motif:"03 — HOME",panelTitle:"BUILT FOR THE EVERYDAY",caption:"Original home-appliance-inspired editorial artwork; not proof of a specific BEST campaign or delivered asset."},
  context:"BEST by Genetco is identified in Aiwa's public portfolio as a home-appliance brand, with products including air conditioners, refrigerators and freezers.",
  brief:{eyebrow:"01 / THE PUBLIC RECORD",title:"A FAMILIAR BRAND CATEGORY.",body:"Aiwa features BEST by Genetco in its public showcase. The currently available source identifies the brand and its category, but does not reliably provide a project-specific creative brief."},
  idea:{eyebrow:"02 / WHAT IS CONFIRMED",title:"A CLIENT FEATURE, NOT A CLAIMED CAMPAIGN.",body:"This editorial presentation introduces the featured brand without reproducing campaign descriptions that the older site appears to have duplicated from another client."},
  deliverables:[
   {name:"Featured brand",description:"Aiwa's public homepage includes BEST by Genetco in its portfolio of showcased clients."},
   {name:"Category context",description:"The brand is publicly described as offering home appliances, including cooling and refrigeration products."},
  ],
  closing:{headline:"MORE DETAIL NEEDS MORE EVIDENCE.",body:"Client-specific deliverables, media and results will be added only when Aiwa's approved records support them. No invented campaign metrics appear here."},
  sources:[{label:"BEST feature on Aiwa homepage",href:"https://aiwamediagroup.com/"}],
 },
 "aqua-petro":{
  slug:"aqua-petro",confidence:"documented",
  hero:{overline:"INDUSTRY MEETS STORY",line1:"SCIENCE",line2:"MADE VISIBLE.",descriptor:"WEBSITE / CONTENT / PRODUCTION"},
  visual:{theme:"laboratory",motif:"04 — INDUSTRY",panelTitle:"A CLOSER LOOK",caption:"Original laboratory-inspired illustration; not a photograph of AquaPetro's facilities, laboratory or delivered work."},
  context:"AquaPetro Chemicals operates in industrial chemicals, water treatment and oil-and-gas specialty products. Aiwa's published case study describes its work to present that technical world online and through visual media.",
  brief:{eyebrow:"01 / THE CONTEXT",title:"A TECHNICAL STORY DESERVES CLARITY.",body:"Aiwa's published brief includes a modern digital presence, accessible technical information, and visual/event coverage capable of communicating specialist laboratory work."},
  idea:{eyebrow:"02 / THE RESPONSE",title:"SHOW THE EXPERTISE BEHIND THE SCIENCE.",body:"Aiwa's described response combined a website, specialist long-form content, photography and a laboratory video, alongside coverage of events connected to the business."},
  deliverables:[
   {name:"Website and design",description:"Aiwa documents work on AquaPetro's bilingual digital presence and industrial visual identity."},
   {name:"Technical content",description:"Search-oriented pages cover industrial water treatment and oil-field specialty chemical topics."},
   {name:"Photography and video",description:"The published case study describes an industrial/laboratory photo shoot and video coverage."},
   {name:"Event coverage",description:"Aiwa also documents press and live media support associated with the laboratory launch."},
  ],
  closing:{headline:"MAKE THE COMPLEX CLEAR.",body:"Website design, technical writing and visual documentation are distinct disciplines. Here they work toward one purpose: making specialist expertise easier to understand."},
  sources:[{label:"Aiwa's AquaPetro case study",href:"https://aiwamediagroup.com/case-study/"},{label:"AquaPetro website",href:"https://aquapetrochemicals.com/"}],
 },
 "razmazaan":{
  slug:"razmazaan",confidence:"documented",
  hero:{overline:"CULTURE ON THE TABLE",line1:"MORE THAN",line2:"A MEAL.",descriptor:"BRAND / FOOD / CULTURE"},
  visual:{theme:"flavour",motif:"05 — CULTURE",panelTitle:"A PLACE TO GATHER",caption:"Original food-and-culture-inspired conceptual art; not an image of an executed RazMazaan identity project."},
  context:"RazMazaan is described in Aiwa's branding portfolio as an Indian restaurant in Muscat. The project focused on giving the restaurant a consistent brand identity.",
  brief:{eyebrow:"01 / THE CONTEXT",title:"LET THE IDENTITY CARRY THE CULTURE.",body:"For a restaurant whose offer is connected to Indian food and culture, Aiwa's documented focus was a visual framework that communicates the brand consistently."},
  idea:{eyebrow:"02 / THE RESPONSE",title:"A LANGUAGE MADE FOR THE TABLE.",body:"The published branding work covers guidelines, logo refinement, a coordinated palette and typography so that individual brand elements reinforce the same story."},
  deliverables:[
   {name:"Brand guidelines",description:"The Aiwa branding portfolio explicitly documents identity guidelines for RazMazaan."},
   {name:"Logo refinement",description:"Refinement of the existing logo is included in the described work."},
   {name:"Color system",description:"The team established coordinated visual colors for brand consistency."},
   {name:"Typography",description:"Typographic direction is one of the listed brand-system elements."},
  ],
  closing:{headline:"A SENSE OF PLACE IN EVERY DETAIL.",body:"Brand guidelines help visual touchpoints feel like parts of the same story, from the identity itself to its wider applications."},
  sources:[{label:"RazMazaan branding work",href:"https://aiwamediagroup.com/branding/"}],
 },
 "vitamin-phones":{
  slug:"vitamin-phones",confidence:"documented",
  hero:{overline:"COMMERCE, CONNECTED",line1:"SELL SMART.",line2:"MOVE FAST.",descriptor:"SOFTWARE / POS / DIGITAL COMMERCE"},
  visual:{theme:"system",motif:"06 — COMMERCE",panelTitle:"ONE CONNECTED OPERATION",caption:"Original device-inspired editorial illustration; not a screenshot of Vitamin Phones' live production POS system."},
  context:"Vitamin Phones is described by Aiwa as a phone and accessories retailer in Sohar, with both physical sales and an online commerce operation. Aiwa's published case study describes a connected point-of-sale and inventory system.",
  brief:{eyebrow:"01 / THE CONTEXT",title:"ONE SHOP. MANY MOVING PARTS.",body:"The published project scope centers on coordinating checkout, products and stock rather than treating the physical store and online selling as separate systems."},
  idea:{eyebrow:"02 / THE RESPONSE",title:"A SINGLE VIEW OF COMMERCE.",body:"Aiwa's case study outlines a combined register, commerce and stock workflow, including barcode-based checkout, role-based access and offline continuity."},
  deliverables:[
   {name:"Point of sale",description:"A responsive counter register with product lookup and barcode entry is described in Aiwa's published scope."},
   {name:"Inventory workflows",description:"The source describes stock synchronization between sales channels and low-stock alerts."},
   {name:"Register permissions",description:"Role-based staff login and multiple checkout stations appear in the published implementation list."},
   {name:"Receipts and continuity",description:"The documented system includes printed/electronic receipts and offline fallback."},
  ],
  closing:{headline:"GOOD SYSTEMS GET OUT OF THE WAY.",body:"When checkout, inventory and staff workflows speak the same language, routine operations become easier to manage. This describes the published implementation scope, not independently audited performance results."},
  sources:[{label:"Aiwa's Vitamin Phones case study",href:"https://aiwamediagroup.com/case-study/"}],
 },
} as const satisfies Record<WorkSlug,EditorialStory>;

export function getEditorialStory(slug:string):EditorialStory|undefined{
 return caseStudies[slug as WorkSlug];
}

export const editorialStories:ReadonlyArray<EditorialStory>=workProjects.map(project=>caseStudies[project.slug]);
