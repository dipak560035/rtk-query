// import mongoose from 'mongoose'
// import bcrypt from 'bcryptjs'

// const addressSchema = new mongoose.Schema(
//   {
//     line1: String,
//     line2: String,
//     city: String,
//     state: String,
//     postalCode: String,
//     country: String
//   },
//   { _id: false }
// )

// const cartItemSchema = new mongoose.Schema(
//   {
//     product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//     qty: { type: Number, default: 1, min: 1 },
//     price: { type: Number, required: true }
//   },
//   { _id: false }
// )

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true, lowercase: true },
//     password: { type: String, required: true, minlength: 6 },
//     role: { type: String, enum: ['user', 'admin'], default: 'user' },
//     avatar: { type: String, default: '' },
//     addresses: [addressSchema],
//     cart: [cartItemSchema]
//   },
//   { timestamps: true }
// )

// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next()
//   const salt = await bcrypt.genSalt(10)
//   this.password = await bcrypt.hash(this.password, salt)
//   next()
// })

// userSchema.methods.comparePassword = async function (candidate) {
//   return bcrypt.compare(candidate, this.password)
// }

// export const User = mongoose.model('User', userSchema)

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const addressSchema = new mongoose.Schema(
  {
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  { _id: false }
)

const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, default: 1, min: 1 },
    price: { type: Number, required: true }
  },
  { _id: false }
)

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: { type: String, default: '' },
    addresses: [addressSchema],
    cart: [cartItemSchema],
    // ===== Add for password reset =====
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  { timestamps: true }
)

// Hash password on create or update
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Compare password during login
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

// Generate a reset token and expiry
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex')
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000 // 10 minutes
  return resetToken
}

export const User = mongoose.model('User', userSchema)
