import { createContactServer, mailTransportFromEnv } from './contact.mjs'

const transport = mailTransportFromEnv()
const server = createContactServer({
  sendMail: (message) => transport.sendMail(message),
  from: process.env.MAIL_FROM,
  to: process.env.MAIL_TO,
})
server.listen(Number(process.env.PORT || 3000), '0.0.0.0')
