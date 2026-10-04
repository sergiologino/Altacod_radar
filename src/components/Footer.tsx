import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Logo light />
          <p>
            Инженерные решения вокруг 1С.
            <br />
            Помогаем убирать ручную работу и раньше замечать проблемы.
          </p>
        </div>
        <div className="footer-links">
          <span className="footer-heading">Навигация</span>
          <Link to="/solutions">Решения</Link>
          <Link to="/solutions/radar">Altacod Radar</Link>
          <Link to="/industries">Для бизнеса</Link>
          <Link to="/projects">Проекты</Link>
          <Link to="/1c">Работа с 1С</Link>
          <Link to="/cases">Примеры задач</Link>
          <Link to="/approach">Как работаем</Link>
          <Link to="/about">Обо мне</Link>
        </div>
        <div className="footer-links">
          <span className="footer-heading">Связаться</span>
          <a href="mailto:info@altacod.com?subject=%D0%97%D0%B0%D0%B4%D0%B0%D1%87%D0%B0%20%D0%BF%D0%BE%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8">
            info@altacod.com <ArrowUpRight size={15} />
          </a>
          <Link to="/contact">Показать процесс</Link>
          <a href="https://products.altacod.com">
            Все продукты Altacod <ArrowUpRight size={15} />
          </a>
          <span className="footer-muted">Расскажите, что хотите улучшить.</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Altacod</span>
        <span>Автоматизация малого бизнеса вокруг 1С</span>
      </div>
    </footer>
  )
}
