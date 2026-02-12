import slugify from 'slugify'
import { Product } from '../models/Product.js'
import fs from "fs";
import path from "path";
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
export async function createProduct(req, res, next) {
  try {
    const { name, description, price, category, tags, stock, colors, sizes, featured } = req.body
    const slug = slugify(name, { lower: true })

    // Extract files from req.files and map to images array
    const images = (req.files || []).map((file) => ({
      url: `/uploads/${file.filename}`
    }))

    const product = await Product.create({
      name,
      slug,
      description,
      price,
      category,
      tags: tags ? [].concat(tags) : [],
      stock,
      colors: colors ? [].concat(colors) : [],
      sizes: sizes ? [].concat(sizes) : [],
      images,
      featured: featured === 'true' || featured === true
    })

    res.status(201).json({ success: true, data: product })
  } catch (err) {
    next(err)
  }
}

export async function getProducts(req, res, next) {
  try {
    const { q, category, minPrice, maxPrice, sort = 'createdAt', order = 'desc', page = 1, limit = 20, tag, featured } = req.query
    const filter = {}
    if (q) filter.$text = { $search: q }
    if (category) filter.category = category
    if (tag) filter.tags = tag
    if (typeof featured !== 'undefined') filter.featured = featured === 'true' || featured === true
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }
    const skip = (Number(page) - 1) * Number(limit)
    const sortObj = { [sort]: order === 'asc' ? 1 : -1 }
    const [items, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter)
    ])
    res.json({ success: true, data: items, pagination: { total, page: Number(page), limit: Number(limit) } })
  } catch (err) {
    next(err)
  }
}

export async function getProductById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
    res.json({ success: true, data: product })
  } catch (err) {
    next(err)
  }
}



export async function updateProduct(req, res, next) {
  try {
    const existingProduct = await Product.findById(req.params.id)
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    const updates = { ...req.body }

    // Update slug if name changes
    if (updates.name) {
      updates.slug = slugify(updates.name, { lower: true })
    }

    // 1. Determine which images to keep (from existing ones)
    let finalImages = []
    let imagesToKeep = []

    if (req.body.existingImages) {
      try {
        // Parse the list of image URLs that should be kept
        const parsedExisting = typeof req.body.existingImages === 'string'
          ? JSON.parse(req.body.existingImages)
          : req.body.existingImages

        // Ensure we only keep images that actually belonged to this product
        imagesToKeep = existingProduct.images.filter(img =>
          parsedExisting.some(keep => (typeof keep === 'string' ? keep === img.url : keep.url === img.url))
        )
      } catch (err) {
        console.error('Error parsing existingImages:', err)
        imagesToKeep = existingProduct.images // Fallback to keeping all if parse fails
      }
    } else if (req.files && req.files.length > 0) {
      // If new files are uploaded but NO existingImages list provided, 
      // we assume the user wants to keep the current ones and add new ones
      // (Common behavior for simple "add more" UI)
      imagesToKeep = existingProduct.images
    } else {
      // No new files and no existingImages list -> keep everything
      imagesToKeep = existingProduct.images
    }

    // 2. Delete images from disk that are NOT in the keep list
    const imagesToDelete = existingProduct.images.filter(
      img => !imagesToKeep.some(keep => keep.url === img.url)
    )

    imagesToDelete.forEach((img) => {
      const filename = img.url.replace('/uploads/', '')
      const filePath = path.join(process.cwd(), 'uploads', filename)
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath)
        } catch (err) {
          console.error(`Failed to delete old image: ${filePath}`, err)
        }
      }
    })

    // 3. Add new uploaded images
    let newImages = []
    if (req.files && req.files.length > 0) {
      newImages = req.files.map((file) => ({
        url: `/uploads/${file.filename}`
      }))
    }

    // 4. Combine kept images and new uploads
    finalImages = [...imagesToKeep, ...newImages]
    
    // Limit to 5 images total (safety check)
    updates.images = finalImages.slice(0, 5)

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updates, { new: true })

    res.json({ success: true, data: updatedProduct })
  } catch (err) {
    next(err)
  }
}


export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
    res.json({ success: true, message: 'Product deleted' })
  } catch (err) {
    next(err)
  }
}

export const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body
  const product = await Product.findById(req.params.id)
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
  const alreadyReviewed = product.reviews?.some((r) => String(r.user) === String(req.user._id))
  if (alreadyReviewed) return res.status(400).json({ success: false, message: 'Product already reviewed' })
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  }
  product.reviews = [...(product.reviews || []), review]
  product.numReviews = product.reviews.length
  const avg = product.reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0) / product.numReviews
  product.rating = Math.round(avg * 10) / 10
  await product.save()
  res.status(201).json({ success: true, data: { review }, meta: { rating: product.rating, numReviews: product.numReviews } })
})
