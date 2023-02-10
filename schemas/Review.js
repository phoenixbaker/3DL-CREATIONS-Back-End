const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
  by: Schema.Types.ObjectId,
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
  lastEdited: {
    type: Date,
    default: Date.now(),
  },
  rating: Number,
  text: String,
});

module.exports = model("Review", reviewSchema);
