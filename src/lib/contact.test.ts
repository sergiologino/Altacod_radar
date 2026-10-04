import { describe, expect, it } from 'vitest'
import { createLeadMailto } from './contact'

describe('черновик обращения', () => {
  it('передаёт введённые данные в письмо и кодирует переносы строк', () => {
    const url = createLeadMailto({
      name: 'Анна',
      company: 'Тест',
      contact: 'anna@example.com',
      systems: ['1С', 'CRM'],
      process: 'Переносим заказы вручную',
      goal: 'Передавать автоматически',
    })
    const parsed = new URL(url)
    expect(parsed.pathname).toBe('info@altacod.com')
    expect(parsed.searchParams.get('body')).toContain('Компания: Тест\n')
    expect(parsed.searchParams.get('body')).toContain('Системы: 1С, CRM')
    expect(parsed.searchParams.get('body')).toContain('Передавать автоматически')
  })
})
