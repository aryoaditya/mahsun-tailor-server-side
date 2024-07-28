const dotenv = require("dotenv");
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = MONGO_URL;

// Import model schemas and assign to db object
db.users = require("./user.model")(mongoose);
db.orders = require("./order.model")(mongoose);
db.orderDetails = require("./orderDetail.model")(mongoose);
db.payments = require("./payment.model")(mongoose);
db.debits = require("./debit.model")(mongoose);

module.exports = db;
