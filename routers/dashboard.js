const express = require("express")
var router = express.Router()
const dashboard = require("../controllers/dashboard")

router.post("/dashboardcodedata", dashboard.dashboarcodedata)
router.post("/dashboardquizdata", dashboard.dashboarquizdata)
router.post("/totaldata", dashboard.totaldata)

module.exports = router
