"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, MoveDownRight } from "lucide-react";
import "./aiwa-contact.css";

const CONTACT_URL = "https://aiwamediagroup.com/contact-us/";

export function AiwaContact() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const echoRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  // Refs for the scroll choreography are installed in the next commit.
  void useEffect;
  void sectionRef;
  void stageRef;
  void sceneRef;
  void headingRef;
  void echoRef;
  void eyebrowRef;
  void descriptionRef;
  void ctaRef;

  return (
    <section ref={sectionRef} className="aiwa-contact" id="contact" aria-labelledby="aiwa-contact-title">
      <div ref={stageRef} className="aiwa-contact__stage">
        <div ref={sceneRef} className="aiwa-contact__scene">
          <div ref={eyebrowRef} className="aiwa-contact__topline">
            <span className="aiwa-contact__eyebrow">
              <span className="aiwa-contact__dot" aria-hidden="true" />
              GET IN TOUCH
            </span>
            <span className="aiwa-contact__index">06 / AIWA MEDIA GROUP</span>
          </div>

          <div className="aiwa-contact__main">
            <div className="aiwa-contact__lockup">
              <div ref={echoRef} className="aiwa-contact__echo" aria-hidden="true">
                <span>LET&apos;S MAKE</span>
                <span>SOME NOISE.</span>
              </div>
              <h2 ref={headingRef} className="aiwa-contact__headline" id="aiwa-contact-title">
                <span className="aiwa-contact__line"><span>LET&apos;S MAKE</span></span>
                <span className="aiwa-contact__line"><span><em>SOME NOISE.</em></span></span>
              </h2>
            </div>
            <div className="aiwa-contact__message">
              <p ref={descriptionRef}>
                Great ideas deserve attention. Let&apos;s make something impossible to ignore.
              </p>
              <a ref={ctaRef} className="aiwa-contact__action"
                href={CONTACT_URL} aria-label="Start a project with Aiwa Media Group">
                <span>START A PROJECT</span>
                <span className="aiwa-contact__action-arrow" aria-hidden="true">
                  <ArrowUpRight size={25} strokeWidth={1.75} />
                </span>
              </a>
            </div>
          </div>

          <div className="aiwa-contact__baseline" aria-hidden="true">
            <span>CREATIVE THAT MOVES / MUSCAT, OMAN</span>
            <MoveDownRight size={22} strokeWidth={1.4}/>
            <span>06 — 07</span>
          </div>
        </div>
      </div>
    </section>
  );
}
