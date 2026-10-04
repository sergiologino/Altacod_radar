import { lazy, Suspense } from 'react'
import { ArrowRight, ArrowUpRight, Check, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { type DetailPage, industryLinks, solutionLinks } from '../data/pages'

const RadarWidget = lazy(() =>
  import('../components/RadarWidget').then((module) => ({ default: module.RadarWidget })),
)

function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Перейти к содержанию
      </a>
      <Header />
      <Breadcrumbs />
      <main id="main">{children}</main>
      <Footer />
    </>
  )
}

function Eyebrow({ children }: { children: string }) {
  return (
    <span className="inner-eyebrow">
      <span />
      {children}
    </span>
  )
}

function PageHero({
  eyebrow,
  title,
  intro,
  note,
}: {
  eyebrow: string
  title: string
  intro: string
  note?: string
}) {
  return (
    <section className="inner-hero">
      <div className="container inner-hero-grid">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1>{title}</h1>
          <p>{intro}</p>
          <Link className="button button--primary" to="/contact">
            Показать свой процесс <ArrowUpRight size={18} />
          </Link>
        </div>
        {note && (
          <aside className="inner-hero-note">
            <span>ПО СУЩЕСТВУ</span>
            <p>{note}</p>
          </aside>
        )}
      </div>
    </section>
  )
}

function ContactBand({ text }: { text: string }) {
  return (
    <section className="inner-contact">
      <div className="container inner-contact-grid">
        <div>
          <Eyebrow>НАЧНЁМ С КОНКРЕТНОЙ ЗАДАЧИ</Eyebrow>
          <h2>{text}</h2>
        </div>
        <Link className="button button--white" to="/contact">
          Рассказать о задаче <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  )
}

