const Practice = require("../models/codeQuiz")
const fs = require("fs")
let { PythonShell } = require("python-shell")

exports.uploadpractice = (req, res) => {
  Practice.findOne(
    {
      college_id: req.body.college_id,
      topic: req.body.topic,
      type: req.body.type,
    },
    function (err, docs1) {
      if (err) {
        res.send("error")
      } else {
        if (docs1) {
          res.send({ message: "Test topic name already exists" })
        } else {
          console.log(req.body)
          Practice.create(req.body, function (error, doc2) {
            if (error) {
              console.log(error)
              res.send({ message: "error" })
            } else {
              res.status(200).send({ message: "success" })
            }
          })
        }
      }
    }
  )
}

exports.editpractice = (req, res) => {
  Practice.updateOne({ college_id: req.body.college_id, topic: req.body.topic, type: req.body.type }, { $set: req.body }, (err, docs) => {
    res.send({ message: "success" })
  })
}

exports.gettopics = (req, res) => {
  Practice.find(
    { college_id: req.body.college_id, type: req.body.type },
    function (err, docs1) {
      if (err) {
        res.send("error")
      } else {
        console.log("docs1:",docs1)
        res.status(200).send(docs1.reverse())
      }
    }
  )
}

exports.getquestions = (req, res) => {
  Practice.findOne(
    { college_id: req.body.college_id, topic: req.body.topic, type: req.body.type },
    function (err, docs) {
      if (err) {
        res.send("error")
      } else {
        console.log("docs", docs)
        res.send(docs)
      }
    }
  )
}

exports.checkanswer = (req, res) => {
  let inarr = ["inputone", "inputtwo", "inputthr"]
  outarr = [
    req.body.question[0].outputone,
    req.body.question[0].outputtwo,
    req.body.question[0].outputthr,
  ]
  var results = []
  var fin = 0
  for (let v = 0; v < inarr.length; v++) {
    let i = inarr[v]
    let options = {
      mode: "text",
      pythonOptions: ["-u"],
      args: [req.body.question[0][i]],
    }

    PythonShell.runString(req.body.ans, options, function (err, result) {
      if (!err && result) {
        let a = result.length - 1
        result[a] = result[a].trim()

        result = result.join(" ")

        if (outarr[v] == result) {
          fin++
          results.push(`TEST CASE ${v + 1} PASSED`)
          if (fin == 3) {
            Practice.findOne({ topic: req.body.topic }, function (error, docs1) {
              if (error) {
                console.log(error)
                return res.send("error")
              } else {
                for (let d of docs1.questions) {
                  if (req.body.question[0].questionis == d[0].questionis) {
                    if(d[0].result==null){d[0].result=[]}
                    d[0].result.push(req.body.mail)
                  }
                }
                Practice.updateOne(
                  { topic: req.body.topic },
                  { $set: { questions: docs1.questions } },
                  function (errr, docs2) {
                    if (!errr) {
                      return res.send({ data: results })
                    } else {
                      console.log(
                        "error while retriving all records:",
                        JSON.stringify(err, undefined, 2)
                      )
                    }
                  }
                )
              }
            })
          }
        } else {
          results.push(
            ` TEST CASE ${v + 1} ` +
            " Sample Input " +
            req.body.question[0][i] +
            " Expected Output " +
            outarr[v] +
            " , Your output " +
            result
          )
          if (results.length == 3) {
            return res.send({ data: results })
          }
        }
      } else {
        if (err) {
          results.push(` TEST CASE ${v + 1} ${err.toString()}`)
          if (results.length == 3) {
            return res.send({ data: results })
          }
        } else {
          results.push(` TEST CASE ${v + 1} No output`)
          if (results.length == 3) {
            return res.send({ data: results })
          }
        }
      }
    })
  }
}

exports.ratingstudent = (req, res) => {
  console.log(req.body.mail, "ended coding test")
  Practice.findOne({ topic: req.body.topic }, function (err, docs1) {
    if (err && docs1 == null) {
      res.send("error")
    } else {
      let mr = []
      docs1.questions.forEach((e) => {
        let rs = e[0].result
        if(rs==null){ rs=[]}
        rs = rs.filter((r) => r == req.body.mail)
        if (rs.length > 0) {
          mr.push(rs[0])
        }
      })
      let marks = mr.length * 10
      req.body.timeremained = parseFloat(req.body.timeremained)
      docs1.totaltime = parseFloat(docs1.totaltime)
      let mrpcal = (marks / docs1.totalmarks) * 95
      let trpcal = (req.body.timeremained / docs1.totaltime) * 5
      let mainrat = mrpcal + trpcal
      if (marks == 0) {
        mainrat = 0
      }
      let mainrating = {
        mail: req.body.mail,
        timeremained: req.body.timeremained,
        timeconsumed: docs1.totaltime - req.body.timeremained,
        marks: marks,
        main: mainrat,
      }

      console.log("rating append\n", mainrating)

      docs1.ratings.push(mainrating)

      Practice.updateOne(
        { topic: req.body.topic },
        { $set: { ratings: docs1.ratings } },
        function (errr, docss) {
          if (!errr) {
            return res.send({ message: "success" })
          } else {
            console.log(
              "error while retriving all records:",
              JSON.stringify(err, undefined, 2)
            )
          }
        }
      )
    }
  })
}

exports.quizratingstudent = (req, res) => {
  Practice.findOne(
    { topic: req.body.topic, type: "quiz" },
    function (err, docs1) {
      if (err && docs1 == null) {
        res.send("error")
      } else {
        if (docs1.ratings != null) {
          let marks = req.body.marks
          req.body.timeremained = parseFloat(req.body.timeremained)
          docs1.totaltime = parseFloat(docs1.totaltime)
          let mrpcal = (marks / docs1.totalmarks) * 95
          let trpcal = (req.body.timeremained / docs1.totaltime) * 5
          let mainrat = mrpcal + trpcal
          if (marks == 0) {
            mainrat = 0
          }
          let mainrating = {
            mail: req.body.mail,
            timeremained: req.body.timeremained,
            timeconsumed: docs1.totaltime - req.body.timeremained,
            marks: marks,
            main: mainrat,
            attemptedquiz: req.body.attemptedquiz,
          }

          docs1.ratings.push(mainrating)

          Practice.updateOne(
            { topic: req.body.topic, type: "quiz" },
            { $set: { ratings: docs1.ratings } },
            function (errr, docss1) {
              if (!errr) {
                return res.send({ message: "success" })
              } else {
                console.log(
                  "error while retriving all records:",
                  JSON.stringify(err, undefined, 2)
                )
              }
            }
          )
        } else {
          console.log(err)
          res.send({ message: "err" })
        }
      }
    }
  )
}

exports.viewattemptedquiz = (req, res) => {
  Practice.findOne(
    { topic: req.body.topic, college_id: req.body.college_id, type: "quiz" },
    (err, datas) => {
      if (err) console.log(err)
      else {
        data = datas.ratings.filter((e) => e.mail == req.body.mail)
        res.send({ data: data[0] })
      }
    }
  )
}
