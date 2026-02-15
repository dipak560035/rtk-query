











const crypto = require('crypto');
const User = require('../models/User');
const Token = require('../models/Token');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const { setTokensCookies, clearTokensCookies } = require('../utils/cookieHelper');
const { sendResetPasswordEmail } = require('../services/emailService');

// ================= SIGNUP =================
const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password });

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        await Token.create({ userId: user._id, token: refreshToken });

        setTokensCookies(res, accessToken, refreshToken);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            message: 'User created successfully',
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
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        await Token.findOneAndUpdate(
            { userId: user._id },
            { token: refreshToken },
            { upsert: true, new: true }
        );

        setTokensCookies(res, accessToken, refreshToken);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            message: 'Logged in successfully',
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
    res.status(200).json({ message: 'Logged out successfully' });
};

// ================= FORGOT PASSWORD =================
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Generate token and hash it
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        // 🔹 Use backend API URL for testing via Postman
        const resetUrl = `${process.env.CLIENT_URL}/api/auth/reset-password/${resetToken}`;

        try {
            await sendResetPasswordEmail(user.email, resetUrl);
            res.status(200).json({ message: 'Reset password email sent successfully', resetUrl });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            console.error(err);
            res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// ================= RESET PASSWORD =================
const resetPassword = async (req, res) => {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'New password is required' });

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    signup,
    signin,
    logout,
    forgotPassword,
    resetPassword,
};
