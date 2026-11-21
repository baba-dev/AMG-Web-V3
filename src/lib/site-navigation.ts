/** Canonical page links shared by the homepage and inner-page shell. */
export const siteNavigation = [
  { label: "WORK", href: "#work" },
  { label: "ABOUT", href: "#about" },
  { label: "SPECIALISMS", href: "#specialisms" },
  { label: "JOIN US", href: "https://aiwamediagroup.com/career/" },
  { label: "CONTACT US", href: "#contact" },
  { label: "LATEST", href: "https://www.linkedin.com/company/aiwamediagroup/" },
] as const;

export function resolveSiteHref(href: string, path: string): string {
  // Inner pages have a complete specialisms directory; homepage retains its
  // cinematic #specialisms section and its existing in-page nav.
  if (href === "#specialisms" && path !== "/") return "/specialisms";
  return href.startsWith("#") && path !== "/" ? "/" + href : href;
}
