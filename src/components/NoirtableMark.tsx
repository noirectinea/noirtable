export function NoirtableMark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      className={className}
      fill="none"
    >
      <circle cx="16" cy="16" r="11.5" stroke="currentColor" strokeWidth="1" />
      <path
        d="M10.75 21.25V10.75L21.25 21.25V10.75"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="square"
      />
      <path
        d="M20.5 10.75H24.75M22.625 10.75V21.25"
        stroke="currentColor"
        strokeWidth="0.95"
        strokeLinecap="square"
      />
    </svg>
  );
}
