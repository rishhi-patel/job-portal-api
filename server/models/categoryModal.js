const mongoose = require("mongoose")

const categorySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { url: { type: String }, key: { type: String } },
  },
  {
    timestamps: true,
  }
)

const Category = mongoose.model("Category", categorySchema)

module.exports = Category
