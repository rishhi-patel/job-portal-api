const mongoose = require("mongoose")

const jobsSchema = mongoose.Schema(
  {
 { type: String, required: true },
    jobPosition: 'Jr. Dev',
    jobDescription: 'Frontend Dev',
    requirement: 'react,redux',
    industry: 'IT',
    shifts: 'first',
    jobLocation: 'india',
    salary: 'Iei 10000 -  Iei 20000',
    aboutCompany: 'infotech.ltd',
    empowering: '',
    aboutCompany: '',
  },
  {
    timestamps: true,
  }
)

const Jobs = mongoose.model("Jobs", jobsSchema)

module.exports = Jobs
