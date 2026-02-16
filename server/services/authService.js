const User = require("../models/User");
const Token = require("../models/Token");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");

const signup = async (userData) => {
    const { name, email, password, profilePic } = userData;

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        profilePic
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await Token.create({ userId: user._id, token: refreshToken });

    return { user, accessToken, refreshToken };
};

const signin = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
        throw new Error("Invalid email or password");
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refreshToken in DB
    await Token.findOneAndUpdate(
        { userId: user._id },
        { token: refreshToken },
        { upsert: true, returnDocument: "after" }
    );

    return { user, accessToken, refreshToken };
};

module.exports = {
    signup,
    signin
};
