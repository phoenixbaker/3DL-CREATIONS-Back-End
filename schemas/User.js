const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  name: String,
  email: String,
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

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = model("User", userSchema);