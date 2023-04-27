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
    createSuccessResponse(res, {
      token: generateToken(existUser._id),
      user: existUser,
    })
  } else {
    res.status(400)
    throw new Error("Something went wrong")
  }
})

// @desc   auth user
// @route   POST /api/user/admin/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user) {
    const ismatch = await bcrypt.compare(password, user.password)
    if (ismatch) {
      createSuccessResponse(res, {
        token: generateToken(user._id),
        user: user,
      })
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
      const accessToken = generateToken(newUser._id)
      createSuccessResponse(res, { accessToken })
    } else {
      res.status(400)
      throw new Error("Something went Wrong")
    }
  }
})

module.exports = { loginUser, loginAdmin, registerAdmin }
