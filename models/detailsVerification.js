const mongoose = require("mongoose")
const Schema = new mongoose.Schema({
  rollnumber: {
    type: "string",
    required: true,
    index: { unique: true, dropDups: true },
  },
  mail: {
    type: "string",
    required: true,
    index: { unique: true, dropDups: true },
  },
  fullname: { type: "string", required: true },
  prev: { type: "string", required: true },
  current: { type: "string", required: true },
  field: { type: "string", required: true },
  verified: { type: "string" },
  date: { type: "string", required: true },
  college_id: { type: "string" },
  verifiedby: { type: "string" },
  verifiedbymail: { type: "string" },
})
const detailsverification = mongoose.model("detailsverification", Schema)

module.exports = detailsverification
