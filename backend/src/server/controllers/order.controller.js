import { User } from '../models/User.js'
import { Order } from '../models/Order.js'
import { Product } from '../models/Product.js'

export async function placeOrder(req, res, next) {
  try {
    const user = await User.findById(req.user._id).populate('cart.product')
    if (!user.cart.length) return res.status(400).json({ success: false, message: 'Cart is empty' })
    let total = 0
    const items = user.cart.map((i) => {
      total += i.qty * i.price
      return {
        product: i.product._id,
        name: i.product.name,
        price: i.price,
        qty: i.qty,
        image: i.product.images?.[0]?.url || ''
      }
    })
    const order = await Order.create({
      user: user._id,
      items,
      total,
      shippingAddress: req.body.shippingAddress || {}
    })
    // reduce stock
    for (const i of user.cart) {
      await Product.findByIdAndUpdate(i.product, { $inc: { stock: -i.qty } })
    }
    user.cart = []
    await user.save()
    res.status(201).json({ success: true, data: order })
  } catch (err) {
    next(err)
  }
}

export async function getMyOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json({ success: true, data: orders })
  } catch (err) {
    next(err)
  }
}

export async function getOrderById(req, res, next) {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })
    res.json({ success: true, data: order })
  } catch (err) {
    next(err)
  }
}

export async function adminGetAllOrders(req, res, next) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json({ success: true, data: orders })
  } catch (err) {
    next(err)
  }
}

export async function adminUpdateOrderStatus(req, res, next) {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })
    res.json({ success: true, data: order })
  } catch (err) {
    next(err)
  }
}

