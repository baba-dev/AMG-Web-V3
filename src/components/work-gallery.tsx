"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, LayoutGrid, List } from "lucide-react";
import { workProjects } from "@/lib/work/projects";
import {
  directoryCategory,
  workVisuals,
  directoryCategories,
  isDirectoryCategory,
  type DirectoryCategory,
} from "@/lib/work/directory";
import "./work-gallery.css";

type WorkView = "grid" | "list";
const viewPreferenceKey = "aiwa-work-view";

function readViewPreference(): WorkView {
  const urlView = new URL(window.location.href).searchParams.get("view");
  if (urlView === "list" || urlView === "grid") return urlView;
  try {
    return window.localStorage.getItem(viewPreferenceKey) === "list" ? "list" : "grid";
  } catch {
    return "grid";
  }
}

export function WorkGallery() {
  const [category, setCategory] = useState<DirectoryCategory>("all");
  const [view, setView] = useState<WorkView>("grid");

  useEffect(() => {
    const restore = () => {
      const requestedCategory = new URL(window.location.href).searchParams.get("category");
      setCategory(isDirectoryCategory(requestedCategory) ? requestedCategory : "all");
      setView(readViewPreference());
    };
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);

  const filtered = category === "all"
    ? workProjects
    : workProjects.filter((project) => directoryCategory(project) === category);

  const updateLocation = (nextCategory: DirectoryCategory, nextView: WorkView) => {
    const url = new URL(window.location.href);
    if (nextCategory === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", nextCategory);
    if (nextView === "grid") url.searchParams.delete("view");
    else url.searchParams.set("view", nextView);
    window.history.pushState(null, "", url.pathname + url.search + url.hash);
  };

  const selectCategory = (next: DirectoryCategory) => {
    if (next === category) return;
    updateLocation(next, view);
    setCategory(next);
  };

  const selectView = (next: WorkView) => {
    if (next === view) return;
    updateLocation(category, next);
    setView(next);
    try { window.localStorage.setItem(viewPreferenceKey, next); } catch { /* optional preference */ }
  };

  useEffect(() => {
    const list = document.querySelector<HTMLElement>(".work-gallery__list");
    if (!list || !("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nodes = Array.from(list.querySelectorAll<HTMLElement>(".work-gallery__item"));
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) (entry.target as HTMLElement).dataset.entered = "true";
      }
    }, { threshold: 0.06, rootMargin: "0px 0px -3% 0px" });
    nodes.forEach((node) => observer.observe(node));
    list.dataset.enhanced = "true";
    return () => observer.disconnect();
  }, [category, view]);

  return (
    <section className="work-gallery" aria-label="Selected Aiwa projects"
      data-work-gallery data-filter={category} data-view={view}>
      <div className="work-gallery__tools work-page__gutter">
        <span>THE WORK / 001—{String(workProjects.length).padStart(3, "0")}</span>
        <span>AN EDITORIAL SELECTION FROM MUSCAT</span>
      </div>

      <div className="work-gallery__filterbar work-page__gutter">
        <div className="work-gallery__filters" role="group" aria-label="Filter projects by discipline">
          {directoryCategories.map((option) => {
            const count = option.id === "all"
              ? workProjects.length
              : workProjects.filter((project) => directoryCategory(project) === option.id).length;
            return (
              <button key={option.id} type="button" onClick={() => selectCategory(option.id)}
                aria-pressed={category === option.id} className={category === option.id ? "is-active" : ""}
                data-filter-button={option.id}>
                {option.label} <span>{String(count).padStart(2, "0")}</span>
              </button>
            );
          })}
        </div>
        <div className="work-gallery__view-controls" role="group" aria-label="Project display mode">
          <button type="button" aria-pressed={view === "grid"}
            data-view-button="grid" onClick={() => selectView("grid")}>
            <LayoutGrid size={17} strokeWidth={1.9} aria-hidden="true" />
            <span>GRID</span>
          </button>
          <button type="button" aria-pressed={view === "list"}
            data-view-button="list" onClick={() => selectView("list")}>
            <List size={19} strokeWidth={1.9} aria-hidden="true" />
            <span>LIST</span>
          </button>
        </div>
      </div>

      <div className="work-gallery__summary work-page__gutter">
        <p aria-live="polite" aria-atomic="true" className="work-gallery__count">
          SHOWING {String(filtered.length).padStart(2, "0")} / {String(workProjects.length).padStart(2, "0")} PROJECTS
        </p>
        <span>{view === "list" ? "A CLOSER LOOK AT EVERY STORY" : "IDEAS MADE VISIBLE"}</span>
      </div>

      <ol className="work-gallery__list work-page__gutter" id="work-projects">
        {filtered.map((project) => {
          const projectNumber = String(workProjects.findIndex((item) => item.slug === project.slug) + 1).padStart(2, "0");
          return (
            <li key={project.slug} className={"work-gallery__item work-gallery__item--" + project.slug}
              data-work-project={project.slug} data-category={directoryCategory(project)}>
              <Link className="work-gallery__link" href={"/work/" + project.slug}
                aria-label={"Explore " + project.client + " project overview"}>
                <span className="work-gallery__number" aria-hidden="true">{projectNumber}</span>
                <div className="work-gallery__art" style={{ backgroundColor: workVisuals[project.slug].accent }}>
                  <Image src={project.artwork} alt={project.alt} width={960} height={740}
                    unoptimized loading="lazy"
                    sizes={view === "list"
                      ? "(max-width: 900px) 110px, 330px"
                      : "(max-width: 767px) 100vw, (max-width: 1100px) 48vw, 90vw"} />
                  <span className="work-gallery__art-index">{projectNumber} / {String(workProjects.length).padStart(2, "0")}</span>
                  <span className="work-gallery__art-open" aria-hidden="true"><ArrowUpRight size={25}/></span>
                  <span className="work-gallery__art-mark" aria-hidden="true">{project.visualLabel}</span>
                </div>
                <div className="work-gallery__caption">
                  <strong className="work-gallery__client">{project.client}</strong>
                  <span className="work-gallery__title">{project.title}</span>
                  <span className="work-gallery__discipline">{project.discipline}</span>
                </div>
                <ArrowUpRight className="work-gallery__row-arrow" size={28} strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="work-gallery__closing work-page__gutter">
        <span>END OF THE EDIT / MORE TO COME</span><span>AIWA / MUSCAT</span>
      </div>
    </section>
  );
}
