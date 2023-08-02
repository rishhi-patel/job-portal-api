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
  updateCandidateDetails,
  deleteUserAccount,
  blockUnBlockCandidate,
  sendProfileOTP,
  verifyProfileOTP,
} = require("../controllers/userController")

const { protect, admin } = require("../middleware/authMiddleware")

module.exports = (router) => {
  // public routes
  router.route("/user/admin/register").post(registerAdmin)
  router.route("/user/admin/login").post(loginAdmin)
  router.route("/user/login").post(loginUser)
  router.route("/user/admin/password/:token").post(resetUserPassword)
  router.route("/user/country").get(getCountryList)
  router.route("/user/generate-otp/:_id").put(sendProfileOTP)
  router.route("/user/verify-otp").post(protect, verifyProfileOTP)
  // private Routes
  router.route("/user/profile/otp").post(protect, sendOTP)
  router.route("/user/profile/verify-otp").post(protect, verifyOTP)
  router
    .route("/user/profile")
    .get(protect, getUserDetails)
    .post(protect, updateUserProfile)
  router
    .route("/user")
    .get(protect, getCandidates)
    .delete(protect, deleteUserAccount)
  router.route("/user/:_id").get(protect, getCandidateById)
  // admin routes
  router.route("/candidate/:_id").put(protect, admin, updateCandidateDetails)
  router
    .route("/candidate/:_id/block")
    .patch(protect, admin, blockUnBlockCandidate)
}
