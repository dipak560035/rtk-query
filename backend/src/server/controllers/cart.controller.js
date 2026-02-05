// import { User } from '../models/User.js'
// import { Product } from '../models/Product.js'

// export async function getCart(req, res, next) {
//   try {
//     const user = await User.findById(req.user._id).populate('cart.product')
//     res.json({ success: true, data: user.cart })
//   } catch (err) {
//     next(err)
//   }
// }

// export async function addToCart(req, res, next) {
//   try {
//     const { productId, qty = 1 } = req.body
//     const product = await Product.findById(productId)
//     if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
//     const user = await User.findById(req.user._id)
//     const existing = user.cart.find((i) => i.product.toString() === productId)
//     if (existing) {
//       existing.qty += Number(qty)
//       existing.price = product.price
//     } else {
//       user.cart.push({ product: product._id, qty: Number(qty), price: product.price })
//     }
//     await user.save()
//     res.status(201).json({ success: true, data: user.cart })
//   } catch (err) {
//     next(err)
//   }
// }

// export async function updateCartItem(req, res, next) {
//   try {
//     const { productId, qty } = req.body
//     const user = await User.findById(req.user._id)
//     const item = user.cart.find((i) => i.product.toString() === productId)
//     if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart' })
//     item.qty = Number(qty)
//     await user.save()
//     res.json({ success: true, data: user.cart })
//   } catch (err) {
//     next(err)
//   }
// }

// export async function removeCartItem(req, res, next) {
//   try {
//     const { productId } = req.params
//     const user = await User.findById(req.user._id)
//     user.cart = user.cart.filter((i) => i.product.toString() !== productId)
//     await user.save()
//     res.json({ success: true, data: user.cart })
//   } catch (err) {
//     next(err)
//   }
// }

// export async function clearCart(req, res, next) {
//   try {
//     const user = await User.findById(req.user._id)
//     user.cart = []
//     await user.save()
//     res.json({ success: true, data: [] })
//   } catch (err) {
//     next(err)
//   }
// }































import { Cart } from '../models/cart.js'
import { Product } from '../models/Product.js'


export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
    .populate('items.product')

  res.json(cart || { items: [] })
}

export const addToCart = async (req, res) => {
  const { productId, qty = 1 } = req.body

  const product = await Product.findById(productId)
  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }

  let cart = await Cart.findOne({ user: req.user._id })
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] })
  }

  const item = cart.items.find(
    i => i.product.toString() === productId
  )

  if (item) {
    item.qty += qty
  } else {
    cart.items.push({ product: productId, qty })
  }

  await cart.save()
  res.json(cart)
}

export const updateCartItem = async (req, res) => {
  const { productId, qty } = req.body

  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart) return res.status(404).json({ message: 'Cart not found' })

  const item = cart.items.find(
    i => i.product.toString() === productId
  )

  if (!item) {
    return res.status(404).json({ message: 'Item not in cart' })
  }

  item.qty = qty
  await cart.save()
  res.json(cart)
}

export const removeCartItem = async (req, res) => {
  const { productId } = req.params

  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart) return res.status(404).json({ message: 'Cart not found' })

  cart.items = cart.items.filter(
    i => i.product.toString() !== productId
  )

  await cart.save()
  res.json(cart)
}

export const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart) return res.json({ items: [] })

  cart.items = []
  await cart.save()
  res.json(cart)
}
