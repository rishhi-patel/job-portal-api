const {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController.js")
const { protect } = require("../middleware/authMiddleware.js")

module.exports = (router) => {
  // public routes

  // private Routes
  router.route("/job").get(getAllJobs).post(protect, createJob)
  router.route("/job/:_id").put(protect, updateJob).delete(protect, deleteJob)
}
