type BrandIconProps = {
  name: string
  className?: string
}

function IconArtwork({ name }: { name: string }) {
  switch (name) {
    case 'asbestos':
      return <><path className="icon-blue" d="M24 5 39 11v10c0 10-6 17-15 22C15 38 9 31 9 21V11Z" /><path className="icon-red" d="m17 25 5 5 10-12" /><circle className="icon-red-fill" cx="15" cy="15" r="1.5" /><circle className="icon-red-fill" cx="33" cy="16" r="1.5" /></>
    case 'lead':
      return <><path className="icon-blue" d="M8 10h23v10H8zM31 15h6v7h-9v5" /><path className="icon-blue" d="M24 27h8v15h-8z" /><path className="icon-red" d="M13 14h13M36 31c0 3-2 5-4 5s-4-2-4-5c0-2 4-7 4-7s4 5 4 7Z" /></>
    case 'mold':
      return <><path className="icon-blue" d="m6 23 18-15 18 15M11 20v21h26V20" /><path className="icon-red" d="M20 33c0-4 3-7 7-7M25 35c4 0 7-3 7-7M18 29h.01M30 36h.01M22 38h.01" /></>
    case 'windows':
      return <><rect className="icon-blue" x="8" y="6" width="32" height="36" rx="1" /><path className="icon-blue" d="M24 6v36M8 24h32" /><path className="icon-red" d="m29 34 6-6m0 0h-5m5 0v5" /></>
    case 'asbestos-testing':
      return <><path className="icon-blue" d="M18 6h12M21 6v14L10 37c-1 3 1 5 4 5h20c3 0 5-2 4-5L27 20V6" /><path className="icon-red" d="M15 31h18M19 35l4 4 8-9" /></>
    case 'asbestos-surveys':
      return <><rect className="icon-blue" x="9" y="7" width="25" height="35" rx="2" /><path className="icon-blue" d="M16 7V4h11v3M15 16h13M15 22h10M15 28h7" /><circle className="icon-red" cx="31" cy="32" r="7" /><path className="icon-red" d="m36 37 6 6" /></>
    case 'commercial-asbestos':
      return <><path className="icon-blue" d="M6 42V12h20v30M26 22h16v20M3 42h42M12 18h6M12 24h6M12 30h6M31 28h6M31 34h6" /><path className="icon-red" d="m31 5 10 4v6c0 6-4 10-10 13-6-3-10-7-10-13V9Z" /><path className="icon-red" d="m26 15 4 4 7-8" /></>
    case 'asbestos-tile':
      return <><path className="icon-blue" d="M7 7h34v34H7zM24 7v34M7 24h34" /><path className="icon-red" d="m12 36 24-24M29 12h7v7" /></>
    case 'asbestos-demolition':
      return <><path className="icon-blue" d="M5 42h27M9 42V16h19v26M13 21h4M21 21h4M13 27h4M13 33h4M5 16l14-9 13 9" /><path className="icon-red" d="m27 34 13-13M33 12l8 8-5 5-8-8zM29 39l5 5" /></>
    case 'mold-testing':
      return <><circle className="icon-blue" cx="22" cy="24" r="16" /><path className="icon-blue" d="M22 8a16 16 0 0 1 0 32" /><path className="icon-red" d="M16 19h.01M25 16h.01M28 25h.01M17 29h.01M32 36l5 5 7-9" /></>
    case 'water-damage':
      return <><path className="icon-blue" d="M24 5S11 20 11 29a13 13 0 0 0 26 0C37 20 24 5 24 5Z" /><path className="icon-red" d="M7 39c4-4 8 4 12 0s8 4 12 0 8 4 12 0M17 28c0 4 3 7 7 7" /></>
    case 'flooded-basement':
      return <><path className="icon-blue" d="m5 20 19-15 19 15M10 17v16h28V17M17 33v8h14v-8" /><path className="icon-red" d="M4 34c4-4 7 4 11 0s7 4 11 0 7 4 11 0 5 2 7 0M8 41h32" /></>
    case 'roofing':
      return <><path className="icon-blue" d="m4 25 20-18 20 18M10 22v20h28V22" /><path className="icon-red" d="m12 25 12-10 12 10M15 30h18M15 36h18M20 25v17M28 25v17" /></>
    case 'siding':
      return <><path className="icon-blue" d="m5 19 19-14 19 14M10 17v25h28V17" /><path className="icon-red" d="M14 23h20M14 28h20M14 33h20M14 38h20" /></>
    case 'gutters':
      return <><path className="icon-blue" d="m4 17 20-12 20 12M7 18h34v6H7zM35 24v12h6v7" /><path className="icon-red" d="M31 34c0 3-2 5-4 5s-4-2-4-5c0-2 4-7 4-7s4 5 4 7ZM17 27v5M24 27v5" /></>
    case 'doors':
      return <><path className="icon-blue" d="M9 43h30M13 43V5h23v38M13 5l17 5v33" /><circle className="icon-red-fill" cx="26" cy="26" r="2" /><path className="icon-red" d="M3 24h17m-5-5 5 5-5 5" /></>
    case 'residential':
      return <><path className="icon-blue" d="m5 23 19-16 19 16M10 20v22h28V20" /><path className="icon-red" d="M19 42V29h10v13M16 22h16" /></>
    case 'property-management':
      return <><path className="icon-blue" d="M5 42V14h17v28M22 7h20v35M3 42h42M10 20h6M10 26h6M10 32h6M28 14h8M28 21h8M28 28h8" /><circle className="icon-red" cx="31" cy="34" r="5" /><path className="icon-red" d="m35 38 7 7m-3-3 3-3" /></>
    case 'commercial':
      return <><path className="icon-blue" d="M6 20h36v22H6zM4 20l4-13h32l4 13M15 42V29h11v13" /><path className="icon-red" d="M4 20c0 5 8 5 8 0 0 5 8 5 8 0 0 5 8 5 8 0 0 5 8 5 8 0 0 5 8 5 8 0M12 12h24" /></>
    case 'industrial':
      return <><path className="icon-blue" d="M5 42V20l12 6V17l12 7V8h10v34ZM3 42h42" /><path className="icon-red" d="M12 34h5M23 34h5M33 16h6M33 23h6M33 30h6" /></>
    case 'education':
      return <><path className="icon-blue" d="m4 17 20-10 20 10-20 10ZM11 21v12c7 6 19 6 26 0V21M42 19v14" /><path className="icon-red" d="M17 37h14M24 31v12" /></>
    case 'healthcare':
      return <><path className="icon-blue" d="M7 42V12h34v30M3 42h42M14 20h5M29 20h5M14 33h5M29 33h5" /><path className="icon-red" d="M20 16h8v7h7v8h-7v7h-8v-7h-7v-8h7Z" /></>
    case 'government':
      return <><path className="icon-blue" d="m4 17 20-11 20 11ZM6 21h36M8 42h32M4 46h40M11 21v17M20 21v17M28 21v17M37 21v17M7 38h34" /><path className="icon-red" d="M19 12h10" /></>
    case 'contractors':
      return <><path className="icon-blue" d="M7 29a17 17 0 0 1 34 0ZM4 29h40v7H4zM18 12V6h12v6M24 6v18" /><path className="icon-red" d="m15 40 18 6M29 39l7 7" /></>
    case 'project-01':
      return <><rect className="icon-blue" x="7" y="6" width="29" height="37" rx="2" /><path className="icon-blue" d="M15 6V3h13v3M13 16h17M13 22h12" /><path className="icon-red" d="m12 36 8-7 8 7M16 34v8h8v-8M31 31l4 4 8-9" /></>
    case 'project-02':
      return <><path className="icon-blue" d="M5 43V12h23v31M28 23h15v20M2 43h44M11 19h10M11 26h10M11 33h7M33 29h5M33 35h5" /><path className="icon-red" d="m27 7 5 5 10-10M31 12h11" /></>
    case 'project-03':
      return <><path className="icon-blue" d="M7 9h24v10H7zM31 14h7v8h-9v6M25 28h7v14h-7" /><path className="icon-red" d="m36 25 8 3v5c0 6-3 10-8 12-5-2-8-6-8-12v-5Z" /><path className="icon-red" d="m32 34 3 3 6-7" /></>
    case 'project-04':
      return <><path className="icon-blue" d="m5 20 19-15 19 15M10 17v17h28V17M15 42h18" /><path className="icon-red" d="M5 34c4-4 7 4 11 0s7 4 11 0 7 4 11 0 5 2 7 0M20 25h.01M27 27h.01M24 21h.01" /></>
    case 'project-05':
      return <><circle className="icon-blue" cx="24" cy="24" r="18" /><circle className="icon-red" cx="24" cy="24" r="3" /><path className="icon-blue" d="M24 21c-8-1-11-6-8-10 4-5 11 1 11 10M27 24c1-8 6-11 10-8 5 4-1 11-10 11M24 27c8 1 11 6 8 10-4 5-11-1-11-10M21 24c-1 8-6 11-10 8-5-4 1-11 10-11" /><path className="icon-red" d="M5 43h34" /></>
    case 'project-06':
      return <><path className="icon-blue" d="m5 22 19-16 19 16M10 19v23h28V19M17 42V29h14v13" /><path className="icon-red" d="M14 23h20M14 27h20M35 8v12M31 12l4 4 4-4" /></>
    default:
      return <><path className="icon-blue" d="m5 23 19-16 19 16M10 20v22h28V20" /><path className="icon-red" d="m17 31 5 5 10-12" /></>
  }
}

export function BrandIcon({ name, className = '' }: BrandIconProps) {
  return (
    <svg className={`brand-icon ${className}`} viewBox="0 0 48 48" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <IconArtwork name={name} />
    </svg>
  )
}
