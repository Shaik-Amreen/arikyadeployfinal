const Notifications = require("../models/notifications")

exports.notificationpost = (req, res) => {
  Notifications.create(req.body, (err, docs) => {
    !err ? res.send({ message: "success" }) : res.send({ message: "error" })
  })
}

exports.notificationget = (req, res) => {
  Notifications.find({ college_id: req.body.college_id }, (err, docs) => {
    !err ? res.send(docs.reverse()) : res.send({ message: "error" })
  })
}
