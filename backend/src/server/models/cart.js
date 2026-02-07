// import mongoose from 'mongoose'

// const cartItemSchema = new mongoose.Schema(
//   {
//     product: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Product',
//       required: true
//     },
//     qty: {
//       type: Number,
//       required: true,
//       min: 1,
//       default: 1
//     }
//   },
//   { _id: false }
// )

// const cartSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//       unique: true
//     },
//     items: {
//       type: [cartItemSchema],
//       default: []
//     }
//   },
//   { timestamps: true }
// )

// export const Cart = mongoose.model('Cart', cartSchema)






































import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // ensures one cart per user
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Static method to get or create cart for a user
cartSchema.statics.getCartByUser = async function (userId) {
  let cart = await this.findOne({ user: userId }).populate("items.product");
  if (!cart) {
    cart = await this.create({ user: userId, items: [] });
  }
  return cart;
};

export const Cart = mongoose.model("Cart", cartSchema);

