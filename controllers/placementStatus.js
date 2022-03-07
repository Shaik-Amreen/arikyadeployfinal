const nodemailer = require("nodemailer")
const verifyToken = require("./verifyToken")
const placementstatus = require("../models/placementStatus")
const studentdata = require("../models/studentData")
const placementdetails = require("../models/placementDetails")
const crypto = require("crypto")
const mailcollection = require("../models/mail")
const mail = require("./sendmail")

exports.sendmail =
  (verifyToken,
    (req, res, next) => {
      var sendlist = []
      placementdetails.findOne(
        {
          college_id: req.body.college_id,
          placementcyclename: req.body.placementcyclename,
        },
        (epla, placename) => {
          studentdata.find({ college_id: req.body.college_id }, (error, data) => {
            data = data.filter((a) =>
              placename.batch.some(
                (f) => f[0].batchvalue == parseInt(a.yearofjoining) + 4
              )
            )

            data = data.filter((a) =>
              req.body.eligibilties.some(
                (f) => f[0].course == a.course && f[0].department == a.department
              )
            )
            data = data.filter(
              (e) =>
                e.verified == "yes" &&
                e.freeze == "no" &&
                (req.body.gender != "malefemale"
                  ? req.body.gender == e.gender
                  : req.body.gender.includes(e.gender))
            )
            if (req.body.backlogs != "no") {
              data = data.filter(
                (a) =>
                  a.ongoingbacklogs <= req.body.minbl &&
                  a.totalbacklogs <= req.body.maxbl
              )
            } else if (req.body.backlogs == "no") {
              data = data.filter((a) => (a.ongoingbacklogs = 0))
            }
            data.forEach((a) => {
              if (
                a.tenthcgpa * 10 >= req.body.ten &&
                (a.intercgpa * 10 >= req.body.inter ||
                  a.intercgpa * 10 - 5 >= req.body.diploma) &&
                a.cgpa * 10 >= req.body.undergraduate
              ) {
                sendlist.push({ mail: a.mail, rollnumber: a.rollnumber })
              }
            })

            placementstatus.find(
              { college_id: req.body.college_id },
              (err, maildat) => {
                if (!err) {
                  var finalist = [],
                    maildata = [],
                    maxvalue = 0,
                    k
                  if (req.body.maximum != "" && maildat.length != 0) {
                    if (maildat.length > 2) {
                      for (let i = 0; i < maildat.length; i++) {
                        c = 0
                          ; (maxvalue = maildat[i].package), (k = i)
                        for (let j = i + 1; j < maildat.length; j++) {
                          c++
                          if (maildat[i].mail == maildat[j].mail) {
                            if (maxvalue < maildat[j].package) {
                              maxvalue = maildat[j].package
                              k = j
                            }
                            if (j + c == maildat.length) {
                              maildata.push(maildat[k])
                            }
                          } else if (j == maildat.length) {
                            maildata.push(maildat[k])
                          }
                        }
                      }
                    } else {
                      maildata = maildat
                    }
                    maildata.map((m) =>
                      sendlist.map((s) =>
                        s.mail == m.mail
                          ? m.package < req.body.maximum
                            ? finalist.push(s)
                            : null
                          : finalist.push(s)
                      )
                    )
                  } else {
                    finalist = sendlist
                  }
                  const token = crypto.randomBytes(32).toString("hex")
                  var mailist = []
                  for (let c of finalist) {
                    ; (c.companyname = req.body.companyname),
                      (c.joblocation = req.body.joblocation),
                      (c.placementcyclename = req.body.placementcyclename),
                      (c.registered = "no"),
                      (c.college_id = req.body.college_id),
                      (c.placed = "-"),
                      (c.date = new Date()),
                      (c.token = token),
                      (c.package = "not updated"),
                      (c.offerletter = ""),
                      (c.placeddate = ""),
                      (c.offerstatus = "-"),
                      (c.offerdate = ""),
                      (c.verifiedoffer = "-")
                    c.companylocation = "not yet"
                    mailist.push(c.mail)
                  }
                  let mailDetails = {
                    from: req.body.created,
                    to: mailist,
                    subject: `mits - Open for Applications of ${req.body.companyname}`,
                    html: `<p>Applications are now being accepted for <b>${req.body.companyname}</b> Jobprofile : &nbsp;<b>${req.body.jobprofiletitle}</b> - <b>${req.body.positiontype}</b>
<a href="http://localhost:4200/registration/${token}/${req.body.placementcyclename}/${req.body.companyname}">click here</a> to register.
For more details login to arikya</p><br/> Best Regards<br/> <b>mits<br/>Placements office</b>`,
                  }

                  let mailcontent = `Applications are now being accepted for ${req.body.companyname}. Jobprofile : ${req.body.companyprofiletitle} - ${req.body.positiontype} - click here to register.For more details login to arikya.Best Regards-mits-Placements office`
                  collectmail = { college_id: req.body.college_id, content: mailcontent, subject: mailDetails.subject }

                    (mail.send(mailDetails, mailcontent)) ? res.send({ message: "error" }) : (
                    placementstatus.create(finalist, (errors, md) => {
                      res.send({ message: 'success' })
                    }))
                }
              }
            )
          })
        }
      )
    })

