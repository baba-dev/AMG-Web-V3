# Video UX correction — engineering notes

The film modal is now an independently owned component and is not coupled to
the scroll projection's DOM mount/unmount cycle.

- One dialog in the top layer, one poster and one player.
- Source frame captured before opening from the visible inline tile or the
  expanded reel. A compositor-friendly FLIP transform carries the poster
  into an aspect-ratio-constrained cinema panel.
- An iframe never loads until the opening movement completes, preventing
  iframe re-layout and YouTube startup from stalling the animation.
- Poster remains until the player has actually loaded. On close the player
  unmounts before the reverse animation; then background scroll is restored.
- Escape, backdrop click and close control all follow the same path.
- Reduced motion uses an immediate opening/closing transition.
- A direct official YouTube link is always present for embed failures.

Visual fidelity constraints: matching the observed reference's geometry,
not copying its private JavaScript, copyrighted movie frames or fonts.
