const express = require("express")
var router = express.Router()
const data = require("../controllers/dataAccess")

router.post("/findcollegeaccess", data.findata)
router.post("/postcollegeaccess", data.postdata)
router.post("/updatecollegeaccess", data.updatedata)
router.post("/deletecollegeaccess", data.deletedata)

module.exports = router
