const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  name: String,
  tags: [String],
  description: String,
  price: String,
  size: String,
  stock: String,
  ratings: {
    avg: {
      type: Number,
      default: 0,
    },
    posted: [Schema.Types.ObjectId],
  },
  photos_id: [String],
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
  lastEdited: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = model("Product", productSchema);