exports.eligible =
  (verifyToken,
    (req, res, next) => {
      var sendlist = [],
        i
      placementdetails.findOne(
        {
          college_id: req.body.college_id,
          placementcyclename: req.body.placementcyclename,
        },
        (err1, docs1) => {
          let elyear = []
          if (docs1) {
            docs1.batch.forEach((e) => elyear.push(e[0].batchvalue))
          }

          studentdata.find({ college_id: req.body.college_id }, (error, data) => {
            data = data.filter((a) =>
              req.body.eligibilties.some(
                (f) => f[0].course == a.course && f[0].department == a.department
              )
            )

            data = data.filter((a) =>
              elyear.some((f) => f == parseInt(a.yearofjoining) + 4)
            )

            data = data.filter(
              (e) =>
                e.verified == "yes" &&
                e.freeze == "no" &&
                (req.body.gender != "malefemale"
                  ? req.body.gender == e.gender
                  : req.body.gender.includes(e.gender))
            )

            if (req.body.backlogs != "no") {
              data = data.filter(
                (a) =>
                  a.ongoingbacklogs <= req.body.minbl &&
                  a.totalbacklogs <= req.body.maxbl
              )
            } else if (req.body.backlogs == "no") {
              data = data.filter((a) => (a.ongoingbacklogs = 0))
            }

            data.forEach((a) => {
              if (
                a.tenthcgpa * 10 >= req.body.ten &&
                (a.intercgpa * 10 >= req.body.inter ||
                  a.intercgpa * 10 >= req.body.diploma) &&
                a.cgpa * 10 >= req.body.undergraduate
              ) {
                sendlist.push({ mail: a.mail, rollnumber: a.rollnumber })
              }
            })

            placementstatus.find(
              { college_id: req.body.college_id },
              (err, maildat) => {
                if (!err) {
                  var finalist = [],
                    maildata = [],
                    maxvalue = 0,
                    k
                  if (req.body.maximum != "" && maildat.length != 0) {
                    if (maildat.length > 2) {
                      for (let i = 0; i < maildat.length; i++) {
                        c = 0
                          ; (maxvalue = maildat[i].package), (k = i)
                        for (let j = i + 1; j < maildat.length; j++) {
                          c++
                          if (maildat[i].mail == maildat[j].mail) {
                            if (maxvalue < maildat[j].package) {
                              maxvalue = maildat[j].package
                              k = j
                            }
                            if (j + c == maildat.length) {
                              maildata.push(maildat[k])
                            }
                          } else if (j == maildat.length) {
                            maildata.push(maildat[k])
                          }
                        }
                      }
                    } else {
                      maildata = maildat
                    }
                    maildata.map((m) =>
                      sendlist.map((s) =>
                        s.mail == m.mail
                          ? m.package < req.body.maximum
                            ? finalist.push(s)
                            : null
                          : finalist.push(s)
                      )
                    )
                  } else {
                    finalist = sendlist
                  }
                  finalist = finalist.filter(
                    (v, i, a) => a.findIndex((t) => t.mail === v.mail) === i
                  )
                  placementstatus.find(
                    {
                      college_id: req.body.college_id,
                      placementcyclename: req.body.placementcyclename,
                      companyname: req.body.companyname,
                    },
                    (errs, docsmaildata) => {
                      var registered = docsmaildata.filter(
                        (e) => e.registered == "yes"
                      )
                      var placed = docsmaildata.filter((e) => e.placed == "yes")
                      res.send({
                        data: finalist,
                        rdata: registered,
                        edata: placed,
                      })
                    }
                  )
                }
              }
            )
          })
        }
      )
    })

