import { createServer } from 'node:http'
import path from 'node:path'
import busboy from 'busboy'
import nodemailer from 'nodemailer'

export const MAX_FILE_BYTES = 10 * 1024 * 1024
const MAX_BODY_BYTES = MAX_FILE_BYTES + 256 * 1024
const ALLOWED_TYPES = new Set([
  'image/jpeg', 'image/png', 'application/pdf', 'text/plain', 'text/csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
])

export function validEmail(value) {
  return typeof value === 'string' && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function httpError(status, message) {
  return Object.assign(new Error(message), { status })
}

export function parseLead(request) {
  return new Promise((resolve, reject) => {
    let parser
    try {
      parser = busboy({
        headers: request.headers,
        limits: { fileSize: MAX_FILE_BYTES, files: 1, fields: 8, parts: 9, fieldSize: 4000 },
      })
    } catch {
      reject(httpError(400, 'Ожидается форма с файлом'))
      return
    }

    const fields = Object.create(null)
    let attachment
    let problem
    let total = 0
    const fail = (error) => { problem ||= error }

    parser.on('field', (name, value, info) => {
      if (info.valueTruncated || info.nameTruncated || Object.hasOwn(fields, name)) {
        fail(httpError(400, 'Некорректные поля формы'))
      } else {
        fields[name] = value
      }
    })
    parser.on('file', (name, stream, info) => {
      // Browsers include an empty file part when the optional input is untouched.
      if (name === 'attachment' && !info.filename) {
        stream.resume()
        return
      }
      if (name !== 'attachment' || !ALLOWED_TYPES.has(info.mimeType)) {
        fail(httpError(400, 'Неподдерживаемый формат файла'))
      }
      const chunks = []
      stream.on('data', (chunk) => { if (!problem) chunks.push(chunk) })
      stream.on('limit', () => fail(httpError(413, 'Файл больше 10 МБ')))
      stream.on('end', () => {
        if (stream.truncated || !info.filename) return
        attachment = {
          filename: path.basename(info.filename).replace(/[\r\n]/g, '').slice(0, 150),
          content: Buffer.concat(chunks),
          contentType: info.mimeType,
        }
      })
    })
    for (const event of ['partsLimit', 'fieldsLimit', 'filesLimit']) {
      parser.on(event, () => fail(httpError(400, 'Слишком много полей формы')))
    }
    parser.on('error', () => fail(httpError(400, 'Не удалось прочитать форму')))
    request.on('error', () => fail(httpError(400, 'Соединение прервано')))
    request.on('data', (chunk) => {
      total += chunk.length
      if (total > MAX_BODY_BYTES) {
        fail(httpError(413, 'Форма слишком большая'))
        request.unpipe(parser)
        request.resume()
        reject(problem)
      }
    })
    parser.on('close', () => {
      if (problem) return reject(problem)
      const lead = {
        name: fields.name?.trim(),
        company: fields.company?.trim() || '',
        contact: fields.contact?.trim(),
        process: fields.process?.trim(),
        systems: fields.systems?.trim() || '',
        goal: fields.goal?.trim(),
        website: fields.website?.trim() || '',
        attachment,
      }
      if (!lead.name || lead.name.length > 120 || !validEmail(lead.contact) ||
          !lead.process || !lead.goal || lead.process.length > 4000 ||
          lead.goal.length > 4000 || lead.company.length > 160 || lead.systems.length > 200) {
        return reject(httpError(400, 'Проверьте обязательные поля и адрес почты'))
      }
      resolve(lead)
    })
    request.pipe(parser)
  })
}

export function messageForLead(lead, from, to) {
  return {
    from,
    to,
    replyTo: lead.contact,
    subject: 'Задача по автоматизации — заявка с сайта',
    text: [
      `Имя: ${lead.name}`,
      ...(lead.company ? [`Компания: ${lead.company}`] : []),
      `Адрес для ответа: ${lead.contact}`,
      `Системы: ${lead.systems || 'Не указаны'}`,
      '',
      'Как процесс устроен сейчас:', lead.process,
      '',
      'Что хотелось бы изменить:', lead.goal,
    ].join('\n'),
    attachments: lead.attachment ? [lead.attachment] : [],
  }
}

export function mailTransportFromEnv(env = process.env) {
  const required = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD', 'MAIL_FROM', 'MAIL_TO']
  for (const key of required) if (!env[key]) throw new Error(`Не задано ${key}`)
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT || 465),
    secure: true,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
  })
}

export function createContactServer({ sendMail, from, to, now = () => Date.now() }) {
  const recent = new Map()
  return createServer(async (request, response) => {
    const respond = (status, body) => {
      response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
      response.end(JSON.stringify(body))
    }
    if (request.url === '/health' && request.method === 'GET') return respond(200, { ok: true })
    if (request.url !== '/api/contact' || request.method !== 'POST') return respond(404, { error: 'Not found' })
    if (request.headers.origin && request.headers.origin !== 'https://altacod.com') {
      return respond(403, { error: 'Недопустимый источник запроса' })
    }
    const address = request.socket.remoteAddress || 'unknown'
    const hits = (recent.get(address) || []).filter((time) => now() - time < 60 * 60 * 1000)
    if (hits.length >= 12) return respond(429, { error: 'Слишком много обращений. Попробуйте позже.' })
    try {
      const lead = await parseLead(request)
      if (lead.website) return respond(200, { ok: true })
      await sendMail(messageForLead(lead, from, to))
      hits.push(now())
      recent.set(address, hits)
      return respond(200, { ok: true })
    } catch (error) {
      if (!error.status) console.error('Не удалось отправить обращение:', error.message)
      return respond(error.status || 503, { error: error.status ? error.message : 'Не удалось отправить обращение. Попробуйте позже.' })
    }
  })
}
