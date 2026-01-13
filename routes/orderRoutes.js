
import express from 'express';
import { cancelOrder, cancelOrderByAdmin, createOrder, deleteOrder, getOrder, getOrders } from '../controllers/orderController.js';
import { notAllowed } from '../utils/notAllowed.js';
import { checkUser } from '../middlewares/checkUser.js';

const router = express.Router();

// Base route: /api/orders
router.route('/')
  .get(checkUser, getOrders)
  .post(checkUser, createOrder)
  .all(notAllowed);

// Single order: /api/orders/:id
router.route('/:id')
  .get(checkUser, getOrder)
  .all(notAllowed);


  //cancel order by user only
router.patch('/:id/cancel', checkUser, cancelOrder);

// Admin cancel
router.patch('/:id/admin-cancel', checkUser, cancelOrderByAdmin);

//delete by admin only
router.delete('/:id', checkUser, deleteOrder);

export default router;