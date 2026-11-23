"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight, X, Crown, CalendarRange, ServerCog, Handshake, Palette,
  type LucideIcon,
} from "lucide-react";
import { teamFilters, teamPeople, type TeamFilter, type TeamPerson, type TeamIcon } from "@/lib/team-data";

const roleIcons: Record<TeamIcon, LucideIcon> = {
  founder: Crown,
  operations: CalendarRange,
  engineering: ServerCog,
  sales: Handshake,
  design: Palette,
};

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export function AiwaTeamDirectory() {
  const [filter, setFilter] = useState<TeamFilter>("all");
  const [selected, setSelected] = useState<TeamPerson | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const people = filter === "all" ? teamPeople : teamPeople.filter((person) => person.department === filter);
  const SelectedIcon = selected ? roleIcons[selected.icon] : null;

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
        <div><span className="team-micro">03 / OUR PEOPLE / AIWA MEDIA GROUP</span>
          <h2 id="team-people-title">THE PEOPLE<br /><em>BEHIND IT.</em></h2></div>
        <div className="team-people__heading-note">
          <p>Meet the people helping shape Aiwa&apos;s work across leadership, operations, engineering, sales and creative design.</p>
          <p className="team-people__icon-note">Each role has its own graphic emblem. No team portraits or artificial likenesses are used.</p>
        </div>
      </header>
      <div className="team-people__controls">
        <div className="team-people__filters" role="group" aria-label="Filter team members by department">
          {teamFilters.map((option) => (
            <button type="button" key={option.id}
              className={"team-people__filter" + (filter === option.id ? " is-active" : "")}
              aria-pressed={filter === option.id} onClick={() => setFilter(option.id)}>
              {option.label}
            </button>
          ))}
        </div>
        <span className="team-micro" aria-live="polite" aria-atomic="true">
          {String(people.length).padStart(2, "0")} TEAM {people.length === 1 ? "MEMBER" : "MEMBERS"}
        </span>
      </div>
      <div className="team-people__grid">
        {people.map((person, index) => {
          const RoleIcon = roleIcons[person.icon];
          return (
            <button type="button" className="team-person" key={person.id}
              aria-label={"Read profile of " + person.name}
              data-team-profile-icon={person.icon}
              onClick={(event) => openProfile(person, event.currentTarget)}>
              <span className={"team-person__visual team-person__visual--" + (index % 4)}>
                <span className="team-person__monogram" aria-hidden="true">{initials(person.name)}</span>
                <span className="team-person__icon" aria-hidden="true">
                  <RoleIcon strokeWidth={1.4} />
                </span>
                <span className="team-person__role-tag">{person.department.toUpperCase()} / AIWA</span>
                <span className="team-person__view"><ArrowUpRight size={24} aria-hidden="true" /></span>
              </span>
              <span className="team-person__copy">
                <span className="team-person__number">{String(index + 1).padStart(2, "0")} / {String(people.length).padStart(2, "0")}</span>
                <strong>{person.name}</strong>
                <span className="team-person__role">{person.role}</span>
              </span>
            </button>
          );
        })}
      </div>
      <dialog className="team-profile" ref={dialogRef}
        aria-label={selected ? "Team profile: " + selected.name : "Team profile"}
        onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}
        onClose={() => { setSelected(null); openerRef.current?.focus(); }}>
        {selected && (
          <div className="team-profile__content">
            <button type="button" className="team-profile__close" aria-label="Close profile"
              onClick={() => dialogRef.current?.close()}><X aria-hidden="true" size={24} /></button>
            <span className="team-micro">AIWA / TEAM PROFILE</span>
            <div className="team-profile__symbol" aria-hidden="true">
              <span className="team-profile__initials">{initials(selected.name)}</span>
              {SelectedIcon && <SelectedIcon size={86} strokeWidth={1.2} />}
            </div>
            <p className="team-profile__label">{selected.department.toUpperCase()} / AIWA MEDIA GROUP</p>
            <h3>{selected.name}</h3>
            <p className="team-profile__role">{selected.role}</p>
            <p className="team-profile__bio">{selected.introduction}</p>
          </div>
        )}
      </dialog>
    </section>
  );
}
