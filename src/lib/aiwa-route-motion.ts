/**
 * Conservative same-origin routing policy for the global motion layer.
 * Same-page hash/query links, modified clicks and external destinations remain native.
 */
export type MotionDestination = { href: string; pathname: string };

export function resolveMotionDestination(href: string, currentHref: string): MotionDestination | null {
  try {
    const current = new URL(currentHref);
    const next = new URL(href, current);
    if (next.origin !== current.origin || !["http:", "https:"].includes(next.protocol)) return null;
    const normalize = (path: string) => path.replace(/\/+$/, "") || "/";
    if (normalize(next.pathname) === normalize(current.pathname)) return null;
    return { href: next.pathname + next.search + next.hash, pathname: normalize(next.pathname) };
  } catch {
    return null;
  }
}

export function motionDestinationLabel(pathname: string, projects: ReadonlyArray<{ slug: string; client: string }>): string {
  if (pathname === "/") return "AIWA.";
  if (pathname === "/about") return "BEYOND THE NOISE.";
  if (pathname === "/work") return "THE WORK.";
  if (pathname === "/work/clients") return "GOOD COMPANY.";
  if (pathname === "/specialisms") return "WHAT WE DO.";
  const project = projects.find((item) => pathname === "/work/" + item.slug);
  if (project) return project.client.toUpperCase() + ".";
  if (pathname.startsWith("/specialisms/")) return pathname.split("/").filter(Boolean).at(-1)!.replace(/-/g, " ").toUpperCase() + ".";
  return pathname.split("/").filter(Boolean).at(-1)?.replace(/-/g, " ").toUpperCase() + "." || "AIWA.";
}
