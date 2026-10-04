import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character])
}

function replaceRequired(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`HTML-шаблон изменился: ${pattern}`)
  return html.replace(pattern, replacement)
}

export function renderStaticHtml(template, page, pathname, siteUrl) {
  const url = new URL(pathname, `${siteUrl.replace(/\/$/, '')}/`).toString()
  const imageUrl = new URL('/og-card.png', url).toString()
  let html = template
  html = replaceRequired(html, /<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`)
  html = replaceRequired(html, /<meta\s+name="description"[\s\S]*?\/>/i, `<meta name="description" content="${escapeHtml(page.description)}" />`)
  html = replaceRequired(html, /<meta\s+property="og:title"[\s\S]*?\/>/i, `<meta property="og:title" content="${escapeHtml(page.title)}" />`)
  html = replaceRequired(html, /<meta\s+property="og:description"[\s\S]*?\/>/i, `<meta property="og:description" content="${escapeHtml(page.description)}" />`)
  html = replaceRequired(html, /<meta\s+property="og:url"[\s\S]*?\/>/i, `<meta property="og:url" content="${escapeHtml(url)}" />`)
  html = replaceRequired(html, /<meta\s+property="og:image"[\s\S]*?\/>/i, `<meta property="og:image" content="${escapeHtml(imageUrl)}" />`)
  html = replaceRequired(html, /<link\s+rel="canonical"[\s\S]*?\/>/i, `<link rel="canonical" href="${escapeHtml(url)}" />`)
  return html
}

export function renderSitemap(paths, siteUrl) {
  const entries = paths.map((pathname) => `  <url><loc>${escapeHtml(new URL(pathname, `${siteUrl.replace(/\/$/, '')}/`).toString())}</loc></url>`)
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`
}

export async function generateStaticPages() {
  const siteUrl = (process.env.VITE_SITE_URL || 'https://altacod.com').replace(/\/$/, '')
  if (!/^https?:\/\//.test(siteUrl)) throw new Error('VITE_SITE_URL должен быть полным URL')
  const pages = JSON.parse(await readFile(path.join(root, 'src/data/routeMeta.json'), 'utf8'))
  const dist = path.join(root, 'dist')
  const template = await readFile(path.join(dist, 'index.html'), 'utf8')

  for (const [pathname, page] of Object.entries(pages)) {
    const target = pathname === '/' ? path.join(dist, 'index.html') : path.join(dist, pathname.slice(1), 'index.html')
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, renderStaticHtml(template, page, pathname, siteUrl))
  }

  await writeFile(path.join(dist, 'sitemap.xml'), renderSitemap(Object.keys(pages), siteUrl))
  await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`)
  return Object.keys(pages).length
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const count = await generateStaticPages()
  process.stdout.write(`Статические метаданные: ${count} страниц\n`)
}
