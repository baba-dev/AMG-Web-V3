import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { AiwaInnerHeader } from "@/components/aiwa-inner-header";
import { ContactEnquiries } from "@/components/contact-enquiries";
import { ContactHeroV2 } from "@/components/contact/contact-hero-v2";
import { ContactMotion } from "@/components/contact-motion";
import "@/components/aiwa-polish.css";
import "./contact-page.css";

export const metadata: Metadata = {
  title: "Contact Aiwa | Let's Make Some Noise | Aiwa Media Group",
  description: "Start a project, collaborate or visit Aiwa Media Group in Muscat, Oman. Reach our team for creative, digital, production and technology enquiries.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Say Hello — Aiwa Media Group",
    description: "Something to say? We'd love to hear it. Start a conversation with Aiwa Media Group in Muscat, Oman.",
    type: "website",
  },
};

export default function AiwaContactPage() {
  return (
    <div className="aiwa-site contact-page" data-contact-page>
      <AiwaInnerHeader />
      <ContactMotion />
      <main id="main-content">
        <ContactHeroV2 />

        <section className="contact-intro contact-pad" id="enquiries" data-contact-reveal aria-labelledby="contact-intro-title">
          <div className="contact-intro__top"><span>01 / START HERE</span><span>GOOD CONVERSATIONS LEAD TO GREAT THINGS</span></div>
          <div className="contact-intro__grid">
            <h2 id="contact-intro-title">GOT AN<br /><em>IDEA?</em></h2>
            <div className="contact-intro__aside">
              <p>A new brand. A brave campaign. Something ambitious in digital, production or technology. Whatever it is, we&apos;d love to hear about it.</p>
              <a href="mailto:info@aiwamediagroup.com?subject=New%20project%20enquiry%20for%20Aiwa"
                className="contact-intro__primary">LET&apos;S TALK <ArrowUpRight size={27} strokeWidth={1.5} aria-hidden="true" /></a>
            </div>
          </div>
          <ContactEnquiries />
        </section>

        <section className="contact-office contact-pad" id="contact-office" data-contact-reveal aria-labelledby="contact-office-title">
          <div className="contact-office__eyebrows">
            <span>02 / FIND US</span><span>ONE OFFICE / MUSCAT, OMAN</span>
          </div>
          <h2 id="contact-office-title">OUR <em>HOME.</em></h2>
          <div className="contact-office__layout">
            <div className="contact-office__image">
              <Image src="/media/finale/muscat-editorial.svg"
                alt="Original editorial illustration inspired by Muscat's waterfront and surrounding mountains"
                width={1600} height={950} unoptimized loading="lazy"/>
              <span>AIWA / MUSCAT</span>
              <span>ORIGINAL EDITORIAL ART</span>
            </div>
            <div className="contact-office__details">
              <span className="contact-office__count">01 / 01 — OUR OFFICE</span>
              <h3>MUSCAT<span>.</span></h3>
              <p>Where our ideas begin. Reach out, come say hello, or find us in the heart of Oman.</p>
              <div className="contact-office__address">
                <span>FIND US AT</span>
                <address>HGRW+VMV, 3711 Way<br />Muscat, Sultanate of Oman</address>
              </div>
              <div className="contact-office__links">
                <a href="tel:+96896138461">+968 9613 8461 <ArrowUpRight size={20} aria-hidden="true" /></a>
                <a href="mailto:info@aiwamediagroup.com">INFO@AIWAMEDIAGROUP.COM <ArrowUpRight size={20} aria-hidden="true" /></a>
                <a href="https://www.google.com/maps/search/?api=1&query=HGRW%2BVMV%203711%20Way%20Muscat%20Oman"
                  target="_blank" rel="noopener noreferrer">GET DIRECTIONS <ArrowUpRight size={20} aria-hidden="true" /></a>
              </div>
            </div>
          </div>
          <div className="contact-office__bottom">
            <span>THE WORLD OF AIWA / MUSCAT</span>
            <Link href="/work">EXPLORE OUR WORK <ArrowRight size={21} aria-hidden="true" /></Link>
          </div>
        </section>

        <section className="contact-outro contact-pad" data-contact-reveal aria-labelledby="contact-outro-title">
          <span>STILL HERE? WE LIKE YOUR ENERGY.</span>
          <h2 id="contact-outro-title">MAKE<br /><em>IT HAPPEN.</em></h2>
          <a href="mailto:info@aiwamediagroup.com?subject=Hello%20Aiwa">
            SAY HELLO <ArrowUpRight size={30} aria-hidden="true" />
          </a>
        </section>
      </main>
    </div>
  );
}
