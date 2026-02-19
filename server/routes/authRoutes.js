const express = require('express');
const router = express.Router();
const path = require('path');
const {
  signup,
  signin,
  logout,
  forgotPassword,
  resetPassword,
  getUserById,
  
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('../middleware/asyncHandler');
const upload = require('../middleware/uploadMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { signupSchema, signinSchema } = require('../utils/validationSchemas');

// Public routes

router.post('/signup', upload.single('profilePic'), validateRequest(signupSchema), asyncHandler(signup));
router.post('/signin', validateRequest(signinSchema), asyncHandler(signin));
router.post('/logout', asyncHandler(logout));
router.post('/forgot-password', asyncHandler(forgotPassword));

//Reset password routes for backend + browser
router.get('/reset-password/:token', (req, res) => {
  res.sendFile(
    path.join(__dirname, '../views/resetPassword.html')
  );
});



router.post('/reset-password/:token', asyncHandler(resetPassword));


router.put('/reset-password/:token', asyncHandler(resetPassword));

//me

router.get('/me', protect, asyncHandler(getUserById));

module.exports = router;
