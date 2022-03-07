const Admin = require("../models/facultyData")
const verifyToken = require("./verifyToken")
const jwt = require("jsonwebtoken")

exports.findoneAdmin = (req, res) => {
  Admin.findOne(
    { college_id: req.body.college_id, mail: req.body.mail },
    function (err, docs) {
      err ? res.send("error") : res.status(200).send({ admindata: docs })
    }
  )
}

exports.findfacdata = (req, res) => {
  Admin.find({ college_id: req.body.college_id }, function (err, docs) {
    err ? res.send("error") : res.send(docs)
  })
}

exports.updateAdmin = (req, resp) => {
  Admin.updateMany(
    { college_id: req.body.college_id, mail: req.body.mail },
    { $set: req.body },
    function (err, res) {
      !err ? resp.send({ msg: "successs" }) : console.log("error")
    }
  )
}

exports.deleteoneAdmin = (req, res) => {
  Admin.updateOne(req.body, (err, docs) => {
    !err
      ? res.send({ message: "success" })
      : console.log(
          "error while  retrivieng all records: ",
          JSON.stringify(err, undefined, 2)
        )
  })
}
