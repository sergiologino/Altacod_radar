import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Check,
  ChevronRight,
  CircleDot,
  Database,
  FileText,
  Mail,
  MoveUpRight,
  ScanSearch,
  Sparkles,
} from 'lucide-react'
import { Footer } from '../components/Footer'
import { FlowDiagram } from '../components/FlowDiagram'
import { Header } from '../components/Header'
import { pains, process, solutions } from '../data/content'

const RadarWidget = lazy(() =>
  import('../components/RadarWidget').then((module) => ({ default: module.RadarWidget })),
)

function SectionLabel({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <div className={`section-label${light ? ' section-label--light' : ''}`}>
      <span />
      {children}
    </div>
  )
}

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span className="eyebrow-line" /> Автоматизация малого бизнеса вокруг 1С
          </div>
          <h1>
            Если сотрудники переносят данные между 1С, Excel и другими системами вручную —{' '}
            <span>это можно автоматизировать.</span>
          </h1>
          <p className="hero-description">
            Связываем 1С с сайтом, CRM, почтой и другими рабочими системами. Где приходится делать
            что-то руками, создаём небольшой сервис под ваш процесс. А данные помогают заметить
            финансовый риск, пока ещё можно повлиять на решение.
          </p>
          <div className="hero-actions">
            <Link className="button button--primary" to="/contact">
              Показать свой процесс <ArrowUpRight size={18} />
            </Link>
            <a className="text-link" href="#pains">
              Посмотреть примеры <ArrowDown size={17} />
            </a>
          </div>
          <div className="hero-note">
            <span className="hero-note-mark">
              <Check size={14} />
            </span>{' '}
            Ваша 1С остаётся основой учёта; недостающую логику добавляем рядом.
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-visual-orbit hero-visual-orbit--one" />
          <div className="hero-visual-orbit hero-visual-orbit--two" />
          <FlowDiagram />
          <span className="hero-visual-caption">
            Заявки попадают в 1С, а важные сигналы доходят до руководителя.
          </span>
        </div>
      </div>
    </section>
  )
}

function PainSection() {
  return (
    <section className="section pain-section" id="pains">
      <div className="container">
        <div className="section-heading heading-split">
          <div>
            <SectionLabel>ЗНАКОМЫЕ СИТУАЦИИ</SectionLabel>
            <h2>
              Узнаёте свой
              <br />
              <span>бизнес?</span>
            </h2>
          </div>
          <p>
            Информация есть в 1С, CRM и таблицах. Сотрудникам всё равно приходится собирать её
            руками; о рисках часто узнают с опозданием.
          </p>
        </div>
        <div className="pain-grid">
          {pains.map((pain) => (
            <article className="pain-card" key={pain.number}>
              <div className="pain-card-top">
                <span>{pain.number} / СИМПТОМ</span>
                <CircleDot size={16} />
              </div>
              <h3>{pain.title}</h3>
              <p>{pain.text}</p>
              <span className="pain-card-line" />
            </article>
          ))}
        </div>
        <div className="pain-footnote">
          <span className="footnote-spark">✳</span>
          <strong>
            Так бывает, когда компания уже выросла из Excel, а большая ERP для неё пока избыточна.
          </strong>
        </div>
      </div>
    </section>
  )
}

