const STATUS = {
  PENDING: 0,
  ACCEPTED: 1,
  REJECTED: 2,
};

const STATUS_LABELS = {
  [STATUS.PENDING]: "Pending",
  [STATUS.ACCEPTED]: "Accepted",
  [STATUS.REJECTED]: "Rejected",
};

module.exports = { STATUS, STATUS_LABELS };
