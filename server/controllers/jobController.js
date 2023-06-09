const expressAsyncHandler = require("express-async-handler")
const Jobs = require("../models/jobModal")
const { createSuccessResponse } = require("../utils/utils")

// @desc    fetch all Jobs
// @route   GET /api/job
// @access  Public
const getAllJobs = expressAsyncHandler(async (req, res) => {
  const { type } = req.query
  const keyword = type ? { industry: type } : {}
  const jobs = await Jobs.find({ ...keyword }).sort({
    createdAt: -1,
  })
  if (jobs) {
    createSuccessResponse(res, jobs)
  } else {
    res.status(400)
    throw new Error("Something went wrong")
  }
})

// @desc    create Job
// @route   POST /api/job
// @access  Public
const createJob = expressAsyncHandler(async (req, res) => {
  const newJob = await Jobs.create({ ...req.body })
  if (newJob) {
    createSuccessResponse(res, newJob, 201, "Job Created")
  } else {
    res.status(400)
    throw new Error("Something went wrong")
  }
})

// @desc    update Job
// @route   PUT /api/job/:_id
// @access  Public
const updateJob = expressAsyncHandler(async (req, res) => {
  const { _id } = req.params
  const newJob = await Jobs.findOneAndUpdate(
    {
      _id,
    },

    { ...req.body },
    { new: true }
  )
  if (newJob) {
    createSuccessResponse(res, newJob, 200, "Job Updated")
  } else {
    res.status(400)
    throw new Error(`No Job found`)
  }
})

// @desc    delete Job
// @route   DELETE /api/job/:_id
// @access  Public
const deleteJob = expressAsyncHandler(async (req, res) => {
  const { _id } = req.params
  const result = await Jobs.findOne({ _id })
  if (result) {
    await result.remove()
    const updatedJobs = await Jobs.find({}).sort({
      createdAt: -1,
    })
    createSuccessResponse(res, updatedJobs, 200, "Job Deleted  ")
  } else {
    res.status(404)
    throw new Error(`No Job found`)
  }
})

// @desc    delete Job
// @route   GET /api/job/:_id
// @access  Public
const getJobById = expressAsyncHandler(async (req, res) => {
  const { _id } = req.params
  const result = await Jobs.findOne({ _id })
  if (result) {
    createSuccessResponse(res, result, 200)
  } else {
    res.status(404)
    throw new Error(`No Job found`)
  }
})

module.exports = { getAllJobs, createJob, updateJob, deleteJob, getJobById }
