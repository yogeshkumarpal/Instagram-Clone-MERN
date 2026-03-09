const UserModel = require("../models/user.model");
const cacheClient = require("../services/cache.services");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Token not found, unauthorized user",
      });
    }

    let isBlackListed = await cacheClient.get(token);

    if (isBlackListed)
      return res.status(401).json({
        message: "Token Blacklisted or expired",
      });

    let decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(403).json({
        message: "Token Invalid",
      });
    }

    let user = await UserModel.findById(decode.id);

    req.user = user;
    next();
  } catch (error) {
    console.log("error in auth middleware", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};

module.exports = authMiddleware;
