module.exports = (mongoose) => {
  const paymentSchema = mongoose.Schema(
    {
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",
        required: true,
      },
      totalPrice: {
        type: Number,
        required: true,
      },
      shippingMethod: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

  const Payment = mongoose.model("payments", paymentSchema);
  return Payment;
};
