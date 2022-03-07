const companydetails = require("../models/companyDetails")
const jwt = require("jsonwebtoken")
var randomstring = require("randomstring")
const verifyToken = require("./verifyToken")
const Notifications = require("../models/notifications")
const mail = require("./sendmail")
const passcode = require("../models/passcodes")

exports.createcompanydetails = (verifyToken, (req, res, next) => {
  console.log("req.body", req.body)
  function sampost() {
    const ran = () => {
      return randomstring.generate(req.body.companyname.length)
    }
    let sran = ran()
    passcode.findOne({ code: sran }, (err2, docs2) => {
      if (err2 == null && docs2 == null) {
        req.body.code = sran
        passcode.create(
          { code: sran, college_id: req.body.college_id },
          (err1, docs1) => {
            companydetails.create(req.body, (err, data) => {
              console.log(err);
              (err) ? res.send({ message: 'error' }) : res.send({ message: "success" })
            })
          }
        )
      } else if (err2 == null && docs2 != null) {
        sampost()
      }
    })
  }
  sampost()
})

exports.updatecompanydetails =
  (verifyToken,
    (req, res, next) => {
      console.log("req.body",req.body)
      companydetails.updateOne(
        {
          college_id: req.body.college_id,
          placementcyclename: req.body.placementcyclename,
          companyname: req.body.companyname,
        },
        { $set: req.body },
        (err, data) => {
          err ? res.send({ message: "exists" }) :(console.log(data), res.send({ message: "success" }))
        }
      )
    })

exports.findcompany =
  (verifyToken,
    (req, res, next) => {
      console.log(req.body)
      companydetails.findOne(
        req.body,
        (err, data) => {
          console.log(err, data)
          err ? res.send(err) : res.send({ companydetails: data })
        }
      )
    })

exports.findplacementcompany =
  (verifyToken,
    (req, res, next) => {
      companydetails.findOne(
        {
          college_id: req.body.college_id,
          placementcyclename: req.body.placementcyclename,
        },
        function (err, docs) {
          if (err) {
            res.send("error")
          } else {
            if (!docs) {
              res.status(401).send("companydetails doesn't exists")
            } else {
              let payload = { subject: docs._batchname }
              let token = jwt.sign(payload, "JWTSECRET")
              res.status(200).send({ token })
            }
          }
        }
      )
    })

exports.findcalcompany = (req, res) => {
  companydetails.find({ college_id: req.body.college_id }, (err, docs) => {
    if (!err) {
      var eventData = []
      if (docs.length != 0) {
        docs.forEach((c) => {
          if (c.deadline != "not updated") {
            let a = {}
            a.Subject = c.companyname + " application deadline "
            a.StartTime = new Date(c.deadline)
            a.EndTime = new Date(c.deadline)
            eventData.push(a)
          }
          if (c.dateofvisit != "not updated") {
            let a = {}
            a.Subject = c.companyname + " date of visit "
            a.StartTime = new Date(c.dateofvisit)
            a.EndTime = new Date(c.dateofvisit)
            eventData.push(a)
          }
        })
      }
      res.send(eventData)
    } else
      console.log(
        "Error while retrieving all records : " +
        JSON.stringify(err, undefined, 2)
      )
  })
}

exports.findallcompanies = (req, res) => {
  companydetails.find({ college_id: req.body.college_id }, (err, docs) => {
    if (!err) {
      res.send(docs)
    } else
      console.log(
        "Error while retrieving all records : " +
        JSON.stringify(err, undefined, 2)
      )
  })
}

exports.findacompany = (req, res) => {
  companydetails.find(
    {
      college_id: req.body.college_id,
      placementcyclename: req.body.placementcyclename,
    },
    (err, docs) => {
      !err
        ? res.send(docs)
        : console.log(
          "Error while retrieving all records : " +
          JSON.stringify(err, undefined, 2)
        )
    }
  )
}

exports.updatestatus = (req, res) => {
  companydetails.updateOne(
    {
      college_id: req.body.college_id,
      placementcyclename: req.body.placementcyclename,
      companyname: req.body.companyname,
    },
    { $set: req.body },
    function (err, docs) {
      !err
        ? res.send({ data: req.body })
        : console.log(
          "error while retriving all records:",
          JSON.stringify(err, undefined, 2)
        )
    }
  )
}
