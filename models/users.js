const mongoose = require("mongoose")
const Schema = new mongoose.Schema({
  college_id: { type: "string", required: true },
  mail: {
    type: "string",
    required: true,
    index: { unique: true, dropDups: true },
  },
  password: { type: "string", required: true },
  role: { type: "string", required: true },
  status: { type: "string" },
})
const Users = mongoose.model("User", Schema, "Users")

module.exports = Users
