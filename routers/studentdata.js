const express = require("express")
var router = express.Router()

const Studentdata = require("../controllers/studentData")
router.post("/findstudentmail", Studentdata.findstudentmail)
router.post("/updatestudentdatac", Studentdata.updatestudentdatac)
router.post("/storefiles", Studentdata.storefile)
router.post("/findstudent", Studentdata.findstudent)
router.post("/updateverified", Studentdata.updateverified)
router.post("/askfreeze", Studentdata.askfreeze)
router.post("/studata", Studentdata.studata)
router.post("/createStudentdata", Studentdata.createStudentdata)
router.post("/askunfreeze", Studentdata.askunfreeze)
router.post("/updatedemoteyear", Studentdata.updatedemoteyear)
router.post("/updatedemoteyearstudent", Studentdata.updatedemoteyearstudent)
router.post("/updatebacklogs", Studentdata.updatebacklogs)
router.post("/updatemarks", Studentdata.updatemarks)

router.post("/updatestdacademic", Studentdata.updatestdacademic)

router.post("/updatestudentyear", Studentdata.updateyear)

module.exports = router
