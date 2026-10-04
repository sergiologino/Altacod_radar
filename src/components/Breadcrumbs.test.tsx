import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { Breadcrumbs } from './Breadcrumbs'

afterEach(cleanup)

describe('хлебные крошки', () => {
  it('ведут со страницы решения на раздел и главную', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/solutions/radar']}>
        <Breadcrumbs />
      </MemoryRouter>,
    )

    const navigation = screen.getByRole('navigation', { name: 'Хлебные крошки' })
    expect(navigation).toHaveTextContent('ГлавнаяРешенияAltacod Radar')
    expect(screen.getByRole('link', { name: 'Главная' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Решения' })).toHaveAttribute('href', '/solutions')
    expect(screen.getByText('Altacod Radar')).toHaveAttribute('aria-current', 'page')

    await user.click(screen.getByRole('link', { name: 'Решения' }))
    expect(screen.getByText('Решения')).toHaveAttribute('aria-current', 'page')
  })

  it('показывает отраслевой путь и самостоятельную страницу', () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/industries/services']}>
        <Breadcrumbs />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Для бизнеса' })).toHaveAttribute('href', '/industries')
    expect(screen.getByText('Сервисные компании')).toHaveAttribute('aria-current', 'page')
    unmount()

    render(
      <MemoryRouter initialEntries={['/contact']}>
        <Breadcrumbs />
      </MemoryRouter>,
    )
    expect(screen.getByText('Контакт')).toHaveAttribute('aria-current', 'page')
  })

  it('не показывает крошки на главной', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Breadcrumbs />
      </MemoryRouter>,
    )
    expect(screen.queryByRole('navigation', { name: 'Хлебные крошки' })).not.toBeInTheDocument()
  })

  it('даёт возврат с витрины проектов на главную', () => {
    render(
      <MemoryRouter initialEntries={['/projects']}>
        <Breadcrumbs />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Главная' })).toHaveAttribute('href', '/')
    expect(screen.getByText('Проекты')).toHaveAttribute('aria-current', 'page')
  })
})
