const STATUS = {
  PENDING: 0,
  ACCEPTED: 1,
  REJECTED: 2,
  CANCELLED: 3,
};

const STATUS_LABELS = {
  [STATUS.PENDING]: "Pending",
  [STATUS.ACCEPTED]: "Accepted",
  [STATUS.REJECTED]: "Rejected",
  [STATUS.CANCELLED]: "Cancelled",
};

module.exports = { STATUS, STATUS_LABELS };
