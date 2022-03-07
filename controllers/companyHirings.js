const Mail = require("../models/placementStatus")
const comhir = require("../models/companyHirings")
const verifyToken = require("./verifyToken")

exports.createhirings =
  (verifyToken,
  (req, res, next) => {
    req.body.accepted.forEach((c, i) => {
      user = new comhir(c)
      user.save(function (err, results) {})
      if (req.body.accepted.length - 1 == i) {
        req.body.rejected.forEach((e, index) => {
          Mail.updateOne(
            {
              college_id: req.body.college_id,
              rollnumber: c.rollnumber,
              placementcyclename: c.placementcyclename,
              companyname: c.companyname,
            },
            { $set: { placed: "no" } },
            (err1, docs1) => {
              if (req.body.rejected.length - 1 == index) {
                res.send({ message: "success" })
              }
            }
          )
        })
      }
    })
  })

exports.updatehirings =
  (verifyToken,
  (req, res, next) => {
    comhir.deleteMany(
      {
        college_id: req.body.college_id,
        placementcyclename: req.body.accepted[0].placementcyclename,
        companyname: req.body.accepted[0].companyname,
        hiringflowname: req.body.accepted[0].hiringflowname,
      },
      (e, d) => {
        req.body.accepted.forEach((c, i) => {
          user = new comhir(c)
          user.save(function (err, results) {})
          Mail.updateOne(
            {
              college_id: req.body.college_id,
              rollnumber: c.rollnumber,
              placementcyclename: c.placementcyclename,
              companyname: c.companyname,
              placed: "no",
            },
            { $set: { placed: "" } },
            (err1, docs1) => {
              if (req.body.accepted.length - 1 == i) {
                res.send({ message: "success" })
              }
            }
          )
        })
      }
    )
  })

exports.findplacementwise =
  (verifyToken,
  (req, res, next) => {
    comhir.find(
      {
        college_id: req.body.college_id,
        placementcyclename: req.body.placementcyclename,
      },
      (err, docs) => {
        if (!err) {
          res.send(docs)
        }
      }
    )
  })

exports.findcompanywise =
  (verifyToken,
  (req, res, next) => {
    console.log(req.body, ";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;")
    comhir.find(
      {
        college_id: req.body.college_id,
        placementcyclename: req.body.placementcyclename,
        companyname: req.body.companyname,
      },
      (err, docs) => {
        if (!err) {
          res.send(docs)
        }
      }
    )
  })

exports.findstudentwise =
  (verifyToken,
  (req, res, next) => {
    comhir.find(
      {
        colleged_id: req.body.college_id,
        rollnumber: req.body.rollnumber,
        placementcyclename: req.body.placementcyclename,
      },
      (err, docs) => {
        if (!err) {
          res.send(docs)
        }
      }
    )
  })
