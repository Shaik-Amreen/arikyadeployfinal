const data = require("../models/dataAccess")
var randomstring = require("randomstring")
const passcode = require("../models/passcodes")
const nodemailer = require("nodemailer")
const mailcollection = require("../models/mail")
const mail = require("./sendmail")


exports.findata = (req, res, next) => {
  passcode.findOne({ code: req.body.passcode }, (err0, docs0) => {
    if (err0 || docs0 == null) {
      res.send({ message: "error" })
    } else {
      data.findOne({ college_id: docs0.college_id }, (err, docs) => {
        console.log("docs", docs)
        if (err || docs == null) {
          res.send({ message: "error" })
        } else {
          let temp = Object.keys(docs.access)
          for (let i = 0; i < temp.length; i++) {
            if (docs.access[temp[i]].includes(req.body.passcode)) {
              return res.send({ message: temp[i], college_id: docs0.college_id })
            } else if (i == temp.length - 1) {
              return res.send({ message: "error" })
            }
          }
        }
      })
    }
  })
}

exports.postdata = (req, res, next) => {
  function sampost() {
    const ran = () => {
      return randomstring.generate(6)
    }
    let sran = ran()
    passcode.findOne({ code: sran }, (err2, docs2) => {
      if (err2 == null && docs2 == null) {
        req.body.access[req.body.role].push(sran)
        req.body.adminmails.push(req.body.mail)
        data.create(req.body, (err, docs) => {
          passcode.create(
            { code: sran, college_id: req.body.college_id },
            (err1, docs1) => {
              let mailDetails = {
                from: "placementscycle@gmail.com",
                to: [req.body.mail],
                subject: `Registrations for Arikya testtingg `,
                html: `${sran} passcode`,
              }

              var mailcontent = mailDetails['html']
              var collectmail = { college_id: req.body.college_id, content: mailcontent, subject: mailDetails.subject }
              if (mail(mailDetails, collectmail)) { res.send({ message: 'error' }) } else { res.send({ message: 'success' }); }

              //  mailcontent = mailDetails['html']
              //   (mail(mailDetails, { college_id: req.body.college_id, content: mailcontent, subject: mailDetails.subject })) ? res.send({ message: 'error' }) : res.send({ message: 'success' });

            }
          )
        })
      } else if (err2 == null && docs != null) {
        sampost()
      }
    })
  }
  sampost()
}
exports.updatedata = (req, res, next) => {
  function sampost() {
    const ran = () => {
      return randomstring.generate(6)
    }
    let sran = ran()
    passcode.findOne({ code: sran }, (err2, docs2) => {
      if (err2 == null && docs2 == null) {
        data.findOne({ college_id: req.body.college_id }, (err3, docs3) => {
          console.log(docs3, req.body)
          docs3.access[req.body.role].push(sran)
          if (req.body.role == "admin") {
            docs3.adminmails.push(req.body.mail)
          }
          data.updateOne(
            { college_id: req.body.college_id },
            { $set: docs3 },
            (errs, docs) => {
              passcode.create(
                { code: sran, college_id: req.body.college_id },
                (err1, docs1) => {
                  let mailDetails = {
                    from: "placementscycle@gmail.com",
                    to: req.body.mail,
                    subject: `Registrations for Arikya testtingg `,
                    html: `${sran} passcode`,
                  }
                  mailcontent = mailDetails.html
                  collectmail = { college_id: req.body.college_id, content: mailcontent, subject: mailDetails.subject }
                  if (mail(mailDetails, collectmail)) { res.send({ message: 'error' }) } else { res.send({ message: 'success' }); }
                }
              )
            }
          )
        })
      } else if (err2 == null) {
        sampost()
      }
    })
  }
  sampost()
}

exports.deletedata = (req, res, next) => {
  data.deleteOne(
    { college_id: req.body.college_id },
    { $set: req.body },
    (err, docs) => {
      err ? res.send({ message: "error" }) : res.send({ message: "success" })
    }
  )
}
