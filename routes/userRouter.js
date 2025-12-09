

import express from 'express';
import { getUser, loginUser, registerUser, updateProfile } from '../controllers/userController.js';
import { notAllowed } from '../utils/notAllowed.js';
import { checkUser } from '../middlewares/checkUser.js';

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


router.route('/api/users').get(checkUser, getUser).patch(checkUser, updateProfile).all(notAllowed);

  
export default router;
