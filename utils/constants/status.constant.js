const STATUS = {
  PENDING: 0,
  ACCEPTED: 1,
  REJECTED: 2,
  CANCELED: 3,
};

const STATUS_LABELS = {
  [STATUS.PENDING]: "Pending",
  [STATUS.ACCEPTED]: "Accepted",
  [STATUS.REJECTED]: "Rejected",
  [STATUS.CANCELED]: "Canceled",
};

module.exports = { STATUS, STATUS_LABELS };
