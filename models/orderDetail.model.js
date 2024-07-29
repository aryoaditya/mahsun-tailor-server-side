module.exports = (mongoose) => {
  const orderDetailSchema = mongoose.Schema(
    {
      processStatus: {
        type: Number,
        required: true,
        enum: [0, 1, 2, 3], // 0 = Waiting for Payment, 1 = On Process, 2 = On Delivery, 3 = Completed
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

  const OrderDetail = mongoose.model("order_details", orderDetailSchema);
  return OrderDetail;
};
