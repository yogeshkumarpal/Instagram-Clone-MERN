const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cacheClient = require("../services/cache.services");
const { emailTemplate } = require("../utils/emailTemplate");
const { sendMail } = require("../services/mail.services");
const UserModel = require("../models/user.model");

const registerController = async (req, res) => {
  try {
    let { fullName, username, email, password, mobile } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(422).json({
        message: "All fields are required",
      });
    }

    let existingUser = await UserModel.findOne({
      $or: [{ email }, { mobile }, { username }],
      email,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    let newUser = await UserModel.create({
      fullName,
      username,
      email,
      mobile,
      password,
    });

    if (!newUser)
      return res.status(400).json({
        message: "Error in registering user",
      });

    let token = newUser.JWTTokenGeneration();

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: false,
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.log("error in reg->", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    let { email, mobile, username, password } = req.body;

    let user = await UserModel.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let decryptPass = await bcrypt.compare(password, user.password);

    if (!decryptPass) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    let token = user.JWTTokenGeneration();

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: false,
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    return res.status(200).json({
      message: "User loggedIn",
      user: user,
    });
  } catch (error) {
    console.log("error in login", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};

const logoutController = async (req, res) => {
  try {
    let token = req.cookies?.token; // Fix: use req.cookies, not res.cookies

    if (!token) {
      return res.status(404).json({
        message: "Token not found, Unauthorize user",
      });
    }

    await cacheClient.set(token, "blacklisted");

    res.clearCookie("token");

    return res.status(200).json({
      message: "user logged out",
    });
  } catch (error) {
    console.log("error in logout->", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    let { email, mobile } = req.body;

    let user = await userModel.findOne({
      $or: [{ email }, { mobile }],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let rawToken = jwt.sign({ id: user._id }, process.env.JWT_RAW_SECRET, {
      expiresIn: "30m",
    });

    let resetLink = `http://localhost:3000/api/auth/reset-password/${rawToken}`;

    let resetTemplate = emailTemplate({ username: user.username, resetLink });

    let res = await sendMail(
      "devendradhote179@gmail.com",
      "Reset password",
      resetTemplate,
    );

    return res.send("ok");
  } catch (error) {
    console.log("error in fp->", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  forgotPasswordController,
};
