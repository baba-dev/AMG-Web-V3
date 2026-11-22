/** Canonical page links shared by the homepage and inner-page shell. */
export const siteNavigation = [
  { label: "WORK", href: "/work" },
  { label: "ABOUT", href: "#about" },
  { label: "SPECIALISMS", href: "/specialisms" },
  { label: "TEAM", href: "/team" },
  { label: "JOIN US", href: "/join-us" },
  { label: "CONTACT US", href: "/contact" },
  { label: "LATEST", href: "https://www.linkedin.com/company/aiwamediagroup/" },
] as const;

export function resolveSiteHref(href: string, path: string): string {
  // Keep legacy in-page section links usable from inner pages, while
  // primary navigation points to dedicated routes for page transitions.
  if (href === "#specialisms" && path !== "/") return "/specialisms";
  if (href === "#contact" && path !== "/") return "/contact";
  return href.startsWith("#") && path !== "/" ? "/" + href : href;
}
