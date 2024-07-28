module.exports = (mongoose) => {
  const debitSchema = mongoose.Schema(
    {
      paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "payments",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      bankId: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

  const Debit = mongoose.model("debits", debitSchema);
  return Debit;
};
