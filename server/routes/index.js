const express = require("express")
const router = express.Router()
// config routers
require("./userRoutes")(router)
require("./categoryRoutes")(router)
require("./jobRoutes")(router)

module.exports = function (app) {
  app.get("/", (req, res) => res.send("API is running...."))
  app.use("/api/v1", router)
}
