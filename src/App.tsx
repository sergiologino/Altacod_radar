import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { detailPages } from './data/pages'
import routeMeta from './data/routeMeta.json'
import { setPageMetadata } from './lib/seo'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import { ProjectsPage } from './pages/ProjectsPage'
import {
  AboutPage,
  ApproachPage,
  CasesPage,
  DetailPageView,
  IndustriesPage,
  NotFoundPage,
  SolutionsPage,
} from './pages/InteriorPages'

const meta: Record<string, { title: string; description: string }> = routeMeta

export function App() {
  const location = useLocation()
  useEffect(() => {
    const page = meta[location.pathname] || {
      title: 'Страница не найдена | Altacod',
      description: 'Вернитесь на главную страницу Altacod.',
    }
    setPageMetadata(page.title, page.description, location.pathname, import.meta.env.VITE_SITE_URL)
    if (!location.hash) window.scrollTo?.(0, 0)
  }, [location.pathname, location.hash])

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/solutions" element={<SolutionsPage />} />
      <Route path="/industries" element={<IndustriesPage />} />
      {detailPages.map((page) => (
        <Route path={page.path} element={<DetailPageView page={page} />} key={page.path} />
      ))}
      <Route path="/cases" element={<CasesPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/approach" element={<ApproachPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
