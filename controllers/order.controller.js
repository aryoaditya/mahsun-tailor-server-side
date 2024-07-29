const { STATUS, STATUS_LABELS } = require("../utils/constants/status.constant");
const {
  MEASUREMENT_LOCATION_LABELS,
} = require("../utils/constants/measurementLocation.constant");
const {
  PROCESS_STATUS,
  PROCESS_STATUS_LABELS,
} = require("../utils/constants/processStatus.constant");
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
    const order = await Order.findById(req.params.id).populate({
      path: "userId",
      select: "name email phone",
    });
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

exports.getPendingPaymentOrder = async (req, res) => {
  try {
    const orders = await Order.find({
      status: STATUS.ACCEPTED, // Accepted
      userId: req.userId,
    })
      .populate({
        path: "orderDetail",
        match: { processStatus: PROCESS_STATUS.WAITING_FOR_PAYMENT }, // Waiting for Payment
      })
      .populate({
        path: "userId",
        select: "name email phone",
      });

    const filteredOrders = orders.filter((order) => order.orderDetail);

    if (filteredOrders.length === 0) {
      return successResponse(res, [], "No pending payments found");
    }

    successResponse(
      res,
      {
        ...filteredOrders.toObject(),
        status: STATUS_LABELS[filteredOrders.status],
        orderDetail: {
          ...filteredOrders.orderDetail.toObject(),
          processStatus:
            PROCESS_STATUS_LABELS[filteredOrders.orderDetail.processStatus],
        },
      },
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
    })
      .populate({
        path: "orderDetail",
        match: {
          processStatus: {
            $in: [PROCESS_STATUS.IN_PROCESS, PROCESS_STATUS.IN_DELIVERY],
          }, // PROCESS STATUS: In Process OR In Delivery
        },
      })
      .populate({
        path: "userId",
        select: "name email phone",
      });

    const filteredOrders = orders.filter((order) => order.orderDetail);

    if (filteredOrders.length === 0) {
      return successResponse(res, [], "No in process orders found");
    }

    successResponse(
      res,
      {
        ...filteredOrders.toObject(),
        status: STATUS_LABELS[filteredOrders.status],
        orderDetail: {
          ...filteredOrders.orderDetail.toObject(),
          processStatus:
            PROCESS_STATUS_LABELS[filteredOrders.orderDetail.processStatus],
        },
      },
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
    })
      .populate({
        path: "orderDetail",
        match: { processStatus: PROCESS_STATUS.COMPLETED },
      })
      .populate({
        path: "userId",
        select: "name email phone",
      });

    const filteredOrders = orders.filter((order) => order.orderDetail);

    if (filteredOrders.length === 0) {
      return successResponse(res, [], "No completed orders found");
    }

    successResponse(
      res,
      {
        ...filteredOrders.toObject(),
        status: STATUS_LABELS[filteredOrders.status],
        orderDetail: {
          ...filteredOrders.orderDetail.toObject(),
          processStatus:
            PROCESS_STATUS_LABELS[filteredOrders.orderDetail.processStatus],
        },
      },
      "Completed orders fetched successfully"
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
        processStatus: PROCESS_STATUS.WAITING_FOR_PAYMENT,
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
        orderDetail: {
          ...order.orderDetail.toObject(),
          processStatus: PROCESS_STATUS_LABELS[order.orderDetail.processStatus],
        },
      },
      "Order updated successfully"
    );
  } catch (error) {
    serverErrorResponse(res, error.message);
  }
};

exports.receivedOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: "orderDetail",
      match: { processStatus: PROCESS_STATUS.IN_DELIVERY },
    });

    if (!order || !order.orderDetail) {
      return serverErrorResponse(res, "Order not found", 404);
    }

    const oldProcessStatus = order.orderDetail.processStatus;

    if (oldProcessStatus !== PROCESS_STATUS.IN_DELIVERY) {
      return clientErrorResponse(
        res,
        "Status can only be updated from 'In Delivery' state",
        400
      );
    }

    const newProcessStatus = PROCESS_STATUS.COMPLETED;

    order.orderDetail.processStatus = newProcessStatus;

    await order.orderDetail.save();

    successResponse(
      res,
      {
        ...order.toObject(),
        status: STATUS_LABELS[order.status],
        orderDetail: {
          ...order.orderDetail.toObject(),
          processStatus: PROCESS_STATUS_LABELS[order.orderDetail.processStatus],
        },
      },
      "Order updated successfully"
    );
  } catch (error) {
    serverErrorResponse(res, error.message);
  }
};
