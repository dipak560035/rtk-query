
import express from 'express';


import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/productController.js';
import { notAllowed } from '../utils/notAllowed.js';
import { checkFile, updateCheckFile } from '../middlewares/checkFile.js';
import { checkId } from '../middlewares/checkId.js';
import { checkAdmin, checkUser } from '../middlewares/checkUser.js';



const router = express.Router();

router.route('/api/products')
  .get( getProducts)
  .post(checkUser,checkAdmin,checkFile, createProduct).all(notAllowed);

router.route('/api/products/:id')
  .get(checkId,getProduct)
  .patch(checkId,updateCheckFile,updateProduct)
  .delete(checkId,deleteProduct).all(notAllowed);

  export default router;


