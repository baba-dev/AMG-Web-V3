"use client";

import { useState, type KeyboardEvent } from "react";
import { ArrowUpRight } from "lucide-react";

const enquiries = [
  {
    id: "project",
    label: "NEW BUSINESS",
    number: "01",
    kicker: "A PROJECT IN MIND?",
    heading: "LET'S BUILD SOMETHING.",
    description: "Tell us what you're planning. We'll connect you with the right people in the team.",
    action: "START A PROJECT",
    href: "mailto:info@aiwamediagroup.com?subject=New%20project%20enquiry%20for%20Aiwa",
  },
  {
    id: "collaboration",
    label: "COLLABORATIONS",
    number: "02",
    kicker: "BETTER TOGETHER.",
    heading: "MAKE ROOM FOR IDEAS.",
    description: "Creators, studios and fellow agencies: we'd like to hear what you have in mind.",
    action: "GET IN TOUCH",
    href: "mailto:info@aiwamediagroup.com?subject=Creative%20collaboration%20with%20Aiwa",
  },
  {
    id: "careers",
    label: "CAREERS",
    number: "03",
    kicker: "WANT TO JOIN THE NOISE?",
    heading: "FIND YOUR PEOPLE.",
    description: "The best things happen when curious people work together. Discover opportunities with Aiwa.",
    action: "SEE CAREERS",
    href: "https://aiwamediagroup.com/career/",
  },
  {
    id: "general",
    label: "EVERYTHING ELSE",
    number: "04",
    kicker: "SOMETHING ELSE TO SAY?",
    heading: "WE'RE ALL EARS.",
    description: "Questions, ideas or just a hello. Here's how to reach our Muscat team.",
    action: "EMAIL AIWA",
    href: "mailto:info@aiwamediagroup.com?subject=Hello%20Aiwa",
  },
] as const;

export function ContactEnquiries() {
  const [selected, setSelected] = useState(0);
  const current = enquiries[selected];
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0
      : event.key === "End" ? enquiries.length - 1
      : (selected + (event.key === "ArrowRight" ? 1 : -1) + enquiries.length) % enquiries.length;
    setSelected(next);
    const tabs = event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs[next]?.focus();
  };
  return (
    <div className="contact-enquiries" data-contact-enquiries data-contact-reveal>
      <div className="contact-enquiries__tabs" role="tablist"
        aria-label="Choose a type of enquiry" onKeyDown={onKeyDown}>
        {enquiries.map((item, index) => (
          <button type="button" role="tab" key={item.id}
            id={"contact-tab-" + item.id} aria-controls="contact-enquiry-panel"
            aria-selected={selected === index} tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)} data-enquiry-tab={item.id}>
            <span>{item.number}</span><strong>{item.label}</strong>
            <span className="contact-enquiries__tab-dot" aria-hidden="true" />
          </button>
        ))}
      </div>
      <div className="contact-enquiries__panel" role="tabpanel" id="contact-enquiry-panel"
        aria-labelledby={"contact-tab-" + current.id} tabIndex={0}
        key={current.id} data-active-enquiry={current.id}>
        <span className="contact-enquiries__kicker">{current.kicker}</span>
        <h3>{current.heading}</h3>
        <p>{current.description}</p>
        <a href={current.href} target={current.id === "careers" ? "_blank" : undefined}
          rel={current.id === "careers" ? "noopener noreferrer" : undefined}>
          {current.action} <ArrowUpRight size={22} strokeWidth={1.6} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
