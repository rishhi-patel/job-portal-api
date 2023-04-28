const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const { createSuccessResponse } = require("../utils/utils")
const generateToken = require("../utils/generateToken")
const User = require("../models/userModel")
const saltRounds = 10

// @desc    auth user
// @route   POST /api/user/auth
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, firstName, lastName } = req.body
  let existUser = null
  existUser = await User.findOne({ email })

  if (!existUser) {
    // create new user if not found
    existUser = await User.create({
      email,
      firstName,
      lastName,
    })
  }
  if (existUser) {
    createSuccessResponse(
      res,
      {
        token: generateToken(existUser._id),
        user: existUser,
      },
      200,
      "Login Success"
    )
  } else {
    res.status(400)
    throw new Error("Something went wrong")
  }
})

// @desc    auth user
// @route   GET /api/user/profile
// @access  Protected
const getUserDetails = asyncHandler(async (req, res) => {
  const { _id } = req.user
  const user = await User.findById(_id)
  if (user) {
    createSuccessResponse(res, user)
  } else {
    res.status(400)
    throw new Error("User Not Found")
  }
})

// @desc    auth user
// @route   POST /api/user/profile
// @access  Protected
const updateUserProfile = asyncHandler(async (req, res) => {
  const { _id } = req.user
  const existUser = await User.findOne({ _id })

  if (existUser) {
    const updatedUser = await User.findOneAndUpdate(
      {
        _id,
      },

      { ...req.body },
      { new: true }
    )
    createSuccessResponse(res, updatedUser, 200, "User Details Updated")
  } else {
    res.status(400)
    throw new Error("User Not Found")
  }
})

// @desc   auth user
// @route   POST /api/user/admin/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && user.isAdmin) {
    const ismatch = await bcrypt.compare(password, user.password)
    if (ismatch) {
      createSuccessResponse(
        res,
        {
          token: generateToken(user._id),
          user: user,
        },
        200,
        "Login Success"
      )
    } else {
      res.status(401)
      throw new Error("invalid password")
    }
  } else {
    res.status(401)
    throw new Error("Invalid email or password")
  }
})

// @desc   auth user
// @route   POST /api/user/admin/register
// @access  Public
const registerAdmin = asyncHandler(async (req, res) => {
  const { password, email } = req.body

  const salt = await bcrypt.genSalt(saltRounds)
  const passwordHash = await bcrypt.hash(password, salt)

  const user = await User.findOne({ email })
  if (user) {
    res.status(400)
    throw new Error("email is already registered")
  } else {
    const newUser = await User.create({
      password: passwordHash,
      email,
      firstName: "Admin",
      lastName: "User",
      isAdmin: true,
    })

    if (newUser) {
      createSuccessResponse(
        res,
        {
          token: generateToken(newUser._id),
          user: newUser,
        },
        200,
        "Login Success"
      )
    } else {
      res.status(400)
      throw new Error("Something went Wrong")
    }
  }
})

// @desc   get candidates
// @route   GET /api/user/
// @access  Private
const getCandidates = asyncHandler(async (req, res) => {
  const candidates = await User.find({ isAdmin: false }).sort({
    createdAt: -1,
  })

  if (candidates) {
    createSuccessResponse(res, candidates, 200)
  } else {
    res.status(400)
    throw new Error("candidates Not Found")
  }
})

// @desc   get candidates
// @route   GET /api/user/
// @access  Private
const getCandidateById = asyncHandler(async (req, res) => {
  const { _id } = req.params
  const candidate = await User.findOne({ _id })
  if (candidate) {
    createSuccessResponse(res, candidate, 200)
  } else {
    res.status(400)
    throw new Error("candidates Not Found")
  }
})

module.exports = {
  loginUser,
  loginAdmin,
  registerAdmin,
  updateUserProfile,
  getUserDetails,
  getCandidates,
  getCandidateById,
  getCandidateById,
}
