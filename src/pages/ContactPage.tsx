import { useState, type FormEvent } from 'react'
import { ArrowUpRight, Mail } from 'lucide-react'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { createLeadMailto, type LeadDraft } from '../lib/contact'

const systemOptions = ['1С', 'Excel', 'CRM', 'Сайт', 'Маркетплейсы', 'Другое']

export function ContactPage() {
  const [systems, setSystems] = useState<string[]>([])
  const [draftUrl, setDraftUrl] = useState('')
  const [fileName, setFileName] = useState('')

  function toggleSystem(system: string) {
    setSystems((current) =>
      current.includes(system) ? current.filter((item) => item !== system) : [...current, system],
    )
    setDraftUrl('')
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const draft: LeadDraft = {
      name: String(data.get('name') || ''),
      company: String(data.get('company') || ''),
      contact: String(data.get('contact') || ''),
      process: String(data.get('process') || ''),
      systems,
      goal: String(data.get('goal') || ''),
    }
    setDraftUrl(createLeadMailto(draft))
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Перейти к содержанию
      </a>
      <Header />
      <Breadcrumbs />
      <main id="main">
        <section className="inner-hero contact-hero">
          <div className="container contact-page-grid">
            <div>
              <span className="inner-eyebrow">
                <span />
                КОНТАКТ
              </span>
              <h1>Покажите процесс, который хочется улучшить</h1>
              <p>
                Напишите, где сотрудники переносят данные руками, ждут обмена между системами или
                поздно узнают о потере денег. Можно рассказать своими словами — подробное
                техническое задание для первого разговора не нужно.
              </p>
              <div className="contact-direct">
                <Mail size={20} />
                <div>
                  <span>Можно написать напрямую</span>
                  <a href="mailto:info@altacod.com?subject=%D0%97%D0%B0%D0%B4%D0%B0%D1%87%D0%B0%20%D0%BF%D0%BE%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8">
                    info@altacod.com
                  </a>
                </div>
              </div>
            </div>
            <aside className="inner-hero-note">
              <span>ЧТО ПОМОЖЕТ НАЧАТЬ</span>
              <p>
                Один конкретный пример: откуда пришли данные, кто их переносил и где возникла
                задержка. Этого достаточно, чтобы задать первые вопросы.
              </p>
            </aside>
          </div>
        </section>
        <section className="inner-section">
          <div className="container contact-form-grid">
            <div className="inner-section-head">
              <span className="inner-eyebrow">
                <span />
                ОПИСАТЬ ЗАДАЧУ
              </span>
              <h2>Соберите письмо за пару минут</h2>
              <p>
                Поля ниже сформируют черновик письма в вашей почтовой программе. Сообщение
                отправится только после вашего подтверждения.
              </p>
            </div>
            <form className="lead-form" onSubmit={onSubmit} onChange={() => setDraftUrl('')}>
              <div className="lead-row">
                <label>
                  Ваше имя <input name="name" required autoComplete="name" />
                </label>
                <label>
                  Компания <span className="field-optional">необязательно</span>
                  <input name="company" autoComplete="organization" />
                </label>
              </div>
              <label>
                Как с вами связаться{' '}
                <input
                  name="contact"
                  required
                  placeholder="Почта или телефон"
                  autoComplete="email"
                />
              </label>
              <label>
                Как процесс устроен сейчас{' '}
                <textarea
                  name="process"
                  required
                  rows={5}
                  placeholder="Например: заказ приходит на почту, затем менеджер переносит его в 1С…"
                />
              </label>
              <fieldset>
                <legend>Какие системы участвуют?</legend>
                <div className="lead-checkboxes">
                  {systemOptions.map((system) => (
                    <label key={system}>
                      <input
                        type="checkbox"
                        checked={systems.includes(system)}
                        onChange={() => toggleSystem(system)}
                      />
                      {system}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label>
                Что хотелось бы изменить{' '}
                <textarea
                  name="goal"
                  required
                  rows={4}
                  placeholder="Как должен выглядеть удобный процесс?"
                />
              </label>
              <label>
                Файл с примером <span className="field-optional">необязательно</span>
                <input
                  type="file"
                  onChange={(event) => setFileName(event.target.files?.[0]?.name || '')}
                />
              </label>
              {fileName && (
                <p className="lead-file-note">
                  Файл «{fileName}» нужно будет приложить к письму вручную. Сайт не загружает его на
                  сервер.
                </p>
              )}
              <button className="button button--primary" type="submit">
                Подготовить письмо <ArrowUpRight size={18} />
              </button>
              {draftUrl && (
                <div className="lead-ready" role="status">
                  <p>
                    Черновик готов. Откройте его в почтовой программе и проверьте перед отправкой.
                  </p>
                  <a className="button button--outline" href={draftUrl}>
                    Открыть письмо <ArrowUpRight size={17} />
                  </a>
                </div>
              )}
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
