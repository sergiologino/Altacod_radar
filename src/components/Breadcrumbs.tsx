import { ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { getBreadcrumbs } from '../lib/breadcrumbs'

export function Breadcrumbs() {
  const { pathname } = useLocation()
  const items = getBreadcrumbs(pathname)
  if (items.length === 0) return null

  return (
    <nav className="breadcrumbs" aria-label="Хлебные крошки">
      <ol className="container breadcrumbs-list">
        {items.map((item, index) => (
          <li key={item.path}>
            {index > 0 && <ChevronRight size={14} aria-hidden="true" />}
            {index === items.length - 1 ? (
              <span aria-current="page">{item.label}</span>
            ) : (
              <Link to={item.path}>{item.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