function SolutionsSection() {
  return (
    <section className="section solutions-section" id="solutions">
      <div className="container">
        <div className="statement">
          <SectionLabel>НАШ ПОДХОД</SectionLabel>
          <h2>
            Поможем 1С и остальным системам
            <br />
            <span>работать вместе.</span>
          </h2>
          <p>
            У вас уже есть 1С, CRM, сайт, Excel и внешние сервисы. Разберём, где между ними теряются
            данные или время, свяжем нужные части и добавим логику под ваш процесс. Внедрение ещё
            одной большой системы часто не требуется.
          </p>
        </div>
        <div className="solutions-intro">
          <span>ЧТО МЫ ДЕЛАЕМ</span>
          <span>01 — 04</span>
        </div>
        <div className="solutions-grid">
          {solutions.map(({ number, href, icon: Icon, title, text }) => (
            <Link className="solution-card" to={href} key={number}>
              <div className="solution-card-top">
                <span>{number}</span>
                <Icon size={23} strokeWidth={1.65} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="solution-card-arrow">
                <MoveUpRight size={20} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function RadarSection() {
  return (
    <section className="radar-section" id="radar">
      <div className="container">
        <div className="radar-section-head">
          <div>
            <SectionLabel light>ALTACOD RADAR</SectionLabel>
            <h2>
              Узнать о проблеме <span>до того, как деньги уже потеряны.</span>
            </h2>
          </div>
          <p>
            Отчёты помогают разобраться, что уже произошло. Radar задуман для момента, когда решение
            ещё впереди: он показывает риск, его причину и возможное действие.
          </p>
        </div>
        <div className="radar-demo-label">
          <span>
            <span className="radar-demo-dot" /> ИНТЕРАКТИВНЫЙ МАКЕТ
          </span>
          <span>Выберите сигнал или измените скидку в заказе</span>
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
        <div className="radar-bottom">
          <div className="radar-bottom-note">
            <span>СУТЬ ПОДХОДА</span>
            <strong>Когда появляется риск, видно его причину и следующий шаг.</strong>
          </div>
          <Link to="/solutions/radar">
            Подробнее о Radar <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

function OneCSection() {
  return (
    <section className="section one-c-section" id="one-c">
      <div className="container one-c-grid">
        <div className="one-c-copy">
          <SectionLabel>ОПОРА НА ТО, ЧТО УЖЕ ЕСТЬ</SectionLabel>
          <h2>
            1С остаётся
            <br />
            <span>ядром учёта.</span>
          </h2>
          <p>
            1С уже ведёт учёт вашего бизнеса. Мы берём из неё нужные данные и добавляем небольшие
            сервисы там, где типового функционала не хватает.
          </p>
          <div className="one-c-tags">
            <span>УТ</span>
            <span>ERP</span>
            <span>БП</span>
            <span>УПП</span>
          </div>
          <div className="one-c-note">
            <Check size={18} />
            <span>Работаем с API и разбираемся в бизнес-логике конфигураций 1С.</span>
          </div>
          <Link className="text-link" to="/1c">
            Подробнее о работе с 1С <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="one-c-diagram">
          <span className="diagram-title">РАБОЧАЯ АРХИТЕКТУРА</span>
          <div className="diagram-core">
            <div className="core-logo">1С</div>
            <div>
              <strong>Ваш учёт остаётся на месте</strong>
              <span>Заказы · товары · оплаты · документы</span>
            </div>
          </div>
          <div className="diagram-flow-line">
            <span />
            <span />
            <span />
          </div>
          <div className="diagram-branches">
            <div>
              <Database size={20} />
              <strong>Данные</strong>
              <span>Из существующих систем</span>
            </div>
            <div>
              <Braces size={20} />
              <strong>Логика</strong>
              <span>Под ваш процесс</span>
            </div>
            <div>
              <ScanSearch size={20} />
              <strong>Сигналы</strong>
              <span>Когда нужен ответ</span>
            </div>
          </div>
          <div className="diagram-result">
            <span className="result-dot" /> Без двойного ввода и отдельного учёта
          </div>
        </div>
      </div>
    </section>
  )
}

function AISection() {
  return (
    <section className="section ai-section" id="ai">
      <div className="container ai-grid">
        <div className="ai-art">
          <div className="ai-art-top">
            <span>ПРИМЕР ПРОЦЕССА / 01</span>
            <span className="ai-art-spark">
              <Sparkles size={17} />
            </span>
          </div>
          <div className="ai-pipeline">
            <div className="pipeline-step">
              <span>
                <Mail size={20} />
              </span>
              <div>
                <small>ВХОДЯЩИЕ ДАННЫЕ</small>
                <strong>Письмо с заказом</strong>
              </div>
            </div>
            <div className="pipeline-connector" />
            <div className="pipeline-step pipeline-step--ai">
              <span>
                <Sparkles size={20} />
              </span>
              <div>
                <small>ИИ + ПРОВЕРКА ПРАВИЛ</small>
                <strong>Позиции и реквизиты</strong>
              </div>
            </div>
            <div className="pipeline-connector" />
            <div className="pipeline-step">
              <span>
                <FileText size={20} />
              </span>
              <div>
                <small>РЕЗУЛЬТАТ</small>
                <strong>Черновик заказа в 1С</strong>
              </div>
              <Check size={19} className="pipeline-check" />
            </div>
          </div>
          <div className="ai-art-bottom">
            <span>ИИ разбирает сложные данные</span>
            <span>Человек подтверждает результат</span>
          </div>
        </div>
        <div className="ai-copy">
          <SectionLabel>ИИ НА СВОЁМ МЕСТЕ</SectionLabel>
          <h2>
            ИИ может работать <span>под капотом.</span>
          </h2>
          <p>
            Он разберёт письмо, сопоставит номенклатуру, прочитает документ или объяснит аномалию.
            Результат попадёт в привычную бизнес-систему, где с ним продолжат работать люди.
          </p>
          <div className="ai-rule">
            <span>
              <Braces size={19} />
            </span>
            <div>
              <strong>Финансовые показатели считаем по правилам.</strong>
              <p>
                Себестоимость, прибыль и маржу считаем по заранее заданным формулам. ИИ помогает
                понять текст и объяснить полученный результат.
              </p>
            </div>
          </div>
          <Link className="text-link" to="/solutions/ai">
            Где помогает ИИ <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  )
}

function ApproachSection() {
  return (
    <section className="section approach-section" id="approach">
      <div className="container">
        <div className="section-heading heading-split">
          <div>
            <SectionLabel>КАК РАБОТАЕМ</SectionLabel>
            <h2>
              Начнём с процесса,
              <br />
              <span>который обходится дорого.</span>
            </h2>
          </div>
          <p>
            Для первого разговора достаточно показать, как он устроен сейчас. Затем проверим данные
            и предложим небольшой этап работы.
          </p>
        </div>
        <div className="process-grid">
          {process.map((item) => (
            <article className="process-step" key={item.number}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <ChevronRight className="process-chevron" size={22} />
            </article>
          ))}
        </div>
        <Link className="text-link" to="/approach">
          Все шаги работы <ArrowUpRight size={17} />
        </Link>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section className="about-section" id="about">
      <div className="container about-grid">
        <div>
          <SectionLabel>КТО ЗА ЭТИМ СТОИТ</SectionLabel>
          <h2>
            Лично разбираю задачу
            <br />
            <span>и проектирую решение.</span>
          </h2>
          <Link className="text-link" to="/about">
            Больше обо мне <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="about-card">
          <div className="about-avatar" aria-hidden="true">
            С
          </div>
          <div>
            <strong>Сергей</strong>
            <span>Системный аналитик · архитектор · разработчик</span>
            <p>
              15+ лет занимаюсь системным анализом, больше 10 лет — backend-разработкой и
              интеграциями. С 1С работаю 10 лет: УТ, ERP, БП, УПП. Если для задачи нужен узкий
              специалист, подключаю его к отдельной части работы. Анализ, архитектуру и проверку
              результата веду сам.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section className="contact-section" id="contact">
      <div className="container contact-grid">
        <div>
          <SectionLabel light>ДАВАЙТЕ НАЧНЁМ С ВАШЕЙ ЗАДАЧИ</SectionLabel>
          <h2>
            Покажите процесс,
            <br />
            <span>который хочется улучшить.</span>
          </h2>
          <p>
            Расскажите, где приходится переносить данные вручную или о какой проблеме узнаёте
            слишком поздно. Даже пара примеров из текущей работы поможет начать разговор.
          </p>
          <div className="contact-actions">
            <a
              className="button button--white"
              href="mailto:info@altacod.com?subject=%D0%97%D0%B0%D0%B4%D0%B0%D1%87%D0%B0%20%D0%BF%D0%BE%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8"
            >
              Написать о задаче <ArrowUpRight size={18} />
            </a>
            <span>Можно просто описать ситуацию своими словами</span>
          </div>
        </div>
        <div className="contact-card">
          <div>
            <span className="contact-card-icon">
              <CircleDot size={20} />
            </span>
            <span>С ЧЕГО НАЧАТЬ РАЗГОВОР</span>
          </div>
          <ul>
            <li>
              <span>01</span>Что сотрудники делают вручную?
            </li>
            <li>
              <span>02</span>Где сейчас хранятся данные?
            </li>
            <li>
              <span>03</span>Что должно измениться?
            </li>
          </ul>
          <div className="contact-card-foot">
            <span>1С · Excel · CRM · маркетплейсы</span>
            <ArrowRight size={18} />
          </div>
        </div>
      </div>
    </section>
  )
}

export function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Перейти к содержанию
      </a>
      <Header />
      <main id="main">
        <Hero />
        <PainSection />
        <SolutionsSection />
        <RadarSection />
        <OneCSection />
        <AISection />
        <ApproachSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
