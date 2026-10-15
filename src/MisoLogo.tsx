/** The miso mascot mark — a bowl with chopsticks, in the brand navy and red. */
export function MisoLogo({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" aria-hidden="true">
      <circle cx="30" cy="30" r="22" stroke="#1E2A5E" strokeWidth="4" fill="none" />
      <line x1="12" y1="48" x2="38" y2="10" stroke="#E8303F" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="16" y1="52" x2="42" y2="14" stroke="#E8303F" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export default MisoLogo;
