const { STATUS, STATUS_LABELS } = require("../utils/constants/status.constant");
const {
  MEASUREMENT_LOCATION_LABELS,
} = require("../utils/constants/measurementLocation.constant");
const {
  NEED_MEASUREMENT_LABELS,
} = require("../utils/constants/needMeasurement.constant");
const {
  PROCESS_STATUS,
  PROCESS_STATUS_LABELS,
} = require("../utils/constants/processStatus.constant");
const db = require("../models");
const Order = db.orders;
const Transaction = db.transactions;
const {
  successResponse,
  serverErrorResponse,
  clientErrorResponse,
} = require("../utils/responseHandler");
const {
  PAYMENT_STATUS,
  PAYMENT_STATUS_LABELS,
} = require("../utils/constants/paymentStatus");

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~ BY CUSTOMER ~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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

exports.receivedOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return serverErrorResponse(res, "Order not found", 404);
    }

    const oldProcessStatus = order.processStatus;

    if (oldProcessStatus !== PROCESS_STATUS.IN_DELIVERY) {
      return clientErrorResponse(
        res,
        "Status can only be updated from 'In Delivery' state",
        400
      );
    }

    const newProcessStatus = PROCESS_STATUS.COMPLETED;

    order.processStatus = newProcessStatus;

    await order.save();

    successResponse(
      res,
      {
        ...order.toObject(),
        status: STATUS_LABELS[order.status],
        processStatus: PROCESS_STATUS_LABELS[order.processStatus],
      },
      "Order updated successfully"
    );
  } catch (error) {
    serverErrorResponse(res, error.message);
  }
};

exports.getPendingPaymentOrder = async (req, res) => {
  try {
    const orders = await Order.find({
      status: STATUS.ACCEPTED, // Accepted
      userId: req.userId,
      processStatus: PROCESS_STATUS.WAITING_FOR_PAYMENT,
    })
      .populate({
        path: "userId",
        select: "name email phone",
      })
      .populate({
        path: "transaction",
      });

    const filteredOrders = orders.filter((order) => order.transaction);

    if (filteredOrders.length === 0) {
      return successResponse(res, [], "No pending payments found");
    }

    const transformedOrders = filteredOrders.map((order) => ({
      ...order.toObject(),
      status: STATUS_LABELS[order.status],
      measurementLocation:
        MEASUREMENT_LOCATION_LABELS[order.measurementLocation],
      needMeasurement: NEED_MEASUREMENT_LABELS[order.needMeasurement],
      processStatus: PROCESS_STATUS_LABELS[order.processStatus],
      transaction: {
        ...order.transaction.toObject(),
        paymentStatus: PAYMENT_STATUS_LABELS[order.transaction.paymentStatus],
      },
    }));

    successResponse(
      res,
      transformedOrders,
      "Pending payments fetched successfully"
    );
  } catch (error) {
    serverErrorResponse(res, error.message);
  }
};

exports.getInProcessOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      status: STATUS.ACCEPTED, // ORDER STATUS: Accepted
      userId: req.userId,
      processStatus: {
        $in: [PROCESS_STATUS.IN_PROCESS, PROCESS_STATUS.IN_DELIVERY],
      },
    })
      .populate({
        path: "transaction",
        match: { paymentStatus: PAYMENT_STATUS.PAID },
      })
      .populate({
        path: "userId",
      });

    const filteredOrders = orders.filter((order) => order.transaction);

    if (filteredOrders.length === 0) {
      return successResponse(res, [], "No in process orders found");
    }

    const transformedOrders = filteredOrders.map((order) => ({
      ...order.toObject(),
      status: STATUS_LABELS[order.status],
      measurementLocation:
        MEASUREMENT_LOCATION_LABELS[order.measurementLocation],
      needMeasurement: NEED_MEASUREMENT_LABELS[order.needMeasurement],
      processStatus: PROCESS_STATUS_LABELS[order.processStatus],
      transaction: {
        ...order.transaction.toObject(),
        paymentStatus: PAYMENT_STATUS_LABELS[order.transaction.paymentStatus],
      },
    }));

    successResponse(
      res,
      transformedOrders,
      "In process orders fetched successfully"
    );
  } catch (error) {
    serverErrorResponse(res, error.message);
  }
};

