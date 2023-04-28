const mongoose = require("mongoose")

const jobsSchema = mongoose.Schema(
  {
    jobPosition: { type: String, required: true },
    jobDescription: { type: String, required: true },
    requirement: { type: String, required: true },
    industry: { type: String, required: true },
    shifts: { type: String, required: true },
    jobLocation: { type: String, required: true },
    minSalary: { type: Number },
    maxSalary: { type: Number },
    aboutCompany: { type: String },
    empowering: { type: String },
  },
  {
    timestamps: true,
  }
)

const Jobs = mongoose.model("Jobs", jobsSchema)

module.exports = Jobs
