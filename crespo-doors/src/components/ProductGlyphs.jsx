// Small blueprint-style line-art glyphs representing each product type.
const stroke = { fill: 'none', stroke: '#832a2d', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' }
const strokeMuted = { ...stroke, stroke: '#b1adaa', strokeWidth: 1.6 }

export function GlyphSingleHung() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10">
      <rect x="10" y="6" width="44" height="52" rx="1" {...stroke} />
      <line x1="10" y1="32" x2="54" y2="32" {...strokeMuted} />
      <line x1="32" y1="6" x2="32" y2="58" {...strokeMuted} />
    </svg>
  )
}
export function GlyphDoubleHung() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10">
      <rect x="10" y="6" width="44" height="52" rx="1" {...stroke} />
      <line x1="10" y1="32" x2="54" y2="32" {...strokeMuted} />
      <path d="M32 14 L26 22 M32 14 L38 22" {...strokeMuted} />
      <path d="M32 50 L26 42 M32 50 L38 42" {...strokeMuted} />
    </svg>
  )
}
export function GlyphSliding() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10">
      <rect x="10" y="6" width="44" height="52" rx="1" {...stroke} />
      <line x1="32" y1="6" x2="32" y2="58" {...strokeMuted} />
      <path d="M38 32 L48 32 M44 27 L49 32 L44 37" {...strokeMuted} />
    </svg>
  )
}
export function GlyphCasement() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10">
      <rect x="10" y="6" width="44" height="52" rx="1" {...stroke} />
      <path d="M10 6 L54 32 L10 58 Z" {...strokeMuted} />
    </svg>
  )
}
export function GlyphBayBow() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10">
      <path d="M6 58 L6 22 L20 8 L44 8 L58 22 L58 58" {...stroke} />
      <line x1="20" y1="8" x2="20" y2="58" {...strokeMuted} />
      <line x1="44" y1="8" x2="44" y2="58" {...strokeMuted} />
    </svg>
  )
}
export function GlyphAwning() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10">
      <rect x="10" y="6" width="44" height="52" rx="1" {...stroke} />
      <path d="M10 6 L32 20 L54 6" {...strokeMuted} />
    </svg>
  )
}
export function GlyphImpact() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10">
      <rect x="10" y="6" width="44" height="52" rx="1" {...stroke} />
      <path d="M10 6 L54 58 M54 6 L10 58" {...strokeMuted} />
    </svg>
  )
}
export function GlyphEntry() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10">
      <path d="M14 58 L14 26 A18 18 0 0 1 50 26 L50 58 Z" {...stroke} />
      <circle cx="41" cy="42" r="1.8" fill="#832a2d" stroke="none" />
    </svg>
  )
}
export function GlyphFrench() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10">
      <rect x="8" y="6" width="22" height="52" rx="1" {...stroke} />
      <rect x="34" y="6" width="22" height="52" rx="1" {...stroke} />
      <line x1="19" y1="6" x2="19" y2="58" {...strokeMuted} />
      <line x1="45" y1="6" x2="45" y2="58" {...strokeMuted} />
      <line x1="8" y1="32" x2="30" y2="32" {...strokeMuted} />
      <line x1="34" y1="32" x2="56" y2="32" {...strokeMuted} />
    </svg>
  )
}
export function GlyphPatio() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10">
      <rect x="8" y="6" width="30" height="52" rx="1" {...strokeMuted} />
      <rect x="26" y="6" width="30" height="52" rx="1" {...stroke} />
      <path d="M14 46 L22 46 M18 41 L23 46 L18 51" {...strokeMuted} />
    </svg>
  )
}
export function GlyphStorm() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10">
      <rect x="12" y="6" width="40" height="52" rx="1" {...stroke} />
      <line x1="12" y1="38" x2="52" y2="38" {...strokeMuted} />
      <line x1="17" y1="46" x2="47" y2="46" {...strokeMuted} />
      <line x1="17" y1="51" x2="47" y2="51" {...strokeMuted} />
    </svg>
  )
}
export function GlyphBifold() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10">
      <path d="M8 6 L8 58 L22 58 L22 6 Z M22 12 L36 6 L36 58 L22 52 M36 12 L50 6 L50 58 L36 52" {...stroke} />
    </svg>
  )
}
