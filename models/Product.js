
import mongoose from "mongoose";

export const categories = ["food", "clothes", "tech", "jewellery"];
export const brands = ["adidas", "samsung", "tanishq", "kfc", "iphone"];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true },
    category: { type: String, enum: categories, required: true },
    brand: { type: String, enum: brands, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);