const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const HOST = process.env.HOST;
const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// db.mongoose
//   .connect(MONGO_URL)
//   .then(() => {
//     console.log("Successfully connected to MongoDB.");
//   })
//   .catch((err) => {
//     console.log("Connection failed!", err);
//   });

app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${HOST}:${PORT}`);
});
