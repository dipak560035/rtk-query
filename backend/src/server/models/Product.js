import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true }
  },
  { _id: false }
)

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
  },
  { timestamps: true, _id: false }
)

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    price: { type: Number, required: true },
    currency: { type: String, default: 'NPR' },
    category: { type: String, index: true },
    tags: [{ type: String, index: true }],
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    colors: [{ type: String }],
    sizes: [{ type: String }],
    images: [imageSchema],
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
)

productSchema.index({ name: 'text', description: 'text', tags: 'text' })

export const Product = mongoose.model('Product', productSchema)
