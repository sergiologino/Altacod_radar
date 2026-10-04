import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { App } from './App'
import { detailPages } from './data/pages'
import routeMeta from './data/routeMeta.json'

vi.stubGlobal('scrollTo', vi.fn())

describe('маршруты сайта', () => {
  it.each(detailPages)('открывает $path с собственным заголовком', (page) => {
    render(
      <MemoryRouter initialEntries={[page.path]}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { level: 1, name: page.title })).toBeInTheDocument()
    expect(document.title).toBe(routeMeta[page.path as keyof typeof routeMeta].title)
  })

  it.each([
    ['/solutions', 'Убираем ручные переходы и помогаем вовремя увидеть риск'],
    ['/industries', 'У каждой отрасли свои данные и своя цена задержки'],
    ['/cases', 'Как может выглядеть первый полезный сигнал'],
    ['/projects', 'Несколько задач, над которыми мы работали'],
    ['/approach', 'Начинаем с процесса, который уже мешает работать'],
    ['/about', 'Я лично разбираю задачу и проектирую решение'],
    ['/contact', 'Покажите процесс, который хочется улучшить'],
  ])('открывает %s', (path, title) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
  })
})
