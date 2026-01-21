
// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";
// import fileUpload from "express-fileupload";
// import nodemailer from "nodemailer";

// // Routes
// import authRoutes from "./routes/authRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";

// dotenv.config();
// const app = express();
// const port = process.env.PORT || 5000;

// // MongoDB connection
// mongoose
//   .connect(process.env.DB_URL)
//   .then(() => {
//     console.log("✅ Connected to MongoDB (NepalShop)");
//     app.listen(port, () =>
//       console.log(`🚀 Server running on http://localhost:${port}`)
//     );
//   })
//   .catch((err) => console.error("MongoDB connection error:", err.message));

// // Middleware
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "https://mern-frontened.vercel.app"],
//     credentials: true,
//   })
// );
// app.use(express.json());
// app.use(fileUpload({ limits: { fileSize: 5 * 1024 * 1024 } }));
// app.use(express.static("uploads"));

// // Nodemailer setup
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Default route
// app.get("/", (req, res) => {
//   res.status(200).json({ status: "success", data: "Welcome to NepalShop API" });
// });

// // Email route
// app.post("/send-email", async (req, res) => {
//   const { to, subject, text } = req.body ?? {};
//   try {
//     const info = await transporter.sendMail({
//       from: `"NepalShop" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       text,
//     });
//     res.status(200).json({ message: info });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Mount routers
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);


































import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import nodemailer from "nodemailer";
import cookieParser from "cookie-parser";
import fs from "fs";
// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const app = express();

const port = process.env.PORT || 5000;
const uploadsDir = "./uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("✅ Created uploads folder");
}
// ===================
// MongoDB connection
// ===================
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("✅ Connected to MongoDB (NepalShop)"))
  .catch((err) => console.error("MongoDB connection error:", err.message));


app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://mern-frontened-git-ui-dipak560035s-projects.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Handle OPTIONS preflight for all routes


app.use(express.json());
app.use(cookieParser()); // required for cookies
// app.use(fileUpload({ limits: { fileSize: 5 * 1024 * 1024 } }));
// app.use(fileUpload({
//   useTempFiles: true,
//   tempFileDir: '/tmp/',
//   limits: { fileSize: 5 * 1024 * 1024 }
// }));
app.use(fileUpload({
  createParentPath: true, // automatically creates folder if needed
  limits: { fileSize: 5 * 1024 * 1024 },
  abortOnLimit: true,
}));


// app.use(express.static("uploads"));
app.use(express.static('uploads'));


// ===================
// Nodemailer setup
// ===================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ===================
// Default route
// ===================
app.get("/", (req, res) => {
  res.status(200).json({ status: "success", data: "Welcome to NepalShop API" });
});

// ===================
// Email route
// ===================
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

// ===================
// Mount routers
// ===================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// ===================
// Start server
// ===================
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
