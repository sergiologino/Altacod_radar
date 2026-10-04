import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { detailPages } from './data/pages'
import { setPageMetadata } from './lib/seo'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import {
  AboutPage,
  ApproachPage,
  CasesPage,
  DetailPageView,
  IndustriesPage,
  NotFoundPage,
  SolutionsPage,
} from './pages/InteriorPages'

const meta: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Автоматизация бизнеса вокруг 1С | Altacod',
    description:
      'Связываем 1С с остальными системами, убираем ручную работу и помогаем вовремя замечать финансовый риск.',
  },
  '/solutions': {
    title: 'Решения для автоматизации вокруг 1С | Altacod',
    description:
      'Интеграции, Altacod Radar, ИИ и процессы маркетплейсов. Начинаем с конкретной задачи вашего бизнеса.',
  },
  '/industries': {
    title: 'Автоматизация для бизнеса | Altacod',
    description:
      'Практические сценарии для оптовой торговли, производства, сервиса и продавцов маркетплейсов.',
  },
  '/approach': {
    title: 'Как работаем | Altacod',
    description:
      'Разбираем процесс, проверяем данные, внедряем небольшой первый этап и измеряем результат.',
  },
  '/about': {
    title: 'О Сергее и Altacod | Altacod',
    description:
      'Системный анализ, архитектура, 1С и интеграции. Личное участие в разборе задачи и проектировании решения.',
  },
  '/cases': {
    title: 'Примеры задач | Altacod',
    description:
      'Демонстрационные сценарии сигналов для опта, производства, сервиса и маркетплейсов.',
  },
  '/contact': {
    title: 'Обсудить задачу | Altacod',
    description:
      'Покажите процесс, который хочется улучшить. Свяжитесь с Сергеем по почте info@altacod.com.',
  },
}
for (const page of detailPages)
  meta[page.path] = { title: `${page.label} | Altacod`, description: page.intro }

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
      <Route path="/approach" element={<ApproachPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
