// const express = require('express');
// const router = express.Router();
// const {
//     signup,
//     signin,
//     logout,
//     forgotPassword,
//     resetPassword,
// } = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware');

// router.post('/signup', signup);
// router.post('/signin', signin);
// router.post('/logout', logout);
// router.post('/forgot-password', forgotPassword);
// router.put('/reset-password/:resetToken', resetPassword);

// // Protected route example/verification
// router.get('/me', protect, (req, res) => {
//     res.status(200).json(req.user);
// });

// module.exports = router;








const express = require('express');
const router = express.Router();
const {
    signup,
    signin,
    logout,
    forgotPassword,
    resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Async wrapper to catch errors and prevent "next is not a function"
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(err => {
        console.error(err);
        res.status(500).json({ message: err.message || 'Server error' });
    });
};

// Public routes
router.post('/signup', asyncHandler(signup));
router.post('/signin', asyncHandler(signin));
router.post('/logout', asyncHandler(logout));
router.post('/forgot-password', asyncHandler(forgotPassword));
router.put('/reset-password/:resetToken', asyncHandler(resetPassword));

// Protected route example
router.get('/me', protect, asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
}));

module.exports = router;
