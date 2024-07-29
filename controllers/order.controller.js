const { STATUS, STATUS_LABELS } = require("../utils/constants/status.constant");
const {
  MEASUREMENT_LOCATION_LABELS,
} = require("../utils/constants/measurementLocation.constant");
const db = require("../models");
const Order = db.orders;
const OrderDetail = db.orderDetails;
const {
  successResponse,
  serverErrorResponse,
  clientErrorResponse,
} = require("../utils/responseHandler");

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    if (orders.length === 0) {
      return successResponse(res, [], "No orders found");
    }

    const formattedOrders = orders.map((order) => ({
      ...order.toObject(),
      measurementLocation:
        MEASUREMENT_LOCATION_LABELS[order.measurementLocation],
      status: STATUS_LABELS[order.status],
    }));

    successResponse(res, formattedOrders, "Orders fetched successfully");
  } catch (error) {
    serverErrorResponse(res, error.message);
  }
};

exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    successResponse(
      res,
      {
        ...order.toObject(),
        measurementLocation:
          MEASUREMENT_LOCATION_LABELS[order.measurementLocation],
        status: STATUS_LABELS[order.status],
      },
      "Order created successfully"
    );
  } catch (error) {
    serverErrorResponse(res, error.message);
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    successResponse(
      res,
      {
        ...order.toObject(),
        measurementLocation:
          MEASUREMENT_LOCATION_LABELS[order.measurementLocation],
        status: STATUS_LABELS[order.status],
      },
      "Order fetched successfully"
    );
  } catch (error) {
    serverErrorResponse(res, error.message);
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return serverErrorResponse(res, "Order not found", 404);
    }

    const oldStatus = order.status;

    if (oldStatus !== STATUS.PENDING) {
      return clientErrorResponse(
        res,
        "Status can only be updated from 'Pending' state",
        400
      );
    }

    const newStatus = req.body.status;

    if (
      ![STATUS.PENDING, STATUS.ACCEPTED, STATUS.REJECTED].includes(newStatus)
    ) {
      return clientErrorResponse(
        res,
        "Invalid status value. Use 0 for Pending, 1 for Accepted, or 2 for Rejected.",
        400
      );
    }

    order.status = newStatus;

    if (newStatus === STATUS.ACCEPTED) {
      const orderDetail = new OrderDetail({
        processStatus: "Waiting for Payment",
        shippingMethod: "standard",
      });

      await orderDetail.save();
      order.orderDetail = orderDetail._id;
    } else if (newStatus === STATUS.REJECTED) {
      order.orderDetail = null;
    }

    await order.save();

    successResponse(
      res,
      {
        ...order.toObject(),
        status: STATUS_LABELS[order.status],
      },
      "Order updated successfully"
    );
  } catch (error) {
    serverErrorResponse(res, error.message);
  }
};
