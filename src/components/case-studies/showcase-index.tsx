"use client";
import { useEffect, useState } from "react";
import { ArrowDownRight } from "lucide-react";
import { showcaseChapters } from "@/lib/work/case-study-showcase";
export function ShowcaseIndex() {
  const [active, setActive] = useState<string>(showcaseChapters[0].slug);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const target = window.innerHeight * .45;
      let current = showcaseChapters[0].slug;
      for (const chapter of showcaseChapters) {
        if ((document.getElementById(chapter.slug)?.getBoundingClientRect().top ?? Infinity) <= target) current = chapter.slug;
      }
      setActive(current);
    };
    const onScroll = () => {cancelAnimationFrame(raf);raf = requestAnimationFrame(update);};
    update();window.addEventListener("scroll", onScroll, {passive:true});window.addEventListener("resize", onScroll);
    return () => {cancelAnimationFrame(raf);window.removeEventListener("scroll",onScroll);window.removeEventListener("resize",onScroll);};
  }, []);
  return <nav className="cs-index cs-gutter" aria-label="Case study chapters">
    {showcaseChapters.map((chapter,i) => <a key={chapter.slug} href={"#"+chapter.slug} aria-current={active===chapter.slug?"location":undefined} className={"cs-index-link cs-index-"+chapter.slug}>
      <span className="cs-label">0{i+1}</span><span>{chapter.shortName}</span><ArrowDownRight size={16} aria-hidden="true"/>
    </a>)}
  </nav>;
}