exports.getCompletedOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      status: STATUS.ACCEPTED,
      userId: req.userId,
      processStatus: PROCESS_STATUS.COMPLETED,
    })
      .populate({
        path: "transaction",
        match: { paymentStatus: PAYMENT_STATUS.PAID },
      })
      .populate({
        path: "userId",
      });

    const filteredOrders = orders.filter((order) => order.transaction);

    if (filteredOrders.length === 0) {
      return successResponse(res, [], "No completed orders found");
    }

    const transformedOrders = filteredOrders.map((order) => ({
      ...order.toObject(),
      status: STATUS_LABELS[order.status],
      measurementLocation:
        MEASUREMENT_LOCATION_LABELS[order.measurementLocation],
      needMeasurement: NEED_MEASUREMENT_LABELS[order.needMeasurement],
      processStatus: PROCESS_STATUS_LABELS[order.processStatus],
      transaction: {
        ...order.transaction.toObject(),
        paymentStatus: PAYMENT_STATUS_LABELS[order.transaction.paymentStatus],
      },
    }));

    successResponse(
      res,
      transformedOrders,
      "Completed orders fetched successfully"
    );
  } catch (error) {
    serverErrorResponse(res, error.message);
  }
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~ BY ADMIN ~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
exports.updateOrder = async (req, res) => {
  try {
    let order = await Order.findById(req.params.id).populate("transaction");

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

    if (![STATUS.ACCEPTED, STATUS.REJECTED].includes(newStatus)) {
      return clientErrorResponse(
        res,
        "Invalid status value. Use 1 for Accepted, or 2 for Rejected.",
        400
      );
    }

    order.status = newStatus;

    if (newStatus === STATUS.ACCEPTED) {
      const transaction = new Transaction({
        orderId: order._id,
        totalPrice: req.body.totalBill,
      });

      await transaction.save();
      order.transaction = transaction._id;
    } else if (newStatus === STATUS.REJECTED) {
      order.transaction = null;
    }

    await order.save();

    order = await Order.findById(order._id).populate("transaction");

    successResponse(
      res,
      {
        ...order.toObject(),
        status: STATUS_LABELS[order.status],
        processStatus: PROCESS_STATUS_LABELS[order.processStatus],
        transaction: order.transaction
          ? {
              ...order.transaction.toObject(),
              paymentStatus:
                PAYMENT_STATUS_LABELS[order.transaction.paymentStatus],
            }
          : null,
      },
      "Order updated successfully"
    );
  } catch (error) {
    serverErrorResponse(res, error.message);
  }
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~ BY ADMIN OR CUSTOMER ~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate({
      path: "userId",
    });

    if (orders.length === 0) {
      return successResponse(res, [], "No orders found");
    }

    const formattedOrders = orders.map((order) => ({
      ...order.toObject(),
      measurementLocation:
        MEASUREMENT_LOCATION_LABELS[order.measurementLocation],
      status: STATUS_LABELS[order.status],
      processStatus: PROCESS_STATUS_LABELS[order.processStatus],
    }));

    successResponse(res, formattedOrders, "Orders fetched successfully");
  } catch (error) {
    serverErrorResponse(res, error.message);
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: "userId",
    });
    successResponse(
      res,
      {
        ...order.toObject(),
        measurementLocation:
          MEASUREMENT_LOCATION_LABELS[order.measurementLocation],
        status: STATUS_LABELS[order.status],
        processStatus: PROCESS_STATUS_LABELS[order.processStatus],
      },
      "Order fetched successfully"
    );
  } catch (error) {
    serverErrorResponse(res, error.message);
  }
};
