import { beforeEach, describe, expect, it } from 'vitest'
import {
  initializeMetrika,
  isMetrikaHost,
  METRIKA_COUNTER_ID,
  trackMetrikaPageView,
} from './metrika'

describe('Яндекс Метрика корпоративного сайта', () => {
  beforeEach(() => {
    document.getElementById('yandex-metrika-script')?.remove()
    delete window.ym
    delete window.dataLayer
  })

  it('работает только на публичном домене корпоративного сайта', () => {
    expect(isMetrikaHost('altacod.com')).toBe(true)
    expect(isMetrikaHost('www.altacod.com')).toBe(true)
    expect(isMetrikaHost('products.altacod.com')).toBe(false)
    expect(isMetrikaHost('localhost')).toBe(false)
  })

  it('инициализирует отдельный счётчик без автоматического просмотра и без дубля скрипта', () => {
    initializeMetrika()
    initializeMetrika()

    expect(document.querySelectorAll('#yandex-metrika-script')).toHaveLength(1)
    expect(document.getElementById('yandex-metrika-script')).toHaveAttribute(
      'src',
      `https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_COUNTER_ID}`,
    )
    expect(window.ym?.a?.[0]).toEqual([
      METRIKA_COUNTER_ID,
      'init',
      expect.objectContaining({ defer: true, webvisor: true, clickmap: true }),
    ])
  })

  it('передаёт просмотр маршрута вместе с заголовком и предыдущей страницей', () => {
    trackMetrikaPageView(
      'https://altacod.com/projects',
      'Проекты Altacod | Altacod',
      'https://altacod.com/',
    )

    expect(window.ym?.a?.[1]).toEqual([
      METRIKA_COUNTER_ID,
      'hit',
      'https://altacod.com/projects',
      { title: 'Проекты Altacod | Altacod', referer: 'https://altacod.com/' },
    ])
  })
})
