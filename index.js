


// import express from 'express';
// import productRoutes from './routes/productRoutes.js';
// import userRouter from './routes/userRouter.js';
// import orderRoutes from './routes/orderRoutes.js'
// import mongoose from 'mongoose';
// import fileUpload from 'express-fileupload';
// import nodemailer from "nodemailer"; 
// import dotenv from 'dotenv';
// import cors from 'cors';
// const app = express();
// const port = 5000;

// dotenv.config();

// mongoose.connect(process.env.DB_URL).then((val)=>{
// app.listen(port, () => {
//   console.log(`connected and Server is running on port ${port}`);
// });
// }).catch((err)=>{
//   console.log(err);
// });

// //Middleware
// app.use(cors({
//   origin: ['https://mern-frontened.vercel.app','http://localhost:5174'],
//   credentials: true
// }));



// app.use(express.json()); 

// app.use(fileUpload({
//   limits: { fileSize: 5 * 1024 * 1024 },
// }));

// app.use(express.static('uploads'));

// const transporter = nodemailer.createTransport({
//   host : 'smtp.gmail.com',
//   port : 587,
//   secure: false,
//   auth: {
//     user: 'dipaksah2070@gmail.com',
//     pass: 'eolripudmiknyisy '
//   }
// })

// // Default route
// app.get('/', (req, res) => {
//   return res.status(200).json({
//     status: 'success',
//     data: 'hello jee welcome to Server'
//   });
// });
// app.post('/send-email', async (req, res) => {
//   const { to, subject, text } = req.body ?? {};
//   try {
//     const info = await transporter.sendMail({
//       from: '"Dipak sah" <dipaksah2070@gmail.com>',
//       to,
//       subject,
//       text
//     });
//     return res.status(200).json({
//       message: info
//     });

//   } catch (err) {
//     return res.status(500).json({
//       error: err.message
//     });

//   }
// });

// // Mount routers correctly

// // productRoutes uses "/products" inside → mount at "/api"
// app.use('/api', productRoutes);

// // userRoutes uses "/api/users" inside → mount at "/"
// app.use('/api/users', userRouter);

// // order routes — check what is inside (same rule)
// // app.use('/api/orders', orderRoutes);

// app.use(orderRoutes);













import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import nodemailer from "nodemailer";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// MongoDB connection
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB (NepalShop)");
    app.listen(port, () =>
      console.log(`🚀 Server running on http://localhost:${port}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err.message));

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5174", "https://mern-frontened.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(fileUpload({ limits: { fileSize: 5 * 1024 * 1024 } }));
app.use(express.static("uploads"));

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Default route
app.get("/", (req, res) => {
  res.status(200).json({ status: "success", data: "Welcome to NepalShop API" });
});

// Email route
app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body ?? {};
  try {
    const info = await transporter.sendMail({
      from: `"NepalShop" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    res.status(200).json({ message: info });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

