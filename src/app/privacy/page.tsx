import Link from "next/link";
import type { Metadata } from "next";
import "../legal.css";

export const metadata: Metadata = {
  title: "Website Privacy Notes | Aiwa Media Group",
  description: "Aiwa Media Group's current website-specific privacy and external service notes.",
};

export default function PrivacyNotes() {
  return (
    <main className="aiwa-legal">
      <nav className="aiwa-legal__nav">
        <Link href="/" className="aiwa-legal__brand">AIWA</Link>
        <Link href="/#site-footer">BACK TO THE SITE</Link>
      </nav>
      <article className="aiwa-legal__main">
        <span className="aiwa-legal__date">WEBSITE INFORMATION / 21 NOV 2026</span>
        <h1>PRIVACY NOTES.</h1>
        <p>These notes describe the current Aiwa V3 presentation website.
          They are not a replacement for the privacy terms of other websites
          that you choose to visit.</p>
        <h2>THE WEBSITE ITSELF</h2>
        <p>This statically hosted portfolio has no built-in user accounts,
          checkout or contact form. To send a project enquiry, the site links to
          Aiwa&apos;s separate, existing contact website.</p>
        <h2>THEME PREFERENCE</h2>
        <p>The light/dark theme control may save your preferred appearance in
          your browser&apos;s local storage so it can be restored when you return.</p>
        <h2>THIRD-PARTY CONTENT AND CONNECTIONS</h2>
        <p>The full-film player loads a YouTube embed only when you choose to
          open it. External links, including Aiwa&apos;s existing website and
          social networks, may process data under their own notices.
          Cloudflare delivers this static site and may handle connection and
          security information as part of normal service delivery.</p>
        <h2>QUESTIONS OR REQUESTS</h2>
        <p>For privacy enquiries, contact Aiwa via its
          {" "}<a href="https://aiwamediagroup.com/contact-us/">official contact page</a>
          {" "}or telephone <a href="tel:+96896138461">+968 9613 8461</a>.
          Site handling and company-wide practices may differ, so confirm
          applicable terms with Aiwa directly.</p>
      </article>
    </main>
  );
}
