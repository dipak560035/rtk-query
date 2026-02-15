// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const Token = require('../models/Token');
// const { generateAccessToken } = require('../utils/generateToken');
// const { setTokensCookies, clearTokensCookies } = require('../utils/cookieHelper');

// const protect = async (req, res, next) => {
//     const accessToken = req.cookies.accessToken;
//     const refreshToken = req.cookies.refreshToken;

//     if (!accessToken && !refreshToken) {
//         return res.status(401).json({ message: 'Not authorized, no token' });
//     }

//     try {
//         // 1. Try to verify access token
//         if (accessToken) {
//             const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
//             req.user = await User.findById(decoded.userId).select('-password');
//             return next();
//         }
//     } catch (error) {
//         // Access token expired or invalid, proceed to check refresh token
//         // If error is not 'TokenExpiredError', we might want to stop, but usually we fallback to refresh
//     }

//     // 2. Access token missing or expired -> Check refresh token
//     if (!refreshToken) {
//         return res.status(401).json({ message: 'Not authorized, no refresh token' });
//     }

//     try {
//         const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

//         // Check if refresh token exists in DB and is valid for this user
//         const savedToken = await Token.findOne({
//             userId: decodedRefresh.userId,
//             token: refreshToken
//         });

//         if (!savedToken) {
//             clearTokensCookies(res);
//             return res.status(401).json({ message: 'Session expired, please login again' });
//         }

//         // Refresh token is valid. Generate new Access Token.
//         const newAccessToken = generateAccessToken(decodedRefresh.userId);

//         // Set new Access Token cookie (keep refresh token as is)
//         setTokensCookies(res, newAccessToken, null);

//         req.user = await User.findById(decodedRefresh.userId).select('-password');
//         next();

//     } catch (error) {
//         clearTokensCookies(res);
//         return res.status(401).json({ message: 'Not authorized, token failed' });
//     }
// };

// module.exports = { protect };












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
      if (typeof next === 'function') next();
      return; // stop execution
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

    if (typeof next === 'function') next();
  } catch (err) {
    clearTokensCookies(res);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};


module.exports = { protect };
