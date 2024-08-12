module.exports = (mongoose) => {
  const transactionSchema = mongoose.Schema(
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
      paymentStatus: {
        type: Number,
        default: 1, // 1 = Canceled, 0 = Waiting For Payment, 2 = Paid
      },
      paymentMethod: {
        type: String,
        default: null,
      },
      shippingMethod: {
        type: String,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

  const Transaction = mongoose.model("transactions", transactionSchema);
  return Transaction;
};
