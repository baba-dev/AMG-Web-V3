"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import { teamFilters, teamPeople, type TeamFilter, type TeamPerson } from "@/lib/team-data";

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export function AiwaTeamDirectory() {
  const [filter, setFilter] = useState<TeamFilter>("all");
  const [selected, setSelected] = useState<TeamPerson | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const people = filter === "all" ? teamPeople : teamPeople.filter((person) => person.department === filter);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (selected && dialog && !dialog.open) dialog.showModal();
  }, [selected]);

  const openProfile = (person: TeamPerson, trigger: HTMLButtonElement) => {
    openerRef.current = trigger;
    setSelected(person);
  };

  return (
    <section className="team-people team-pad" id="people" aria-labelledby="team-people-title">
      <header className="team-section-heading">
        <div><span className="team-micro">03 / OUR PEOPLE / PUBLISHED ARCHIVE</span>
          <h2 id="team-people-title">THE PEOPLE<br /><em>BEHIND IT.</em></h2></div>
        <div className="team-people__heading-note">
          <p>Real names and expertise from Aiwa&apos;s original team directory. Different talents. One connected creative group.</p>
          <p className="team-people__archive-note">These profiles are historical records from our previous site. Current appointments and portraits are being verified.</p>
        </div>
      </header>
      <div className="team-people__controls">
        <div className="team-people__filters" role="group" aria-label="Filter archived profiles by department">
          {teamFilters.map((option) => (
            <button type="button" key={option.id}
              className={"team-people__filter" + (filter === option.id ? " is-active" : "")}
              aria-pressed={filter === option.id} onClick={() => setFilter(option.id)}>
              {option.label}
            </button>
          ))}
        </div>
        <span className="team-micro" aria-live="polite" aria-atomic="true">
          {String(people.length).padStart(2, "0")} ARCHIVE {people.length === 1 ? "PROFILE" : "PROFILES"}
        </span>
      </div>
      <div className="team-people__grid">
        {people.map((person, index) => (
          <button type="button" className="team-person" key={person.id}
            aria-label={"Read archived profile of " + person.name}
            onClick={(event) => openProfile(person, event.currentTarget)}>
            <span className={"team-person__visual team-person__visual--" + (index % 4)}>
              {person.portrait ? (
                <Image src={person.portrait} alt={"Portrait of " + person.name} fill
                  sizes="(max-width:640px) 90vw, (max-width:1000px) 44vw, 24vw" />
              ) : (
                <span className="team-person__monogram" aria-hidden="true">{initials(person.name)}</span>
              )}
              <span className="team-person__archive-tag">ARCHIVE / NO VERIFIED PORTRAIT</span>
              <span className="team-person__view"><ArrowUpRight size={24} aria-hidden="true" /></span>
            </span>
            <span className="team-person__copy">
              <span className="team-person__number">{String(index + 1).padStart(2, "0")} / {String(people.length).padStart(2, "0")}</span>
              <strong>{person.name}</strong>
              <span className="team-person__role">{person.role}</span>
            </span>
          </button>
        ))}
      </div>
      <dialog className="team-profile" ref={dialogRef}
        aria-label={selected ? "Archived profile: " + selected.name : "Archived team profile"}
        onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}
        onClose={() => { setSelected(null); openerRef.current?.focus(); }}>
        {selected && (
          <div className="team-profile__content">
            <button type="button" className="team-profile__close" aria-label="Close profile"
              onClick={() => dialogRef.current?.close()}><X aria-hidden="true" size={24} /></button>
            <span className="team-micro">AIWA / ARCHIVE PROFILE</span>
            <div className="team-profile__monogram" aria-hidden="true">{initials(selected.name)}</div>
            <p className="team-profile__label">{selected.department.toUpperCase()} / AS PUBLISHED</p>
            <h3>{selected.name}</h3>
            <p className="team-profile__role">{selected.role}</p>
            <p className="team-profile__bio">{selected.introduction}</p>
            <p className="team-profile__disclaimer">A profile preserved from the original Aiwa website; current role and membership have not been independently verified.</p>
            <a href={selected.source} target="_blank" rel="noopener noreferrer">
              ORIGINAL PROFILE SOURCE <ArrowUpRight aria-hidden="true" size={18} />
            </a>
          </div>
        )}
      </dialog>
    </section>
  );
}
