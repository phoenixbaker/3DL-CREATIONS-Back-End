const router = require("express").Router();
const mongoose = require("mongoose");

const Product = require("../schemas/Product");
const upload = require("../middleware/upload");
const updateFilter = require("../middleware/UpdateFilter");

let conn = mongoose.connection;

router.post("/product/details", updateFilter, async (req, res) => {
  let product = new Product({
    name: req.body.productName,
    price: req.body.productPrice,
    size: req.body.productSize,
    stock: req.body.productStock,
    description: req.body.description,
    tags: req.body.productTags,
    photos_id: req.body.idArr,
  });
  console.log(product);

  product.save();

  res.send(product);
});

conn.once("open", () => {
  router.post("/product", upload.array("ProductPhotos"), async (req, res) => {
    console.log("here");
    let files_id = [];

    for (var i = 0; i < req.files.length; i++) {
      files_id.push(req.files[i].id);
    }
    res.json(files_id);
  });
});

module.exports = router;
