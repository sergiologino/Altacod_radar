import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { HomePage } from './HomePage'

afterEach(cleanup)

describe('главная страница', () => {
  it('содержит все секции для внутренних ссылок и рабочий email-контакт', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    for (const link of document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')) {
      expect(
        document.getElementById(link.hash.slice(1)),
        `Нет секции для ${link.hash}`,
      ).not.toBeNull()
    }
    expect(screen.getByRole('link', { name: 'Написать о задаче' })).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:info@altacod.com'),
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Если сотрудники переносят данные между 1С, Excel',
    )
    expect(screen.getByRole('heading', { name: /Лично разбираю задачу/ })).toBeInTheDocument()
    expect(screen.getByText('ИИ НА СВОЁМ МЕСТЕ')).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/\bAI\b/)
  })

  it('показывает владельцу бизнеса конкретные проблемы и четыре примера автоматизации', () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    const page = within(container)

    expect(
      page.getByText(/убыточный заказ, опасную скидку или рост себестоимости/),
    ).toBeInTheDocument()
    expect(page.getByText('Маржа заказа ниже 8%')).toBeInTheDocument()
    expect(
      page.getByRole('heading', { name: 'Менеджеры дублируют данные между 1С, CRM и сайтом' }),
    ).toBeInTheDocument()
    expect(
      page.getByRole('heading', { name: 'Что именно можно автоматизировать' }),
    ).toBeInTheDocument()
    for (const title of [
      'Заказ из письма → в 1С',
      'Прайс поставщика → актуальные данные',
      'Скидка → проверка маржи',
      'CRM / сайт / 1С → единый процесс',
    ]) {
      expect(page.getByRole('heading', { name: title })).toBeInTheDocument()
    }
    expect(page.getByRole('link', { name: /Показать свой процесс/ })).toHaveAttribute(
      'href',
      '/contact',
    )
  })
})
