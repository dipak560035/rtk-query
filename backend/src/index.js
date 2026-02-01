import dotenv from 'dotenv'
dotenv.config()

import http from 'http'
import { app } from './server/app.js'
import { connectDB } from './server/config/db.js'

const PREFERRED = Number(process.env.PORT || 4001)
const CANDIDATE_PORTS = [PREFERRED, PREFERRED + 1, PREFERRED + 2]

;(async () => {
  try {
    await connectDB()
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
      }
    }
    throw new Error('No available port to start server')
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
})()

