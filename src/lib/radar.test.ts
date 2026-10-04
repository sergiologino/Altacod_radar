import { describe, expect, it } from 'vitest'
import { calculateOrder, orderExample } from './radar'

describe('демонстрационный расчёт заказа', () => {
  it('считает прибыль и маржу из цены, скидки и затрат', () => {
    const result = calculateOrder(5)
    expect(result.revenue).toBe(284_050)
    expect(result.totalCost).toBe(251_000)
    expect(result.profit).toBe(33_050)
    expect(result.margin).toBeCloseTo((33_050 / 284_050) * 100)
    expect(result.atRisk).toBe(false)
  })

  it('показывает риск при скидке и вычисляет безопасную цену', () => {
    const result = calculateOrder(12)
    expect(result.revenue).toBe(263_120)
    expect(result.profit).toBe(12_120)
    expect(result.atRisk).toBe(true)
    expect(result.minimumPrice).toBe(Math.ceil(251_000 / 0.9))
    expect(
      ((result.minimumPrice - result.totalCost) / result.minimumPrice) * 100,
    ).toBeGreaterThanOrEqual(orderExample.targetMargin)
  })

  it('ограничивает скидку допустимым диапазоном', () => {
    expect(calculateOrder(-5)).toEqual(calculateOrder(0))
    expect(calculateOrder(99)).toEqual(calculateOrder(15))
  })
})
