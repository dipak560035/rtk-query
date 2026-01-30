import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { Product } from '../models/Product'

const uploadDir = process.env.UPLOAD_DIR || 'uploads'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir)
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname)
//     const base = path.basename(file.originalname, ext)
//     cb(null, `${base}-${Date.now()}${ext}`)
//   }
// })
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    // 🔥 Delete old images BEFORE saving new ones
    if (req.params.id) {
      const product = await Product.findById(req.params.id);
      if (product?.images?.length) {
        product.images.forEach((img) => {
          const filename = img.url.replace("/uploads/", "");
          const filePath = path.join(process.cwd(), "uploads", filename);

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }
    }

    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

function fileFilter(req, file, cb) {
  if (/image\/(png|jpg|jpeg|webp)$/i.test(file.mimetype)) cb(null, true)
  else cb(new Error('Only image files are allowed'))
}

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } })

