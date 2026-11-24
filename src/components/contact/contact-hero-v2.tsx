import { ArrowDown, ArrowRight } from "lucide-react";
import { MuscatSignal } from "./muscat-signal";
import "./contact-hero-v2.css";
export function ContactHeroV2(){
 return <section className="contact-signal contact-pad" aria-labelledby="contact-signal-title" data-contact-hero>
  <div className="contact-signal__art" aria-hidden="true"><MuscatSignal/></div>
  <div className="contact-signal__content">
   <p className="contact-signal__eyebrow">AIWA / CONTACT / OMAN</p>
   <h1 id="contact-signal-title"><span>FIND US.</span><span><em>START HERE.</em></span></h1>
   <p className="contact-signal__copy">From Muscat to everywhere your brand needs to go. Let&apos;s begin the next move.</p>
   <a className="contact-signal__cta" href="#enquiries">CONTACT AIWA <ArrowRight size={23} aria-hidden="true"/></a>
  </div>
  <div className="contact-signal__foot"><span>BASED IN MUSCAT. CREATING EVERYWHERE.</span><a href="#contact-office" aria-label="Find our Muscat office"><ArrowDown size={24} aria-hidden="true"/></a></div>
 </section>;
}
