import { beforeEach, describe, expect, it } from 'vitest'
import { setCanonicalUrl, setPageMetadata } from './seo'

describe('SEO главной страницы', () => {
  beforeEach(() => {
    document.head.innerHTML =
      '<link rel="canonical" href="/"><meta property="og:url" content="/"><meta property="og:image" content="">'
  })

  it('создаёт абсолютные canonical и OpenGraph URL для заданного домена', () => {
    expect(setCanonicalUrl('https://altacod.com')).toBe('https://altacod.com/')
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://altacod.com/',
    )
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://altacod.com/',
    )
    expect(document.querySelector('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://altacod.com/og-card.png',
    )
  })

  it('обновляет адрес и заголовок внутренней страницы', () => {
    document.head.insertAdjacentHTML(
      'beforeend',
      '<meta name="description"><meta property="og:title"><meta property="og:description">',
    )
    setPageMetadata(
      'Интеграции | Altacod',
      'Описание обменов',
      '/solutions/integrations',
      'https://altacod.com',
    )
    expect(document.title).toBe('Интеграции | Altacod')
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://altacod.com/solutions/integrations',
    )
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Описание обменов',
    )
  })
})
