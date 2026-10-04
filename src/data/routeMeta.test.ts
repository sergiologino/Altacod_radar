import { describe, expect, it } from 'vitest'
import { detailPages } from './pages'
import routeMeta from './routeMeta.json'

describe('метаданные маршрутов', () => {
  it('охватывают все предметные страницы и витрину проектов', () => {
    const paths = Object.keys(routeMeta)
    for (const page of detailPages) expect(paths).toContain(page.path)
    for (const path of [
      '/',
      '/solutions',
      '/industries',
      '/projects',
      '/cases',
      '/approach',
      '/about',
      '/contact',
    ]) {
      expect(paths).toContain(path)
    }
    expect(new Set(paths).size).toBe(paths.length)
  })
})
