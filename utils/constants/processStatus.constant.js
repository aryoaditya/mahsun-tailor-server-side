const PROCESS_STATUS = {
  WAITING_FOR_PAYMENT: 0,
  IN_PROCESS: 1,
  ON_DELIVERY: 2,
  COMPLETED: 3,
};

const PROCESS_STATUS_LABELS = {
  [PROCESS_STATUS.WAITING_FOR_PAYMENT]: "Waiting for payment",
  [PROCESS_STATUS.IN_PROCESS]: "On Process",
  [PROCESS_STATUS.ON_DELIVERY]: "On Delivery",
  [PROCESS_STATUS.COMPLETED]: "Completed",
};

module.exports = { PROCESS_STATUS, PROCESS_STATUS_LABELS };
