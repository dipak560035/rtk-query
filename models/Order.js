// import mongoose from "mongoose";


// const orderSchema = new mongoose.Schema({
// totalAmount : {
//     type: Number,
//     required:true
// },
// userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref:'User',
//     required:true
// },
//  products: {
//     type: [{
//       product: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product',
//         required: true
//       },
//       quantity: {
//         type: Number,
//         required: true
//       }
//     }
//     ],
//     required: true,
//     validate: {
//       validator: function (v) {
//         return v.length > 0;
//       },
//       message: "Order must contain at least one product."
//     }
//   },

// },{timestamps : true});


// const Order = mongoose.model('Order',orderSchema);

// export default Order;


















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
    status: { type: String, enum: ["pending", "paid", "shipped"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);