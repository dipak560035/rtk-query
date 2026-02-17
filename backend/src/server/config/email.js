// import nodemailer from 'nodemailer'

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || 'smtp.gmail.com',
//   port: Number(process.env.SMTP_PORT) || 587,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   }

// })
// console.log(process.env.SMTP_USER)
// console.log(process.env.SMTP_PASS ? "PASS LOADED" : "PASS MISSING")

// export async function sendEmail({ to, subject, html }) {
//   const from = process.env.EMAIL_FROM || '"HavenCraft" <dipaksah2070@gmail.com>'
//   return transporter.sendMail({ from, to, subject, html })
// }




import nodemailer from 'nodemailer'



// Create Nodemailer transporter lazily or ensure env is loaded
let transporter = null

export const getTransporter = () => {
  if (!transporter) {
    const {
      SMTP_HOST = 'smtp.gmail.com',
      SMTP_PORT = 587,
      SMTP_USER,
      SMTP_PASS,
      NODE_ENV = 'development'
    } = process.env

    if (!SMTP_USER || !SMTP_PASS) {
      console.warn('⚠️ SMTP_USER or SMTP_PASS is missing. Emails will fail until set in .env')
    }

    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465, // true for port 465, false for 587
      auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
      tls: {
        rejectUnauthorized: NODE_ENV === 'production'
      }
    })
  }
  return transporter
}

// Verify transporter on server start
export async function verifyEmailConnection() {
  try {
    const transport = getTransporter()
    await transport.verify()
    console.log('✅ SMTP ready to send emails')
  } catch (err) {
    console.error('❌ SMTP connection failed:', err.message)
  }
}

// Send email helper
export async function sendEmail({ to, subject, html, text }) {
  if (!to) throw new Error('Recipient email missing')
  if (!subject) throw new Error('Email subject missing')
  if (!html && !text) throw new Error('Email body missing')

  try {
    const { EMAIL_FROM = 'HavenCraft <homies2080@gmail.com>', NODE_ENV = 'development' } = process.env
    const transport = getTransporter() // Ensure initialized

    const info = await transport.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '') // fallback plain text
    })

    if (NODE_ENV !== 'production') {
      console.log(`📧 Email sent to ${to}`)
      console.log(`MessageId: ${info.messageId}`)
    }

    return info
  } catch (error) {
    console.error('❌ Email send failed:', error.message)
    throw error
  }
}










