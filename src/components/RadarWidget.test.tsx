import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { RadarWidget } from './RadarWidget'

describe('Altacod Radar UI', () => {
  it('переключает сигналы и показывает детали выбранного события', async () => {
    const user = userEvent.setup()
    render(<RadarWidget />)
    expect(screen.getByText('Скидка изменила экономику заказа')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Товар AX-42/ }))
    expect(screen.getByText('Через 11 дней возможен дефицит')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Клиент «Вектор»/ }))
    expect(screen.getByText('Оборот вырос, а прибыль снизилась.')).toBeInTheDocument()
  })

  it('пересчитывает маржу при изменении скидки и обновляет рекомендацию', () => {
    render(<RadarWidget />)
    const input = screen.getByRole('slider', { name: 'Скидка клиенту' })
    expect(screen.getByText('Маржа ниже целевых 10%')).toBeInTheDocument()
    fireEvent.change(input, { target: { value: '0' } })
    expect(screen.getByText('Маржа выше целевых 10%')).toBeInTheDocument()
    expect(screen.getByText('48 000 ₽')).toBeInTheDocument()
  })
})
