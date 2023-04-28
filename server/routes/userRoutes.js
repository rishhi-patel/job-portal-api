const {
  registerAdmin,
  loginAdmin,
  loginUser,
  updateUserProfile,
  getUserDetails,
  getCandidates,
  getCandidateById,
} = require("../controllers/userController")

const { protect } = require("../middleware/authMiddleware")

module.exports = (router) => {
  // public routes
  router.route("/user/admin/register").post(registerAdmin)
  router.route("/user/admin/login").post(loginAdmin)
  router.route("/user/login").post(loginUser)
  //   router.route("/user/password/:token").post(resetUserPassword)

  // private Routes
  router
    .route("/user/profile")
    .get(protect, getUserDetails)
    .post(protect, updateUserProfile)
  router.route("/user").get(protect, getCandidates)
  router.route("/user/:_id").get(protect, getCandidateById)
}
