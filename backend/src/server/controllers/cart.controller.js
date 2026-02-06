

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
