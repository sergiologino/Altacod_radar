import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { featuredProjects, productCatalogUrl, type FeaturedProject } from '../data/projects'

export function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<FeaturedProject | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (selectedProject && dialog && !dialog.open) dialog.showModal()
  }, [selectedProject])

  return (
    <>
      <a className="skip-link" href="#main">
        Перейти к содержанию
      </a>
      <Header />
      <Breadcrumbs />
      <main id="main">
        <section className="inner-hero projects-hero">
          <div className="container">
            <span className="inner-eyebrow">
              <span />
              ПРОЕКТЫ ALTACOD
            </span>
            <h1>Несколько задач, над которыми мы работали</h1>
            <p>
              Здесь собраны продукты с разными сценариями: от семейного приложения до портала и
              аналитического сервиса. Для каждого оставили ссылку на подробную страницу в каталоге.
            </p>
          </div>
        </section>
        <section className="projects-section">
          <div className="container projects-grid">
            {featuredProjects.map((project) => (
              <article className="project-card" key={project.slug}>
                <div
                  className={`project-preview project-preview--${project.preview}${project.image ? ' project-preview--image' : ''}`}
                  aria-hidden={project.image ? undefined : true}
                >
                  {project.image ? (
                    <button
                      className="project-preview-open"
                      type="button"
                      aria-label={`Открыть иллюстрацию ${project.name}`}
                      onClick={() => setSelectedProject(project)}
                    >
                      <img
                        className="project-preview-image"
                        src={project.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="project-preview-name" aria-hidden="true">
                        {project.name}
                      </span>
                    </button>
                  ) : (
                    <div className="project-preview-window">
                      <div className="project-preview-bar">
                        <span />
                        <span />
                        <span />
                      </div>
                      <div className="project-preview-content">
                        <div className="project-preview-side" />
                        <div className="project-preview-main">
                          <span className="project-preview-line" />
                          <span className="project-preview-line project-preview-line--short" />
                          <div className="project-preview-tiles">
                            <span />
                            <span />
                            <span />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {!project.image && <span className="project-preview-name">{project.name}</span>}
                </div>
                <div className="project-card-body">
                  <div className="project-card-top">
                    <span>{project.category}</span>
                    <span>{project.status}</span>
                  </div>
                  <h2>{project.name}</h2>
                  <p>{project.summary}</p>
                  <ul>
                    {project.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                  <a href={productCatalogUrl(project.slug)}>
                    Подробнее в каталоге <ArrowUpRight size={17} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <dialog
        className="project-image-dialog"
        ref={dialogRef}
        aria-label={selectedProject ? `Иллюстрация ${selectedProject.name}` : undefined}
        onClose={() => setSelectedProject(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close()
        }}
      >
        {selectedProject?.image && (
          <div className="project-image-dialog-content">
            <div className="project-image-dialog-bar">
              <span>{selectedProject.name}</span>
              <button
                className="project-image-dialog-close"
                type="button"
                aria-label="Закрыть иллюстрацию"
                onClick={() => dialogRef.current?.close()}
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>
            <img src={selectedProject.image} alt={`Иллюстрация ${selectedProject.name}`} />
          </div>
        )}
      </dialog>
    </>
  )
}
