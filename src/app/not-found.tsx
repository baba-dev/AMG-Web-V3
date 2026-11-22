import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AiwaInnerHeader } from "@/components/aiwa-inner-header";
import "@/components/aiwa-polish.css";
import "./legal.css";

export default function NotFound() {
  return (
    <div className="aiwa-site aiwa-legal-page aiwa-not-found-page">
      <AiwaInnerHeader />
      <main className="aiwa-not-found" id="main-content">
        <span>404 / WRONG TURN</span>
        <p aria-hidden="true">404</p>
        <h1>THE IDEA MOVED.</h1>
        <div>
          <p>This page is no longer here, but the good work still is.</p>
          <Link href="/">RETURN HOME <ArrowUpRight size={22} aria-hidden="true" /></Link>
        </div>
      </main>
    </div>
  );
}
