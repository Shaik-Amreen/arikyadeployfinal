const express = require("express")
var router = express.Router()

const Practice = require("../controllers/codeQuiz")

router.post("/uploadpractice", Practice.uploadpractice)
router.post("/ratingstudent", Practice.ratingstudent)
router.post("/gettopics", Practice.gettopics)
router.post("/getquestions", Practice.getquestions)
router.post("/checkanswer", Practice.checkanswer)
router.post('/editcodequiz', Practice.editpractice)
router.post("/viewattemptedquiz", Practice.viewattemptedquiz)
router.post("/quizratingstudent", Practice.quizratingstudent)

module.exports = router
