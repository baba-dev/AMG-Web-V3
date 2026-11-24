import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export function ShowcaseOutro() {
  return <section className="cs-outro cs-gutter" aria-labelledby="cs-outro-title">
    <span className="cs-label">THE DISCIPLINES BEHIND THE WORK</span>
    <div className="cs-disciplines">
      <Link href="/specialisms">Marketing & campaigns <ArrowUpRight aria-hidden="true"/></Link>
      <Link href="/specialisms/creatives">Creative production <ArrowUpRight aria-hidden="true"/></Link>
      <Link href="/specialisms">Brand & communications <ArrowUpRight aria-hidden="true"/></Link>
      <Link href="/work/clients">Meet our clients <ArrowUpRight aria-hidden="true"/></Link>
    </div>
    <span className="cs-label">YOUR NEXT STORY</span><h2 id="cs-outro-title">LET’S MAKE<br/><em>IT MATTER.</em></h2>
    <Link className="cs-text-link" href="/contact">START A CONVERSATION <ArrowUpRight size={22} aria-hidden="true"/></Link>
  </section>;
}
