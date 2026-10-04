import { ArrowUpRight } from 'lucide-react'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { featuredProjects, productCatalogUrl } from '../data/projects'

export function ProjectsPage() {
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
                  className={`project-preview project-preview--${project.preview}`}
                  aria-hidden="true"
                >
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
                  <span className="project-preview-name">{project.name}</span>
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
    </>
  )
}
