import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'

import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js'
import orderRoutes from './routes/order.routes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5180'
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
    optionsSuccessStatus: 200
  })
)
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))

const uploadsDir = process.env.UPLOAD_DIR || 'uploads'
app.use('/uploads', express.static(path.join(__dirname, '../../', uploadsDir)))

app.get('/', (req, res) => {
  res.json({
    success: true,
    name: 'HavenCraft API',
    baseUrl: req.protocol + '://' + req.get('host'),
    endpoints: ['/health', '/auth/*', '/products', '/cart/*', '/orders/*']
  })
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/auth', authRoutes)
app.use('/products', productRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export { app }
