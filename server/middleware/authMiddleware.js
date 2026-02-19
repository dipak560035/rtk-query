
const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// authMiddleware.js
const AppDataSource = require("../data-source");
const userRepo = () => AppDataSource.getRepository("User");
const tokenRepo = () => AppDataSource.getRepository("Token");
// const Token = require("../models/Token");
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
      // req.user = await User.findById(decoded.userId).select("-password");
      const user = await userRepo().findOne({ where: { id: decoded.userId } });
      if (!user) return res.status(401).json({ message: "User not found" });

      delete user.password;
      req.user = user;

      return next();
    }
  } catch (err) {}

  if (!refreshToken) {
    return res.status(401).json({ message: "Session expired, please login" });
  }

  try {
    const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // const savedToken = await Token.findOne({
    //   userId: decodedRefresh.userId,
    //   token: refreshToken,
    const savedToken = await tokenRepo().findOne({
      where: { token: refreshToken, user: { id: decodedRefresh.userId } },
      relations: ["user"],
    });

    if (!savedToken) {
      clearTokensCookies(res);
      return res.status(401).json({ message: "Session expired, please login" });
    }

    const newAccessToken = generateAccessToken(decodedRefresh.userId);
    setTokensCookies(res, newAccessToken, null);

  //   req.user = await User.findById(decodedRefresh.userId).select("-password");
  //   next();
  // } catch (err) {
   const user = await userRepo().findOne({ where: { id: decodedRefresh.userId } });
    if (!user) {
      clearTokensCookies(res);
      return res.status(401).json({ message: "User not found" });
    }
    // clearTokensCookies(res);
    // return res.status(401).json({ message: "Not authorized, token invalid" });
     delete user.password;
    req.user = user;
    next();
  } catch (err) {
    clearTokensCookies(res);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

module.exports = { protect };
