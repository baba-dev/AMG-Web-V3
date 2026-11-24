import type { Metadata } from "next";
import { AiwaInnerHeader } from "@/components/aiwa-inner-header";
import { ClientHero } from "@/components/client-directory/client-hero";
import { ClientIndex } from "@/components/client-directory/client-index";
import { ClientConnections, ClientOutro } from "@/components/client-directory/client-connections";
import "@/components/aiwa-polish.css";
import "./client-directory.css";

export const metadata: Metadata = {
  title: "Good Company — Client Directory | Aiwa Media Group",
  description: "Explore the Aiwa Media Group client archive and selected published work, across industries and disciplines.",
  alternates: { canonical: "/work/clients/" },
  openGraph: { title: "Good Company — The Aiwa Client Archive", description: "Different ambitions. Different industries. One shared appetite for doing things differently.", type: "website" },
};

export default function ClientDirectoryPage(){
  return <div className="aiwa-site cd-page"><AiwaInnerHeader/><main id="main-content"><ClientHero/><ClientIndex/><ClientConnections/><ClientOutro/></main></div>;
}
