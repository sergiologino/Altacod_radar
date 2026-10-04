import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ContactPage } from './ContactPage'

describe('страница контакта', () => {
  it('собирает письмо и объясняет, что файл нужно приложить вручную', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>,
    )
    for (const link of screen.getAllByRole('link', { name: 'info@altacod.com' })) {
      expect(link).toHaveAttribute('href', expect.stringContaining('mailto:info@altacod.com'))
    }
    await user.type(screen.getByRole('textbox', { name: 'Ваше имя' }), 'Анна')
    await user.type(
      screen.getByRole('textbox', { name: 'Как с вами связаться' }),
      'anna@example.com',
    )
    await user.type(
      screen.getByRole('textbox', { name: 'Как процесс устроен сейчас' }),
      'Вручную переносим заказы',
    )
    await user.type(
      screen.getByRole('textbox', { name: 'Что хотелось бы изменить' }),
      'Автоматизировать перенос',
    )
    await user.click(screen.getByRole('checkbox', { name: '1С' }))
    await user.upload(
      screen.getByLabelText(/Файл с примером/),
      new File(['пример'], 'order.txt', { type: 'text/plain' }),
    )
    expect(screen.getByText(/нужно будет приложить к письму вручную/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Подготовить письмо' }))
    expect(screen.getByRole('link', { name: 'Открыть письмо' })).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:info@altacod.com'),
    )
    expect(screen.getByText(/Черновик готов/)).toBeInTheDocument()
  })
})
