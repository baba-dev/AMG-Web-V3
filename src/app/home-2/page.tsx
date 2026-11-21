import type { Metadata } from "next";
import { AiwaHome2 } from "@/components/aiwa-home-2";

export const metadata: Metadata = {
  title: "Muscat Futurecraft | Aiwa Media Group",
  description:
    "A Muscat-rooted creative direction for Aiwa Media Group, built to move culture.",
  alternates: { canonical: "/home-2" },
};

export default function Home2Page() {
  return <AiwaHome2 />;
}
