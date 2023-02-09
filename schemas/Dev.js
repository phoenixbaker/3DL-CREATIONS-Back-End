const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const devSchema = new Schema({
  name: String,
  email: String,
  dev: Boolean,
  password: String,
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
  lastEdited: {
    type: Date,
    default: Date.now(),
  },
});

devSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = model("Dev", devSchema);
