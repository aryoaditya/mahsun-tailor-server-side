const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function generateToken(user) {
  const payload = {
    userId: user._id,
    username: user.username,
    email: user.email,
    name: user.name,
    phone: user.phone,
  };

  const JWT_SECRET = process.env.JWT_SECRET;

  const options = {
    expiresIn: "12h",
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

module.exports = { generateToken };
