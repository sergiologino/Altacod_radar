import { useState, type FormEvent } from 'react'
import { ArrowUpRight, Mail } from 'lucide-react'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Breadcrumbs } from '../components/Breadcrumbs'

const systemOptions = ['1С', 'Excel', 'CRM', 'Сайт', 'Маркетплейсы', 'Другое']
const maxFileBytes = 10 * 1024 * 1024

export function ContactPage() {
  const [systems, setSystems] = useState<string[]>([])
  const [fileName, setFileName] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  function toggleSystem(system: string) {
    setSystems((current) =>
      current.includes(system) ? current.filter((item) => item !== system) : [...current, system],
    )
    setSent(false)
    setError('')
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const file = data.get('attachment')
    if (file instanceof File && file.size > maxFileBytes) {
      setError('Файл больше 10 МБ. Выберите файл поменьше.')
      return
    }
    data.set('systems', systems.join(', '))
    setSending(true)
    setError('')
    setSent(false)
    try {
      const response = await fetch('/api/contact', { method: 'POST', body: data })
      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(result?.error || 'Не удалось отправить обращение. Попробуйте позже.')
      }
      setSent(true)
      setFileName('')
      setSystems([])
      form.reset()
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Не удалось отправить обращение. Попробуйте позже.',
      )
    } finally {
      setSending(false)
    }
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
              <h2>Расскажите о задаче</h2>
              <p>
                Заполните форму — сообщение и приложенный файл придут нам на почту. Мы ответим на
                указанный адрес.
              </p>
            </div>
            <form
              className="lead-form"
              onSubmit={onSubmit}
              onChange={() => {
                setSent(false)
                setError('')
              }}
            >
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
                Почта для ответа{' '}
                <input
                  name="contact"
                  type="email"
                  required
                  placeholder="name@example.com"
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
                  name="attachment"
                  accept=".jpg,.jpeg,.png,.pdf,.txt,.csv,.docx,.xlsx"
                  onChange={(event) => setFileName(event.target.files?.[0]?.name || '')}
                />
              </label>
              {fileName && (
                <p className="lead-file-note">
                  Файл «{fileName}» приложится к обращению. Максимальный размер — 10 МБ.
                </p>
              )}
              <input
                className="lead-honeypot"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <button className="button button--primary" type="submit" disabled={sending}>
                {sending ? 'Отправляем…' : 'Отправить обращение'} <ArrowUpRight size={18} />
              </button>
              {error && (
                <p className="lead-error" role="alert">
                  {error}
                </p>
              )}
              {sent && (
                <div className="lead-ready" role="status">
                  <p>Обращение отправлено. Ответим на указанную почту.</p>
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
