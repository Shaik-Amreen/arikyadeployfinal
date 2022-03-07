const mongoose = require("mongoose")
const Schema = new mongoose.Schema({
  code: { type: "string", required: true },
  college_id: { type: "string", required: true },
})
const passcodes = mongoose.model("passcode", Schema)
module.exports = passcodes
