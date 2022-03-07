const Studentdata = require("../models/studentData")
const Practice = require("../models/codeQuiz")

exports.dashboarcodedata = (req, res) => {
  Practice.find(
    { college_id: req.body.college_id, type: "code" },
    (err, doc) => {
      if (err) console.log(err)
      else {
        Studentdata.find({ college_id: req.body.college_id }, (err1, doc1) => {
          let main = [],
            branch = [
              "cse",
              "ece",
              "eee",
              "mech",
              "civil",
              "cst",
              "mba",
              "mca",
            ],
            branchrate = {
              cse: 0,
              ece: 0,
              eee: 0,
              mech: 0,
              civil: 0,
              cst: 0,
              mba: 0,
              mca: 0,
            },
            hell = [],
            sum,
            a,
            tempdata = {}
          doc1.map((d) =>
            doc.map((documents) =>
              documents.ratings.map((e) =>
                e.mail == d.mail
                  ? main.push({ dept: d.department, ...e })
                  : null
              )
            )
          )
          branch.map(
            (e) => (
              (sum = 0),
              (a = []),
              (a = main.filter((s) => s.dept == e)),
              a.map((ad) => (sum = sum + parseFloat(ad.main))),
              sum > 0
                ? hell.push({
                  type: e,
                  rating: (sum / a.length).toFixed(2),
                  attended: a.length,
                })
                : hell.push({ type: e, rating: 0 })
            )
          )
          branch.map((e) => {
            mails = []
            conclude = []
            main.map((m) =>
              !mails.includes(m.mail) && m.dept == e ? mails.push(m.mail) : null
            )
            mails.forEach((g, i) => {
              sum = 0
              a = []
              a = main.filter((el) => el.mail == g)
              a.map((ad) => (sum = sum + parseFloat(ad.main)))
              b = g.split("@")
              conclude.push({
                roll: b[0],
                rate: (sum / a.length).toFixed(2),
              })
            })
            tempdata[e] = conclude
          })
          res.send({ message: hell, data: tempdata })
        })
      }
    }
  )
}

exports.dashboarquizdata = (req, res) => {
  Practice.find(
    { college_id: req.body.college_id, type: "quiz" },
    (err, doc) => {
      if (err) console.log(err)
      else {
        Studentdata.find({ college_id: req.body.college_id }, (err1, doc1) => {
          let main = [],
            branch = [
              "cse",
              "ece",
              "eee",
              "mech",
              "civil",
              "cst",
              "mba",
              "mca",
            ],
            branchrate = {
              cse: 0,
              ece: 0,
              eee: 0,
              mech: 0,
              civil: 0,
              cst: 0,
              mba: 0,
              mca: 0,
            },
            hell = []
          let sum,
            a,
            tempdata = {}
          doc1.map((d) =>
            doc.map((documents) =>
              documents.ratings.map((e) =>
                e.mail == d.mail
                  ? main.push({ dept: d.department, ...e })
                  : null
              )
            )
          )
          branch.map(
            (e) => (
              (sum = 0),
              (a = []),
              (a = main.filter((s) => s.dept == e)),
              a.map((ad) => (sum = sum + parseFloat(ad.main))),
              sum > 0
                ? hell.push({
                  type: e,
                  rating: (sum / a.length).toFixed(2),
                  attended: a.length,
                })
                : hell.push({ type: e, rating: 0 })
            )
          )
          branch.map((e) => {
            ; (mails = []), (conclude = [])
            main.map((m) =>
              !mails.includes(m.mail) && m.dept == e ? mails.push(m.mail) : null
            )
            mails.forEach((g, i) => {
              sum = 0
              a = []
              a = main.filter((el) => el.mail == g)
              a.map((ad) => (sum = sum + parseFloat(ad.main)))
              b = g.split("@")
              conclude.push({
                roll: b[0],
                rate: (sum / a.length).toFixed(2),
              })
            })
            tempdata[e] = conclude
          })
          res.send({ message: hell, data: tempdata })
        })
      }
    }
  )
}

exports.totaldata = (req, res) => {
  Practice.find({ college_id: req.body.college_id }, (err, doc) => {
    if (err) console.log(err)
    else {
      Studentdata.find({ college_id: req.body.college_id }, (err1, doc1) => {
        let main = [],
          branch = ["cse", "ece", "eee", "mech", "civil", "cst", "mba", "mca"],
          branchrate = {
            cse: 0,
            ece: 0,
            eee: 0,
            mech: 0,
            civil: 0,
            cst: 0,
            mba: 0,
            mca: 0,
          },
          hell = []
        doc1.map((d) =>
          doc.map((documents) =>
            documents.ratings.map((e) =>
              e.mail == d.mail ? main.push({ dept: d.department, ...e }) : null
            )
          )
        )
        console.log(main)
        let sum,
          a,
          tempdata = {}
        branch.map(
          (e) => (
            (sum = 0),
            (a = []),
            (a = main.filter((s) => s.dept == e)),
            a.map((ad) => (sum = sum + parseFloat(ad.main))),
            sum > 0
              ? hell.push({
                type: e,
                rating: (sum / a.length).toFixed(2),
              })
              : hell.push({ type: e, rating: 0 })
          )
        )
        branch.map((e) => {
          mails = []
          conclude = []
          main.map((m) =>
            !mails.includes(m.mail) && m.dept == e ? mails.push(m.mail) : null
          )
          mails.forEach((g, i) => {
            sum = 0
            a = []
            a = main.filter((el) => el.mail == g)
            a.map((ad) => (sum = sum + parseFloat(ad.main)))
            b = g.split("@")

            conclude.push({
              roll: b[0],
              rate: (sum / a.length).toFixed(2),
            })
          })
          tempdata[e] = conclude
        })
        res.send({ message: hell, data: tempdata })
      })
    }
  })
}