exports.checktoken = (req, res) => {
  placementstatus.find(
    {
      college_id: req.body.college_id,
      placementcyclename: req.body.placementcyclename,
      companyname: req.body.companyname,
      token: req.body.token,
    },
    (err, docs) => {
      !err && docs.length != 0
        ? res.send({ message: "done" })
        : res.send({ message: "invalid" })
    }
  )
}

exports.checkregistered = (req, res) => {
  placementstatus.findOne(
    {
      college_id: req.body.college_id,
      mail: req.body.mail,
      companyname: req.body.companyname,
      placementcyclename: req.body.placementcyclename,
    },
    (err, docs) => {
      !err && docs
        ? docs.registered == "yes"
          ? res.send({ message: "success" })
          : null
        : res.send({ message: "error" })
    }
  )
}

exports.adminplaced =
  (verifyToken,
    (req, res) => {
      console.log(req.body)
      placementstatus.updateOne(
        {
          college_id: req.body.college_id,
          mail: req.body.mail,
          companyname: req.body.companyname,
          placementcyclename: req.body.placementcyclename,
        },
        { $set: req.body },
        (err, docs) => {
          !err ? res.send({ message: "success" }) : res.send({ message: "error" })
        }
      )
    })

exports.updateregistered =
  (verifyToken,
    (req, res) => {
      placementstatus.updateOne(
        {
          college_id: req.body.college_id,
          mail: req.body.mail,
          companyname: req.body.companyname,
          placementcyclename: req.body.placementcyclename,
        },
        { $set: { registered: "yes" } },
        (err, docs) => {
          !err ? res.send({ message: "success" }) : res.send({ message: "error" })
        }
      )
    })

exports.addstu = (verifyToken, (req, res) => {
  console.log(req.body)
  var finalist = []
  placementstatus.find(
    {
      college_id: req.body.college_id,
      placementcyclename: req.body.placementcyclename,
      companyname: req.body.presentcompany,
      placed: "yes",
    },
    (err, docs) => {
      if (!err) {
        placementstatus.find(
          {
            college_id: req.body.college_id,
            placementcyclename: req.body.placementcyclename,
            companyname: req.body.companyname,
          },
          (error, data) => {
            if (!error) {
              for (let c of docs) {
                let count = 0
                for (let i = 0; i < data.length; i++) {
                  if (c.mail == data[i].mail) {
                    count++
                  }
                }
                if (count == 0) {
                  finalist.push({ mail: c.mail, rollnumber: c.rollnumber })
                }
              }
              if (finalist.length > 0) {
                var mailist = []
                finalist.map((e) => mailist.push(e.mail))
                const token = crypto.randomBytes(32).toString("hex")
                for (let c of finalist) {
                  ; (c.companyname = req.body.companyname),
                    (c.joblocation = req.body.joblocation),
                    (c.placementcyclename = req.body.placementcyclename),
                    (c.registered = "no"),
                    (c.college_id = req.body.college_id),
                    (c.placed = "no"),
                    (c.date = new Date()),
                    (c.token = token),
                    (c.package = 0)
                }
                let mailDetails = {
                  from: "mits",
                  to: mailist,
                  subject: `mits - Open for Applications of ${req.body.companyname}`,
                  html: `<p>Applications are now being accepted for <b>${req.body.companyname}</b> Jobprofile : &nbsp;<b>${req.body.jobprofiletitle}</b> - <b>${req.body.positiontype}</b>
<a href="http://localhost:4200/registration/${token}/${req.body.placementcyclename}/${req.body.companyname}">click here</a> to register.
For more details login to arikya</p><br/> Best Regards<br/> <b>mits<br/>Placements office</b>`,
                }
                let mailcontent = `Applications are now being accepted for ${req.body.companyname}
                        Jobprofile : ${req.body.jobprofiletitle} - ${req.body.positiontype}
                        click here to register.
                        For more details login to arikya.
                        Best Regards-mits-Placements office`
                collectmail = { college_id: req.body.college_id, content: mailcontent, subject: mailDetails.subject }

                if (mail(mailDetails, collectmail)) { res.send({ message: "error" }) } else {
                  placementstatus.create(finalist, (errors, md) => {
                    res.send({ message: 'success' })
                  })
                }
              } else {
                res.send({ message: "success" })
              }
            }
          }
        )
      }
    }
  )
})

exports.updateplaced = (req, res) => {
  let count = 0
  for (let c of req.body.data) {
    placementstatus.updateOne(
      {
        college_id: req.body.college_id,
        rollnumber: c.rollnumber,
        registered: "yes",
        placementcyclename: c.placementcyclename,
        companyname: c.companyname,
      },
      {
        $set: { placed: "yes", joblocation: c.joblocation, package: c.package },
      },
      (err, docs) => {
        count++
        !err
          ? count == req.body.data.length
            ? res.send({ message: "success" })
            : null
          : count == req.body.data.length
            ? res.send({ message: "error" })
            : null
      }
    )
  }
}

