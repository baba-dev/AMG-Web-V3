/** Decorative circuit lines that draw themselves as the IoT section scrolls into view (CSS scroll-driven; fully drawn at rest). */
export function SignalLines() {
  return <svg className="tech-signal" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path pathLength="100" d="M0 120H240L300 60H620L680 120H1200"/>
      <path pathLength="100" d="M0 300H180L240 360H520L580 300H900L960 240H1200"/>
      <path pathLength="100" d="M0 500H360L420 440H760L820 500H1200"/>
      <path pathLength="100" d="M300 0V60M680 120V200M580 300V420M960 240V120M420 440V600"/>
    </g>
    <g fill="currentColor">{[[300,60],[680,120],[580,300],[960,240],[420,440]].map(([x,y])=><circle key={x+":"+y} cx={x} cy={y} r="5"/>)}</g>
  </svg>;
}
