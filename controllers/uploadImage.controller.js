const {
  successResponse,
  clientErrorResponse,
} = require("../utils/responseHandler");

// User registration
exports.uploadImage = (req, res) => {
  if (!req.file) {
    return clientErrorResponse(res, "No file uploaded", 400);
  }
  console.log(req.body);
  console.log(req.file);
  successResponse(res, req.file, "File uploaded successfully", 201);
};
