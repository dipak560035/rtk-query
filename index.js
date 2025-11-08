


import express from 'express';
import productRoutes from './routes/productRoutes.js';
import userRouter from './routes/userRouter.js';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
const app = express();
const port = 5000;

mongoose.connect('mongodb+srv://dipak:dipak123@cluster0.ysqeecm.mongodb.net/NewShop').then((val)=>{
app.listen(port, () => {
  console.log(`connected and Server is running on port ${port}`);
});
}).catch((err)=>{
  console.log(err);
});

// Middleware
app.use(express.json()); 

app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 },
}));

// Default route
app.get('/', (req, res) => {
  return res.status(200).json({
    status: 'success',
    data: 'hello jee welcome to Server'
  });
});

// Use routers with base paths
app.use(productRoutes);
app.use(userRouter);


// Start server




// import express from 'express';
// import productRoutes from './routes/productRoutes.js';
// import userRouter from './routes/userRouter.js';
// import mongoose from 'mongoose';
// import fileUpload from 'express-fileupload';

// const app = express();
// const port = 5000;

// // ✅ Database Connection
// mongoose.connect('mongodb+srv://dipak:dipak123@cluster0.ysqeecm.mongodb.net/NewShop')
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`✅ connected and Server is running on port ${port}`);
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// // ✅ Middlewares
// app.use(express.json()); // for raw JSON
// app.use(express.urlencoded({ extended: true })); // ✅ for form-data text fields
// app.use(fileUpload({
//   limits: { fileSize: 5 * 1024 * 1024 },
// }));

// // ✅ Default route
// app.get('/', (req, res) => {
//   return res.status(200).json({
//     status: 'success',
//     data: 'hello jee welcome to Server'
//   });
// });

// // ✅ Routers
// app.use(productRoutes);
// app.use(userRouter);
