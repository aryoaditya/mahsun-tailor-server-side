module.exports = (mongoose) => {
  const userSchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      username: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
        unique: true,
      },
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      zip: {
        type: String,
      },
      isAdmin: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

  const User = mongoose.model("users", userSchema);
  return User;
};
