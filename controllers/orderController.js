import Order from "../models/Order.js"


export const getOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id).populate([
      {
        path: 'products.product',
        model: 'Product'
      }
    ]);
    return res.status(200).json({
      status: 'success',
      order
    })
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message
    })
  }
}


// export const getOrders = async (req, res) => {

//   try {
//     if (req.role === 'admin') {
//       const orders = await Order.find({}).populate([
//         {
//           path: 'products.product',
//           model: 'Product'
//         },
//         {
//           path: 'userId',
//           model: 'User',
//           select: '-password'
//         }
//       ]);
//       return res.status(200).json({
//         status: 'success',
//         orders
//       });

//     } else {


//       const orders = await Order.find({ userId: req.userId }).populate([
//         {
//           path: 'products.product',
//           model: 'Product'
//         }
//       ]);
//       return res.status(200).json({
//         status: 'success',
//         orders
//       })

//     }


//   } catch (err) {
//     return res.status(500).json({
//       status: 'error',
//       message: err.message
//     })
//   }

// }





export const getOrders = async (req, res) => {
  try {
    if (req.role === "admin") {
      const orders = await Order.find({})
        .populate([
          { path: "items.product", model: "Product" },
          { path: "userId", model: "User", select: "-password" }
        ]);

      return res.status(200).json({
        status: "success",
        orders
      });
    } else {
      const orders = await Order.find({ userId: req.userId })
        .populate([
          { path: "items.product", model: "Product" }
        ]);

      return res.status(200).json({
        status: "success",
        orders
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};



export const createOrder = async (req, res) => {
  const { total, items } = req.body ?? {};
  try {
    const order = await Order.create({
      total,
      userId: req.userId,
      items
    });
    return res.status(201).json({
      status: "success",
      message: "Order created successfully",
      order
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};


export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // e.g. { status: "shipped" }

    const order = await Order.findByIdAndUpdate(id, updates, { new: true });

    if (!order) {
      return res.status(404).json({ status: "error", message: "Order not found" });
    }

    return res.status(200).json({ status: "success", order });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

// export const cancelOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({
//         status: "error",
//         message: "Order not found",
//       });
//     }

//     // Only order owner can cancel
//     if (order.user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         status: "error",
//         message: "Not authorized to cancel this order",
//       });
//     }

//     // Check if already completed or cancelled
//     if (order.status === "completed") {
//       return res.status(400).json({
//         status: "error",
//         message: "Completed orders cannot be cancelled",
//       });
//     }

//     if (order.status === "cancelled") {
//       return res.status(400).json({
//         status: "error",
//         message: "Order is already cancelled",
//       });
//     }

//     // Update status
//     order.status = "cancelled";
//     await order.save();

//     return res.status(200).json({
//       status: "success",
//       message: "Order cancelled successfully",
//     });

//   } catch (err) {
//     return res.status(500).json({
//       status: "error",
//       message: err.message,
//     });
//   }
// };
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found"
      });
    }

    // Only allow the owner of the order (or admin) to cancel
    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({
        status: "error",
        message: "You are not allowed to cancel this order"
      });
    }

    // Update order status
    order.status = "cancelled";
    await order.save();

    return res.status(200).json({
      status: "success",
      message: "Order cancelled successfully",
      order
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};


export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    await order.deleteOne();

    return res.status(200).json({
      status: "success",
      message: "Order deleted successfully",
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};




export const cancelOrderByAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    // Admin can cancel any order, except already completed/cancelled
    if (order.status === "completed" || order.status === "cancelled") {
      return res.status(400).json({
        status: "error",
        message: `Cannot cancel order with status "${order.status}"`,
      });
    }

    order.status = "cancelled";
    await order.save();

    return res.status(200).json({
      status: "success",
      message: "Order cancelled by admin",
      order,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};








