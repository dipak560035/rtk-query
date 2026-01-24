import slugify from 'slugify'
import { Product } from '../models/Product.js'

export async function createProduct(req, res, next) {
  try {
    const { name, description, price, category, tags, stock, colors, sizes, featured } = req.body
    const slug = slugify(name, { lower: true })
    const images =
      (req.files || []).map((f) => ({
        url: `/uploads/${f.filename}`,
        alt: name
      })) || []
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
    const updates = { ...req.body }
    if (updates.name) updates.slug = slugify(updates.name, { lower: true })
    if (req.files && req.files.length) {
      updates.$push = { images: { $each: req.files.map((f) => ({ url: `/uploads/${f.filename}`, alt: updates.name || '' })) } }
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true })
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
    res.json({ success: true, data: product })
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
