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
      product: {
        type: String,
        required: true,
      },
      customer_address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      zip: {
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
        default: Date.now(),
      },
      remarks: {
        type: String,
      },
      status: {
        type: Number,
        required: true,
        enum: [0, 1, 2, 3], // 0: pending, 1: processing, 2: completed, 3: cancelled
        default: 0,
      },
      orderDetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order_details",
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
