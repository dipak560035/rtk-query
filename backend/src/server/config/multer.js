import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { Product } from '../models/Product.js'

const uploadDir = process.env.UPLOAD_DIR || 'uploads'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
    cb(null, uniqueName)
  }
})

function fileFilter(req, file, cb) {
  if (/image\/(png|jpg|jpeg|webp)$/i.test(file.mimetype)) cb(null, true)
  else cb(new Error('Only image files are allowed'))
}

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } })

