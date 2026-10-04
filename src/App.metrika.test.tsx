import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from './App'

const { trackPageView } = vi.hoisted(() => ({ trackPageView: vi.fn() }))

vi.mock('./lib/metrika', () => ({
  isMetrikaHost: () => true,
  trackMetrikaPageView: trackPageView,
}))

describe('просмотры страниц Метрики', () => {
  beforeEach(() => {
    trackPageView.mockClear()
    vi.stubGlobal('scrollTo', vi.fn())
  })

  it('учитывает переход по ссылке без перезагрузки страницы', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/solutions']}>
        <App />
      </MemoryRouter>,
    )

    const firstUrl = new URL('/solutions', window.location.origin).toString()
    expect(trackPageView).toHaveBeenCalledWith(
      firstUrl,
      'Решения для автоматизации вокруг 1С | Altacod',
      document.referrer,
    )

    await user.click(screen.getAllByRole('link', { name: 'Проекты' })[0]!)

    expect(trackPageView).toHaveBeenCalledTimes(2)
    expect(trackPageView).toHaveBeenLastCalledWith(
      new URL('/projects', window.location.origin).toString(),
      'Проекты Altacod | Altacod',
      firstUrl,
    )
  })
})
