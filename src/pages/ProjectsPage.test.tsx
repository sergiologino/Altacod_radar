import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { featuredProjects } from '../data/projects'
import { ProjectsPage } from './ProjectsPage'

describe('витрина проектов', () => {
  afterEach(cleanup)

  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute('open', '')
    }
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute('open')
      this.dispatchEvent(new Event('close'))
    }
  })

  afterAll(() => {
    delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).showModal
    delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).close
  })

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
    expect(document.querySelectorAll('.project-preview-image')).toHaveLength(3)
    for (const project of featuredProjects) {
      const card = cards.find((item) =>
        within(item).queryByRole('heading', { name: project.name }),
      )!
      const image = card.querySelector('.project-preview-image')
      if (project.image) {
        expect(image).toHaveAttribute('src', project.image)
      } else {
        expect(image).not.toBeInTheDocument()
        expect(card.querySelector('.project-preview-window')).toBeInTheDocument()
      }
    }
  })

  it('открывает предоставленную иллюстрацию целиком и закрывает окно', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/projects']}>
        <ProjectsPage />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Открыть иллюстрацию WibeStyle' }))
    const dialog = screen.getByRole('dialog', { name: 'Иллюстрация WibeStyle' })
    expect(within(dialog).getByRole('img', { name: 'Иллюстрация WibeStyle' })).toHaveAttribute(
      'src',
      '/images/projects/wibestyle.webp',
    )
    await user.click(within(dialog).getByRole('button', { name: 'Закрыть иллюстрацию' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    expect(
      screen.queryByRole('button', { name: 'Открыть иллюстрацию Publisher' }),
    ).not.toBeInTheDocument()
  })
})
