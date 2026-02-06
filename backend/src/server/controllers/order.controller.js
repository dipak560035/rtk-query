// import { User } from '../models/User.js'
// import { Order } from '../models/Order.js'
// import { Product } from '../models/Product.js'

// export async function placeOrder(req, res, next) {
//   try {
//     const user = await User.findById(req.user._id).populate('cart.product')
//     const bodyItems = Array.isArray(req.body.items) ? req.body.items : []
//     if (!user.cart.length && !bodyItems.length) {
//       return res.status(400).json({ success: false, message: 'Cart is empty' })
//     }
//     let total = 0
//     let items = []
//     if (user.cart.length) {
//       items = user.cart.map((i) => {
//         total += i.qty * i.price
//         return {
//           product: i.product._id,
//           name: i.product.name,
//           price: i.price,
//           qty: i.qty,
//           image: i.product.images?.[0]?.url || ''
//         }
//       })
//     } else {
//       const productIds = bodyItems.map((i) => i.product)
//       const products = await Product.find({ _id: { $in: productIds } })
//       const map = new Map(products.map((p) => [String(p._id), p]))
//       for (const i of bodyItems) {
//         const p = map.get(String(i.product))
//         if (!p) {
//           return res.status(400).json({ success: false, message: 'Invalid product in order items' })
//         }
//         if (i.qty > p.stock) {
//           return res.status(400).json({ success: false, message: 'Insufficient stock for one or more products' })
//         }
//         total += Number(i.qty) * Number(p.price)
//         items.push({
//           product: p._id,
//           name: p.name,
//           price: p.price,
//           qty: Number(i.qty),
//           image: p.images?.[0]?.url || ''
//         })
//       }
//     }
//     const order = await Order.create({
//       user: user._id,
//       items,
//       total,
//       shippingAddress: req.body.shippingAddress || {}
//     })
//     if (user.cart.length) {
//       for (const i of user.cart) {
//         await Product.findByIdAndUpdate(i.product, { $inc: { stock: -i.qty } })
//       }
//       user.cart = []
//       await user.save()
//     } else {
//       for (const i of items) {
//         await Product.findByIdAndUpdate(i.product, { $inc: { stock: -i.qty } })
//       }
//     }
//     res.status(201).json({ success: true, data: order })
//   } catch (err) {
//     next(err)
//   }
// }

// export async function getMyOrders(req, res, next) {
//   try {
//     const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
//     res.json({ success: true, data: orders })
//   } catch (err) {
//     next(err)
//   }
// }

// export async function getOrderById(req, res, next) {
//   try {
//     const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
//     if (!order) return res.status(404).json({ success: false, message: 'Order not found' })
//     res.json({ success: true, data: order })
//   } catch (err) {
//     next(err)
//   }
// }

// export async function cancelOrder(req, res, next) {
//   try {
//     const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
//     if (!order) return res.status(404).json({ success: false, message: 'Order not found' })

//     // Prevent cancelling after shipped/delivered (optional rule)
//     if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
//       return res.status(400).json({ success: false, message: `Cannot cancel ${order.status} order` })
//     }

//     order.status = 'cancelled'
//     await order.save()

//     // Restore product stock
//     for (const item of order.items) {
//       await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.qty } })
//     }

//     res.json({ success: true, message: 'Order cancelled', data: order })
//   } catch (err) {
//     next(err)
//   }
// }


// export async function adminGetAllOrders(req, res, next) {
//   try {
//     const orders = await Order.find().sort({ createdAt: -1 })
//     res.json({ success: true, data: orders })
//   } catch (err) {
//     next(err)
//   }
// }

// export async function adminUpdateOrderStatus(req, res, next) {
//   try {
//     const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
//     if (!order) return res.status(404).json({ success: false, message: 'Order not found' })
//     res.json({ success: true, data: order })
//   } catch (err) {
//     next(err)
//   }
// }

































import { Order } from '../models/Order.js'
import { Cart } from '../models/cart.js'
import { Product } from '../models/Product.js'

export const placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product')

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' })
    }

    let total = 0
    const items = []

    for (const item of cart.items) {
      const product = item.product

      if (item.qty > product.stock) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`
        })
      }

      total += product.price * item.qty

      items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        qty: item.qty,
        image: product.images?.[0]?.url || ''
      })
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      total,
      shippingAddress: req.body.shippingAddress || {}
    })

    // reduce stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.qty }
      })
    }

    cart.items = []
    await cart.save()

    res.status(201).json({ success: true, data: order })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* ================= USER ================= */

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })

  res.json({ success: true, data: orders })
}

export const getOrderById = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id
  })

  if (!order) {
    return res.status(404).json({ message: 'Order not found' })
  }

  res.json({ success: true, data: order })
}

export const cancelOrder = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id
  })

  if (!order) {
    return res.status(404).json({ message: 'Order not found' })
  }

  if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
    return res.status(400).json({
      message: `Cannot cancel ${order.status} order`
    })
  }

  order.status = 'cancelled'
  await order.save()

  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.qty }
    })
  }

  res.json({ success: true, message: 'Order cancelled' })
}

/* ================= ADMIN ================= */

export const adminGetAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })

  res.json({ success: true, data: orders })
}

export const adminUpdateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  )

  if (!order) {
    return res.status(404).json({ message: 'Order not found' })
  }

  res.json({ success: true, data: order })
}
