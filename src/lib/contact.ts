export type LeadDraft = {
  name: string
  company: string
  contact: string
  process: string
  systems: string[]
  goal: string
}

export function createLeadMailto(draft: LeadDraft): string {
  const body = [
    `Имя: ${draft.name.trim()}`,
    ...(draft.company.trim() ? [`Компания: ${draft.company.trim()}`] : []),
    `Обратная связь: ${draft.contact.trim()}`,
    `Системы: ${draft.systems.length ? draft.systems.join(', ') : 'Не указаны'}`,
    '',
    'Как процесс устроен сейчас:',
    draft.process.trim(),
    '',
    'Что хотелось бы изменить:',
    draft.goal.trim(),
  ].join('\n')
  return `mailto:info@altacod.com?subject=${encodeURIComponent('Задача по автоматизации')}&body=${encodeURIComponent(body)}`
}
