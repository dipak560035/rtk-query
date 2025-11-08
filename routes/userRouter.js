

import express from 'express';
import { loginUser, registerUser } from '../controllers/userController.js';
import { notAllowed } from '../utils/notAllowed.js';

const router = express.Router();

// login route
router
  .route('/api/users/login')
  .post(loginUser)
  .all(notAllowed);

// register route
router
  .route('/api/users/register')
  .post(registerUser)
  .all(notAllowed);

export default router;
