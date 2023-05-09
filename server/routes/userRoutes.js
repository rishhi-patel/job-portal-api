const {
  registerAdmin,
  loginAdmin,
  loginUser,
  updateUserProfile,
  getUserDetails,
  getCandidates,
  getCandidateById,
  sendOTP,
  verifyOTP,
  resetUserPassword,
  getCountryList,
} = require("../controllers/userController")

const { protect } = require("../middleware/authMiddleware")

module.exports = (router) => {
  // public routes
  router.route("/user/admin/register").post(registerAdmin)
  router.route("/user/admin/login").post(loginAdmin)
  router.route("/user/login").post(loginUser)
  router.route("/user/admin/otp").post(sendOTP)
  router.route("/user/admin/verify-otp").post(verifyOTP)
  router.route("/user/admin/password/:token").post(resetUserPassword)
  router.route("/user/country").get(getCountryList)

  // private Routes
  router
    .route("/user/profile")
    .get(protect, getUserDetails)
    .post(protect, updateUserProfile)
  router.route("/user").get(protect, getCandidates)
  router.route("/user/:_id").get(protect, getCandidateById)
}
