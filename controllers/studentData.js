const Studentdata = require("../models/studentData")
const Practice = require("../models/codeQuiz")
const nodemailer = require("nodemailer")
const verifyToken = require("./verifyToken")
const multer = require("multer")
const Notifications = require("../models/notifications")
const mailcollection = require("../models/mail")
const data = require("../models/dataAccess")
const randomstring = require("randomstring")
const passcode = require("../models/passcodes")
const mail = require("./sendmail")


exports.findstudentmail =
  (verifyToken,
    (req, res, next) => {
      Studentdata.findOne(
        { college_id: req.body.college_id, mail: req.body.mail },
        (err, docs) => {
          if (!err) res.send({ data: docs })
          else res.send({ data: err })
        }
      )
    })

exports.updatestudentdatac = (req, res) => {
  Studentdata.updateOne(
    { college_id: req.body.college_id, mail: req.body.mail },
    { $set: req.body },
    function (err, docs) {
      if (!err) {
        Studentdata.updateOne(
          { college_id: req.body.college_id, mail: req.body.mail },
          { $set: req.body },
          (error, data) => {
            console.log("data is here:",data)
            res.send({ message: "success" })
          }
        )
      } else {
        console.log(
          "error while retriving all records:",
          JSON.stringify(err, undefined, 2)
        )
        res.send({ message: "error" })
      }
    }
  )
}

exports.storefile =
  (verifyToken,
    (req, res) => {
      Studentdata.updateOne(
        { college_id: req.body.college_id, mail: req.body.mail },
        { $set: { [req.body.filename]: req.body.filedata } },
        (err, docs) => {
          !err ? res.send({ message: "success" }) : console.log(err)
        }
      )
    })

exports.findstudent =
  (verifyToken,
    (req, res, next) => {
      Studentdata.findOne(
        { college_id: req.body.college_id, rollnumber: req.body.rollnumber },
        (err, docs) => {
          if (!err) {
            Notifications.findOne(
              {
                college_id: req.body.college_id,
                rollnumber: req.body.rollnumber,
                verified: "notyet",
              },
              (err1, docs1) => {
                if (docs1 == null) {
                  docs1 = []
                }
                res.send({ data: docs, notifications: docs1 })
              }
            )
          }
        }
      )
    })

exports.updateverified =
  (verifyToken,
    (req, res) => {
      Studentdata.updateOne(
        { college_id: req.body.college_id, rollnumber: req.body.rollnumber },
        { $set: { verified: req.body.verified } },
        function (err, data) {
          if (!err) {
            res.send({ data: req.body })
          } else {
            res.send({ message: "error" })
          }
        }
      )
    })

exports.askfreeze =
  (verifyToken,
    (req, res) => {
      console.log("req.body", req.body)

      let mailDetails = {
        from: "mits",
        to: [req.body.mail],
        subject: `mits - REJECTION OF PROFILE`,
        html: `<p>Your profile has been  <b>REJECTED . </b> Please refer <b>mits .</b>
       You will not recieve any updates regarding placements till your profile is accepted .
       <br/> <b>mits . <br/>Placements cycle</b> .`,
      }
      let mailcontent = "Your profile has been  REJECTED . Please refer mits .You will not recieve any updates regarding placements till your profile is accepted . mits . Placements cycle ."
      collectmail = { college_id: req.body.college_id, content: mailcontent, subject: mailDetails.subject }
      if (mail(mailDetails, collectmail)) {
        console.log('Error Occurs', err);
      } else {
        Studentdata.updateOne({ college_id: req.body.college_id, rollnumber: req.body.rollnumber }, { $set: { verified: req.body.verified, freeze: req.body.freeze } },
          function (err, data) {
            if (!err) {
              res.send({ data: req.body })
            }
            else {
              res.send({ message: 'error' })
            }
          })
      }
    })

exports.studata =
  (verifyToken,
    (req, res, next) => {
      Studentdata.find({ college_id: req.body.college_id }, function (err, docs) {
        if (err) {
          res.send("error")
        } else {
          docs.sort((a, b) =>
            a.rollnumber > b.rollnumber ? 1 : b.rollnumber > a.rollnumber ? -1 : 0
          )
          res.send({ data: docs })
        }
      })
    })

exports.createStudentdata =
  (verifyToken,
    (req, res, next) => {
      let user
      let sran = ""
      console.log(req.body)
      function sampost() {
        const ran = () => {
          return randomstring.generate(6)
        }
        sran = ran()
        passcode.findOne({ code: sran }, (err2, docs2) => {
          if (err2 == null && docs2 == null) {
            data.findOne(
              { college_id: req.body[0].college_id },
              (err3, docs3) => {
                console.log(docs3)
                docs3.access.student.push(sran)
                console.log(req.body)
                data.updateOne(
                  { college_id: req.body[0].college_id },
                  { $set: docs3 },
                  (err, docs) => {
                    passcode.create(
                      { code: sran, college_id: req.body[0].college_id },
                      (err1, docs1) => {
                        err || err1
                          ? res.send({ message: "error" })
                          : res.send({ message: "success" })
                      }
                    )
                  }
                )
              }
            )
          } else if (err2 == null) {
            sampost()
          }
        })
      }

      req.body = req.body.filter((e) => e.rollnumber != null)
      Studentdata.find({ college_id: req.body[0].college_id }, (errrs, sdata) => {
        req.body = req.body.filter(
          ({ rollnumber }) => !sdata.some((x) => x.rollnumber == rollnumber)
        )
        let mails = []
        req.body.forEach((e) => mails.push(e.mail))
        if (req.body.length != 0) {
          sampost()
          req.body.forEach((c, i) => {
            user = new Studentdata(c)
            user.save(function (err, results) {
              console.log(err, results)
            })
            if (i == req.body.length - 1) {
              let mailDetails = {
                from: "placementscycle@gmail.com",
                to: mails,
                subject: `Registrations for Arikya testtingg `,
                html: `${sran} passcode`,
              }
              mailcontent = mailDetails.html
              collectmail = { college_id: req.body.college_id, content: mailcontent, subject: mailDetails.subject }

              if(mail(mailDetails, collectmail)) { res.send({ message: "error" })} else{
                mailcollection.create({ college_id: req.body.college_id, content: mailDetails }, (er, d) => {
                  er ? console.log(er) : res.send({ message: "success" })
                })}
            }
          })
        } else {
          res.send({ message: "success" })
        }
      })
    })

