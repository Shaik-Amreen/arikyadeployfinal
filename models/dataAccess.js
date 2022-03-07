const mongoose = require("mongoose")
const Schema = new mongoose.Schema({
  college_id: { type: "string", unique: "true" },
  collegename: { type: "string", required: true },
  access: { type: "Object", required: true },
  date: { type: "string", required: true },
  mail: { type: "string", required: true },
  adminmails: { type: "Array" },
  type: { type: "string" },
  mailvalidation:{type:"string" , required:true}
})

const collegedata = mongoose.model("collegedata", Schema)
module.exports = collegedata
