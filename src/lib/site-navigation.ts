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
  return href.startsWith("#") && path !== "/" ? "/" + href : href;
}
