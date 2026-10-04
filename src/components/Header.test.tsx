import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { Header } from './Header'

describe('навигация', () => {
  it('открывает и закрывает мобильное меню, ссылки ведут на страницы', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )
    const toggle = screen.getByRole('button', { name: 'Открыть меню' })
    await user.click(toggle)
    expect(screen.getByRole('button', { name: 'Закрыть меню' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    await user.click(screen.getByRole('link', { name: 'Решения' }))
    expect(screen.getByRole('button', { name: 'Открыть меню' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    for (const path of [
      '/solutions',
      '/industries',
      '/projects',
      '/1c',
      '/approach',
      '/about',
      '/contact',
    ]) {
      expect(document.querySelector(`a[href="${path}"]`)).toBeInTheDocument()
    }
  })
})
