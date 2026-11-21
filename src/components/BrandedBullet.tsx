/** AIS double-chevron list marker, using the site's theme-aware logo palette. */
export function BrandedBullet() {
  return (
    <svg className="branded-bullet" viewBox="0 0 32 24" width="24" height="18" aria-hidden="true" focusable="false">
      <path className="branded-bullet-blue" d="M2 3h6l9 9-9 9H2l9-9Z" />
      <path className="branded-bullet-red" d="M12 3h9l9 9-9 9h-9l9-9Z" />
    </svg>
  )
}
