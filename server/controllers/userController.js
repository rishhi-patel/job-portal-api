const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {
  createSuccessResponse,
  createErrorResponse,
} = require("../utils/utils");
const generateToken = require("../utils/generateToken");
const User = require("../models/userModel");
const DiscardedUser = require("../models/discardedUserModal");
const jwt = require("jsonwebtoken");
const { getNames } = require("country-list");
const { sendOtpToMobile } = require("../utils/smsService");
const smsService = require("../utils/smsService");
const saltRounds = 10;

// @desc    auth user
// @route   POST /api/user/auth
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, firstName, lastName } = req.body;
  let existUser = null;
  existUser = await User.findOne({ email });

  if (!existUser) {
    // create new user if not found
    existUser = await User.create({
      email,
      firstName,
      lastName,
    });
  }
  if (existUser && !existUser.isBlocked) {
    createSuccessResponse(
      res,
      {
        token: generateToken(existUser._id),
        user: existUser,
      },
      200,
      "Login Success"
    );
  } else {
    res.status(400);
    throw new Error("User Blocked");
  }
});

// @desc    auth user
// @route   GET /api/user/profile
// @access  Protected
const getUserDetails = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  if (user) {
    createSuccessResponse(res, user);
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
});

// @desc    auth user
// @route   POST /api/user/profile
// @access  Protected
const updateUserProfile = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const existUser = await User.findOne({ _id });

  if (existUser) {
    const updatedUser = await User.findOneAndUpdate(
      {
        _id,
      },

      { ...req.body, profileCompleted: true },
      { new: true }
    );
    console.log({ updatedUser });
    createSuccessResponse(res, updatedUser, 200, "User Details Updated");
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
});

// @desc   auth user
// @route   POST /api/user/admin/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && user.isAdmin) {
    const ismatch = await bcrypt.compare(password, user.password);
    if (ismatch) {
      createSuccessResponse(
        res,
        {
          token: generateToken(user._id),
          user,
        },
        200,
        "Login Success"
      );
    } else {
      res.status(401);
      throw new Error("invalid password");
    }
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc   auth user
// @route   POST /api/user/admin/register
// @access  Public
const registerAdmin = asyncHandler(async (req, res) => {
  const { password, email } = req.body;

  const salt = await bcrypt.genSalt(saltRounds);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.findOne({ email });
  if (user) {
    res.status(400);
    throw new Error("email is already registered");
  } else {
    const newUser = await User.create({
      password: passwordHash,
      email,
      firstName: "Admin",
      lastName: "User",
      isAdmin: true,
    });

    if (newUser) {
      createSuccessResponse(
        res,
        {
          token: generateToken(newUser._id),
          user: newUser,
        },
        200,
        "Login Success"
      );
    } else {
      res.status(400);
      throw new Error("Something went Wrong");
    }
  }
});

// @desc   get candidates
// @route   GET /api/user/
// @access  Private
const getCandidates = asyncHandler(async (req, res) => {
  const candidates = await User.find({ isAdmin: false }).sort({
    createdAt: -1,
  });

  if (candidates) {
    createSuccessResponse(res, candidates, 200);
  } else {
    res.status(400);
    throw new Error("candidates Not Found");
  }
});

// @desc   get candidates
// @route   GET /api/user/
// @access  Private
const getCandidateById = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const candidate = await User.findOne({ _id });
  if (candidate) {
    createSuccessResponse(res, candidate, 200);
  } else {
    res.status(400);
    throw new Error("candidates Not Found");
  }
});

// @desc    Auth user & get OTP
// @route   POST /api/user/admin/generate-otp
// @access  Public
const sendOTP = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { phoneNumber1 } = req.body;
  let existUser = null;
  const otp = smsService.generateOTP();
  existUser = await User.findOne({ _id });
  let phoneexistUser = await User.findOne({ phoneNumber1 });
  if (phoneexistUser) {
    createErrorResponse(res, "This number already use", 400);
  } else if (!phoneexistUser && existUser) {
    await smsService.sendOtpToMobile(phoneNumber1, otp);
    existUser.otp = otp;
    const updatedUser = await User.findOneAndUpdate(
      {
        _id,
      },
      { otp, temp_mobile: phoneNumber1, temp_verified: true },
      { new: true }
    );
    await existUser.save();
    createSuccessResponse(res, updatedUser, 200, "otp sent successfully");
  }
});

