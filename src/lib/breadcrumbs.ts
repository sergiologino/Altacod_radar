import { detailPages } from '../data/pages'

export type Breadcrumb = { label: string; path: string }

const standaloneLabels: Record<string, string> = {
  '/1c': 'Работа с 1С',
  '/cases': 'Примеры задач',
  '/projects': 'Проекты',
  '/approach': 'Как работаем',
  '/about': 'Обо мне',
  '/contact': 'Контакт',
}

export function getBreadcrumbs(pathname: string): Breadcrumb[] {
  if (pathname === '/') return []

  const trail: Breadcrumb[] = [{ label: 'Главная', path: '/' }]
  if (pathname === '/solutions') return [...trail, { label: 'Решения', path: pathname }]
  if (pathname === '/industries') return [...trail, { label: 'Для бизнеса', path: pathname }]

  const page = detailPages.find((item) => item.path === pathname)
  if (page) {
    trail.push(
      page.path.startsWith('/solutions/')
        ? { label: 'Решения', path: '/solutions' }
        : page.path.startsWith('/industries/')
          ? { label: 'Для бизнеса', path: '/industries' }
          : { label: page.label, path: page.path },
    )
    if (trail.at(-1)?.path !== page.path) trail.push({ label: page.label, path: page.path })
    return trail
  }

  return [...trail, { label: standaloneLabels[pathname] || 'Страница не найдена', path: pathname }]
}
