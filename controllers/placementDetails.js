const Placement = require("../models/placementDetails")
var randomstring = require("randomstring")
const verifyToken = require("./verifyToken")
const passcode = require("../models/passcodes")
exports.createPlacement = (verifyToken, (req, res, next) => {
  function sampost() {
    const ran = () => {
      return randomstring.generate(req.body.placementcyclename.length)
    }
    let sran = ran()
    passcode.findOne({ code: sran }, (err2, docs2) => {
      if (err2 == null && docs2 == null) {
        req.body.code = sran;
        Placement.create(req.body, (err, data) => {
          passcode.create(
            { code: sran, college_id: req.body.college_id },
            (err1, docs1) => { (err) ? res.send({ message: 'already exists' }) : res.send({ message: "success" }) })
        })
      }
      else if (err2 == null && docs2 != null) {
        sampost()
      }
    })
  }
  sampost()
})

exports.findonePlacement =
  (verifyToken,
    (req, res, next) => {
      Placement.findOne(
        {
          college_id: req.body.college_id,
          placementcyclename: req.body.placementcyclename,
        },
        function (err, docs) {
          err
            ? res.send({ message: "error" })
            : !docs
              ? res.send({ message: "placement doesn't exists" })
              : res.send({ message: "success", docs: docs })
        }
      )
    })

exports.findPlacement =
  (verifyToken,
    (req, res) => {
      Placement.find({ college_id: req.body.college_id }, (err, docs) => {
        !err ? res.send(docs) : res.send({ message: "error" })
      })
    })

    

exports.updatePlacement = (req, res) => {
  Placement.updateMany(
    {
      college_id: req.body.college_id,
      placementcyclename: req.body.placementcyclename,
    },
    { $set: req.body },
    (err, docs) => {
      !err ? res.send({ message: "success" }) : res.send({ message: "error" })
    }
  )
}
