const auth = require("../middlewares/auth.middleware");

module.exports = (app) => {
  const order = require("../controllers/order.controller");
  const router = require("express").Router();

  // Specific routes first to avoid conflict with dynamic parameter ':id'
  // router.get("/queued", auth.verifyToken, order.getQueuedOrders);
  router.get("/completed", auth.verifyToken, order.getCompletedOrders);
  router.get(
    "/pending-payment",
    auth.verifyToken,
    order.getPendingPaymentOrder
  );
  router.get("/in-progress", auth.verifyToken, order.getInProcessOrders);

  // General routes
  router.get("/", order.getOrders);
  router.post("/", auth.verifyToken, order.createOrder);

  // Route with dynamic parameter ':id'
  router.get("/:id", auth.verifyToken, order.getOrderById);
  router.patch("/:id", auth.verifyToken, auth.verifyAdmin, order.updateOrder);

  app.use("/api/orders", router);
};
