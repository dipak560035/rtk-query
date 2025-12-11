

import express from 'express';
import { getUser, loginUser, registerUser, updateProfile } from '../controllers/userController.js';
import { notAllowed } from '../utils/notAllowed.js';
import { checkUser } from '../middlewares/checkUser.js';

const router = express.Router();

// login route
router
  .route('/login')
  .post(loginUser)
  .all(notAllowed);

// register route
router
  .route('/register')
  .post(registerUser)
  .all(notAllowed);


router.route('/')
.get(checkUser, getUser).patch(checkUser, updateProfile).all(notAllowed);

  
export default router;



// import express from 'express';
// import { getUser, loginUser, registerUser, updateProfile } from '../controllers/userController.js';
// import { notAllowed } from '../utils/notAllowed.js';
// import { checkUser } from '../middlewares/checkUser.js';

// const router = express.Router();

// // login route
// router.post('/login', loginUser).all(notAllowed);

// // register route
// router.post('/register', registerUser).all(notAllowed);

// // get & update user profile
// router.get('/', checkUser, getUser)
// router.patch('/', checkUser, updateProfile)
// router.all('*', notAllowed);

// export default router;
