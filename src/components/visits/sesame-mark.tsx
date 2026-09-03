export function SesameMark({ className }: { className?: string }) {
  return (
    <span className={className}>
      <svg viewBox="0 0 28 28" className="size-7" aria-hidden="true">
        <ellipse cx="14" cy="14" rx="11" ry="13" fill="currentColor" />
        <ellipse cx="14" cy="14" rx="7" ry="9" fill="#efebe3" />
        <ellipse cx="12.5" cy="12" rx="1.4" ry="2.2" fill="currentColor" />
        <ellipse cx="16.2" cy="16.5" rx="1.1" ry="1.8" fill="currentColor" />
      </svg>
    </span>
  );
}
