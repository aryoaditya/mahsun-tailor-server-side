module.exports = (mongoose) => {
  const orderDetailSchema = mongoose.Schema(
    {
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",
        required: true,
      },
      processStatus: {
        type: String,
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

  const OrderDetail = mongoose.model("orderDetails", orderDetailSchema);
  return OrderDetail;
};
