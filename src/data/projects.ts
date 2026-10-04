export type FeaturedProject = {
  name: string
  slug: string
  category: string
  status: string
  summary: string
  details: string[]
  preview: string
}

export const featuredProjects: FeaturedProject[] = [
  {
    name: 'WibeStyle',
    slug: 'wibestyle',
    category: 'Виртуальная примерка',
    status: 'Работает',
    summary:
      'Помогает представить, как одежда из карточки товара будет смотреться на человеке. В основе сценария — фотография и выбранный образ.',
    details: ['Фото и карточка товара', 'Образ для примерки', 'Работа с маркетплейсами'],
    preview: 'style',
  },
  {
    name: 'AltaKid',
    slug: 'altakid',
    category: 'Семья и безопасность',
    status: 'Работает',
    summary:
      'Родительский контроль для семьи: экранное время, местоположение и доступность приложений собраны в одном процессе.',
    details: ['Мобильное приложение', 'Кабинет родителя', 'Семейные сценарии'],
    preview: 'kid',
  },
  {
    name: 'Publisher',
    slug: 'publisher',
    category: 'Контент и публикации',
    status: 'Временно остановлен',
    summary:
      'Автор готовит публикацию один раз и распределяет её по выбранным площадкам. Сейчас сервис остановлен; запуск планируется возобновить.',
    details: ['Редактор публикаций', 'Очередь отправки', 'Несколько площадок'],
    preview: 'publisher',
  },
  {
    name: 'Любимая Дача',
    slug: 'dacha-ai',
    category: 'Помощник садовода',
    status: 'В каталоге',
    summary:
      'Календарь сезонных дел, информация о культурах и помощь по фотографии растения в приложении для дачников.',
    details: ['Календарь работ', 'Участок и культуры', 'Агроэксперт'],
    preview: 'dacha',
  },
  {
    name: 'Военсовет',
    slug: 'voensovet',
    category: 'Социальный проект',
    status: 'В каталоге',
    summary:
      'Информационный портал для военнослужащих, ветеранов и семей. Помогает найти материалы и обратиться к цифровому помощнику.',
    details: ['Информационные разделы', 'Сервисы поддержки', 'ИИ-помощник'],
    preview: 'voensovet',
  },
  {
    name: 'AltaTrade',
    slug: 'altatrade',
    category: 'Аналитика рынков',
    status: 'В работе',
    summary:
      'Исследовательский продукт для анализа активов: котировки, события, прогнозы и сигналы об отклонениях.',
    details: ['Рыночные данные', 'Прогнозы', 'Объяснение сигналов'],
    preview: 'trade',
  },
]

export function productCatalogUrl(slug: string) {
  return `https://products.altacod.com/apps/${encodeURIComponent(slug)}`
}
