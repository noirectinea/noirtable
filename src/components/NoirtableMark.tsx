export function NoirtableMark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      className={className}
      fill="none"
    >
      <circle cx="16" cy="16" r="12.25" stroke="currentColor" strokeWidth="1" />
      <path
        d="M10.5 21.5V10.5L21.5 21.5V10.5"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="square"
      />
      <path
        d="M20.25 10.5H25.25M22.75 10.5V21.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      />
    </svg>
  );
}
