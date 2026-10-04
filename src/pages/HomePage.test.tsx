import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { HomePage } from './HomePage'

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
})