// @desc    verify OTP
// @route   POST /api/user/admin/verify-otp
// @access  Public
const verifyOTP = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const { phoneNumber1, otp } = req.body;
  const existUser = await User.findOne({ email });
  if (existUser && existUser.otp === otp) {
    existUser.otp = null;
    existUser.otp_verified = true;
    existUser.temp_mobile = false;
    existUser.temp_verified = false;
    existUser.phoneNumber1 = phoneNumber1;
    await existUser.save();
    createSuccessResponse(res, "", 200, "OTP verified ");
  } else {
    res.status(400);
    throw new Error("error");
  }
});

// @desc   resetUserDetails
// @route   POST /api/user/admin/reset-password
// @access  public
const resetUserPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  const salt = await bcrypt.genSalt(saltRounds);
  const passwordHash = await bcrypt.hash(password, salt);

  if (decoded && decoded.id) {
    if (user) {
      user.password = passwordHash;
      await user.save();
      createSuccessResponse(res, {}, 200, "Password changed  ");
    } else {
      res.status(400);
      throw new Error("user either blocked or not available");
    }
  } else {
    res.status(401);
    throw new Error("Token Expired");
  }
});
// @desc   get country list
// @route   GET /api/user/country
// @access  public
const getCountryList = asyncHandler(async (req, res) => {
  createSuccessResponse(
    res,
    ["Romania", ...getNames().filter((country) => country !== "Romania")],
    200
  );
});

// @desc  update candidate
// @route   UPDATE /api/candidate/:_ic
// @access  public
const updateCandidateDetails = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const existUser = await User.findOne({ _id });

  if (existUser) {
    const updatedUser = await User.findOneAndUpdate(
      {
        _id,
      },
      { ...req.body },
      { new: true }
    );
    createSuccessResponse(res, updatedUser, 200, "Candidate Details Updated");
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
});

// @desc  update candidate
// @route   PATCH /api/candidate/:_ic
// @access  public
const blockUnBlockCandidate = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const { isBlocked } = req.body;
  const existUser = await User.findOne({ _id });

  if (existUser) {
    const updatedUser = await User.findOneAndUpdate(
      {
        _id,
      },
      { isBlocked },
      { new: true }
    );
    if (isBlocked)
      createSuccessResponse(res, updatedUser, 200, "Candidate Blocked");
    else createSuccessResponse(res, updatedUser, 200, "Candidate Unblocked");
  } else {
    res.status(400);
    throw new Error("Candidate Not Found");
  }
});

// @desc  delete account
// @route   DELETE /api/user
// @access  private
const deleteUserAccount = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const existUser = await User.findOne({ _id }).lean();

  if (existUser) {
    // move user to discarded
    await DiscardedUser.create({ ...existUser });
    await User.findOneAndDelete({ _id });
    createSuccessResponse(res, null, 200, "Account Deleted");
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
});

// @desc  send profile otp
// @route   POST /api/user/generate-otp
// @access  public

const sendProfileOTP = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const { phoneNumber1 } = req.body;
  let existUser = null;
  const otp = smsService.generateOTP();
  existUser = await User.findOne({ _id });
  if (existUser) {
    await smsService.sendOtpToMobile(phoneNumber1, otp);
    existUser.otp = otp;
    const updatedUser = await User.findOneAndUpdate(
      {
        _id,
      },
      { otp },
      { new: true }
    );
    await existUser.save();
    createSuccessResponse(res, updatedUser, 200, "otp sent successfully");
  } else {
    res.status(401);
    throw new Error("mobile number not registerd");
  }
});

// @desc    verify OTP
// @route   POST /api/user/verify-otp
// @access  Public

const verifyProfileOTP = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const { phoneNumber1, otp } = req.body;
  const existUser = await User.findOne({ email });
  const ismobileNumber = await User.findOne({ phoneNumber1 });
  if (ismobileNumber) {
    res.status(400);
    throw new Error("number already register");
  }
  if (existUser && existUser.otp === otp) {
    existUser.otp = null;
    existUser.otp_verified = true;
    await existUser.save();
    createSuccessResponse(res, "", 200, "OTP verified ");
  } else {
    res.status(400);
    throw new Error("Invalid OTP");
  }
});

module.exports = {
  loginUser,
  loginAdmin,
  registerAdmin,
  updateUserProfile,
  getUserDetails,
  getCandidates,
  getCandidateById,
  sendOTP,
  verifyOTP,
  sendProfileOTP,
  verifyProfileOTP,
  resetUserPassword,
  getCountryList,
  updateCandidateDetails,
  blockUnBlockCandidate,
  deleteUserAccount,
};
