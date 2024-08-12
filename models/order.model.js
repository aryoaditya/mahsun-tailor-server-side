const transactionModel = require("./transaction.model");

module.exports = (mongoose) => {
  const orderSchema = mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      model: {
        type: [String],
        required: true,
      },
      customerAddress: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      measurementLocation: {
        type: Number,
        required: true,
        enum: [0, 1, 2], // 0: customer_place, 1: tailor_place, 2: no_measurement
      },
      needMeasurement: {
        type: Boolean,
        required: true,
      },
      estimatedDate: {
        type: Date,
        required: true,
      },
      remarks: {
        type: String,
      },
      status: {
        type: Number,
        required: true,
        enum: [0, 1, 2, 3], // 0: Pending, 1: Accepted, 2: Rejected, 3: Canceled
        default: 0,
      },
      processStatus: {
        type: Number,
        required: true,
        enum: [0, 1, 2, 3], // 0: Waiting for Payment, 1: In Process, 2: In Delivery, 3: Completed
        default: 0,
      },
      transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transactions",
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

  const Order = mongoose.model("orders", orderSchema);
  return Order;
};
