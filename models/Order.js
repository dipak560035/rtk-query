
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    total: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,
        price: Number,
        quantity: { type: Number, required: true },
      },
    ],
    status: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);