module.exports = (app) => {
  const order = require("../controllers/order.controller");
  const router = require("express").Router();

  // index
  router.get("/", order.getOrders);
  router.post("/", order.createOrder);
  router.get("/:id", order.getOrderById);
  router.patch("/:id", order.updateOrder);

  app.use("/api/orders", router);
};
