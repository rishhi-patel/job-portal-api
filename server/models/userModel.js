const mongoose = require("mongoose")

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: { type: String },
    email: {
      type: String,
      required: true,
    },
    password: {
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
)

const User = mongoose.model("User", userSchema)

module.exports = User
