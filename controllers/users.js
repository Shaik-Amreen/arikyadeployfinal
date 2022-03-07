const Users = require("../models/users")
const Admin = require("../models/facultyData")
const Studentdata = require("../models/studentData")
const nodemailer = require("nodemailer")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const JWTSECRET = "amreenkousar"
const mailcollection = require("../models/mail")
const mail = require('./sendmail')
const data = require("../models/dataAccess")



const encodeBuffer = (buffer) => buffer.toString("base64")
const encodeString = (string) => encodeBuffer(Buffer.from(string))
const encodeData = (data) => encodeString(JSON.stringify(data))
const encrypt = (data) => {
  if (Buffer.isBuffer(data)) return encodeBuffer(data)
  if (typeof data === "string") return encodeString(data)
  return encodeData(data)
}

exports.createUsers = (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  const tokenHashed = encrypt(jwt.sign({ subject: req.body.mail }, JWTSECRET))
  Users.findOne({ college_id: req.body.college_id, mail: req.body.mail }, (err, docs) => {
    (docs || err) ? res.send({ message: 'USER ALREADY EXISTS ' }) :
      (req.body.role == 'admin' || req.body.role == 'faculty') ?
        Admin.create(req.body, (err1, docs1) => {
          (err1) ? res.send({ message: 'user already exists' }) :
            Users.create(req.body, (err2, docs2) => {
              data.findOne({ college_id: req.body.college_id }, (err6, docs6) => {
                console.log(docs6)
                let temp = Object.keys(docs6.access)
                for (let i = 0; i < temp.length; i++) {
                  if (docs6.access[temp[i]].includes(req.body.code)) {
                    req.body.role = temp[i]
                    if (err2) { return console.log(err2) }
                    else { return res.send({ message: 'success', user: req.body.mail, token: tokenHashed }) }
                  }
                }
              })
            })
        })
        : (req.body.role == 'student') ?
          Studentdata.findOne({ college_id: req.body.college_id, mail: req.body.mail }, (err3, docs3) => {
            (!err3) ? (docs3) ?
              Studentdata.updateOne({ college_id: req.body.college_id, mail: req.body.mail }, { $set: req.body },
                function (err4, docs4) {
                  (err4) ? res.send({ message: 'user already exists' }) :
                    Users.create(req.body, (err5, docs5) => {
                      (err5) ? res.send({ message: 'USER NOT ENROLLED' }) :
                        res.send({ message: 'success', user: req.body.mail, token: tokenHashed })
                    })
                })
              : res.send({ message: 'user is not enrolled' })
              : res.send({ message: err })
          })
          : null
  }
  )
}

exports.findoneUsers = async (req, res) => {
  const { mail, password } = req.body
  console.log(req.body)
  const user = await Users.findOne({ 'mail': mail }).lean(); console.log(user)
  const tokenHashed = encrypt(jwt.sign({ subject: req.body.mail }, JWTSECRET))

  if (user) {
    (bcrypt.compareSync(password, user.password)) ? (user.role !== 'student') ?
      Admin.findOne({ mail: user.mail }, function (err, docs) {
        console.log(err, docs, user);
        (err) ? res.send(err) : res.status(200).send({ 'token': tokenHashed, 'admindata': req.body.mail, 'status': 'ok', role: user.role, college_id: docs.college_id })
      }) :
      Studentdata.findOne({ mail: mail }, function (err, data) {
        (err) ? res.send(err) : res.status(200).send({ 'token': tokenHashed, 'admindata': req.body.mail, 'status': 'ok', role: "student", college_id: data.college_id })
      })
      :
      res.json({ status: 'error', error: "Invalid password" })
  }
  else {
    return res.json({ status: 'error', error: 'Invalid mail' })
  }
}

exports.findoneUserspass = async (req, res) => {
  const { mail } = req.body
  console.log(req.body)
  const user = await Users.findOne({ 'mail': mail }).lean(); console.log(user)
  if (user) {
    (user.role !== 'student') ?
      Admin.findOne({ mail: user.mail }, function (err, docs) {
        console.log(err, docs, user);
        (err) ? res.send(err) : res.status(200).send({ 'admindata': req.body.mail, 'status': 'ok', role: user.role, college_id: docs.college_id })
      }) :
      Studentdata.findOne({ mail: mail }, function (err, data) {
        (err) ? res.send(err) : res.status(200).send({ 'admindata': req.body.mail, 'status': 'ok', role: "student", college_id: data.college_id })
      });
  }
  else {
    return res.json({ status: 'error', error: 'Invalid mail' })
  }
}

exports.findUsers = (req, res) => {
  Users.find({ college_id: req.body.college_id }, (err, docs) => {
    !err
      ? res.send(docs)
      : console.log(
        "Error while retrieving all records : " +
        JSON.stringify(err, undefined, 2)
      )
  })
}

exports.updateoneUsers = (req, res) => {
  Users.updateOne(
    { college_id: req.body.college_id, mail: req.body.mail },
    { $set: req.body },
    function (err, docs) {
      Admin.updateMany(
        { college_id: req.body.college_id, mail: req.body.mail },
        { $set: req.body },
        function (er1r, kkkk) {
          !err ? res.send({ msg: "successs" }) : console.log("error")
        }
      )
    }
  )
}

exports.changepassword = (req, res) => {
  passwordhashed = bcrypt.hashSync(req.body.password, 10)
  console.log("passwordhashed", passwordhashed)
  Users.updateOne(
    { college_id: req.body.college_id, mail: req.body.mail },
    { $set: { password: passwordhashed } },
    function (err, docs) {
      !err ? (console.log("docs", docs), res.send({ message: "success" })) : res.send({ message: "error" })
    }
  )
}

exports.checkRole = (req, res) => {
  Users.find({ college_id: req.body.college_id }, (err, docs) => {
    err
      ? res.send(err)
      : docs.length == 0
        ? res.send({ role: "admin" })
        : res.send({ role: "student" })
  })
}

exports.forgotpassword = (req, res) => {
  console.log("req", req)
  Users.findOne(
    { college_id: req.body.college_id, mail: req.body.mail },
    (err, docs) => {
      if (!err && docs != null) {
        var digits = "0123456789"
        var OTP = ""
        for (let i = 0; i < 6; i++) {
          OTP += digits[Math.floor(Math.random() * 10)]
        }
        let mailDetails = {
          from: "placementscycle@mail.com",
          to: docs.mail,
          subject: "MITSPCELL",
          html: `<p>Hey ! ${OTP} is the OTP . </p>`,
        }
        let mailcontent = `Hey ! ${OTP} is the OTP .`
        collectmail = { college_id: req.body.college_id, content: mailcontent, subject: mailDetails.subject }
        if (mail(mailDetails, collectmail)) { res.send({ 'error': 'Connection is poor' }) } else { res.send({ 'otp': OTP }); }
      } else {
        res.send({ error: "error" })
      }
    }
  )
}
