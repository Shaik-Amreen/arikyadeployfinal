const mongoose = require("mongoose")
const Schema = new mongoose.Schema({
  college_id: { type: "string", required: true },
  topic: { type: "string", required: true },
  questions: { type: "Array", required: true },
  totaltime: { type: "string" },
  totalmarks: { type: "string" },
  ratings: { type: Array },
  startson: { type: "string" },
  endson: { type: "string" },
  type: { type: "String" },
  createdby: { type: "string" },
})

Schema.index({ college_id: 1, topic: 1, type: 1 }, { unique: true })

const codequiz = mongoose.model("codequiz", Schema)

module.exports = codequiz
