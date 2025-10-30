


import express from 'express';
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from './controllers/productController.js';
import { notAllowed } from './utils/notAllowed.js';


const app = express();
const port = 5000;

// server run and listening
// api
//middleware




app.use(express.json()); 


app.get('/', (req, res) => {

  return res.status(200).json({
    status: 'success',
    data: 'hello jee welcome to Server'
  });
});


app.route('/api/products')
  .get(getProducts)
  .post(createProduct).all(notAllowed);



app.route('/api/products/:id')
  .get(getProduct)
  .patch(updateProduct)
  .delete(deleteProduct).all(notAllowed);



app.listen(port, () => {
  console.log(' server is running ');
});
