import Link from "next/link";
import type { Metadata } from "next";
import "../legal.css";

export const metadata: Metadata = {
  title: "Website Information & Terms | Aiwa Media Group",
  description: "General information about the Aiwa Media Group V3 portfolio site.",
};

export default function SiteTerms() {
  return (
    <main className="aiwa-legal">
      <nav className="aiwa-legal__nav">
        <Link href="/" className="aiwa-legal__brand">AIWA</Link>
        <Link href="/#site-footer">BACK TO THE SITE</Link>
      </nav>
      <article className="aiwa-legal__main">
        <span className="aiwa-legal__date">WEBSITE INFORMATION / 21 NOV 2026</span>
        <h1>SITE TERMS.</h1>
        <p>This website presents Aiwa Media Group, a business of
          Ahmed Al Ajmi Trading, based in Muscat, Oman.</p>
        <h2>EDITORIAL SHOWCASE</h2>
        <p>The portfolio visual compositions are original editorial
          illustrations and are not photographs of client projects, a studio
          or physical office. Project links point to the company&apos;s
          published case studies or service examples.</p>
        <h2>OWNERSHIP AND LINKS</h2>
        <p>Company and client names and marks remain with their respective
          owners. This website links to third-party platforms; those sites
          provide their own content and terms. Contact Aiwa if you find an
          inaccurate description or wish to discuss image rights.</p>
        <h2>PROJECT ENQUIRIES</h2>
        <p>Information on this portfolio is an introduction, not a
          quotation, contract or offer of a specific service.
          For proposals, formal terms or questions, use
          {" "}<a href="https://aiwamediagroup.com/contact-us/">Aiwa&apos;s official contact page</a>.
        </p>
      </article>
    </main>
  );
}
