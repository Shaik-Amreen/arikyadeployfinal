const Studentdata = require("../models/studentData")
const Notifications = require("../models/detailsVerification")

exports.notificationpost = (req, res) => {
  req.body.forEach((e, i) => {
    Notifications.create(e, (err, docs) => {
      console.log(err, docs)
      !err && i == req.body.length - 1
        ? res.send({ message: "success" })
        : i == req.body.length - 1
        ? res.send({ message: "error" })
        : null
    })
  })
}

exports.notificationget = (req, res) => {
  Notifications.find({ college_id: req.body.college_id }, (err, docs) => {
    !err ? res.send(docs) : res.send({ message: "error" })
  })
}

exports.notificationupdate = (req, res) => {
  Notifications.updateOne(
    { college_id: req.body.college_id, rollnumber: req.body.rollnumber },
    { $set: req.body },
    (err, docs) => {
      !err
        ? Notifications.findOne(
            {
              college_id: req.body.college_id,
              rollnumber: req.body.rollnumber,
              field: req.body.field,
              date: req.body.date,
            },
            (err1, docs1) => {
              if (!err1 && docs1 != null) {
                Studentdata.updateOne(
                  {
                    college_id: req.body.college_id,
                    rollnumber: req.body.rollnumber,
                  },
                  { $set: { [docs1.field]: docs1.current } },
                  (err3, docs3) => {
                    !err3
                      ? res.send({ message: "success" })
                      : console.log(
                          "error while retriving all records:",
                          JSON.stringify(err, undefined, 2)
                        )
                  }
                )
              }
            }
          )
        : res.send({ message: "error" })
    }
  )
}
