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
  const token = req.params.token;

  res.send(`
  <html>
    <head>
      <title>Reset Password</title>
      <style>
        body { font-family: Arial; padding:40px; background:#f4f4f4; }
        form { max-width:400px; margin:auto; background:#fff; padding:20px; border-radius:8px; box-shadow:0 0 10px rgba(0,0,0,0.1);}
        input, button { padding:10px; width:100%; margin-top:10px; }
        #showPassword { width: auto; padding: 10px; margin-top: 5px; cursor: pointer; background:#ddd; border:none; border-radius:4px; }
        button[type="submit"] { background:#4CAF50; color:#fff; border:none; border-radius:4px; cursor:pointer; }
        button[type="submit"]:hover { background:#45a049; }
      </style>
    </head>
    <body>
      <h2 style="text-align:center;">Reset Password</h2>
      <form method="POST" action="/api/auth/reset-password/${token}">
        <input type="password" id="password" name="password" placeholder="Enter new password" required />
        <button type="button" id="showPassword">Show Password</button>
        <button type="submit">Reset Password</button>
      </form>

      <script>
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.getElementById('showPassword');

        toggleBtn.addEventListener('click', (e) => {
          e.preventDefault(); // prevent form submission
          if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.textContent = 'Hide Password';
          } else {
            passwordInput.type = 'password';
            toggleBtn.textContent = 'Show Password';
          }
        });
      </script>
    </body>
  </html>
  `);
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
