const PAYMENT_STATUS = {
  CANCELED: 0,
  WAITING: 1,
  PAID: 2,
};

const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.CANCELED]: "Order Canceled",
  [PAYMENT_STATUS.WAITING]: "Waiting for Payment",
  [PAYMENT_STATUS.PAID]: "Paid",
};

module.exports = { PAYMENT_STATUS, PAYMENT_STATUS_LABELS };
