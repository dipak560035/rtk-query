
const crypto = require("crypto");
const User = require("../models/User");
const Token = require("../models/Token");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const { setTokensCookies, clearTokensCookies } = require("../utils/cookieHelper");
const { sendResetPasswordEmail } = require("../services/emailService");
const bcrypt = require("bcryptjs");

// ================= SIGNUP =================
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password }); // pre-save hook hashes

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await Token.create({ userId: user._id, token: refreshToken });

    setTokensCookies(res, accessToken, refreshToken);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message: "User created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ================= SIGNIN =================
const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refreshToken in DB
    await Token.findOneAndUpdate(
      { userId: user._id },
      { token: refreshToken },
      { upsert: true, returnDocument: "after" }
    );

    setTokensCookies(res, accessToken, refreshToken);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message: "Logged in successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ================= LOGOUT =================
const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) await Token.deleteOne({ token: refreshToken });
  clearTokensCookies(res);
  res.status(200).json({ message: "Logged out successfully" });
};

// ================= FORGOT PASSWORD =================
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save();

    const resetUrl = `${process.env.SERVER_URL}/api/auth/reset-password/${resetToken}`;
    await sendResetPasswordEmail(user.email, resetUrl);

    res.status(200).json({ message: "Reset password email sent successfully", resetUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Email could not be sent" });
  }
};

// ================= RESET PASSWORD =================
// const resetPassword = async (req, res) => {
//   const { password } = req.body;
//   if (!password) return res.status(400).send("<h3>New password is required</h3>");

//   const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

//   try {
//     const user = await User.findOne({
//       resetPasswordToken,
//       resetPasswordExpires: { $gt: Date.now() },
//     });

//     if (!user) return res.status(400).send("<h3>Invalid or expired token</h3>");

//     user.password = await bcrypt.hash(password, 10);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;

//     await user.save();

//     if (req.headers["content-type"] === "application/x-www-form-urlencoded") {
//       res.send("<h3>Password updated successfully! You can now login.</h3>");
//     } else {
//       res.status(200).json({ message: "Password updated successfully" });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("<h3>Server error</h3>");
//   }
// };
const resetPassword = async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).send('<h3>New password is required</h3>');

  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).send('<h3>Invalid or expired token</h3>');

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
  } catch (err) {
    console.error(err);
    res.status(500).send('<h3>Server error</h3>');
  }
};


module.exports = { signup, signin, logout, forgotPassword, resetPassword };
