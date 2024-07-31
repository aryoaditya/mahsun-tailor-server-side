module.exports = (app) => {
  const multer = require("multer");
  const uploadController = require("../controllers/uploadImage.controller");
  const router = require("express").Router();

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/images");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  });

  const upload = multer({ storage });

  router.post("/upload", upload.single("file"), uploadController.uploadImage);

  app.use("/api", router);
};
