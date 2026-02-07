

// import { Cart } from '../models/cart.js'
// import Order from '../models/Order.js'
// import { Product } from '../models/Product.js'

// export const placeOrder = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ user: req.user._id })
//       .populate('items.product')

//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({ message: 'Cart is empty' })
//     }

//     let total = 0
//     const items = []

//     for (const item of cart.items) {
//       const product = item.product

//       if (item.qty > product.stock) {
//         return res.status(400).json({
//           message: `Not enough stock for ${product.name}`
//         })
//       }

//       total += product.price * item.qty

//       items.push({
//         product: product._id,
//         name: product.name,
//         price: product.price,
//         qty: item.qty,
//         image: product.images?.[0]?.url || ''
//       })
//     }

//     const order = await Order.create({
//       user: req.user._id,
//       items,
//       total,
//       shippingAddress: req.body.shippingAddress || {}
//     })

//     // reduce stock
//     for (const item of cart.items) {
//       await Product.findByIdAndUpdate(item.product._id, {
//         $inc: { stock: -item.qty }
//       })
//     }

//     cart.items = []
//     await cart.save()

//     res.status(201).json({ success: true, data: order })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// }

// /* ================= USER ================= */

// export const getMyOrders = async (req, res) => {
//   const orders = await Order.find({ user: req.user._id })
//     .sort({ createdAt: -1 })

//   res.json({ success: true, data: orders })
// }

// export const getOrderById = async (req, res) => {
//   const order = await Order.findOne({
//     _id: req.params.id,
//     user: req.user._id
//   })

//   if (!order) {
//     return res.status(404).json({ message: 'Order not found' })
//   }

//   res.json({ success: true, data: order })
// }

// export const cancelOrder = async (req, res) => {
//   const order = await Order.findOne({
//     _id: req.params.id,
//     user: req.user._id
//   })

//   if (!order) {
//     return res.status(404).json({ message: 'Order not found' })
//   }

//   if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
//     return res.status(400).json({
//       message: `Cannot cancel ${order.status} order`
//     })
//   }

//   order.status = 'cancelled'
//   await order.save()

//   for (const item of order.items) {
//     await Product.findByIdAndUpdate(item.product, {
//       $inc: { stock: item.qty }
//     })
//   }

//   res.json({ success: true, message: 'Order cancelled' })
// }

// /* ================= ADMIN ================= */

// // export const adminGetAllOrders = async (req, res) => {
// //   const orders = await Order.find()
// //     .populate('user', 'name email')
// //     .sort({ createdAt: -1 })

// //   res.json({ success: true, data: orders })
// // }
// export const adminGetAllOrders = async (req, res) => {
//   const orders = await Order.find()
//     .populate('user', 'name email phone')
//     .sort({ createdAt: -1 })

//   res.json({ success: true, data: orders })
// }


// export const adminUpdateOrderStatus = async (req, res) => {
//   const order = await Order.findByIdAndUpdate(
//     req.params.id,
//     { status: req.body.status },
//     { new: true }
//   )

//   if (!order) {
//     return res.status(404).json({ message: 'Order not found' })
//   }

//   res.json({ success: true, data: order })
// }



















// import { Cart } from '../models/cart.js'
// import Order from '../models/Order.js'
// import { Product } from '../models/Product.js'


// /* ================= USER ================= */

// // Place a new order
// export const placeOrder = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ user: req.user._id }).populate(
//       "items.product"
//     );

//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({ message: "Cart is empty" });
//     }

//     let total = 0;
//     const items = [];

//     for (const item of cart.items) {
//       const product = item.product;

//       if (!product) {
//         return res
//           .status(400)
//           .json({ message: `Product not found in cart` });
//       }

//       if (item.qty > product.stock) {
//         return res.status(400).json({
//           message: `Not enough stock for ${product.name}`,
//         });
//       }

//       total += product.price * item.qty;

//       items.push({
//         product: product._id,
//         name: product.name,
//         price: product.price,
//         qty: item.qty,
//         image: product.images?.[0]?.url || "",
//       });
//     }

//     const order = await Order.create({
//       user: req.user._id,
//       items,
//       total,
//       shippingAddress: req.body.shippingAddress || {},
//     });

//     // Reduce stock
//     for (const item of cart.items) {
//       await Product.findByIdAndUpdate(item.product._id, {
//         $inc: { stock: -item.qty },
//       });
//     }

//     // Clear cart
//     cart.items = [];
//     await cart.save();

//     res.status(201).json({ success: true, data: order });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get all orders of logged-in user
// export const getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user._id })
//       .sort({ createdAt: -1 })
//       .populate("items.product", "name price images");

