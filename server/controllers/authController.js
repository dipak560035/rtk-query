
const { setTokensCookies, clearTokensCookies } = require("../utils/cookieHelper");
const { sendResetPasswordEmail } = require("../services/emailService");
const authService = require("../services/authService");
const crypto = require("crypto");
const User = require("../models/User"); // Needed for forgot/reset password for now or move to service
const Token = require("../models/Token"); // Needed for logout

// SIGNUP 
const signup = async (req, res) => {
  const profilePic = req.file ? req.file.path : "";
  const userData = { ...req.body, profilePic };

  const { user, accessToken, refreshToken } = await authService.signup(userData);

  setTokensCookies(res, accessToken, refreshToken);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    profilePic: user.profilePic,
    message: "User created successfully",
  });
};

//SIGNIN
const signin = async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await authService.signin(email, password);

  setTokensCookies(res, accessToken, refreshToken);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    profilePic: user.profilePic,
    message: "Logged in successfully",
  });
};

//LOGOUT
const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) await Token.deleteOne({ token: refreshToken });
  clearTokensCookies(res);
  res.status(200).json({ message: "Logged out successfully" });
};

// FORGOT PASSWORD 
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min

  await user.save();

  const resetUrl = `${process.env.SERVER_URL}/api/auth/reset-password/${resetToken}`;
  await sendResetPasswordEmail(user.email, resetUrl);

  res.status(200).json({ message: "Reset password email sent successfully", resetUrl });
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  const { password } = req.body;

  // Simple validation for password
  if (!password) {
    if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
      return res.send('<h3>New password is required</h3>');
    }
    res.status(400);
    throw new Error('New password is required');
  }

  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
      return res.send('<h3>Invalid or expired token</h3>');
    }
    res.status(400);
    throw new Error('Invalid or expired token');
  }

  // Assign plain password — pre-save hook will hash it
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  // Send success HTML if from browser
  if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
    return res.send('<h3>Password updated successfully! You can now login.</h3>');
  }

  res.status(200).json({ message: 'Password updated successfully' });
};


module.exports = { signup, signin, logout, forgotPassword, resetPassword };
