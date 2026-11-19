"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import "./mode-toggle.css";

/**
 * A self-contained animated day/night switch. Appearance is driven by the
 * theme class injected by next-themes, so the first paint needs no client
 * mount state and the saved preference survives navigation and reloads.
 */
export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      className="aiwa-theme-toggle"
      type="button"
      aria-label="Toggle colour theme"
      aria-pressed={resolvedTheme === "light"}
      title="Toggle light and dark theme"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
    >
      <span className="aiwa-theme-toggle__track" aria-hidden="true">
        <span className="aiwa-theme-toggle__spark aiwa-theme-toggle__spark--one" />
        <span className="aiwa-theme-toggle__spark aiwa-theme-toggle__spark--two" />
        <span className="aiwa-theme-toggle__spark aiwa-theme-toggle__spark--three" />
        <span className="aiwa-theme-toggle__orb">
          <Moon className="aiwa-theme-toggle__moon" strokeWidth={2} />
          <Sun className="aiwa-theme-toggle__sun" strokeWidth={2} />
        </span>
      </span>
    </button>
  );
}
