// import dotenv from 'dotenv'
// dotenv.config()

// import http from 'http'
// import { app } from './server/app.js'
// import { connectDB } from './server/config/db.js'

// const PREFERRED = Number(process.env.PORT || 4001)
// const CANDIDATE_PORTS = [PREFERRED, PREFERRED + 1, PREFERRED + 2]

// ;(async () => {
//   try {
//     await connectDB()
//     for (const p of CANDIDATE_PORTS) {
//       const server = http.createServer(app)
//       try {
//         await new Promise((resolve, reject) => {
//           server.once('error', reject)
//           server.listen(p, () => resolve())
//         })
//         console.log(`HavenCraft API running on http://localhost:${p}`)
//         return
//       } catch (e) {
//         if (e.code !== 'EADDRINUSE') {
//           throw e
//         }
//       }
//     }
//     throw new Error('No available port to start server')
//   } catch (err) {
//     console.error('Failed to start server:', err)
//     process.exit(1)
//   }
// })()




import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import http from 'http'
import { app } from './server/app.js'
import { connectDB } from './server/config/db.js'

// =====================================
// FIX for ES modules: proper __dirname
// =====================================
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env explicitly (guarantees it works in ES modules)
dotenv.config({ path: path.join(__dirname, '../.env') })

// Optional debug
console.log('SMTP_USER:', process.env.SMTP_USER)
console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'PASS LOADED' : 'PASS MISSING')

// =====================================
// PORT CONFIG
// =====================================
const PREFERRED = Number(process.env.PORT || 4001)
const CANDIDATE_PORTS = [PREFERRED, PREFERRED + 1, PREFERRED + 2]

// =====================================
// START SERVER
// =====================================
;(async () => {
  try {
    // Connect to MongoDB
    await connectDB()
    console.log('MongoDB connected')

    // Try multiple ports if preferred is busy
    for (const p of CANDIDATE_PORTS) {
      const server = http.createServer(app)
      try {
        await new Promise((resolve, reject) => {
          server.once('error', reject)
          server.listen(p, () => resolve())
        })
        console.log(`HavenCraft API running on http://localhost:${p}`)
        return
      } catch (e) {
        if (e.code !== 'EADDRINUSE') {
          throw e
        }
        console.warn(`Port ${p} in use, trying next...`)
      }
    }

    throw new Error('No available port to start server')
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
})()
