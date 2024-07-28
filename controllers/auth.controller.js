const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const User = db.users;
const {
  successResponse,
  serverErrorResponse,
  clientErrorResponse,
  loginResponse,
} = require("../utils/responseHandler");

// User registration
exports.register = async (req, res) => {
  try {
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      zip: req.body.zip,
    });

    const result = await user.save();
    successResponse(res, result, "User registered successfully", 201);
  } catch (err) {
    if (err.code === 11000) {
      // MongoDB duplicate key error
      const duplicateField = Object.keys(err.keyPattern)[0];

      clientErrorResponse(
        res,
        `${
          duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)
        } already exists`,
        400
      );
    } else {
      serverErrorResponse(res, err.message);
    }
  }
};

exports.login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    console.log(emailOrUsername, password);
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return clientErrorResponse(res, "Wrong email or password", 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return clientErrorResponse(res, "Wrong email or password", 401);
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "12h",
    });
    loginResponse(res, token);
  } catch (err) {
    serverErrorResponse(res, err.message);
  }
};