exports.applicants =
  (verifyToken,
    (req, res, next) => {
      placementstatus.find(
        {
          college_id: req.body.college_id,
          placementcyclename: req.body.placementcyclename,
          companyname: req.body.companyname,
          registered: "yes",
        },
        (err, docs) => {
          studentdata.find({ college_id: req.body.college_id }, (error, data) => {
            if (!error) {
              data.map((e) =>
                e.ongoingbacklogs != ""
                  ? (e.ongoingbacklogs = parseInt(e.ongoingbacklogs))
                  : (e.ongoingbacklogs = 0)
              )
              res.send(data)
            }
          })
        }
      )
    })

// bbnnnnnnnnnnnnnn
//dashboard placements...
exports.dashboard =
  (verifyToken,
    (req, res, next) => {
      placementstatus.find({ college_id: req.body.college_id }, (err, docs) => {
        studentdata.find({ college_id: req.body.college_id }, (e1, d1) => {
          // let d2 = d1.eligibility
          // if (d2) {
          //     let stu = [], ds = [];
          //     d2.map(valid => d1.map(student => (
          //         (student.course == 'btech') ?
          ds = d1.filter((e) => docs.some((d) => d.rollnumber == e.rollnumber))
          res.send({ data: docs, total: d1.length, studentdata: ds })
        })
      })
    })

exports.checkrollnumber = (req, res) => {
  placementstatus.find(
    { colleged_id: req.body.college_id, rollnumber: req.body.rollnumber },
    (err, docs) => {
      !err ? res.send(docs) : res.send({ message: "error" })
    }
  )
}

exports.checkmailnumber = (req, res) => {
  placementstatus.find({ mail: req.body.mail }, (err, docs) => {
    !err ? res.send(docs) : res.send({ message: "error" })
  })
}

exports.notifyacceptreject = (req, res) => {
  placementstatus.find({ college_id: req.body.college_id }, (err, docs) => {
    !err
      ? (docs == null ? (docs = []) : null,
        (docs = docs.filter(
          (e) =>
            e.offerletter != "" && (e.placed == "-" || e.placed == "not yet")
        )),
        res.send(docs))
      : res.send({ message: "error" })
  })
}

exports.updateofferletter = (req, res) => {
  placementstatus.updateOne(
    {
      college_id: req.body.college_id,
      mail: req.body.mail,
      companyname: req.body.companyname,
    },
    { $set: req.body },
    (err, docs) => {
      !err ? res.send({ message: "success" }) : console.log(err)
    }
  )
}

exports.singlestudent = (req, res) => {
  const token = crypto.randomBytes(32).toString("hex")
  let mailDetails = {
    from: "mits",
    to: req.body.rollnumber + "@mits.ac.in",
    subject: `mits - Open for Applications of ${req.body.companyname}`,
    html: `<p>Applications are now being accepted for <b>${req.body.companyname}</b> Jobprofile : &nbsp;<b>${req.body.jobprofiletitle}</b> - <b>${req.body.positiontype}</b>
<a href="http://localhost:4200/registration/${token}/${req.body.placementcyclename}/${req.body.companyname}">click here</a> to register.
For more details login to arikya</p><br/> Best Regards<br/> <b>mits<br/>Placements office</b>`,
  }
  let c = {}
  c.companyname = req.body.companyname
  c.joblocation = req.body.joblocation
  c.placementcyclename = req.body.placementcyclename
  c.registered = "no"
  c.college_id = req.body.college_id
  c.placed = "no"
  c.date = new Date()
  c.token = token
  c.package = 0
  c.rollnumber = req.body.rollnumber
  c.mail = req.body.rollnumber + "@mits.ac.in"
  let mailcontent = `Applications are now being accepted for ${req.body.companyname}
        Jobprofile :${req.body.jobprofiletitle} -${req.body.positiontype}
        click here to register.
        For more details login to arikya.
        Best Regards-mits-Placements office`
  collectmail = { college_id: req.body.college_id, content: mailcontent, subject: mailDetails.subject }
  if (mail(mailDetails, collectmail)) { res.send({ message: "sucecss" }) } else {
    placementstatus.create(c, (errors, md) => {
      res.send({ message: 'success' })
    })
  }
}
