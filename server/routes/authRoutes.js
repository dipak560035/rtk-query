const express = require('express');
const router = express.Router();
const path = require('path');
const {
  signup,
  signin,
  logout,
  forgotPassword,
  resetPassword,
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


// POST route to handle form submission from browser
router.post('/reset-password/:token', asyncHandler(resetPassword));

// PUT route to handle API/Postman requests
router.put('/reset-password/:token', asyncHandler(resetPassword));


// Protected routes
router.get('/me', protect, asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
}));

module.exports = router;
