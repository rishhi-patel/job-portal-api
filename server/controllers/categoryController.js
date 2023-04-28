const asyncHandler = require("express-async-handler")
const Category = require("../models/categoryModal")
const awsService = require("../utils/aws")
const sharp = require("sharp")
const { createSuccessResponse } = require("../utils/utils")

// @desc    Fetch all Categories
// @route   GET /api/Category
// @access  Private
const getCategories = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {}

  const count = await Category.countDocuments({})
  const data = await Category.find({ ...keyword }).sort({
    createdAt: -1,
  })
  createSuccessResponse(res, data)
})

// @desc    create Category
// @route   POST /api/Category
// @access  Private

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body
  const result = await Category.findOne({ name })
  if (result) {
    res.status(400)
    throw new Error(`Category already exist`)
  } else {
    if (req.file) {
      const newBuffer = await sharp(req.file.buffer).resize(255, 150).toBuffer()
      req.file.buffer = newBuffer
      const result = await awsService.uploadFile(req)
      const newCategory = new Category({
        name,
        image: result,
      })
      const createdCategory = await newCategory.save()
      createSuccessResponse(res, createdCategory, 201)
    } else {
      res.status(400)
      throw new Error(`Image is required`)
    }
    // const presigned = await awsService.getPreSignedURL(result.Key)
  }
})

// @desc  update Category
// @route   PUT /api/Category/:id
// @access  Private
const updateCategory = asyncHandler(async (req, res) => {
  const { _id } = req.params
  const { name } = req.body

  const result = await Category.findById({ _id })
  if (result) {
    if (req.file) {
      const newBuffer = await sharp(req.file.buffer).resize(320, 240).toBuffer()
      req.file.buffer = newBuffer
      const img = await awsService.uploadFile(req)
      result.image = img
    }
    result.name = name
    await result.save()
    // res.status(200).json(result)
    createSuccessResponse(res, result, 200)
  } else {
    res.status(404)
    throw new Error(`No Category found`)
  }
})

// @desc   delete Category
// @route   DELETE /api/Category/:id
// @access  Private
const deleteCategory = asyncHandler(async (req, res) => {
  const { _id } = req.params
  const result = await Category.findOne({ _id })
  if (result) {
    await result.remove()
    const updatedCatrgories = await Category.find({}).sort({
      createdAt: -1,
    })
    createSuccessResponse(
      res,
      updatedCatrgories,
      200,
      "Category Deleted Successfully"
    )
  } else {
    res.status(404)
    throw new Error(`No Category found`)
  }
})

module.exports = {
  getCategories,
  updateCategory,
  deleteCategory,
  createCategory,
}
