"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, Play, X } from "lucide-react";
import "./aiwa-film-player.css";

export type FilmOrigin = Readonly<{
  left: number;
  top: number;
  width: number;
  height: number;
}>;

type FilmPlayerProps = {
  open: boolean;
  origin: FilmOrigin | null;
  poster: string;
  youtubeId: string;
  nativeVideo: string | null;
  onRequestClose: () => void;
};

/**
 * A one-panel FLIP transition. The iframe/video is mounted only after the
 * poster has completed its expansion: no iframe layout thrash during the
 * expensive shared-element movement. Closing retraces the source thumbnail.
 */
export function AiwaFilmPlayer({
  open, origin, poster, youtubeId, nativeVideo, onRequestClose,
}: FilmPlayerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openingRef = useRef<Animation | null>(null);
  const generationRef = useRef(0);
  const previousOverflowRef = useRef("");
  const sourceFocusRef = useRef<HTMLElement | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const panel = panelRef.current;
    if (!dialog || !panel) return;
    const generation = ++generationRef.current;
    openingRef.current?.cancel();
    openingRef.current = null;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduce ? 1 : 560;
    const easing = "cubic-bezier(0.16, 1, 0.3, 1)";

    const sourceTransform = () => {
      const to = panel.getBoundingClientRect();
      const from = origin ?? {
        left: window.innerWidth / 2 - 35,
        top: window.innerHeight / 2 - 20,
        width: 70,
        height: 40,
      };
      // Avoid invalid scales when the user opens from a clipped tile.
      const sx = Math.max(.07, Math.min(1, from.width / Math.max(1, to.width)));
      const sy = Math.max(.07, Math.min(1, from.height / Math.max(1, to.height)));
      return "translate3d(" + (from.left - to.left).toFixed(2) +
        "px," + (from.top - to.top).toFixed(2) +
        "px,0) scale(" + sx.toFixed(4) + "," + sy.toFixed(4) + ")";
    };

    if (open) {
      sourceFocusRef.current = document.activeElement as HTMLElement | null;
      previousOverflowRef.current = document.body.style.overflow;
      setPlayerReady(false);
      setLoaded(false);

      if (!dialog.open) dialog.showModal();
      dialog.dataset.phase = "opening";
      document.body.style.overflow = "hidden";
      const fromTransform = sourceTransform();
      const animation = panel.animate([
        { transform: fromTransform, opacity: .82, borderRadius: "2px" },
        { transform: "translate3d(0,0,0) scale(1)", opacity: 1, borderRadius: "0px" },
      ], { duration, easing, fill: "both" });
      openingRef.current = animation;
      void animation.finished.then(() => {
        if (generationRef.current !== generation || !dialog.open) return;
        // The poster remains until player content actually loads.
        setPlayerReady(true);
        dialog.dataset.phase = "open";
        closeRef.current?.focus({ preventScroll: true });
      }).catch(() => {});
    } else if (dialog.open) {
      setPlayerReady(false);
      setLoaded(false);
      dialog.dataset.phase = "closing";
      const toTransform = sourceTransform();
      const animation = panel.animate([
        { transform: "translate3d(0,0,0) scale(1)", opacity: 1 },
        { transform: toTransform, opacity: .78 },
      ], {
        duration: reduce ? 1 : 430,
        easing,
        fill: "both",
      });
      openingRef.current = animation;
      void animation.finished.then(() => {
        if (generationRef.current !== generation) return;
        dialog.close();
        panel.getAnimations().forEach(item => item.cancel());
        document.body.style.overflow = previousOverflowRef.current;
        dialog.dataset.phase = "closed";
        sourceFocusRef.current?.focus({ preventScroll: true });
      }).catch(() => {});
    }
    return () => {
      ++generationRef.current;
      openingRef.current?.cancel();
      openingRef.current = null;
      // Deliberately keep the dialog present between opening and closing.
      // If the component unmounts, the dedicated cleanup below restores the page.
    };
  }, [open, origin]);

  useEffect(() => () => {
    if (dialogRef.current?.open) dialogRef.current.close();
    document.body.style.overflow = previousOverflowRef.current;
  }, []);

  return (
    <dialog ref={dialogRef} className="aiwa-cinema" aria-label="Aiwa Media Group full film"
      onCancel={event => { event.preventDefault(); onRequestClose(); }}
      onClick={event => { if (event.target === event.currentTarget) onRequestClose(); }}>
      <div className="aiwa-cinema__veil" onClick={onRequestClose} aria-hidden="true" />
      <div className="aiwa-cinema__panel" ref={panelRef}>
        <div className="aiwa-cinema__poster" style={{ backgroundImage: "url(" + poster + ")" }} />
        <div className="aiwa-cinema__loading" aria-hidden="true">
          <Play size={29} strokeWidth={1.4} fill="currentColor"/>
        </div>
        {playerReady && (nativeVideo ? (
          <video className={"aiwa-cinema__player" + (loaded ? " is-loaded" : "")}
            src={nativeVideo} controls autoPlay playsInline preload="metadata"
            poster={poster} onLoadedData={() => setLoaded(true)}
            aria-label="Aiwa Media Group full showreel" />
        ) : (
          <iframe className={"aiwa-cinema__player" + (loaded ? " is-loaded" : "")}
            src={"https://www.youtube-nocookie.com/embed/" + youtubeId +
              "?autoplay=1&rel=0&playsinline=1"}
            title="Aiwa Media Group full film" onLoad={() => setLoaded(true)}
            referrerPolicy="strict-origin-when-cross-origin"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen />
        ))}
        <div className="aiwa-cinema__toolbar">
          <div className="aiwa-cinema__brand">
            <strong>AIWA.</strong>
            <span>THE FULL FILM / CREATIVE THAT MOVES</span>
          </div>
          <div className="aiwa-cinema__actions">
            <a href={"https://www.youtube.com/watch?v=" + youtubeId}
              target="_blank" rel="noopener noreferrer"
              aria-label="Watch Aiwa film directly on YouTube">
              YOUTUBE <ArrowUpRight size={17} aria-hidden="true"/>
            </a>
            <button type="button" ref={closeRef} onClick={onRequestClose}
              aria-label="Close film"><X size={26} strokeWidth={1.7} aria-hidden="true"/></button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
