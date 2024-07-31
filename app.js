const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const HOST = process.env.HOST;
const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;
const app = express();
const cors = require("cors");
const db = require("./models");
const multer = require("multer");
const path = require("path");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(path.join(__dirname, "public")));

db.mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Successfully connected to MongoDB.");
  })
  .catch((err) => {
    console.log("Connection failed!", err);
  });

app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

require("./routes/auth.routes")(app);
require("./routes/order.routes")(app);
require("./routes/uploadImage.routes")(app);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${HOST}:${PORT}`);
});
