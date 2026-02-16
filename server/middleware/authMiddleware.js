
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Token = require("../models/Token");
const { generateAccessToken } = require("../utils/generateToken");
const { setTokensCookies, clearTokensCookies } = require("../utils/cookieHelper");

const protect = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ message: "Please login" });
  }

  try {
    if (accessToken) {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      return next();
    }
  } catch (err) {}

  if (!refreshToken) {
    return res.status(401).json({ message: "Session expired, please login" });
  }

  try {
    const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const savedToken = await Token.findOne({
      userId: decodedRefresh.userId,
      token: refreshToken,
    });

    if (!savedToken) {
      clearTokensCookies(res);
      return res.status(401).json({ message: "Session expired, please login" });
    }

    const newAccessToken = generateAccessToken(decodedRefresh.userId);
    setTokensCookies(res, newAccessToken, null);

    req.user = await User.findById(decodedRefresh.userId).select("-password");
    next();
  } catch (err) {
    clearTokensCookies(res);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

module.exports = { protect };
