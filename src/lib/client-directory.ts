import { workProjects } from "@/lib/work/projects";

export type Client = Readonly<{
  id: string;
  name: string;
  industry?: string;
  project?: string;
  publicationStatus: "approved-for-directory" | "pending-identity";
}>;

// User-supplied legacy client artwork; inclusion is not a claim of an active engagement.
// Two logo identities need confirmation before being displayed. Only the existing
// source-backed work registry supplies public project descriptions.
export const clientRegistry: readonly Client[] = [
  {
    "id": "aquapetro-chemicals",
    "name": "AquaPetro Chemicals",
    "industry": "Industrial",
    "project": "aqua-petro",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "bababuilds",
    "name": "BabaBuilds.com",
    "industry": "Technology",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "best-appliances",
    "name": "Best Appliances",
    "industry": "Retail",
    "project": "best-genetco",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "caesars-confectionery",
    "name": "Caesars Confectionery",
    "industry": "Food & beverage",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "coy",
    "name": "COY",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "dk-furnishing",
    "name": "DK Furnishing",
    "industry": "Retail",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "ezvesto",
    "name": "EzVesto",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "falcon-services-logistics",
    "name": "Falcon Services & Logistics",
    "industry": "Industrial",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "flydestini",
    "name": "FlyDestini",
    "industry": "Travel",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "fundoo-toys",
    "name": "Fundoo Toys",
    "industry": "Retail",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "genetco",
    "name": "Genetco",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "global-wealth-investments",
    "name": "Global Wealth Investments",
    "industry": "Finance",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "grace-global-engineering",
    "name": "Grace Global Engineering",
    "industry": "Industrial",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "gulfpac",
    "name": "Gulfpac",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "health-zone-padel",
    "name": "Health Zone Padel",
    "industry": "Sport & lifestyle",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "la-bella-house",
    "name": "La Bella House",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "najibebay",
    "name": "Najibebay",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "namaste-marhaba",
    "name": "Namaste Marhaba",
    "industry": "Food & beverage",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "oman-reps",
    "name": "Oman REPS",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "ooh-lala",
    "name": "Ooh LaLa",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "razmazaan",
    "name": "RazmAzaan",
    "industry": "Food & beverage",
    "project": "razmazaan",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "rcs-oman",
    "name": "RCS Oman / Renaissance",
    "publicationStatus": "pending-identity"
  },
  {
    "id": "sohar-ods",
    "name": "Sohar ODS",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "spine-line",
    "name": "Spine Line",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "strategic-catering",
    "name": "Strategic Catering",
    "industry": "Food & beverage",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "the-gulf-post",
    "name": "The Gulf Post",
    "industry": "Media",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "tribeom",
    "name": "TribeOM",
    "publicationStatus": "approved-for-directory"
  },
  {
    "id": "vitamin-phones",
    "name": "Vitamin Phones",
    "industry": "Retail",
    "project": "vitamin-phones",
    "publicationStatus": "pending-identity"
  },
  {
    "id": "xspiceo",
    "name": "Xspiceo",
    "publicationStatus": "approved-for-directory"
  }
];

export const clients = clientRegistry.filter(c => c.publicationStatus === "approved-for-directory");
export const industries = Array.from(new Set(clients.flatMap(c => c.industry ? [c.industry] : []))).sort();
export const clientLogo = (client: Client, size: 300 | 600) => "/media/client-logos/web/" + size + "/" + client.id + ".webp";
export const clientProject = (client: Client) => workProjects.find(p => p.slug === client.project);
export const clientNumber = (client: Client) => String(clients.findIndex(c => c.id === client.id) + 1).padStart(2, "0");
