const mongoose = require("mongoose")

const discardedUser = mongoose.Schema(
  {
    firstName: {
      type: String,
      default: "Job Portal",
    },
    lastName: { type: String, default: "discardedUser" },
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
    isBlocked: {
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
    otp: {
      type: Number,
      default: null,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const DiscardedUser = mongoose.model("discardedUser", discardedUser)

module.exports = DiscardedUser
