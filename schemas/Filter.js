const { Schema, model } = require("mongoose");

// ! [0] - Start Point (Min), [1] - Edge Point (Max)

const filterSchema = new Schema({
  price: [Number],
  tags: [String],
  size: [Number],
});

module.exports = model("Filter", filterSchema);
