const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  name: String,
  tags: [String],
  description: String,
  price: String,
  size: String,
  stock: String,
  photos_id: [String],
});

module.exports = model("Product", productSchema);
