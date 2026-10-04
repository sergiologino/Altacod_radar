import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { featuredProjects } from '../data/projects'
import { ProjectsPage } from './ProjectsPage'

describe('витрина проектов', () => {
  it('показывает выбранные владельцем проекты и ведёт к их страницам в каталоге', () => {
    render(
      <MemoryRouter initialEntries={['/projects']}>
        <ProjectsPage />
      </MemoryRouter>,
    )

    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(6)
    for (const project of featuredProjects) {
      const card = cards.find((item) => within(item).queryByRole('heading', { name: project.name }))
      expect(card).toBeDefined()
      expect(within(card!).getByRole('link', { name: 'Подробнее в каталоге' })).toHaveAttribute(
        'href',
        `https://products.altacod.com/apps/${project.slug}`,
      )
    }
    expect(screen.getByText('Временно остановлен')).toBeInTheDocument()
    expect(screen.getByText('В работе')).toBeInTheDocument()
  })
})