//     res.json({ success: true, data: orders });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get order by ID for logged-in user
// export const getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findOne({
//       _id: req.params.id,
//       user: req.user._id,
//     }).populate("items.product", "name price images");

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.json({ success: true, data: order });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Cancel order
// export const cancelOrder = async (req, res) => {
//   try {
//     const order = await Order.findOne({
//       _id: req.params.id,
//       user: req.user._id,
//     });

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     if (["shipped", "delivered", "cancelled"].includes(order.status)) {
//       return res.status(400).json({
//         message: `Cannot cancel ${order.status} order`,
//       });
//     }

//     order.status = "cancelled";
//     await order.save();

//     // Restore stock
//     for (const item of order.items) {
//       await Product.findByIdAndUpdate(item.product, {
//         $inc: { stock: item.qty },
//       });
//     }

//     res.json({ success: true, message: "Order cancelled" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ================= ADMIN ================= */

// // Get all orders (Admin)
// export const adminGetAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("user", "name email phone")
//       .populate("items.product", "name price images")
//       .sort({ createdAt: -1 });

//     res.json({ success: true, data: orders });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Update order status (Admin)
// export const adminUpdateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     if (!["pending", "paid", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     ).populate("user", "name email phone")
//      .populate("items.product", "name price images");

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.json({ success: true, data: order });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };







































import { Cart } from '../models/cart.js';
import Order from '../models/Order.js'
import { Product } from '../models/Product.js'

/* ================= USER ================= */

// Place a new order


export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;
    const items = [];

    for (const item of cart.items) {
      const product = item.product;
      if (!product) {
        return res.status(400).json({ message: `Product not found in cart` });
      }

      if (item.qty > product.stock) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      total += product.price * item.qty;

      items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        qty: item.qty,
        image: product.images?.[0]?.url || "",
      });
    }

    // Validate shippingAddress
    const shipping = req.body.shippingAddress;
    if (
      !shipping ||
      !shipping.firstName ||
      !shipping.lastName ||
      !shipping.address ||
      !shipping.city ||
      !shipping.phone
    ) {
      return res.status(400).json({ message: "Missing required shipping address fields" });
    }

    // Create order
    const order = await Order.create({
      user: userId,
      items,
      total,
      shippingAddress: {
        firstName: shipping.firstName,
        lastName: shipping.lastName,
        phone: shipping.phone,
        line1: shipping.address,
        line2: shipping.province || "",
        city: shipping.city,
        state: shipping.province || "",
        postalCode: shipping.zip || "",
        country: shipping.country || "",
        email: shipping.email || "",
      },
      paymentMethod: req.body.paymentMethod || "bank",
    });

    // Reduce stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.qty } });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    return res.status(201).json({ success: true, data: order });
  } catch (err) {
    console.error("Place order error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// export const placeOrder = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({ message: "Cart is empty" });
//     }

//     let total = 0;
//     const items = [];

//     for (const item of Cart.items) {
//       const product = item.product;

//       if (!product) {
//         return res.status(400).json({ message: `Product not found in cart` });
//       }

//       if (item.qty > product.stock) {
//         return res.status(400).json({ message: `Not enough stock for ${product.name}` });
//       }

//       total += product.price * item.qty;

//       items.push({
//         product: product._id,
//         name: product.name,
//         price: product.price,
//         qty: item.qty,
//         image: product.images?.[0]?.url || "",
//       });
//     }

//     // Validate and map shippingAddress fields
//     const { shippingAddress, paymentMethod } = req.body;

//     if (
//       !shippingAddress ||
//       !shippingAddress.firstName ||
//       !shippingAddress.lastName ||
//       !shippingAddress.address ||
//       !shippingAddress.city ||
//       !shippingAddress.phone
//     ) {
//       return res.status(400).json({ message: "Missing required shipping address fields" });
//     }

//     const order = await Order.create({
//       user: req.user._id,
//       items,
//       total,
//       shippingAddress: {
//         firstName: shippingAddress.firstName,
//         lastName: shippingAddress.lastName,
//         phone: shippingAddress.phone,
//         line1: shippingAddress.address,
//         line2: shippingAddress.province || "",
//         city: shippingAddress.city,
//         state: shippingAddress.province || "",
//         postalCode: shippingAddress.zip || "",
//         country: shippingAddress.country || "",
//         email: shippingAddress.email || "",
//       },
//       paymentMethod: paymentMethod || "bank",
//     });

//     // Reduce stock for each product
//     for (const item of cart.items) {
//       await Product.findByIdAndUpdate(item.product._id, {
//         $inc: { stock: -item.qty },
//       });
//     }

//     // Clear user's cart
//     cart.items = [];
//     await cart.save();

//     res.status(201).json({ success: true, data: order });
//   } catch (err) {
//     console.error("Place order error:", err);
//     res.status(500).json({ message: "Internal server error", error: err.message });
//   }
// };

// Get all orders of logged-in user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name price images");

    res.json({ success: true, data: orders });
  } catch (err) {
    console.error("Get my orders error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get a single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("items.product", "name price images");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ success: true, data: order });
  } catch (err) {
    console.error("Get order by ID error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Cancel an order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (["shipped", "delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({ message: `Cannot cancel ${order.status} order` });
    }

    order.status = "cancelled";
    await order.save();

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.qty } });
    }

    res.json({ success: true, message: "Order cancelled successfully" });
  } catch (err) {
    console.error("Cancel order error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= ADMIN ================= */

// Get all orders for admin
export const adminGetAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (err) {
    console.error("Admin get all orders error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update order status (admin)
export const adminUpdateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("user", "name email phone")
      .populate("items.product", "name price images");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ success: true, data: order });
  } catch (err) {
    console.error("Admin update order status error:", err);
    res.status(500).json({ message: err.message });
  }
};
