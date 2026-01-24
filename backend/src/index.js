import dotenv from 'dotenv'
dotenv.config()

import http from 'http'
import { app } from './server/app.js'
import { connectDB } from './server/config/db.js'

const PORT = process.env.PORT || 4000

;(async () => {
  try {
    await connectDB()
    const server = http.createServer(app)
    server.listen(PORT, () => {
      console.log(`HavenCraft API running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
})()

