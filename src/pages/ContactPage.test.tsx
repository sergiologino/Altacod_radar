import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ContactPage } from './ContactPage'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

async function fillRequired(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole('textbox', { name: 'Ваше имя' }), 'Анна')
  await user.type(screen.getByRole('textbox', { name: 'Почта для ответа' }), 'anna@example.com')
  await user.type(
    screen.getByRole('textbox', { name: 'Как процесс устроен сейчас' }),
    'Переносим заказы',
  )
  await user.type(
    screen.getByRole('textbox', { name: 'Что хотелось бы изменить' }),
    'Автоматизировать',
  )
}

describe('страница контакта', () => {
  it('отправляет форму и файл без почтового клиента', async () => {
    const send = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', send)
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>,
    )
    await fillRequired(user)
    await user.click(screen.getByRole('checkbox', { name: '1С' }))
    await user.upload(
      screen.getByLabelText(/Файл с примером/),
      new File(['пример'], 'order.txt', { type: 'text/plain' }),
    )
    expect(screen.getByText(/приложится к обращению/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Отправить обращение' }))
    await waitFor(() => expect(send).toHaveBeenCalledOnce())
    const [url, options] = send.mock.calls[0]!
    expect(url).toBe('/api/contact')
    expect(options.method).toBe('POST')
    expect(options.body.get('contact')).toBe('anna@example.com')
    expect(options.body.get('systems')).toBe('1С')
    expect(options.body.has('attachment')).toBe(true)
    expect(await screen.findByText(/Обращение отправлено/)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Открыть письмо' })).not.toBeInTheDocument()
  })

  it('не отправляет форму без действительного адреса', async () => {
    const send = vi.fn()
    vi.stubGlobal('fetch', send)
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>,
    )
    await fillRequired(user)
    await user.clear(screen.getByRole('textbox', { name: 'Почта для ответа' }))
    await user.type(screen.getByRole('textbox', { name: 'Почта для ответа' }), 'не почта')
    await user.click(screen.getByRole('button', { name: 'Отправить обращение' }))
    expect(send).not.toHaveBeenCalled()
  })

  it('показывает ошибку сервера и сохраняет введённые данные', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue({
          ok: false,
          json: async () => ({ error: 'Сервер временно недоступен' }),
        }),
    )
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>,
    )
    await fillRequired(user)
    await user.click(screen.getByRole('button', { name: 'Отправить обращение' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Сервер временно недоступен')
    expect(screen.getByRole('textbox', { name: 'Почта для ответа' })).toHaveValue(
      'anna@example.com',
    )
  })
})
