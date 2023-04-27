const {
  registerAdmin,
  loginAdmin,
  loginUser,
} = require("../controllers/userController")

//  { loginUser, loginAdmin, registerAdmin }
module.exports = (router) => {
  // public routes
  router.route("/user/admin/register").post(registerAdmin)
  router.route("/user/admin/login").post(loginAdmin)
  router.route("/user/login").post(loginUser)
  //   router.route("/user/password/:token").post(resetUserPassword)

  // private Routes
  //   router
  //     .route("/user/profile")
  //     .get(protect, getUserDetails)
  //     .post(protect, updateUserDetails)
}
