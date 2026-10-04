import { Link } from 'react-router-dom'

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      className={`brand${light ? ' brand--light' : ''}`}
      to="/"
      aria-label="Altacod — на главную"
    >
      <span className="brand-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="brand-name">
        altacod<span className="brand-dot">.</span>
      </span>
    </Link>
  )
}
