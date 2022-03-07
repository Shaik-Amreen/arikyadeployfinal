const express = require("express")
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser")
require("./Database/db")
const users = require("./routers/users")
const company = require("./routers/companyDetails")
const data = require("./routers/dataAccess")
const Dashboard = require("./routers/dashboard")
const Notification = require("./routers/notifications")
const Studentdata = require("./routers/studentdata")
const placementStatus = require("./routers/placementStatus")
const facultydetails = require("./routers/facultyData")
const Placement = require("./routers/placementDetails")
const hiringstudent = require("./routers/companyHirings")

const Practice = require("./routers/codeQuiz")

app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: "10000mb" }))
app.use(cookieParser())
app.use(cors())

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
})
app.use("/", users)
app.use("/data", data)
app.use("/Studentdata", Studentdata)
app.use("/company", company)
app.use("/placementstatus", placementStatus)
app.use("/facultydetails", facultydetails)
app.use("/hiringstudent", hiringstudent)
app.use("/Placement", Placement)

app.use("/Practice", Practice)

app.use("/Dashboard", Dashboard)
app.use("/notification", Notification)
const host = '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(host, port, () => console.log("server listened"))
