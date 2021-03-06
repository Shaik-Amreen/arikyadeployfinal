const express = require("express")
var router = express.Router()

const Mail = require("../controllers/placementStatus")

router.post("/updateplaced", Mail.updateplaced)
router.post("/singlestudent", Mail.singlestudent)
router.post("/sendmail", Mail.sendmail)
router.post("/eligible", Mail.eligible)
router.post("/checktoken", Mail.checktoken)
router.post("/updateregistered", Mail.updateregistered)
router.post("/checkregistered", Mail.checkregistered)
router.post("/checkmailnumber", Mail.checkmailnumber)
router.post("/checkrollnumber", Mail.checkrollnumber)
router.post("/addstu", Mail.addstu)
router.post("/applicants", Mail.applicants)
router.post("/dashboard", Mail.dashboard)
router.post("/updateofferletter", Mail.updateofferletter)
router.post("/notifyacceptreject", Mail.notifyacceptreject)
router.post("/adminplaced", Mail.adminplaced)
module.exports = router
