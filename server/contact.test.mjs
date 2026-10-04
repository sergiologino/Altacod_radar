import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { createContactServer, validEmail } from './contact.mjs'

const sent = []
const server = createContactServer({
  sendMail: async (message) => { sent.push(message) },
  from: 'noreply@altacod.com',
  to: 'info@altacod.com',
})
let base
before(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  base = `http://127.0.0.1:${server.address().port}`
})
after(() => server.close())

function form(contact = 'anna@example.com') {
  const data = new FormData()
  data.set('name', 'Анна')
  data.set('company', 'Тест')
  data.set('contact', contact)
  data.set('process', 'Переносим заказы вручную')
  data.set('systems', '1С, CRM')
  data.set('goal', 'Передавать автоматически')
  data.set('website', '')
  return data
}

test('проверяет адрес почты', () => {
  assert.equal(validEmail('anna@example.com'), true)
  assert.equal(validEmail('anna@'), false)
  assert.equal(validEmail('anna example.com'), false)
})

test('отправляет письмо от noreply на info, адрес посетителя ставит в Reply-To и прикладывает файл', async () => {
  const data = form()
  data.set('attachment', new File(['пример'], 'order.txt', { type: 'text/plain' }))
  const response = await fetch(`${base}/api/contact`, { method: 'POST', body: data })
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true })
  assert.equal(sent.length, 1)
  assert.equal(sent[0].from, 'noreply@altacod.com')
  assert.equal(sent[0].to, 'info@altacod.com')
  assert.equal(sent[0].replyTo, 'anna@example.com')
  assert.match(sent[0].text, /Системы: 1С, CRM/)
  assert.equal(sent[0].attachments[0].filename, 'order.txt')
  assert.equal(sent[0].attachments[0].content.toString(), 'пример')
})

test('принимает форму без выбранного необязательного файла', async () => {
  const data = form()
  data.set('attachment', new File([], '', { type: 'application/octet-stream' }))
  const response = await fetch(`${base}/api/contact`, { method: 'POST', body: data })
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true })
  assert.deepEqual(sent.at(-1).attachments, [])
})

test('не отправляет обращение с ошибочным адресом или неподдерживаемым файлом', async () => {
  const badEmail = await fetch(`${base}/api/contact`, { method: 'POST', body: form('не почта') })
  assert.equal(badEmail.status, 400)
  const data = form()
  data.set('attachment', new File(['<svg/>'], 'image.svg', { type: 'image/svg+xml' }))
  const badFile = await fetch(`${base}/api/contact`, { method: 'POST', body: data })
  assert.equal(badFile.status, 400)
  assert.equal(sent.length, 2)
})

test('отклоняет вложение больше 10 МБ', async () => {
  const data = form()
  data.set('attachment', new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'large.pdf', { type: 'application/pdf' }))
  const response = await fetch(`${base}/api/contact`, { method: 'POST', body: data })
  assert.equal(response.status, 413)
  assert.equal(sent.length, 2)
})

test('ограничивает заявки одного адреса, не блокируя других посетителей за общим прокси', async () => {
  let time = 0
  const limited = createContactServer({
    sendMail: async () => {},
    from: 'noreply@altacod.com', to: 'info@altacod.com',
    now: () => time,
  })
  await new Promise((resolve) => limited.listen(0, '127.0.0.1', resolve))
  const url = `http://127.0.0.1:${limited.address().port}/api/contact`
  try {
    for (let index = 0; index < 12; index += 1) {
      const response = await fetch(url, { method: 'POST', body: form() })
      assert.equal(response.status, 200)
    }
    assert.equal((await fetch(url, { method: 'POST', body: form() })).status, 429)
    assert.equal((await fetch(url, { method: 'POST', body: form('other@example.com') })).status, 200)
    time += 60 * 60 * 1000
    assert.equal((await fetch(url, { method: 'POST', body: form() })).status, 200)
  } finally {
    limited.close()
  }
})

test('не выдаёт успех при ошибке SMTP', async () => {
  const failing = createContactServer({
    sendMail: async () => { throw new Error('SMTP offline') },
    from: 'noreply@altacod.com', to: 'info@altacod.com',
  })
  await new Promise((resolve) => failing.listen(0, '127.0.0.1', resolve))
  try {
    const response = await fetch(`http://127.0.0.1:${failing.address().port}/api/contact`, {
      method: 'POST', body: form(),
    })
    assert.equal(response.status, 503)
    assert.match((await response.json()).error, /Не удалось отправить/)
  } finally {
    failing.close()
  }
})