export function DetailPageView({ page }: { page: DetailPage }) {
  return (
    <PageFrame>
      <PageHero eyebrow={page.eyebrow} title={page.title} intro={page.intro} note={page.note} />
      {page.path === '/solutions/radar' && (
        <section className="inner-radar">
          <div className="container">
            <div className="inner-section-head">
              <Eyebrow>ИНТЕРАКТИВНЫЙ МАКЕТ</Eyebrow>
              <h2>Посмотрите, как меняется сигнал</h2>
              <p>Выберите ситуацию или измените скидку в заказе. Расчёты здесь демонстрационные.</p>
            </div>
            <Suspense
              fallback={
                <div className="radar-loading" role="status">
                  Загружаем демо Radar…
                </div>
              }
            >
              <RadarWidget />
            </Suspense>
          </div>
        </section>
      )}
      <section className="inner-section">
        <div className="container">
          <div className="inner-section-head">
            <Eyebrow>В РАБОЧЕМ ПРОЦЕССЕ</Eyebrow>
            <h2>{page.sectionTitle}</h2>
            <p>{page.sectionIntro}</p>
          </div>
          <div className="inner-point-grid">
            {page.points.map((point, index) => (
              <article className="inner-point" key={point.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{point.title}</h3>
                <p>{point.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="inner-example">
        <div className="container inner-example-grid">
          <div>
            <Eyebrow>ПРИМЕР СЦЕНАРИЯ</Eyebrow>
            <h2>{page.exampleTitle}</h2>
            <p>{page.example}</p>
          </div>
          <ul>
            {page.exampleLines.map((line) => (
              <li key={line}>
                <Check size={17} />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div className="container inner-related">
        <span>ПО ТЕМЕ</span>
        <Link to={page.related.path}>
          {page.related.label} <ArrowRight size={19} />
        </Link>
      </div>
      <ContactBand text={page.closing} />
    </PageFrame>
  )
}

function OverviewPage({ kind }: { kind: 'solutions' | 'industries' }) {
  const solutions = kind === 'solutions'
  const pages = solutions ? solutionLinks : industryLinks
  return (
    <PageFrame>
      <PageHero
        eyebrow={solutions ? 'НАШИ РЕШЕНИЯ' : 'ДЛЯ БИЗНЕСА'}
        title={
          solutions
            ? 'Убираем ручные переходы и помогаем вовремя увидеть риск'
            : 'У каждой отрасли свои данные и своя цена задержки'
        }
        intro={
          solutions
            ? 'Начинаем с рабочего процесса и подбираем к нему интеграцию, расчёт или небольшой сервис. 1С и остальные системы продолжают делать свою часть работы.'
            : 'В опте, производстве, сервисе и торговле на маркетплейсах похожая проблема проявляется по-разному. Ниже — ситуации, с которых удобно начать разговор.'
        }
        note={
          solutions
            ? 'Состав решения зависит от ваших систем и качества данных. Сначала разбираем конкретный процесс.'
            : 'Описанные сценарии — примеры возможной работы, не опубликованные результаты клиентов.'
        }
      />
      <section className="inner-section">
        <div className="container">
          <div className="inner-section-head">
            <Eyebrow>{solutions ? 'НАПРАВЛЕНИЯ' : 'ЗНАКОМЫЕ СИТУАЦИИ'}</Eyebrow>
            <h2>
              {solutions ? 'Выберите задачу, которая ближе к вашей' : 'Где узнаёте свою работу?'}
            </h2>
          </div>
          <div className="overview-grid">
            {pages.map((page, index) => (
              <Link className="overview-card" to={page.path} key={page.path}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{page.label}</h3>
                <p>{page.intro}</p>
                <ArrowUpRight size={21} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <ContactBand text="Если не нашли точное название своей задачи, опишите процесс своими словами. Разберёмся вместе." />
    </PageFrame>
  )
}

export function SolutionsPage() {
  return <OverviewPage kind="solutions" />
}
export function IndustriesPage() {
  return <OverviewPage kind="industries" />
}

const approachSteps = [
  [
    'Показываете процесс',
    'Достаточно рассказать, как сотрудники работают сейчас, и показать один характерный пример.',
  ],
  [
    'Находим потерю времени или денег',
    'Разбираем переходы между людьми и системами. Отмечаем момент, когда ошибка становится дорогой.',
  ],
  [
    'Проверяем данные',
    'Смотрим, что уже хранится в 1С и соседних системах, где есть пробелы и как часто данные обновляются.',
  ],
  [
    'Проектируем небольшой первый шаг',
    'Определяем границы работы, ожидаемый результат и способ его проверить.',
  ],
  [
    'Внедряем на ограниченном участке',
    'Подключаем нужные системы и пользователей, обрабатываем реальные исключения.',
  ],
  [
    'Смотрим на эффект',
    'Сравниваем процесс до и после: ручные действия, задержки, ошибки и качество решения.',
  ],
  [
    'Расширяем при необходимости',
    'Следующий участок берём после того, как первый работает и понятен команде.',
  ],
]

export function ApproachPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="КАК РАБОТАЕМ"
        title="Начинаем с процесса, который уже мешает работать"
        intro="На первой встрече не нужна презентация проекта на десятки страниц. Лучше показать один реальный случай: где сотрудники ждут данные, дублируют работу или поздно узнают о проблеме."
        note="Сроки и стоимость обсуждаем после того, как понятны системы, данные и границы первого этапа."
      />
      <section className="inner-section">
        <div className="container">
          <div className="inner-section-head">
            <Eyebrow>ОТ РАЗГОВОРА ДО РЕЗУЛЬТАТА</Eyebrow>
            <h2>Семь понятных шагов</h2>
          </div>
          <ol className="approach-list">
            {approachSteps.map(([title, text], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <ChevronRight size={22} />
              </li>
            ))}
          </ol>
        </div>
      </section>
      <ContactBand text="Можете просто прислать описание процесса или показать, как он проходит на практике." />
    </PageFrame>
  )
}

export function AboutPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="КТО ЗА ЭТИМ СТОИТ"
        title="Я лично разбираю задачу и проектирую решение"
        intro="Меня зовут Сергей. Я системный аналитик, архитектор и разработчик. Помогаю компаниям связать 1С с остальными рабочими системами и убрать из процесса лишнюю ручную работу."
        note="Если задаче нужен узкий специалист, подключаю его к отдельному участку. Анализ, архитектуру и проверку результата веду сам."
      />
      <section className="inner-section">
        <div className="container about-detail-grid">
          <div>
            <Eyebrow>ОПЫТ В РАБОТЕ</Eyebrow>
            <h2>Знаю, как процесс выглядит по обе стороны интеграции</h2>
            <p>
              Больше 15 лет занимаюсь системным анализом. Более 10 лет работаю с backend-разработкой
              и интеграциями, 10 лет — с 1С, около 5 лет — с задачами ИИ. Среди проектов были
              сложные интеграции в крупном российском финтехе.
            </p>
            <p>
              Работал с УТ, ERP, БП и УПП. Для меня важны и устройство системы, и то, что сотруднику
              нужно сделать в конце рабочего дня.
            </p>
          </div>
          <div className="about-detail-card">
            <span>ОБЛАСТИ РАБОТЫ</span>
            <ul>
              <li>Системный анализ и архитектура</li>
              <li>1С и бизнес-логика конфигураций</li>
              <li>Backend и обмены между системами</li>
              <li>ИИ для документов и текста</li>
            </ul>
          </div>
        </div>
      </section>
      <ContactBand text="Покажите задачу, которая давно требует внимания. Скажу, с чего разумно начать." />
    </PageFrame>
  )
}

const scenarios = [
  {
    title: 'Заказ с убывающей маржой',
    path: '/industries/wholesale',
    text: 'Менеджер меняет скидку. Расчёт показывает влияние на прибыль до согласования условий.',
  },
  {
    title: 'Подорожавший материал',
    path: '/industries/manufacturing',
    text: 'Цена закупки изменилась. Команда видит, какой производственный заказ затронут.',
  },
  {
    title: 'Клиент с дорогими повторными выездами',
    path: '/industries/services',
    text: 'Выручка растёт, но вместе с ней растут затраты на обслуживание.',
  },
  {
    title: 'Товар с падающей экономикой',
    path: '/industries/marketplaces',
    text: 'Реклама и логистика сокращают маржу SKU быстрее, чем это видно в месячном отчёте.',
  },
]

export function CasesPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="ПРИМЕРЫ ЗАДАЧ"
        title="Как может выглядеть первый полезный сигнал"
        intro="Пока здесь собраны демонстрационные сценарии из разных процессов. Они показывают ход работы и возможный интерфейс. Реальные клиентские кейсы опубликуем только с подтверждёнными данными и разрешением компаний."
        note="Показатели в примерах учебные. Их нельзя считать результатами внедрений Altacod."
      />
      <section className="inner-section">
        <div className="container">
          <div className="inner-section-head">
            <Eyebrow>СЦЕНАРИИ</Eyebrow>
            <h2>Четыре ситуации, которые стоит замечать раньше</h2>
          </div>
          <div className="overview-grid">
            {scenarios.map((item, index) => (
              <Link className="overview-card" to={item.path} key={item.path}>
                <span>ПРИМЕР {String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <ArrowUpRight size={21} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <ContactBand text="Если похожий случай уже был у вас, покажите его. Разберём причину на ваших данных." />
    </PageFrame>
  )
}

export function NotFoundPage() {
  return (
    <PageFrame>
      <section className="inner-hero">
        <div className="container">
          <Eyebrow>404</Eyebrow>
          <h1>Такой страницы нет</h1>
          <p>Возможно, адрес изменился. Начните с главной или посмотрите решения.</p>
          <Link className="button button--primary" to="/">
            На главную <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </PageFrame>
  )
}
