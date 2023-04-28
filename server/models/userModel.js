const mongoose = require("mongoose")

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      default: "",
    },
    lastName: { type: String, default: "" },
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
    nationality: {
      type: String,
      default: "",
    },
    phoneNumber1: {
      type: String,
      default: "",
    },
    phoneNumber2: {
      type: String,
      default: "",
    },
    passportNo: {
      type: String,
      default: "",
    },
    currentEmployer: {
      type: String,
      default: "",
    },
    profession: {
      type: String,
      default: "",
    },
    residenceCardExpiryDate: {
      type: String,
      default: "",
    },
    facebookId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model("User", userSchema)

module.exports = User
