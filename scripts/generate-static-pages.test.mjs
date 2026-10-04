import { describe, expect, it } from 'vitest'
import { renderSitemap, renderStaticHtml } from './generate-static-pages.mjs'

const template = '<html><head><meta name="description" content="old" /><meta property="og:title" content="old" /><meta property="og:description" content="old" /><meta property="og:url" /><meta property="og:image" /><link rel="canonical" /><title>old</title></head><body></body></html>'

describe('статические метаданные', () => {
  it('выдаёт уникальные title, description и абсолютные URL для внутренней страницы', () => {
    const html = renderStaticHtml(template, { title: 'Проекты Altacod', description: 'Витрина & каталог' }, '/projects', 'https://altacod.com')
    expect(html).toContain('<title>Проекты Altacod</title>')
    expect(html).toContain('content="Витрина &amp; каталог"')
    expect(html).toContain('rel="canonical" href="https://altacod.com/projects"')
    expect(html).toContain('property="og:url" content="https://altacod.com/projects"')
    expect(html).toContain('property="og:image" content="https://altacod.com/og-card.png"')
  })

  it('включает все указанные маршруты в sitemap', () => {
    const sitemap = renderSitemap(['/', '/projects'], 'https://altacod.com')
    expect(sitemap).toContain('<loc>https://altacod.com/</loc>')
    expect(sitemap).toContain('<loc>https://altacod.com/projects</loc>')
    expect(sitemap).not.toContain('products.altacod.com')
  })
})
