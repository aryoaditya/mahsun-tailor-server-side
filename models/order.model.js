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
        unique: true,
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
        type: String,
        required: true,
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
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

  const Order = mongoose.model("orders", orderSchema);
  return Order;
};
