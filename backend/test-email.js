import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import nodemailer from 'nodemailer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env explicitly
dotenv.config({ path: path.join(__dirname, '.env') })


console.log('--- Email Test Script ---')
console.log('Use explicit .env path:', path.join(__dirname, '.env'))
console.log('SMTP_USER:', process.env.SMTP_USER)
console.log('SMTP_PASS length:', process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0)
console.log('SMTP_HOST:', process.env.SMTP_HOST)
console.log('SMTP_PORT:', process.env.SMTP_PORT)

async function testEmail() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('❌ Missing SMTP_USER or SMTP_PASS in .env')
    return
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })

  try {
    console.log('Verifying connection...')
    await transporter.verify()
    console.log('✅ SMTP Connection Verified!')

    console.log('Sending test email...')
    const info = await transporter.sendMail({
      from: `"Test Script" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to self
      subject: 'Test Email from Nodemailer',
      text: 'If you see this, email sending is working!',
      html: '<b>If you see this, email sending is working!</b>'
    })

    console.log('✅ Email sent successfully!')
    console.log('Message ID:', info.messageId)
  } catch (err) {
    console.error('❌ Error occurred:', err)
  }
}

testEmail()