exports.askunfreeze =
  (verifyToken,
    (req, res) => {
      Studentdata.updateOne(
        { college_id: req.body.college_id, rollnumber: req.body.rollnumber },
        { $set: { verified: req.body.verified, freeze: req.body.freeze } },
        function (err, data) {
          if (!err) {
            console.log("askunfreeze", data)
            res.send({ data: req.body })
          } else {
            res.send({ message: "error" })
          }
        }
      )
    })

exports.updatedemoteyear = (req, res) => {
  Studentdata.updateMany(
    {
      college_id: req.body.college_id,
      currentyear: req.body.currentyear,
      course: req.body.course,
    },
    { $set: { currentyear: req.body.present } },
    function (err, data) {
      if (!err) {
        res.send({ message: "success" })
      } else {
        res.send({ message: "error" })
      }
    }
  )
}

exports.updatedemoteyearstudent =
  (verifyToken,
    (req, res, next) => {
      let n = 0
      req.body.data.forEach((c, i) => {
        Studentdata.findOne(
          {
            college_id: req.body.college_id,
            rollnumber: c.rollnumber,
            currentyear: { $ne: "1" },
          },
          (err, data) => {
            if (err) {
              if (i + 1 == req.body.data.length) {
                return res.status(200).send({ message: "success" })
              }
            } else {
              if (data != null) {
                Studentdata.updateOne(
                  { college_id: req.body.college_id, rollnumber: c.rollnumber },
                  { $set: { currentyear: data.currentyear - 1 } },
                  (error, d) => {
                    if (i + 1 == req.body.data.length) {
                      return res.status(200).send({ message: "success" })
                    }
                  }
                )
              } else {
                if (i + 1 == req.body.data.length) {
                  return res.status(200).send({ message: "success" })
                }
              }
            }
          }
        )
      })
    })

exports.updatestdacademic = (req, resp) => {
  Studentdata.updateMany(
    { college_id: req.body.college_id, studentmail: req.body.studentmail },
    { $set: req.body },
    function (err, res) {
      if (!err) {
        console.log("updated Successfully")
        resp.send({ message: "success" })
      } else {
        console.log(
          "error while retriving all records:",
          JSON.stringify(err, undefined, 2)
        )
      }
    }
  )
}

exports.updatebacklogs = (req, res) => {
  let n = 0
  req.body.data.forEach((c) => {
    Studentdata.updateMany(
      { college_id: req.body.college_id, rollnumber: c.rollnumber },
      {
        $set: {
          ongoingbacklogs: c.ongoingbacklogs,
          totalbacklogs: c.totalbacklogs,
        },
      },
      function (err, data) {
        if (!err) {
          n++
          if (n == req.body.data.length - 1) {
            res.send({ message: "success" })
          }
        } else {
          n++
          if (n == req.body.data.length - 1) {
            res.send({ message: "error" })
          }
        }
      }
    )
  })
}

exports.updatemarks = (req, res) => {
  const seme = req.body.sem
  req.body.data.forEach((c, i) => {
    Studentdata.findOne(
      { college_id: req.body.college_id, rollnumber: c.rollnumber },
      (err1, docs1) => {
        if (docs1 != null) {
          if (docs1.sgpa.length == 0) {
            docs1.sgpa.push({ [seme]: c[seme] })
          } else {
            let ex = docs1.sgpa.flat(1)
            let kel = []
            ex.forEach((k) => {
              kel.push(...Object.keys(k))
            })
            if (kel.indexOf(seme) != -1) {
              let ins = kel.indexOf(seme)
              docs1.sgpa[ins][seme] = c[seme]
            } else {
              docs1.sgpa.push({ [seme]: c[seme] })
            }
          }
          Studentdata.updateMany(
            { college_id: req.body.college_id, rollnumber: c.rollnumber },
            {
              $set: {
                sgpa: docs1.sgpa,
                cgpa: c.cgpa,
              },
            },
            function (err, data) {
              if (!err) {
                if (i == req.body.data.length - 1) {
                  res.send({ message: "success" })
                }
              } else {
                if (i == req.body.data.length - 1) {
                  res.send({ message: "error" })
                }
              }
            }
          )
        } else if (i == req.body.data.length - 1) {
          res.send({ message: "success" })
        }
      }
    )
  })
}

exports.updateyear = (req, res) => {
  Studentdata.updateMany(
    {
      college_id: req.body.college_id,
      currentyear: req.body.currentyear,
      course: req.body.course,
    },
    { $set: { currentyear: req.body.present } },
    function (err, data) {
      console.log(err, data)
      if (!err) {
        res.send({ message: "success" })
      } else {
        res.send({ message: "error" })
      }
    }
  )
}
