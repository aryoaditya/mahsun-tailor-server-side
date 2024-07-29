module.exports = (mongoose) => {
  const orderDetailSchema = mongoose.Schema(
    {
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
