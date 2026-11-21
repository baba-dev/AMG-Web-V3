import { ArrowDownRight } from "lucide-react";
import "./work-process.css";

const phases=[
 {number:"01",title:"THINK.",copy:"Find the human insight, the business challenge and the idea worth making real."},
 {number:"02",title:"CREATE.",copy:"Shape a distinctive identity, experience or creative story around that idea."},
 {number:"03",title:"DELIVER.",copy:"Bring the work into the world through the channels and tools it needs."},
] as const;

/** An agency approach, not invented client-specific outcomes. */
export function WorkProcess(){
 return <section className="work-process work-page__gutter" aria-labelledby="work-process-heading">
  <div className="work-process__top"><span>02 / THE APPROACH</span><span>THE THINKING BEHIND THE WORK</span></div>
  <h2 id="work-process-heading">NOT JUST<br/>PRETTY <em>PICTURES.</em></h2>
  <div className="work-process__bottom">
   <p>Every project starts with a question. The interesting part is what happens when we refuse the obvious answer.</p>
   <ol>{phases.map(phase=><li key={phase.number}>
    <span>{phase.number}</span><strong>{phase.title}</strong><p>{phase.copy}</p><ArrowDownRight size={24} aria-hidden="true"/>
   </li>)}</ol>
  </div>
 </section>;
}
