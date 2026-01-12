
// import express from 'express';


// import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/productController.js';
// import { notAllowed } from '../utils/notAllowed.js';
// import { checkFile, updateCheckFile } from '../middlewares/checkFile.js';
// import { checkId } from '../middlewares/checkId.js';
// import { checkAdmin, checkUser } from '../middlewares/checkUser.js';



// const router = express.Router();

// router.route('/products')
//   .get( getProducts)
//   .post(checkUser,checkAdmin,checkFile, createProduct).all(notAllowed);

// router.route('/products/:id')
//   .get(checkId,getProduct)
//   .patch(checkId,updateCheckFile,updateProduct)
//   .delete(checkId,deleteProduct).all(notAllowed);

//   export default router;












import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { notAllowed } from "../utils/notAllowed.js";
import { checkUser, checkAdmin } from "../middlewares/checkUser.js";
import { checkFile, updateCheckFile } from "../middlewares/checkFile.js";
import { checkId } from "../middlewares/checkId.js";

const router = express.Router();

router.route("/")
  .get(getProducts)
  .post(checkUser, checkAdmin, checkFile, createProduct)
  .all(notAllowed);

router.route("/:id")
  .get(checkId, getProduct)
  .patch(checkUser, checkAdmin, checkId, updateCheckFile, updateProduct)
  .delete(checkUser, checkAdmin, checkId, deleteProduct)
  .all(notAllowed);

export default router;