
import { Cart } from "../models/cart.js";
import Order from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";

/* ================================
   PLACE ORDER
================================ */
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const shipping = req.body.shippingAddress || {};
    const paymentMethod = req.body.paymentMethod || "COD";

    /* ------------------------------
       Validate Shipping First
    ------------------------------ */
    if (
      !shipping.firstName ||
      !shipping.lastName ||
      !shipping.phone ||
      !shipping.line1 ||
      !shipping.city ||
      !shipping.postalCode ||
      !shipping.country
    ) {
      return res.status(400).json({
        message: "All required shipping fields must be provided",
      });
    }

    /* ------------------------------
       Get Cart (Logged User)
    ------------------------------ */
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product"
    );

    let items = [];
    let total = 0;

    /* ------------------------------
       CASE 1: Cart exists
    ------------------------------ */
    if (cart && cart.items.length > 0) {
      for (const item of cart.items) {
        const product = item.product;

        if (!product) {
          return res
            .status(400)
            .json({ message: "Product not found in cart" });
        }

        if (item.qty > product.stock) {
          return res.status(400).json({
            message: `Insufficient stock for ${product.name}`,
          });
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
    }
    /* ------------------------------
       CASE 2: Guest order (body items)
    ------------------------------ */
    else {
      const bodyItems = Array.isArray(req.body.items)
        ? req.body.items
        : [];

      if (!bodyItems.length) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      const productIds = bodyItems.map((i) => i.product);
      const products = await Product.find({
        _id: { $in: productIds },
      });

      const productMap = new Map(
        products.map((p) => [String(p._id), p])
      );

      for (const item of bodyItems) {
        const product = productMap.get(String(item.product));

        if (!product) {
          return res
            .status(400)
            .json({ message: "Invalid product in order" });
        }

        if (item.qty > product.stock) {
          return res.status(400).json({
            message: `Insufficient stock for ${product.name}`,
          });
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
    }

    /* ------------------------------
       Create Order
    ------------------------------ */
    const order = await Order.create({
      user: userId,
      items,
      total,
      paymentMethod,
      shippingAddress: {
        firstName: shipping.firstName,
        lastName: shipping.lastName,
        phone: shipping.phone,
        line1: shipping.line1,
        line2: shipping.line2 || "",
        city: shipping.city,
        state: shipping.state || "",
        postalCode: shipping.postalCode,
        country: shipping.country,
      },
      status: "pending",
    });

    /* ------------------------------
       Reduce Stock
    ------------------------------ */
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty },
      });
    }

    /* ------------------------------
       Clear Cart
    ------------------------------ */
    if (cart && cart.items.length > 0) {
      cart.items = [];
      await cart.save();
    }

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error("Place order error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/* ================================
   GET MY ORDERS
================================ */
export const getMyOrders = async (req, res) => {
  try {
    // If user is admin, they might expect to see all orders or just theirs.
    // Based on user request "admin cannot acess all the user order make it possible", 
    // we will return ALL orders if the user is admin.
    if (req.user && req.user.role === 'admin') {
      return adminGetAllOrders(req, res);
    }

    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================================
   GET ORDER BY ID
================================ */
export const getOrderById = async (req, res) => {
  try {
    let order
    if (req.user && req.user.role === 'admin') {
      order = await Order.findById(req.params.id).populate(
        'items.product',
        'name price images'
      ).populate('user', 'name email phone')
    } else {
      order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate(
        'items.product',
        'name price images'
      )
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Sanitize for admin if user is missing
    let data = order.toObject();
    if (req.user && req.user.role === 'admin' && !data.user) {
      data.user = {
        _id: null,
        name: "Unknown User",
        email: "N/A"
      }
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================================
   CANCEL ORDER
================================ */
export const cancelOrder = async (req, res) => {
  try {
    let order
    if (req.user && req.user.role === 'admin') {
      order = await Order.findById(req.params.id)
    } else {
      order = await Order.findOne({ _id: req.params.id, user: req.user._id })
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (["shipped", "delivered", "cancelled"].includes(order.status)) {
      return res
        .status(400)
        .json({ message: `Cannot cancel ${order.status} order` });
    }

    order.status = "cancelled";
    await order.save();

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.qty },
      });
    }

    res.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================================
   ADMIN - GET ALL ORDERS
================================ */
// export const adminGetAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("user", "name email") // Keeping phone optional if not in schema, but prompt said "name email phone"
//       .populate("items.product", "name price images")
//       .sort({ createdAt: -1 });

//     // Sanitize orders to ensure user is never null for frontend safety
//     const sanitizedOrders = orders.map(order => {
//       const orderObj = order.toObject();
//       if (!orderObj.user) {
//         orderObj.user = {
//           _id: null,
//           name: "Unknown User (Deleted)",
//           email: "N/A",
//           phone: "N/A"
//         };
//       }
//       return orderObj;
//     });

//     res.json({ success: true, data: sanitizedOrders });
//   } catch (error) {
//     console.error("Admin get all orders error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// /* ================================
//    ADMIN - UPDATE ORDER STATUS
// ================================ */
// export const adminUpdateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     const validStatuses = [
//       "pending",
//       "paid",
//       "processing",
//       "shipped",
//       "delivered",
//       "cancelled",
//     ];

//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ message: "Invalid order status" });
//     }

//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     )
//       .populate("user", "name email phone")
//       .populate("items.product", "name price images");

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.json({
//       success: true,
//       data: !order.user ? {
//         ...order.toObject(),
//         user: { _id: null, name: "Unknown User", email: "N/A" }
//       } : order
//     });
//   } catch (error) {
//     console.error("Admin update order status error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
export const adminGetAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Admin get all orders error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};






// export const adminUpdateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     const validStatuses = [
//       "pending",
//       "paid",
//       "processing",
//       "shipped",
//       "delivered",
//       "cancelled",
//     ];

//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ message: "Invalid order status" });
//     }

//     const order = await Order.findById(req.params.id);
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     // Only prevent cancelling shipped/delivered
//     if (status === "cancelled" && ["shipped", "delivered"].includes(order.status)) {
//       return res.status(400).json({ message: `Cannot cancel an order already ${order.status}` });
//     }

//     // Update status
//     order.status = status;

//     // Automatically update flags
//     if (status === "delivered") {
//       order.isDelivered = true;
//       order.deliveredAt = new Date();
//     }
//     if (status === "paid") {
//       order.isPaid = true;
//       order.paidAt = new Date();
//     }

//     await order.save();

//     await order.populate("user", "name email phone")
//                .populate("items.product", "name price images");

//     res.json({ success: true, data: order });
//   } catch (error) {
//     console.error("Admin update order status error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };




// ================================
// ADMIN - UPDATE ORDER STATUS (FULLY ENABLED)
// ================================
export const adminUpdateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Allowed statuses
    const validStatuses = [
      "pending",
      "paid",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    // Validate status
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    // Find order by ID
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Admin can now change any status including shipped/delivered
    order.status = status;

    // Automatically update flags
    order.isPaid = status === "paid" ? true : order.isPaid;
    order.isDelivered = status === "delivered" ? true : order.isDelivered;
    if (status === "cancelled") {
      // Restore stock only if order was not shipped/delivered
      if (!order.isDelivered && !order.isShipped) {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.qty },
          });
        }
      }
    }

    await order.save();

    await order.populate("user", "name email phone").populate("items.product", "name price images");

    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Admin update order status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
