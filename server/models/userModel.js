const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      default: "Job Portal",
    },
    lastName: { type: String, default: "User" },
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
    otp_verified: {
      type: Boolean,
      default: false,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    temp_mobile: {
      type: String,
      default: null,
    },
    temp_verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
